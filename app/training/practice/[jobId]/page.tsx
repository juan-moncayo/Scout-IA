"use client"

import { useState, useRef, useEffect } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceRecorder } from "@/components/training/VoiceRecorder"
import { AvatarDisplay } from "@/components/training/AvatarDisplay"
import { ArrowLeft, ChevronDown, ChevronUp, Loader2, Briefcase } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface JobContext {
  id: number
  title: string
  department: string
  location: string
  employment_type: string
  requirements: string
  responsibilities: string
  interview_guidelines: string
}

interface CandidateContext {
  full_name: string
  email: string
  resume_text: string
  cover_letter: string
}

function JobPracticeContent() {
  const { token, user, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = params?.jobId as string
  
  const [jobContext, setJobContext] = useState<JobContext | null>(null)
  const [candidateContext, setCandidateContext] = useState<CandidateContext | null>(null)
  const [isLoadingContext, setIsLoadingContext] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [currentAIText, setCurrentAIText] = useState("")
  const [showConversation, setShowConversation] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Cargar contexto de la vacante y candidato
  useEffect(() => {
    if (jobId && token) {
      fetchJobContext()
    }
  }, [jobId, token])

  const fetchJobContext = async () => {
    setIsLoadingContext(true)
    try {
      console.log('[PRACTICE] Fetching context for job:', jobId)
      const response = await fetch(`/api/training/job-context/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[PRACTICE] Context loaded:', data)
        setJobContext(data.job)
        setCandidateContext(data.candidate)
      } else {
        console.error('[PRACTICE] Failed to load context:', response.status)
        alert('Error loading job information')
        router.push('/training/dashboard')
      }
    } catch (error) {
      console.error('[PRACTICE] Error fetching context:', error)
      alert('Error loading job information')
      router.push('/training/dashboard')
    } finally {
      setIsLoadingContext(false)
    }
  }

  const startPractice = async () => {
    if (!jobContext || !candidateContext) return

    setHasStarted(true)
    
    // 🔥 Saludo personalizado usando nombre del candidato y puesto
    const initialMessage = `Hola ${candidateContext.full_name}, gracias por tu interés en el puesto de ${jobContext.title} en ${jobContext.department}. He revisado tu CV y me gustaría conocerte mejor. ¿Podrías comenzar hablándome sobre tu experiencia más relevante para este puesto?`
    
    const msg: ConversationMessage = {
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }
    
    setConversation([msg])
    setCurrentAIText(initialMessage)
    
    await speakText(initialMessage)
  }

  const handleVoiceInput = async (transcript: string) => {
    if (!jobContext || !candidateContext) return

    console.log('[PRACTICE] User said:', transcript)
    
    setCurrentTranscript(transcript)
    setIsProcessing(true)

    const userMessage: ConversationMessage = {
      role: 'user',
      content: transcript,
      timestamp: new Date()
    }
    setConversation(prev => [...prev, userMessage])

    try {
      // 🔥 PROMPT PERSONALIZADO según la vacante y CV
      const customSystemPrompt = generatePracticePrompt(jobContext, candidateContext)

      const chatResponse = await fetch('/api/training/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: transcript,
          conversationHistory: conversation.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          systemPrompt: customSystemPrompt
        })
      })

      if (!chatResponse.ok) {
        throw new Error('Failed to get AI response')
      }

      const chatData = await chatResponse.json()
      const aiResponse = chatData.response

      console.log('[PRACTICE] AI response:', aiResponse)

      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }
      setConversation(prev => [...prev, assistantMessage])

      setCurrentAIText(aiResponse)

      await speakText(aiResponse)

    } catch (error) {
      console.error('[PRACTICE] Error:', error)
      alert('Error processing your voice. Please try again.')
      setIsSpeaking(false)
    } finally {
      setIsProcessing(false)
      setCurrentTranscript("")
    }
  }

  // 🔥 Generar prompt personalizado para práctica
  const generatePracticePrompt = (job: JobContext, candidate: CandidateContext): string => {
    return `Eres un entrevistador profesional de Scout AI realizando una entrevista de práctica.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VACANTE: ${job.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Departamento: ${job.department}
Ubicación: ${job.location}
Tipo: ${job.employment_type}

REQUISITOS CLAVE:
${job.requirements}

RESPONSABILIDADES:
${job.responsibilities}

${job.interview_guidelines ? `CRITERIOS DE EVALUACIÓN:
${job.interview_guidelines}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CANDIDATO: ${candidate.full_name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CV/EXPERIENCIA:
${candidate.resume_text}

${candidate.cover_letter ? `CARTA DE PRESENTACIÓN:
${candidate.cover_letter}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TU ROL COMO ENTREVISTADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPORTAMIENTO:
- Sé profesional, amigable pero objetivo
- Haz preguntas relevantes al puesto de "${job.title}"
- Profundiza en áreas del CV relacionadas con los requisitos
- Desafía al candidato con escenarios realistas del puesto
- Evalúa si cumple con los criterios de la vacante

TIPOS DE PREGUNTAS:
1. Sobre experiencia específica del CV relacionada con: ${job.requirements.split('\n')[0] || 'los requisitos'}
2. Preguntas de comportamiento (método STAR) sobre: ${job.responsibilities.split('\n')[0] || 'las responsabilidades'}
3. Escenarios hipotéticos del día a día en ${job.title}
4. Preguntas técnicas según los requisitos

🚫 NUNCA HAGAS ESTO:
- NO pidas links, URLs, portafolios online, o recursos externos
- NO pidas que envíe documentos, archivos o materiales
- NO digas "envíame tu portafolio" o "comparte el link"

✅ EN SU LUGAR, HAZ ESTO:
- Si necesitas ver trabajos anteriores: "Descríbeme un proyecto específico de tu portafolio"
- Si necesitas ejemplos: "Cuéntame sobre un caso donde aplicaste [habilidad]"
- Si necesitas evidencia: "Explícame paso a paso cómo resolviste [problema]"

IMPORTANTE:
- NO seas demasiado fácil - evalúa de verdad
- Menciona detalles específicos de su CV cuando hagas preguntas
- Relaciona todo con los requisitos de "${job.title}"
- Da feedback constructivo pero honesto
- Pide que DESCRIBA y EXPLIQUE proyectos, no que comparta links

Esto es una PRÁCTICA, así que ayúdale a mejorar con feedback específico.`
  }

  // 🔊 Audio TTS - ESTE controla completamente isSpeaking
  const speakText = async (text: string) => {
    try {
      console.log('[PRACTICE-TTS] ========== STARTING NEW TTS ==========');
      console.log('[PRACTICE-TTS] Text length:', text.length, 'characters');
      
      // 🔥 PASO 1: Marcar que está hablando ANTES de generar audio
      setIsSpeaking(true);
      console.log('[PRACTICE-TTS] ✅ isSpeaking = TRUE (before generating audio)');
      
      // Generar audio TTS (ya está en español)
      const ttsResponse = await fetch('/api/training/ai/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      })

      if (!ttsResponse.ok) {
        console.error('[PRACTICE-TTS] ❌ TTS API failed:', ttsResponse.status);
        const errorText = await ttsResponse.text()
        console.error('[PRACTICE-TTS] Error details:', errorText)
        setIsSpeaking(false);
        return;
      }

      const ttsData = await ttsResponse.json()
      const audioBlob = base64ToBlob(ttsData.audio, 'audio/mp3')
      const audioUrl = URL.createObjectURL(audioBlob)

      console.log('[PRACTICE-TTS] Audio blob created, size:', audioBlob.size, 'bytes');

      if (audioRef.current) {
        // 🔥 Limpiar eventos anteriores
        audioRef.current.onloadedmetadata = null;
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.onpause = null;

        audioRef.current.src = audioUrl
        
        audioRef.current.onloadedmetadata = () => {
          const duration = audioRef.current?.duration || 0;
          console.log('[PRACTICE-TTS] ✅ Audio loaded, duration:', duration.toFixed(2), 'seconds');
        };

        audioRef.current.onplay = () => {
          console.log('[PRACTICE-TTS] ✅ Audio PLAY event fired');
        };
        
        // 🔥 PASO 2: Solo cambiar isSpeaking cuando el audio TERMINA
        audioRef.current.onended = () => {
          console.log('[PRACTICE-TTS] ✅ Audio ENDED - setting isSpeaking = FALSE');
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.onerror = (e) => {
          console.error('[PRACTICE-TTS] ❌ Audio ERROR:', e);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        // NO manejar onpause - solo onended
        
        await audioRef.current.play();
        console.log('[PRACTICE-TTS] Play command sent');
      }
    } catch (error) {
      console.error('[PRACTICE-TTS] ❌ Exception:', error)
      setIsSpeaking(false)
    }
  }

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  if (isLoadingContext) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-white">Cargando información de la vacante...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/training/dashboard')}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Image
                src="/logo.png"
                alt="Scout AI"
                width={100}
                height={63}
                className="h-10 w-auto"
              />
              <span className="text-white font-semibold">Practice Mode</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user?.full_name}</p>
                <p className="text-xs text-gray-400">Practicing: {jobContext?.title}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="bg-red-600 text-white hover:bg-red-700 border-none"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!hasStarted ? (
          // Pre-Practice Instructions
          <Card className="bg-gray-900 border-gray-700 p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Briefcase className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-3">
                Práctica de Entrevista
              </h1>
              <p className="text-lg text-gray-300">
                Prepárate para el puesto de {jobContext?.title}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-3">🎯 Vacante:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><strong>Puesto:</strong> {jobContext?.title}</li>
                  <li><strong>Departamento:</strong> {jobContext?.department}</li>
                  <li><strong>Ubicación:</strong> {jobContext?.location}</li>
                  <li><strong>Tipo:</strong> {jobContext?.employment_type}</li>
                </ul>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-3">📋 Requisitos Principales:</h3>
                <p className="text-gray-300 text-sm whitespace-pre-line">
                  {jobContext?.requirements}
                </p>
              </div>

              <div className="bg-gray-800 border border-yellow-700 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-400 mb-3">💡 Esta es tu práctica:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• El entrevistador conoce tu CV y experiencia</li>
                  <li>• Las preguntas serán específicas para {jobContext?.title}</li>
                  <li>• Recibirás feedback constructivo</li>
                  <li>• Practica tantas veces como necesites</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={startPractice}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              🎯 Comenzar Práctica
            </Button>
          </Card>
        ) : (
          // Practice Session
          <div className="space-y-6">
            {/* Job Header */}
            <Card className="bg-white border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{jobContext?.title}</h2>
                    <p className="text-sm text-gray-500">{jobContext?.department} · {jobContext?.location}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Practice Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avatar + Voice Recorder */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-gray-200 p-6">
                  <AvatarDisplay 
                    isSpeaking={isSpeaking} 
                    token={token!}
                    currentText={currentAIText}
                  />
                  
                  <div className="mt-4">
                    <VoiceRecorder
                      onTranscriptReady={handleVoiceInput}
                      isProcessing={isProcessing || isSpeaking}
                    />
                  </div>

                  {currentTranscript && (
                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-blue-600 font-semibold text-sm">YOU SAID:</span>
                      </div>
                      <p className="text-gray-900 font-medium">{currentTranscript}</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Tips Card */}
                <Card className="bg-white border-gray-200 p-6">
                  <h3 className="text-gray-900 font-bold text-lg mb-4">💡 Tips</h3>
                  <ul className="text-gray-600 text-sm space-y-3">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">→</span>
                      <span>Menciona experiencia relevante de tu CV</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">→</span>
                      <span>Relaciona tus respuestas con los requisitos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">→</span>
                      <span>Da ejemplos específicos (método STAR)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">→</span>
                      <span>Sé profesional y auténtico</span>
                    </li>
                  </ul>
                </Card>

                {/* Conversation History */}
                <Card className="bg-white border-gray-200 p-6">
                  <button
                    onClick={() => setShowConversation(!showConversation)}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h3 className="text-gray-900 font-bold text-lg">💬 Conversation</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-semibold">
                        {conversation.length}
                      </span>
                      {showConversation ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  {showConversation && (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {conversation.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg text-sm ${
                            msg.role === 'user'
                              ? 'bg-blue-50 border-l-4 border-blue-500'
                              : 'bg-gray-50 border-l-4 border-gray-400'
                          }`}
                        >
                          <span className={`text-xs font-bold ${
                            msg.role === 'user' ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {msg.role === 'user' ? 'YOU' : 'INTERVIEWER'}
                          </span>
                          <p className="text-gray-800 text-xs mt-1">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}

export default function JobPracticePage() {
  return (
    <AuthGuard>
      <JobPracticeContent />
    </AuthGuard>
  )
}