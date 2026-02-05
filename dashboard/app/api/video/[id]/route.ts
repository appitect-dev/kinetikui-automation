import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://46.62.209.17:3500'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id
    const url = `${BACKEND_URL}/videos/${videoId}.mp4`

    const response = await fetch(url)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Stream video with proper headers
    const videoBlob = await response.blob()
    
    return new NextResponse(videoBlob, {
      headers: {
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to stream video' },
      { status: 500 }
    )
  }
}
