'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { Calendar, Video, Settings, TrendingUp, Sparkles } from 'lucide-react'

// Use Vercel API proxy to avoid mixed-content issues (HTTPS → HTTP)
const BACKEND_URL = '/api/proxy'

export default function Home() {
  const { data: videos } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/videos?limit=10`)
      return res.data
    },
  })

  const { data: queueStats } = useQuery({
    queryKey: ['queue-stats'],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/queue/stats`)
      return res.data
    },
    refetchInterval: 5000,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Kinetik UI Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Instagram automation for component showcase videos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Waiting</h3>
              <Video className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {queueStats?.waiting || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Rendering</h3>
              <Video className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {queueStats?.active || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
              <Video className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {queueStats?.completed || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</h3>
              <Video className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {queueStats?.failed || 0}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/preview">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-shadow cursor-pointer">
              <Video className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Video Preview</h2>
              <p className="text-purple-100">Create and preview new videos</p>
            </div>
          </Link>

          <Link href="/calendar">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-shadow cursor-pointer">
              <Calendar className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Content Calendar</h2>
              <p className="text-blue-100">Schedule your posts</p>
            </div>
          </Link>

          <Link href="/analytics">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-shadow cursor-pointer">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Analytics</h2>
              <p className="text-green-100">Track performance metrics</p>
            </div>
          </Link>

          <Link href="/marketing">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-shadow cursor-pointer">
              <Sparkles className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Viral Marketing</h2>
              <p className="text-pink-100">AI-powered viral content</p>
            </div>
          </Link>
        </div>

        {/* Recent Videos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Videos</h2>
            <Link href="/videos" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium">
              View All →
            </Link>
          </div>
          
          {videos && videos.length > 0 ? (
            <div className="space-y-4">
              {videos.slice(0, 5).map((video: any) => (
                <div key={video.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{video.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{video.compositionId}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      video.status === 'posted' ? 'bg-green-100 text-green-800' :
                      video.status === 'rendering' ? 'bg-blue-100 text-blue-800' :
                      video.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No videos yet. Create your first one!</p>
          )}
        </div>

        {/* Settings Link */}
        <div className="mt-8 text-center">
          <Link href="/settings">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
