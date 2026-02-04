# Deployment Guide

Production deployment to VPS (46.62.209.17) and Vercel.

## Architecture

```
┌─────────────────────────────────────────┐
│  Vercel (Dashboard - Next.js)           │
│  https://kinetikui-dash.vercel.app      │
└─────────────────┬───────────────────────┘
                  │ HTTP API
┌─────────────────▼───────────────────────┐
│  VPS 46.62.209.17 (Backend + Remotion)  │
│  - Node.js API (port 3000)              │
│  - Redis (port 6379)                    │
│  - Render workers                       │
│  - Video storage (/videos)              │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Instagram Graph API                    │
│  - Automated posting                    │
│  - 3x/day schedule                      │
└─────────────────────────────────────────┘
```

## Part 1: VPS Backend Deployment

### Prerequisites on VPS

```bash
ssh deploy@46.62.209.17
# Password: Vandl123

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Redis
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Install PM2 (process manager)
sudo npm install -g pm2

# Verify
node --version  # Should be v20.x
redis-cli ping  # Should return PONG
```

### Deploy Backend

```bash
# On your local machine
cd /root/.openclaw/workspace/kinetikui-automation

# Copy project to VPS
rsync -avz --exclude node_modules --exclude .git \
  ./ deploy@46.62.209.17:~/kinetikui-automation/

# SSH into VPS
ssh deploy@46.62.209.17

# Setup backend
cd ~/kinetikui-automation/backend
npm install
npx prisma db push

# Create .env file
cat > .env << 'EOF'
PORT=3000
PUBLIC_VIDEO_URL=http://46.62.209.17:3000/videos
REDIS_HOST=localhost
REDIS_PORT=6379
RENDER_CONCURRENCY=3
LOG_LEVEL=info
NODE_ENV=production
EOF

# Build backend
npm run build

# Start with PM2
pm2 start dist/index.js --name kinetikui-backend
pm2 save
pm2 startup  # Follow instructions to enable auto-start
```

### Setup Nginx (Optional - Recommended)

```bash
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/kinetikui
```

Add:
```nginx
server {
    listen 80;
    server_name 46.62.209.17;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /videos {
        alias /home/deploy/kinetikui-automation/videos;
        autoindex off;
    }

    location /thumbnails {
        alias /home/deploy/kinetikui-automation/thumbnails;
        autoindex off;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/kinetikui /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Verify Backend

```bash
curl http://46.62.209.17:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Part 2: Vercel Dashboard Deployment

### Prerequisites

```bash
# Install Vercel CLI (on your local machine)
npm install -g vercel
```

### Deploy to Vercel

```bash
cd /root/.openclaw/workspace/kinetikui-automation/dashboard

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: kinetikui-dashboard
# - Directory: ./
# - Override settings? No

# Production deployment
vercel --prod
```

### Configure Environment Variables

In Vercel dashboard (https://vercel.com):
1. Go to your project
2. Settings → Environment Variables
3. Add:
   - `BACKEND_URL` = `http://46.62.209.17:3000`

### Redeploy After Config

```bash
vercel --prod
```

### Custom Domain (Optional)

1. In Vercel dashboard: Settings → Domains
2. Add your domain (e.g., `dash.kinetikui.com`)
3. Configure DNS records as instructed

## Part 3: SSL/HTTPS (Optional but Recommended)

### Using Certbot (VPS)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d api.kinetikui.com

# Auto-renewal is enabled by default
sudo certbot renew --dry-run
```

Update `BACKEND_URL` in Vercel:
- Change to `https://api.kinetikui.com`

## Part 4: Monitoring & Maintenance

### View Logs

```bash
ssh deploy@46.62.209.17

# PM2 logs
pm2 logs kinetikui-backend

# Error logs
tail -f ~/kinetikui-automation/backend/error.log

# Combined logs
tail -f ~/kinetikui-automation/backend/combined.log

# Redis
redis-cli monitor
```

### Restart Services

```bash
# Restart backend
pm2 restart kinetikui-backend

# Restart Redis
sudo systemctl restart redis-server

# Restart Nginx
sudo systemctl restart nginx
```

### Update Deployment

```bash
# On local machine - after making changes
cd /root/.openclaw/workspace/kinetikui-automation
rsync -avz --exclude node_modules --exclude .git \
  ./ deploy@46.62.209.17:~/kinetikui-automation/

# On VPS
ssh deploy@46.62.209.17
cd ~/kinetikui-automation/backend
npm install
npm run build
pm2 restart kinetikui-backend

# Dashboard (Vercel) - automatic from Git or manual:
cd ../dashboard
vercel --prod
```

### Backup Database

```bash
# On VPS
cd ~/kinetikui-automation/backend
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)

# Restore
cp prisma/dev.db.backup.YYYYMMDD prisma/dev.db
```

## Part 5: Health Checks

### Backend Health

```bash
curl http://46.62.209.17:3000/health
curl http://46.62.209.17:3000/api/queue/stats
```

### Dashboard Health

Visit: https://your-vercel-url.vercel.app

### System Resources

```bash
ssh deploy@46.62.209.17

# CPU/Memory
htop

# Disk usage
df -h

# PM2 monitoring
pm2 monit
```

## Troubleshooting

### Backend won't start
```bash
pm2 logs kinetikui-backend --lines 100
# Check for:
# - Port 3000 already in use: sudo lsof -i :3000
# - Redis not running: sudo systemctl status redis-server
# - Missing dependencies: npm install
```

### Render queue stuck
```bash
# Connect to Redis
redis-cli

# Check queue
KEYS *
LLEN bull:video-rendering:wait
LLEN bull:video-rendering:active

# Clear queue if needed
FLUSHALL
```

### Videos not posting
1. Check Instagram credentials in Settings
2. Verify access token is valid
3. Check error logs: `tail -f backend/error.log`
4. Ensure videos are publicly accessible: `curl http://46.62.209.17:3000/videos/{filename}.mp4`

### Dashboard can't connect to backend
1. Verify BACKEND_URL in Vercel env vars
2. Test backend: `curl http://46.62.209.17:3000/health`
3. Check CORS settings in backend
4. Check browser console for errors

## Security Checklist

- [ ] Firewall configured (allow 80, 443, 3000)
- [ ] Redis requires password (optional but recommended)
- [ ] Nginx proxy headers set correctly
- [ ] SSL/HTTPS enabled
- [ ] PM2 auto-restart enabled
- [ ] Logs rotated (PM2 handles this)
- [ ] Instagram tokens encrypted in DB (TODO)
- [ ] Regular backups scheduled

## Costs

- **VPS**: $0 (already owned - 46.62.209.17)
- **Vercel**: $0 (free tier - up to 100GB bandwidth/month)
- **Redis**: $0 (self-hosted on VPS)
- **Total**: **$0/month** ✅

## Performance

- **Concurrent renders**: 3 (configurable via RENDER_CONCURRENCY)
- **Videos/day**: 3 (9 AM, 2 PM, 7 PM CET)
- **Monthly capacity**: 90 videos
- **Storage**: ~2GB/month (30 days × 3 videos × ~20MB each)

## Next Steps

1. Deploy backend to VPS
2. Deploy dashboard to Vercel
3. Configure Instagram credentials in Settings
4. Create and schedule first video
5. Monitor logs and performance
6. Scale RENDER_CONCURRENCY if needed

## Support

Questions? Check:
- Backend logs: `~/kinetikui-automation/backend/combined.log`
- PM2 status: `pm2 status`
- Vercel logs: https://vercel.com/dashboard
