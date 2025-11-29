// app/api/admin/candidates/route.ts
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

    // 🔥 MODIFICADO: JOIN con job_postings para obtener título de la vacante
    const result = await query(
      `SELECT 
        c.id,
        c.full_name,
        c.email,
        c.phone,
        c.resume_text,
        c.cover_letter,
        c.ai_evaluation,
        c.fit_score,
        c.status,
        c.applied_at,
        c.evaluated_at,
        c.job_id,
        jp.title as job_title,
        jp.department as job_department
       FROM candidates c
       LEFT JOIN job_postings jp ON c.job_id = jp.id
       ORDER BY c.fit_score DESC, c.applied_at DESC`
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