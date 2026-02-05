import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

/**
 * StopUsing Template - Contrarian Advice (12-18s)
 * Visual: Red X over old method → Green checkmark on new method → Stats comparison
 */

interface Props {
  hook: string;      // "Stop using styled-components for animations"
  oldMethod: string; // "Styled Components"
  problem: string;   // "Performance issues, bundle size"
  solution: string;  // "Kinetik UI is 80% smaller"
  cta: string;       // "Try it now 👆"
  brandColor?: string;
}

export const StopUsing: React.FC<Props> = ({
  hook,
  oldMethod,
  problem,
  solution,
  cta,
  brandColor = "#818CF8"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (15 seconds @ 30fps = 450 frames)
  const HOOK_START = 0;
  const HOOK_END = 75;        // 0-2.5s
  const OLD_METHOD_START = 75;
  const OLD_METHOD_END = 195;  // 2.5-6.5s
  const SOLUTION_START = 195;
  const SOLUTION_END = 360;    // 6.5-12s
  const CTA_START = 360;
  const CTA_END = 450;         // 12-15s

  // Hook animation
  const hookOpacity = interpolate(
    frame,
    [HOOK_START, HOOK_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const hookScale = spring({
    frame: frame - HOOK_START,
    fps,
    config: { damping: 14, stiffness: 180 }
  });

  // Old method scene (with red X)
  const oldMethodOpacity = interpolate(
    frame,
    [OLD_METHOD_START, OLD_METHOD_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const oldMethodY = interpolate(
    frame,
    [OLD_METHOD_START, OLD_METHOD_START + 20],
    [40, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  // Red X animation (delayed entrance)
  const xOpacity = interpolate(
    frame,
    [OLD_METHOD_START + 30, OLD_METHOD_START + 45],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const xScale = spring({
    frame: frame - (OLD_METHOD_START + 30),
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.5 }
  });

  // Problem shake effect
  const problemShake = frame >= OLD_METHOD_START + 60 && frame < OLD_METHOD_END
    ? Math.sin((frame - OLD_METHOD_START - 60) * 0.5) * 3
    : 0;

  // Solution scene (green checkmark)
  const solutionOpacity = interpolate(
    frame,
    [SOLUTION_START, SOLUTION_START + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const solutionScale = spring({
    frame: frame - SOLUTION_START,
    fps,
    config: { damping: 12, stiffness: 160 }
  });

  // Green checkmark
  const checkOpacity = interpolate(
    frame,
    [SOLUTION_START + 20, SOLUTION_START + 35],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const checkScale = spring({
    frame: frame - (SOLUTION_START + 20),
    fps,
    config: { damping: 8, stiffness: 220 }
  });

  // CTA animation
  const ctaOpacity = interpolate(
    frame,
    [CTA_START, CTA_START + 12],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const ctaScale = spring({
    frame: frame - CTA_START,
    fps,
    config: { damping: 9, stiffness: 200 }
  });

  // Pulsing glow
  const glowIntensity = Math.sin(frame * 0.12) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hook Scene (0-2.5s) */}
      {frame >= HOOK_START && frame < OLD_METHOD_START && (
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
              fontSize: 68,
              fontWeight: 900,
              color: '#ef4444',
              textShadow: '0 4px 20px rgba(239, 68, 68, 0.5)',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            STOP USING
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: 'white',
              marginTop: 20,
              lineHeight: 1.3,
            }}
          >
            {hook.replace(/^Stop using /i, '')}
          </div>
        </div>
      )}

      {/* Old Method Scene with Red X (2.5-6.5s) */}
      {frame >= OLD_METHOD_START && frame < SOLUTION_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${oldMethodY}px) translateX(${problemShake}px)`,
            opacity: oldMethodOpacity,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: 'white',
                padding: '30px 60px',
                backgroundColor: 'rgba(51, 65, 85, 0.8)',
                borderRadius: 20,
                border: '4px solid #ef4444',
              }}
            >
              {oldMethod}
            </div>

            {/* Red X overlay */}
            {frame >= OLD_METHOD_START + 30 && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) scale(${xScale}) rotate(-15deg)`,
                  opacity: xOpacity,
                  fontSize: 200,
                  color: '#ef4444',
                  textShadow: '0 0 40px #ef4444',
                  fontWeight: 900,
                }}
              >
                ✕
              </div>
            )}
          </div>

          {/* Problem text */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: '#ef4444',
              marginTop: 50,
              lineHeight: 1.4,
            }}
          >
            {problem}
          </div>
        </div>
      )}

      {/* Solution Scene with Green Check (6.5-12s) */}
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
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: 'white',
                padding: '30px 60px',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderRadius: 20,
                border: `4px solid #22c55e`,
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)',
              }}
            >
              Kinetik UI
            </div>

            {/* Green checkmark */}
            {frame >= SOLUTION_START + 20 && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) scale(${checkScale})`,
                  opacity: checkOpacity,
                  fontSize: 180,
                  color: '#22c55e',
                  textShadow: `0 0 ${50 * glowIntensity}px #22c55e`,
                  fontWeight: 900,
                }}
              >
                ✓
              </div>
            )}
          </div>

          {/* Solution stat */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: brandColor,
              marginTop: 50,
              textShadow: `0 0 30px ${brandColor}`,
              lineHeight: 1.3,
            }}
          >
            {solution}
          </div>
        </div>
      )}

      {/* CTA Scene (12-15s) */}
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
