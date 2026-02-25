#!/bin/bash

# VPS Setup Script for Shridhar Rao Website
# Run this once on your clean Ubuntu VPS

set -e

echo "🛠️ Starting VPS Setup..."

# 1. Update System
sudo apt update && sudo apt upgrade -y

# 2. Install Dependencies
sudo apt install -y nginx git curl postgresql postgresql-contrib redis-server build-essential

# 3. Install Go
if ! command -v go &> /dev/null; then
    echo "🐹 Installing Go..."
    wget https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
    sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
    echo "export PATH=\$PATH:/usr/local/go/bin" >> ~/.bashrc
    source ~/.bashrc
    rm go1.23.0.linux-amd64.tar.gz
fi

# 4. Install Node.js
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 5. Create Directory
sudo mkdir -p /var/www/shridharrao
sudo chown -R $USER:$USER /var/www/shridharrao

# 6. Database Setup (Initial)
echo "🐘 Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE shridhar_rao;" || echo "DB already exists"
sudo -u postgres psql -c "CREATE USER $USER WITH PASSWORD 'your_secure_password';" || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE shridhar_rao TO $USER;"

echo "✅ VPS Setup Complete!"
echo "Please run 'source ~/.bashrc' and then configure your .env file."
