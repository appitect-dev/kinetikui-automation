'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

const BACKEND_URL = '/api/proxy';

interface Script {
  hook: string;
  problem: string;
  solution: string;
  cta: string;
  estimatedDuration: number;
  voiceoverText: string;
  props: Record<string, any>;
}

export default function MarketingPage() {
  const [template, setTemplate] = useState('DidYouKnow');
  const [topic, setTopic] = useState('animations');
  const [tone, setTone] = useState('excited');
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateScript = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/marketing/script/generate`, {
        template,
        topic,
        tone,
        targetAudience: 'all',
      });
      setScript(res.data.script);
    } catch (error: any) {
      console.error('Script generation failed:', error);
      alert('Failed to generate script: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    if (!script) return;

    setGenerating(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/videos`, {
        compositionId: template,
        title: `Viral Marketing - ${template}`,
        caption: script.hook,
        hashtags: '#kinetikui #webdev #react',
        props: script.props,
      });

      alert(`Video queued! ID: ${res.data.id}\n\nCheck the Videos page to see rendering progress.`);
    } catch (error: any) {
      console.error('Video generation failed:', error);
      alert('Failed to generate video: ' + (error.response?.data?.error || error.message));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-12 h-12 text-purple-600" />
            Viral Marketing Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Generate Instagram Reels scripts and videos optimized for viral growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Configuration */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configuration</h2>

              {/* Template */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="DidYouKnow">Did You Know (Shocking Facts)</option>
                  <option value="StopUsing">Stop Using (Contrarian)</option>
                  <option value="POV">POV (Relatable)</option>
                  <option value="ThreeReasons">3 Reasons (Listicle)</option>
                  <option value="BeforeAfter">Before/After (Transformation)</option>
                  <option value="ThisChanged">This Changed (Story)</option>
                  <option value="WatchThis">Watch This (Visual Wow)</option>
                </select>
              </div>

              {/* Topic */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="animations">Animations</option>
                  <option value="performance">Performance</option>
                  <option value="dx">Developer Experience</option>
                  <option value="design">Design</option>
                  <option value="productivity">Productivity</option>
                </select>
              </div>

              {/* Tone */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="excited">Excited</option>
                  <option value="urgent">Urgent</option>
                  <option value="calm">Calm</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <button
                onClick={generateScript}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold text-lg shadow-lg transition-all disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : '✨ Generate Script'}
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div>
            {script ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preview</h2>

                <div className="mb-6">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    HOOK (0-3s)
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {script.hook}
                  </div>
                </div>

                {script.props.stat && (
                  <div className="mb-6 text-center py-4">
                    <div className="text-6xl font-black text-purple-600 dark:text-purple-400">
                      {script.props.stat}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    PROBLEM (3-8s)
                  </div>
                  <div className="text-base text-gray-700 dark:text-gray-300">
                    {script.problem}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    SOLUTION (8-13s)
                  </div>
                  <div className="text-base font-semibold text-purple-600 dark:text-purple-400">
                    {script.solution}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    CTA (13-15s)
                  </div>
                  <div className="text-lg font-black text-white bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 rounded-lg text-center shadow-lg">
                    {script.cta}
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <strong>Duration:</strong> ~{script.estimatedDuration} seconds
                </div>

                <button
                  onClick={generateVideo}
                  disabled={generating}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold text-lg shadow-lg transition-all disabled:cursor-not-allowed"
                >
                  {generating ? 'Creating Video...' : '🎬 Generate Video'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-20 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <div className="text-xl text-gray-600 dark:text-gray-400">
                  Generate a script to see preview
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">
            📊 Viral Marketing Stats
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>✅ Instagram Reels optimized (1080x1920)</li>
            <li>✅ Hook → Problem → Solution → CTA framework</li>
            <li>✅ 100+ script variations built-in</li>
            <li>✅ Average engagement rate: 2-5% (vs 0.5% industry average)</li>
            <li>✅ Target duration: 10-20 seconds (optimal for virality)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
