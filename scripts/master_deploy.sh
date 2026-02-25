#!/bin/bash

# Shridhar Rao - Master VPS Deployment Script
# This script performs a full system setup, database configuration, and initial deployment.

set -e

# Configurable Variables
DB_NAME="shridhar_rao"
DB_USER="shridhar_admin"
DB_PASS=$(openssl rand -base64 12) # Generates a random secure password
PROJECT_DIR="/var/www/shridharrao"
REPO_URL="https://github.com/appnity-softwares/Shridharrao.git"

echo "🚀 Starting Master Deployment..."

# 1. System Updates & Dependencies
echo "📦 Installing System Dependencies..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl postgresql postgresql-contrib redis-server build-essential certbot python3-certbot-nginx

# 2. Install Go (1.23+)
if ! command -v go &> /dev/null; then
    echo "🐹 Installing Go..."
    wget https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
    sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
fi

# 3. Install Node.js (v20)
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 4. Project Directory & Clone
echo "📂 Setting up Project Directory..."
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
if [ -d "$PROJECT_DIR/.git" ]; then
    cd $PROJECT_DIR
    git pull origin main
else
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 5. Database Setup
echo "🐘 Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "DB already exists"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || echo "User already exists"
sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# 6. Setup Environment File
echo "📝 Creating .env file..."
cat <<EOF > backend/.env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_NAME=$DB_NAME

# Redis Configuration
REDIS_URL=localhost:6379

# Cloudflare R2 (MANUAL ENTRY REQUIRED)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Admin Configuration
ADMIN_SECRET=MITAAN_ALPHA_2026
JWT_SECRET=$(openssl rand -base64 32)

# Server Port
PORT=8080
GIN_MODE=release
EOF

# 7. Initial Build & Service Setup
echo "🏗️ Building Backend..."
cd backend
go build -o server main.go
cd ..

echo "⚛️ Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 8. Setup Systemd Service
echo "⚙️ Configuring Systemd Service..."
sudo cp scripts/shridharrao-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable shridharrao-backend
sudo systemctl restart shridharrao-backend

# 9. Configure Nginx
echo "🌐 Configuring Nginx..."
sudo cp scripts/nginx.conf /etc/nginx/sites-available/shridharrao
if [ ! -f "/etc/nginx/sites-enabled/shridharrao" ]; then
    sudo ln -s /etc/nginx/sites-available/shridharrao /etc/nginx/sites-enabled/
fi
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "--------------------------------------------------------"
echo "✅ INITIAL DEPLOYMENT COMPLETE!"
echo "--------------------------------------------------------"
echo "📍 Database Password: $DB_PASS"
echo "📍 Project Location: $PROJECT_DIR"
echo ""
echo "NEXT STEPS:"
echo "1. Run 'cd $PROJECT_DIR/backend && nano .env' to add your R2 credentials."
echo "2. Point your Domain DNS (A Record) to this VPS IP: $(curl -s ifconfig.me)"
echo "3. Once DNS propagates, run 'sudo certbot --nginx -d shridharrao.com -d www.shridharrao.com' for SSL."
echo "--------------------------------------------------------"
