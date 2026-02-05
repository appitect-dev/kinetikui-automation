import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

/**
 * BeforeAfter Template - Transformation (12-18s)
 * Visual: Split screen (red left / green right) → Before: messy code → After: clean component → Counter animation
 */

interface Props {
  hook: string;        // "Before vs After using Kinetik UI"
  before: string;      // "100+ lines of CSS"
  after: string;       // "1 line of code"
  timeSaved: string;   // "10 hours/week"
  cta: string;         // "Make the switch 👆"
  brandColor?: string;
}

export const BeforeAfter: React.FC<Props> = ({
  hook,
  before,
  after,
  timeSaved,
  cta,
  brandColor = "#818CF8"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (16 seconds @ 30fps = 480 frames)
  const HOOK_START = 0;
  const HOOK_END = 75;         // 0-2.5s
  const BEFORE_START = 75;
  const BEFORE_END = 165;      // 2.5-5.5s
  const AFTER_START = 165;
  const AFTER_END = 255;       // 5.5-8.5s
  const SPLIT_START = 255;
  const SPLIT_END = 375;       // 8.5-12.5s
  const CTA_START = 375;
  const CTA_END = 480;         // 12.5-16s

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

  // Before scene
  const beforeOpacity = interpolate(
    frame,
    [BEFORE_START, BEFORE_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const beforeY = interpolate(
    frame,
    [BEFORE_START, BEFORE_START + 25],
    [50, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  // Shake effect for "before"
  const beforeShake = frame >= BEFORE_START + 40 && frame < BEFORE_END
    ? Math.sin((frame - BEFORE_START - 40) * 0.6) * 4
    : 0;

  // After scene
  const afterOpacity = interpolate(
    frame,
    [AFTER_START, AFTER_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const afterY = interpolate(
    frame,
    [AFTER_START, AFTER_START + 25],
    [50, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  // Split screen reveal
  const splitOpacity = interpolate(
    frame,
    [SPLIT_START, SPLIT_START + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Time saved counter animation
  const counterProgress = interpolate(
    frame,
    [SPLIT_START + 30, SPLIT_START + 60],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const counterValue = Math.floor(counterProgress * parseInt(timeSaved) || 10);

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

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hook Scene (0-2.5s) */}
      {frame >= HOOK_START && frame < BEFORE_START && (
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
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              lineHeight: 1.2,
            }}
          >
            {hook}
          </div>
        </div>
      )}

      {/* Before Scene (2.5-5.5s) */}
      {frame >= BEFORE_START && frame < AFTER_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${beforeY}px) translateX(${beforeShake}px)`,
            opacity: beforeOpacity,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#ef4444',
              textTransform: 'uppercase',
              letterSpacing: 3,
              marginBottom: 40,
            }}
          >
            BEFORE
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.4,
              padding: '30px 40px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '3px solid #ef4444',
              borderRadius: 15,
            }}
          >
            {before}
          </div>
          <div
            style={{
              fontSize: 100,
              marginTop: 30,
            }}
          >
            😫
          </div>
        </div>
      )}

      {/* After Scene (5.5-8.5s) */}
      {frame >= AFTER_START && frame < SPLIT_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${afterY}px)`,
            opacity: afterOpacity,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#22c55e',
              textTransform: 'uppercase',
              letterSpacing: 3,
              marginBottom: 40,
            }}
          >
            AFTER
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.4,
              padding: '30px 40px',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              border: '3px solid #22c55e',
              borderRadius: 15,
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
            }}
          >
            {after}
          </div>
          <div
            style={{
              fontSize: 100,
              marginTop: 30,
            }}
          >
            🎉
          </div>
        </div>
      )}

      {/* Split Screen Comparison (8.5-12.5s) */}
      {frame >= SPLIT_START && frame < CTA_START && (
        <>
          {/* Left side - BEFORE (red) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '20%',
              width: '50%',
              height: '60%',
              opacity: splitOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              borderRight: '3px solid #ef4444',
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: '#ef4444',
                marginBottom: 20,
              }}
            >
              BEFORE
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 600,
                color: 'white',
                padding: '15px 25px',
                textAlign: 'center',
              }}
            >
              {before}
            </div>
            <div style={{ fontSize: 60, marginTop: 20 }}>😫</div>
          </div>

          {/* Right side - AFTER (green) */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '20%',
              width: '50%',
              height: '60%',
              opacity: splitOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              borderLeft: '3px solid #22c55e',
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: '#22c55e',
                marginBottom: 20,
              }}
            >
              AFTER
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 600,
                color: 'white',
                padding: '15px 25px',
                textAlign: 'center',
              }}
            >
              {after}
            </div>
            <div style={{ fontSize: 60, marginTop: 20 }}>✨</div>
          </div>

          {/* Time saved counter (centered) */}
          {frame >= SPLIT_START + 30 && (
            <div
              style={{
                position: 'absolute',
                top: '85%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: brandColor,
                  textShadow: `0 0 40px ${brandColor}`,
                }}
              >
                {counterValue}+ hours saved
              </div>
            </div>
          )}
        </>
      )}

      {/* CTA Scene (12.5-16s) */}
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
