// lib/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from './db'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
const JWT_EXPIRES_IN = '7d' // Token válido por 7 días

// Tipos
export interface User {
  id: number
  email: string
  full_name: string
  role: 'admin' | 'agent'
  onboarding_completed?: boolean
}

export interface JWTPayload {
  userId: number
  email: string
  role: 'admin' | 'agent'
  iat?: number
  exp?: number
}

// Generar JWT token
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verificar JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error)
    return null
  }
}

// Verificar contraseña
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

// Obtener usuario por email
export async function getUserByEmail(email: string) {
  const result = await query(
    'SELECT id, email, password_hash, full_name, role, is_active, onboarding_completed FROM users WHERE email = ?',
    [email]
  )
  return result.rows[0] || null
}

// Obtener usuario por ID
export async function getUserById(userId: number) {
  const result = await query(
    'SELECT id, email, full_name, role, is_active, onboarding_completed, created_at, last_login FROM users WHERE id = ?',
    [userId]
  )
  return result.rows[0] || null
}

// Actualizar último login (SQLite compatible)
export async function updateLastLogin(userId: number) {
  await query(
    "UPDATE users SET last_login = datetime('now') WHERE id = ?", 
    [userId]
  )
}

// Verificar si es admin
export function isAdmin(user: User | JWTPayload): boolean {
  return user.role === 'admin'
}

// Verificar si es agente
export function isAgent(user: User | JWTPayload): boolean {
  return user.role === 'agent'
}