import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Props {
  componentName: string;
  features: string[];
}

export const FeatureHighlight: React.FC<Props> = ({ componentName, features }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 80px",
      }}
    >
      {/* Component name */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 68,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          marginBottom: 80,
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {componentName}
      </div>

      {/* Feature list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 35,
          width: "100%",
        }}
      >
        {features.map((feature, i) => {
          const delay = 40 + i * 25;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 25,
              mass: 0.8,
            },
          });

          const x = interpolate(progress, [0, 1], [-100, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                transform: `translateX(${x}px)`,
                opacity,
                display: "flex",
                alignItems: "center",
                gap: 25,
              }}
            >
              {/* Checkmark */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 36,
                  flexShrink: 0,
                  border: "2px solid white",
                }}
              >
                ✓
              </div>

              {/* Feature text */}
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {feature}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {frame > 250 && (
        <div
          style={{
            marginTop: 80,
            fontSize: 44,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            opacity: interpolate(frame, [250, 280], [0, 1], {
              extrapolateRight: "clamp",
            }),
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: "25px 50px",
            borderRadius: 20,
          }}
        >
          Get Started →
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
