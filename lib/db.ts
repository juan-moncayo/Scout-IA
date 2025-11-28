// lib/db.ts
import { createClient } from '@libsql/client'

let client: ReturnType<typeof createClient> | null = null

export function getClient() {
  if (!client) {
    const url = process.env.DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url || !authToken) {
      throw new Error('DATABASE_URL and TURSO_AUTH_TOKEN must be set')
    }

    client = createClient({
      url,
      authToken,
    })

    console.log('[DB] Connected to Talent Scout AI database')
  }
  return client
}

export async function query(text: string, params?: any[]) {
  const db = getClient()
  const start = Date.now()
  
  try {
    const result = await db.execute({
      sql: text,
      args: params || []
    })
    
    const duration = Date.now() - start
    console.log('[DB Query]', { 
      text: text.substring(0, 60) + '...', 
      duration, 
      rows: result.rows.length 
    })
    
    // Adaptar formato para compatibilidad con código existente
    return {
      rows: result.rows,
      rowCount: result.rows.length,
      command: text.trim().toUpperCase().startsWith('SELECT') ? 'SELECT' : 'INSERT'
    }
  } catch (error) {
    console.error('[DB Error]', { query: text.substring(0, 60), error })
    throw error
  }
}

// Mantener para compatibilidad
export async function getPool() {
  return getClient()
}

export async function closePool() {
  if (client) {
    client.close()
    client = null
    console.log('[DB] Connection closed')
  }
}