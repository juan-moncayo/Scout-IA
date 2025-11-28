import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

// 🆕 Importar la función de limpieza
function cleanTextForTTS(text: string): string {
  let cleaned = text

  // 1. Remover URLs completas
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '')

  // 2. Remover tags HTML/XML
  cleaned = cleaned.replace(/<[^>]*>/g, ' ')

  // 3. Remover markdown bold/italic (**texto**, *texto*)
  cleaned = cleaned.replace(/\*\*([^\*]+)\*\*/g, '$1')
  cleaned = cleaned.replace(/\*([^\*]+)\*/g, '$1')

  // 4. Remover símbolos comunes que no deben leerse
  cleaned = cleaned.replace(/[-_•→←↑↓]/g, ' ') // Guiones, bullets, flechas
  cleaned = cleaned.replace(/[#@$%^&]/g, '') // Símbolos especiales
  
  // 5. Remover números de lista al inicio de línea (ej: "1. ", "2. ")
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '')

  // 6. Remover emojis
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')

  // 7. Limpiar múltiples espacios y saltos de línea
  cleaned = cleaned.replace(/\s+/g, ' ')

  // 8. Remover espacios al inicio y final
  cleaned = cleaned.trim()

  return cleaned
}

let ttsClient: TextToSpeechClient | null = null

function getTTSClient(): TextToSpeechClient {
  if (!ttsClient) {
    const credentialsBase64 = process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64
    
    if (!credentialsBase64) {
      throw new Error('Google Cloud credentials not configured')
    }

    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8')
    const credentials = JSON.parse(credentialsJson)

    ttsClient = new TextToSpeechClient({ credentials })
  }

  return ttsClient
}

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
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // 🆕 LIMPIAR TEXTO ANTES DE ENVIARLO AL TTS
    const cleanedText = cleanTextForTTS(text)
    
    if (cleanedText.length > 5000) {
      return NextResponse.json({ error: 'Text too long. Max 5000 characters.' }, { status: 400 })
    }

    console.log('[TTS] Generating speech...')
    console.log('[TTS] Original length:', text.length, 'Cleaned length:', cleanedText.length)

    const client = getTTSClient()
    
    const [response] = await client.synthesizeSpeech({
      input: { text: cleanedText }, 
      voice: {
        languageCode: 'es-US',
        name: 'es-US-Neural2-A', 
        ssmlGender: 'MALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    })

    if (!response.audioContent) {
      throw new Error('No audio content received')
    }

    const audioBase64 = Buffer.from(response.audioContent).toString('base64')

    return NextResponse.json({
      success: true,
      audio: audioBase64,
      format: 'mp3',
    })

  } catch (error) {
    console.error('[TTS] Error:', error)
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 })
  }
}