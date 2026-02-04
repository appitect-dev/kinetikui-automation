# Remotion Templates - Setup & Usage

Guide for working with Remotion video templates.

## Quick Start

```bash
cd remotion
npm install
npm start  # Opens Remotion Studio
```

Studio opens at: http://localhost:3000

## Template Overview

All templates are 1080x1920 (9:16 vertical for Instagram Reels), 30fps, 7-15 seconds.

### 1. ComponentShowcase

**Purpose**: Display grid of animated components

**Props:**
```typescript
{
  title: string;          // Main title
  components: string[];   // Array of component names
}
```

**Example:**
```json
{
  "title": "Kinetik UI Components",
  "components": ["AnimatedButton", "SwipeCard", "ParallaxScroll"]
}
```

**Best for**: Library overview, feature showcase

---

### 2. CodeReveal

**Purpose**: Typing animation showing code

**Props:**
```typescript
{
  code: string;           // Code to type out
  componentName: string;  // Component name in title
}
```

**Example:**
```json
{
  "code": "import { Button } from '@kinetikui/core';\n\n<Button variant=\"glow\">Click me</Button>",
  "componentName": "AnimatedButton"
}
```

**Best for**: Code tutorials, API examples

---

### 3. BeforeAfter

**Purpose**: Show transformation from static to animated

**Props:**
```typescript
{
  beforeTitle: string;  // Title for "before" state
  afterTitle: string;   // Title for "after" state
}
```

**Example:**
```json
{
  "beforeTitle": "Before: Boring UI",
  "afterTitle": "After: Kinetik Magic ✨"
}
```

**Best for**: Problem/solution, transformation demos

---

### 4. FeatureHighlight

**Purpose**: List component features with checkmarks

**Props:**
```typescript
{
  componentName: string;  // Component name
  features: string[];     // Array of features (max 5-6)
}
```

**Example:**
```json
{
  "componentName": "SwipeCard",
  "features": [
    "Smooth gesture animations",
    "Spring physics",
    "Auto-snap points",
    "Touch & mouse support"
  ]
}
```

**Best for**: Feature lists, selling points

---

### 5. SpeedBuild

**Purpose**: Timelapse showing build steps

**Props:**
```typescript
{
  projectName: string;   // Project name
  steps: string[];       // Array of steps
}
```

**Example:**
```json
{
  "projectName": "Modern Dashboard",
  "steps": [
    "Install Kinetik UI",
    "Import components",
    "Add animations",
    "Ship it! 🚀"
  ]
}
```

**Best for**: Tutorials, quick wins

---

### 6. HookPattern

**Purpose**: "POV: You just discovered X" viral format

**Props:**
```typescript
{
  hookText: string;   // The hook/POV text
  feature: string;    // Feature to highlight
}
```

**Example:**
```json
{
  "hookText": "POV: You just discovered Kinetik UI",
  "feature": "useGesture()"
}
```

**Best for**: Viral content, discovery moments

---

### 7. ProblemSolution

**Purpose**: Show problem then solution (slide transition)

**Props:**
```typescript
{
  problem: string;    // The problem statement
  solution: string;   // The solution statement
}
```

**Example:**
```json
{
  "problem": "Spending hours on animation code",
  "solution": "Copy-paste Kinetik components"
}
```

**Best for**: Value proposition, pain points

---

### 8. Comparison

**Purpose**: Side-by-side comparison (us vs them)

**Props:**
```typescript
{
  leftTitle: string;       // Competitor title
  rightTitle: string;      // Our title
  leftPoints: string[];    // Their cons
  rightPoints: string[];   // Our pros
}
```

**Example:**
```json
{
  "leftTitle": "Other Libraries",
  "rightTitle": "Kinetik UI",
  "leftPoints": ["Complex setup", "Heavy bundle", "Limited animations"],
  "rightPoints": ["Drop-in ready", "Tiny bundle", "60+ animations"]
}
```

**Best for**: Competitive positioning

---

### 9. TutorialSnippet

**Purpose**: Step-by-step tutorial

**Props:**
```typescript
{
  title: string;
  steps: Array<{
    text: string;
    duration: number;  // Frames (90 = 3 seconds at 30fps)
  }>;
}
```

**Example:**
```json
{
  "title": "Add a Floating Dock",
  "steps": [
    { "text": "Import the component", "duration": 90 },
    { "text": "Pass your icons", "duration": 120 },
    { "text": "Customize colors", "duration": 120 }
  ]
}
```

**Best for**: How-to guides, tutorials

---

### 10. SocialProof

**Purpose**: Stats and testimonials

**Props:**
```typescript
{
  stats: Array<{
    label: string;
    value: string;
  }>;
  testimonial: string;
}
```

**Example:**
```json
{
  "stats": [
    { "label": "Downloads", "value": "10K+" },
    { "label": "Components", "value": "60+" },
    { "label": "Satisfaction", "value": "100%" }
  ],
  "testimonial": "Best UI library for animations! - @developer"
}
```

**Best for**: Trust building, social proof

---

## Customizing Templates

### Edit a Template

1. Open template file: `src/templates/{TemplateName}.tsx`
2. Modify styles, animations, or layout
3. Save and view in Remotion Studio
4. Refresh browser to see changes

### Common Customizations

**Change colors:**
```typescript
// Find gradient
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

// Replace with your brand colors
background: "linear-gradient(135deg, #yourColor1 0%, #yourColor2 100%)"
```

**Adjust timing:**
```typescript
// Find interpolate/spring
const opacity = interpolate(frame, [0, 20], [0, 1])
                                    // ↑ change these frame numbers
```

**Change fonts:**
```typescript
fontFamily: "Inter, Arial, sans-serif"  // Change to your font
```

### Creating New Templates

1. Copy existing template as starting point
2. Create new file: `src/templates/YourTemplate.tsx`
3. Update `src/Root.tsx`:
   ```typescript
   import { YourTemplate } from "./templates/YourTemplate";
   
   <Composition
     id="YourTemplate"
     component={YourTemplate}
     durationInFrames={300}
     fps={30}
     width={1080}
     height={1920}
     defaultProps={{
       // your props
     }}
   />
   ```

## Rendering Videos

### Via Remotion Studio

1. Open Studio: `npm start`
2. Select composition
3. Click **Render** button
4. Choose output location

### Via CLI

```bash
# Render single composition
npx remotion render src/index.ts ComponentShowcase output.mp4

# With custom props
npx remotion render src/index.ts ComponentShowcase output.mp4 \
  --props='{"title":"My Title","components":["A","B","C"]}'

# With specific frames (for testing)
npx remotion render src/index.ts ComponentShowcase output.mp4 \
  --frames=0-90
```

### Via Backend API (Recommended)

Let the backend handle rendering:

```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "ComponentShowcase",
    "title": "My Video",
    "props": {
      "title": "Kinetik UI",
      "components": ["A", "B", "C"]
    }
  }'
```

## Troubleshooting

### Template not showing in Studio

- Check `src/Root.tsx` - is it registered?
- Restart dev server: Stop and run `npm start`
- Check browser console for errors

### Render fails

- Check Node.js version: `node --version` (needs 18+)
- Clear cache: `rm -rf node_modules/.cache`
- Check terminal for errors

### Slow rendering

- Reduce `durationInFrames` for testing
- Lower `fps` temporarily (e.g., 15fps)
- Disable heavy animations
- Use `--concurrency=8` flag

### Props not updating

- Stop Remotion Studio
- Clear cache
- Restart: `npm start`
- Or use "Reload" button in Studio

## Performance Tips

1. **Use springs instead of interpolate** - smoother, more natural
2. **Avoid heavy effects** - shadows, blurs slow rendering
3. **Optimize images** - compress before using
4. **Limit particles/complex animations** - keep it simple
5. **Test render time** - aim for <2 min per 15sec video

## Best Practices

### Consistent Branding

- Always include `@kinetikui` watermark
- Use consistent colors (purple gradient)
- Same font family across templates
- Maintain 9:16 aspect ratio

### Animation Quality

- **Smooth**: Use spring physics
- **Readable**: Text on screen >2 seconds
- **Engaging**: Movement from frame 1
- **Clear**: Avoid clutter

### Accessibility

- High contrast text/background
- Large font sizes (min 32px)
- Clear visual hierarchy
- Avoid rapid flashing

## Advanced: Component Integration

To showcase real Kinetik UI components:

1. Install Kinetik UI in remotion project:
   ```bash
   npm install @kinetikui/core
   ```

2. Import in template:
   ```typescript
   import { AnimatedButton } from '@kinetikui/core';
   ```

3. Use in template:
   ```typescript
   <AnimatedButton variant="glow">
     Click me
   </AnimatedButton>
   ```

Note: Some components may need DOM/browser APIs - mock if needed.

## Resources

- [Remotion Docs](https://remotion.dev)
- [Remotion Discord](https://remotion.dev/discord)
- [Example Templates](https://github.com/remotion-dev/template-examples)
- [Animation Timing](https://easings.net)

## Next Steps

1. Explore templates in Studio
2. Customize brand colors
3. Test render times
4. Create production videos via backend
5. Monitor output quality

## Support

Issues with templates?
- Check Remotion console logs
- Review `remotion.config.ts`
- Test in Studio before backend render
- Check backend logs: `backend/error.log`
