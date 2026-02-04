'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Mic, Volume2, Play, Pause, Loader2, Sparkles } from 'lucide-react'

const BACKEND_URL = '/api/proxy'

interface VoicePreset {
  id: string
  name: string
  provider: string
  voiceId: string
  description: string
  gender: 'male' | 'female'
  style: 'energetic' | 'calm' | 'professional' | 'casual'
}

interface VoiceSelectorProps {
  compositionId: string
  templateProps: any
  onVoiceGenerated: (audioUrl: string, script: string) => void
}

export default function VoiceSelector({
  compositionId,
  templateProps,
  onVoiceGenerated,
}: VoiceSelectorProps) {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('male-energetic')
  const [customScript, setCustomScript] = useState<string>('')
  const [autoScript, setAutoScript] = useState<string>('')
  const [useCustomScript, setUseCustomScript] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Fetch voice presets
  const { data: presets, isLoading: presetsLoading } = useQuery<VoicePreset[]>({
    queryKey: ['voice-presets'],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/voice/presets`)
      return res.data
    },
  })

  // Generate script from template props
  const { mutate: generateScript, isPending: scriptGenerating } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${BACKEND_URL}/voice/generate-script`, {
        compositionId,
        props: templateProps,
      })
      return res.data.script
    },
    onSuccess: (script) => {
      setAutoScript(script)
      if (!useCustomScript) {
        setCustomScript(script)
      }
    },
  })

  // Generate voice
  const { mutate: generateVoice, isPending: voiceGenerating } = useMutation({
    mutationFn: async () => {
      const text = useCustomScript ? customScript : autoScript
      const res = await axios.post(`${BACKEND_URL}/voice/generate`, {
        text,
        voicePresetId: selectedVoiceId,
      })
      return res.data
    },
    onSuccess: (data) => {
      const fullAudioUrl = `http://46.62.209.17:3000${data.audioUrl}`
      onVoiceGenerated(fullAudioUrl, useCustomScript ? customScript : autoScript)
      
      // Play preview
      const audio = new Audio(fullAudioUrl)
      setAudioElement(audio)
      audio.play()
      setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)
    },
  })

  // Auto-generate script on mount
  useEffect(() => {
    if (templateProps) {
      generateScript()
    }
  }, [compositionId, templateProps])

  const togglePlayback = () => {
    if (!audioElement) return

    if (isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
    } else {
      audioElement.play()
      setIsPlaying(true)
    }
  }

  const selectedPreset = presets?.find((p) => p.id === selectedVoiceId)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Voiceover
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Add professional narration to your video
          </p>
        </div>
      </div>

      {/* Voice Preset Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Select Voice
        </label>
        {presetsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {presets?.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedVoiceId(preset.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedVoiceId === preset.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      preset.gender === 'male'
                        ? 'bg-blue-100 dark:bg-blue-900'
                        : 'bg-pink-100 dark:bg-pink-900'
                    }`}
                  >
                    <Mic
                      className={`w-6 h-6 ${
                        preset.gender === 'male'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-pink-600 dark:text-pink-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {preset.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {preset.description}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {preset.style}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Script Editor */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Voiceover Script
          </label>
          <button
            onClick={() => {
              setUseCustomScript(!useCustomScript)
              if (!useCustomScript) {
                setCustomScript(autoScript)
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {useCustomScript ? 'Use Auto-Generated' : 'Customize Script'}
          </button>
        </div>

        {scriptGenerating ? (
          <div className="flex items-center justify-center py-8 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500 mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Generating script...</span>
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={useCustomScript ? customScript : autoScript}
              onChange={(e) => setCustomScript(e.target.value)}
              disabled={!useCustomScript}
              className={`w-full h-32 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                useCustomScript
                  ? 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                  : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
              }`}
              placeholder="Script will be auto-generated from your template content..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {(useCustomScript ? customScript : autoScript).length} characters
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => generateVoice()}
          disabled={voiceGenerating || !autoScript}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {voiceGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Voice...
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              Generate Voiceover
            </>
          )}
        </button>

        {audioElement && (
          <button
            onClick={togglePlayback}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Play className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        )}
      </div>

      {/* Info */}
      {selectedPreset && (
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-purple-900 dark:text-purple-200 mb-1">
                Using {selectedPreset.name}
              </p>
              <p className="text-purple-700 dark:text-purple-300">
                Powered by {selectedPreset.provider === 'elevenlabs' ? 'ElevenLabs' : selectedPreset.provider}
                {' • '}Professional quality AI voice synthesis
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
