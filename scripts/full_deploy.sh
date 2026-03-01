#!/bin/bash

# ============================================
# Shridhar Rao — Full VPS Deployment Script
# Run on VPS: bash /var/www/shridharrao/scripts/full_deploy.sh
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_DIR="/var/www/shridharrao"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

log() { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; exit 1; }

echo ""
echo "========================================"
echo "🚀 SHRIDHAR RAO — FULL DEPLOYMENT"
echo "========================================"
echo ""

# ──────────────────────────────────────────
# 1. SYSTEM DEPENDENCIES CHECK
# ──────────────────────────────────────────
log "Checking system dependencies..."

# PostgreSQL
if command -v psql &> /dev/null; then
    success "PostgreSQL installed"
else
    log "Installing PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
    success "PostgreSQL installed"
fi

# Redis
if command -v redis-cli &> /dev/null; then
    success "Redis installed"
else
    log "Installing Redis..."
    sudo apt install -y redis-server
    sudo systemctl enable redis-server
    sudo systemctl start redis-server
    success "Redis installed"
fi

# Nginx
if command -v nginx &> /dev/null; then
    success "Nginx installed"
else
    log "Installing Nginx..."
    sudo apt install -y nginx
    sudo systemctl enable nginx
    success "Nginx installed"
fi

# Go
if command -v go &> /dev/null; then
    success "Go installed ($(go version))"
else
    log "Installing Go..."
    wget -q https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
    sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
    rm go1.23.0.linux-amd64.tar.gz
    success "Go installed"
fi
export PATH=$PATH:/usr/local/go/bin

# Node.js
if command -v node &> /dev/null; then
    success "Node.js installed ($(node -v))"
else
    log "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    success "Node.js installed"
fi

# Certbot
if command -v certbot &> /dev/null; then
    success "Certbot installed"
else
    log "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    success "Certbot installed"
fi

# ──────────────────────────────────────────
# 2. ENSURE SERVICES ARE RUNNING
# ──────────────────────────────────────────
log "Ensuring services are running..."

# PostgreSQL
if sudo systemctl is-active --quiet postgresql; then
    success "PostgreSQL running"
else
    sudo systemctl start postgresql
    success "PostgreSQL started"
fi

# Redis
if sudo systemctl is-active --quiet redis-server; then
    success "Redis running"
else
    sudo systemctl start redis-server
    success "Redis started"
fi

# Test Redis connectivity
if redis-cli ping &> /dev/null; then
    success "Redis responding to PING"
else
    warn "Redis not responding — caching will be disabled (non-fatal)"
fi

# ──────────────────────────────────────────
# 3. DATABASE SETUP
# ──────────────────────────────────────────
log "Setting up PostgreSQL database..."

DB_NAME="shridhar_rao"
DB_USER="shridhar_admin"
DB_PASS="9RKVW773SVtfywa3"

# Create database if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || {
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
    log "Database '$DB_NAME' created"
}
success "Database '$DB_NAME' exists"

# Create user if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || {
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
    log "User '$DB_USER' created"
}

# Ensure password is set correctly and grant privileges
sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Grant schema permissions (required for Postgres 15+)
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;" 2>/dev/null || true

success "Database user configured with full privileges"

# ──────────────────────────────────────────
# 4. PULL LATEST CODE
# ──────────────────────────────────────────
log "Pulling latest code from GitHub..."
cd $PROJECT_DIR

if [ -d ".git" ]; then
    # Stash any local changes (like .env) before pulling
    git stash 2>/dev/null || true
    git pull origin main
    git stash pop 2>/dev/null || true
    success "Code pulled from GitHub"
else
    error "Not a git repo at $PROJECT_DIR. Clone it first with: git clone <repo_url> $PROJECT_DIR"
fi

# ──────────────────────────────────────────
# 5. BACKEND .ENV SETUP
# ──────────────────────────────────────────
log "Configuring backend .env..."

cat > "$BACKEND_DIR/.env" << 'ENVFILE'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=shridhar_admin
DB_PASSWORD=9RKVW773SVtfywa3
DB_NAME=shridhar_rao

# Redis Configuration
REDIS_URL=localhost:6379

# Cloudflare R2
R2_ACCOUNT_ID=9996f814bf3ca9cdb8b5c6ca89e6cb73
R2_ACCESS_KEY_ID=7546808e13e8db951c25ba68658d3d04
R2_SECRET_ACCESS_KEY=7195424d7f92c6416dace221944ad3d99d5e518a82c4d720a1a27e63540d9906
R2_BUCKET_NAME=shridhar
R2_PUBLIC_URL=https://pub-7dd3d9aa085c4995b8e96a9de1e1f5f3.r2.dev

# Admin Configuration
ADMIN_SECRET=MITAAN_ALPHA_2026
JWT_SECRET=LQoHPaYiKK6XektLgpYh14BDJGNgwpHCnPvaX4cvMnw=

# CORS - Production origins
ALLOWED_ORIGINS=https://shridharrao.com,https://www.shridharrao.com

# Server Port
PORT=8080
GIN_MODE=release
ENVFILE

success "Backend .env configured with R2 credentials"

# ──────────────────────────────────────────
# 6. FRONTEND .ENV SETUP
# ──────────────────────────────────────────
log "Configuring frontend .env.production..."

cat > "$FRONTEND_DIR/.env.production" << 'ENVFILE'
VITE_API_URL=https://api.shridharrao.com
ENVFILE

success "Frontend .env.production configured"

# ──────────────────────────────────────────
# 7. BUILD BACKEND
# ──────────────────────────────────────────
log "Building Go backend..."
cd $BACKEND_DIR
go build -o server main.go
success "Backend binary built"

# ──────────────────────────────────────────
# 8. BUILD FRONTEND
# ──────────────────────────────────────────
log "Building frontend..."
cd $FRONTEND_DIR
npm install --legacy-peer-deps
npm run build
success "Frontend built"

# ──────────────────────────────────────────
# 9. SYSTEMD SERVICE SETUP
# ──────────────────────────────────────────
log "Configuring systemd service..."

cat > /etc/systemd/system/shridharrao-backend.service << 'SERVICEFILE'
[Unit]
Description=Shridhar Rao Backend Service
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/shridharrao/backend
ExecStart=/var/www/shridharrao/backend/server
Restart=always
RestartSec=5
EnvironmentFile=/var/www/shridharrao/backend/.env

[Install]
WantedBy=multi-user.target
SERVICEFILE

sudo systemctl daemon-reload
sudo systemctl enable shridharrao-backend
sudo systemctl restart shridharrao-backend
sleep 2

if sudo systemctl is-active --quiet shridharrao-backend; then
    success "Backend service running ✓"
else
    warn "Backend service failed to start. Check: sudo journalctl -u shridharrao-backend -n 30"
fi

# ──────────────────────────────────────────
# 10. NGINX CONFIGURATION
# ──────────────────────────────────────────
log "Configuring Nginx..."

# Copy the nginx config
sudo cp "$PROJECT_DIR/scripts/nginx.conf" /etc/nginx/sites-available/shridharrao

# Create symlink if needed
sudo ln -sf /etc/nginx/sites-available/shridharrao /etc/nginx/sites-enabled/shridharrao

# Remove default if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
if sudo nginx -t 2>&1; then
    sudo systemctl reload nginx
    success "Nginx configured and reloaded"
else
    error "Nginx config test failed! Check the config file."
fi

# ──────────────────────────────────────────
# 11. SSL SETUP (Certbot)
# ──────────────────────────────────────────
log "Checking SSL certificates..."

# Check if SSL is already configured for shridharrao.com
if sudo certbot certificates 2>/dev/null | grep -q "shridharrao.com"; then
    success "SSL certificate already exists for shridharrao.com"
else
    warn "No SSL certificate found for shridharrao.com"
    echo ""
    echo "  To set up SSL, make sure DNS A records point to this server, then run:"
    echo "  sudo certbot --nginx -d shridharrao.com -d www.shridharrao.com -d api.shridharrao.com"
    echo ""
fi

# ──────────────────────────────────────────
# 12. FINAL VERIFICATION
# ──────────────────────────────────────────
echo ""
echo "========================================"
echo "📋 DEPLOYMENT VERIFICATION"
echo "========================================"

# Backend health
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/articles 2>/dev/null | grep -q "200"; then
    success "Backend API responding (articles endpoint)"
else
    warn "Backend API not responding on localhost:8080"
fi

# Check R2 config loaded
if sudo journalctl -u shridharrao-backend --no-pager -n 20 2>/dev/null | grep -qi "R2 credentials not"; then
    error "R2 credentials not loaded! Image uploads will fail!"
else
    success "R2 credentials loaded (uploads should work)"
fi

# Frontend dist check
if [ -f "$FRONTEND_DIR/dist/index.html" ]; then
    success "Frontend build exists"
else
    warn "Frontend build missing at $FRONTEND_DIR/dist/"
fi

# Service statuses
echo ""
log "Service statuses:"
echo "  PostgreSQL:  $(sudo systemctl is-active postgresql)"
echo "  Redis:       $(sudo systemctl is-active redis-server)"
echo "  Backend:     $(sudo systemctl is-active shridharrao-backend)"
echo "  Nginx:       $(sudo systemctl is-active nginx)"

echo ""
echo "========================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "🌐 Frontend: http://shridharrao.com"
echo "🔌 API:      http://api.shridharrao.com"
echo ""
echo "📌 REMAINING MANUAL STEPS:"
echo "  1. Add DNS A record for 'api.shridharrao.com' → $(curl -s ifconfig.me 2>/dev/null || echo '187.77.186.134')"
echo "  2. Run SSL: sudo certbot --nginx -d shridharrao.com -d www.shridharrao.com -d api.shridharrao.com"
echo "  3. Test image upload from admin panel"
echo ""
