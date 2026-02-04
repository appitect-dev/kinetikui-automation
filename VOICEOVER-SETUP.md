# 🎙️ AI Voiceover Integration - Setup & Usage

Professional AI voiceover system for Kinetik UI video templates using ElevenLabs TTS.

## 🚀 Quick Start

### 1. Get ElevenLabs API Key

1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Go to [API Settings](https://elevenlabs.io/app/settings/api-keys)
3. Generate a new API key
4. Copy the key for the next step

### 2. Configure Backend

```bash
cd backend
cp ../ENV_TEMPLATE .env
```

Edit `backend/.env` and add your ElevenLabs API key:

```env
ELEVENLABS_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

The voiceover system uses existing dependencies. No additional packages needed!

### 4. Start Backend

```bash
cd backend
npm install  # If not already installed
npm run dev
```

The voice API will be available at:
- `http://localhost:3000/api/voice/presets`
- `http://localhost:3000/api/voice/generate`
- `http://localhost:3000/api/voice/generate-script`

---

## 📚 Architecture

### Voice Generation Flow

```
1. Template Props
   ↓
2. Script Generator (auto-generates narration)
   ↓
3. VoiceService (ElevenLabs API)
   ↓
4. Audio File (.mp3)
   ↓
5. Remotion <Audio> Component
   ↓
6. Final Video with Voiceover
```

### Directory Structure

```
backend/
├── src/render/voice.ts          # VoiceService class
└── audio/                        # Generated audio files
    └── cache/                    # Cached audio for reuse

remotion/src/templates/
├── TutorialSnippet.tsx          # Updated with Audio support
├── FeatureHighlight.tsx         # Updated with Audio support
└── [other templates].tsx        # Add voiceover to these

dashboard/components/
└── VoiceSelector.tsx            # Voice selection UI
```

---

## 🎭 Voice Presets

### Available Voices

| Preset ID          | Name                    | Gender | Style        | Best For                |
|--------------------|-------------------------|--------|--------------|-------------------------|
| `male-energetic`   | Adam - Energetic Male   | Male   | Energetic    | Tech demos, fast-paced  |
| `female-professional` | Rachel - Professional Female | Female | Professional | Tutorials, explainers |
| `male-calm`        | Antoni - Calm Male      | Male   | Calm         | Detailed explanations   |
| `female-energetic` | Elli - Energetic Female | Female | Energetic    | Upbeat content          |
| `male-professional`| Josh - Professional Male| Male   | Professional | Business content        |

### Customization Options

```typescript
{
  voicePresetId: 'male-energetic',
  speakingRate: 1.0,        // 0.5 to 2.0 (1.0 = normal)
  pitch: 0,                 // -20 to +20 semitones
  stability: 0.5,           // 0.0 to 1.0 (ElevenLabs)
  similarityBoost: 0.75     // 0.0 to 1.0 (ElevenLabs)
}
```

---

## 🔌 API Endpoints

### Get Voice Presets

```bash
GET /api/voice/presets
```

**Response:**
```json
[
  {
    "id": "male-energetic",
    "name": "Adam - Energetic Male",
    "provider": "elevenlabs",
    "voiceId": "pNInz6obpgDQGcFmaJgB",
    "description": "Dynamic and engaging male voice",
    "gender": "male",
    "style": "energetic"
  }
]
```

### Generate Voiceover

```bash
POST /api/voice/generate
Content-Type: application/json

{
  "text": "Welcome to Kinetik UI! Let me show you how to build amazing components.",
  "voicePresetId": "male-energetic",
  "speakingRate": 1.0,
  "pitch": 0
}
```

**Response:**
```json
{
  "audioPath": "/root/backend/audio/1234567890_voice.mp3",
  "audioUrl": "/audio/1234567890_voice.mp3",
  "duration": 12,
  "provider": "elevenlabs",
  "cached": false
}
```

### Auto-Generate Script

```bash
POST /api/voice/generate-script
Content-Type: application/json

{
  "compositionId": "TutorialSnippet",
  "props": {
    "title": "Build a React Component",
    "steps": [
      { "text": "Create the file", "duration": 60 },
      { "text": "Write the code", "duration": 80 }
    ]
  }
}
```

**Response:**
```json
{
  "script": "Build a React Component. Here's how to do it. Step 1: Create the file. Step 2: Write the code. And that's it! Follow Kinetik UI for more tips."
}
```

---

## 🎬 Remotion Integration

### Example: Adding Voiceover to Template

```tsx
import { Audio } from "remotion";

interface Props {
  title: string;
  voiceoverUrl?: string;
  backgroundMusicUrl?: string;
  musicVolume?: number;
}

export const MyTemplate: React.FC<Props> = ({ 
  title, 
  voiceoverUrl,
  backgroundMusicUrl,
  musicVolume = 0.2 
}) => {
  return (
    <AbsoluteFill>
      {/* Add voiceover */}
      {voiceoverUrl && (
        <Audio src={voiceoverUrl} volume={1.0} />
      )}

      {/* Add background music (optional) */}
      {backgroundMusicUrl && (
        <Audio src={backgroundMusicUrl} volume={musicVolume} />
      )}

      {/* Your visual content */}
      <h1>{title}</h1>
    </AbsoluteFill>
  );
};
```

### Syncing Animation with Voiceover

```tsx
import { useCurrentFrame, interpolate } from "remotion";

const frame = useCurrentFrame();

// Estimate voiceover duration
const voiceoverDuration = 180; // frames (6 seconds at 30fps)

// Sync animation to voiceover timing
const titleOpacity = interpolate(
  frame,
  [0, 30, voiceoverDuration - 30, voiceoverDuration],
  [0, 1, 1, 0]
);
```

---

## 🎨 Dashboard Integration

### Using VoiceSelector Component

```tsx
import VoiceSelector from '@/components/VoiceSelector'

export default function CreateVideoPage() {
  const [voiceoverUrl, setVoiceoverUrl] = useState<string>('')
  const [script, setScript] = useState<string>('')

  const handleVoiceGenerated = (audioUrl: string, generatedScript: string) => {
    setVoiceoverUrl(audioUrl)
    setScript(generatedScript)
    console.log('Voice generated:', audioUrl)
  }

  return (
    <div>
      <VoiceSelector
        compositionId="TutorialSnippet"
        templateProps={{
          title: "My Tutorial",
          steps: [...]
        }}
        onVoiceGenerated={handleVoiceGenerated}
      />

      {/* Pass voiceoverUrl to video render */}
      <button onClick={() => renderVideo({ voiceoverUrl })}>
        Render Video
      </button>
    </div>
  )
}
```

---

## 💾 Audio Caching

The system automatically caches generated audio files to save API costs and improve performance.

### Cache Location
```
backend/audio/cache/
```

### Cache Key Generation
Combines: `voicePresetId + text + speakingRate + pitch`

### Cache Benefits
- Reduces ElevenLabs API usage
- Faster regeneration of identical voiceovers
- Lower costs for repeated content

### Clear Cache
```bash
rm -rf backend/audio/cache/*
```

---

## 🎵 Background Music Integration

### Adding Background Music

1. Place music files in `backend/audio/music/`
2. Pass `backgroundMusicUrl` to template:

```tsx
<MyTemplate
  voiceoverUrl="http://46.62.209.17:3000/audio/voice.mp3"
  backgroundMusicUrl="http://46.62.209.17:3000/audio/music/upbeat.mp3"
  musicVolume={0.2}  // 20% volume (don't overpower voice)
/>
```

### Recommended Music Volume
- Voiceover: `1.0` (100%)
- Background music: `0.15 - 0.3` (15-30%)

---

## 🔧 Script Generator Customization

### Default Scripts by Template

- **TutorialSnippet**: Step-by-step walkthrough
- **FeatureHighlight**: Feature descriptions
- **ProblemSolution**: Problem/solution narrative
- **Comparison**: Comparison breakdown
- **SocialProof**: Testimonial highlights

### Custom Script Generation

Edit `backend/src/render/voice.ts`:

```typescript
private generateTutorialScript(props: any): string {
  // Your custom logic here
  return `Custom narration for ${props.title}...`;
}
```

---

## 🧪 Testing

### Test Voice Generation

```bash
curl -X POST http://localhost:3000/api/voice/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a test voiceover.",
    "voicePresetId": "male-energetic"
  }'
```

### Test Script Generation

```bash
curl -X POST http://localhost:3000/api/voice/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "TutorialSnippet",
    "props": {
      "title": "Test Tutorial",
      "steps": [{"text": "Step 1", "duration": 60}]
    }
  }'
```

---

## 💰 Cost Optimization

### ElevenLabs Pricing
- **Free tier**: 10,000 characters/month
- **Starter**: $5/month for 30,000 characters
- **Creator**: $22/month for 100,000 characters

### Tips to Reduce Costs
1. **Use caching** - Cached audio doesn't count toward quota
2. **Optimize scripts** - Shorter scripts = fewer characters
3. **Batch generation** - Generate all audio at once
4. **Test with short scripts** - Use brief text for development

### Monitor Usage
Check your ElevenLabs dashboard for character usage:
[ElevenLabs Usage](https://elevenlabs.io/app/usage)

---

## 🐛 Troubleshooting

### "ElevenLabs API key not configured"
- Ensure `ELEVENLABS_API_KEY` is set in `backend/.env`
- Restart the backend server after adding the key

### Audio file not found
- Check `backend/audio/` directory exists
- Verify file permissions: `chmod 755 backend/audio`

### Voice sounds robotic
- Adjust `stability` (lower = more variation)
- Adjust `similarityBoost` (higher = closer to original voice)
- Try different voice presets

### Audio not playing in Remotion
- Use absolute URLs: `http://46.62.209.17:3000/audio/...`
- Check CORS headers in backend
- Verify audio file format (MP3 recommended)

---

## 🚀 Production Deployment

### Environment Variables (Production)

```env
# Production backend
ELEVENLABS_API_KEY=sk_prod_actual_key_here
PUBLIC_VIDEO_URL=http://46.62.209.17:3000/videos
```

### Audio File Storage

For production, consider:
1. **Local storage** (current setup) - Simple, no extra costs
2. **Cloud storage** (S3, R2) - Scalable, CDN-backed
3. **Hybrid** - Cache locally, archive to cloud

### Performance Tips

1. **Pregenerate scripts** - Generate during video queuing
2. **Parallel processing** - Generate voice while rendering video
3. **CDN caching** - Serve audio files via CDN
4. **Async generation** - Don't block UI waiting for voice

---

## 📦 Dependencies

All dependencies already included in the project:
- `axios` - API requests
- `remotion` - Audio component
- Express - File serving

No additional packages required! 🎉

---

## 🔮 Future Enhancements

- [ ] Google Cloud TTS fallback (if ElevenLabs quota exceeded)
- [ ] Azure TTS integration
- [ ] Voice cloning for brand consistency
- [ ] SSML support for fine-grained control
- [ ] Automatic subtitle generation from voiceover
- [ ] Multi-language support
- [ ] Audio waveform visualization in videos
- [ ] Real-time voice preview in dashboard

---

## 📞 Support

### Resources
- [ElevenLabs Docs](https://docs.elevenlabs.io/)
- [Remotion Audio Docs](https://www.remotion.dev/docs/audio)
- [Project README](./README.md)

### Common Issues
See **Troubleshooting** section above.

---

**Built with ❤️ for Kinetik UI**

*Professional AI voiceover to make your videos stand out!* 🎙️✨
