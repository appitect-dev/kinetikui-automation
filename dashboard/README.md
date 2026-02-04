# Kinetik UI Dashboard

Next.js 14 dashboard for managing Instagram video automation.

## Features

- 📅 Content calendar (drag & drop scheduling)
- 🎬 Video preview and creation
- 📊 Analytics dashboard (views, likes, engagement)
- ⚙️ Settings (Instagram credentials, posting times)
- 📝 Caption editor with hashtag suggestions

## Setup

```bash
npm install
npm run dev  # Start development server
```

## Environment Variables

Create `.env.local`:

```env
BACKEND_URL=http://localhost:3000
```

## Deployment to Vercel

```bash
vercel
```

Set environment variable in Vercel dashboard:
- `BACKEND_URL=http://46.62.209.17:3000`

## Pages

- `/` - Main dashboard with stats and recent videos
- `/preview` - Create new videos from templates
- `/analytics` - Performance metrics (views, likes, saves)
- `/settings` - Instagram API credentials and posting schedule

## Tech Stack

- Next.js 14 (App Router)
- TailwindCSS
- React Query
- Axios
- Lucide Icons
