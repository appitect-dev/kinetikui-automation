import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Subtitles, SubtitleChunk, generateSubtitleChunks } from "../components/Subtitles";

interface Props {
  code: string;
  componentName: string;
  script?: string;
  subtitlesEnabled?: boolean;
  subtitleChunks?: SubtitleChunk[];
}

export const CodeReveal: React.FC<Props> = ({ 
  code, 
  componentName,
  script,
  subtitlesEnabled = true,
  subtitleChunks
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Generate subtitle chunks if script is provided but chunks aren't
  const chunks = React.useMemo(() => {
    if (subtitleChunks) return subtitleChunks;
    if (script) {
      return generateSubtitleChunks(script, fps, durationInFrames, 3);
    }
    return [];
  }, [script, subtitleChunks, fps, durationInFrames]);

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Typing effect
  const totalChars = code.length;
  const charsToShow = Math.floor(
    interpolate(frame, [40, 280], [0, totalChars], {
      extrapolateRight: "clamp",
    })
  );

  const visibleCode = code.substring(0, charsToShow);

  // Cursor blink
  const cursorOpacity = Math.abs(Math.sin((frame - 40) * 0.1)) > 0.5 ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        fontFamily: "'Fira Code', 'Courier New', monospace",
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
          fontSize: 56,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        {componentName}
      </div>

      {/* Code block */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: 20,
          padding: "50px 60px",
          width: "90%",
          boxShadow: "0 10px 50px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontSize: 32,
            lineHeight: 1.6,
            color: "#61dafb",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {visibleCode}
          {frame > 40 && frame < 290 && (
            <span
              style={{
                opacity: cursorOpacity,
                backgroundColor: "#61dafb",
                marginLeft: 2,
                display: "inline-block",
                width: 3,
                height: "1.2em",
                verticalAlign: "text-bottom",
              }}
            />
          )}
        </pre>
      </div>

      {/* CTA */}
      {frame > 300 && (
        <div
          style={{
            marginTop: 60,
            fontSize: 36,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            opacity: interpolate(frame, [300, 320], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          Try it now! ↓
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

      {/* Subtitles Overlay - TOP position since code is at bottom */}
      {subtitlesEnabled && chunks.length > 0 && (
        <Subtitles
          chunks={chunks}
          style={{
            fontFamily: "Poppins, Montserrat, Arial Black, sans-serif",
            fontSize: 44,
            primaryColor: "#FFFFFF",
            highlightColor: "#61DAFB",
            strokeColor: "#000000",
            strokeWidth: 4,
            position: "top",
            bottomOffset: 120,
            shadow: true,
            shadowBlur: 20,
            shadowColor: "rgba(0,0,0,0.8)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
