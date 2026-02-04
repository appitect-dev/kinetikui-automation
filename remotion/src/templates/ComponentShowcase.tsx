import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'

interface Props {
  componentName?: string
  description?: string
  tags?: string[]
}

// Professional easing curves (using Remotion's Easing API)
const EASING = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutBack: Easing.out(Easing.back(1.5)),
  easeInOutCubic: Easing.inOut(Easing.cubic),
  anticipate: (t: number) => {
    const c = 1.70158
    return t * t * ((c + 1) * t - c)
  },
}

// Floating particles background
function FloatingParticles({ frame, count = 30 }: { frame: number; count?: number }) {
  const particles = Array.from({ length: count }).map((_, i) => {
    const baseX = (i / count) * 1080 + (Math.sin(i * 100) * 200)
    const baseY = (Math.sin(i * 50) * 0.5 + 0.5) * 1920
    const amplitude = 40 + (i % 3) * 20
    const frequency = 0.02 + (i % 5) * 0.01
    
    const x = baseX + Math.sin(frame * frequency + i) * amplitude
    const y = baseY + Math.cos(frame * frequency * 0.7 + i) * amplitude * 1.5
    const opacity = 0.1 + Math.sin(frame * frequency + i) * 0.15
    const size = 3 + (i % 4)
    
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: '50%',
          background: i % 3 === 0 ? '#818CF8' : i % 3 === 1 ? '#A78BFA' : '#C4B5FD',
          opacity,
          filter: 'blur(1px)',
        }}
      />
    )
  })
  
  return <>{particles}</>
}

// Animated button with advanced interactions
function AnimatedButton({ frame, videoConfig }: { frame: number; videoConfig: { fps: number } }) {
  const startFrame = 70
  
  // Entrance with spring
  const entranceScale = spring({
    frame: frame - startFrame,
    fps: videoConfig.fps,
    config: { damping: 10, stiffness: 180, mass: 0.8 },
  })
  
  const entranceY = interpolate(
    frame,
    [startFrame, startFrame + 25],
    [60, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  )
  
  const entranceOpacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  )
  
  // Hover animation sequence
  const hoverScale = interpolate(
    frame,
    [100, 110, 125, 135, 150, 160],
    [1, 1.08, 1, 1.08, 1, 1.05],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  )
  
  // Click animation
  const clickScale = interpolate(
    frame,
    [165, 170, 175],
    [1, 0.92, 1],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  )
  
  // Glow pulse
  const glowIntensity = interpolate(
    frame,
    [100, 125, 150, 175],
    [0.4, 0.7, 0.4, 0.9],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sine) }
  )
  
  // Motion blur on click
  const motionBlur = interpolate(
    frame,
    [165, 168, 175],
    [0, 3, 0],
    { extrapolateRight: 'clamp' }
  )
  
  return (
    <div
      style={{
        transform: `translateY(${entranceY}px) scale(${entranceScale * hoverScale * clickScale})`,
        opacity: entranceOpacity,
        filter: `blur(${motionBlur}px)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          padding: '22px 56px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          boxShadow: `0 8px 32px rgba(102, 126, 234, ${glowIntensity}), 0 0 0 1px rgba(255,255,255,0.1) inset`,
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {/* Shimmer effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: interpolate(frame, [startFrame + 30, startFrame + 60], [-200, 400], { 
              extrapolateRight: 'clamp', 
              easing: Easing.inOut(Easing.cubic) 
            }),
            width: '200px',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
        
        <span style={{ 
          position: 'relative',
          color: 'white', 
          fontSize: '24px', 
          fontWeight: 700, 
          fontFamily: 'Space Grotesk, sans-serif',
          textShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          Hover & Click Me
        </span>
      </div>
    </div>
  )
}

// Animated card with parallax
function AnimatedCard({ frame, videoConfig }: { frame: number; videoConfig: { fps: number } }) {
  const startFrame = 85
  
  // Entrance with spring
  const cardY = spring({
    frame: frame - startFrame,
    fps: videoConfig.fps,
    config: { damping: 12, stiffness: 150, mass: 1 },
  })
  
  const cardOpacity = interpolate(
    frame, 
    [startFrame, startFrame + 20], 
    [0, 1], 
    { extrapolateRight: 'clamp' }
  )
  
  const cardRotation = interpolate(
    frame,
    [startFrame, startFrame + 35],
    [8, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  )
  
  // Floating animation
  const floatY = Math.sin(frame * 0.05) * 8
  
  // Icon glow pulse
  const iconGlow = interpolate(
    frame,
    [startFrame + 40, startFrame + 70, startFrame + 100],
    [0.3, 0.7, 0.3],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sine) }
  )
  
  return (
    <div
      style={{
        transform: `translateY(${(1 - cardY) * 50 + floatY}px) rotate(${cardRotation * (1 - cardY)}deg)`,
        opacity: cardOpacity,
        width: '300px',
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Animated icon */}
      <div 
        style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '14px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 24px rgba(102, 126, 234, ${iconGlow})`,
          transform: `scale(${1 + Math.sin(frame * 0.05) * 0.05})`,
        }}
      >
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: 'white',
          opacity: 0.9,
        }} />
      </div>
      
      <div style={{ 
        fontSize: '22px', 
        fontWeight: 700, 
        color: '#0a0a0a', 
        marginBottom: '12px', 
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        Feature Card
      </div>
      
      <div style={{ 
        fontSize: '15px', 
        color: '#525252', 
        lineHeight: 1.6, 
        fontFamily: 'DM Sans, sans-serif',
      }}>
        Smooth entrance with spring physics and floating animation
      </div>
    </div>
  )
}

// Character-by-character text reveal
function KineticText({ 
  text, 
  frame, 
  startFrame = 0, 
  style = {} 
}: { 
  text: string; 
  frame: number; 
  startFrame?: number;
  style?: React.CSSProperties;
}) {
  const chars = text.split('')
  
  return (
    <div style={{ display: 'flex', ...style }}>
      {chars.map((char, i) => {
        const charDelay = startFrame + (i * 2)
        const opacity = interpolate(
          frame,
          [charDelay, charDelay + 8],
          [0, 1],
          { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
        )
        
        const blur = interpolate(
          frame,
          [charDelay, charDelay + 12],
          [8, 0],
          { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
        )
        
        const y = interpolate(
          frame,
          [charDelay, charDelay + 15],
          [20, 0],
          { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
        )
        
        const scale = interpolate(
          frame,
          [charDelay, charDelay + 10],
          [0.8, 1],
          { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) }
        )
        
        return (
          <span
            key={`${char}-${i}`}
            style={{
              opacity,
              filter: `blur(${blur}px)`,
              transform: `translateY(${y}px) scale(${scale})`,
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </div>
  )
}

export const ComponentShowcase: React.FC<Props> = ({
  componentName = 'Animated Button',
  description = 'Interactive button with smooth hover animations',
  tags = ['React', 'Framer Motion', 'TypeScript']
}) => {
  const frame = useCurrentFrame()
  const videoConfig = useVideoConfig()
  const isVertical = videoConfig.height > videoConfig.width

  // Logo entrance
  const logoScale = spring({
    frame,
    fps: videoConfig.fps,
    config: { damping: 10, stiffness: 180, mass: 0.8 },
  })
  
  const logoRotate = interpolate(
    frame,
    [0, 30],
    [90, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  )

  // Badge entrance
  const badgeScale = spring({
    frame: frame - 8,
    fps: videoConfig.fps,
    config: { damping: 8, stiffness: 200, mass: 0.7 },
  })
  
  const badgeX = interpolate(
    frame,
    [8, 35],
    [100, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  )

  // Description fade
  const descOpacity = interpolate(
    frame, 
    [45, 65], 
    [0, 1], 
    { extrapolateRight: 'clamp' }
  )
  
  const descY = interpolate(
    frame, 
    [45, 65], 
    [15, 0], 
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  )

  // Tags stagger
  const tagOpacity = (index: number) => interpolate(
    frame,
    [55 + (index * 5), 70 + (index * 5)],
    [0, 1],
    { extrapolateRight: 'clamp' }
  )
  
  const tagScale = (index: number) => spring({
    frame: frame - (55 + index * 5),
    fps: videoConfig.fps,
    config: { damping: 10, stiffness: 200 },
  })

  // Preview container
  const previewOpacity = interpolate(
    frame, 
    [60, 80], 
    [0, 1], 
    { extrapolateRight: 'clamp' }
  )

  // Gradient orb animations
  const orb1X = interpolate(
    frame,
    [0, 450],
    [-10, 10],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sine) }
  )
  
  const orb2Y = interpolate(
    frame,
    [0, 450],
    [-5, 15],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sine) }
  )

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)',
        fontFamily: 'Space Grotesk, DM Sans, system-ui, sans-serif',
      }}
    >
      {/* Animated grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(129, 140, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(129, 140, 248, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      />

      {/* Floating particles */}
      <FloatingParticles frame={frame} count={25} />

      {/* Animated gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: `${orb1X}%`,
          width: '55%',
          height: '55%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 60%)',
          filter: 'blur(70px)',
          opacity: interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: `${orb2Y}%`,
          left: '-8%',
          width: '45%',
          height: '45%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 60%)',
          filter: 'blur(60px)',
          opacity: interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: isVertical ? '80px 48px' : '60px',
          height: '100%',
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: isVertical ? '56px' : '40px',
        }}>
          {/* Animated Logo */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            transformOrigin: 'left center',
          }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Animated shine */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: interpolate(frame, [10, 40], [-60, 80], { extrapolateRight: 'clamp' }),
                  width: '60px',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transform: 'skewX(-20deg)',
                }}
              />
              <span style={{ color: 'white', fontSize: '28px', fontWeight: 800, zIndex: 1 }}>K</span>
            </div>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>Kinetik</span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#818CF8' }}>.</span>
          </div>

          {/* Badge */}
          <div
            style={{
              transform: `scale(${badgeScale}) translateX(${badgeX}px)`,
              padding: '10px 20px',
              background: 'rgba(129, 140, 248, 0.15)',
              borderRadius: '28px',
              border: '1px solid rgba(129, 140, 248, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#A5B4FC' }}>Component</span>
          </div>
        </div>

        {/* Component Info */}
        <div style={{ marginBottom: isVertical ? '70px' : '50px' }}>
          {/* Kinetic title */}
          <KineticText
            text={componentName}
            frame={frame}
            startFrame={15}
            style={{
              fontSize: isVertical ? '48px' : '52px',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '20px',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          />

          {/* Description */}
          <div
            style={{
              opacity: descOpacity,
              transform: `translateY(${descY}px)`,
              fontSize: '22px',
              color: '#d4d4d8',
              lineHeight: 1.5,
              maxWidth: '85%',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {description}
          </div>

          {/* Tags with stagger */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            {tags.map((tag, i) => (
              <div
                key={tag}
                style={{
                  opacity: tagOpacity(i),
                  transform: `scale(${tagScale(i)})`,
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#d4d4d8' }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Component Preview Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: previewOpacity,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle grid inside preview */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          
          <div style={{ 
            display: 'flex', 
            flexDirection: isVertical ? 'column' : 'row', 
            gap: '40px', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            <AnimatedButton frame={frame} videoConfig={videoConfig} />
            <AnimatedCard frame={frame} videoConfig={videoConfig} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '28px',
          opacity: interpolate(frame, [400, 430], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <span style={{ 
            fontSize: '15px', 
            color: '#71717a', 
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
          }}>
            kinetik-ui.com
          </span>
        </div>
      </div>
    </AbsoluteFill>
  )
}
