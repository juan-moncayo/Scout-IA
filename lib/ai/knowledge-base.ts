// lib/ai/knowledge-base.ts
import { query } from '@/lib/db'

export interface KnowledgeItem {
  id: string | number
  category: string
  question: string
  answer: string
  keywords: string[]
  phase?: number
}

// 🔥 MANTENER DATOS ORIGINALES COMO FALLBACK (si falla la BD)
export const recruitmentKnowledge: KnowledgeItem[] = [
  // ==========================================
  // FASE 1: Fundamentos de Reclutamiento
  // ==========================================
  {
    id: 'intro-1',
    category: 'empresa',
    question: '¿Qué es Talent Scout AI?',
    answer: 'Talent Scout AI es una plataforma inteligente de reclutamiento que usa inteligencia artificial para conectar candidatos con oportunidades laborales. Ayudamos a las empresas a encontrar el mejor talento de forma eficiente, mientras ayudamos a los buscadores de empleo a descubrir roles que realmente se ajustan a sus habilidades y aspiraciones. Nuestro sistema impulsado por IA evalúa habilidades de comunicación, conocimientos técnicos y ajuste cultural a través de entrevistas de voz interactivas.',
    keywords: ['empresa', 'talent scout', 'quiénes somos', 'misión', 'plataforma'],
    phase: 1,
  },
  {
    id: 'intro-2',
    category: 'empresa',
    question: '¿Cuáles son los valores de Talent Scout AI?',
    answer: 'Nuestros valores fundamentales son: Equidad - eliminamos sesgos mediante evaluaciones impulsadas por IA; Eficiencia - ahorramos tiempo tanto a candidatos como a empleadores; Transparencia - proporcionamos retroalimentación clara y puntuaciones; Innovación - mejoramos continuamente nuestros algoritmos de emparejamiento; Inclusión - brindamos igualdad de oportunidades para todos los candidatos sin importar su origen.',
    keywords: ['valores', 'misión', 'equidad', 'transparencia', 'inclusión'],
    phase: 1,
  },
  {
    id: 'basics-1',
    category: 'fundamentos_reclutamiento',
    question: '¿Cuáles son los principales tipos de entrevistas laborales?',
    answer: 'Los principales tipos de entrevistas son: 1) Entrevistas técnicas - evalúan habilidades y conocimientos específicos; 2) Entrevistas conductuales - evalúan experiencias pasadas y resolución de problemas; 3) Entrevistas de ajuste cultural - determinan alineación con valores de la empresa; 4) Filtros telefónicos/por video - evaluación inicial del candidato; 5) Entrevistas de panel - múltiples entrevistadores evalúan al candidato.',
    keywords: ['tipos de entrevista', 'técnica', 'conductual', 'filtro', 'panel'],
    phase: 1,
  },
  {
    id: 'basics-2',
    category: 'fundamentos_reclutamiento',
    question: '¿Qué es un ATS y cómo funciona?',
    answer: 'ATS (Applicant Tracking System o Sistema de Seguimiento de Candidatos) es un software que gestiona el proceso de reclutamiento. Este: 1) Analiza hojas de vida y extrae información clave; 2) Clasifica candidatos basándose en palabras clave y criterios; 3) Rastrea el estado de la aplicación a lo largo del proceso; 4) Automatiza la comunicación con candidatos; 5) Genera informes sobre métricas de reclutamiento. Entender el ATS es crucial tanto para reclutadores como para candidatos.',
    keywords: ['ats', 'seguimiento de candidatos', 'análisis de hoja de vida', 'palabras clave'],
    phase: 1,
  },

  // ==========================================
  // FASE 2: Evaluación de Candidatos
  // ==========================================
  {
    id: 'eval-1',
    category: 'evaluacion_candidatos',
    question: '¿Cómo evaluar habilidades blandas en entrevistas?',
    answer: 'La evaluación de habilidades blandas implica: 1) Comunicación - claridad, articulación, escucha; 2) Resolución de problemas - cómo abordan desafíos; 3) Adaptabilidad - respuesta al cambio y retroalimentación; 4) Trabajo en equipo - ejemplos de colaboración; 5) Liderazgo - iniciativa e influencia. Usa preguntas conductuales como "Cuéntame sobre una vez cuando..." para evaluar estas habilidades.',
    keywords: ['habilidades blandas', 'comunicación', 'evaluación', 'conductual'],
    phase: 2,
  },
  {
    id: 'eval-2',
    category: 'evaluacion_candidatos',
    question: '¿Cuáles son las señales de alerta en respuestas de candidatos?',
    answer: 'Señales de alerta comunes incluyen: 1) Incapacidad de proporcionar ejemplos específicos; 2) Culpar a otros sin asumir responsabilidad; 3) Hablar negativamente de empleadores anteriores; 4) Información inconsistente entre respuestas; 5) Falta de preparación o conocimiento sobre la empresa; 6) Respuestas demasiado ensayadas sin autenticidad; 7) Malas habilidades de comunicación o comportamiento poco profesional.',
    keywords: ['señales de alerta', 'advertencias', 'candidato', 'evaluación', 'problemas'],
    phase: 2,
  },

  // ==========================================
  // FASE 3: Técnicas de Entrevista
  // ==========================================
  {
    id: 'tech-1',
    category: 'tecnicas_entrevista',
    question: '¿Qué es el método STAR?',
    answer: 'STAR es un enfoque estructurado para responder preguntas conductuales: Situación - describe el contexto; Tarea - explica el desafío o responsabilidad; Acción - detalla los pasos tomados; Resultado - comparte el resultado y aprendizaje. Este método ayuda a los candidatos a proporcionar respuestas completas y ayuda a los entrevistadores a evaluar la resolución de problemas de manera sistemática.',
    keywords: ['método star', 'conductual', 'técnica de entrevista', 'estructura'],
    phase: 3,
  },
  {
    id: 'tech-2',
    category: 'tecnicas_entrevista',
    question: '¿Cómo realizar una evaluación técnica?',
    answer: 'Pasos de evaluación técnica: 1) Define habilidades requeridas claramente; 2) Prepara preguntas técnicas relevantes; 3) Incluye ejercicios prácticos o desafíos de codificación; 4) Evalúa tanto la corrección como el proceso de pensamiento; 5) Permite al candidato explicar su razonamiento; 6) Evalúa el enfoque de resolución de problemas, no solo la respuesta final; 7) Proporciona retroalimentación constructiva.',
    keywords: ['evaluación técnica', 'prueba de habilidades', 'codificación', 'evaluación'],
    phase: 3,
  },

  // ==========================================
  // Mejores Prácticas de Reclutamiento
  // ==========================================
  {
    id: 'best-1',
    category: 'mejores_practicas',
    question: '¿Cómo deben comunicarse los reclutadores con los candidatos?',
    answer: 'Consejos de comunicación profesional: 1) Sé respetuoso y oportuno en las respuestas; 2) Establece expectativas claras sobre el proceso; 3) Proporciona retroalimentación transparente cuando sea posible; 4) Mantén a los candidatos informados de su estado; 5) Sé honesto sobre los requisitos y desafíos del rol; 6) Muestra interés genuino en sus metas profesionales; 7) Mantén el profesionalismo incluso con candidatos rechazados; 8) Haz seguimiento consistente durante todo el proceso.',
    keywords: ['comunicación', 'experiencia del candidato', 'profesionalismo', 'retroalimentación'],
    phase: 3,
  },
  {
    id: 'best-2',
    category: 'mejores_practicas',
    question: '¿Qué hace una buena descripción de puesto?',
    answer: 'Las descripciones de puesto efectivas incluyen: 1) Título claro del puesto y resumen del rol; 2) Responsabilidades y expectativas específicas; 3) Calificaciones requeridas vs. preferidas; 4) Cultura y valores de la empresa; 5) Oportunidades de crecimiento; 6) Rango salarial (cuando sea posible); 7) Beneficios y ventajas; 8) Proceso de aplicación y cronograma. Evita la jerga y sé honesto sobre los desafíos. Las buenas descripciones atraen a los candidatos correctos y reducen la pérdida de tiempo.',
    keywords: ['descripción de puesto', 'vacante', 'publicación', 'requisitos'],
    phase: 2,
  },

  // ==========================================
  // Preguntas de Entrevista Comunes
  // ==========================================
  {
    id: 'questions-1',
    category: 'preguntas_comunes',
    question: '¿Cuáles son las mejores preguntas para evaluar liderazgo?',
    answer: 'Preguntas efectivas de liderazgo: 1) "Describe una vez que tuviste que motivar a un equipo"; 2) "¿Cómo manejas conflictos dentro de tu equipo?"; 3) "Cuéntame sobre una decisión difícil que tomaste como líder"; 4) "¿Cómo desarrollas a los miembros de tu equipo?"; 5) "Describe tu estilo de liderazgo". Busca ejemplos específicos, no respuestas teóricas.',
    keywords: ['preguntas de liderazgo', 'evaluación', 'gestión', 'equipo'],
    phase: 2,
  },
  {
    id: 'questions-2',
    category: 'preguntas_comunes',
    question: '¿Qué preguntar sobre resolución de problemas?',
    answer: 'Preguntas de resolución de problemas: 1) "Describe un problema complejo que resolviste recientemente"; 2) "¿Cómo abordas problemas sin una solución obvia?"; 3) "Cuéntame sobre una vez que fallaste y qué aprendiste"; 4) "¿Cómo priorizas cuando tienes múltiples problemas urgentes?"; 5) "Da un ejemplo de pensamiento creativo que usaste". Evalúa su proceso de pensamiento, no solo el resultado.',
    keywords: ['resolución de problemas', 'pensamiento crítico', 'análisis', 'creatividad'],
    phase: 2,
  },
]

// 🆕 FUNCIÓN PARA OBTENER CONOCIMIENTO DESDE BASE DE DATOS
export async function getKnowledgeFromDB(): Promise<KnowledgeItem[]> {
  try {
    const result = await query(
      'SELECT * FROM knowledge_base WHERE is_active = 1 ORDER BY category, id'
    )

    return result.rows.map((row: any) => ({
      id: row.id,
      category: row.category,
      question: row.question,
      answer: row.answer,
      keywords: JSON.parse(row.keywords || '[]'),
      phase: JSON.parse(row.metadata || '{}').phase,
    }))
  } catch (error) {
    console.error('[KNOWLEDGE-BASE] Error fetching from DB:', error)
    // 🔥 FALLBACK: Si falla la BD, usar datos hardcodeados
    console.log('[KNOWLEDGE-BASE] Using fallback hardcoded knowledge')
    return recruitmentKnowledge
  }
}

// 🆕 FUNCIÓN DE BÚSQUEDA MEJORADA (ahora usa BD)
export async function searchKnowledge(query: string, limit: number = 3): Promise<KnowledgeItem[]> {
  const lowerQuery = query.toLowerCase()
  
  try {
    // 🔥 INTENTAR BUSCAR EN BD PRIMERO
    const dbKnowledge = await getKnowledgeFromDB()
    
    const scored = dbKnowledge.map(item => {
      let score = 0
      
      // Buscar en keywords
      item.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          score += 3
        }
      })
      
      // Buscar en pregunta
      if (item.question.toLowerCase().includes(lowerQuery)) {
        score += 2
      }
      
      // Buscar en respuesta
      if (item.answer.toLowerCase().includes(lowerQuery)) {
        score += 1
      }
      
      return { item, score }
    })
    
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.item)
      
  } catch (error) {
    console.error('[KNOWLEDGE-BASE] Error in searchKnowledge:', error)
    
    // 🔥 FALLBACK: Usar búsqueda en array hardcodeado
    const scored = recruitmentKnowledge.map(item => {
      let score = 0
      
      item.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          score += 3
        }
      })
      
      if (item.question.toLowerCase().includes(lowerQuery)) {
        score += 2
      }
      
      if (item.answer.toLowerCase().includes(lowerQuery)) {
        score += 1
      }
      
      return { item, score }
    })
    
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.item)
  }
}

// 🆕 OBTENER CONOCIMIENTO POR CATEGORÍA
export async function getKnowledgeByCategory(category: string): Promise<KnowledgeItem[]> {
  try {
    const result = await query(
      'SELECT * FROM knowledge_base WHERE category = ? AND is_active = 1 ORDER BY id',
      [category]
    )

    return result.rows.map((row: any) => ({
      id: row.id,
      category: row.category,
      question: row.question,
      answer: row.answer,
      keywords: JSON.parse(row.keywords || '[]'),
      phase: JSON.parse(row.metadata || '{}').phase,
    }))
  } catch (error) {
    console.error('[KNOWLEDGE-BASE] Error in getKnowledgeByCategory:', error)
    return recruitmentKnowledge.filter(item => item.category === category)
  }
}

// 🆕 OBTENER CONOCIMIENTO POR FASE
export async function getPhaseKnowledge(phaseNumber: number): Promise<KnowledgeItem[]> {
  try {
    const allKnowledge = await getKnowledgeFromDB()
    return allKnowledge.filter(item => item.phase === phaseNumber)
  } catch (error) {
    console.error('[KNOWLEDGE-BASE] Error in getPhaseKnowledge:', error)
    return recruitmentKnowledge.filter(item => item.phase === phaseNumber)
  }
}

// 🆕 AGREGAR NUEVO CONOCIMIENTO (para panel admin)
// lib/ai/knowledge-base.ts - Línea del addKnowledge
export async function addKnowledge(data: {
  category: string
  question: string
  answer: string
  keywords: string[]
  phase?: number
  createdBy?: number
}): Promise<KnowledgeItem | null> {
  try {
    const result = await query(
      `INSERT INTO knowledge_base (
        category, question, answer, keywords, metadata, created_by
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.category,
        data.question,
        data.answer,
        JSON.stringify(data.keywords),
        JSON.stringify({ phase: data.phase }),
        data.createdBy || null
      ]
    )

    // 🔥 FIX: Verificar que existe antes de usar
    const insertedId = (result.rows[0] as any)?.id
    
    if (!insertedId) {
      console.error('[KNOWLEDGE-BASE] No ID returned after insert')
      return null
    }
    
    return {
      id: insertedId,
      category: data.category,
      question: data.question,
      answer: data.answer,
      keywords: data.keywords,
      phase: data.phase
    }
  } catch (error) {
    console.error('[KNOWLEDGE-BASE] Error adding knowledge:', error)
    return null
  }
}

// 🆕 ACTUALIZAR CONOCIMIENTO
export async function updateKnowledge(
  id: number,
  data: Partial<{
    category: string
    question: string
    answer: string
    keywords: string[]
    phase?: number
    isActive: boolean
  }>
): Promise<boolean> {
  try {
    const updates: string[] = []
    const values: any[] = []

    if (data.category !== undefined) {
      updates.push('category = ?')
      values.push(data.category)
    }
    if (data.question !== undefined) {
      updates.push('question = ?')
      values.push(data.question)
    }
    if (data.answer !== undefined) {
      updates.push('answer = ?')
      values.push(data.answer)
    }
    if (data.keywords !== undefined) {
      updates.push('keywords = ?')
      values.push(JSON.stringify(data.keywords))
    }
    if (data.phase !== undefined) {
      updates.push('metadata = ?')
      values.push(JSON.stringify({ phase: data.phase }))
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?')
      values.push(data.isActive ? 1 : 0)
    }

    if (updates.length === 0) return false

    updates.push("updated_at = datetime('now')")
    values.push(id)

    await query(
      `UPDATE knowledge_base SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    return true
  } catch (error) {
    console.error('[KNOWLEDGE-BASE] Error updating knowledge:', error)
    return false
  }
}

// 🆕 ELIMINAR CONOCIMIENTO (soft delete)
export async function deleteKnowledge(id: number): Promise<boolean> {
  try {
    await query(
      "UPDATE knowledge_base SET is_active = 0, updated_at = datetime('now') WHERE id = ?",
      [id]
    )
    return true
  } catch (error) {
    console.error('[KNOWLEDGE-BASE] Error deleting knowledge:', error)
    return false
  }
}

// 🆕 BUSCAR CON SQL LIKE (más eficiente para BD)
export async function searchKnowledgeAdvanced(
  searchTerm: string,
  options: {
    category?: string
    limit?: number
    onlyActive?: boolean
  } = {}
): Promise<KnowledgeItem[]> {
  try {
    const { category, limit = 5, onlyActive = true } = options
    
    let sql = `
      SELECT * FROM knowledge_base 
      WHERE (
        question LIKE ? OR 
        answer LIKE ? OR 
        keywords LIKE ?
      )
    `
    
    const searchPattern = `%${searchTerm}%`
    const params: any[] = [searchPattern, searchPattern, searchPattern]
    
    if (category) {
      sql += ' AND category = ?'
      params.push(category)
    }
    
    if (onlyActive) {
      sql += ' AND is_active = 1'
    }
    
    sql += ' ORDER BY id LIMIT ?'
    params.push(limit)
    
    const result = await query(sql, params)
    
    return result.rows.map((row: any) => ({
      id: row.id,
      category: row.category,
      question: row.question,
      answer: row.answer,
      keywords: JSON.parse(row.keywords || '[]'),
      phase: JSON.parse(row.metadata || '{}').phase,
    }))
  } catch (error) {
    console.error('[KNOWLEDGE-BASE] Error in searchKnowledgeAdvanced:', error)
    return []
  }
}