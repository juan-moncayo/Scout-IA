import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Este endpoint NO requiere autenticación - es público
export async function GET() {
  try {
    console.log('[PUBLIC-JOBS] Fetching active job postings...')
    
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
        created_at
       FROM job_postings 
       WHERE is_active = 1 
       ORDER BY created_at DESC
       LIMIT 10`
    )

    console.log('[PUBLIC-JOBS] Found', result.rows.length, 'active jobs')

    return NextResponse.json({
      success: true,
      jobs: result.rows
    })

  } catch (error) {
    console.error('[PUBLIC-JOBS] Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch job postings',
        jobs: []
      },
      { status: 500 }
    )
  }
}