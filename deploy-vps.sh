#!/bin/bash
# Kinetik UI Instagram Automation - VPS Deployment Script
# VPS: 46.62.209.17 (user: deploy)

set -e

echo "🚀 Deploying Kinetik UI Instagram Automation to VPS..."

# Configuration
VPS_HOST="46.62.209.17"
VPS_USER="deploy"
DEPLOY_DIR="/home/deploy/kinetikui-automation"
BACKEND_PORT="3000"

echo "📦 Step 1: Checking VPS prerequisites..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
    # Check Node.js (need v18+)
    if ! command -v node &> /dev/null; then
        echo "Installing Node.js 22..."
        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    echo "✅ Node.js version: $(node --version)"

    # Check Redis
    if ! command -v redis-server &> /dev/null; then
        echo "Installing Redis..."
        sudo apt-get update
        sudo apt-get install -y redis-server
        sudo systemctl enable redis-server
        sudo systemctl start redis-server
    fi
    echo "✅ Redis: $(redis-server --version)"

    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2..."
        sudo npm install -g pm2
    fi
    echo "✅ PM2: $(pm2 --version)"

    # Create deployment directory
    mkdir -p ${DEPLOY_DIR}
ENDSSH

echo "📤 Step 2: Uploading backend files..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.env' \
    --exclude 'videos' \
    --exclude 'renders' \
    --exclude '*.log' \
    ./backend/ ${VPS_USER}@${VPS_HOST}:${DEPLOY_DIR}/backend/

echo "📤 Step 3: Uploading Remotion files..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude 'out' \
    --exclude '.remotion' \
    ./remotion/ ${VPS_USER}@${VPS_HOST}:${DEPLOY_DIR}/remotion/

echo "⚙️  Step 4: Installing dependencies & setting up..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
    cd ${DEPLOY_DIR}/backend
    
    # Install backend dependencies
    echo "Installing backend dependencies..."
    npm install --production
    
    # Setup Prisma
    echo "Setting up database..."
    npx prisma generate
    npx prisma migrate deploy
    
    # Create required directories
    mkdir -p videos renders logs
    
    # Install Remotion dependencies
    cd ${DEPLOY_DIR}/remotion
    echo "Installing Remotion dependencies..."
    npm install
    
    echo "✅ Dependencies installed"
ENDSSH

echo "🔐 Step 5: Configuring environment variables..."
echo "⚠️  You need to create .env file with Instagram credentials!"
echo "Copy ENV_TEMPLATE to ${DEPLOY_DIR}/backend/.env and fill in:"
echo "  - INSTAGRAM_APP_ID"
echo "  - INSTAGRAM_APP_SECRET"
echo "  - INSTAGRAM_ACCESS_TOKEN"
echo "  - INSTAGRAM_USER_ID"

echo "🚀 Step 6: Starting services with PM2..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
    cd ${DEPLOY_DIR}/backend
    
    # Stop existing PM2 processes
    pm2 delete kinetikui-backend 2>/dev/null || true
    
    # Start backend
    pm2 start npm --name "kinetikui-backend" -- run start
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
    
    echo "✅ Backend started on port ${BACKEND_PORT}"
    pm2 status
ENDSSH

echo "✅ VPS Deployment Complete!"
echo ""
echo "📋 Next steps:"
echo "1. SSH to VPS: ssh ${VPS_USER}@${VPS_HOST}"
echo "2. Configure .env: cd ${DEPLOY_DIR}/backend && nano .env"
echo "3. Restart backend: pm2 restart kinetikui-backend"
echo "4. Check logs: pm2 logs kinetikui-backend"
echo "5. Monitor: pm2 monit"
echo ""
echo "🌐 Backend API will be available at: http://${VPS_HOST}:${BACKEND_PORT}"
echo "📊 Test endpoint: curl http://${VPS_HOST}:${BACKEND_PORT}/health"
