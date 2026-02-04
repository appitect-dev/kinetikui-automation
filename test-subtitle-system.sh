#!/bin/bash
# Test script for subtitle system

BASE_URL="http://46.62.209.17:5000"

echo "🎬 Testing Kinetik UI Subtitle System"
echo "====================================="
echo ""

# Test 1: Generate subtitle chunks
echo "📝 Test 1: Generate Subtitle Chunks"
echo "-----------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/subtitles/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "script": "Check out this amazing component library with beautiful animations!",
    "fps": 30,
    "durationInFrames": 300,
    "maxWordsPerChunk": 3,
    "wordsPerSecond": 2.5
  }')

echo "$RESPONSE" | jq '.'
echo ""

# Extract chunks for next test
CHUNKS=$(echo "$RESPONSE" | jq '.chunks')

# Test 2: Export SRT file
echo "📄 Test 2: Export SRT File"
echo "--------------------------"
SRT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/subtitles/export" \
  -H "Content-Type: application/json" \
  -d "{
    \"chunks\": $CHUNKS,
    \"fps\": 30,
    \"format\": \"srt\",
    \"videoId\": \"test_$(date +%s)\"
  }")

echo "$SRT_RESPONSE" | jq -r '.content' | head -20
echo ""

# Test 3: Export VTT file
echo "📄 Test 3: Export VTT File"
echo "--------------------------"
VTT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/subtitles/export" \
  -H "Content-Type: application/json" \
  -d "{
    \"chunks\": $CHUNKS,
    \"fps\": 30,
    \"format\": \"vtt\",
    \"videoId\": \"test_$(date +%s)\"
  }")

echo "$VTT_RESPONSE" | jq -r '.content' | head -20
echo ""

# Test 4: Create video with subtitle support
echo "🎥 Test 4: Create Video with Subtitles"
echo "--------------------------------------"
VIDEO_RESPONSE=$(curl -s -X POST "$BASE_URL/api/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "compositionId": "FeatureHighlight",
    "title": "Test Video with Subtitles",
    "caption": "Testing the new subtitle system",
    "script": "This video has professional subtitles with word highlighting",
    "props": {
      "componentName": "DataTable Pro",
      "features": ["Lightning Fast", "Fully Responsive", "Beautiful Design"]
    }
  }')

VIDEO_ID=$(echo "$VIDEO_RESPONSE" | jq -r '.id')
echo "Created video: $VIDEO_ID"
echo "$VIDEO_RESPONSE" | jq '.'
echo ""

# Test 5: Update video subtitle settings
echo "⚙️  Test 5: Update Subtitle Settings"
echo "------------------------------------"
UPDATE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/videos/$VIDEO_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "subtitlesEnabled": true,
    "subtitles": "'"$(echo $CHUNKS | jq -c .)"'"
  }')

echo "$UPDATE_RESPONSE" | jq '.'
echo ""

# Test 6: Check backend health
echo "❤️  Test 6: Backend Health Check"
echo "--------------------------------"
HEALTH=$(curl -s "$BASE_URL/health")
echo "$HEALTH" | jq '.'
echo ""

echo "✅ All tests completed!"
echo ""
echo "Next steps:"
echo "1. Check the videos directory for rendered output"
echo "2. Verify subtitles appear in Remotion Studio"
echo "3. Test in dashboard UI"
echo "4. Deploy to production"
