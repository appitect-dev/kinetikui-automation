# 🚀 Kinetik UI Dashboard - Quick Start Guide

## Dashboard URL
https://kinetikui-automation.vercel.app

## 🎬 Create Your First Viral Video (2 minutes)

### Step 1: Generate Script
1. Go to **Marketing** page
2. Select template:
   - **Did You Know** - Shocking facts (15s)
   - **Stop Using** - Contrarian advice (12-18s)
   - **POV** - Relatable scenarios (10-15s)
   - **3 Reasons** - Listicle countdown (15-20s)
   - **Before/After** - Transformation (12-18s)
   - **This Changed** - Origin story (18-25s)
   - **Watch This** - Visual wow (8-12s)

3. Choose topic:
   - Animations
   - Performance
   - Developer Experience
   - Design
   - Productivity

4. Pick tone:
   - Excited
   - Urgent
   - Calm
   - Professional

5. Click **"Generate Script"**

### Step 2: Review Preview
You'll see:
- **Hook** (0-3s) - Attention grabber
- **Problem** (3-8s) - Pain point
- **Solution** (8-13s) - Kinetik UI benefit
- **CTA** (13-15s) - Call to action

### Step 3: Generate Video
1. Click **"Generate Video"**
2. Video job queued (30-60 second render time)
3. Go to **Videos** page to see progress

### Step 4: Watch & Download
1. Video appears in gallery when complete
2. Click to preview
3. Download or schedule for Instagram

## 📊 Dashboard Pages

### Home
- Queue stats (waiting, rendering, complete, failed)
- Quick links to all sections
- Recent videos gallery

### Marketing
- AI script generator
- 7 viral templates
- Live preview
- One-click video generation

### Videos
- Gallery of all rendered videos
- Play/download/delete
- Status indicators

### Preview
- Direct video creation
- Choose template
- Custom props
- Render controls

### Calendar (Coming Soon)
- Schedule posts
- Auto-posting 3x/day
- Drag-and-drop interface

### Analytics (Coming Soon)
- Views, likes, comments
- Engagement rates
- Best performing templates
- ROI tracking

### Settings
- Instagram API credentials
- Auto-posting schedule
- Voice preferences
- Notification settings

## 🎯 Instagram Auto-Posting

**Default Schedule:** 3 posts per day
- 9:00 AM CET
- 2:00 PM CET
- 7:00 PM CET

**How to enable:**
1. Go to Settings
2. Add Instagram credentials:
   - App ID
   - App Secret
   - Access Token
   - User ID (@kinetikui)
3. Toggle auto-posting ON
4. Queue fills automatically

## 🔧 Backend API (for developers)

**Base URL:** http://46.62.209.17:3500

**Endpoints:**
- `GET /health` - Health check
- `GET /api/videos` - List videos
- `POST /api/videos` - Create video job
- `GET /api/queue/stats` - Queue statistics
- `GET /api/marketing/script/templates` - List templates
- `POST /api/marketing/script/generate` - Generate script
- `POST /api/marketing/script/variants` - Generate A/B variants

## 📝 Example Script Output

```json
{
  "hook": "Did you know 80% of devs waste 3 hours/day on UI?",
  "problem": "Most developers spend 10+ hours/week fighting with CSS animations",
  "solution": "Kinetik UI gives you 100+ professional animations copy-paste ready",
  "cta": "Link in bio 👆",
  "estimatedDuration": 15,
  "props": {
    "stat": "80%"
  }
}
```

## 🎨 Video Templates Technical Specs

- **Format:** 1080x1920 vertical (Instagram Reels)
- **Frame Rate:** 30 FPS
- **Duration:** 10-25 seconds
- **Animations:** Spring physics, smooth easing
- **Brand Color:** #818CF8 (customizable)
- **Watermark:** @kinetikui

## 🚨 Troubleshooting

### Videos not rendering?
- Check Queue Stats on homepage
- Look for errors in Videos page
- Backend status: http://46.62.209.17:3500/health

### Script generation fails?
- Check browser console (F12)
- Verify backend connection
- Try different template

### Instagram posting not working?
- Verify credentials in Settings
- Check access token expiry
- Instagram account must be Business/Creator

## 📚 Documentation

- **Full Docs:** `/VIRAL-TEMPLATES-SUMMARY.md`
- **API Docs:** `/VOICEOVER-SETUP.md`
- **Subtitle Guide:** `/SUBTITLES-GUIDE.md`
- **Debug Guide:** `/VERCEL-DEBUG.md`

## 🎯 Best Practices

### Script Generation
- Test 3-5 variations per template
- Mix topics for variety
- Use excited tone for viral potential
- Keep CTAs short and clear

### Video Creation
- Generate during off-peak hours
- Queue multiple videos at once
- Review before auto-posting
- Track performance in Analytics

### Instagram Strategy
- 2-3 reels/day optimal
- Mix template types
- Respond to comments quickly
- Use trending hashtags

## 🆘 Support

**Issues?** Check GitHub repo:
https://github.com/appitect-dev/kinetikui-automation

**Backend Logs:**
```bash
ssh deploy@46.62.209.17
pm2 logs kinetikui-backend
```

---

**Ready to go viral?** 🚀 Open the dashboard and create your first video!
