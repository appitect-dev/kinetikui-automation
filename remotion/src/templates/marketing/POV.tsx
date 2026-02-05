import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

/**
 * POV Template - Relatable Scenario (10-15s)
 * Visual: Text overlays with emoji reactions → Quick 3-component showcase (0.5s each) → CTA
 */

interface Props {
  hook: string;    // "POV: You just discovered Kinetik UI at 2AM"
  emotion: string; // "Mind = Blown 🤯"
  benefit: string; // "Now you can ship 10x faster"
  cta: string;     // "Get started 👆"
  brandColor?: string;
}

export const POV: React.FC<Props> = ({
  hook,
  emotion,
  benefit,
  cta,
  brandColor = "#818CF8"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (13 seconds @ 30fps = 390 frames)
  const HOOK_START = 0;
  const HOOK_END = 90;         // 0-3s
  const EMOTION_START = 90;
  const EMOTION_END = 180;     // 3-6s
  const SHOWCASE_START = 180;
  const SHOWCASE_END = 270;    // 6-9s (3 components × 1s each)
  const BENEFIT_START = 270;
  const BENEFIT_END = 330;     // 9-11s
  const CTA_START = 330;
  const CTA_END = 390;         // 11-13s

  // Hook animation
  const hookOpacity = interpolate(
    frame,
    [HOOK_START, HOOK_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const hookY = interpolate(
    frame,
    [HOOK_START, HOOK_START + 25],
    [60, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  // Emotion scene
  const emotionOpacity = interpolate(
    frame,
    [EMOTION_START, EMOTION_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const emotionScale = spring({
    frame: frame - EMOTION_START,
    fps,
    config: { damping: 8, stiffness: 220, mass: 0.6 }
  });

  // Component showcase (3 rapid demos)
  const components = [
    { name: 'Button', icon: '🔘', color: '#818CF8' },
    { name: 'Modal', icon: '📦', color: '#22c55e' },
    { name: 'Toast', icon: '✨', color: '#f59e0b' },
  ];

  const showcaseIndex = Math.floor((frame - SHOWCASE_START) / 30); // Each component for 30 frames (1s)
  const currentComponent = components[Math.min(showcaseIndex, components.length - 1)];

  const componentOpacity = interpolate(
    frame,
    [SHOWCASE_START, SHOWCASE_START + 10],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const componentScale = frame >= SHOWCASE_START && frame < SHOWCASE_END
    ? spring({
        frame: (frame - SHOWCASE_START) % 30,
        fps,
        config: { damping: 10, stiffness: 250 }
      })
    : 0;

  // Benefit scene
  const benefitOpacity = interpolate(
    frame,
    [BENEFIT_START, BENEFIT_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const benefitScale = spring({
    frame: frame - BENEFIT_START,
    fps,
    config: { damping: 12, stiffness: 180 }
  });

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
    config: { damping: 9, stiffness: 200 }
  });

  // Background pulse
  const bgPulse = Math.sin(frame * 0.08) * 0.1 + 0.9;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, rgba(15, 23, 42, ${bgPulse}) 0%, rgba(30, 41, 59, ${bgPulse}) 100%)`,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hook Scene (0-3s) */}
      {frame >= HOOK_START && frame < EMOTION_START && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${hookY}px)`,
            opacity: hookOpacity,
            textAlign: 'center',
            width: '90%',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginBottom: 30,
            }}
          >
            POV:
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.2,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {hook.replace(/^POV:\s*/i, '')}
          </div>
        </div>
      )}

      {/* Emotion Scene (3-6s) */}
      {frame >= EMOTION_START && frame < SHOWCASE_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${emotionScale})`,
            opacity: emotionOpacity,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 140,
              marginBottom: 30,
            }}
          >
            🤯
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: brandColor,
              textShadow: `0 0 40px ${brandColor}`,
              lineHeight: 1.2,
            }}
          >
            {emotion.replace(/🤯/g, '')}
          </div>
        </div>
      )}

      {/* Component Showcase (6-9s) */}
      {frame >= SHOWCASE_START && frame < BENEFIT_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${componentScale})`,
            opacity: componentOpacity,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 160,
              marginBottom: 20,
            }}
          >
            {currentComponent.icon}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: currentComponent.color,
              textShadow: `0 0 40px ${currentComponent.color}`,
              padding: '20px 50px',
              backgroundColor: 'rgba(51, 65, 85, 0.5)',
              borderRadius: 20,
              border: `3px solid ${currentComponent.color}`,
            }}
          >
            {currentComponent.name}
          </div>
        </div>
      )}

      {/* Benefit Scene (9-11s) */}
      {frame >= BENEFIT_START && frame < CTA_START && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${benefitScale})`,
            opacity: benefitOpacity,
            textAlign: 'center',
            width: '85%',
          }}
        >
          <div
            style={{
              fontSize: 120,
              marginBottom: 30,
            }}
          >
            🚀
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.3,
              textShadow: '0 2px 15px rgba(0,0,0,0.4)',
            }}
          >
            {benefit}
          </div>
        </div>
      )}

      {/* CTA Scene (11-13s) */}
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
