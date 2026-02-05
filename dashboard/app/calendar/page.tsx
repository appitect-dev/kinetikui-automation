'use client';

import Link from 'next/link';
import { Calendar as CalendarIcon, ArrowLeft, Clock } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <CalendarIcon className="w-12 h-12 text-blue-600" />
            Content Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Schedule and manage your Instagram posts
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-16 border border-gray-200 dark:border-gray-700 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              The content calendar feature is currently in development. You'll be able to:
            </p>
            <ul className="text-left space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>Schedule posts for specific dates and times</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>Drag-and-drop calendar interface</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>Auto-posting 3x per day (9AM, 2PM, 7PM)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>Bulk scheduling from Marketing page</span>
              </li>
            </ul>
            <Link href="/marketing">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold shadow-lg transition-all">
                Create Videos in Marketing
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
