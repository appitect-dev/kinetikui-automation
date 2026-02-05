import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

interface Props {
  hook: string;           // "Did you know 80% of devs waste 3 hours/day on UI?"
  problem: string;        // "Most developers spend 10+ hours/week on repetitive UI work"
  solution: string;       // "Kinetik UI saves you 10 hours every week"
  cta: string;           // "Link in bio 👆"
  stat?: string;         // "80%" (optional big number)
  brandColor?: string;   // "#818CF8" (default)
}

export const DidYouKnow: React.FC<Props> = ({
  hook,
  problem,
  solution,
  cta,
  stat = "80%",
  brandColor = "#818CF8"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (15 seconds total @ 30fps = 450 frames)
  const HOOK_START = 0;
  const HOOK_END = 90;      // 0-3 seconds
  const PROBLEM_START = 90;
  const PROBLEM_END = 240;   // 3-8 seconds
  const SOLUTION_START = 240;
  const SOLUTION_END = 390;  // 8-13 seconds
  const CTA_START = 390;
  const CTA_END = 450;       // 13-15 seconds

  // Hook animation (entrance)
  const hookOpacity = interpolate(
    frame,
    [HOOK_START, HOOK_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const hookScale = spring({
    frame: frame - HOOK_START,
    fps,
    config: { damping: 15, stiffness: 200 }
  });

  const hookY = interpolate(
    frame,
    [HOOK_START, HOOK_START + 20],
    [50, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  // Stat reveal (big number)
  const statOpacity = interpolate(
    frame,
    [HOOK_END - 30, HOOK_END],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const statScale = spring({
    frame: frame - (HOOK_END - 30),
    fps,
    config: { damping: 12, stiffness: 180 }
  });

  // Problem scene
  const problemOpacity = interpolate(
    frame,
    [PROBLEM_START, PROBLEM_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const problemY = interpolate(
    frame,
    [PROBLEM_START, PROBLEM_START + 20],
    [30, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Solution scene (fade transition)
  const solutionOpacity = interpolate(
    frame,
    [SOLUTION_START, SOLUTION_START + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const solutionScale = spring({
    frame: frame - SOLUTION_START,
    fps,
    config: { damping: 10, stiffness: 150 }
  });

  // CTA (punch in)
  const ctaOpacity = interpolate(
    frame,
    [CTA_START, CTA_START + 10],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const ctaScale = spring({
    frame: frame - CTA_START,
    fps,
    config: { damping: 8, stiffness: 220, mass: 0.8 }
  });

  // Pulsing glow effect
  const glowIntensity = Math.sin(frame * 0.1) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hook Scene (0-3s) */}
      {frame >= HOOK_START && frame < PROBLEM_START && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${hookY}px) scale(${hookScale})`,
            opacity: hookOpacity,
            textAlign: 'center',
            width: '90%',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              lineHeight: 1.2,
              marginBottom: 40,
            }}
          >
            {hook}
          </div>

          {/* Big stat reveal */}
          {frame >= HOOK_END - 30 && (
            <div
              style={{
                fontSize: 180,
                fontWeight: 900,
                color: brandColor,
                textShadow: `0 0 ${60 * glowIntensity}px ${brandColor}`,
                opacity: statOpacity,
                transform: `scale(${statScale})`,
              }}
            >
              {stat}
            </div>
          )}
        </div>
      )}

      {/* Problem Scene (3-8s) */}
      {frame >= PROBLEM_START && frame < SOLUTION_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${problemY}px)`,
            opacity: problemOpacity,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.3,
              textShadow: '0 2px 15px rgba(0,0,0,0.4)',
            }}
          >
            {problem}
          </div>

          {/* Sad emoji */}
          <div style={{ fontSize: 120, marginTop: 40 }}>😩</div>
        </div>
      )}

      {/* Solution Scene (8-13s) */}
      {frame >= SOLUTION_START && frame < CTA_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${solutionScale})`,
            opacity: solutionOpacity,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: brandColor,
              lineHeight: 1.3,
              textShadow: `0 0 30px ${brandColor}`,
              marginBottom: 30,
            }}
          >
            {solution}
          </div>

          {/* Happy emoji */}
          <div style={{ fontSize: 120 }}>🚀</div>

          {/* Brand logo */}
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: 'white',
              marginTop: 40,
            }}
          >
            Kinetik UI
          </div>
        </div>
      )}

      {/* CTA Scene (13-15s) */}
      {frame >= CTA_START && (
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: `translate(-50%, 0) scale(${ctaScale})`,
            opacity: ctaOpacity,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 60,
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

      {/* Watermark (always visible) */}
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
