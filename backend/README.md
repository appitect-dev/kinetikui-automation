# Kinetik UI Backend

Node.js backend for video rendering, Instagram posting, and scheduling.

## Setup

```bash
npm install
npx prisma db push  # Initialize database
npm run dev         # Start in development mode
```

## Environment Variables

Create `.env` file:

```env
PORT=3000
PUBLIC_VIDEO_URL=http://46.62.209.17:3000/videos
REDIS_HOST=localhost
REDIS_PORT=6379
RENDER_CONCURRENCY=3
LOG_LEVEL=info
NODE_ENV=production
```

## API Endpoints

- `POST /api/videos` - Create and queue a video for rendering
- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Get video by ID
- `POST /api/settings` - Update Instagram credentials and posting times
- `GET /api/settings` - Get current settings
- `GET /api/queue/stats` - Get render queue statistics
- `GET /health` - Health check

## Architecture

1. **Render Queue** - BullMQ handles parallel video rendering
2. **Instagram API** - Graph API integration for posting
3. **Scheduler** - Cron jobs for automated posting (3x/day)
4. **Storage** - Local file system (videos/ and thumbnails/)
5. **Database** - SQLite via Prisma

## Deployment

See `DEPLOYMENT.md` in root directory.
