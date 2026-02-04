import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Props {
  beforeTitle: string;
  afterTitle: string;
}

export const BeforeAfter: React.FC<Props> = ({ beforeTitle, afterTitle }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const slideProgress = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 30,
      mass: 1,
    },
  });

  const slideX = interpolate(slideProgress, [0, 1], [0, -width]);

  // Shake animation for "before"
  const shakeX =
    frame < 60
      ? Math.sin(frame * 0.5) * interpolate(frame, [20, 50], [0, 5], { extrapolateRight: "clamp" })
      : 0;

  return (
    <AbsoluteFill
      style={{
        background: "#f0f0f0",
        fontFamily: "Inter, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Before section */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `translateX(${slideX + shakeX}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e0e0e0",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#666",
            marginBottom: 80,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {beforeTitle}
        </div>

        {/* Boring static box */}
        <div
          style={{
            width: 400,
            height: 400,
            backgroundColor: "#ccc",
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 36,
            color: "#999",
            fontWeight: 600,
          }}
        >
          Static 😴
        </div>
      </div>

      {/* After section */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `translateX(${slideX + width}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "white",
            marginBottom: 80,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {afterTitle}
        </div>

        {/* Animated glowing box */}
        <div
          style={{
            width: 400,
            height: 400,
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            borderRadius: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 36,
            color: "white",
            fontWeight: 700,
            boxShadow:
              frame > 60
                ? `0 0 ${interpolate(Math.sin(frame * 0.2), [-1, 1], [20, 60])}px rgba(240, 147, 251, 0.8)`
                : "none",
            transform:
              frame > 60
                ? `scale(${interpolate(Math.sin(frame * 0.15), [-1, 1], [0.95, 1.05])})`
                : "scale(1)",
          }}
        >
          Animated ✨
        </div>
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
          color: frame > 60 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.6)",
          transform: `translateX(${slideX}px)`,
        }}
      >
        @kinetikui
      </div>
    </AbsoluteFill>
  );
};
