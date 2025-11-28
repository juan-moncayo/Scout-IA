import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, hashPassword } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario es admin
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

    // Obtener datos del nuevo agente
    const body = await request.json()
    const { email, password, full_name } = body

    // Validación
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password)

    // Crear el agente
    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, role, is_active) 
       VALUES ($1, $2, $3, 'agent', TRUE) 
       RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, full_name]
    )

    const newAgent = result.rows[0]

    console.log('[ADMIN] ✅ New agent created:', newAgent.email)

    return NextResponse.json({
      success: true,
      agent: {
        id: newAgent.id,
        email: newAgent.email,
        full_name: newAgent.full_name,
        role: newAgent.role,
        created_at: newAgent.created_at,
      }
    })

  } catch (error) {
    console.error('[ADMIN] Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}