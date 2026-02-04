import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio } from "remotion";

interface Stat {
  label: string;
  value: string;
}

interface Props {
  stats: Stat[];
  testimonial: string;
  voiceoverUrl?: string;
  backgroundMusicUrl?: string;
  musicVolume?: number;
}

export const SocialProof: React.FC<Props> = ({ 
  stats, 
  testimonial,
  voiceoverUrl,
  backgroundMusicUrl,
  musicVolume = 0.2
}) => {
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
      {voiceoverUrl && <Audio src={voiceoverUrl} volume={1.0} />}
      {backgroundMusicUrl && <Audio src={backgroundMusicUrl} volume={musicVolume} />}

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 56,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          marginBottom: 100,
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        Trusted by Developers
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 40,
          width: "100%",
          marginBottom: 100,
        }}
      >
        {stats.map((stat, i) => {
          const delay = 40 + i * 30;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 25,
              mass: 1,
            },
          });

          const scale = interpolate(progress, [0, 1], [0.5, 1]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          // Count-up animation
          const targetValue = parseInt(stat.value.replace(/\D/g, ""), 10) || 0;
          const currentValue = Math.floor(
            interpolate(frame, [delay, delay + 40], [0, targetValue], {
              extrapolateRight: "clamp",
            })
          );
          const displayValue = stat.value.includes("+")
            ? `${currentValue}+`
            : stat.value.includes("K")
            ? `${currentValue}K+`
            : stat.value.includes("%")
            ? `${currentValue}%`
            : stat.value;

          return (
            <div
              key={i}
              style={{
                transform: `scale(${scale})`,
                opacity,
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: 24,
                padding: "50px 40px",
                textAlign: "center",
                border: "2px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  color: "white",
                  marginBottom: 20,
                }}
              >
                {frame >= delay ? displayValue : "0"}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Testimonial */}
      {frame > 180 && (
        <div
          style={{
            opacity: interpolate(frame, [180, 210], [0, 1], {
              extrapolateRight: "clamp",
            }),
            backgroundColor: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            padding: "40px 50px",
            borderLeft: "6px solid white",
            maxWidth: "90%",
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontStyle: "italic",
              color: "white",
              lineHeight: 1.5,
              marginBottom: 20,
            }}
          >
            "{testimonial}"
          </div>
        </div>
      )}

      {/* CTA */}
      {frame > 240 && (
        <div
          style={{
            marginTop: 60,
            fontSize: 44,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            opacity: interpolate(frame, [240, 260], [0, 1], {
              extrapolateRight: "clamp",
            }),
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "25px 60px",
            borderRadius: 20,
          }}
        >
          Join Them →
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
