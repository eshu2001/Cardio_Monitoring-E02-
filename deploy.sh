#!/bin/bash
set -e

echo "--- Starting Deployment ---"

# 1. Update System
echo "Updating system..."
sudo apt update
sudo apt install -y nginx git curl gnupg build-essential

# 2. Install MongoDB (if not already installed)
if ! command -v mongod &> /dev/null; then
    echo "Installing MongoDB..."
    sudo apt install -y mongodb
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
fi

# 3. Install Node.js (v20)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 4. Install Global Tools
echo "Installing PM2 and Angular CLI..."
sudo npm install -g pm2 @angular/cli

# 5. Setup Backend
echo "Setting up Backend..."
cd backend
npm install
# Start Backend with PM2
pm2 start server.js --name "cardio-backend" --update-env || pm2 restart "cardio-backend"
pm2 save
cd ..

# 6. Setup Frontend
echo "Building Frontend..."
cd frontend
npm install
# Build for production
ng build --configuration production

# 7. Deploy to NGINX
echo "Deploying to NGINX..."
# Clear old files
sudo rm -rf /var/www/html/*
# Copy new files (Handle potential 'browser' subdirectory in newer Angular)
BUILD_PATH=$(find dist -name index.html | xargs dirname)
sudo cp -r $BUILD_PATH/* /var/www/html/

# 8. Configure NGINX
echo "Configuring NGINX..."
cd ..
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl restart nginx

echo "--- Deployment Complete! ---"
echo "Visit http://$(curl -s ifconfig.me) to see your app."
