import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth-edge'

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
  '/training/dashboard',
  '/training/admin',
  '/training/practice',
]

// Rutas solo para admin
const ADMIN_ONLY_ROUTES = [
  '/training/admin',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si la ruta está protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Obtener token de las cookies
    const token = request.cookies.get('training_token')?.value

    if (!token) {
      // No hay token, redirigir al login
      console.log('[MIDDLEWARE] No token found, redirecting to login')
      return NextResponse.redirect(new URL('/training/login', request.url))
    }

    // Verificar el token usando Web Crypto API
    const payload = await verifyTokenEdge(token)

    if (!payload) {
      // Token inválido o expirado
      console.log('[MIDDLEWARE] Invalid token, redirecting to login')
      const response = NextResponse.redirect(new URL('/training/login', request.url))
      response.cookies.delete('training_token')
      return response
    }

    // Verificar permisos de admin
    if (isAdminRoute && payload.role !== 'admin') {
      // Usuario no es admin, redirigir al dashboard
      console.log('[MIDDLEWARE] User is not admin, redirecting to dashboard')
      return NextResponse.redirect(new URL('/training/dashboard', request.url))
    }

    // Token válido, continuar
    console.log('[MIDDLEWARE] Token valid, allowing access')
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/training/dashboard/:path*',
    '/training/admin/:path*',
    '/training/practice/:path*',
  ]
}