# Kinetik UI Instagram Automation System

Production-ready Remotion-based video generation and Instagram automation system.

## 🎯 Overview

Automated system for creating and posting Instagram Reels showcasing Kinetik UI components. Generates 3 videos per day, fully automated from render to post.

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  Vercel Dashboard (Next.js)             │
│  - Content calendar UI                  │
│  - Video preview                        │
│  - Schedule management                  │
│  - Analytics dashboard                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  VPS Backend (Node.js)                  │
│  - Remotion render queue                │
│  - Instagram Graph API integration      │
│  - Video storage (local)                │
│  - Cron scheduler (3x/day posting)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Remotion Project                       │
│  - 10 Video Templates                   │
│  - Component showcase animations        │
│  - Code reveal effects                  │
│  - Before/after transitions             │
└─────────────────────────────────────────┘
```

## 📦 What's Included

### Remotion Templates (10)
1. **ComponentShowcase** - Scrolling grid of animated components
2. **CodeReveal** - Typing effect showing component code
3. **BeforeAfter** - Static UI → Animated transformation
4. **FeatureHighlight** - Single component with 3-5 features
5. **SpeedBuild** - Timelapse of building with components
6. **HookPattern** - "POV: You just discovered X" format
7. **ProblemSolution** - Show common UI problem → Kinetik solution
8. **Comparison** - Side-by-side (Kinetik vs competitor)
9. **TutorialSnippet** - 15sec how-to-use
10. **SocialProof** - Testimonials/stats overlay on component demo

### Backend Features
- BullMQ render queue (parallel processing)
- Instagram Graph API integration
- Automated scheduling (9 AM, 2 PM, 7 PM CET)
- Video storage & thumbnail generation
- Error handling & retry logic
- Winston logging

### Dashboard Features
- Video creation & preview
- Queue monitoring
- Settings management (Instagram credentials, posting times)
- Analytics tracking (coming soon)
- Responsive design

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 20+
- Redis
- VPS with public IP (46.62.209.17)
- Instagram Business Account
- Meta Developer Account

### 2. Installation

```bash
cd /root/.openclaw/workspace/kinetikui-automation

# Install all dependencies
cd remotion && npm install
cd ../backend && npm install
cd ../dashboard && npm install
```

### 3. Setup Backend

```bash
cd backend

# Initialize database
npx prisma db push

# Create .env
cp ../ENV_TEMPLATE .env
# Edit .env with your settings

# Start backend
npm run dev
```

### 4. Setup Dashboard

```bash
cd dashboard

# Create .env.local
echo "BACKEND_URL=http://localhost:3000" > .env.local

# Start dashboard
npm run dev
```

### 5. Configure Instagram

1. Follow `INSTAGRAM-API-GUIDE.md` to get credentials
2. Open dashboard: http://localhost:3001
3. Go to Settings
4. Enter Access Token and Account ID
5. Save

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment (VPS + Vercel)
- **[INSTAGRAM-API-GUIDE.md](INSTAGRAM-API-GUIDE.md)** - Instagram API setup
- **[CONTENT-WORKFLOW.md](CONTENT-WORKFLOW.md)** - How to create content
- **[REMOTION-SETUP.md](REMOTION-SETUP.md)** - Template customization

## 🎬 Creating Your First Video

### Via Dashboard:
1. Open http://localhost:3001
2. Click "Video Preview"
3. Select template (e.g., ComponentShowcase)
4. Fill in title, caption, hashtags
5. Click "Create & Queue Video"
6. Monitor in Dashboard

### Via API:
```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "ComponentShowcase",
    "title": "Amazing Kinetik Buttons",
    "caption": "Check out these smooth animated buttons 🔥",
    "hashtags": "#kinetikui #react #animation",
    "props": {
      "title": "Kinetik UI Buttons",
      "components": ["GlowButton", "MagneticButton", "LiquidButton"]
    }
  }'
```

## 🗂️ Project Structure

```
kinetikui-automation/
├── remotion/                   # Video templates
│   ├── src/
│   │   ├── templates/          # 10 video templates
│   │   ├── components/         # Shared components
│   │   ├── utils/              # Utility functions
│   │   ├── Root.tsx            # Composition registry
│   │   └── index.ts            # Entry point
│   ├── package.json
│   ├── remotion.config.ts
│   └── README.md
│
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── instagram/          # Instagram API integration
│   │   │   ├── api.ts          # Graph API client
│   │   │   ├── upload.ts       # Upload logic
│   │   │   └── scheduler.ts    # Cron jobs
│   │   ├── render/             # Render queue
│   │   │   ├── queue.ts        # BullMQ setup
│   │   │   └── worker.ts       # Video rendering
│   │   ├── utils/
│   │   │   └── logger.ts       # Winston logger
│   │   └── index.ts            # Express server
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── package.json
│   └── README.md
│
├── dashboard/                  # Next.js dashboard
│   ├── app/
│   │   ├── page.tsx            # Main dashboard
│   │   ├── preview/            # Video creation
│   │   ├── analytics/          # Metrics
│   │   └── settings/           # Configuration
│   ├── components/             # React components
│   ├── package.json
│   └── README.md
│
├── kinetic-components/         # Source component library (cloned)
├── videos/                     # Rendered videos (auto-created)
├── thumbnails/                 # Video thumbnails (auto-created)
│
├── SETUP.md                    # Setup instructions
├── DEPLOYMENT.md               # Deployment guide
├── INSTAGRAM-API-GUIDE.md      # Instagram API setup
├── CONTENT-WORKFLOW.md         # Content creation guide
├── REMOTION-SETUP.md           # Template customization
├── ENV_TEMPLATE                # Environment variables template
└── README.md                   # This file
```

## 🔧 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TailwindCSS
- React Query
- Lucide Icons

**Backend:**
- Node.js + Express
- Remotion 4.x (video rendering)
- BullMQ (queue management)
- Prisma + SQLite (database)
- Instagram Graph API

**Infrastructure:**
- VPS: 46.62.209.17 (backend + rendering)
- Vercel (dashboard hosting)
- Redis (queue backend)

## 📊 Specs

- **Resolution**: 1080x1920 (9:16 Instagram Reels)
- **Duration**: 7-15 seconds
- **FPS**: 30
- **Format**: MP4, H.264
- **Posting**: 3x/day (9 AM, 2 PM, 7 PM CET)
- **Capacity**: 90 videos/month
- **Concurrency**: 3 parallel renders

## 💰 Cost

**Total: $0/month**
- VPS: Already owned
- Vercel: Free tier
- Redis: Self-hosted

## 🎯 Workflow

1. **Create**: Select template, fill details
2. **Queue**: Video added to render queue
3. **Render**: BullMQ processes (parallel)
4. **Schedule**: Auto-assigned to next time slot
5. **Post**: Cron job posts to Instagram
6. **Track**: Metrics collected via Graph API

## 🔍 Monitoring

**Backend:**
```bash
# View logs
pm2 logs kinetikui-backend

# Queue stats
curl http://46.62.209.17:3000/api/queue/stats

# Recent videos
curl http://46.62.209.17:3000/api/videos?limit=10
```

**Dashboard:**
- Real-time queue stats
- Recent videos list
- Status tracking
- Error notifications

## 🐛 Troubleshooting

### Videos not rendering
```bash
# Check queue
curl http://localhost:3000/api/queue/stats

# Check logs
tail -f backend/combined.log

# Restart workers
pm2 restart kinetikui-backend
```

### Instagram posting fails
- Verify credentials in Settings
- Check access token validity
- Ensure video URL is public
- Review `backend/error.log`

### Dashboard can't connect
- Verify `BACKEND_URL` in env
- Check backend is running: `curl http://localhost:3000/health`
- Check browser console

## 📈 Performance

**Benchmarks:**
- Render time: ~1-2 min per 15sec video
- Queue throughput: 3 videos in parallel
- Upload time: ~30 seconds (depends on Instagram)
- Total: Create to post in <5 minutes

## 🔐 Security

- Instagram tokens stored in database
- Tokens never committed to Git
- Environment variables for secrets
- PM2 process isolation
- Nginx reverse proxy (optional)

## 🚢 Deployment

**Development:**
```bash
# Backend
cd backend && npm run dev

# Dashboard
cd dashboard && npm run dev
```

**Production:**

See `DEPLOYMENT.md` for full guide:
1. Deploy backend to VPS with PM2
2. Deploy dashboard to Vercel
3. Configure environment variables
4. Setup SSL (optional)
5. Configure monitoring

## 📝 License

Private project for Kinetik UI.

## 🤝 Contributing

Internal project. Contact maintainers for access.

## 📞 Support

- Backend logs: `backend/combined.log`, `backend/error.log`
- Remotion docs: https://remotion.dev
- Instagram API docs: https://developers.facebook.com/docs/instagram-api

---

**Built with ❤️ for @kinetikui**
