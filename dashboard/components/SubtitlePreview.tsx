'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SubtitleWord {
  word: string
  start: number
  end: number
}

interface SubtitleChunk {
  words: SubtitleWord[]
  start: number
  end: number
}

interface SubtitlePreviewProps {
  chunks: SubtitleChunk[]
  fps?: number
  className?: string
}

export function SubtitlePreview({
  chunks,
  fps = 30,
  className = '',
}: SubtitlePreviewProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const maxFrame = chunks[chunks.length - 1]?.end || 900
        return prev >= maxFrame ? 0 : prev + 1
      })
    }, 1000 / fps)

    return () => clearInterval(interval)
  }, [isPlaying, fps, chunks])

  const currentChunk = chunks.find(
    (chunk) => currentFrame >= chunk.start && currentFrame <= chunk.end
  )

  const formatTime = (frame: number) => {
    const seconds = frame / fps
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  if (!showPreview) {
    return (
      <Button
        onClick={() => setShowPreview(true)}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Eye className="w-4 h-4 mr-2" />
        Preview Subtitles
      </Button>
    )
  }

  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Subtitle Preview</h3>
        <Button
          onClick={() => setShowPreview(false)}
          variant="ghost"
          size="sm"
        >
          <EyeOff className="w-4 h-4" />
        </Button>
      </div>

      {/* Preview Area */}
      <div className="relative bg-black rounded-lg aspect-video flex items-end justify-center p-6">
        {currentChunk && (
          <div className="flex flex-wrap justify-center gap-2 text-white">
            {currentChunk.words.map((wordData, index) => {
              const isActive =
                currentFrame >= wordData.start && currentFrame <= wordData.end
              return (
                <span
                  key={index}
                  style={{
                    fontFamily: 'Poppins, Arial Black, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: isActive ? '#FFD700' : '#FFFFFF',
                    textTransform: 'uppercase',
                    WebkitTextStroke: '2px #000000',
                    textShadow: '0 0 10px rgba(0,0,0,0.8)',
                    transition: 'all 0.1s ease',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {wordData.word}
                </span>
              )
            })}
          </div>
        )}

        {!currentChunk && (
          <div className="text-gray-500 text-center">
            No subtitles at this time
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-3">
        {/* Timeline */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max={chunks[chunks.length - 1]?.end || 900}
            value={currentFrame}
            onChange={(e) => setCurrentFrame(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentFrame)}</span>
            <span>{formatTime(chunks[chunks.length - 1]?.end || 900)}</span>
          </div>
        </div>

        {/* Play/Pause */}
        <div className="flex gap-2">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            onClick={() => setCurrentFrame(0)}
            variant="outline"
            size="sm"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-gray-800 rounded p-2">
          <div className="text-gray-400">Chunks</div>
          <div className="text-white font-semibold">{chunks.length}</div>
        </div>
        <div className="bg-gray-800 rounded p-2">
          <div className="text-gray-400">Words</div>
          <div className="text-white font-semibold">
            {chunks.reduce((sum, c) => sum + c.words.length, 0)}
          </div>
        </div>
        <div className="bg-gray-800 rounded p-2">
          <div className="text-gray-400">FPS</div>
          <div className="text-white font-semibold">{fps}</div>
        </div>
      </div>
    </div>
  )
}
