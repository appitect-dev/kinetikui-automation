import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

/**
 * ThisChanged Template - Origin Story (18-25s)
 * Visual: Storytelling with 3 text overlays (6s each) → Emotional journey → CTA
 */

interface Props {
  hook: string;       // "This changed how I build UI forever"
  journey: string[];  // ["Frustrated with CSS", "Found Kinetik UI", "Never looked back"]
  cta: string;        // "Your turn 👆"
  brandColor?: string;
}

export const ThisChanged: React.FC<Props> = ({
  hook,
  journey,
  cta,
  brandColor = "#818CF8"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ensure journey has exactly 3 steps
  const steps = [
    journey[0] || "Struggled with UI",
    journey[1] || "Found Kinetik UI",
    journey[2] || "Never looked back"
  ];

  // Scene timing (20 seconds @ 30fps = 600 frames)
  const HOOK_START = 0;
  const HOOK_END = 90;         // 0-3s
  const STEP1_START = 90;
  const STEP1_END = 270;       // 3-9s (6s per step)
  const STEP2_START = 270;
  const STEP2_END = 450;       // 9-15s
  const STEP3_START = 450;
  const STEP3_END = 570;       // 15-19s
  const CTA_START = 570;
  const CTA_END = 600;         // 19-20s

  // Hook animation
  const hookOpacity = interpolate(
    frame,
    [HOOK_START, HOOK_START + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const hookScale = spring({
    frame: frame - HOOK_START,
    fps,
    config: { damping: 13, stiffness: 170 }
  });

  // Step animation helper
  const getStepOpacity = (startFrame: number) => interpolate(
    frame,
    [startFrame, startFrame + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const getStepY = (startFrame: number) => interpolate(
    frame,
    [startFrame, startFrame + 30],
    [60, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  const getStepScale = (startFrame: number) => spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 160 }
  });

  // Emotional indicators for each step
  const stepEmojis = ['😤', '🤔', '🚀'];
  const stepColors = ['#ef4444', '#f59e0b', '#22c55e'];

  // Background gradient shift based on progress
  const bgProgress = interpolate(
    frame,
    [HOOK_START, STEP3_END],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const bgColor1 = `rgba(15, 23, 42, ${1 - bgProgress * 0.2})`;
  const bgColor2 = `rgba(30, 41, 59, ${1 - bgProgress * 0.2})`;

  // CTA animation
  const ctaOpacity = interpolate(
    frame,
    [CTA_START, CTA_START + 10],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const ctaScale = spring({
    frame: frame - CTA_START,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.7 }
  });

  // Glow effect
  const glowIntensity = Math.sin(frame * 0.1) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${bgColor1} 0%, ${bgColor2} 100%)`,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hook Scene (0-3s) */}
      {frame >= HOOK_START && frame < STEP1_START && (
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${hookScale})`,
            opacity: hookOpacity,
            textAlign: 'center',
            width: '90%',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: brandColor,
              textShadow: `0 4px 30px ${brandColor}`,
              lineHeight: 1.2,
            }}
          >
            {hook}
          </div>
        </div>
      )}

      {/* Step 1 - Struggle (3-9s) */}
      {frame >= STEP1_START && frame < STEP2_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${getStepY(STEP1_START)}px) scale(${getStepScale(STEP1_START)})`,
            opacity: getStepOpacity(STEP1_START),
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 120,
              marginBottom: 40,
            }}
          >
            {stepEmojis[0]}
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.3,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            {steps[0]}
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 42,
              fontWeight: 600,
              color: stepColors[0],
            }}
          >
            The old way...
          </div>
        </div>
      )}

      {/* Step 2 - Discovery (9-15s) */}
      {frame >= STEP2_START && frame < STEP3_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${getStepY(STEP2_START)}px) scale(${getStepScale(STEP2_START)})`,
            opacity: getStepOpacity(STEP2_START),
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 120,
              marginBottom: 40,
            }}
          >
            {stepEmojis[1]}
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.3,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            {steps[1]}
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 42,
              fontWeight: 600,
              color: stepColors[1],
            }}
          >
            A lightbulb moment...
          </div>
        </div>
      )}

      {/* Step 3 - Transformation (15-19s) */}
      {frame >= STEP3_START && frame < CTA_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${getStepY(STEP3_START)}px) scale(${getStepScale(STEP3_START)})`,
            opacity: getStepOpacity(STEP3_START),
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 120,
              marginBottom: 40,
            }}
          >
            {stepEmojis[2]}
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.3,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            {steps[2]}
          </div>
          <div
            style={{
              marginTop: 40,
              fontSize: 48,
              fontWeight: 700,
              color: brandColor,
              textShadow: `0 0 ${40 * glowIntensity}px ${brandColor}`,
            }}
          >
            Kinetik UI
          </div>
        </div>
      )}

      {/* CTA Scene (19-20s) */}
      {frame >= CTA_START && (
        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: `translate(-50%, 0) scale(${ctaScale})`,
            opacity: ctaOpacity,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: 'white',
              backgroundColor: brandColor,
              padding: '20px 60px',
              borderRadius: 20,
              boxShadow: `0 10px 40px ${brandColor}88`,
            }}
          >
            {cta}
          </div>
        </div>
      )}

      {/* Progress dots */}
      {frame >= STEP1_START && frame < CTA_START && (
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 15,
          }}
        >
          {[0, 1, 2].map((index) => {
            const isActive = 
              (index === 0 && frame >= STEP1_START && frame < STEP2_START) ||
              (index === 1 && frame >= STEP2_START && frame < STEP3_START) ||
              (index === 2 && frame >= STEP3_START);
            
            return (
              <div
                key={index}
                style={{
                  width: isActive ? 40 : 15,
                  height: 15,
                  borderRadius: 10,
                  backgroundColor: isActive ? brandColor : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 0 20px ${brandColor}` : 'none',
                }}
              />
            );
          })}
        </div>
      )}

      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 28,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        @kinetikui
      </div>
    </AbsoluteFill>
  );
};
