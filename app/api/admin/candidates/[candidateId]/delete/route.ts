import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

export async function DELETE(
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

    console.log('[DELETE] Attempting to delete candidate:', candidateId)

    // Eliminar candidato
    const result = await query('DELETE FROM candidates WHERE id = ?', [candidateId])

    console.log('[DELETE] Delete result:', { rowCount: result.rowCount, rows: result.rows })

    if (result.rowCount === 0) {
      return NextResponse.json({ 
        error: 'Candidate not found',
        candidateId,
        message: `No candidate exists with ID ${candidateId}`
      }, { status: 404 })
    }

    console.log('[DELETE] ✅ Candidate deleted successfully:', candidateId)

    return NextResponse.json({
      success: true,
      message: 'Candidate deleted successfully',
      candidateId
    })

  } catch (error: any) {
    console.error('[DELETE] ❌ Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete candidate' },
      { status: 500 }
    )
  }
}