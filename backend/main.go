package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"shridhar-rao-backend/models"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/secure"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	sredis "github.com/ulule/limiter/v3/drivers/store/redis"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var jwtSecret = []byte("MITAAN_INTERNAL_SECRET_2026") // Fallback

var db *gorm.DB
var rdb *redis.Client
var validate = validator.New()
var s3Client *s3.Client
var r2Bucket string
var r2PublicUrl string

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	// Database Connection
	connectDB()

	// R2 Connection
	connectR2()

	// Redis Connection
	connectRedis()

	// Initialize JWT Secret
	if s := os.Getenv("JWT_SECRET"); s != "" {
		jwtSecret = []byte(s)
	} else if os.Getenv("GIN_MODE") == "release" {
		log.Fatal("JWT_SECRET must be set in release mode")
	}

	// Migrations
	if err := db.AutoMigrate(&models.Article{}, &models.Headline{}, &models.Photo{}, &models.Perspective{}, &models.ImpactStat{}, &models.GlobalEvent{}, &models.TimelineItem{}, &models.AboutConfig{}, &models.ContactMessage{}, &models.ArchiveBook{}, &models.GlobalAnchor{}, &models.Advertisement{}, &models.DonationConfig{}, &models.User{}, &models.AuditLog{}); err != nil {
		log.Printf("Migration failed: %v", err)
	} else {
		log.Println("Migration successful")
	}

	// Create search indexes (after tables exist)
	db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_fulltext ON articles USING gin(to_tsvector('english', title || ' ' || excerpt || ' ' || content))")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_archive_books_fulltext ON archive_books USING gin(to_tsvector('english', title || ' ' || author || ' ' || reflection))")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date DESC)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_contact_messages_date ON contact_messages(date DESC)")

	// Seed data
	seedData()

	r := gin.Default()

	// Security Headers Middleware
	r.Use(secure.New(secure.Config{
		STSSeconds:            63072000, // 2 years
		STSIncludeSubdomains:  true,
		STSPreload:            true,
		FrameDeny:             true,
		ContentTypeNosniff:    true,
		BrowserXssFilter:      true,
		ContentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https://pub-7dd3d9aa085c4995b8e96a9de1e1f5f3.r2.dev " + r2PublicUrl + "; connect-src 'self' https://api.shridharrao.com; frame-ancestors 'none';",
	}))

	// Custom Branding Header
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("X-Developed-By", "Appnity Softwares Pvt. Ltd. (https://appnity.co.in)")
		c.Next()
	})

	// Compression Middleware
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	// Configure CORS
	allowedOrigins := []string{
		"http://localhost:5173",
		"http://localhost:3000",
		"http://127.0.0.1:5173",
		"http://localhost:8080",
		"https://shridharrao.com",
		"https://www.shridharrao.com",
		"http://shridharrao.com",
		"http://www.shridharrao.com",
	}
	if envOrigins := os.Getenv("ALLOWED_ORIGINS"); envOrigins != "" {
		allowedOrigins = append(allowedOrigins, strings.Split(envOrigins, ",")...)
	}

	c := cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Admin-Token"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	r.Use(cors.New(c))

	// Public Routes
	r.GET("/articles", getArticles)
	r.GET("/articles/:id", getArticle)
	r.GET("/headlines", getHeadlines)
	r.GET("/photos", getPhotos)
	r.GET("/impacts", getImpacts)
	r.GET("/global_events", getGlobalEvents)
	r.GET("/timeline", getTimeline)
	r.GET("/about_config", getAboutConfig)
	r.GET("/archive_books", getArchiveBooks)
	r.GET("/archive_books/:id", getArchiveBook)
	r.GET("/global_anchors", getGlobalAnchors)
	r.POST("/contact_messages", createContactMessage) // Public submission
	r.GET("/search", searchAll)
	r.GET("/ads", getAds)
	r.GET("/donation_config", getDonationConfig)
	r.GET("/sitemap.xml", sitemapHandler)

	// Rate limiter for login: 5 requests per minute
	loginRate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  5,
	}
	store, err := sredis.NewStore(rdb)
	if err != nil {
		log.Fatal(err)
	}
	loginLimiter := mgin.NewMiddleware(limiter.New(store, loginRate))

	// Stricter limiter for mutations: 30 requests per minute
	mutationRate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  30,
	}
	mutationLimiter := mgin.NewMiddleware(limiter.New(store, mutationRate))

	r.POST("/admin/login", loginLimiter, loginHandler)
	r.POST("/admin/logout", logoutHandler)
	r.POST("/admin/refresh", refreshHandler)
	r.GET("/admin/verify", authMiddleware(), verifyHandler)

	// Admin / Secured Endpoints
	admin := r.Group("/")
	admin.Use(authMiddleware())
	{
		admin.PUT("/about_config", mutationLimiter, updateAboutConfig)

		admin.GET("/contact_messages", getContactMessages)
		admin.DELETE("/contact_messages/:id", mutationLimiter, deleteContactMessage)
		admin.POST("/upload", mutationLimiter, uploadFile)

		admin.POST("/articles", mutationLimiter, createArticle)
		admin.PUT("/articles/:id", mutationLimiter, updateArticle)
		admin.DELETE("/articles/:id", mutationLimiter, deleteArticle)

		admin.POST("/headlines", mutationLimiter, createHeadline)
		admin.PUT("/headlines/:id", mutationLimiter, updateHeadline)
		admin.DELETE("/headlines/:id", mutationLimiter, deleteHeadline)

		admin.POST("/photos", mutationLimiter, createPhoto)
		admin.PUT("/photos/:id", mutationLimiter, updatePhoto)
		admin.DELETE("/photos/:id", mutationLimiter, deletePhoto)

		admin.POST("/impacts", mutationLimiter, createImpactStat)
		admin.PUT("/impacts/:id", mutationLimiter, updateImpactStat)
		admin.DELETE("/impacts/:id", mutationLimiter, deleteImpactStat)

		admin.POST("/global_events", mutationLimiter, createGlobalEvent)
		admin.PUT("/global_events/:id", mutationLimiter, updateGlobalEvent)
		admin.DELETE("/global_events/:id", mutationLimiter, deleteGlobalEvent)

		admin.POST("/timeline", mutationLimiter, createTimelineItem)
		admin.PUT("/timeline/:id", mutationLimiter, updateTimelineItem)
		admin.DELETE("/timeline/:id", mutationLimiter, deleteTimelineItem)

		admin.POST("/archive_books", mutationLimiter, createArchiveBook)
		admin.PUT("/archive_books/:id", mutationLimiter, updateArchiveBook)
		admin.DELETE("/archive_books/:id", mutationLimiter, deleteArchiveBook)

		admin.POST("/global_anchors", mutationLimiter, createGlobalAnchor)
		admin.PUT("/global_anchors/:id", mutationLimiter, updateGlobalAnchor)
		admin.DELETE("/global_anchors/:id", mutationLimiter, deleteGlobalAnchor)

		admin.DELETE("/perspectives/:id", mutationLimiter, deletePerspective)

		admin.POST("/ads", mutationLimiter, createAd)
		admin.PUT("/ads/:id", mutationLimiter, updateAd)
		admin.DELETE("/ads/:id", mutationLimiter, deleteAd)

		admin.PUT("/donation_config", mutationLimiter, updateDonationConfig)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

func connectDB() {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&TimeZone=Asia/Shanghai",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Failed to connect to Postgres: %v", err)
		log.Fatal("Could not connect to database")
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal(err)
	}

	// Database Connection Pooling
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)


}

func connectR2() {
	accountId := os.Getenv("R2_ACCOUNT_ID")
	accessKeyId := os.Getenv("R2_ACCESS_KEY_ID")
	accessKeySecret := os.Getenv("R2_SECRET_ACCESS_KEY")
	r2Bucket = os.Getenv("R2_BUCKET_NAME")
	r2PublicUrl = os.Getenv("R2_PUBLIC_URL")

	if accountId == "" || accessKeyId == "" || accessKeySecret == "" || r2Bucket == "" {
		log.Println("Warning: R2 credentials not fully set. Uploads will fail.")
		return
	}

	r2Endpoint := fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountId)

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKeyId, accessKeySecret, "")),
		config.WithRegion("auto"),
	)
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	s3Client = s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(r2Endpoint)
	})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("X-Admin-Token")
		if tokenString == "" {
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			return
		}

		// Check if token is blacklisted (logged out)
		if rdb != nil {
			isBlacklisted, _ := rdb.Exists(context.Background(), "blacklist:"+tokenString).Result()
			if isBlacklisted > 0 {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token has been revoked"})
				return
			}
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Set username in context for audit logging
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if username, exists := claims["username"].(string); exists {
				c.Set("username", username)
				c.Set("token", tokenString)
			}
		}

		c.Next()
	}
}

func logAction(c *gin.Context, action string, entity string, entityID string, details string) {
	username, _ := c.Get("username")
	usernameStr := "anonymous"
	if u, ok := username.(string); ok {
		usernameStr = u
	}

	log := models.AuditLog{
		Username:  usernameStr,
		Action:    action,
		Entity:    entity,
		EntityID:  entityID,
		IPAddress: c.ClientIP(),
		Timestamp: time.Now().Format(time.RFC3339),
		Details:   details,
	}
	db.Create(&log)
}

func generateTokens(username string) (string, string, error) {
	// Access Token - Short Lived (15 mins)
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"admin":    true,
		"username": username,
		"exp":      time.Now().Add(time.Minute * 15).Unix(),
	})
	at, err := accessToken.SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	// Refresh Token - Long Lived (7 days)
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"admin":    true,
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
	})
	rt, err := refreshToken.SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	return at, rt, nil
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func loginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var user models.User
	if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication failed"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication failed"})
		return
	}

	at, rt, err := generateTokens(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate tokens"})
		return
	}

	logAction(c, "LOGIN", "User", user.Username, "Successful login attempt")

	// Set Refresh Token in HttpOnly Cookie
	secure := os.Getenv("GIN_MODE") == "release"
	if secure {
		c.SetSameSite(http.SameSiteNoneMode)
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
	}
	c.SetCookie("refresh_token", rt, 60*60*24*7, "/", "", secure, true)

	c.JSON(http.StatusOK, gin.H{"token": at})
}

func verifyHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"authenticated": true})
}

func logoutHandler(c *gin.Context) {
	// Blacklist the current access token if it's in the header
	tokenString := c.GetHeader("Authorization")
	if strings.HasPrefix(tokenString, "Bearer ") {
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		if rdb != nil {
			// Blacklist for 15 mins (expiry of access token)
			rdb.Set(context.Background(), "blacklist:"+tokenString, "revoked", 15*time.Minute)
		}
	}

	logAction(c, "LOGOUT", "User", "", "User logged out")

	c.SetCookie("refresh_token", "", -1, "/", "", os.Getenv("GIN_MODE") == "release", true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

func refreshHandler(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token missing"})
		return
	}

	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}
	username, _ := claims["username"].(string)

	at, rt, err := generateTokens(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate tokens"})
		return
	}

	secure := os.Getenv("GIN_MODE") == "release"
	if secure {
		c.SetSameSite(http.SameSiteNoneMode)
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
	}
	c.SetCookie("refresh_token", rt, 60*60*24*7, "/", "", secure, true)
	c.JSON(http.StatusOK, gin.H{"token": at})
}

// ... bcrypt helper if needed ...
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// --- Timeline ---
func getTimeline(c *gin.Context) {
	items := []models.TimelineItem{}
	db.Find(&items)
	c.JSON(http.StatusOK, items)
}
func createTimelineItem(c *gin.Context) {
	var item models.TimelineItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if item.ID == "" {
		item.ID = "tl-" + item.Year
	}
	db.Create(&item)
	c.JSON(http.StatusCreated, item)
}
func updateTimelineItem(c *gin.Context) {
	var item models.TimelineItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	item.ID = c.Param("id")
	db.Save(&item)
	c.JSON(http.StatusOK, item)
}
func deleteTimelineItem(c *gin.Context) {
	db.Delete(&models.TimelineItem{}, "id = ?", c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- About Config ---
func getAboutConfig(c *gin.Context) {
	var config models.AboutConfig
	result := db.First(&config, "id = ?", "primary")
	if result.Error != nil {
		// Create default if missing
		config = models.AboutConfig{
			ID:         "primary",
			Title:      "Integrity is Non-Negotiable.",
			Subtitle:   "Chief Editor & Strategist",
			Quote:      "For over two decades, I have focused on the silence between the noise.",
			Image:      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
			Badge:      "Chief Editor & Strategist",
			Stat1Label: "Years Experience",
			Stat1Value: "25+",
			Stat2Label: "Global Reports",
			Stat2Value: "2k+",
			Stat3Label: "Readers reached",
			Stat3Value: "10M+",
			Stat4Label: "Awards Won",
			Stat4Value: "15+",
		}
		db.Create(&config)
	}
	c.JSON(http.StatusOK, config)
}

func updateAboutConfig(c *gin.Context) {
	var config models.AboutConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.ID = "primary"
	db.Save(&config)
	c.JSON(http.StatusOK, config)
}

// --- Seed Data ---
// Kept largely the same but adapted checks for Postgres
func seedData() {
	var count int64
	db.Model(&models.Article{}).Count(&count)
	if count == 0 {
		articles := []models.Article{
			{
				ID:       "top-1",
				Category: "Editorial",
				Title:    "The Silent Metamorphosis of Rural Policy",
				Excerpt:  "An investigative look into how subtle legislative shifts are reshaping the agrarian landscape of Central India without public discourse.",
				Author:   "Shridhar Rao",
				Date:     "Jan 12, 2026",
				ReadTime: "12 min",
				Image:    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop",
				Content: `
            <p>The landscape of modern journalism is shifting under our feet. What was once a domain of slow reflection has become an arena of rapid, often unverified dissemination. In this context, the role of the editorial voice becomes not just to report, but to anchor.</p>
            <p>I have spent the better part of three decades observing these patterns. From the small printing presses in local districts to the expansive digital newsrooms of the capital, the essence of the story remains constant: human resilience against systemic odds.</p>
            <h2>The Core of the Investigation</h2>
            <p>When we look at national shifts—economic, political, or social—we must ask ourselves who is telling the story, and why. Integrity is not merely a value; it is a discipline. It requires us to pause, even when the world is rushing forward.</p>
            <p>This deep-dive is an invitation to consider the silent metamorphosis of our policies. It is a call to look beyond the headlines and into the fine print of our governance, where the true future of the nation is being written.</p>
        `,
				Sidenote: "A critical observation from the 2026 Editorial Summit regarding decentralized journalism.",
			},
			{
				ID:       "art-2",
				Category: "Archive",
				Title:    "The Decade of Decentralization",
				Excerpt:  "Looking back at the structural shifts between 2014 and 2024.",
				Author:   "Shridhar Rao",
				Date:     "Dec 20, 2024",
				ReadTime: "20 min",
				Image:    "https://images.unsplash.com/photo-1540304647900-530962325c13?q=80&w=2070&auto=format&fit=crop",
				Content:  "<p>Historical archive content...</p>",
				Sidenote: "First published in the 2014 Decade Series.",
			},
			{
				ID:       "op-1",
				Category: "Opinion",
				Title:    "The Ethics of Digital Silence",
				Excerpt:  "In a world that shouts, silence is often the most profound statement. Exploring the moral weight of what we choose not to voice.",
				Author:   "Shridhar Rao",
				Date:     "Jan 18, 2026",
				ReadTime: "8 min",
				Image:    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
				Content:  "<p>The digital age has created an obligation to be heard. But there is a power in choosing when to speak and when to listen...</p>",
				Sidenote: "Hyper-local is the new global. Trust begins at the district level.",
			},
			{
				ID:       "ed-1",
				Category: "Editorial",
				Title:    "National Shifts: The Quiet Power of Policy",
				Excerpt:  "An in-depth look at how subtle changes in legislative language are reshaping the national landscape.",
				Author:   "Shridhar Rao",
				Date:     "Jan 12, 2026",
				ReadTime: "12 min",
				Image:    "https://images.unsplash.com/photo-1540575861501-7ad058a6923b?q=80&w=2070&auto=format&fit=crop",
				Content:  "<p>Content for national shifts...</p>",
				Sidenote: "Policy is the invisible architecture of our lives.",
			},
			{
				ID:       "st-1",
				Category: "Story",
				Title:    "The Silk Weaver of Kashi",
				Excerpt:  "Behind every loom is a story of three generations. A report on craftsmanship in a digital age.",
				Author:   "Shridhar Rao",
				Date:     "Jan 2, 2026",
				ReadTime: "15 min",
				Image:    "https://images.unsplash.com/photo-1621318164979-373302ca2199?q=80&w=2070&auto=format&fit=crop",
				Content:  "<p>Human narrative on Kashi weavers...</p>",
				Sidenote: "Craft is the soul of a civilization.",
			},
			{
				ID:       "ar-1",
				Category: "Archive",
				Title:    "The 2004 Tsunami: A Decade of Resilience",
				Excerpt:  "Looking back at the reporting from the frontlines of the coastal disaster that reshaped regional safety protocols.",
				Author:   "Shridhar Rao",
				Date:     "Dec 26, 2024",
				ReadTime: "20 min",
				Image:    "https://images.unsplash.com/photo-1540304647900-530962325c13?q=80&w=2070&auto=format&fit=crop",
				Content:  "<p>Historical archive content...</p>",
				Sidenote: "First published in the 2014 Decade Series.",
			},
			{
				ID:       "ar-2",
				Category: "Archive",
				Title:    "Economic Liberalization: 30 Years Later",
				Excerpt:  "An analytical archive piece on the long-term effects of the 1991 reforms on India's middle class.",
				Author:   "Shridhar Rao",
				Date:     "July 24, 2021",
				ReadTime: "25 min",
				Image:    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop",
				Content:  "<p>Economic archive content...</p>",
				Sidenote: "Winner of the National Journalism Award 2021.",
			},
		}
		db.Create(&articles)
	}

	var hCount int64
	db.Model(&models.Headline{}).Count(&hCount)
	if hCount == 0 {
		headlines := []models.Headline{
			{ID: "op-1", Title: "The Ethics of Information Flow", Time: "2h"},
			{ID: "top-1", Title: "Rural Governance: The Silent Crisis", Time: "5h"},
			{ID: "ed-1", Title: "Fiscal Integrity in Digital Era", Time: "8h"},
			{ID: "st-1", Title: "Culture: The Last Threads of Tradition", Time: "12h"},
			{ID: "hl-5", Title: "Breaking: New Environmental Policy Introduced", Time: "15m"},
			{ID: "hl-6", Title: "Tech Giants Face New Regulatory Hurdles", Time: "1h"},
		}
		db.Create(&headlines)
	}

	var pCount int64
	db.Model(&models.Photo{}).Count(&pCount)
	if pCount == 0 {
		photos := []models.Photo{
			{ID: "1", Title: "National Editorial Summit", Category: "Events", ImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop", Date: "Dec 15, 2025", Location: "New Delhi", DispatchId: "REF-2025-015/EV", Description: "Address on the future of independent journalism. Focus on decentralized editorial nodes."},
			{ID: "2", Title: "Rural Impact Field Study", Category: "Field", ImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop", Date: "Dec 10, 2025", Location: "Chhattisgarh", DispatchId: "REF-2025-010/FD", Description: "Documentation of the ground realities in Central Indian villages. Observation of local administrative friction."},
			{ID: "3", Title: "The Ethics Roundtable", Category: "Events", ImageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop", Date: "Nov 28, 2025", Location: "Mumbai", DispatchId: "REF-2025-028/EV", Description: "A discussion with policy makers on digital ethics. Tension between state oversight and press freedom."},
			{ID: "6", Title: "Bastar Forest Investigation", Category: "Field", ImageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop", Date: "Nov 05, 2025", Location: "Bastar", DispatchId: "REF-2025-005/FD", Description: "Exploring the ecological shifts in the heart of the forest. Interaction with local environmental nodes."},
			{ID: "7", Title: "The Press Gallery", Category: "Studio", ImageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop", Date: "Oct 25, 2025", Location: "Parliament House", DispatchId: "REF-2025-025/ST", Description: "A moment of observation from the press gallery. Recording the legislative pulse."},
			{ID: "8", Title: "Metropolitan Shift", Category: "Coverage", ImageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop", Date: "Oct 12, 2025", Location: "New York", DispatchId: "REF-2025-012/CV", Description: "Global editorial meeting for the Truth Initiative. Coordination of cross-border narratives."},
		}
		db.Create(&photos)
	}

	var iCount int64
	db.Model(&models.ImpactStat{}).Count(&iCount)
	if iCount == 0 {
		impacts := []models.ImpactStat{
			{ID: "1", Title: "Deep Analysis", Desc: "Deep-dive analysis on national shifts", Icon: "Target", Stats: "Editorial", Color: "bg-primary", Ref: "ARCH-201", Link: "/journal/top-1"},
			{ID: "2", Title: "My Views", Desc: "Personal takes on everyday ethics", Icon: "Shield", Stats: "Opinion", Color: "bg-accent", Ref: "ARCH-202", Link: "/journal/op-1"},
			{ID: "3", Title: "True Stories", Desc: "The human element of journalism", Icon: "Users", Stats: "Story", Color: "bg-secondary", Ref: "ARCH-203", Link: "/journal/st-1"},
			{ID: "4", Title: "Past Work", Desc: "A collection of past reporting", Icon: "Bookmark", Stats: "Archive", Color: "bg-primary", Ref: "ARCH-204", Link: "/journal/ar-1"},
			{ID: "5", Title: "Books", Desc: "Reflections on foundational texts", Icon: "BookOpen", Stats: "Library", Color: "bg-accent", Ref: "ARCH-205", Link: "/reflection/bk-2"},
		}
		db.Create(&impacts)
	}

	var gCount int64
	db.Model(&models.GlobalEvent{}).Count(&gCount)
	if gCount == 0 {
		events := []models.GlobalEvent{
			{ID: "1", Location: "Geneva", Title: "Media Ethics Summit", Desc: "Global press gathering on ethics.", Date: "Aug 2025"},
			{ID: "2", Location: "D.C.", Title: "Digital Truth Forum", Desc: "Keynote on info decentralization.", Date: "June 2025"},
			{ID: "3", Location: "Tokyo", Title: "Governance Roundtable", Desc: "Advisor on fiscal transparency.", Date: "April 2025"},
			{ID: "4", Location: "London", Title: "Press Freedom Day", Desc: "Panel on grassroots safety.", Date: "May 2025"},
		}
		db.Create(&events)
	}

	var perspCount int64
	db.Model(&models.Perspective{}).Count(&perspCount)
	if perspCount == 0 {
		perspectives := []models.Perspective{
			{ID: "p1", Name: "Karan Johar", Email: "karan@example.com", Content: "A very insightful article on rural policy. I appreciate the depth of investigation.", ArticleID: "top-1", Date: "2024-01-15"},
			{ID: "p2", Name: "Meera Nair", Email: "meera@example.com", Content: "The silence ethics piece resonated deeply. We need more such philosophical takes in mainstream media.", ArticleID: "op-1", Date: "2024-01-20"},
		}
		db.Create(&perspectives)
	}
	var timelineCount int64
	db.Model(&models.TimelineItem{}).Count(&timelineCount)
	if timelineCount == 0 {
		timeline := []models.TimelineItem{
			{
				ID: "tl-1999", Year: "1999", Title: "The First Spark",
				Event: "Initiated investigative desk at a regional daily in North India.",
				RefID: "top-1", Image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
			},
			{
				ID: "tl-2005", Year: "2005", Title: "National Recognition",
				Event: "Awarded for exposing systemic rural inefficiencies in the heartland.",
				RefID: "ed-1", Image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop",
			},
			{
				ID: "tl-2012", Year: "2012", Title: "Mitaan Foundations",
				Event: "Founded the Mitaan Editorial Collective to empower grassroots voices.",
				RefID: "st-1", Image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
			},
			{
				ID: "tl-2018", Year: "2018", Title: "Intellectual Impact",
				Event: "Published 'Truth in the Digital Dust'—an essential text for the digital age.",
				RefID: "op-1", Image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop",
			},
			{
				ID: "tl-2024", Year: "2024", Title: "Statesman in Media",
				Event: "Recipient of the National Excellence in Media for lifetime integrity.",
				RefID: "top-1", Image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
			},
		}
		db.Create(&timeline)
	}

	var bCount int64
	db.Model(&models.ArchiveBook{}).Count(&bCount)
	if bCount == 0 {
		books := []models.ArchiveBook{
			{ID: "bk-1", Title: "Surveillance Capitalism", Author: "SHOSHANA ZUBOFF", Image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop", Reflection: "A definitive look at the new economic order."},
			{ID: "bk-2", Title: "Truth in Digital Dust", Author: "SHRIDHAR RAO", Image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop", Reflection: "My personal exploration of journalistic integrity in the digital era."},
			{ID: "bk-3", Title: "Amusing to Death", Author: "NEIL POSTMAN", Image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1974&auto=format&fit=crop", Reflection: "A classic warning about the medium being the message."},
			{ID: "bk-4", Title: "The Death of Truth", Author: "MICHIKO KAKUTANI", Image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop", Reflection: "How we became at odds with facts and common logic."},
		}
		db.Create(&books)
	}

	var anchorCount int64
	db.Model(&models.GlobalAnchor{}).Count(&anchorCount)
	if anchorCount == 0 {
		anchors := []models.GlobalAnchor{
			{ID: "anch-1", Name: "Global Investigative Network", Icon: "Globe", Link: "https://gijn.org"},
			{ID: "anch-2", Name: "Journalism Excellence Award", Icon: "Award", Link: "https://www.pulitzer.org"},
			{ID: "anch-3", Name: "Digital Rights Watch", Icon: "Shield", Link: "https://www.eff.org"},
			{ID: "anch-4", Name: "Media Ethics Council", Icon: "Zap", Link: "https://www.spj.org"},
		}
		db.Create(&anchors)
	}

	// Seed Advertisement
	var adCount int64
	db.Model(&models.Advertisement{}).Count(&adCount)
	if adCount == 0 {
		ads := []models.Advertisement{
			{ID: "ad-1", Title: "Premium Journalism Workshop", ImageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070", LinkUrl: "https://appnity.co.in", Type: "banner", IsActive: true},
			{ID: "ad-2", Title: "Truth Initiative", ImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070", LinkUrl: "https://appnity.co.in", Type: "sidebar", Position: "right", IsActive: true},
			{ID: "ad-3", Title: "Join our Community", ImageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070", LinkUrl: "https://appnity.co.in", Type: "popup", IsActive: true},
		}
		db.Create(&ads)
	}

	// Seed Donation Config
	var donCount int64
	db.Model(&models.DonationConfig{}).Count(&donCount)
	if donCount == 0 {
		don := models.DonationConfig{
			ID:            "primary",
			QrCodeUrl:     "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=shridharrao@upi&pn=Shridhar%20Rao&am=0&cu=INR",
			UpiId:         "shridharrao@upi",
			BankName:      "State Bank of India",
			AccountName:   "Shridhar Rao",
			AccountNumber: "1234567890",
			IfscCode:      "SBIN0001234",
			Message:       "Your support helps us maintain journalistic integrity and continue our field investigations in remote areas.",
		}
		db.Create(&don)
	}

	// Seed Admin User
	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		adminSecret := os.Getenv("ADMIN_SECRET")
		if adminSecret == "" {
			adminSecret = "MITAAN_ALPHA_2026"
		}
		hashed, _ := hashPassword(adminSecret)
		db.Create(&models.User{
			Username: "admin",
			Password: hashed,
		})
		log.Println("Admin user seeded.")
	}
}

// Handlers

// --- Articles ---
func createArticle(c *gin.Context) {
	var article models.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Simple ID generation if not provided (could use UUID)
	if article.ID == "" {
		article.ID = "auto-" + strings.ToLower(strings.ReplaceAll(article.Title, " ", "-"))
	}
	result := db.Create(&article)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	logAction(c, "CREATE", "Article", article.ID, article.Title)
	c.JSON(http.StatusCreated, article)
}

func updateArticle(c *gin.Context) {
	var article models.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id := c.Param("id")
	article.ID = id
	if result := db.Save(&article); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	logAction(c, "UPDATE", "Article", id, article.Title)
	c.JSON(http.StatusOK, article)
}

func deleteArticle(c *gin.Context) {
	id := c.Param("id")
	if result := db.Delete(&models.Article{}, "id = ?", id); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	logAction(c, "DELETE", "Article", id, "")
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Headlines ---
func createHeadline(c *gin.Context) {
	var h models.Headline
	if err := c.ShouldBindJSON(&h); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if h.ID == "" {
		h.ID = "hl-" + h.Time
	}
	db.Create(&h)
	logAction(c, "CREATE", "Headline", h.ID, h.Title)
	c.JSON(http.StatusCreated, h)
}
func updateHeadline(c *gin.Context) {
	var h models.Headline
	if err := c.ShouldBindJSON(&h); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.ID = c.Param("id")
	db.Save(&h)
	logAction(c, "UPDATE", "Headline", h.ID, h.Title)
	c.JSON(http.StatusOK, h)
}
func deleteHeadline(c *gin.Context) {
	id := c.Param("id")
	db.Delete(&models.Headline{}, "id = ?", id)
	logAction(c, "DELETE", "Headline", id, "")
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Photos ---
func createPhoto(c *gin.Context) {
	var p models.Photo
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if p.ID == "" {
		p.ID = "ph-" + p.DispatchId
	}
	db.Create(&p)
	c.JSON(http.StatusCreated, p)
}

func updatePhoto(c *gin.Context) {
	var p models.Photo
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	p.ID = c.Param("id")
	db.Save(&p)
	c.JSON(http.StatusOK, p)
}

func deletePhoto(c *gin.Context) {
	db.Delete(&models.Photo{}, "id = ?", c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Impacts ---
func getImpacts(c *gin.Context) {
	impacts := []models.ImpactStat{}
	db.Find(&impacts)
	c.JSON(http.StatusOK, impacts)
}
func createImpactStat(c *gin.Context) {
	var i models.ImpactStat
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if i.ID == "" {
		i.ID = "imp-" + i.Ref
	}
	db.Create(&i)
	c.JSON(http.StatusCreated, i)
}
func updateImpactStat(c *gin.Context) {
	var i models.ImpactStat
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	i.ID = c.Param("id")
	db.Save(&i)
	c.JSON(http.StatusOK, i)
}
func deleteImpactStat(c *gin.Context) {
	db.Delete(&models.ImpactStat{}, "id = ?", c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Global Events ---
func getGlobalEvents(c *gin.Context) {
	events := []models.GlobalEvent{}
	db.Find(&events)
	c.JSON(http.StatusOK, events)
}
func createGlobalEvent(c *gin.Context) {
	var e models.GlobalEvent
	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if e.ID == "" {
		e.ID = "evt-" + e.Location
	}
	db.Create(&e)
	c.JSON(http.StatusCreated, e)
}
func updateGlobalEvent(c *gin.Context) {
	var e models.GlobalEvent
	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	e.ID = c.Param("id")
	db.Save(&e)
	c.JSON(http.StatusOK, e)
}
func deleteGlobalEvent(c *gin.Context) {
	db.Delete(&models.GlobalEvent{}, "id = ?", c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Perspectives ---
func createPerspective(c *gin.Context) {
	var p models.Perspective
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if p.ID == "" {
		p.ID = "persp-" + strings.ReplaceAll(p.Name, " ", "-") + "-" + p.ArticleID
	}
	if p.Date == "" {
		p.Date = time.Now().Format("2006-01-02")
	}
	db.Create(&p)
	c.JSON(http.StatusCreated, p)
}

func getPerspectives(c *gin.Context) {
	perspectives := []models.Perspective{}
	if result := db.Find(&perspectives); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, perspectives)
}

func deletePerspective(c *gin.Context) {
	id := c.Param("id")
	if result := db.Delete(&models.Perspective{}, "id = ?", id); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Contact Messages ---
func getContactMessages(c *gin.Context) {
	messages := []models.ContactMessage{}
	db.Find(&messages)
	c.JSON(http.StatusOK, messages)
}

func createContactMessage(c *gin.Context) {
	var msg models.ContactMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	msg.Date = time.Now().Format("2006-01-02 15:04:05")
	db.Create(&msg)
	c.JSON(http.StatusCreated, msg)
}

func deleteContactMessage(c *gin.Context) {
	db.Delete(&models.ContactMessage{}, "id = ?", c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

func getArticles(c *gin.Context) {
	category := c.Query("category")
	lang := c.Query("lang")
	articles := []models.Article{}

	query := db
	if category != "" {
		query = query.Where("LOWER(category) = ?", strings.ToLower(category))
	}
	if lang != "" {
		query = query.Where("language = ?", lang)
	}

	result := query.Find(&articles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, articles)
}

func getArticle(c *gin.Context) {
	id := c.Param("id")
	var article models.Article
	if result := db.First(&article, "id = ?", id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}
	c.JSON(http.StatusOK, article)
}

func getHeadlines(c *gin.Context) {
	headlines := []models.Headline{}
	result := db.Find(&headlines)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, headlines)
}

func getPhotos(c *gin.Context) {
	photos := []models.Photo{}
	result := db.Find(&photos)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, photos)
}

func uploadFile(c *gin.Context) {
	if s3Client == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "R2 storage not configured"})
		return
	}

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer file.Close()

	// 1. Validate File Size (Max 10MB)
	if header.Size > 10*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File too large (max 10MB)"})
		return
	}

	// 2. Validate File Type
	allowedTypes := map[string]bool{
		"image/jpeg":      true,
		"image/png":       true,
		"image/webp":      true,
		"image/gif":       true,
		"application/pdf": true,
	}
	contentType := header.Header.Get("Content-Type")
	if !allowedTypes[contentType] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Allowed: JPG, PNG, WEBP, GIF, PDF"})
		return
	}

	// Generate unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	// Upload to R2
	_, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(r2Bucket),
		Key:         aws.String(filename),
		Body:        file,
		ContentType: aws.String(header.Header.Get("Content-Type")),
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to R2: " + err.Error()})
		return
	}

	// Return R2 Public URL (Requires Custom Domain or Public Bucket Access)
	// If using Cloudflare Custom Domain for R2:
	url := r2PublicUrl + "/" + filename
	if r2PublicUrl == "" {
		// Fallback if not set, though it likely won't work well without a public domain
		url = fmt.Sprintf("https://%s.r2.cloudflarestorage.com/%s", os.Getenv("R2_ACCOUNT_ID"), filename)
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}

// --- Archive Books ---
func getArchiveBooks(c *gin.Context) {
	books := []models.ArchiveBook{}
	db.Find(&books)
	c.JSON(http.StatusOK, books)
}
func getArchiveBook(c *gin.Context) {
	var book models.ArchiveBook
	id := c.Param("id")
	if result := db.First(&book, "id = ?", id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	c.JSON(http.StatusOK, book)
}
func createArchiveBook(c *gin.Context) {
	var book models.ArchiveBook
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if book.ID == "" {
		book.ID = "bk-" + strings.ToLower(strings.ReplaceAll(book.Title, " ", "-"))
	}
	db.Create(&book)
	logAction(c, "CREATE", "ArchiveBook", book.ID, book.Title)
	c.JSON(http.StatusCreated, book)
}
func updateArchiveBook(c *gin.Context) {
	var book models.ArchiveBook
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	book.ID = c.Param("id")
	db.Save(&book)
	logAction(c, "UPDATE", "ArchiveBook", book.ID, book.Title)
	c.JSON(http.StatusOK, book)
}
func deleteArchiveBook(c *gin.Context) {
	id := c.Param("id")
	db.Delete(&models.ArchiveBook{}, "id = ?", id)
	logAction(c, "DELETE", "ArchiveBook", id, "")
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Global Anchors ---
func getGlobalAnchors(c *gin.Context) {
	anchors := []models.GlobalAnchor{}
	db.Find(&anchors)
	c.JSON(http.StatusOK, anchors)
}

func createGlobalAnchor(c *gin.Context) {
	var anchor models.GlobalAnchor
	if err := c.ShouldBindJSON(&anchor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if anchor.ID == "" {
		anchor.ID = "anch-" + strings.ToLower(strings.ReplaceAll(anchor.Name, " ", "-"))
	}
	db.Create(&anchor)
	c.JSON(http.StatusCreated, anchor)
}

func updateGlobalAnchor(c *gin.Context) {
	var anchor models.GlobalAnchor
	if err := c.ShouldBindJSON(&anchor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	anchor.ID = c.Param("id")
	db.Save(&anchor)
	c.JSON(http.StatusOK, anchor)
}

func deleteGlobalAnchor(c *gin.Context) {
	db.Delete(&models.GlobalAnchor{}, "id = ?", c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Search ---
func searchAll(c *gin.Context) {
	q := c.Query("q")
	lang := c.Query("lang")
	if q == "" {
		c.JSON(http.StatusOK, gin.H{"articles": []models.Article{}, "books": []models.ArchiveBook{}})
		return
	}

	cacheKey := fmt.Sprintf("search:%s:%s", q, lang)
	if rdb != nil {
		if val, err := rdb.Get(context.Background(), cacheKey).Result(); err == nil {
			c.Header("X-Cache", "HIT")
			c.Data(http.StatusOK, "application/json", []byte(val))
			return
		}
	}

	articles := []models.Article{}
	books := []models.ArchiveBook{}

	// Use Full-Text Search with Index
	articleQuery := db.Where("to_tsvector('english', title || ' ' || excerpt || ' ' || content) @@ plainto_tsquery('english', ?)", q)
	if lang != "" {
		articleQuery = articleQuery.Where("language = ?", lang)
	}
	articleQuery.Find(&articles)

	db.Where("to_tsvector('english', title || ' ' || author || ' ' || reflection) @@ plainto_tsquery('english', ?)", q).Find(&books)

	res := gin.H{
		"articles": articles,
		"books":    books,
	}

	if rdb != nil {
		if jsonBytes, err := json.Marshal(res); err == nil {
			rdb.Set(context.Background(), cacheKey, jsonBytes, 10*time.Minute)
		}
	}

	c.Header("X-Cache", "MISS")
	c.JSON(http.StatusOK, res)
}

func connectRedis() {
	addr := os.Getenv("REDIS_URL")
	if addr == "" {
		addr = "localhost:6379"
	}
	rdb = redis.NewClient(&redis.Options{
		Addr: addr,
	})
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Println("Redis not reachable, caching disabled")
		rdb = nil
	}
}

// --- Sitemap ---
func sitemapHandler(c *gin.Context) {
	articles := []models.Article{}
	db.Select("id").Find(&articles)

	books := []models.ArchiveBook{}
	db.Select("id").Find(&books)

	xml := `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://shridharrao.com</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://shridharrao.com/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://shridharrao.com/journal</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://shridharrao.com/gallery</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://shridharrao.com/intellectual-archive</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
`

	for _, a := range articles {
		xml += fmt.Sprintf(`    <url>
        <loc>https://shridharrao.com/journal/%s</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
`, a.ID)
	}

	for _, b := range books {
		xml += fmt.Sprintf(`    <url>
        <loc>https://shridharrao.com/reflection/%s</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
`, b.ID)
	}

	xml += `</urlset>`

	c.Data(http.StatusOK, "application/xml", []byte(xml))
}

// --- Advertisements ---
func getAds(c *gin.Context) {
	ads := []models.Advertisement{}
	db.Where("is_active = ?", true).Find(&ads)
	c.JSON(http.StatusOK, ads)
}

func createAd(c *gin.Context) {
	var ad models.Advertisement
	if err := c.ShouldBindJSON(&ad); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if ad.ID == "" {
		ad.ID = fmt.Sprintf("ad-%d", time.Now().Unix())
	}
	db.Create(&ad)
	c.JSON(http.StatusCreated, ad)
}

func updateAd(c *gin.Context) {
	var ad models.Advertisement
	if err := c.ShouldBindJSON(&ad); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ad.ID = c.Param("id")
	db.Save(&ad)
	c.JSON(http.StatusOK, ad)
}

func deleteAd(c *gin.Context) {
	db.Delete(&models.Advertisement{}, "id = ?", c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// --- Donation Config ---
func getDonationConfig(c *gin.Context) {
	var config models.DonationConfig
	result := db.First(&config, "id = ?", "primary")
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Donation config not found"})
		return
	}
	c.JSON(http.StatusOK, config)
}

func updateDonationConfig(c *gin.Context) {
	var config models.DonationConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.ID = "primary"
	db.Save(&config)
	c.JSON(http.StatusOK, config)
}
