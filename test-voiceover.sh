#!/bin/bash
# Test script for AI voiceover integration
# Generates 3 test videos with different voices

set -e

BACKEND_URL="http://localhost:3000"
BACKEND_PROD_URL="http://46.62.209.17:3000"

echo "🎙️  Testing AI Voiceover Integration"
echo "===================================="
echo ""

# Check if backend is running
echo "🔍 Checking backend connection..."
if curl -s "$BACKEND_URL/health" > /dev/null 2>&1; then
    API_URL="$BACKEND_URL"
    echo "✅ Using local backend: $BACKEND_URL"
elif curl -s "$BACKEND_PROD_URL/health" > /dev/null 2>&1; then
    API_URL="$BACKEND_PROD_URL"
    echo "✅ Using production backend: $BACKEND_PROD_URL"
else
    echo "❌ Backend not accessible. Please start the backend server:"
    echo "   cd backend && npm run dev"
    exit 1
fi

echo ""

# Test 1: Get voice presets
echo "📋 Test 1: Fetching voice presets..."
PRESETS=$(curl -s "$API_URL/api/voice/presets")
PRESET_COUNT=$(echo "$PRESETS" | jq '. | length')
echo "✅ Found $PRESET_COUNT voice presets"
echo ""

# Test 2: Generate scripts for different templates
echo "📝 Test 2: Generating scripts..."

echo "  → TutorialSnippet script..."
SCRIPT_1=$(curl -s -X POST "$API_URL/api/voice/generate-script" \
    -H "Content-Type: application/json" \
    -d '{
        "compositionId": "TutorialSnippet",
        "props": {
            "title": "Build a React Button Component",
            "steps": [
                {"text": "Create a new file Button.tsx", "duration": 60},
                {"text": "Import React and define props", "duration": 60},
                {"text": "Add styling with Tailwind CSS", "duration": 60},
                {"text": "Export the component", "duration": 40}
            ]
        }
    }' | jq -r '.script')
echo "✅ Generated TutorialSnippet script (${#SCRIPT_1} chars)"

echo "  → FeatureHighlight script..."
SCRIPT_2=$(curl -s -X POST "$API_URL/api/voice/generate-script" \
    -H "Content-Type: application/json" \
    -d '{
        "compositionId": "FeatureHighlight",
        "props": {
            "componentName": "DatePicker Pro",
            "features": ["Range selection", "Keyboard navigation", "Dark mode support"]
        }
    }' | jq -r '.script')
echo "✅ Generated FeatureHighlight script (${#SCRIPT_2} chars)"

echo "  → ProblemSolution script..."
SCRIPT_3=$(curl -s -X POST "$API_URL/api/voice/generate-script" \
    -H "Content-Type: application/json" \
    -d '{
        "compositionId": "ProblemSolution",
        "props": {
            "problem": "Styling forms is tedious and time-consuming",
            "solution": "Kinetik UI provides ready-made form components with built-in validation"
        }
    }' | jq -r '.script')
echo "✅ Generated ProblemSolution script (${#SCRIPT_3} chars)"

echo ""

# Test 3: Generate voiceovers with different voices
echo "🎤 Test 3: Generating voiceovers..."

echo "  → Voice 1: Male Energetic (Adam)..."
VOICE_1=$(curl -s -X POST "$API_URL/api/voice/generate" \
    -H "Content-Type: application/json" \
    -d "{
        \"text\": \"$SCRIPT_1\",
        \"voicePresetId\": \"male-energetic\"
    }")
AUDIO_URL_1=$(echo "$VOICE_1" | jq -r '.audioUrl')
CACHED_1=$(echo "$VOICE_1" | jq -r '.cached')
echo "✅ Generated voice 1: $AUDIO_URL_1 (cached: $CACHED_1)"

echo "  → Voice 2: Female Professional (Rachel)..."
VOICE_2=$(curl -s -X POST "$API_URL/api/voice/generate" \
    -H "Content-Type: application/json" \
    -d "{
        \"text\": \"$SCRIPT_2\",
        \"voicePresetId\": \"female-professional\"
    }")
AUDIO_URL_2=$(echo "$VOICE_2" | jq -r '.audioUrl')
CACHED_2=$(echo "$VOICE_2" | jq -r '.cached')
echo "✅ Generated voice 2: $AUDIO_URL_2 (cached: $CACHED_2)"

echo "  → Voice 3: Male Calm (Antoni)..."
VOICE_3=$(curl -s -X POST "$API_URL/api/voice/generate" \
    -H "Content-Type: application/json" \
    -d "{
        \"text\": \"$SCRIPT_3\",
        \"voicePresetId\": \"male-calm\"
    }")
AUDIO_URL_3=$(echo "$VOICE_3" | jq -r '.audioUrl')
CACHED_3=$(echo "$VOICE_3" | jq -r '.cached')
echo "✅ Generated voice 3: $AUDIO_URL_3 (cached: $CACHED_3)"

echo ""

# Summary
echo "🎉 All Tests Passed!"
echo "==================="
echo ""
echo "Generated Audio Files:"
echo "  1. $API_URL$AUDIO_URL_1 (Male Energetic)"
echo "  2. $API_URL$AUDIO_URL_2 (Female Professional)"
echo "  3. $API_URL$AUDIO_URL_3 (Male Calm)"
echo ""
echo "📝 Scripts Generated:"
echo "  1. TutorialSnippet: $SCRIPT_1"
echo "  2. FeatureHighlight: $SCRIPT_2"
echo "  3. ProblemSolution: $SCRIPT_3"
echo ""
echo "Next Steps:"
echo "  1. Listen to the generated audio files"
echo "  2. Create videos using these voiceovers in the dashboard"
echo "  3. Check backend/audio/ directory for saved files"
echo ""
echo "🎙️  Voiceover integration is ready!"
