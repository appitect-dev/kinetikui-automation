import { Composition } from "remotion";
import { ComponentShowcase } from "./templates/ComponentShowcase";
import { CodeReveal } from "./templates/CodeReveal";
import { BeforeAfter } from "./templates/BeforeAfter";
import { FeatureHighlight } from "./templates/FeatureHighlight";
import { SpeedBuild } from "./templates/SpeedBuild";
import { HookPattern } from "./templates/HookPattern";
import { ProblemSolution } from "./templates/ProblemSolution";
import { Comparison } from "./templates/Comparison";
import { TutorialSnippet } from "./templates/TutorialSnippet";
import { SocialProof } from "./templates/SocialProof";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ComponentShowcase"
        component={ComponentShowcase}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "Kinetik UI Components",
          components: [
            "AnimatedButton",
            "SwipeCard",
            "ParallaxScroll",
            "MorphingText",
            "GlassMorphism",
            "FloatingDock",
          ],
        }}
      />

      <Composition
        id="CodeReveal"
        component={CodeReveal}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          code: `import { AnimatedButton } from '@kinetikui/core';\n\n<AnimatedButton\n  variant="glow"\n  onClick={() => alert('Clicked!')}\n>\n  Get Started\n</AnimatedButton>`,
          componentName: "AnimatedButton",
        }}
      />

      <Composition
        id="BeforeAfter"
        component={BeforeAfter}
        durationInFrames={330}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          beforeTitle: "Before: Boring UI",
          afterTitle: "After: Kinetik Magic ✨",
        }}
      />

      <Composition
        id="FeatureHighlight"
        component={FeatureHighlight}
        durationInFrames={390}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          componentName: "SwipeCard",
          features: [
            "Smooth gesture animations",
            "Spring physics",
            "Auto-snap points",
            "Touch & mouse support",
            "TypeScript ready",
          ],
        }}
      />

      <Composition
        id="SpeedBuild"
        component={SpeedBuild}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          projectName: "Modern Dashboard",
          steps: [
            "Install Kinetik UI",
            "Import components",
            "Add animations",
            "Customize theme",
            "Ship it! 🚀",
          ],
        }}
      />

      <Composition
        id="HookPattern"
        component={HookPattern}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hookText: "POV: You just discovered Kinetik UI",
          feature: "useGesture()",
        }}
      />

      <Composition
        id="ProblemSolution"
        component={ProblemSolution}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          problem: "Spending hours on animation code",
          solution: "Copy-paste Kinetik components",
        }}
      />

      <Composition
        id="Comparison"
        component={Comparison}
        durationInFrames={330}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          leftTitle: "Other Libraries",
          rightTitle: "Kinetik UI",
          leftPoints: ["Complex setup", "Heavy bundle", "Limited animations"],
          rightPoints: ["Drop-in ready", "Tiny bundle", "60+ animations"],
        }}
      />

      <Composition
        id="TutorialSnippet"
        component={TutorialSnippet}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "Add a Floating Dock",
          steps: [
            { text: "Import the component", duration: 90 },
            { text: "Pass your icons", duration: 120 },
            { text: "Customize colors", duration: 120 },
            { text: "Done! That's it 🎉", duration: 120 },
          ],
        }}
      />

      <Composition
        id="SocialProof"
        component={SocialProof}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          stats: [
            { label: "Downloads", value: "10K+" },
            { label: "Components", value: "60+" },
            { label: "Satisfaction", value: "100%" },
          ],
          testimonial: "Best UI library for animations! - @developer",
        }}
      />
    </>
  );
};
