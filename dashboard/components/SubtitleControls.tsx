'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Download, FileText, Eye } from 'lucide-react'
import axios from 'axios'

const BACKEND_URL = '/api/proxy'

interface SubtitleControlsProps {
  videoId: string
  subtitlesEnabled: boolean
  subtitlesSrtPath?: string | null
  subtitlesVttPath?: string | null
  script?: string | null
  onUpdate: (data: { subtitlesEnabled: boolean }) => void
}

export function SubtitleControls({
  videoId,
  subtitlesEnabled,
  subtitlesSrtPath,
  subtitlesVttPath,
  script,
  onUpdate,
}: SubtitleControlsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async (enabled: boolean) => {
    try {
      await axios.patch(`${BACKEND_URL}/videos/${videoId}`, {
        subtitlesEnabled: enabled,
      })
      onUpdate({ subtitlesEnabled: enabled })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGenerate = async () => {
    if (!script) {
      setError('No script available for this video')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Generate subtitle chunks
      const response = await axios.post(`${BACKEND_URL}/subtitles/generate`, {
        script,
        fps: 30,
        durationInFrames: 900, // 30 seconds at 30fps
        maxWordsPerChunk: 3,
        wordsPerSecond: 2.5,
      })

      const { chunks } = response.data

      // Export SRT and VTT
      const srtResponse = await axios.post(`${BACKEND_URL}/subtitles/export`, {
        chunks,
        fps: 30,
        format: 'srt',
        videoId,
      })

      const vttResponse = await axios.post(`${BACKEND_URL}/subtitles/export`, {
        chunks,
        fps: 30,
        format: 'vtt',
        videoId,
      })

      // Update video with subtitle data
      await axios.patch(`${BACKEND_URL}/videos/${videoId}`, {
        subtitles: JSON.stringify(chunks),
        subtitlesSrtPath: srtResponse.data.path,
        subtitlesVttPath: vttResponse.data.path,
      })

      // Trigger re-render if needed
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (format: 'srt' | 'vtt') => {
    const path = format === 'srt' ? subtitlesSrtPath : subtitlesVttPath
    if (!path) return

    try {
      const response = await axios.get(`${BACKEND_URL}${path}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `subtitles_${videoId}.${format}`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">
            Subtitles
          </span>
        </div>
        <Switch checked={subtitlesEnabled} onCheckedChange={handleToggle} />
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded">
          {error}
        </div>
      )}

      {script && !subtitlesSrtPath && (
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="w-full mb-2"
        >
          {isGenerating ? 'Generating...' : 'Generate Subtitles'}
        </Button>
      )}

      {(subtitlesSrtPath || subtitlesVttPath) && (
        <div className="space-y-2">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Download subtitle files:
          </div>
          <div className="flex gap-2">
            {subtitlesSrtPath && (
              <Button
                onClick={() => handleDownload('srt')}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                SRT
              </Button>
            )}
            {subtitlesVttPath && (
              <Button
                onClick={() => handleDownload('vtt')}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                VTT
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
