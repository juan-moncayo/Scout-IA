"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"

interface VoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void
  isProcessing?: boolean
}

export function VoiceRecorder({ onTranscriptReady, isProcessing = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      console.log('[VoiceRecorder] Starting recording...')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      })

      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.log('[VoiceRecorder] webm/opus not supported, trying webm')
        mimeType = 'audio/webm'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          console.log('[VoiceRecorder] webm not supported, using default')
          mimeType = ''
        }
      }

      const options = mimeType ? { mimeType } : undefined
      const mediaRecorder = new MediaRecorder(stream, options)
      
      console.log('[VoiceRecorder] Using mimeType:', mediaRecorder.mimeType)

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          console.log('[VoiceRecorder] Audio chunk received:', event.data.size, 'bytes')
        }
      }

      mediaRecorder.onstop = async () => {
        console.log('[VoiceRecorder] Recording stopped, processing...')
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType || 'audio/webm'
        })
        console.log('[VoiceRecorder] Audio blob created:', audioBlob.size, 'bytes, type:', audioBlob.type)
        
        // Stop all tracks
        stream.getTracks().forEach(track => {
          track.stop()
          console.log('[VoiceRecorder] Track stopped:', track.kind)
        })
        
        // Limpiar timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        setRecordingTime(0)
        
        if (audioBlob.size > 0) {
          await transcribeAudio(audioBlob)
        } else {
          console.error('[VoiceRecorder] Audio blob is empty')
          alert('Recording failed. Please try again.')
        }
      }

      mediaRecorderRef.current = mediaRecorder
      
      // Grabar en chunks de 1 segundo
      mediaRecorder.start(1000)
      setIsRecording(true)
      
      // 🔥 INICIAR CONTADOR DE TIEMPO
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          // 🔥 AUTO-STOP DESPUÉS DE 60 SEGUNDOS
          if (newTime >= 60) {
            console.log('[VoiceRecorder] Auto-stopping after 60 seconds')
            stopRecording()
          }
          return newTime
        })
      }, 1000)
      
      console.log('[VoiceRecorder] Recording started successfully')

    } catch (error) {
      console.error('[VoiceRecorder] Error starting recording:', error)
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Microphone access denied. Please allow microphone permissions.')
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found. Please connect a microphone.')
        } else {
          alert('Could not access microphone: ' + error.message)
        }
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('[VoiceRecorder] Stopping recording...')
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    console.log('[VoiceRecorder] Starting transcription...')

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const token = localStorage.getItem('training_token')
      
      console.log('[VoiceRecorder] Sending audio to transcription API...')
      console.log('[VoiceRecorder] Audio size:', audioBlob.size, 'bytes')
      console.log('[VoiceRecorder] Audio type:', audioBlob.type)
      
      const response = await fetch('/api/training/ai/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      console.log('[VoiceRecorder] Transcription response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('[VoiceRecorder] Transcription failed:', response.status, errorData)
        
        // 🔥 MANEJAR DIFERENTES TIPOS DE ERRORES
        if (response.status === 408 || errorData.details === 'timeout') {
          alert('⏱️ Transcription timeout. Please try speaking more briefly (under 45 seconds).')
        } else if (response.status === 400) {
          alert(errorData.error || 'Could not understand audio. Please speak clearly.')
        } else {
          alert('Failed to transcribe audio. Please try again.')
        }
        return
      }

      const data = await response.json()
      console.log('[VoiceRecorder] Transcription result:', data)

      if (data.transcript && data.transcript.trim()) {
        console.log('[VoiceRecorder] Success! Transcript:', data.transcript)
        onTranscriptReady(data.transcript.trim())
      } else {
        console.error('[VoiceRecorder] Empty transcript received')
        alert('Could not understand audio. Please speak clearly and try again.')
      }

    } catch (error) {
      console.error('[VoiceRecorder] Transcription error:', error)
      if (error instanceof Error) {
        alert(`Failed to transcribe: ${error.message}`)
      } else {
        alert('Failed to transcribe audio. Please try again.')
      }
    } finally {
      setIsTranscribing(false)
    }
  }

  const isDisabled = isProcessing || isTranscribing

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isDisabled}
        className={`w-20 h-20 rounded-full ${
          isRecording 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isTranscribing ? (
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        ) : isRecording ? (
          <MicOff className="h-8 w-8 text-white" />
        ) : (
          <Mic className="h-8 w-8 text-white" />
        )}
      </Button>

      <div className="text-center">
        {isTranscribing && (
          <p className="text-sm text-gray-600 font-medium">Transcribing...</p>
        )}
        {isRecording && !isTranscribing && (
          <>
            <p className="text-sm text-red-600 font-medium">
              Recording... Click to stop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {recordingTime}s / 60s max
            </p>
          </>
        )}
        {!isRecording && !isTranscribing && !isProcessing && (
          <p className="text-sm text-gray-600">Click to start speaking</p>
        )}
        {isProcessing && (
          <p className="text-sm text-blue-600 font-medium">Processing your response...</p>
        )}
      </div>
    </div>
  )
}