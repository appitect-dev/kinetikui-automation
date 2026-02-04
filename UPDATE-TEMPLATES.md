# 📋 Template Update Checklist

This guide walks you through adding subtitle support to each Remotion template.

## Quick Reference

**Files to update per template:**
- `/remotion/src/templates/[TemplateName].tsx`

**Changes needed:**
1. Add imports
2. Update Props interface
3. Add props destructuring
4. Update useVideoConfig
5. Add subtitle generation logic
6. Render Subtitles component

## Step-by-Step Guide

### 1. Add Imports

At the top of the file, add:

```typescript
import { Subtitles, SubtitleChunk, generateSubtitleChunks } from "../components/Subtitles";
```

### 2. Update Props Interface

Add these fields to the `Props` interface:

```typescript
interface Props {
  // ... existing props
  script?: string;
  subtitlesEnabled?: boolean;
  subtitleChunks?: SubtitleChunk[];
}
```

### 3. Update Component Props Destructuring

In the component function signature:

```typescript
export const TemplateName: React.FC<Props> = ({ 
  // ... existing props,
  script,
  subtitlesEnabled = true,
  subtitleChunks
}) => {
```

### 4. Update useVideoConfig

Change:
```typescript
const { fps } = useVideoConfig();
```

To:
```typescript
const { fps, durationInFrames } = useVideoConfig();
```

### 5. Add Subtitle Generation Logic

After `useVideoConfig()`, add:

```typescript
// Generate subtitle chunks if script is provided but chunks aren't
const chunks = React.useMemo(() => {
  if (subtitleChunks) return subtitleChunks;
  if (script) {
    return generateSubtitleChunks(script, fps, durationInFrames, 3);
  }
  return [];
}, [script, subtitleChunks, fps, durationInFrames]);
```

### 6. Add Subtitles Component

Before the closing `</AbsoluteFill>` tag, add:

```typescript
{/* Subtitles Overlay */}
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

## Template-Specific Adjustments

### Dark Background Templates
- FeatureHighlight
- TutorialSnippet
- ComponentShowcase
- HookPattern
- SpeedBuild

Use default styling (white text, yellow highlight).

### Light Background Templates
- BeforeAfter (if has light sections)
- Comparison (if has light sections)

Consider:
```typescript
primaryColor: "#000000",     // Black text
highlightColor: "#FF4500",   // Orange highlight
strokeColor: "#FFFFFF",      // White stroke
```

### Special Cases

**CodeReveal:**
- Position: `"top"` (code is usually at bottom)
- Smaller font: `fontSize: 44`

**SpeedBuild:**
- Faster animations (already has quick transitions)
- Consider: `bottomOffset: 180` (more clearance)

**SocialProof:**
- If has testimonial text at bottom, use: `position: "top"`

## Testing Each Template

1. Open Remotion Studio:
   ```bash
   cd remotion && npm start
   ```

2. Select the template

3. Add test props:
   ```json
   {
     "script": "This is a test of the subtitle system with animated words",
     "subtitlesEnabled": true
   }
   ```

4. Verify:
   - Subtitles appear
   - Words highlight correctly
   - Timing is smooth
   - No overlap with other elements
   - Positioning looks good

## Checklist

- [ ] **FeatureHighlight** - ✅ Already done (example)
- [ ] **TutorialSnippet** - Needs update
- [ ] **SocialProof** - Needs update
- [ ] **Comparison** - Needs update
- [ ] **ComponentShowcase** - Needs update
- [ ] **ProblemSolution** - Needs update
- [ ] **BeforeAfter** - Needs update
- [ ] **HookPattern** - Needs update
- [ ] **CodeReveal** - Needs update (special position)
- [ ] **SpeedBuild** - Needs update

## Automated Script

For batch updates, run:

```bash
npx ts-node scripts/add-subtitles-to-templates.ts
```

**Note:** Review changes before committing! The script creates `.backup` files.

## Common Issues

### Issue: Subtitles overlap with content
**Solution:** Adjust `bottomOffset` or change `position` to `"top"`

### Issue: Text too small/large
**Solution:** Adjust `fontSize` (range: 40-60 recommended)

### Issue: Timing feels off
**Solution:** In backend, adjust `wordsPerSecond` when generating chunks

### Issue: Can't read text on certain backgrounds
**Solution:** Increase `strokeWidth` or adjust colors

## After Updates

1. Test all templates in Remotion Studio
2. Generate test videos for each
3. Review on mobile (9:16 aspect ratio)
4. Commit changes:
   ```bash
   git add remotion/src/templates/
   git commit -m "Add subtitle support to all templates"
   git push
   ```

5. Update backend if deployed
6. Test full workflow (create video → render → subtitles appear)

---

**Need help?** Check `SUBTITLES-GUIDE.md` for full API reference.
