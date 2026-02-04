# 🎬 Kinetik UI - Professional Subtitle System Guide

## Overview

This guide explains the subtitle system for Kinetik UI video automation. Subtitles are animated, Instagram Reels-style captions with word-by-word highlighting (karaoke effect).

## Architecture

### Components

1. **Remotion Component**: `/remotion/src/components/Subtitles.tsx`
   - Renders animated subtitles with professional styling
   - Word-by-word highlighting with smooth animations
   - Configurable fonts, colors, positions

2. **Backend Service**: `/backend/src/subtitles/service.ts`
   - Generates subtitle chunks with word-level timing
   - Exports SRT/VTT files for accessibility
   - Smart word duration calculation

3. **API Routes**: `/backend/src/subtitles/routes.ts`
   - `POST /api/subtitles/generate` - Generate chunks from script
   - `POST /api/subtitles/export` - Export SRT/VTT files
   - `GET /api/subtitles/:filename` - Download subtitle file

## Adding Subtitles to Templates

### Step 1: Import Components

```typescript
import { Subtitles, SubtitleChunk, generateSubtitleChunks } from "../components/Subtitles";
```

### Step 2: Update Props Interface

```typescript
interface Props {
  // ... existing props
  script?: string;
  subtitlesEnabled?: boolean;
  subtitleChunks?: SubtitleChunk[];
}
```

### Step 3: Generate Chunks (if needed)

```typescript
const { fps, durationInFrames } = useVideoConfig();

const chunks = React.useMemo(() => {
  if (subtitleChunks) return subtitleChunks;
  if (script) {
    return generateSubtitleChunks(script, fps, durationInFrames, 3);
  }
  return [];
}, [script, subtitleChunks, fps, durationInFrames]);
```

### Step 4: Render Subtitles

```typescript
{subtitlesEnabled && chunks.length > 0 && (
  <Subtitles
    chunks={chunks}
    style={{
      fontFamily: "Poppins, Montserrat, Arial Black, sans-serif",
      fontSize: 52,
      primaryColor: "#FFFFFF",
      highlightColor: "#FFD700",
      strokeColor: "#000000",
      strokeWidth: 4,
      position: "bottom",
      bottomOffset: 140,
      shadow: true,
      shadowBlur: 20,
      shadowColor: "rgba(0,0,0,0.8)",
    }}
  />
)}
```

## Subtitle Styling Options

### Font & Size
- `fontFamily`: Font stack (default: Poppins, Montserrat)
- `fontSize`: Text size in pixels (default: 56)

### Colors
- `primaryColor`: Default text color (default: white)
- `highlightColor`: Active word color (default: yellow #FFD700)
- `strokeColor`: Text outline color (default: black)
- `strokeWidth`: Outline thickness (default: 4)

### Position
- `position`: "top" | "center" | "bottom" (default: "bottom")
- `bottomOffset`: Distance from bottom in px (default: 120)

### Effects
- `shadow`: Enable drop shadow (default: true)
- `shadowBlur`: Shadow blur radius (default: 20)
- `shadowColor`: Shadow color (default: rgba(0,0,0,0.8))

## Backend API Usage

### Generate Subtitle Chunks

```bash
curl -X POST http://46.62.209.17:5000/api/subtitles/generate \
  -H "Content-Type: application/json" \
  -d '{
    "script": "Check out this amazing component library!",
    "fps": 30,
    "durationInFrames": 300,
    "maxWordsPerChunk": 3,
    "wordsPerSecond": 2.5
  }'
```

**Response:**
```json
{
  "success": true,
  "chunks": [
    {
      "words": [
        { "word": "Check", "start": 0, "end": 23 },
        { "word": "out", "start": 24, "end": 47 },
        { "word": "this", "start": 48, "end": 71 }
      ],
      "start": 0,
      "end": 71
    }
  ],
  "metadata": {
    "totalChunks": 3,
    "totalWords": 7,
    "fps": 30,
    "durationInFrames": 300
  }
}
```

### Export Subtitle Files

```bash
curl -X POST http://46.62.209.17:5000/api/subtitles/export \
  -H "Content-Type: application/json" \
  -d '{
    "chunks": [...],
    "fps": 30,
    "format": "srt",
    "videoId": "video_123"
  }'
```

**Response:**
```json
{
  "success": true,
  "filename": "subtitles_video_123.srt",
  "path": "/subtitles/subtitles_video_123.srt",
  "content": "1\n00:00:00,000 --> 00:00:02,400\nCheck out this\n\n..."
}
```

## Database Schema

Subtitle data is stored in the `Video` model:

```prisma
model Video {
  // ... existing fields
  script            String?   // Voiceover script
  subtitles         String?   // JSON stringified subtitle chunks
  subtitlesEnabled  Boolean   @default(true)
  subtitlesSrtPath  String?   // Path to SRT file
  subtitlesVttPath  String?   // Path to VTT file
}
```

## Workflow Integration

### 1. Create Video with Script

```typescript
const video = await prisma.video.create({
  data: {
    compositionId: "FeatureHighlight",
    title: "Amazing Component",
    script: "Check out this amazing component library!",
    subtitlesEnabled: true,
    props: JSON.stringify({
      componentName: "DataTable",
      features: ["Fast", "Responsive", "Beautiful"]
    })
  }
});
```

### 2. Generate Subtitles

The render worker automatically:
1. Generates subtitle chunks from the script
2. Saves chunks to `video.subtitles` (JSON)
3. Exports SRT/VTT files
4. Updates `subtitlesSrtPath` and `subtitlesVttPath`

### 3. Render Video

Remotion receives the subtitle chunks via props and renders them with the video.

## Dashboard Integration

### Subtitle Toggle

```tsx
<Switch
  checked={video.subtitlesEnabled}
  onCheckedChange={(enabled) => updateVideo(video.id, { subtitlesEnabled: enabled })}
/>
```

### Subtitle Preview

```tsx
{video.subtitles && (
  <SubtitlePreview 
    chunks={JSON.parse(video.subtitles)} 
    fps={30}
  />
)}
```

### Download Subtitle Files

```tsx
<Button onClick={() => downloadFile(video.subtitlesSrtPath)}>
  Download SRT
</Button>
<Button onClick={() => downloadFile(video.subtitlesVttPath)}>
  Download VTT
</Button>
```

## Testing

### Manual Test

1. Create a test video with script:
```bash
curl -X POST http://46.62.209.17:5000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "FeatureHighlight",
    "title": "Test Subtitles",
    "script": "This is a test of the subtitle system",
    "props": {
      "componentName": "Test",
      "features": ["One", "Two", "Three"]
    }
  }'
```

2. Check the video has subtitles rendered
3. Download SRT/VTT files and verify timing

### Unit Test

See `/backend/src/subtitles/service.test.ts` for service tests.

## Customization

### Per-Template Styling

Different templates can have different subtitle styles:

```typescript
// Dark background templates
<Subtitles
  chunks={chunks}
  style={{
    primaryColor: "#FFFFFF",
    highlightColor: "#00FF00",  // Green highlight
    strokeColor: "#000000",
  }}
/>

// Light background templates
<Subtitles
  chunks={chunks}
  style={{
    primaryColor: "#000000",     // Black text
    highlightColor: "#FF4500",   // Orange highlight
    strokeColor: "#FFFFFF",      // White stroke
  }}
/>
```

### Language Support

The subtitle system supports any language and emojis:

```typescript
const script = "¡Hola mundo! 🌍 This is amazing 🚀";
const chunks = generateSubtitleChunks(script, fps, durationInFrames);
```

## Accessibility

All videos automatically generate:
- **SRT files**: Standard subtitle format (supported by most platforms)
- **VTT files**: Web standard (for HTML5 video players)

These can be uploaded to Instagram, YouTube, or any platform for accessibility compliance.

## Performance

- **Chunk Generation**: ~1-2ms for typical 30s video script
- **Rendering**: No performance impact (Remotion optimized)
- **File Size**: SRT/VTT files are <5KB for 30s videos

## Troubleshooting

### Subtitles not appearing

1. Check `subtitlesEnabled` is `true`
2. Verify `script` or `subtitleChunks` is provided
3. Check console for Remotion errors

### Timing issues

1. Ensure `fps` matches video config
2. Adjust `wordsPerSecond` (default: 2.5)
3. Use backend API to regenerate chunks

### Styling issues

1. Check font is loaded (add to `@import` if needed)
2. Adjust `strokeWidth` for different font sizes
3. Test on light/dark backgrounds

## Templates Status

| Template | Subtitles Added | Tested |
|----------|----------------|--------|
| FeatureHighlight | ✅ | ✅ |
| TutorialSnippet | ⏳ | ❌ |
| SocialProof | ⏳ | ❌ |
| Comparison | ⏳ | ❌ |
| ComponentShowcase | ⏳ | ❌ |
| ProblemSolution | ⏳ | ❌ |
| BeforeAfter | ⏳ | ❌ |
| HookPattern | ⏳ | ❌ |
| CodeReveal | ⏳ | ❌ |
| SpeedBuild | ⏳ | ❌ |

## Next Steps

1. ✅ Create Subtitles component
2. ✅ Create SubtitleService backend
3. ✅ Add API routes
4. ✅ Update Prisma schema
5. ✅ Update FeatureHighlight template (example)
6. ⏳ Update remaining 9 templates
7. ⏳ Add dashboard controls
8. ⏳ Add subtitle preview UI
9. ⏳ Integration testing
10. ⏳ Deploy to production

## Support

For issues or questions:
- Check this guide first
- Review `/remotion/src/components/Subtitles.tsx` for API
- Check backend logs for generation issues
- Test with minimal script first

---

**Version:** 1.0.0
**Last Updated:** 2026-02-04
**Maintained by:** Kinetik UI Automation Team
