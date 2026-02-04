'use client'

import { ArrowLeft, TrendingUp, Eye, Heart, MessageCircle, Bookmark } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  // This would fetch real metrics from the backend
  const mockMetrics = {
    totalViews: 12500,
    totalLikes: 850,
    totalComments: 120,
    totalSaves: 340,
    avgEngagement: 10.5,
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

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Track your Instagram Reels performance</p>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-6 h-6 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockMetrics.totalViews.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Likes</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockMetrics.totalLikes.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockMetrics.totalComments.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="w-6 h-6 text-purple-500" />
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Saves</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockMetrics.totalSaves.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockMetrics.avgEngagement}%</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Detailed Analytics Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're building advanced analytics including performance trends, best posting times, and content insights.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>• Video-by-video performance breakdown</p>
            <p>• Engagement rate trends over time</p>
            <p>• Best performing templates</p>
            <p>• Audience demographics</p>
          </div>
        </div>
      </div>
    </div>
  )
}
