// app/api/jobs/active/route.ts
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

    // Obtener solo vacantes activas
    const result = await query(
      `SELECT 
        id,
        title,
        department,
        location,
        employment_type,
        salary_range,
        description,
        requirements,
        responsibilities,
        created_at,
        is_active
       FROM job_postings
       WHERE is_active = 1
       ORDER BY created_at DESC`
    )

    return NextResponse.json({
      postings: result.rows
    })

  } catch (error) {
    console.error('[JOBS] Error fetching active postings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job postings' },
      { status: 500 }
    )
  }
}