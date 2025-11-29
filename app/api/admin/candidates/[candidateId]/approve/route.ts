import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'

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

    // ✅ Parsear candidateId directamente (Next.js 14)
    const candidateId = parseInt(params.candidateId)

    if (isNaN(candidateId)) {
      return NextResponse.json(
        { error: 'Invalid candidate ID' },
        { status: 400 }
      )
    }

    // Obtener datos del candidato
    const candidateResult = await query(
      'SELECT * FROM candidates WHERE id = ?',
      [candidateId]
    )

    if (candidateResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    const candidate = candidateResult.rows[0]

    if (candidate.status !== 'pending') {
      return NextResponse.json(
        { error: 'Candidate is not pending' },
        { status: 400 }
      )
    }

    // Verificar que el email no esté en uso
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [candidate.email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }

    // Generar contraseña temporal
    const tempPassword = `Scout${Math.random().toString(36).substring(2, 10)}`
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // ✅ CORRECCIÓN: Usar password_hash en lugar de password
    await query(
      `INSERT INTO users (email, password_hash, full_name, role, onboarding_completed, is_active)
       VALUES (?, ?, ?, 'agent', 1, 1)`,
      [candidate.email, hashedPassword, candidate.full_name]
    )

    // Actualizar estado del candidato
    await query(
      `UPDATE candidates SET status = 'approved' WHERE id = ?`,
      [candidateId]
    )

    console.log('[APPROVE] Usuario creado:', candidate.email)

    return NextResponse.json({
      success: true,
      message: 'Candidate approved and user created',
      tempPassword
    })

  } catch (error: any) {
    console.error('[APPROVE] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to approve candidate' },
      { status: 500 }
    )
  }
}