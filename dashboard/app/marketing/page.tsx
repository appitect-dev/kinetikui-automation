'use client';

import { useState } from 'react';
import axios from 'axios';

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
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
        🎬 Viral Marketing Generator
      </h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Generate Instagram Reels scripts and videos optimized for viral growth
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Left: Configuration */}
        <div>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Configuration</h2>

            {/* Template */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Template
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                }}
              >
                <option value="DidYouKnow">Did You Know (Shocking Facts)</option>
                <option value="StopUsing" disabled>Stop Using (Coming Soon)</option>
                <option value="POV" disabled>POV (Coming Soon)</option>
                <option value="ThreeReasons" disabled>3 Reasons (Coming Soon)</option>
              </select>
            </div>

            {/* Topic */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                }}
              >
                <option value="animations">Animations</option>
                <option value="performance">Performance</option>
                <option value="dx">Developer Experience</option>
                <option value="design">Design</option>
                <option value="productivity">Productivity</option>
              </select>
            </div>

            {/* Tone */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                }}
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
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#ccc' : '#818CF8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Generating...' : '✨ Generate Script'}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div>
          {script ? (
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Preview</h2>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>HOOK (0-3s)</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#111' }}>
                  {script.hook}
                </div>
              </div>

              {script.props.stat && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '64px', fontWeight: '900', color: '#818CF8' }}>
                    {script.props.stat}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>PROBLEM (3-8s)</div>
                <div style={{ fontSize: '16px', color: '#111' }}>
                  {script.problem}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>SOLUTION (8-13s)</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#818CF8' }}>
                  {script.solution}
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>CTA (13-15s)</div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: 'white',
                    background: '#818CF8',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  {script.cta}
                </div>
              </div>

              <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                <strong>Duration:</strong> ~{script.estimatedDuration} seconds
              </div>

              <button
                onClick={generateVideo}
                disabled={generating}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: generating ? '#ccc' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: generating ? 'not-allowed' : 'pointer',
                }}
              >
                {generating ? 'Creating Video...' : '🎬 Generate Video'}
              </button>
            </div>
          ) : (
            <div
              style={{
                background: '#f9fafb',
                padding: '60px 30px',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#999',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎬</div>
              <div style={{ fontSize: '18px' }}>Generate a script to see preview</div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div
        style={{
          marginTop: '40px',
          background: '#f0f9ff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #bae6fd',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          📊 Viral Marketing Stats
        </h3>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#666' }}>
          <li>Instagram Reels optimized (1080x1920)</li>
          <li>Hook → Problem → Solution → CTA framework</li>
          <li>100+ script variations built-in</li>
          <li>Average engagement rate: 2-5% (vs 0.5% industry average)</li>
          <li>Target duration: 10-20 seconds (optimal for virality)</li>
        </ul>
      </div>
    </div>
  );
}
