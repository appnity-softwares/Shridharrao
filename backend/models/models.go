package models

type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Username string `json:"username" gorm:"unique;index" validate:"required"`
	Password string `json:"-" validate:"required"` // Hashed password
}

type Article struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Category string `json:"category" gorm:"index" validate:"required"`
	Title    string `json:"title" validate:"required,min=5"`
	Excerpt  string `json:"excerpt" validate:"required"`
	Author   string `json:"author" validate:"required"`
	Date     string `json:"date"`
	ReadTime string `json:"readTime"`
	Image    string `json:"image" validate:"url"`
	Content  string `json:"content" validate:"required"`
	Sidenote string `json:"sidenote"`
	Language string `json:"language" gorm:"default:'en';index" validate:"oneof=en hi"`
}

type Headline struct {
	ID    string `json:"id" gorm:"primaryKey"`
	Title string `json:"title" validate:"required"`
	Time  string `json:"time"`
}

type Perspective struct {
	ID        string `json:"id" gorm:"primaryKey"`
	ArticleID string `json:"articleId" gorm:"index" validate:"required"`
	Name      string `json:"name" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Content   string `json:"content" validate:"required"`
	Date      string `json:"date"`
}

type Photo struct {
	ID          string `json:"id" gorm:"primaryKey"`
	Title       string `json:"title" validate:"required"`
	Category    string `json:"category" gorm:"index"`
	ImageUrl    string `json:"imageUrl" validate:"required,url"`
	Date        string `json:"date"`
	Location    string `json:"location"`
	Description string `json:"description"`
	DispatchId  string `json:"dispatchId" gorm:"index"`
}

type ImpactStat struct {
	ID    string `json:"id" gorm:"primaryKey"`
	Title string `json:"title" validate:"required"`
	Desc  string `json:"desc"`
	Icon  string `json:"icon"` // Store icon name e.g. "Users", "Shield"
	Stats string `json:"stats"`
	Color string `json:"color"`
	Ref   string `json:"ref"`
	Link  string `json:"link"`
}

type GlobalEvent struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Location string `json:"location" gorm:"index"`
	Title    string `json:"title" validate:"required"`
	Desc     string `json:"desc"`
	Date     string `json:"date"`
}

type TimelineItem struct {
	ID    string `json:"id" gorm:"primaryKey"`
	Year  string `json:"year" gorm:"index"`
	Title string `json:"title" validate:"required"`
	Event string `json:"event"`
	RefID string `json:"refId"`
	Image string `json:"image"`
}

type AboutConfig struct {
	ID                string `json:"id" gorm:"primaryKey"`
	Title             string `json:"title"`
	Subtitle          string `json:"subtitle"`
	Quote             string `json:"quote"`
	Image             string `json:"image"`
	Badge             string `json:"badge"`
	Stat1Label        string `json:"stat1Label"`
	Stat1Value        string `json:"stat1Value"`
	Stat2Label        string `json:"stat2Label"`
	Stat2Value        string `json:"stat2Value"`
	Stat3Label        string `json:"stat3Label"`
	Stat3Value        string `json:"stat3Value"`
	Stat4Label        string `json:"stat4Label"`
	Stat4Value        string `json:"stat4Value"`
	ImpactSectionLink string `json:"impactSectionLink"`
	GlobalAnchorsLink string `json:"globalAnchorsLink"`
	GlobalAnchorsText string `json:"globalAnchorsText"`
}

type ContactMessage struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Category string `json:"category"`
	Message  string `json:"message" validate:"required"`
	Date     string `json:"date"`
}

type ArchiveBook struct {
	ID         string `json:"id" gorm:"primaryKey"`
	Title      string `json:"title" validate:"required"`
	Author     string `json:"author" validate:"required"`
	Image      string `json:"image" validate:"url"`
	Reflection string `json:"reflection"` // The "Read Reflection" content
}

type GlobalAnchor struct {
	ID   string `json:"id" gorm:"primaryKey"`
	Name string `json:"name" validate:"required"`
	Icon string `json:"icon"` // Store icon name e.g. "Award", "Globe"
	Link string `json:"link" validate:"url"`
}

type Advertisement struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Title    string `json:"title"`
	ImageUrl string `json:"imageUrl" validate:"required,url"`
	LinkUrl  string `json:"linkUrl" validate:"url"`
	Type     string `json:"type" gorm:"index" validate:"oneof=banner sidebar popup"`
	IsActive bool   `json:"isActive" gorm:"default:true"`
	Position string `json:"position"` // e.g., "left", "right" for sidebar
}

type DonationConfig struct {
	ID            string `json:"id" gorm:"primaryKey"`
	QrCodeUrl     string `json:"qrCodeUrl"`
	UpiId         string `json:"upiId"`
	BankName      string `json:"bankName"`
	AccountName   string `json:"accountName"`
	AccountNumber string `json:"accountNumber"`
	IfscCode      string `json:"ifscCode"`
	SwiftCode     string `json:"swiftCode"`
	Message       string `json:"message"`
}

type AuditLog struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Username  string `json:"username" gorm:"index"`
	Action    string `json:"action"`
	Entity    string `json:"entity"`
	EntityID  string `json:"entityId"`
	IPAddress string `json:"ipAddress"`
	Timestamp string `json:"timestamp" gorm:"index"`
	Details   string `json:"details"`
}
