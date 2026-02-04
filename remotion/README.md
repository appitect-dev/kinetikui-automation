# Kinetik UI Remotion Templates

10 production-ready video templates for Instagram Reels (1080x1920, 9:16).

## Setup

```bash
npm install
npm start  # Opens Remotion Studio
```

## Templates

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

## Rendering

```bash
# Render single composition
npx remotion render src/index.ts ComponentShowcase output.mp4

# Or use the backend API (recommended)
```

## Customization

Edit `src/Root.tsx` to modify composition props. All templates accept customizable props defined in their interfaces.

## Audio

Templates include visual placeholder for audio. Add trending sounds during post-processing or via backend automation.
