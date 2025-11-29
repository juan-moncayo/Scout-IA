// app/api/admin/job-postings/[postingId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Obtener detalles de una vacante específica
export async function GET(
  request: NextRequest,
  { params }: { params: { postingId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const postingId = parseInt(params.postingId)

    if (isNaN(postingId)) {
      return NextResponse.json({ error: 'Invalid posting ID' }, { status: 400 })
    }

    const result = await query(
      'SELECT * FROM job_postings WHERE id = ?',
      [postingId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 })
    }

    return NextResponse.json({
      posting: result.rows[0]
    })

  } catch (error) {
    console.error('[ADMIN] Error fetching job posting:', error)
    return NextResponse.json({ error: 'Failed to fetch job posting' }, { status: 500 })
  }
}

// PUT - Actualizar vacante
export async function PUT(
  request: NextRequest,
  { params }: { params: { postingId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 })
    }

    const postingId = parseInt(params.postingId)

    if (isNaN(postingId)) {
      return NextResponse.json({ error: 'Invalid posting ID' }, { status: 400 })
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
      interview_guidelines,
      is_active
    } = body

    // Validación básica
    if (!title || !department) {
      return NextResponse.json({ error: 'Title and department are required' }, { status: 400 })
    }

    // Actualizar la vacante
    await query(
      `UPDATE job_postings 
       SET title = ?, 
           department = ?, 
           location = ?, 
           employment_type = ?, 
           salary_range = ?,
           description = ?,
           requirements = ?,
           responsibilities = ?,
           interview_guidelines = ?,
           is_active = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
      [
        title,
        department,
        location,
        employment_type,
        salary_range,
        description,
        requirements,
        responsibilities,
        interview_guidelines,
        is_active ? 1 : 0,
        postingId
      ]
    )

    console.log('[ADMIN] ✅ Job posting updated:', title)

    return NextResponse.json({
      success: true,
      message: 'Job posting updated successfully'
    })

  } catch (error) {
    console.error('[ADMIN] Error updating job posting:', error)
    return NextResponse.json({ error: 'Failed to update job posting' }, { status: 500 })
  }
}

// DELETE - Eliminar vacante
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postingId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 })
    }

    const postingId = parseInt(params.postingId)

    if (isNaN(postingId)) {
      return NextResponse.json({ error: 'Invalid posting ID' }, { status: 400 })
    }

    // Verificar que la vacante existe
    const postingCheck = await query(
      'SELECT id FROM job_postings WHERE id = ?',
      [postingId]
    )

    if (postingCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 })
    }

    // Eliminar la vacante (CASCADE eliminará candidatos relacionados)
    await query(
      'DELETE FROM job_postings WHERE id = ?',
      [postingId]
    )

    console.log('[ADMIN] ✅ Job posting deleted:', postingId)

    return NextResponse.json({
      success: true,
      message: 'Job posting deleted successfully'
    })

  } catch (error) {
    console.error('[ADMIN] Error deleting job posting:', error)
    return NextResponse.json({ error: 'Failed to delete job posting' }, { status: 500 })
  }
}