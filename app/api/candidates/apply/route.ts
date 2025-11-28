import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import Anthropic from '@anthropic-ai/sdk'

// Máximo tamaño de archivo: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Tipos de archivo permitidos
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]

// Helper: Extraer texto de diferentes formatos
async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Si es texto plano
  if (file.type === 'text/plain') {
    return buffer.toString('utf-8')
  }

  // Si es PDF o DOC/DOCX, convertir a texto (simplificado)
  // En producción, usa librerías como pdf-parse o mammoth
  const text = buffer.toString('utf-8', 0, Math.min(buffer.length, 10000))
  return text.replace(/[^\x20-\x7E\n]/g, ' ').trim()
}

// Helper: Evaluar candidato con IA
async function evaluateCandidateWithAI(
  resumeText: string,
  candidateName: string
): Promise<{ evaluation: string; fitScore: number }> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!
  })

  // Obtener todas las vacantes activas
  const jobsResult = await query(
    `SELECT 
      title, 
      department, 
      requirements, 
      responsibilities,
      interview_guidelines
     FROM job_postings
     WHERE is_active = 1`
  )

  const activeJobs = jobsResult.rows

  if (activeJobs.length === 0) {
    return {
      evaluation: 'Candidato recibido. Actualmente no hay vacantes activas, pero guardaremos tu perfil para futuras oportunidades.',
      fitScore: 50
    }
  }

  // Crear contexto de las vacantes
  const jobsContext = activeJobs.map((job: any, index: number) => `
**Vacante ${index + 1}: ${job.title}**
- Departamento: ${job.department}
- Requisitos: ${job.requirements}
- Responsabilidades: ${job.responsibilities}
- Criterios de Evaluación: ${job.interview_guidelines}
`).join('\n\n')

  const prompt = `Eres un experto reclutador de Talent Scout AI. Analiza el siguiente CV y evalúa qué tan adecuado es este candidato para nuestras vacantes disponibles.

**VACANTES DISPONIBLES:**
${jobsContext}

**CV DEL CANDIDATO (${candidateName}):**
${resumeText}

**INSTRUCCIONES:**
1. Analiza las habilidades, experiencia y formación del candidato
2. Compara con los requisitos de cada vacante disponible
3. Identifica cuál(es) vacante(s) son más adecuadas para este candidato
4. Proporciona un puntaje de ajuste (fit score) de 0-100
5. Explica claramente:
   - Fortalezas del candidato
   - Áreas de mejora
   - Vacante(s) recomendada(s)
   - Por qué es un buen match (o no)

**FORMATO DE RESPUESTA:**
FIT_SCORE: [número 0-100]

EVALUACIÓN:
[Tu análisis detallado en 3-5 párrafos]

IMPORTANTE: Sé objetivo, profesional y constructivo. El candidato NO verá esto, solo el equipo de RH.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const responseText = content.text

    // Extraer fit score
    const fitScoreMatch = responseText.match(/FIT_SCORE:\s*(\d+)/)
    const fitScore = fitScoreMatch ? parseInt(fitScoreMatch[1]) : 50

    // Extraer evaluación
    const evaluationMatch = responseText.match(/EVALUACIÓN:\s*([\s\S]+)/)
    const evaluation = evaluationMatch ? evaluationMatch[1].trim() : responseText

    return {
      evaluation,
      fitScore: Math.min(Math.max(fitScore, 0), 100)
    }
  } catch (error) {
    console.error('[AI EVALUATION] Error:', error)
    return {
      evaluation: 'Error al evaluar con IA. El equipo de RH revisará manualmente el perfil.',
      fitScore: 50
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

    // Validaciones
    if (!fullName || !email || !cvFile) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(cvFile.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Usa PDF, DOC, DOCX o TXT' },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (cvFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'El archivo es muy grande. Máximo 5MB' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingCandidate = await query(
      'SELECT id FROM candidates WHERE email = ?',
      [email]
    )

    if (existingCandidate.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una postulación con este email' },
        { status: 409 }
      )
    }

    // Extraer texto del CV
    console.log('[APPLY] Extracting text from CV...')
    const resumeText = await extractTextFromFile(cvFile)

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: 'No se pudo leer el contenido del CV. Intenta con otro formato.' },
        { status: 400 }
      )
    }

    // Evaluar con IA
    console.log('[APPLY] Evaluating candidate with AI...')
    const { evaluation, fitScore } = await evaluateCandidateWithAI(resumeText, fullName)

    // Guardar candidato en la base de datos
    const result = await query(
      `INSERT INTO candidates (
        full_name,
        email,
        phone,
        resume_text,
        cover_letter,
        ai_evaluation,
        fit_score,
        status,
        evaluated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`,
      [
        fullName,
        email,
        phone,
        resumeText.substring(0, 10000), // Limitar tamaño
        coverLetter,
        evaluation,
        fitScore
      ]
    )

    console.log('[APPLY] Candidate saved successfully:', result)

    return NextResponse.json({
      success: true,
      message: 'Postulación recibida exitosamente',
      candidate_id: result.rows[0]?.id || null
    })

  } catch (error: any) {
    console.error('[APPLY] Error processing application:', error)
    return NextResponse.json(
      { error: 'Error al procesar tu postulación. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}