# Manual Deployment Guide

Tento guide používej pokud automatický deployment script `deploy-vps.sh` nefunguje kvůli SSH autentizaci.

---

## 🔐 Prerequisites

### 1. SSH Access to VPS
- **Host:** 46.62.209.17
- **User:** deploy
- **Password:** Vandl123

### 2. Instagram API Credentials
Následuj `INSTAGRAM-API-GUIDE.md` pro získání:
- App ID
- App Secret
- Access Token
- User ID

### 3. GitHub Repo
- Create repo: https://github.com/new
- Name: `kinetikui-automation`
- Push local repo

---

## 📦 VPS Deployment Steps

### Step 1: SSH to VPS
```bash
ssh deploy@46.62.209.17
# Enter password: Vandl123
```

### Step 2: Install Prerequisites
```bash
# Check Node.js (need v18+)
node --version

# If not installed:
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Redis
sudo apt-get update
sudo apt-get install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Install PM2
sudo npm install -g pm2

# Verify
redis-cli ping  # Should return "PONG"
pm2 --version
```

### Step 3: Clone Repository
```bash
cd ~
git clone https://github.com/appitect-dev/kinetikui-automation.git
cd kinetikui-automation
```

### Step 4: Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp ../ENV_TEMPLATE .env
nano .env
```

**Edit `.env` with:**
```env
# Server
PORT=3000
NODE_ENV=production

# Instagram API
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
INSTAGRAM_USER_ID=your_user_id_here

# Database
DATABASE_URL="file:./dev.db"

# Render Queue
REDIS_URL="redis://localhost:6379"
RENDER_CONCURRENCY=3

# Scheduling
SCHEDULE_ENABLED=true
TIMEZONE=Europe/Prague

# Paths
VIDEO_OUTPUT_DIR=./videos
REMOTION_ROOT=../remotion
```

**Save:** Ctrl+X, Y, Enter

### Step 5: Setup Database
```bash
npx prisma generate
npx prisma migrate deploy

# Create required directories
mkdir -p videos renders logs
```

### Step 6: Install Remotion
```bash
cd ../remotion
npm install
cd ../backend
```

### Step 7: Start Backend with PM2
```bash
# Build TypeScript
npm run build

# Start with PM2
pm2 start npm --name "kinetikui-backend" -- run start

# Save PM2 configuration
pm2 save

# Setup PM2 auto-restart on reboot
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs kinetikui-backend
```

### Step 8: Verify Backend
```bash
# Test health endpoint
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Step 9: Test Firewall (if needed)
```bash
# Allow port 3000
sudo ufw allow 3000/tcp

# Check from outside
curl http://46.62.209.17:3000/health
```

---

## 🌐 Vercel Dashboard Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
# Follow authentication flow
```

### Step 3: Deploy Dashboard
```bash
cd dashboard
npm install

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - What's your project's name? kinetikui-automation
# - In which directory is your code located? ./
# - Want to override settings? No
```

### Step 4: Configure Environment Variables
In Vercel dashboard (https://vercel.com):
1. Go to project settings
2. Environment Variables
3. Add:
   - `NEXT_PUBLIC_API_URL` = `http://46.62.209.17:3000`

### Step 5: Redeploy
```bash
vercel --prod
```

---

## 🔍 Verification Checklist

### Backend (VPS)
- [ ] `pm2 status` shows running process
- [ ] `curl http://46.62.209.17:3000/health` returns OK
- [ ] `pm2 logs kinetikui-backend` shows no errors
- [ ] Redis is running: `redis-cli ping`

### Dashboard (Vercel)
- [ ] Dashboard loads at Vercel URL
- [ ] API connection works (check browser console)
- [ ] Queue stats display
- [ ] Settings page loads

### Instagram API
- [ ] Test credentials: `curl http://46.62.209.17:3000/api/instagram/verify`
- [ ] Should return account info

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
pm2 logs kinetikui-backend --lines 50
npm run dev  # Run in dev mode to see errors
```

### Redis connection failed
```bash
sudo systemctl status redis-server
sudo systemctl restart redis-server
redis-cli ping
```

### Database errors
```bash
npx prisma migrate reset
npx prisma migrate deploy
```

### Port already in use
```bash
sudo lsof -i :3000
# Kill process if needed
sudo kill -9 <PID>
```

### Firewall blocking
```bash
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw reload
```

---

## 📊 Post-Deployment

### Monitor Backend
```bash
pm2 monit
pm2 logs kinetikui-backend
```

### Check Scheduler
```bash
# View cron jobs
pm2 logs kinetikui-backend | grep "Scheduled"
```

### Test Video Render
```bash
curl -X POST http://46.62.209.17:3000/api/render \
  -H "Content-Type: application/json" \
  -d '{"template":"ComponentShowcase","data":{}}'
```

### Check Queue
```bash
curl http://46.62.209.17:3000/api/queue/stats
```

---

## 🚀 First Post Test

1. Go to dashboard: https://your-vercel-url.vercel.app
2. Navigate to "Preview" page
3. Select template: ComponentShowcase
4. Click "Render Video"
5. Wait for render to complete
6. Click "Post to Instagram"
7. Check Instagram: @kinetikui

---

## 📝 Notes

- Backend logs: `/home/deploy/kinetikui-automation/backend/logs/`
- Videos: `/home/deploy/kinetikui-automation/backend/videos/`
- Database: `/home/deploy/kinetikui-automation/backend/dev.db`
- PM2 config: `/home/deploy/.pm2/`

- Restart backend: `pm2 restart kinetikui-backend`
- Stop backend: `pm2 stop kinetikui-backend`
- Delete from PM2: `pm2 delete kinetikui-backend`

---

**Need help?** Check logs first:
```bash
pm2 logs kinetikui-backend --lines 100
```
