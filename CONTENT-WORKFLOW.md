# Content Creation Workflow

How to create and schedule Instagram Reels with the automation system.

## Overview

```
Create Video → Render Queue → Auto-Schedule → Post to Instagram → Track Metrics
     ↓              ↓               ↓                ↓                ↓
  Dashboard      BullMQ          Cron Job        Graph API      Analytics
```

## Method 1: Using the Dashboard (Recommended)

### Step 1: Open Dashboard

Local: http://localhost:3001
Production: https://your-vercel-url.vercel.app

### Step 2: Create Video

1. Click **Video Preview** card
2. Select a template from the list:
   - **Component Showcase** - Grid of animated components
   - **Code Reveal** - Typing code effect
   - **Before/After** - Transformation effect
   - **Feature Highlight** - List features with icons
   - **Speed Build** - Timelapse steps
   - **Hook Pattern** - "POV: You just discovered X"
   - **Problem/Solution** - Show problem → solution
   - **Comparison** - Side-by-side comparison
   - **Tutorial Snippet** - Step-by-step guide
   - **Social Proof** - Stats and testimonials

3. Fill in details:
   - **Title**: Internal name (not shown in video)
   - **Caption**: Instagram post caption
   - **Hashtags**: Space or comma-separated

4. Click **Create & Queue Video**

### Step 3: Monitor Progress

1. Return to Dashboard
2. Check queue stats:
   - **Waiting**: Videos in queue
   - **Rendering**: Currently processing
   - **Completed**: Successfully rendered
   - **Failed**: Errors (check logs)

3. View recent videos list with status

### Step 4: Auto-Scheduling

Videos are automatically scheduled:
- **Default times**: 9:00 AM, 2:00 PM, 7:00 PM (CET)
- **Pattern**: FIFO (first in, first out)
- **Status flow**: 
  - `pending` → `rendering` → `rendered` → `scheduled` → `posted`

### Step 5: Manual Scheduling (Coming Soon)

Future feature: Drag & drop calendar to manually schedule posts.

## Method 2: Using the API

### Create Video

```bash
curl -X POST http://46.62.209.17:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "ComponentShowcase",
    "title": "Amazing Kinetik Buttons",
    "caption": "Check out these smooth animated buttons 🔥\n\nBuilt with Kinetik UI - the easiest way to add animations to React.",
    "hashtags": "#kinetikui #react #webdev #ui #animation #javascript #developer #coding",
    "props": {
      "title": "Kinetik UI Buttons",
      "components": [
        "GlowButton",
        "MagneticButton", 
        "LiquidButton",
        "NeuButton",
        "GlassButton",
        "PulseButton"
      ]
    }
  }'
```

### Check Status

```bash
# Get all videos
curl http://46.62.209.17:3000/api/videos?limit=10

# Get specific video
curl http://46.62.209.17:3000/api/videos/{VIDEO_ID}

# Filter by status
curl http://46.62.209.17:3000/api/videos?status=rendered
```

### Queue Stats

```bash
curl http://46.62.209.17:3000/api/queue/stats
```

## Template Customization

Each template accepts custom props in the `props` field:

### ComponentShowcase

```json
{
  "title": "Kinetik UI Components",
  "components": ["Component1", "Component2", ...]
}
```

### CodeReveal

```json
{
  "code": "import { Button } from '@kinetikui/core';\n\n<Button>Click me</Button>",
  "componentName": "Button"
}
```

### BeforeAfter

```json
{
  "beforeTitle": "Before: Boring UI",
  "afterTitle": "After: Kinetik Magic ✨"
}
```

### FeatureHighlight

```json
{
  "componentName": "SwipeCard",
  "features": [
    "Smooth gesture animations",
    "Spring physics",
    "Auto-snap points"
  ]
}
```

### SpeedBuild

```json
{
  "projectName": "Modern Dashboard",
  "steps": [
    "Install Kinetik UI",
    "Import components",
    "Add animations"
  ]
}
```

### HookPattern

```json
{
  "hookText": "POV: You just discovered Kinetik UI",
  "feature": "useGesture()"
}
```

### ProblemSolution

```json
{
  "problem": "Spending hours on animation code",
  "solution": "Copy-paste Kinetik components"
}
```

### Comparison

```json
{
  "leftTitle": "Other Libraries",
  "rightTitle": "Kinetik UI",
  "leftPoints": ["Complex setup", "Heavy bundle"],
  "rightPoints": ["Drop-in ready", "Tiny bundle"]
}
```

### TutorialSnippet

```json
{
  "title": "Add a Floating Dock",
  "steps": [
    { "text": "Import the component", "duration": 90 },
    { "text": "Pass your icons", "duration": 120 }
  ]
}
```

### SocialProof

```json
{
  "stats": [
    { "label": "Downloads", "value": "10K+" },
    { "label": "Components", "value": "60+" }
  ],
  "testimonial": "Best UI library! - @developer"
}
```

## Best Practices

### Captions

**Do:**
- Keep first line catchy (hook)
- Include call-to-action
- Use 5-10 relevant hashtags
- Add emojis for personality

**Don't:**
- Wall of text
- Too many hashtags (>30)
- Irrelevant hashtags
- All caps

**Example:**
```
Stop wasting time on animations 🎨

Kinetik UI gives you 60+ ready-made animated components.
Just copy, paste, and ship. 

Try it now → link in bio

#kinetikui #react #webdev #frontend #javascript #animation #ui #developer #coding #reactjs
```

### Hashtags

**High-performing tags for dev content:**
- `#webdev` `#javascript` `#react` `#coding`
- `#developer` `#programming` `#frontend` `#ui`
- `#100daysofcode` `#reactjs` `#webdevelopment`

**Niche tags:**
- `#kinetikui` (brand)
- `#reactanimation` `#uianimation`
- `#componentlibrary`

**Mix:**
- 3-4 popular tags (100K+ posts)
- 3-4 medium tags (10K-100K posts)
- 2-3 niche tags (< 10K posts)

### Posting Schedule

**Optimal times for dev content (CET):**
- **Morning**: 9:00 AM (devs starting work)
- **Afternoon**: 2:00 PM (lunch break)
- **Evening**: 7:00 PM (after work)

**Configure in Settings:**
1. Go to Settings page
2. Update "Posting Times": `09:00,14:00,19:00`
3. Enable/disable automatic posting
4. Save

## Content Calendar (Coming Soon)

Future dashboard feature:
- Visual calendar view
- Drag & drop scheduling
- Bulk upload
- Preview before posting
- Analytics integration

## Analytics Tracking

After posting, the system tracks:
- Views (plays)
- Likes
- Comments
- Saves
- Shares
- Engagement rate

**View in Dashboard:**
- Analytics page (aggregated metrics)
- Individual video performance (coming soon)

## Troubleshooting

### Video stuck in "rendering"
- Check backend logs: `pm2 logs kinetikui-backend`
- Verify Remotion dependencies installed
- Check queue: `/api/queue/stats`

### Video failed
- Check `backend/error.log` for details
- Common issues:
  - Invalid composition ID
  - Missing props
  - Out of memory (reduce RENDER_CONCURRENCY)

### Video not posting
- Verify Instagram credentials in Settings
- Check access token validity
- Ensure video is publicly accessible
- Review Instagram API limits (25 posts/day)

### Wrong posting time
- Times are in **CET** (Central European Time)
- Adjust in Settings page
- Format: 24-hour (e.g., `09:00`, not `9 AM`)

## Tips & Tricks

### Batch Creation

Create multiple videos at once via API:

```bash
#!/bin/bash
TEMPLATES=("ComponentShowcase" "CodeReveal" "FeatureHighlight")

for TEMPLATE in "${TEMPLATES[@]}"; do
  curl -X POST http://46.62.209.17:3000/api/videos \
    -H "Content-Type: application/json" \
    -d "{
      \"compositionId\": \"$TEMPLATE\",
      \"title\": \"Video $TEMPLATE\",
      \"caption\": \"Amazing Kinetik UI\",
      \"hashtags\": \"#kinetikui #react\",
      \"props\": {}
    }"
  sleep 2
done
```

### Content Ideas

1. **Feature spotlight** - One component per video
2. **Before/After** - Show transformation
3. **Tutorial series** - Multi-part how-tos
4. **Tips & tricks** - Quick wins
5. **Updates** - New component releases
6. **User showcases** - Repost community builds
7. **Comparisons** - vs other libraries
8. **Behind-the-scenes** - Development process

### Consistency

- **Frequency**: 3 videos/day = 90/month
- **Themes**: Rotate between templates
- **Branding**: Always include @kinetikui watermark
- **Quality**: Test videos in Remotion Studio first

## Next Steps

1. Create your first 5 videos
2. Monitor performance in Analytics
3. Adjust content based on metrics
4. Scale to full automation
5. Experiment with new templates

## Support

Questions?
- Check backend logs
- Review SETUP.md
- See INSTAGRAM-API-GUIDE.md
- Test in Remotion Studio: `cd remotion && npm start`
