// utils/urlEncryption.ts
import crypto from 'crypto'

const SECRET_KEY = process.env.URL_ENCRYPTION_SECRET || 'default-secret-key-change-in-production'

export function encryptUrl(originalUrl: string): string {
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) // Cambia diariamente
  const data = `${originalUrl}:${timestamp}`
  const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `secure-${encrypted.substring(0, 16)}`
}

export function decryptUrl(encryptedUrl: string): string | null {
  try {
    const encrypted = encryptedUrl.replace('secure-', '') + '0'.repeat(32 - encryptedUrl.replace('secure-', '').length)
    const decipher = crypto.createDecipher('aes-256-cbc', SECRET_KEY)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    const [originalUrl, timestamp] = decrypted.split(':')
    
    // Verificar que la URL sea válida por 24 horas
    const currentDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    if (parseInt(timestamp) >= currentDay - 1) {
      return originalUrl
    }
    return null
  } catch {
    return null
  }
}

// middleware.ts (versión dinámica)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { encryptUrl, decryptUrl } from './utils/urlEncryption'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirigir /internal-form a URL encriptada
  if (pathname === '/internal-form') {
    const encryptedUrl = encryptUrl('internal-form')
    return NextResponse.redirect(new URL(`/${encryptedUrl}`, request.url))
  }

  // Verificar si es una URL encriptada válida
  if (pathname.startsWith('/secure-')) {
    const encryptedPath = pathname.substring(1) // Remover el '/'
    const originalPath = decryptUrl(encryptedPath)
    
    if (originalPath === 'internal-form') {
      return NextResponse.rewrite(new URL('/internal-form', request.url))
    } else {
      return NextResponse.redirect(new URL('/404', request.url))
    }
  }

  // Bloquear acceso directo
  if (pathname.startsWith('/internal-form')) {
    return NextResponse.redirect(new URL('/404', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/internal-form/:path*', '/secure-:path*']
}