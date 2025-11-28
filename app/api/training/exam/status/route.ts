import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

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

    // Buscar el examen de voz más reciente del usuario que haya sido aprobado
    const result = await query(
      `SELECT 
        id,
        exam_date,
        confidence_score,
        clarity_score,
        professionalism_score,
        trust_building_score,
        overall_score,
        passed
       FROM voice_exam_sessions 
       WHERE user_id = $1 AND passed = TRUE
       ORDER BY exam_date DESC 
       LIMIT 1`,
      [payload.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({
        hasPassed: false,
        examDate: null,
        overallScore: null,
        scores: null
      })
    }

    const exam = result.rows[0]

    return NextResponse.json({
      hasPassed: true,
      examDate: exam.exam_date,
      overallScore: exam.overall_score,
      scores: {
        confidence: exam.confidence_score,
        clarity: exam.clarity_score,
        professionalism: exam.professionalism_score,
        trustBuilding: exam.trust_building_score
      }
    })

  } catch (error) {
    console.error('[EXAM STATUS] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch exam status' }, { status: 500 })
  }
}