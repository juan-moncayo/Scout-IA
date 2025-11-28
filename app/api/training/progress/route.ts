import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

// Marcar módulo como completado
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const body = await request.json()
    const { moduleId, phaseNumber, moduleName } = body

    if (!moduleId || !phaseNumber || !moduleName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verificar si ya existe
    const existing = await query(
      'SELECT id, completed FROM training_progress WHERE user_id = $1 AND module_name = $2',
      [payload.userId, moduleId]
    )

    if (existing.rows.length > 0) {
      // Ya existe, actualizar
      await query(
        'UPDATE training_progress SET completed = TRUE, completed_at = NOW() WHERE id = $1',
        [existing.rows[0].id]
      )
    } else {
      // Crear nuevo registro
      await query(
        `INSERT INTO training_progress (user_id, phase_number, module_name, completed, completed_at) 
         VALUES ($1, $2, $3, TRUE, NOW())`,
        [payload.userId, phaseNumber, moduleId]
      )
    }

    console.log('[PROGRESS] Module completed:', moduleId, 'by user:', payload.userId)

    return NextResponse.json({
      success: true,
      message: 'Progress saved'
    })

  } catch (error) {
    console.error('[PROGRESS] Error:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}

// Obtener progreso del usuario
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Obtener todos los módulos completados
    const result = await query(
      `SELECT phase_number, module_name, completed, completed_at 
       FROM training_progress 
       WHERE user_id = $1 AND completed = TRUE 
       ORDER BY completed_at DESC`,
      [payload.userId]
    )

    const completedModules = result.rows.map(row => row.module_name)
    
    // Calcular progreso por fase
    const progressByPhase: { [key: number]: number } = {}
    for (let phase = 1; phase <= 5; phase++) {
      const phaseModules = result.rows.filter(r => r.phase_number === phase)
      progressByPhase[phase] = phaseModules.length
    }

    return NextResponse.json({
      completedModules,
      progressByPhase,
      totalCompleted: completedModules.length
    })

  } catch (error) {
    console.error('[PROGRESS] Error:', error)
    return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 })
  }
}