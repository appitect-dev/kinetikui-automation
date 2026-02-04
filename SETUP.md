# Kinetik UI Instagram Automation - Setup Guide

Complete setup guide for the Remotion Instagram automation system.

## Prerequisites

- Node.js 20+
- Redis (for render queue)
- VPS with public IP (46.62.209.17)
- Instagram Business Account
- Meta Developer Account

## Quick Start

### 1. Clone and Install

```bash
cd /root/.openclaw/workspace/kinetikui-automation

# Install Remotion dependencies
cd remotion
npm install

# Install backend dependencies
cd ../backend
npm install

# Install dashboard dependencies
cd ../dashboard
npm install
```

### 2. Setup Redis

```bash
# Install Redis on Ubuntu
sudo apt update
sudo apt install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify
redis-cli ping  # Should return PONG
```

### 3. Initialize Database

```bash
cd backend
npx prisma db push
```

### 4. Configure Environment

```bash
# Backend
cd backend
cp ../ENV_TEMPLATE .env
# Edit .env with your settings

# Dashboard (local dev)
cd ../dashboard
cp ../ENV_TEMPLATE .env.local
# Edit .env.local
```

### 5. Start Services

**Development (local):**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Dashboard
cd dashboard
npm run dev
```

**Production (VPS):**

See `DEPLOYMENT.md`

## Instagram API Setup

Follow `INSTAGRAM-API-GUIDE.md` to:
1. Create Meta App
2. Get Instagram Business Account ID
3. Generate Access Token
4. Set permissions

## Testing

### Test Video Rendering

```bash
cd remotion
npm start
# Opens Remotion Studio at http://localhost:3000
```

### Test Backend API

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}

# Create a test video
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "ComponentShowcase",
    "title": "Test Video",
    "caption": "Testing Kinetik UI automation",
    "hashtags": "#kinetikui #test",
    "props": {}
  }'
```

### Access Dashboard

Local: http://localhost:3001
Production: https://your-vercel-url.vercel.app

## Next Steps

1. Configure Instagram credentials in Settings page
2. Create your first video in Preview page
3. Monitor queue in Dashboard
4. Check logs in `backend/combined.log`

## Troubleshooting

**Redis connection failed:**
```bash
sudo systemctl status redis-server
redis-cli ping
```

**Remotion render fails:**
- Check `backend/combined.log`
- Ensure Remotion dependencies installed
- Verify video composition exists

**Instagram upload fails:**
- Verify access token is valid
- Check Instagram account is Business account
- Ensure video URL is publicly accessible
- Review `backend/error.log`

## Directory Structure

```
kinetikui-automation/
├── remotion/          # Video templates
├── backend/           # API + render queue
├── dashboard/         # Next.js UI
├── videos/            # Rendered videos (created automatically)
├── thumbnails/        # Video thumbnails (created automatically)
└── kinetic-components/  # Source component library
```

## Support

- Check logs in `backend/combined.log` and `backend/error.log`
- See `CONTENT-WORKFLOW.md` for usage guide
- Review Instagram API docs: https://developers.facebook.com/docs/instagram-api
