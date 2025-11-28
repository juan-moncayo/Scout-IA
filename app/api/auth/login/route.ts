import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword, generateToken, updateLastLogin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('[LOGIN] Attempt for email:', email)

    // Buscar usuario
    const user = await getUserByEmail(email)

    if (!user) {
      console.log('[LOGIN] User not found:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verificar si está activo
    if (!user.is_active) {
      console.log('[LOGIN] Inactive user:', email)
      return NextResponse.json(
        { error: 'Account is inactive. Contact administrator.' },
        { status: 403 }
      )
    }

    // Verificar contraseña
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      console.log('[LOGIN] Invalid password for:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Actualizar último login
    await updateLastLogin(user.id)

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    })

    console.log('[LOGIN] ✅ Successful login for:', email, 'Role:', user.role)

    // Retornar usuario y token
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        onboarding_completed: user.onboarding_completed || false, // 👈 AGREGADO
      },
      token,
    })

  } catch (error) {
    console.error('[LOGIN] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    )
  }
}