// app/api/admin/knowledge/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { 
  getKnowledgeFromDB, 
  addKnowledge,
  searchKnowledgeAdvanced 
} from '@/lib/ai/knowledge-base'

// GET - Obtener todo el conocimiento o buscar
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

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    let knowledge

    if (search) {
      // Búsqueda avanzada
      knowledge = await searchKnowledgeAdvanced(search, {
        category: category || undefined,
        limit,
        onlyActive: true
      })
    } else {
      // Obtener todo
      knowledge = await getKnowledgeFromDB()
      
      // Filtrar por categoría si se especifica
      if (category) {
        knowledge = knowledge.filter(k => k.category === category)
      }
    }

    // Obtener categorías únicas para filtros
    const allKnowledge = await getKnowledgeFromDB()
    const categories = [...new Set(allKnowledge.map(k => k.category))]

    return NextResponse.json({
      success: true,
      knowledge,
      categories,
      total: knowledge.length
    })

  } catch (error) {
    console.error('[ADMIN/KNOWLEDGE] Error fetching knowledge:', error)
    return NextResponse.json(
      { error: 'Failed to fetch knowledge' },
      { status: 500 }
    )
  }
}

// POST - Agregar nuevo conocimiento
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { category, question, answer, keywords, phase } = body

    // Validación
    if (!category || !question || !answer || !keywords) {
      return NextResponse.json(
        { error: 'Missing required fields: category, question, answer, keywords' },
        { status: 400 }
      )
    }

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords must be a non-empty array' },
        { status: 400 }
      )
    }

    // Agregar conocimiento
    const newKnowledge = await addKnowledge({
      category,
      question,
      answer,
      keywords,
      phase: phase || undefined,
      createdBy: payload.userId
    })

    if (!newKnowledge) {
      return NextResponse.json(
        { error: 'Failed to create knowledge entry' },
        { status: 500 }
      )
    }

    console.log('[ADMIN/KNOWLEDGE] ✅ New knowledge created:', newKnowledge.id)

    return NextResponse.json({
      success: true,
      knowledge: newKnowledge,
      message: 'Knowledge entry created successfully'
    })

  } catch (error) {
    console.error('[ADMIN/KNOWLEDGE] Error creating knowledge:', error)
    return NextResponse.json(
      { error: 'Failed to create knowledge entry' },
      { status: 500 }
    )
  }
}