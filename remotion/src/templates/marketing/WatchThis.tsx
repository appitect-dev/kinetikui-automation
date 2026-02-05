import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

/**
 * WatchThis Template - Visual Wow (8-12s)
 * Visual: Minimal text → Full-screen component demo → Quick CTA
 */

interface Props {
  hook: string;          // "Watch this button animation"
  visualDemo: string;    // Which component to showcase
  impressiveStat: string; // "60fps perfection"
  cta: string;           // "Get it now 👆"
  brandColor?: string;
}

export const WatchThis: React.FC<Props> = ({
  hook,
  visualDemo,
  impressiveStat,
  cta,
  brandColor = "#818CF8"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (10 seconds @ 30fps = 300 frames)
  const HOOK_START = 0;
  const HOOK_END = 45;         // 0-1.5s
  const DEMO_START = 45;
  const DEMO_END = 240;        // 1.5-8s (6.5s of pure visual)
  const STAT_START = 240;
  const STAT_END = 270;        // 8-9s
  const CTA_START = 270;
  const CTA_END = 300;         // 9-10s

  // Hook animation (quick)
  const hookOpacity = interpolate(
    frame,
    [HOOK_START, HOOK_START + 10],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const hookScale = spring({
    frame: frame - HOOK_START,
    fps,
    config: { damping: 10, stiffness: 250 }
  });

  // Demo button animation (continuous loop)
  const buttonHoverCycle = Math.floor((frame - DEMO_START) / 60) % 3; // 2s per cycle
  const buttonProgress = ((frame - DEMO_START) % 60) / 60;

  const buttonScale = spring({
    frame: (frame - DEMO_START) % 60,
    fps,
    config: { damping: 12, stiffness: 180 }
  });

  const buttonGlow = Math.sin(frame * 0.2) * 0.5 + 0.5;

  // Ripple effect
  const rippleProgress = interpolate(
    (frame - DEMO_START) % 30,
    [0, 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const rippleScale = 1 + rippleProgress * 2;
  const rippleOpacity = 1 - rippleProgress;

  // Demo appearance
  const demoOpacity = interpolate(
    frame,
    [DEMO_START, DEMO_START + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Stat reveal
  const statOpacity = interpolate(
    frame,
    [STAT_START, STAT_START + 10],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const statScale = spring({
    frame: frame - STAT_START,
    fps,
    config: { damping: 8, stiffness: 220 }
  });

  // CTA animation
  const ctaOpacity = interpolate(
    frame,
    [CTA_START, CTA_START + 8],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const ctaScale = spring({
    frame: frame - CTA_START,
    fps,
    config: { damping: 9, stiffness: 200 }
  });

  // Particle effect
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 150 + Math.sin(frame * 0.1 + i) * 30;
    return {
      x: Math.cos(angle + frame * 0.05) * distance,
      y: Math.sin(angle + frame * 0.05) * distance,
      delay: i * 5,
    };
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hook Scene (0-1.5s) - Quick intro */}
      {frame >= HOOK_START && frame < DEMO_START && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${hookScale})`,
            opacity: hookOpacity,
            textAlign: 'center',
            width: '90%',
          }}
        >
          <div
            style={{
              fontSize: 56,
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

      {/* Demo Scene (1.5-8s) - Full screen component showcase */}
      {frame >= DEMO_START && frame < STAT_START && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${buttonScale})`,
            opacity: demoOpacity,
            textAlign: 'center',
          }}
        >
          {/* Particles */}
          {frame >= DEMO_START + 30 && particles.map((particle, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(${particle.x}px, ${particle.y}px)`,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: brandColor,
                opacity: interpolate(
                  frame,
                  [DEMO_START + 30 + particle.delay, DEMO_START + 60 + particle.delay],
                  [0, 0.8],
                  { extrapolateRight: 'clamp' }
                ),
                boxShadow: `0 0 20px ${brandColor}`,
              }}
            />
          ))}

          {/* Ripple effect */}
          {frame % 30 === 0 && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) scale(${rippleScale})`,
                width: 200,
                height: 80,
                border: `3px solid ${brandColor}`,
                borderRadius: 15,
                opacity: rippleOpacity,
              }}
            />
          )}

          {/* Main demo button */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: 'white',
              backgroundColor: brandColor,
              padding: '30px 80px',
              borderRadius: 15,
              boxShadow: `0 10px ${60 * buttonGlow}px ${brandColor}88, 0 0 ${80 * buttonGlow}px ${brandColor}66`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transform: `scale(${1 + buttonProgress * 0.1})`,
            }}
          >
            {/* Shimmer effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `-${100 - buttonProgress * 200}%`,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'skewX(-20deg)',
              }}
            />
            {visualDemo}
          </div>

          {/* Component label */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 40,
            }}
          >
            Kinetik UI
          </div>
        </div>
      )}

      {/* Stat Reveal (8-9s) */}
      {frame >= STAT_START && frame < CTA_START && (
        <div
          style={{
            position: 'absolute',
            top: '70%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${statScale})`,
            opacity: statOpacity,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: brandColor,
              textShadow: `0 0 40px ${brandColor}`,
            }}
          >
            {impressiveStat}
          </div>
        </div>
      )}

      {/* CTA Scene (9-10s) */}
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

      {/* FPS counter (subtle) */}
      {frame >= DEMO_START && frame < STAT_START && (
        <div
          style={{
            position: 'absolute',
            top: 80,
            right: 60,
            fontSize: 32,
            fontWeight: 700,
            color: '#22c55e',
            fontFamily: 'monospace',
            textShadow: '0 0 10px #22c55e',
          }}
        >
          60 FPS
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
