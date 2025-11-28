import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'
import { extractExamScores } from '@/lib/ai/prompts'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { transcript, aiFeedback } = body

    if (!transcript || !aiFeedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extraer scores del feedback de la IA
    const scores = extractExamScores(aiFeedback)

    if (!scores) {
      return NextResponse.json({ error: 'Could not extract scores from AI feedback' }, { status: 400 })
    }

    // Calcular score general
    const overallScore = Math.round(
      (scores.confidence + scores.clarity + scores.professionalism + scores.trust_building) / 4
    )
    const passed = overallScore >= 70

    // Guardar en la base de datos
    await query(
      `INSERT INTO voice_exam_sessions 
       (user_id, confidence_score, clarity_score, professionalism_score, trust_building_score, 
        overall_score, transcript, ai_feedback, passed) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        payload.userId,
        scores.confidence,
        scores.clarity,
        scores.professionalism,
        scores.trust_building,
        overallScore,
        transcript,
        scores.feedback,
        passed
      ]
    )

    console.log('[EXAM] Evaluation saved for user:', payload.userId, 'Score:', overallScore)

    return NextResponse.json({
      success: true,
      scores: {
        confidence: scores.confidence,
        clarity: scores.clarity,
        professionalism: scores.professionalism,
        trust_building: scores.trust_building,
        overall: overallScore
      },
      passed,
      feedback: scores.feedback
    })

  } catch (error) {
    console.error('[EXAM] Error:', error)
    return NextResponse.json({ error: 'Failed to evaluate exam' }, { status: 500 })
  }
}