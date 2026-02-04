import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Props {
  problem: string;
  solution: string;
}

export const ProblemSolution: React.FC<Props> = ({ problem, solution }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const problemOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Transition to solution
  const transitionProgress = spring({
    frame: frame - 120,
    fps,
    config: {
      damping: 30,
    },
  });

  const slideX = interpolate(transitionProgress, [0, 1], [0, -width]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Problem section */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `translateX(${slideX}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #434343 0%, #000000 100%)",
          padding: "100px 80px",
        }}
      >
        <div
          style={{
            opacity: problemOpacity,
            fontSize: 64,
            fontWeight: 900,
            color: "#ff6b6b",
            marginBottom: 80,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Problem
        </div>

        <div
          style={{
            opacity: problemOpacity,
            fontSize: 52,
            fontWeight: 600,
            color: "white",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "85%",
          }}
        >
          {problem}
        </div>

        {/* Sad emoji */}
        {frame > 60 && (
          <div
            style={{
              marginTop: 80,
              fontSize: 140,
              opacity: interpolate(frame, [60, 90], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            😫
          </div>
        )}
      </div>

      {/* Solution section */}
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
          background: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
          padding: "100px 80px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            marginBottom: 80,
            textTransform: "uppercase",
            letterSpacing: 2,
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          Solution
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: "white",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "85%",
          }}
        >
          {solution}
        </div>

        {/* Happy emoji */}
        <div
          style={{
            marginTop: 80,
            fontSize: 140,
            transform:
              frame > 150
                ? `rotate(${interpolate(Math.sin((frame - 150) * 0.2), [-1, 1], [-15, 15])}deg)`
                : "rotate(0deg)",
          }}
        >
          🎉
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
          color: "rgba(255,255,255,0.9)",
          transform: `translateX(${slideX}px)`,
        }}
      >
        @kinetikui
      </div>
    </AbsoluteFill>
  );
};
