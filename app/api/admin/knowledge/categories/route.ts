// app/api/admin/knowledge/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Obtener todas las categorías únicas
export async function GET(request: NextRequest) {
  try {
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

    // Obtener categorías únicas con conteo
    const result = await query(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count
      FROM knowledge_base
      GROUP BY category
      ORDER BY category
    `)

    const categories = result.rows.map((row: any) => ({
      name: row.category,
      total: row.count,
      active: row.active_count
    }))

    return NextResponse.json({
      success: true,
      categories
    })

  } catch (error) {
    console.error('[ADMIN/KNOWLEDGE/CATEGORIES] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}