import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { SpeechClient } from '@google-cloud/speech'

// 🔥 AUMENTAR TIMEOUT A 5 MINUTOS (300 segundos)
export const maxDuration = 300

let speechClient: SpeechClient | null = null

function getSpeechClient(): SpeechClient {
  if (!speechClient) {
    const credentialsBase64 = process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64
    
    if (!credentialsBase64) {
      throw new Error('Google Cloud credentials not configured')
    }

    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8')
    const credentials = JSON.parse(credentialsJson)

    speechClient = new SpeechClient({ credentials })
  }

  return speechClient
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Obtener el archivo de audio del FormData
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    console.log('[TRANSCRIBE] Processing audio file:', audioFile.name, 'Size:', audioFile.size, 'Type:', audioFile.type)

    // Convertir el archivo a buffer
    const audioBytes = await audioFile.arrayBuffer()
    const audioBuffer = Buffer.from(audioBytes)

    console.log('[TRANSCRIBE] Audio buffer size:', audioBuffer.length)

    // 🔥 LÍMITE DE 1 MINUTO DE AUDIO (aprox 1MB)
    const MAX_AUDIO_SIZE = 2 * 1024 * 1024 // 2MB para ser generosos
    if (audioBuffer.length > MAX_AUDIO_SIZE) {
      console.log('[TRANSCRIBE] ⚠️ Audio too long, truncating')
      return NextResponse.json({ 
        error: 'Audio too long. Please keep your response under 1 minute.',
        transcript: ''
      }, { status: 400 })
    }

    // Configurar el cliente de Google Speech-to-Text
    const client = getSpeechClient()

    // Configuración para la transcripción
    const audio = {
      content: audioBuffer.toString('base64'),
    }

    // 🔥 CONFIGURACIÓN ACTUALIZADA PARA ESPAÑOL
    const config = {
      encoding: 'WEBM_OPUS' as const,
      sampleRateHertz: 48000,
      languageCode: 'es-US',  // 🇪🇸 CAMBIO CRÍTICO: Español en lugar de inglés
      enableAutomaticPunctuation: true,
      model: 'default',
      useEnhanced: true, // Mejor calidad
    }

    const requestConfig = {
      audio: audio,
      config: config,
    }

    console.log('[TRANSCRIBE] Sending to Google Speech-to-Text (ESPAÑOL)... (timeout: 60s)')

    // 🔥 AÑADIR TIMEOUT DE 60 SEGUNDOS
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Transcription timeout after 60s')), 60000)
    })

    // Hacer la transcripción con timeout
    const transcriptionPromise = client.recognize(requestConfig)
    
    const [response] = await Promise.race([
      transcriptionPromise,
      timeoutPromise
    ]) as any

    console.log('[TRANSCRIBE] Response received')

    // Extraer el texto transcrito
    const transcription = response.results
      ?.map((result: any) => result.alternatives?.[0]?.transcript || '')
      .join('\n')
      .trim()

    if (!transcription) {
      console.log('[TRANSCRIBE] No transcription detected')
      return NextResponse.json({ 
        error: 'Could not understand audio. Please speak clearly and try again.',
        transcript: ''
      }, { status: 400 })
    }

    console.log('[TRANSCRIBE] ✅ Success! Transcript (Spanish):', transcription)
    console.log('[TRANSCRIBE] Transcript length:', transcription.length)

    return NextResponse.json({
      success: true,
      transcript: transcription,
    })

  } catch (error) {
    console.error('[TRANSCRIBE] Error:', error)
    
    // Log detallado del error
    if (error instanceof Error) {
      console.error('[TRANSCRIBE] Error message:', error.message)
      console.error('[TRANSCRIBE] Error stack:', error.stack)
      
      // Si es timeout, dar mensaje específico
      if (error.message.includes('timeout')) {
        return NextResponse.json({ 
          error: 'Transcription took too long. Please try speaking more briefly.',
          details: 'timeout',
          transcript: ''
        }, { status: 408 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to transcribe audio. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error',
      transcript: ''
    }, { status: 500 })
  }
}