import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Props {
  projectName: string;
  steps: string[];
}

export const SpeedBuild: React.FC<Props> = ({ projectName, steps }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const stepsPerFrame = 60; // Each step gets 60 frames (2 seconds)

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 80px",
      }}
    >
      {/* Project name */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 64,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          marginBottom: 100,
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        Building: {projectName}
      </div>

      {/* Steps timeline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          width: "100%",
        }}
      >
        {steps.map((step, i) => {
          const stepStartFrame = 40 + i * stepsPerFrame;
          const stepEndFrame = stepStartFrame + stepsPerFrame;
          const isActive = frame >= stepStartFrame && frame < stepEndFrame;
          const isDone = frame >= stepEndFrame;

          const opacity = interpolate(frame, [stepStartFrame - 10, stepStartFrame], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const scale = isActive
            ? interpolate(frame, [stepStartFrame, stepStartFrame + 10], [1, 1.05], {
                extrapolateRight: "clamp",
              })
            : 1;

          return (
            <div
              key={i}
              style={{
                opacity: frame >= stepStartFrame - 10 ? opacity : 0,
                transform: `scale(${scale})`,
                display: "flex",
                alignItems: "center",
                gap: 30,
                backgroundColor: isActive
                  ? "rgba(52, 211, 153, 0.2)"
                  : isDone
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                padding: "30px 40px",
                borderRadius: 16,
                border: isActive
                  ? "2px solid rgba(52, 211, 153, 0.8)"
                  : "2px solid rgba(255,255,255,0.2)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Step number / checkmark */}
              <div
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: isDone ? "#34d399" : "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: isDone ? 44 : 36,
                  fontWeight: 900,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>

              {/* Step text */}
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {step}
              </div>

              {/* Loading indicator for active step */}
              {isActive && (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    border: "4px solid rgba(255,255,255,0.3)",
                    borderTop: "4px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginLeft: "auto",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Final CTA */}
      {frame > 40 + steps.length * stepsPerFrame && (
        <div
          style={{
            marginTop: 80,
            fontSize: 52,
            fontWeight: 900,
            color: "#34d399",
            textAlign: "center",
            opacity: interpolate(
              frame,
              [40 + steps.length * stepsPerFrame, 40 + steps.length * stepsPerFrame + 20],
              [0, 1],
              { extrapolateRight: "clamp" }
            ),
          }}
        >
          Done! 🎉
        </div>
      )}

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
