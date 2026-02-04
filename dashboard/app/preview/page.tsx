'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Video } from 'lucide-react'
import Link from 'next/link'

// Use Vercel API proxy to avoid mixed-content issues (HTTPS → HTTP)
const BACKEND_URL = '/api/proxy'

const TEMPLATES = [
  { id: 'ComponentShowcase', name: 'Component Showcase', description: 'Scrolling grid of animated components' },
  { id: 'CodeReveal', name: 'Code Reveal', description: 'Typing effect showing component code' },
  { id: 'BeforeAfter', name: 'Before/After', description: 'Static UI → Animated transformation' },
  { id: 'FeatureHighlight', name: 'Feature Highlight', description: 'Single component with 3-5 features' },
  { id: 'SpeedBuild', name: 'Speed Build', description: 'Timelapse of building with components' },
  { id: 'HookPattern', name: 'Hook Pattern', description: 'POV: You just discovered X' },
  { id: 'ProblemSolution', name: 'Problem/Solution', description: 'Common problem → Kinetik solution' },
  { id: 'Comparison', name: 'Comparison', description: 'Side-by-side comparison' },
  { id: 'TutorialSnippet', name: 'Tutorial Snippet', description: '15sec how-to-use' },
  { id: 'SocialProof', name: 'Social Proof', description: 'Testimonials and stats' },
]

export default function PreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('#kinetikui #react #animation #webdev #uiux')
  
  const queryClient = useQueryClient()

  const createVideo = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post(`${BACKEND_URL}/api/videos`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      alert('Video queued for rendering!')
      setTitle('')
      setCaption('')
      setSelectedTemplate('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate || !title) {
      alert('Please select a template and enter a title')
      return
    }

    createVideo.mutate({
      compositionId: selectedTemplate,
      title,
      caption,
      hashtags,
      props: {}, // Add template-specific props here
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        <Link href="/">
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create Video</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Select a template and customize your video</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Templates</h2>
            <div className="space-y-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{template.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Video Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Amazing Kinetik UI Components"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Discover the power of Kinetik UI..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="#kinetikui #react #animation"
                />
              </div>

              <button
                type="submit"
                disabled={createVideo.isPending || !selectedTemplate}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Video className="w-5 h-5" />
                {createVideo.isPending ? 'Creating...' : 'Create & Queue Video'}
              </button>
            </form>

            {selectedTemplate && (
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Selected:</strong> {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Video will be rendered and added to the schedule queue
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
