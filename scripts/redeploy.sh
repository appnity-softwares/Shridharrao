#!/bin/bash

# Shridhar Rao - Manual Redeploy Script
# Use this if GitHub CI/CD is not working or for testing changes locally on VPS.

set -e

PROJECT_DIR="/var/www/shridharrao"

echo "🔄 Starting Manual Redeploy..."

cd $PROJECT_DIR

# 1. Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# 2. Rebuild Backend
echo "📦 Rebuilding Backend..."
cd backend
go build -o server main.go
cd ..

# 3. Rebuild Frontend
echo "⚛️ Rebuilding Frontend..."
cd frontend
npm install
npm run build
cd ..

# 4. Restart Services
echo "🔄 Restarting Backend Service..."
sudo systemctl restart shridharrao-backend

echo "🌐 Clearing Nginx Cache (Optional)..."
sudo systemctl reload nginx

echo "✅ Redeployment Successful!"
