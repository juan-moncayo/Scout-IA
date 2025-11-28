// Este archivo usa solo APIs compatibles con Edge Runtime

export interface JWTPayload {
  userId: number
  email: string
  role: 'admin' | 'agent'
  iat: number
  exp: number
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'

// Convertir string a Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

// Convertir Uint8Array a base64url
function uint8ArrayToBase64Url(array: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...array))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Convertir base64url a Uint8Array
function base64UrlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(base64 + padding)
  return Uint8Array.from(binary, c => c.charCodeAt(0))
}

// Verificar JWT usando Web Crypto API
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [headerB64, payloadB64, signatureB64] = parts
    
    // Decodificar payload
    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(payloadB64))
    const payload: JWTPayload = JSON.parse(payloadJson)

    // Verificar expiración
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('[AUTH-EDGE] Token expired')
      return null
    }

    // Importar clave secreta
    const key = await crypto.subtle.importKey(
      'raw',
      stringToUint8Array(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Verificar firma
    const data = stringToUint8Array(`${headerB64}.${payloadB64}`)
    const signature = base64UrlToUint8Array(signatureB64)
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      data
    )

    if (!isValid) {
      console.log('[AUTH-EDGE] Invalid signature')
      return null
    }

    return payload

  } catch (error) {
    console.error('[AUTH-EDGE] Token verification failed:', error)
    return null
  }
}