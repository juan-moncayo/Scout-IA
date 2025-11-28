// app/api/admin/job-postings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Obtener todas las vacantes
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

    // Obtener todas las vacantes con conteo de candidatos
    const result = await query(
      `SELECT 
        jp.id, 
        jp.title, 
        jp.department, 
        jp.location, 
        jp.employment_type,
        jp.salary_range,
        jp.description,
        jp.requirements,
        jp.responsibilities,
        jp.interview_guidelines,
        jp.created_at,
        jp.updated_at,
        jp.is_active,
        (SELECT COUNT(*) FROM candidates WHERE job_posting_id = jp.id) as candidate_count
       FROM job_postings jp
       ORDER BY jp.created_at DESC`
    )

    return NextResponse.json({
      postings: result.rows
    })

  } catch (error) {
    console.error('[ADMIN] Error fetching job postings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job postings' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva vacante
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      title,
      department,
      location,
      employment_type,
      salary_range,
      description,
      requirements,
      responsibilities,
      interview_guidelines
    } = body

    // Validación
    if (!title || !department || !location || !description || !requirements || !interview_guidelines) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Crear la vacante
    const result = await query(
      `INSERT INTO job_postings (
        title, 
        department, 
        location, 
        employment_type, 
        salary_range, 
        description, 
        requirements, 
        responsibilities, 
        interview_guidelines,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        title,
        department,
        location,
        employment_type || 'Full-time',
        salary_range || '',
        description,
        requirements,
        responsibilities || '',
        interview_guidelines
      ]
    )

    console.log('[ADMIN] ✅ Job posting created:', title)

    return NextResponse.json({
      success: true,
      message: 'Job posting created successfully'
    })

  } catch (error) {
    console.error('[ADMIN] Error creating job posting:', error)
    return NextResponse.json(
      { error: 'Failed to create job posting' },
      { status: 500 }
    )
  }
}