import { NextResponse } from 'next/server'
import { runMigrations } from '@/lib/migrations'
import { seedDatabase } from '@/lib/seed'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secretKey = searchParams.get('key')
    
    // Verificar entorno y key secreta
    const isDev = process.env.NODE_ENV === 'development'
    const validKey = process.env.DB_SETUP_SECRET || 'dev-setup-key-2025'
    
    if (!isDev && secretKey !== validKey) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid setup key.' },
        { status: 403 }
      )
    }

    console.log('[SETUP] Running database setup...')

    // 1. Ejecutar migraciones
    await runMigrations()

    // 2. Seed inicial (crear admin si no existe)
    await seedDatabase()

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[SETUP] Error during database setup:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}