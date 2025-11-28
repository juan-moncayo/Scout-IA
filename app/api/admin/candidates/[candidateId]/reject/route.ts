import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { candidateId: string } }
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

    const candidateId = parseInt(params.candidateId)

    // Actualizar estado del candidato
    const result = await query(
      "UPDATE candidates SET status = 'rejected' WHERE id = ?",
      [candidateId]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate rejected'
    })

  } catch (error) {
    console.error('[REJECT] Error rejecting candidate:', error)
    return NextResponse.json(
      { error: 'Failed to reject candidate' },
      { status: 500 }
    )
  }
}