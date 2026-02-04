'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

export default function SettingsPage() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/api/settings`)
      return res.data
    },
  })

  const [accessToken, setAccessToken] = useState('')
  const [accountId, setAccountId] = useState('')
  const [postingTimes, setPostingTimes] = useState('')
  const [enabled, setEnabled] = useState(true)

  // Sync form with loaded settings
  useState(() => {
    if (settings) {
      setAccessToken(settings.instagramAccessToken || '')
      setAccountId(settings.instagramAccountId || '')
      setPostingTimes(settings.postingTimes || '09:00,14:00,19:00')
      setEnabled(settings.enabled ?? true)
    }
  })

  const updateSettings = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post(`${BACKEND_URL}/api/settings`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      alert('Settings saved successfully!')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    updateSettings.mutate({
      instagramAccessToken: accessToken,
      instagramAccountId: accountId,
      postingTimes,
      enabled,
    })
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link href="/">
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Configure Instagram API and posting schedule</p>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Instagram Credentials */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instagram API</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Token
                  </label>
                  <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    placeholder="Enter Instagram Graph API access token"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Get this from Meta Developer Portal
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account ID
                  </label>
                  <input
                    type="text"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter Instagram Business Account ID"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your Instagram Business Account ID (@kinetikui)
                  </p>
                </div>
              </div>
            </div>

            {/* Posting Schedule */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Posting Schedule</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Posting Times (CET)
                  </label>
                  <input
                    type="text"
                    value={postingTimes}
                    onChange={(e) => setPostingTimes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono"
                    placeholder="09:00,14:00,19:00"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Comma-separated times in 24-hour format (e.g., 09:00,14:00,19:00)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable automatic posting
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={updateSettings.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save className="w-5 h-5" />
                {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Need Help?</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Follow INSTAGRAM-API-GUIDE.md for API setup</li>
              <li>• Default schedule: 9 AM, 2 PM, 7 PM CET (3 posts/day)</li>
              <li>• Videos are auto-scheduled to next available slot</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
