#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Deployment..."

# 1. Update Backend
echo "📦 Building Backend..."
cd backend
go build -o server main.go
cd ..

# 2. Update Frontend
echo "⚛️ Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 3. Restart Services
echo "🔄 Restarting Backend Service..."
sudo systemctl restart shridharrao-backend

echo "✅ Deployment Successful!"
