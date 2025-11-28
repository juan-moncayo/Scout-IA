import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { chatWithClaude, Message } from '@/lib/ai/claude'
import { TRAINING_ASSISTANT_SYSTEM_PROMPT, buildPromptWithContext } from '@/lib/ai/prompts'
import { getScenarioById } from '@/lib/training/practice-scenarios'

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
    const { message, conversationHistory = [], scenarioId, systemPrompt: customSystemPrompt } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    console.log('[AI CHAT] Processing message...', scenarioId ? `Scenario: ${scenarioId}` : customSystemPrompt ? 'Custom system prompt' : 'General')

    // 🔥 PRIORIDAD DE SYSTEM PROMPTS:
    // 1. Si viene un systemPrompt personalizado (como en el examen), usarlo
    // 2. Si hay scenarioId, usar el prompt del escenario
    // 3. Si no, usar el prompt de entrenamiento general
    let systemPrompt = TRAINING_ASSISTANT_SYSTEM_PROMPT
    
    if (customSystemPrompt) {
      // 👈 NUEVO: Si viene un systemPrompt personalizado, usarlo (para el examen)
      systemPrompt = customSystemPrompt
      console.log('[AI CHAT] Using custom system prompt (exam mode)')
    } else if (scenarioId) {
      const scenario = getScenarioById(scenarioId)
      if (scenario) {
        systemPrompt = scenario.systemPrompt
        console.log('[AI CHAT] Using scenario:', scenario.name)
      }
    }

    // Si no hay escenario y no hay custom prompt, usar RAG para contexto
    const messageWithContext = (scenarioId || customSystemPrompt) ? message : buildPromptWithContext(message)

    const messages: Message[] = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: messageWithContext }
    ]

    const response = await chatWithClaude({
      messages,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 2048,
    })

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('[AI CHAT] Error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}