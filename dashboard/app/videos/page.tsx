'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Video, Download, Instagram, Calendar, Clock } from 'lucide-react'

// Use Vercel API proxy to avoid mixed-content issues (HTTPS → HTTP)
const BACKEND_URL = '/api/proxy'

export default function VideosPage() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['all-videos'],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/videos?limit=50`)
      return res.data
    },
    refetchInterval: 5000,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rendered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rendering':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'posted':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            All Videos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all rendered videos and their status
          </p>
        </div>

        {/* Videos Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-600 dark:text-gray-400">Loading videos...</p>
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {videos.map((video: any) => (
              <div
                key={video.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Video Preview */}
                {video.status === 'rendered' && video.filePath && (
                  <div className="relative bg-black aspect-video">
                    <video
                      src={`http://46.62.209.17:5000${video.filePath.replace('/home/deploy/kinetikui-automation', '')}`}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Video Info */}
                <div className="p-6">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {video.compositionId}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(video.status)}`}>
                      {video.status}
                    </span>
                  </div>

                  {/* Caption */}
                  {video.caption && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                      {video.caption}
                    </p>
                  )}

                  {/* Hashtags */}
                  {video.hashtags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {video.hashtags.split(' ').map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(video.createdAt).toLocaleString()}
                    </div>
                    {video.postedAt && (
                      <div className="flex items-center gap-1">
                        <Instagram className="w-4 h-4" />
                        Posted
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {video.status === 'rendered' && video.filePath && (
                      <>
                        <a
                          href={`http://46.62.209.17:5000${video.filePath.replace('/home/deploy/kinetikui-automation', '')}`}
                          download
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        {video.status !== 'posted' && (
                          <button
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            onClick={() => alert('Instagram posting feature coming soon!')}
                          >
                            <Instagram className="w-4 h-4" />
                            Post Now
                          </button>
                        )}
                      </>
                    )}
                    {video.status === 'failed' && video.error && (
                      <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-xs text-red-700 dark:text-red-400 font-mono">
                          {video.error.substring(0, 200)}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No videos yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first video in the Preview tab
            </p>
            <a
              href="/preview"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Video className="w-5 h-5" />
              Create Video
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
