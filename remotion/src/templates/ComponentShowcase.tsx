import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Props {
  title: string;
  components: string[];
}

export const ComponentShowcase: React.FC<Props> = ({ title, components }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0, 30], [-50, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 60px",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 72,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          marginBottom: 100,
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {title}
      </div>

      {/* Grid of components */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
          width: "100%",
        }}
      >
        {components.map((comp, i) => {
          const delay = 40 + i * 8;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 20,
              mass: 0.5,
            },
          });

          const scale = interpolate(progress, [0, 1], [0.5, 1]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: 24,
                padding: "40px 30px",
                transform: `scale(${scale})`,
                opacity,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "white",
                  textAlign: "center",
                }}
              >
                {comp}
              </div>
              <div
                style={{
                  width: 60,
                  height: 4,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: 2,
                  margin: "20px auto 0",
                }}
              />
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
