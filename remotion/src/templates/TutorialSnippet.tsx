import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Step {
  text: string;
  duration: number;
}

interface Props {
  title: string;
  steps: Step[];
}

export const TutorialSnippet: React.FC<Props> = ({ title, steps }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Calculate which step is active
  let accumulatedFrames = 50; // Start after title animation
  let currentStepIndex = -1;

  for (let i = 0; i < steps.length; i++) {
    if (frame >= accumulatedFrames && frame < accumulatedFrames + steps[i].duration) {
      currentStepIndex = i;
      break;
    }
    accumulatedFrames += steps[i].duration;
  }

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "120px 80px",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 64,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          marginBottom: 120,
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {title}
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 50,
          width: "100%",
        }}
      >
        {steps.map((step, i) => {
          const stepStartFrame = 50 + steps.slice(0, i).reduce((sum, s) => sum + s.duration, 0);
          const isActive = i === currentStepIndex;
          const isPast = i < currentStepIndex;

          const opacity = frame >= stepStartFrame ? 1 : 0.3;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 35,
                transform: isActive ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: isPast
                    ? "#34d399"
                    : isActive
                    ? "white"
                    : "rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: isPast ? 48 : 42,
                  fontWeight: 900,
                  color: isPast ? "white" : isActive ? "#667eea" : "white",
                  flexShrink: 0,
                  border: isActive ? "4px solid white" : "none",
                }}
              >
                {isPast ? "✓" : i + 1}
              </div>

              {/* Step text */}
              <div
                style={{
                  opacity,
                  fontSize: 44,
                  fontWeight: 700,
                  color: "white",
                  backgroundColor: isActive ? "rgba(0,0,0,0.2)" : "transparent",
                  padding: isActive ? "20px 30px" : "20px 0",
                  borderRadius: 16,
                  flex: 1,
                }}
              >
                {step.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 32,
          fontWeight: 600,
          color: "rgba(255,255,255,0.9)",
        }}
      >
        @kinetikui
      </div>
    </AbsoluteFill>
  );
};
