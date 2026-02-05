import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

/**
 * ThreeReasons Template - Listicle (15-20s)
 * Visual: Countdown (3→2→1) with animated numbers → Each reason 3-4 seconds → CTA
 */

interface Props {
  hook: string;     // "3 reasons devs love Kinetik UI"
  reason1: string;  // "10+ hours saved per week"
  reason2: string;  // "Professional design instantly"
  reason3: string;  // "Free forever"
  cta: string;      // "Start building 👆"
  brandColor?: string;
}

export const ThreeReasons: React.FC<Props> = ({
  hook,
  reason1,
  reason2,
  reason3,
  cta,
  brandColor = "#818CF8"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (18 seconds @ 30fps = 540 frames)
  const HOOK_START = 0;
  const HOOK_END = 75;         // 0-2.5s
  const REASON1_START = 75;
  const REASON1_END = 195;     // 2.5-6.5s (4s for reason #3)
  const REASON2_START = 195;
  const REASON2_END = 315;     // 6.5-10.5s (4s for reason #2)
  const REASON3_START = 315;
  const REASON3_END = 435;     // 10.5-14.5s (4s for reason #1)
  const CTA_START = 435;
  const CTA_END = 540;         // 14.5-18s

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

  // Generic reason animation function
  const getReasonOpacity = (startFrame: number) => interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const getReasonScale = (startFrame: number) => spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 11, stiffness: 190 }
  });

  const getReasonY = (startFrame: number) => interpolate(
    frame,
    [startFrame, startFrame + 20],
    [50, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Number animations with color coding
  const numberColors = ['#22c55e', '#f59e0b', '#ef4444']; // Green, amber, red
  const numberGlow = Math.sin(frame * 0.15) * 0.3 + 0.7;

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
      {frame >= HOOK_START && frame < REASON1_START && (
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

      {/* Reason 1 Scene - Number 3 (2.5-6.5s) */}
      {frame >= REASON1_START && frame < REASON2_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${getReasonY(REASON1_START)}px) scale(${getReasonScale(REASON1_START)})`,
            opacity: getReasonOpacity(REASON1_START),
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 200,
              fontWeight: 900,
              color: numberColors[2],
              textShadow: `0 0 ${60 * numberGlow}px ${numberColors[2]}`,
              lineHeight: 1,
              marginBottom: 30,
            }}
          >
            3
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.3,
              textShadow: '0 2px 15px rgba(0,0,0,0.4)',
            }}
          >
            {reason3}
          </div>
        </div>
      )}

      {/* Reason 2 Scene - Number 2 (6.5-10.5s) */}
      {frame >= REASON2_START && frame < REASON3_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${getReasonY(REASON2_START)}px) scale(${getReasonScale(REASON2_START)})`,
            opacity: getReasonOpacity(REASON2_START),
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 200,
              fontWeight: 900,
              color: numberColors[1],
              textShadow: `0 0 ${60 * numberGlow}px ${numberColors[1]}`,
              lineHeight: 1,
              marginBottom: 30,
            }}
          >
            2
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.3,
              textShadow: '0 2px 15px rgba(0,0,0,0.4)',
            }}
          >
            {reason2}
          </div>
        </div>
      )}

      {/* Reason 3 Scene - Number 1 (10.5-14.5s) */}
      {frame >= REASON3_START && frame < CTA_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${getReasonY(REASON3_START)}px) scale(${getReasonScale(REASON3_START)})`,
            opacity: getReasonOpacity(REASON3_START),
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 200,
              fontWeight: 900,
              color: numberColors[0],
              textShadow: `0 0 ${60 * numberGlow}px ${numberColors[0]}`,
              lineHeight: 1,
              marginBottom: 30,
            }}
          >
            1
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.3,
              textShadow: '0 2px 15px rgba(0,0,0,0.4)',
            }}
          >
            {reason1}
          </div>
          
          {/* Celebration emoji */}
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

      {/* CTA Scene (14.5-18s) */}
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
