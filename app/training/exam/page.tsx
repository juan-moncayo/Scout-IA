"use client"

import { useState, useRef } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceRecorder } from "@/components/training/VoiceRecorder"
import { AvatarDisplay } from "@/components/training/AvatarDisplay"
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { VOICE_EXAM_SYSTEM_PROMPT } from "@/lib/ai/prompts"

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
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

function VoiceExamContent() {
  const { token, user, logout } = useAuth()
  const router = useRouter()
  
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

  const startExam = async () => {
    setHasStarted(true)
    
    const initialMessage = "Yes? Can I help you? I see you have a clipboard. Are you selling something?"
    
    const msg: ConversationMessage = {
      role: 'assistant',
      content: initialMessage
    }
    
    setConversation([msg])
    setCurrentAIText(initialMessage)
    
    await speakText(initialMessage)
  }

  const handleVoiceInput = async (transcript: string) => {
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

      let promptAddition = ''
      if (isLastExchange) {
        promptAddition = '\n\n[SYSTEM: This is the final exchange. After responding naturally as Mrs. Johnson, conclude the conversation naturally (e.g., "Let me think about it..."), then provide your evaluation scores in the exact format specified.]'
      }

      const chatResponse = await fetch('/api/training/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: transcript + promptAddition,
          conversationHistory: conversation,
          systemPrompt: VOICE_EXAM_SYSTEM_PROMPT
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
          aiFeedback
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
      setIsSpeaking(true);
      
      const ttsResponse = await fetch('/api/training/ai/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      })

      if (!ttsResponse.ok) {
        console.error('[EXAM-TTS] TTS failed');
        setIsSpeaking(false);
        return;
      }

      const ttsData = await ttsResponse.json()
      const audioBlob = base64ToBlob(ttsData.audio, 'audio/mp3')
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.onloadedmetadata = null;
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;

        audioRef.current.src = audioUrl
        
        audioRef.current.onloadedmetadata = () => {
          const duration = audioRef.current?.duration || 0;
          console.log('[EXAM-TTS] Audio loaded, duration:', duration.toFixed(2), 'seconds');
        };

        audioRef.current.onplay = () => {
          console.log('[EXAM-TTS] Audio started playing');
        };
        
        audioRef.current.onended = () => {
          console.log('[EXAM-TTS] Audio ended');
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.onerror = (e) => {
          console.error('[EXAM-TTS] Audio error:', e);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audioRef.current.play();
      }
    } catch (error) {
      console.error('[EXAM-TTS] Exception:', error)
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
                alt="Scout IA"
                width={100}
                height={63}
                className="h-10 w-auto"
              />
              <span className="text-white font-semibold">Voice Examination</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user?.full_name}</p>
                <p className="text-xs text-gray-400">Final Exam</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 rounded-md border-none"
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
              {/* 🏅 Video de Medalla Animada */}
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
                Phase 3 Voice Examination
              </h1>
              <p className="text-lg text-gray-300">
                Demonstrate your roofing sales skills with a realistic customer interaction
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-3">🎯 Your Role:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• You are a roofing sales representative for X Roofing & Solar</li>
                  <li>• You are going door-to-door after a recent hailstorm</li>
                  <li>• You will knock on Mrs. Johnson's door and introduce yourself</li>
                  <li>• Your goal: Inspect her roof and help her file an insurance claim</li>
                </ul>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-3">👤 The Customer:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Mrs. Johnson is a homeowner in Dallas</li>
                  <li>• She's somewhat skeptical of door-to-door salespeople</li>
                  <li>• She's concerned about her roof but needs to be convinced</li>
                  <li>• She will ask realistic questions and may have objections</li>
                </ul>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-400 mb-3">📊 Evaluation Criteria:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong className="text-white">Confidence (70% to pass):</strong> Speak with authority and handle objections well</li>
                  <li>• <strong className="text-white">Clarity (70% to pass):</strong> Explain things clearly without confusing jargon</li>
                  <li>• <strong className="text-white">Professionalism (70% to pass):</strong> Maintain professional demeanor and tone</li>
                  <li>• <strong className="text-white">Trust Building (70% to pass):</strong> Establish credibility and be honest</li>
                </ul>
              </div>

              <div className="bg-gray-800 border border-red-700 rounded-lg p-6">
                <h3 className="font-semibold text-red-400 mb-3">⚠️ Important:</h3>
                <p className="text-gray-300 text-sm">
                  You need an <strong className="text-white">overall score of 70% or higher</strong> to pass this exam. The exam consists of 6 voice exchanges. Speak clearly, professionally, and use what you've learned in your training.
                </p>
              </div>
            </div>

            <Button
              onClick={startExam}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
            >
              🚪 Knock on Mrs. Johnson's Door
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
                {examResults.passed ? '🎉 Exam Passed!' : '❌ Exam Not Passed'}
              </h2>
              <p className="text-xl text-gray-300">
                Overall Score: <span className="font-bold text-white">{examResults.overall}/100</span>
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-white mb-4">Detailed Scores:</h3>
                <ScoreBar label="Confidence" value={examResults.confidence} />
                <ScoreBar label="Clarity" value={examResults.clarity} />
                <ScoreBar label="Professionalism" value={examResults.professionalism} />
                <ScoreBar label="Trust Building" value={examResults.trust_building} />
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-3">Feedback:</h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{examResults.feedback}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => router.push('/training/dashboard')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              >
                Back to Dashboard
              </Button>
              {!examResults.passed && (
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Retake Exam
                </Button>
              )}
            </div>
          </Card>
        ) : (
          // Exam in Progress - NUEVO LAYOUT MEJORADO
          <div className="space-y-6">
            {/* Exam Header */}
            <Card className="bg-white border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">👩</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Mrs. Johnson</h2>
                    <p className="text-sm text-gray-500">Homeowner - Dallas, TX</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">
                    Exchange {exchangeCount}/6
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
              {/* Avatar + Voice Recorder Section */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-gray-200 p-6">
                  {/* Avatar Display */}
                  <AvatarDisplay 
                    isSpeaking={isSpeaking} 
                    token={token!}
                    currentText={currentAIText}
                  />
                  
                  {/* Voice Recorder - Debajo del avatar */}
                  <div className="mt-4">
                    <VoiceRecorder
                      onTranscriptReady={handleVoiceInput}
                      isProcessing={isProcessing || isSpeaking || isEvaluating}
                    />
                  </div>

                  {/* Evaluating Message */}
                  {isEvaluating && (
                    <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-center">
                      <p className="text-yellow-700 font-semibold">
                        ⏳ Evaluating your performance...
                      </p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Sidebar - Tips + Conversation History */}
              <div className="lg:col-span-1 space-y-6">
                {/* Exam Tips Card */}
                <Card className="bg-white border-gray-200 p-6">
                  <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center">
                    💡 Exam Tips
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-3">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Introduce yourself professionally</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Mention the recent hailstorm</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Build trust and be transparent</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Explain insurance process clearly</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Handle objections professionally</span>
                    </li>
                  </ul>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Passing Score:</span>
                      <span className="px-3 py-1 rounded-full font-bold bg-green-100 text-green-700">
                        70%
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Conversation History Card */}
                <Card className="bg-white border-gray-200 p-6">
                  <button
                    onClick={() => setShowConversation(!showConversation)}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h3 className="text-gray-900 font-bold text-lg flex items-center">
                      💬 Conversation
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-semibold">
                        {conversation.length}
                      </span>
                      {showConversation ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
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
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${
                              msg.role === 'user' ? 'text-red-700' : 'text-gray-700'
                            }`}>
                              {msg.role === 'user' ? 'YOU' : 'MRS. JOHNSON'}
                            </span>
                          </div>
                          <p className="text-gray-800 text-xs leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {!showConversation && (
                    <p className="text-xs text-gray-400 text-center italic">
                      Click to view conversation history
                    </p>
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

export default function VoiceExamPage() {
  return (
    <AuthGuard>
      <VoiceExamContent />
    </AuthGuard>
  )
}
