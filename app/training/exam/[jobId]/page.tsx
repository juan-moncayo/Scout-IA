"use client"

import { useState, useRef, useEffect } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceRecorder } from "@/components/training/VoiceRecorder"
import { AvatarDisplay } from "@/components/training/AvatarDisplay"
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Loader2, Briefcase } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
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

interface ExamResults {
  confidence: number
  clarity: number
  professionalism: number
  trust_building: number
  overall: number
  passed: boolean
  feedback: string
}

function JobExamContent() {
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
  const [exchangeCount, setExchangeCount] = useState(0)
  const [examResults, setExamResults] = useState<ExamResults | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [currentAIText, setCurrentAIText] = useState("")
  const [showConversation, setShowConversation] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Cargar contexto de vacante y candidato
  useEffect(() => {
    if (jobId && token) {
      fetchJobContext()
    }
  }, [jobId, token])

  const fetchJobContext = async () => {
    setIsLoadingContext(true)
    try {
      console.log('[EXAM] Fetching context for job:', jobId)
      const response = await fetch(`/api/training/job-context/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[EXAM] Context loaded:', data)
        setJobContext(data.job)
        setCandidateContext(data.candidate)
      } else {
        console.error('[EXAM] Failed to load context:', response.status)
        alert('Error loading job information')
        router.push('/training/dashboard')
      }
    } catch (error) {
      console.error('[EXAM] Error fetching context:', error)
      alert('Error loading job information')
      router.push('/training/dashboard')
    } finally {
      setIsLoadingContext(false)
    }
  }

  const startExam = async () => {
    if (!jobContext || !candidateContext) return

    setHasStarted(true)
    
    // 🔥 Saludo personalizado como gerente del departamento
    const initialMessage = `Buenos días ${candidateContext.full_name}, soy el gerente de ${jobContext.department}. Hemos revisado tu aplicación para el puesto de ${jobContext.title} y me gustaría hacerte algunas preguntas sobre tu experiencia. ¿Estás listo para comenzar?`
    
    const msg: ConversationMessage = {
      role: 'assistant',
      content: initialMessage
    }
    
    setConversation([msg])
    setCurrentAIText(initialMessage)
    
    await speakText(initialMessage)
  }

  const handleVoiceInput = async (transcript: string) => {
    if (!jobContext || !candidateContext) return

    setIsProcessing(true)

    const userMessage: ConversationMessage = {
      role: 'user',
      content: transcript
    }
    setConversation(prev => [...prev, userMessage])

    const newExchangeCount = exchangeCount + 1
    setExchangeCount(newExchangeCount)

    try {
      const isLastExchange = newExchangeCount >= 6

      // 🔥 PROMPT PERSONALIZADO de EXAMEN según la vacante
      const customSystemPrompt = generateExamPrompt(jobContext, candidateContext, isLastExchange)

      const chatResponse = await fetch('/api/training/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: transcript,
          conversationHistory: conversation,
          systemPrompt: customSystemPrompt
        })
      })

      if (!chatResponse.ok) throw new Error('Failed to get AI response')

      const chatData = await chatResponse.json()
      const aiResponse = chatData.response

      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: aiResponse
      }
      setConversation(prev => [...prev, assistantMessage])

      setCurrentAIText(aiResponse)

      if (isLastExchange) {
        await evaluateExam(transcript, aiResponse)
      } else {
        await speakText(aiResponse)
      }

    } catch (error) {
      console.error('[EXAM] Error:', error)
      alert('Error processing exam. Please try again.')
      setIsSpeaking(false)
    } finally {
      setIsProcessing(false)
    }
  }

  // 🔥 Generar prompt personalizado para EXAMEN
  const generateExamPrompt = (job: JobContext, candidate: CandidateContext, isFinal: boolean): string => {
    let prompt = `Eres un evaluador senior realizando el EXAMEN FINAL para el puesto de "${job.title}".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VACANTE A EVALUAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Puesto: ${job.title}
Departamento: ${job.department}
Ubicación: ${job.location}

REQUISITOS QUE DEBE CUMPLIR:
${job.requirements}

RESPONSABILIDADES QUE TENDRÁ:
${job.responsibilities}

${job.interview_guidelines ? `CRITERIOS DE EVALUACIÓN (MUY IMPORTANTE):
${job.interview_guidelines}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CANDIDATO: ${candidate.full_name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERFIL DEL CANDIDATO:
${candidate.resume_text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INSTRUCCIONES DEL EXAMEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TU ROL: Eres el GERENTE DE CONTRATACIÓN EXIGENTE para ${job.title}.

COMPORTAMIENTO ESTRICTO:
- Sé profesional pero MUY EXIGENTE y crítico
- Haz preguntas DIFÍCILES Y TÉCNICAS específicas a "${job.title}"
- NO aceptes respuestas vagas o generales
- Cuestiona CADA afirmación que haga el candidato
- Busca inconsistencias entre su CV y sus respuestas
- Presenta situaciones COMPLEJAS y problemáticas del día a día
- Si no responde bien, presiona más duramente

🚫 NUNCA HAGAS ESTO:
- NO pidas links, URLs, portafolios online, o sitios web
- NO pidas que envíe archivos, documentos o materiales
- NO digas "envíame tu portafolio" o "comparte el link"
- NO seas amable o complaciente

✅ EN SU LUGAR, HAZ ESTO:
- "Descríbeme EN DETALLE un proyecto específico donde usaste [tecnología]"
- "Explícame PASO A PASO cómo resolverías [problema técnico complejo]"
- "Dame un ejemplo CONCRETO con números y resultados de [logro que mencionas]"
- "¿Cómo justificas que NO tienes [requisito clave] en tu CV?"

DURANTE EL EXAMEN (6 intercambios DIFÍCILES):
1. Pregunta técnica específica sobre gaps en su CV vs requisitos
2. Presenta un escenario COMPLEJO con múltiples problemas
3. Cuestiona su respuesta: "¿Por qué elegirías eso en lugar de [alternativa]?"
4. Pregunta sobre un fracaso: "Háblame de un proyecto que FALLÓ"
5. Presiona sobre responsabilidades: "¿Cómo manejarías [situación estresante]?"
6. Concluye profesionalmente pero sin comprometerte: "Gracias, ${candidate.full_name}. Tenemos otros candidatos por entrevistar. Te contactaremos."

NIVEL DE DIFICULTAD:
- Preguntas técnicas específicas (no generales)
- Escenarios con dilemas o problemas sin solución obvia
- Presión sobre experiencia faltante
- Pide ejemplos con NÚMEROS y MÉTRICAS
- Cuestiona TODO lo que no esté respaldado
- Si responde mal, señálalo directamente: "Esa no es la respuesta que esperaba..."

IMPORTANTE:
- Este es un EXAMEN REAL - sé exigente
- NO apruebes mental candidatos débiles
- Identifica gaps entre CV y requisitos
- Evalúa si REALMENTE puede hacer el trabajo
- Sé escéptico de afirmaciones sin pruebas`

    if (isFinal) {
      prompt += `

[SISTEMA: Este es el intercambio final (#6). Después de responder naturalmente como gerente, proporciona evaluación en este formato EXACTO:]

EVALUACIÓN:
Confianza: [0-100] - ¿Respondió con seguridad? ¿Manejo bien la presión?
Claridad: [0-100] - ¿Se expresó claramente? ¿Explicaciones coherentes?
Profesionalismo: [0-100] - ¿Comportamiento profesional? ¿Tono apropiado?
Construcción de Confianza: [0-100] - ¿Generó credibilidad? ¿Ejemplos convincentes?

Retroalimentación Detallada:
[Análisis específico de si el candidato demostró que puede realizar el trabajo de "${job.title}" basándote en:
- Los requisitos: ${job.requirements.substring(0, 200)}...
- Las responsabilidades del puesto
- Sus respuestas durante el examen
- Gaps entre su experiencia y lo que requiere el puesto]

CRITERIOS DE PUNTUACIÓN PARA ${job.title}:
- Evalúa contra los requisitos EXACTOS de la vacante
- Considera si su CV demuestra capacidad para las responsabilidades
- Califica duramente si no menciona experiencia relevante
- Da puntos altos solo si demuestra VERDADERA capacidad`
    }

    return prompt
  }

  const evaluateExam = async (fullTranscript: string, aiFeedback: string) => {
    setIsEvaluating(true)

    try {
      const response = await fetch('/api/training/exam/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transcript: fullTranscript,
          aiFeedback,
          jobId: jobContext?.id
        })
      })

      if (!response.ok) throw new Error('Failed to evaluate exam')

      const data = await response.json()
      setExamResults(data)

    } catch (error) {
      console.error('[EXAM] Evaluation error:', error)
      alert('Error evaluating exam. Results not saved.')
    } finally {
      setIsEvaluating(false)
    }
  }

  const speakText = async (text: string) => {
    try {
      console.log('[EXAM-TTS] ========== STARTING TTS ==========');
      console.log('[EXAM-TTS] Text length:', text.length, 'characters');
      
      // 🔥 Marcar que está hablando ANTES de generar audio
      setIsSpeaking(true);
      console.log('[EXAM-TTS] ✅ isSpeaking = TRUE (before generating audio)');
      
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
        console.error('[EXAM-TTS] ❌ TTS API failed:', ttsResponse.status);
        const errorText = await ttsResponse.text()
        console.error('[EXAM-TTS] Error details:', errorText)
        setIsSpeaking(false);
        return;
      }

      const ttsData = await ttsResponse.json()
      const audioBlob = base64ToBlob(ttsData.audio, 'audio/mp3')
      const audioUrl = URL.createObjectURL(audioBlob)

      console.log('[EXAM-TTS] Audio blob created, size:', audioBlob.size, 'bytes');

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
          console.log('[EXAM-TTS] ✅ Audio loaded, duration:', duration.toFixed(2), 'seconds');
        };

        audioRef.current.onplay = () => {
          console.log('[EXAM-TTS] ✅ Audio PLAY event fired');
        };
        
        // 🔥 Solo cambiar isSpeaking cuando el audio TERMINA
        audioRef.current.onended = () => {
          console.log('[EXAM-TTS] ✅ Audio ENDED - setting isSpeaking = FALSE');
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.onerror = (e) => {
          console.error('[EXAM-TTS] ❌ Audio ERROR:', e);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        // NO manejar onpause - solo onended
        
        await audioRef.current.play();
        console.log('[EXAM-TTS] Play command sent');
      }
    } catch (error) {
      console.error('[EXAM-TTS] ❌ Exception:', error)
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

  const ScoreBar = ({ label, value }: { label: string; value: number }) => {
    const getColor = (score: number) => {
      if (score >= 80) return 'bg-green-500'
      if (score >= 70) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="text-sm font-bold text-white">{value}/100</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getColor(value)}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    )
  }

  if (isLoadingContext) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-white">Cargando información del examen...</p>
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
                alt="Talent Scout AI"
                width={100}
                height={63}
                className="h-10 w-auto"
              />
              <span className="text-white font-semibold">Voice Examination</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user?.full_name}</p>
                <p className="text-xs text-gray-400">Exam: {jobContext?.title}</p>
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
          // Pre-Exam Instructions
          <Card className="bg-gray-900 border-gray-700 p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-32 h-32 object-contain"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.5))' }}
                >
                  <source src="/training/RenderMedalla.webm" type="video/webm" />
                </video>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Examen de Voz Personalizado
              </h1>
              <p className="text-lg text-gray-300">
                Demuestra que eres el candidato ideal para {jobContext?.title}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-3">🎯 Puesto a Evaluar:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><strong>Título:</strong> {jobContext?.title}</li>
                  <li><strong>Departamento:</strong> {jobContext?.department}</li>
                  <li><strong>Ubicación:</strong> {jobContext?.location}</li>
                  <li><strong>Tipo:</strong> {jobContext?.employment_type}</li>
                </ul>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-3">📋 Requisitos del Puesto:</h3>
                <p className="text-gray-300 text-sm whitespace-pre-line">
                  {jobContext?.requirements}
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-400 mb-3">📊 Criterios de Evaluación:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong className="text-white">Confianza (70% para aprobar):</strong> Demuestra seguridad y manejo de objeciones</li>
                  <li>• <strong className="text-white">Claridad (70% para aprobar):</strong> Explica sin jerga confusa</li>
                  <li>• <strong className="text-white">Profesionalismo (70% para aprobar):</strong> Tono y comportamiento apropiado</li>
                  <li>• <strong className="text-white">Construcción de Confianza (70% para aprobar):</strong> Establece credibilidad</li>
                </ul>
              </div>

              <div className="bg-gray-800 border border-red-700 rounded-lg p-6">
                <h3 className="font-semibold text-red-400 mb-3">⚠️ Importante:</h3>
                <p className="text-gray-300 text-sm">
                  Necesitas un <strong className="text-white">puntaje general de 70% o superior</strong> para aprobar. 
                  El examen consiste en 6 intercambios. Las preguntas serán específicas para {jobContext?.title} y 
                  basadas en los requisitos reales del puesto. Habla con claridad y profesionalismo.
                </p>
              </div>
            </div>

            <Button
              onClick={startExam}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
            >
              🏆 Comenzar Examen
            </Button>
          </Card>
        ) : examResults ? (
          // Exam Results
          <Card className="bg-gray-900 border-gray-700 p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                examResults.passed ? 'bg-green-900/30' : 'bg-red-900/30'
              }`}>
                {examResults.passed ? (
                  <TrendingUp className="w-12 h-12 text-green-500" />
                ) : (
                  <TrendingDown className="w-12 h-12 text-red-500" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {examResults.passed ? '🎉 Examen Aprobado!' : '❌ No Aprobaste'}
              </h2>
              <p className="text-xl text-gray-300">
                Puntaje General: <span className="font-bold text-white">{examResults.overall}/100</span>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Para: {jobContext?.title}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-white mb-4">Puntajes Detallados:</h3>
                <ScoreBar label="Confianza" value={examResults.confidence} />
                <ScoreBar label="Claridad" value={examResults.clarity} />
                <ScoreBar label="Profesionalismo" value={examResults.professionalism} />
                <ScoreBar label="Construcción de Confianza" value={examResults.trust_building} />
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-3">Retroalimentación:</h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{examResults.feedback}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => router.push('/training/dashboard')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              >
                Volver al Dashboard
              </Button>
              {!examResults.passed && (
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Reintentar Examen
                </Button>
              )}
            </div>
          </Card>
        ) : (
          // Exam in Progress
          <div className="space-y-6">
            {/* Exam Header */}
            <Card className="bg-white border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-6 w-6 text-red-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{jobContext?.title}</h2>
                    <p className="text-sm text-gray-500">Gerente de {jobContext?.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">
                    Intercambio {exchangeCount}/6
                  </p>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${(exchangeCount / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Exam Area */}
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
                      isProcessing={isProcessing || isSpeaking || isEvaluating}
                    />
                  </div>

                  {isEvaluating && (
                    <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-center">
                      <p className="text-yellow-700 font-semibold">
                        ⏳ Evaluando tu desempeño para {jobContext?.title}...
                      </p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Exam Tips */}
                <Card className="bg-white border-gray-200 p-6">
                  <h3 className="text-gray-900 font-bold text-lg mb-4">💡 Tips del Examen</h3>
                  <ul className="text-gray-600 text-sm space-y-3">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Menciona experiencia específica de tu CV</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Relaciona respuestas con los requisitos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Da ejemplos concretos (método STAR)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Mantén el profesionalismo</span>
                    </li>
                  </ul>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Puntaje para Aprobar:</span>
                      <span className="px-3 py-1 rounded-full font-bold bg-green-100 text-green-700">
                        70%
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Conversation History */}
                <Card className="bg-white border-gray-200 p-6">
                  <button
                    onClick={() => setShowConversation(!showConversation)}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h3 className="text-gray-900 font-bold text-lg">💬 Conversación</h3>
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
                              ? 'bg-red-50 border-l-4 border-red-500'
                              : 'bg-gray-50 border-l-4 border-gray-400'
                          }`}
                        >
                          <span className={`text-xs font-bold ${
                            msg.role === 'user' ? 'text-red-700' : 'text-gray-700'
                          }`}>
                            {msg.role === 'user' ? 'TÚ' : 'GERENTE'}
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

export default function JobExamPage() {
  return (
    <AuthGuard>
      <JobExamContent />
    </AuthGuard>
  )
}