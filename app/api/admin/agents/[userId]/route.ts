import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

// DELETE - Eliminar agente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const userId = parseInt(params.userId)

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    // Verificar que el usuario existe y es un agente
    const userCheck = await query(
      'SELECT id, role FROM users WHERE id = $1',
      [userId]
    )

    if (userCheck.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userCheck.rows[0].role !== 'agent') {
      return NextResponse.json({ error: 'Can only delete agents' }, { status: 400 })
    }

    // Eliminar el agente (CASCADE eliminará también sus datos relacionados)
    await query(
      'DELETE FROM users WHERE id = $1',
      [userId]
    )

    console.log('[ADMIN] ✅ Agent deleted:', userId)

    return NextResponse.json({
      success: true,
      message: 'Agent deleted successfully'
    })

  } catch (error) {
    console.error('[ADMIN] Error deleting agent:', error)
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
  }
}

// PUT - Actualizar datos básicos del agente
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const userId = parseInt(params.userId)

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const body = await request.json()
    const { email, full_name, is_active } = body

    // Validación básica
    if (!email || !full_name) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 })
    }

    // Verificar que el usuario existe
    const userCheck = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    )

    if (userCheck.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verificar si el email ya existe en otro usuario
    const emailCheck = await query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    )

    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Actualizar datos del agente
    const result = await query(
      `UPDATE users 
       SET email = $1, full_name = $2, is_active = $3
       WHERE id = $4
       RETURNING id, email, full_name, role, is_active, onboarding_completed, created_at, last_login`,
      [email, full_name, is_active !== undefined ? is_active : true, userId]
    )

    const updatedAgent = result.rows[0]

    console.log('[ADMIN] ✅ Agent updated:', updatedAgent.email)

    return NextResponse.json({
      success: true,
      agent: updatedAgent
    })

  } catch (error) {
    console.error('[ADMIN] Error updating agent:', error)
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
  }
}