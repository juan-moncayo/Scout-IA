import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
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

    // 🔥 AWAIT params antes de usar (Next.js 15)
    const resolvedParams = await params
    const jobId = parseInt(resolvedParams.jobId)

    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    console.log('[JOB-CONTEXT] Fetching context for job:', jobId, 'user:', payload.email)

    // 1. Obtener detalles completos de la vacante
    const jobResult = await query(
      `SELECT 
        id, title, department, location, employment_type, 
        salary_range, description, requirements, responsibilities, 
        interview_guidelines
       FROM job_postings 
       WHERE id = ? AND is_active = 1`,
      [jobId]
    )

    if (jobResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job posting not found or inactive' },
        { status: 404 }
      )
    }

    const job = jobResult.rows[0]
    console.log('[JOB-CONTEXT] Job found:', job.title)

    // 2. Obtener el CV del candidato cuando aplicó a CUALQUIER vacante (status='approved')
    const candidateResult = await query(
      `SELECT 
        id, full_name, email, resume_text, cover_letter, fit_score
       FROM candidates 
       WHERE email = ? AND status = 'approved'
       ORDER BY applied_at DESC
       LIMIT 1`,
      [payload.email]
    )

    let candidateInfo = null
    if (candidateResult.rows.length > 0) {
      const candidate = candidateResult.rows[0]
      
      // Limpiar resume_text (quitar el "MEJOR MATCH:" si existe)
      let cleanResume = candidate.resume_text || ''
      if (cleanResume.includes('MEJOR MATCH:')) {
        const parts = cleanResume.split('\n\n')
        cleanResume = parts.slice(1).join('\n\n').trim()
      }

      candidateInfo = {
        full_name: candidate.full_name,
        email: candidate.email,
        resume_text: cleanResume,
        cover_letter: candidate.cover_letter || '',
        fit_score: candidate.fit_score
      }

      console.log('[JOB-CONTEXT] Candidate CV found, length:', cleanResume.length)
    }

    // 3. Si no hay info como candidato, usar info del usuario
    if (!candidateInfo) {
      console.log('[JOB-CONTEXT] No candidate data, using user data')
      const userResult = await query(
        `SELECT full_name, email FROM users WHERE id = ?`,
        [payload.userId]
      )

      if (userResult.rows.length > 0) {
        candidateInfo = {
          full_name: userResult.rows[0].full_name,
          email: userResult.rows[0].email,
          resume_text: 'No CV information available. Please upload your resume.',
          cover_letter: '',
          fit_score: 0
        }
      }
    }

    console.log('[JOB-CONTEXT] ✅ Context ready for:', candidateInfo?.full_name)

    return NextResponse.json({
      job,
      candidate: candidateInfo
    })

  } catch (error) {
    console.error('[JOB-CONTEXT] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job context' },
      { status: 500 }
    )
  }
}