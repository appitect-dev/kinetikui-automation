'use client';

import Link from 'next/link';
import { TrendingUp, ArrowLeft, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-12 h-12 text-green-600" />
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Track your Instagram performance metrics
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-16 border border-gray-200 dark:border-gray-700 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Analytics dashboard is currently in development. Track:
            </p>
            <ul className="text-left space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Views, likes, comments, shares per video</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Engagement rate trends over time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Best performing templates and topics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Follower growth and reach metrics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>ROI and conversion tracking</span>
              </li>
            </ul>
            <Link href="/videos">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold shadow-lg transition-all">
                View Your Videos
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
