import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import Anthropic from '@anthropic-ai/sdk'

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]

// Helper: Evaluar candidato con Claude (PDF nativo + matching)
async function evaluateCandidateWithAI(
  cvFile: File,
  candidateName: string,
  coverLetter: string
): Promise<{ 
  evaluation: string
  fitScore: number
  resumeText: string
  bestMatch: string
  matchPercentages: Record<string, number>
}> {
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[AI] ANTHROPIC_API_KEY not configured')
    return {
      evaluation: '❌ Error de configuración: API key no configurada.',
      fitScore: 50,
      resumeText: 'Error: No se pudo procesar el CV',
      bestMatch: 'N/A',
      matchPercentages: {}
    }
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  try {
    console.log('[AI] Fetching active job postings...')
    
    // Obtener vacantes activas
    const jobsResult = await query(
      `SELECT id, title, department, location, requirements, responsibilities, interview_guidelines
       FROM job_postings WHERE is_active = 1`
    )

    const activeJobs = jobsResult.rows

    if (activeJobs.length === 0) {
      return {
        evaluation: '📋 Candidato recibido. No hay vacantes activas actualmente.',
        fitScore: 50,
        resumeText: 'CV recibido (sin vacantes activas para evaluar)',
        bestMatch: 'Sin vacantes activas',
        matchPercentages: {}
      }
    }

    console.log(`[AI] Found ${activeJobs.length} active job(s)`)

    // Crear contexto detallado de vacantes
    const jobsContext = activeJobs.map((job: any, i: number) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VACANTE #${i + 1}: ${job.title}
ID: ${job.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Ubicación: ${job.location}
🏢 Departamento: ${job.department}

📋 REQUISITOS OBLIGATORIOS:
${job.requirements}

💼 RESPONSABILIDADES DEL PUESTO:
${job.responsibilities}

🎯 CRITERIOS DE EVALUACIÓN (PRIORIDADES):
${job.interview_guidelines}
`).join('\n\n')

    // Convertir PDF a base64
    const arrayBuffer = await cvFile.arrayBuffer()
    const base64Data = Buffer.from(arrayBuffer).toString('base64')

    console.log('[AI] Sending request to Claude with PDF...')

    // Llamada a Claude con PDF
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 5000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64Data
              }
            },
            {
              type: 'text',
              text: `Eres un experto reclutador senior de Talent Scout AI. Tu tarea es analizar el CV PDF adjunto y compararlo con TODAS las vacantes disponibles.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 VACANTES DISPONIBLES EN TALENT SCOUT AI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${jobsContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CANDIDATO: ${candidateName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${coverLetter ? `✍️ CARTA DE PRESENTACIÓN DEL CANDIDATO:\n${coverLetter}\n\n` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INSTRUCCIONES CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PASO 1: Lee COMPLETAMENTE el CV PDF y extrae:
- Experiencia laboral (años, empresas, roles)
- Habilidades técnicas
- Educación
- Logros cuantificables

PASO 2: Compara el perfil del candidato con CADA vacante:
- Calcula porcentaje de match para CADA vacante (0-100%)
- Identifica la vacante con MAYOR porcentaje de match
- Justifica los porcentajes con evidencia del CV

PASO 3: Asigna un FIT_SCORE GENERAL (0-100):
- 90-100: Match excepcional con la mejor vacante
- 75-89: Muy buen match, cumple mayoría de requisitos
- 60-74: Match aceptable, necesita algo de desarrollo
- 40-59: Match débil, gaps significativos
- 0-39: No es adecuado para ninguna vacante

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 FORMATO DE RESPUESTA OBLIGATORIO (RESPETA ESTE FORMATO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESUME_SUMMARY:
[Resume en 4-6 líneas el perfil del candidato: nombre, experiencia principal, habilidades clave, educación. Extrae datos REALES del CV PDF, no inventes]

FIT_SCORE: [número 0-100]

BEST_MATCH: [Escribe el TÍTULO EXACTO de la vacante con mejor match]

MATCH_PERCENTAGES:
${activeJobs.map((job: any) => `- ${job.title}: [porcentaje]%`).join('\n')}

EVALUACIÓN DETALLADA:

🎯 RESUMEN EJECUTIVO
[2-3 oraciones: ¿Vale la pena entrevistar a este candidato? ¿Para cuál vacante?]

💪 FORTALEZAS PRINCIPALES
- [Fortaleza 1 con EVIDENCIA del CV - cita experiencia específica]
- [Fortaleza 2 con EVIDENCIA del CV - cita habilidades demostradas]
- [Fortaleza 3 con EVIDENCIA del CV - cita logros cuantificables]

⚠️ ÁREAS DE MEJORA / GAPS
- [Gap 1 - específico]
- [Gap 2 - específico]

🎯 MEJOR MATCH: [Nombre de la vacante]
[Explica en 3-4 líneas POR QUÉ esta es la mejor vacante para el candidato]

📊 ANÁLISIS POR VACANTE:
${activeJobs.map((job: any) => `
**${job.title}** (${job.department})
Match: [X]%
[2-3 líneas explicando el nivel de ajuste con esta vacante específica]
`).join('\n')}

🔑 RECOMENDACIÓN FINAL
[¿Aprobar para entrevista? ¿Cuál vacante? ¿Qué verificar en la entrevista?]

💡 PREGUNTAS SUGERIDAS PARA ENTREVISTA
1. [Pregunta específica basada en algo del CV]
2. [Pregunta sobre experiencia relevante para la vacante]
3. [Pregunta técnica o de habilidades]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRÍTICO: 
- Usa SOLO información del CV PDF, NO inventes datos
- Todos los porcentajes deben sumar contexto lógico
- Sé específico y cita evidencia del CV
- Usa emojis para legibilidad
- Este análisis es SOLO para RH`
            }
          ]
        }
      ]
    })

    console.log('[AI] Response received from Claude')

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const responseText = content.text
    console.log('[AI] Response preview:', responseText.substring(0, 300))

    // Extraer datos estructurados
    const resumeMatch = responseText.match(/RESUME_SUMMARY:\s*\n([\s\S]+?)(?=\n\nFIT_SCORE:|FIT_SCORE:)/i)
    const resumeText = resumeMatch 
      ? resumeMatch[1].trim() 
      : 'Resumen del CV no disponible'

    const fitScoreMatch = responseText.match(/FIT_SCORE:\s*(\d+)/i)
    const fitScore = fitScoreMatch ? parseInt(fitScoreMatch[1]) : 50

    const bestMatchMatch = responseText.match(/BEST_MATCH:\s*(.+?)(?=\n|$)/i)
    const bestMatch = bestMatchMatch ? bestMatchMatch[1].trim() : 'No determinado'

    // Extraer match percentages
    const matchPercentages: Record<string, number> = {}
    const matchSection = responseText.match(/MATCH_PERCENTAGES:\s*\n([\s\S]+?)(?=\n\nEVALUACIÓN|EVALUACIÓN)/i)
    
    if (matchSection) {
      const lines = matchSection[1].split('\n')
      lines.forEach(line => {
        const match = line.match(/[-•]\s*(.+?):\s*(\d+)%/i)
        if (match) {
          matchPercentages[match[1].trim()] = parseInt(match[2])
        }
      })
    }

    const evaluationMatch = responseText.match(/EVALUACIÓN DETALLADA:([\s\S]+)/i)
    const evaluation = evaluationMatch 
      ? evaluationMatch[1].trim() 
      : responseText

    console.log(`[AI] Evaluation complete. Score: ${fitScore}, Best Match: ${bestMatch}`)

    return {
      evaluation,
      fitScore: Math.min(Math.max(fitScore, 0), 100),
      resumeText,
      bestMatch,
      matchPercentages
    }

  } catch (error: any) {
    console.error('[AI] Error:', error)
    console.error('[AI] Error details:', error.message)
    
    // Error más específico
    if (error.status === 401) {
      return {
        evaluation: '❌ Error: API key de Claude inválida.',
        fitScore: 50,
        resumeText: 'Error de autenticación con Claude API',
        bestMatch: 'Error',
        matchPercentages: {}
      }
    }

    if (error.status === 400) {
      return {
        evaluation: `❌ Error: PDF no se pudo procesar correctamente. ${error.message}`,
        fitScore: 50,
        resumeText: 'Error al leer PDF',
        bestMatch: 'Error',
        matchPercentages: {}
      }
    }
    
    return {
      evaluation: `⚠️ Error al evaluar con IA: ${error.message || 'Unknown'}. El equipo de RH revisará manualmente.`,
      fitScore: 50,
      resumeText: 'Error al procesar CV con IA',
      bestMatch: 'Error en evaluación',
      matchPercentages: {}
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || ''
    const coverLetter = formData.get('cover_letter') as string || ''
    const cvFile = formData.get('cv_file') as File

    console.log('[APPLY] Processing application for:', email)
    console.log('[APPLY] File type:', cvFile.type)
    console.log('[APPLY] File size:', cvFile.size, 'bytes')

    if (!fullName || !email || !cvFile) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(cvFile.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo PDF, DOC, DOCX, TXT' },
        { status: 400 }
      )
    }

    if (cvFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Archivo muy grande (máx 5MB)' },
        { status: 400 }
      )
    }

    // Verificar email duplicado
    const existing = await query('SELECT id FROM candidates WHERE email = ?', [email])
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una postulación con este email' },
        { status: 409 }
      )
    }

    // Evaluar con IA
    console.log('[APPLY] Starting AI evaluation...')
    const { evaluation, fitScore, resumeText, bestMatch, matchPercentages } = await evaluateCandidateWithAI(
      cvFile,
      fullName,
      coverLetter
    )

    console.log('[APPLY] AI evaluation completed')
    console.log('[APPLY] Fit Score:', fitScore)
    console.log('[APPLY] Best Match:', bestMatch)
    console.log('[APPLY] Match Percentages:', matchPercentages)

    // Guardar en BD (incluyendo best_match si quieres agregarlo a la tabla)
    await query(
      `INSERT INTO candidates (
        full_name, email, phone, resume_text, cover_letter,
        ai_evaluation, fit_score, status, evaluated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`,
      [
        fullName, 
        email, 
        phone, 
        `MEJOR MATCH: ${bestMatch} (${matchPercentages[bestMatch] || 0}%)\n\n${resumeText}`, 
        coverLetter, 
        evaluation, 
        fitScore
      ]
    )

    console.log('[APPLY] Candidate saved successfully')

    return NextResponse.json({
      success: true,
      message: 'Postulación recibida exitosamente',
      fit_score: fitScore,
      best_match: bestMatch,
      match_percentages: matchPercentages
    })

  } catch (error: any) {
    console.error('[APPLY] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al procesar postulación' },
      { status: 500 }
    )
  }
}