import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Props {
  hookText: string;
  feature: string;
}

export const HookPattern: React.FC<Props> = ({ hookText, feature }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom in effect
  const zoomProgress = spring({
    frame: frame - 20,
    fps,
    config: {
      damping: 30,
      mass: 1,
    },
  });

  const scale = interpolate(zoomProgress, [0, 1], [1.5, 1]);
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Feature reveal
  const featureOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateRight: "clamp",
  });

  const featureY = interpolate(frame, [120, 150], [50, 0], {
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowIntensity = interpolate(Math.sin(frame * 0.1), [-1, 1], [30, 60]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 80px",
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* POV text */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          marginBottom: 60,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        POV:
      </div>

      {/* Hook text */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#f0f0f0",
          textAlign: "center",
          marginBottom: 120,
          lineHeight: 1.4,
          maxWidth: "90%",
        }}
      >
        {hookText}
      </div>

      {/* Feature showcase */}
      {frame > 120 && (
        <div
          style={{
            opacity: featureOpacity,
            transform: `translateY(${featureY}px)`,
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            padding: "60px 80px",
            borderRadius: 30,
            border: "2px solid rgba(255,255,255,0.2)",
            boxShadow: `0 0 ${glowIntensity}px rgba(96, 165, 250, 0.6)`,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: "#60a5fa",
              textAlign: "center",
              fontFamily: "'Fira Code', monospace",
            }}
          >
            {feature}
          </div>
        </div>
      )}

      {/* Mind blown emoji */}
      {frame > 200 && (
        <div
          style={{
            marginTop: 80,
            fontSize: 120,
            opacity: interpolate(frame, [200, 220], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(frame, [200, 230], [0.5, 1.2], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          🤯
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
