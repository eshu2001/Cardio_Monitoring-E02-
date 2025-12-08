#!/bin/bash
set -e

echo "--- Starting Universal Deployment ---"

# Check root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Detect Package Manager
if command -v apt-get &> /dev/null; then
    OS="debian"
    echo "Detected OS: Debian/Ubuntu"
elif command -v yum &> /dev/null; then
    OS="rhel"
    echo "Detected OS: RHEL/CentOS"
else
    echo "Unsupported OS. Manual install required."
    exit 1
fi

# --- 1. System Updates & Dependencies ---
echo "Installing Dependencies..."
if [ "$OS" == "debian" ]; then
    apt update
    apt install -y nginx git curl gnupg build-essential
    
    # Node.js
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt install -y nodejs
    fi

    # MongoDB
    if ! command -v mongod &> /dev/null; then
        apt install -y mongodb || echo "Warning: Check MongoDB install manually"
    fi

elif [ "$OS" == "rhel" ]; then
    yum update -y
    yum install -y nginx git curl
    
    # Node.js
    if ! command -v node &> /dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
        yum install -y nodejs gcc-c++ make
    fi

    # MongoDB (Official Repo)
    if ! command -v mongod &> /dev/null; then
        echo '[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc' > /etc/yum.repos.d/mongodb-org-7.0.repo
        yum install -y mongodb-org || echo "Warning: MongoDB install failed, app may have DB issues."
        systemctl start mongod || true
        systemctl enable mongod || true
    fi
fi

# --- 2. Global Tooling ---
echo "Installing PM2 and Angular CLI..."
npm install -g pm2 @angular/cli

# --- 3. Backend Setup ---
echo "Setting up Backend..."
cd backend
npm install
pm2 start server.js --name "cardio-backend" --update-env || pm2 restart "cardio-backend"
pm2 save
cd ..

# --- 4. Frontend Build ---
echo "Building Frontend..."
cd frontend
npm install
ng build --configuration production
cd ..

# --- 5. NGINX Setup ---
echo "Configuring NGINX..."
# Locations differ by OS
if [ -d "/etc/nginx/sites-available" ]; then
    # Debian/Ubuntu Standard
    cp nginx.conf /etc/nginx/sites-available/default
    # Ensure enabled
    ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
else
    # CentOS/RHEL Standard
    cp nginx.conf /etc/nginx/conf.d/cardio.conf
    # Disable default if exists
    mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak 2>/dev/null || true
    # Make sure nginx.conf includes /etc/nginx/conf.d/*.conf
fi

# Deploy Files
echo "Deploying Files..."
rm -rf /var/www/html/*
mkdir -p /var/www/html
# Find build dir (Angular sometimes uses browser/ subfolder)
BUILD_PATH=$(find frontend/dist -name index.html | xargs dirname)
cp -r $BUILD_PATH/* /var/www/html/

# Fix Permissions (Critical for NGINX/SELinux)
echo "Fixing Permissions..."
chmod -R 755 /var/www/html
# Allow NGINX to read files on CentOS/RHEL (SELinux)
if command -v chcon &> /dev/null; then
    chcon -R -t httpd_sys_content_t /var/www/html
    # Critical: Allow NGINX to proxy to localhost:3000
    setsebool -P httpd_can_network_connect 1 || true
fi

# Restart NGINX
if [ "$OS" == "debian" ]; then
    systemctl restart nginx
else
    systemctl enable nginx
    systemctl restart nginx
fi

echo "--- Deployment Complete! ---"
echo "Check your IP in browser."
