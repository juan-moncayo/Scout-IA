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

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    // Obtener todos los agentes CON información de si pasaron el examen de voz
    const result = await query(
      `SELECT 
        u.id, 
        u.email, 
        u.full_name, 
        u.role, 
        u.is_active, 
        u.onboarding_completed, 
        u.created_at, 
        u.last_login,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM voice_exam_sessions 
            WHERE user_id = u.id AND passed = 1
          ) THEN 1
          ELSE 0
        END as voice_exam_passed,
        (
          SELECT exam_date 
          FROM voice_exam_sessions 
          WHERE user_id = u.id AND passed = 1
          ORDER BY exam_date DESC 
          LIMIT 1
        ) as voice_exam_date,
        (
          SELECT overall_score 
          FROM voice_exam_sessions 
          WHERE user_id = u.id AND passed = 1
          ORDER BY exam_date DESC 
          LIMIT 1
        ) as voice_exam_score
       FROM users u
       WHERE u.role = 'agent' 
       ORDER BY u.created_at DESC`
    )

    return NextResponse.json({
      agents: result.rows
    })

  } catch (error) {
    console.error('[ADMIN] Error fetching approved agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approved agents' },
      { status: 500 }
    )
  }
}