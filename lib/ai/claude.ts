import Anthropic from '@anthropic-ai/sdk'

// Inicializar cliente de Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Tipos
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

// Función principal para chat con Claude
export async function chatWithClaude(options: ChatOptions): Promise<string> {
  const {
    messages,
    systemPrompt = 'You are a helpful AI assistant.',
    temperature = parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens = parseInt(process.env.AI_MAX_TOKENS || '2048'),
  } = options

  try {
    console.log('[CLAUDE] Sending request with', messages.length, 'messages')

    const response = await anthropic.messages.create({
      model: process.env.AI_MODEL || 'claude-3-5-haiku-20241022',
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    // Extraer el texto de la respuesta
    const content = response.content[0]
    if (content.type === 'text') {
      console.log('[CLAUDE] Response received, length:', content.text.length)
      return content.text
    }

    throw new Error('Unexpected response format from Claude')

  } catch (error) {
    console.error('[CLAUDE] Error:', error)
    throw error
  }
}

// Función para streaming (opcional, para futuras mejoras)
export async function* streamChatWithClaude(options: ChatOptions) {
  const {
    messages,
    systemPrompt = 'You are a helpful AI assistant.',
    temperature = parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens = parseInt(process.env.AI_MAX_TOKENS || '2048'),
  } = options

  try {
    const stream = await anthropic.messages.stream({
      model: process.env.AI_MODEL || 'claude-3-5-haiku-20241022',
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield chunk.delta.text
      }
    }

  } catch (error) {
    console.error('[CLAUDE] Streaming error:', error)
    throw error
  }
}