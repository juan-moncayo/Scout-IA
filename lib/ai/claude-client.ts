import Anthropic from '@anthropic-ai/sdk'

// Inicializar cliente
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  messages: Message[]
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

// Chat con Claude
export async function chatWithClaude(options: ChatOptions): Promise<string> {
  const {
    messages,
    systemPrompt = 'Eres un asistente útil de IA.',
    temperature = 0.7,
    maxTokens = 2048,
  } = options

  try {
    console.log('[CLAUDE] Enviando request con', messages.length, 'mensajes')

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    const content = response.content[0]
    if (content.type === 'text') {
      console.log('[CLAUDE] Respuesta recibida, length:', content.text.length)
      return content.text
    }

    throw new Error('Formato de respuesta inesperado')

  } catch (error: any) {
    console.error('[CLAUDE] Error:', error.message)
    throw error
  }
}

// Evaluar CV con texto plano (para re-evaluación)
export async function evaluateCVText(
  resumeText: string,
  candidateName: string,
  coverLetter: string,
  jobPostings: any[]
): Promise<{
  evaluation: string
  fitScore: number
  bestMatch: string
  matchPercentages: Record<string, number>
}> {
  
  if (jobPostings.length === 0) {
    return {
      evaluation: '📋 No hay vacantes activas.',
      fitScore: 50,
      bestMatch: 'Sin vacantes',
      matchPercentages: {}
    }
  }

  const jobsContext = jobPostings.map((job: any, i: number) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VACANTE ${i + 1}: ${job.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 ${job.department} | 📍 ${job.location}

📋 REQUISITOS:
${job.requirements}

💼 RESPONSABILIDADES:
${job.responsibilities}

🎯 CRITERIOS:
${job.interview_guidelines}
`).join('\n\n')

  const prompt = `Eres experto reclutador de Talent Scout AI. Analiza este CV.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 VACANTES DISPONIBLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${jobsContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 ${candidateName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 CV:
${resumeText}

${coverLetter ? `✍️ CARTA:\n${coverLetter}\n` : ''}

RESPONDE EN ESTE FORMATO EXACTO:

FIT_SCORE: [0-100]

BEST_MATCH: [Título exacto de la vacante]

MATCH_PERCENTAGES:
${jobPostings.map((job: any) => `- ${job.title}: [porcentaje]`).join('\n')}

EVALUACIÓN DETALLADA:

🎯 RESUMEN EJECUTIVO
[2-3 oraciones sobre el candidato]

💪 FORTALEZAS
- [Fortaleza 1 con evidencia del CV]
- [Fortaleza 2 con evidencia del CV]
- [Fortaleza 3 con evidencia del CV]

⚠️ GAPS
- [Gap 1]
- [Gap 2]

📊 ANÁLISIS POR VACANTE:
${jobPostings.map((job: any) => `**${job.title}**: [X]% - [Justificación 2-3 líneas]`).join('\n')}

🔑 RECOMENDACIÓN
[¿Aprobar para entrevista? ¿Qué vacante? Justifica]`

  console.log('[EVALUATE-CV] Enviando a Claude...')

  const response = await chatWithClaude({
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    maxTokens: 4000
  })

  console.log('[EVALUATE-CV] Respuesta recibida')

  // Extraer datos
  const fitScoreMatch = response.match(/FIT_SCORE:\s*(\d+)/i)
  const fitScore = fitScoreMatch ? parseInt(fitScoreMatch[1]) : 50

  const bestMatchMatch = response.match(/BEST_MATCH:\s*(.+?)(?=\n|$)/i)
  const bestMatch = bestMatchMatch ? bestMatchMatch[1].trim() : 'No determinado'

  const matchPercentages: Record<string, number> = {}
  const matchSection = response.match(/MATCH_PERCENTAGES:\s*\n([\s\S]+?)(?=\n\nEVALUACIÓN|EVALUACIÓN)/i)
  
  if (matchSection) {
    const lines = matchSection[1].split('\n')
    lines.forEach(line => {
      const match = line.match(/[-•]\s*(.+?):\s*(\d+)/i)
      if (match) {
        matchPercentages[match[1].trim()] = parseInt(match[2])
      }
    })
  }

  const evaluationMatch = response.match(/EVALUACIÓN DETALLADA:([\s\S]+)/i)
  const evaluation = evaluationMatch ? evaluationMatch[1].trim() : response

  console.log('[EVALUATE-CV] Fit Score:', fitScore)
  console.log('[EVALUATE-CV] Best Match:', bestMatch)

  return {
    evaluation,
    fitScore: Math.min(Math.max(fitScore, 0), 100),
    bestMatch,
    matchPercentages
  }
}