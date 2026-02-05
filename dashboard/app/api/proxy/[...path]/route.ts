import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://46.62.209.17:6000'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    const searchParams = request.nextUrl.searchParams.toString()
    const url = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`

    console.log('Proxy GET:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Proxy GET error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Proxy request failed',
        url: `${BACKEND_URL}/api/${params.path.join('/')}`,
        details: error.cause?.message
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    const body = await request.json()
    const url = `${BACKEND_URL}/api/${path}`

    console.log('Proxy POST:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Proxy POST error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Proxy request failed',
        url: `${BACKEND_URL}/api/${params.path.join('/')}`,
        details: error.cause?.message
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    const body = await request.json()
    const url = `${BACKEND_URL}/api/${path}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Proxy request failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    const url = `${BACKEND_URL}/api/${path}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Proxy request failed' },
      { status: 500 }
    )
  }
}
