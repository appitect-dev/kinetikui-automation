import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Props {
  leftTitle: string;
  rightTitle: string;
  leftPoints: string[];
  rightPoints: string[];
}

export const Comparison: React.FC<Props> = ({ leftTitle, rightTitle, leftPoints, rightPoints }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#1a1a1a",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        padding: "100px 0",
      }}
    >
      {/* VS text in center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 120,
          fontWeight: 900,
          color: "white",
          opacity: interpolate(frame, [60, 80], [0, 0.1], {
            extrapolateRight: "clamp",
          }),
          zIndex: 0,
        }}
      >
        VS
      </div>

      {/* Left side (competitor) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 40px",
          backgroundColor: "rgba(255, 107, 107, 0.1)",
          borderRight: "2px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            fontSize: 44,
            fontWeight: 900,
            color: "#ff6b6b",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          {leftTitle}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          {leftPoints.map((point, i) => {
            const delay = 40 + i * 20;
            const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  opacity,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    color: "#ff6b6b",
                  }}
                >
                  ✗
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: "#ccc",
                    textAlign: "left",
                  }}
                >
                  {point}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side (Kinetik UI) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 40px",
          backgroundColor: "rgba(52, 211, 153, 0.1)",
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            fontSize: 44,
            fontWeight: 900,
            color: "#34d399",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          {rightTitle}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          {rightPoints.map((point, i) => {
            const delay = 100 + i * 20;
            const progress = spring({
              frame: frame - delay,
              fps,
              config: {
                damping: 20,
              },
            });

            const x = interpolate(progress, [0, 1], [50, 0]);
            const opacity = interpolate(progress, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    color: "#34d399",
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: "white",
                    fontWeight: 600,
                    textAlign: "left",
                  }}
                >
                  {point}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Winner badge */}
      {frame > 250 && (
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 120,
            backgroundColor: "#34d399",
            color: "white",
            fontSize: 36,
            fontWeight: 900,
            padding: "20px 40px",
            borderRadius: 50,
            transform: `rotate(15deg) scale(${interpolate(frame, [250, 270], [0, 1], {
              extrapolateRight: "clamp",
            })})`,
            boxShadow: "0 10px 40px rgba(52, 211, 153, 0.5)",
          }}
        >
          WINNER! 🏆
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
