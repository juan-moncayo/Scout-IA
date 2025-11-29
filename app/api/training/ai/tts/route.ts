import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

// 🆕 Función mejorada de limpieza para evitar caracteres que causan error
function cleanTextForTTS(text: string): string {
  let cleaned = text

  // 1. Remover URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '')

  // 2. Remover tags HTML/XML
  cleaned = cleaned.replace(/<[^>]*>/g, ' ')

  // 3. Remover markdown bold/italic
  cleaned = cleaned.replace(/\*\*([^\*]+)\*\*/g, '$1')
  cleaned = cleaned.replace(/\*([^\*]+)\*/g, '$1')

  // 4. Remover símbolos problemáticos
  cleaned = cleaned.replace(/[-_•→←↑↓]/g, ' ')
  cleaned = cleaned.replace(/[#@$%^&]/g, '')
  
  // 5. Remover números de lista
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '')

  // 6. Remover emojis
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')

  // 7. 🔥 IMPORTANTE: Remover caracteres unicode especiales que causan error
  cleaned = cleaned.replace(/[━═─]/g, '-')  // Líneas especiales
  cleaned = cleaned.replace(/[┌┐└┘├┤│]/g, ' ')  // Bordes de caja
  
  // 8. Limpiar múltiples espacios
  cleaned = cleaned.replace(/\s+/g, ' ')

  // 9. Trim
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

    console.log('[TTS] ========== STARTING TTS ==========')
    console.log('[TTS] Original text length:', text.length)
    console.log('[TTS] Original text (first 150 chars):', text.substring(0, 150))

    // 🔥 LIMPIAR TEXTO
    const cleanedText = cleanTextForTTS(text)
    
    console.log('[TTS] Cleaned text length:', cleanedText.length)
    console.log('[TTS] Cleaned text (first 150 chars):', cleanedText.substring(0, 150))
    
    if (cleanedText.length === 0) {
      console.error('[TTS] ❌ Text is empty after cleaning!')
      return NextResponse.json({ error: 'Text is empty after cleaning' }, { status: 400 })
    }
    
    if (cleanedText.length > 5000) {
      console.error('[TTS] ❌ Text too long:', cleanedText.length)
      return NextResponse.json({ error: 'Text too long. Max 5000 characters.' }, { status: 400 })
    }

    console.log('[TTS] Creating TTS client...')
    const client = getTTSClient()
    
    console.log('[TTS] Calling Google Cloud TTS API...')
    console.log('[TTS] Voice: es-US-Neural2-A (Spanish)')
    
    // 🔥 LLAMADA A GOOGLE TTS
    const [response] = await client.synthesizeSpeech({
      input: { text: cleanedText }, 
      voice: {
        languageCode: 'es-US',           // 🇪🇸 ESPAÑOL
        name: 'es-US-Neural2-A',         // Voz neural FEMENINA
        ssmlGender: 'FEMALE',            // 🔥 FEMALE (la voz Neural2-A es femenina)
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    })

    if (!response.audioContent) {
      console.error('[TTS] ❌ No audio content in response!')
      throw new Error('No audio content received from Google TTS')
    }

    const audioBase64 = Buffer.from(response.audioContent).toString('base64')
    const audioSize = response.audioContent.length
    
    console.log('[TTS] ✅ SUCCESS! Audio generated')
    console.log('[TTS] Audio size:', audioSize, 'bytes')
    console.log('[TTS] Base64 length:', audioBase64.length)

    return NextResponse.json({
      success: true,
      audio: audioBase64,
      format: 'mp3',
    })

  } catch (error) {
    console.error('[TTS] ========== ERROR ==========')
    console.error('[TTS] ❌ ERROR:', error)
    
    if (error instanceof Error) {
      console.error('[TTS] Error name:', error.name)
      console.error('[TTS] Error message:', error.message)
      console.error('[TTS] Error stack:', error.stack)
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}