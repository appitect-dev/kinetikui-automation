# Quick Start Checklist

Get the system running in 10 minutes.

## ☑️ Pre-flight Checklist

### System Requirements
- [ ] Node.js 20+ installed (`node --version`)
- [ ] Redis installed and running (`redis-cli ping`)
- [ ] VPS access (SSH to 46.62.209.17)
- [ ] Instagram Business Account (@kinetikui)
- [ ] Meta Developer Account

## 🚀 Launch Sequence

### Step 1: Install Dependencies (5 min)

```bash
cd /root/.openclaw/workspace/kinetikui-automation

# Remotion
cd remotion
npm install

# Backend
cd ../backend
npm install
npx prisma db push

# Dashboard
cd ../dashboard
npm install
```

### Step 2: Configure Environment (2 min)

```bash
# Backend .env
cd backend
cat > .env << 'EOF'
PORT=3000
PUBLIC_VIDEO_URL=http://localhost:3000/videos
REDIS_HOST=localhost
REDIS_PORT=6379
RENDER_CONCURRENCY=3
LOG_LEVEL=info
NODE_ENV=development
EOF

# Dashboard .env.local
cd ../dashboard
echo "BACKEND_URL=http://localhost:3000" > .env.local
```

### Step 3: Start Services (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Dashboard:**
```bash
cd dashboard
npm run dev
```

### Step 4: Configure Instagram (2 min)

1. Open http://localhost:3001
2. Click **Settings**
3. Enter (get from INSTAGRAM-API-GUIDE.md):
   - Access Token: `your_token_here`
   - Account ID: `your_account_id`
4. Set posting times: `09:00,14:00,19:00`
5. Enable automatic posting ✓
6. Click **Save**

## ✅ Verification

### Backend Health Check
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Queue Stats
```bash
curl http://localhost:3000/api/queue/stats
# Expected: {"waiting":0,"active":0,"completed":0,"failed":0}
```

### Dashboard Access
Open http://localhost:3001
- [ ] Dashboard loads
- [ ] Queue stats visible
- [ ] Settings page accessible

## 🎬 Create First Video

### Method 1: Dashboard (Easiest)

1. Go to http://localhost:3001
2. Click **Video Preview**
3. Select **ComponentShowcase**
4. Fill in:
   - Title: `Test Video`
   - Caption: `Testing Kinetik UI automation 🎨`
   - Hashtags: `#kinetikui #react #test`
5. Click **Create & Queue Video**
6. Return to Dashboard
7. Watch "Rendering" counter increase
8. Check Recent Videos list

### Method 2: API (Advanced)

```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "ComponentShowcase",
    "title": "Test Video",
    "caption": "Testing automation 🚀",
    "hashtags": "#kinetikui #test",
    "props": {
      "title": "Kinetik UI",
      "components": ["Button", "Card", "Modal"]
    }
  }'
```

## 📊 Monitor Progress

### Watch Logs
```bash
# Backend logs
cd backend
tail -f combined.log

# Error logs
tail -f error.log
```

### Dashboard Stats
- **Waiting**: Videos in queue
- **Rendering**: Currently processing
- **Completed**: Successfully rendered
- **Failed**: Errors (check logs)

### Check Video Status
```bash
# List all videos
curl http://localhost:3000/api/videos?limit=5

# Get specific video
curl http://localhost:3000/api/videos/{VIDEO_ID}
```

## 🎯 Expected Timeline

1. **Queue** (instant): Video added to database
2. **Rendering** (1-2 min): Remotion generates MP4
3. **Rendered** (instant): Video saved to disk
4. **Scheduled** (automatic): Assigned to next time slot
5. **Posted** (at scheduled time): Uploaded to Instagram

## ❗ Common Issues

### "Redis connection failed"
```bash
# Check Redis
redis-cli ping

# Start Redis
sudo systemctl start redis-server
```

### "Port 3000 already in use"
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 {PID}
```

### "Render failed"
- Check `backend/error.log`
- Verify Remotion dependencies installed
- Try rendering in Studio first:
  ```bash
  cd remotion
  npm start
  ```

### "Instagram upload failed"
- Access token expired → regenerate
- Wrong account ID → verify Business account
- Video not public → check PUBLIC_VIDEO_URL

## 🔄 Next Steps

Once first video renders successfully:

1. **Customize templates** → REMOTION-SETUP.md
2. **Deploy to production** → DEPLOYMENT.md
3. **Schedule content** → CONTENT-WORKFLOW.md
4. **Monitor performance** → Analytics page

## 📚 Documentation Index

- **Setup**: SETUP.md (detailed installation)
- **Deployment**: DEPLOYMENT.md (VPS + Vercel)
- **Instagram API**: INSTAGRAM-API-GUIDE.md (credentials)
- **Templates**: REMOTION-SETUP.md (customization)
- **Content**: CONTENT-WORKFLOW.md (best practices)

## 🆘 Help

Stuck? Check these in order:

1. `backend/error.log` - Backend errors
2. Browser console - Dashboard errors
3. `backend/combined.log` - All logs
4. Remotion Studio - Template issues
5. Instagram API Explorer - API issues

## ✨ Success Criteria

You're ready when:

- ✅ Backend health check passes
- ✅ Dashboard loads and shows stats
- ✅ First video renders successfully
- ✅ Video appears in dashboard list
- ✅ No errors in logs

**Estimated total time: ~10 minutes** ⏱️

---

**Ready to scale? See DEPLOYMENT.md for production setup.**
