import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const checks = {
      anthropic_configured: !!process.env.ANTHROPIC_API_KEY,
      google_tts_configured: !!process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64,
      ai_model: process.env.AI_MODEL || 'not set',
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      }
    }

    return NextResponse.json({
      success: true,
      message: 'AI training system is ready',
      checks,
    })

  } catch (error) {
    console.error('[TEST] Error:', error)
    return NextResponse.json({ error: 'System check failed' }, { status: 500 })
  }
}