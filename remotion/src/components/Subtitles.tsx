import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export interface SubtitleWord {
  word: string;
  start: number; // Frame number
  end: number;   // Frame number
}

export interface SubtitleChunk {
  words: SubtitleWord[];
  start: number;
  end: number;
}

export interface SubtitlesProps {
  chunks: SubtitleChunk[];
  style?: {
    fontFamily?: string;
    fontSize?: number;
    primaryColor?: string;
    highlightColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    position?: "top" | "center" | "bottom";
    bottomOffset?: number;
    maxWordsPerLine?: number;
    shadow?: boolean;
    shadowBlur?: number;
    shadowColor?: string;
  };
}

export const Subtitles: React.FC<SubtitlesProps> = ({ chunks, style = {} }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const {
    fontFamily = "Poppins, Montserrat, Arial Black, sans-serif",
    fontSize = 56,
    primaryColor = "#FFFFFF",
    highlightColor = "#FFD700",
    strokeColor = "#000000",
    strokeWidth = 4,
    position = "bottom",
    bottomOffset = 120,
    shadow = true,
    shadowBlur = 20,
    shadowColor = "rgba(0,0,0,0.8)",
  } = style;

  // Find current chunk
  const currentChunk = chunks.find(
    (chunk) => frame >= chunk.start && frame <= chunk.end
  );

  if (!currentChunk) return null;

  // Calculate chunk opacity (fade in/out)
  const fadeInDuration = 8;
  const fadeOutDuration = 8;
  const chunkProgress = frame - currentChunk.start;
  const chunkDuration = currentChunk.end - currentChunk.start;

  const chunkOpacity = interpolate(
    chunkProgress,
    [0, fadeInDuration, chunkDuration - fadeOutDuration, chunkDuration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.ease,
    }
  );

  // Position calculation
  const getYPosition = () => {
    switch (position) {
      case "top":
        return 120;
      case "center":
        return height / 2;
      case "bottom":
      default:
        return height - bottomOffset;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: getYPosition(),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: "translateY(-50%)",
        opacity: chunkOpacity,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
          maxWidth: "90%",
          padding: "0 40px",
        }}
      >
        {currentChunk.words.map((wordData, index) => {
          const isActive = frame >= wordData.start && frame <= wordData.end;
          
          // Word-level animation
          const wordProgress = isActive
            ? interpolate(
                frame,
                [wordData.start, wordData.start + 3],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.ease),
                }
              )
            : frame < wordData.start
            ? 0
            : 1;

          const wordScale = interpolate(wordProgress, [0, 1], [0.95, 1]);

          const color = isActive ? highlightColor : primaryColor;

          return (
            <span
              key={index}
              style={{
                fontFamily,
                fontSize,
                fontWeight: 900,
                color,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                lineHeight: 1.3,
                transform: `scale(${wordScale})`,
                transition: "all 0.1s ease-out",
                display: "inline-block",
                WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
                paintOrder: "stroke fill",
                textShadow: shadow
                  ? `0 0 ${shadowBlur}px ${shadowColor}, 
                     0 4px 12px ${shadowColor},
                     ${strokeWidth}px ${strokeWidth}px 0 ${strokeColor},
                     -${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                     ${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                     -${strokeWidth}px ${strokeWidth}px 0 ${strokeColor}`
                  : undefined,
              }}
            >
              {wordData.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to generate subtitle chunks from script
export function generateSubtitleChunks(
  script: string,
  fps: number,
  durationInFrames: number,
  maxWordsPerChunk: number = 3
): SubtitleChunk[] {
  // Clean script and split into words
  const words = script
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (words.length === 0) return [];

  // Calculate average frames per word
  const framesPerWord = Math.floor(durationInFrames / words.length);
  const chunks: SubtitleChunk[] = [];

  let currentFrame = 0;

  for (let i = 0; i < words.length; i += maxWordsPerChunk) {
    const chunkWords = words.slice(i, i + maxWordsPerChunk);
    const chunkWordData: SubtitleWord[] = [];

    chunkWords.forEach((word, idx) => {
      const wordStart = currentFrame;
      const wordEnd = currentFrame + framesPerWord - 1;

      chunkWordData.push({
        word,
        start: wordStart,
        end: wordEnd,
      });

      currentFrame += framesPerWord;
    });

    chunks.push({
      words: chunkWordData,
      start: chunkWordData[0].start,
      end: chunkWordData[chunkWordData.length - 1].end,
    });
  }

  return chunks;
}

// Generate SRT format from chunks
export function generateSRT(chunks: SubtitleChunk[], fps: number): string {
  let srt = "";

  chunks.forEach((chunk, index) => {
    const startTime = framesToSRT(chunk.start, fps);
    const endTime = framesToSRT(chunk.end, fps);
    const text = chunk.words.map((w) => w.word).join(" ");

    srt += `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
  });

  return srt;
}

// Generate VTT format from chunks
export function generateVTT(chunks: SubtitleChunk[], fps: number): string {
  let vtt = "WEBVTT\n\n";

  chunks.forEach((chunk, index) => {
    const startTime = framesToVTT(chunk.start, fps);
    const endTime = framesToVTT(chunk.end, fps);
    const text = chunk.words.map((w) => w.word).join(" ");

    vtt += `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
  });

  return vtt;
}

// Helper: Convert frame to SRT timestamp (HH:MM:SS,mmm)
function framesToSRT(frame: number, fps: number): string {
  const totalSeconds = frame / fps;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(
    milliseconds,
    3
  )}`;
}

// Helper: Convert frame to VTT timestamp (HH:MM:SS.mmm)
function framesToVTT(frame: number, fps: number): string {
  const totalSeconds = frame / fps;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(
    milliseconds,
    3
  )}`;
}

function pad(num: number, size: number): string {
  let s = num.toString();
  while (s.length < size) s = "0" + s;
  return s;
}
