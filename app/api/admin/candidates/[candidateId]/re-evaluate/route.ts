import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'
import { evaluateCVText } from '@/lib/ai/claude-client'

export async function POST(
  request: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verificar admin
    const userResult = await query('SELECT role FROM users WHERE id = ?', [payload.userId])
    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // ✅ Parsear candidateId directamente
    const candidateId = parseInt(params.candidateId)

    if (isNaN(candidateId)) {
      return NextResponse.json({ error: 'Invalid candidate ID' }, { status: 400 })
    }

    console.log('[RE-EVALUATE] Starting re-evaluation for candidate:', candidateId)

    // Obtener candidato
    const candidateResult = await query(
      'SELECT * FROM candidates WHERE id = ?',
      [candidateId]
    )

    if (candidateResult.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Candidate not found',
        candidateId 
      }, { status: 404 })
    }

    const candidate = candidateResult.rows[0]

    console.log('[RE-EVALUATE] Re-evaluating:', candidate.email)

    // Obtener vacantes activas
    const jobsResult = await query(
      `SELECT id, title, department, location, requirements, responsibilities, interview_guidelines
       FROM job_postings WHERE is_active = 1`
    )

    const activeJobs = jobsResult.rows

    if (activeJobs.length === 0) {
      return NextResponse.json({ 
        error: 'No active job postings available',
        message: 'Cannot re-evaluate without active job postings'
      }, { status: 400 })
    }

    // Limpiar resume_text (quitar "MEJOR MATCH:" anterior)
    let cleanResumeText = candidate.resume_text
    if (cleanResumeText.includes('MEJOR MATCH:')) {
      cleanResumeText = cleanResumeText.split('\n\n').slice(1).join('\n\n')
    }

    // Evaluar con IA usando la función de lib
    const { evaluation, fitScore, bestMatch, matchPercentages } = await evaluateCVText(
      cleanResumeText,
      candidate.full_name,
      candidate.cover_letter || '',
      activeJobs
    )

    console.log('[RE-EVALUATE] ✅ Re-evaluation complete:', { fitScore, bestMatch })

    // Actualizar en BD
    const resumeWithMatch = `MEJOR MATCH: ${bestMatch} (${matchPercentages[bestMatch] || 0}%)\n\n${cleanResumeText}`

    await query(
      `UPDATE candidates 
       SET ai_evaluation = ?,
           fit_score = ?,
           resume_text = ?,
           evaluated_at = datetime('now')
       WHERE id = ?`,
      [
        evaluation,
        fitScore,
        resumeWithMatch,
        candidateId
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Candidato re-evaluado exitosamente',
      fit_score: fitScore,
      best_match: bestMatch,
      match_percentages: matchPercentages,
      candidateId
    })

  } catch (error: any) {
    console.error('[RE-EVALUATE] ❌ Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to re-evaluate' },
      { status: 500 }
    )
  }
}