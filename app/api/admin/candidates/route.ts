import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Verificar que sea admin
    const userResult = await query(
      'SELECT role FROM users WHERE id = ?',
      [payload.userId]
    )

    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Obtener todos los candidatos ordenados por score
    const result = await query(
      `SELECT 
        id,
        full_name,
        email,
        phone,
        resume_text,
        cover_letter,
        ai_evaluation,
        fit_score,
        status,
        applied_at,
        evaluated_at
       FROM candidates
       ORDER BY fit_score DESC, applied_at DESC`
    )

    return NextResponse.json({
      candidates: result.rows
    })

  } catch (error) {
    console.error('[CANDIDATES] Error fetching candidates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    )
  }
}