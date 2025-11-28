"use client"

import { useState, useRef } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceRecorder } from "@/components/training/VoiceRecorder"
import { AvatarDisplay } from "@/components/training/AvatarDisplay"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { practiceScenarios, type PracticeScenario } from "@/lib/training/practice-scenarios"

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function PracticeModeContent() {
  const { token, user, logout } = useAuth()
  const router = useRouter()
  
  const [selectedScenario, setSelectedScenario] = useState<PracticeScenario | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [currentAIText, setCurrentAIText] = useState("")
  const [showConversation, setShowConversation] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleScenarioSelect = async (scenario: PracticeScenario) => {
    setSelectedScenario(scenario)
    setConversation([])
    
    const initialMessage: ConversationMessage = {
      role: 'assistant',
      content: scenario.initialGreeting,
      timestamp: new Date()
    }
    setConversation([initialMessage])

    // Establecer texto para display
    setCurrentAIText(scenario.initialGreeting)

    // 🔥 Reproducir saludo inicial
    await speakTextFallback(scenario.initialGreeting)
  }

  const handleVoiceInput = async (transcript: string) => {
    if (!selectedScenario) return

    console.log('[PRACTICE] ========== NEW USER INPUT ==========')
    console.log('[PRACTICE] Voice input:', transcript)
    
    setCurrentTranscript(transcript)
    setIsProcessing(true)

    const userMessage: ConversationMessage = {
      role: 'user',
      content: transcript,
      timestamp: new Date()
    }
    setConversation(prev => [...prev, userMessage])

    try {
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
          scenarioId: selectedScenario.id
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

      // Establecer texto para display
      setCurrentAIText(aiResponse)

      // 🔥 CRUCIAL: Solo reproducir audio, que controlará isSpeaking
      await speakTextFallback(aiResponse)

    } catch (error) {
      console.error('[PRACTICE] Error:', error)
      alert('Error processing your voice. Please try again.')
      setIsSpeaking(false)
    } finally {
      setIsProcessing(false)
      setCurrentTranscript("")
    }
  }

  // 🔊 Audio TTS - ESTE controla completamente isSpeaking
  const speakTextFallback = async (text: string) => {
    try {
      console.log('[PRACTICE-TTS] ========== STARTING NEW TTS ==========');
      console.log('[PRACTICE-TTS] Text length:', text.length, 'characters');
      
      // 🔥 PASO 1: Marcar que está hablando ANTES de generar audio
      setIsSpeaking(true);
      console.log('[PRACTICE-TTS] ✅ isSpeaking = TRUE (before generating audio)');
      
      // Generar audio TTS
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

  const resetScenario = () => {
    // 🔥 Detener audio si está reproduciéndose
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    
    setSelectedScenario(null)
    setConversation([])
    setCurrentTranscript("")
    setCurrentAIText("")
    setIsSpeaking(false)
    setIsProcessing(false)
    setShowConversation(false)
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
                onClick={() => router.back()}
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
              <span className="text-white font-semibold">Practice Mode</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user?.full_name}</p>
                <p className="text-xs text-gray-400">Voice Training</p>
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
        {!selectedScenario ? (
          // Scenario Selection
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">
                Choose Your Practice Scenario
              </h1>
              <p className="text-lg text-gray-400">
                Select the type of customer you want to practice with
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {practiceScenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className="bg-white border-2 border-gray-200 hover:border-red-500 transition-all cursor-pointer p-6"
                  onClick={() => handleScenarioSelect(scenario)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-5xl">{scenario.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{scenario.name}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          scenario.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          scenario.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          scenario.difficulty === 'Hard' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {scenario.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{scenario.description}</p>
                      <div className="space-y-1">
                        {scenario.traits.map((trait, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-500">
                            <span className="text-red-500 mr-2">•</span>
                            {trait}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Practice Session
          <div className="space-y-6">
            {/* Scenario Header */}
            <Card className="bg-white border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedScenario.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedScenario.name}</h2>
                    <p className="text-sm text-gray-500">{selectedScenario.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={resetScenario}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Change Scenario
                </Button>
              </div>
            </Card>

            {/* Main Practice Area */}
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
                      isProcessing={isProcessing || isSpeaking}
                    />
                  </div>

                  {/* Current Transcript Display */}
                  {currentTranscript && (
                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-blue-600 font-semibold text-sm">YOU SAID:</span>
                        <span className="text-xs text-blue-500">Processing...</span>
                      </div>
                      <p className="text-gray-900 font-medium">{currentTranscript}</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Sidebar - Tips + Conversation History */}
              <div className="lg:col-span-1 space-y-6">
                {/* Practice Tips Card */}
                <Card className="bg-white border-gray-200 p-6">
                  <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center">
                    💡 Practice Tips
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-3">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Introduce yourself professionally</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Explain the free inspection offer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Listen to their concerns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Build trust through communication</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 font-bold">→</span>
                      <span>Stay patient and professional</span>
                    </li>
                  </ul>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Difficulty:</span>
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        selectedScenario.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        selectedScenario.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        selectedScenario.difficulty === 'Hard' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedScenario.difficulty}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Conversation History Card - Mismo estilo que Tips */}
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
                              ? 'bg-blue-50 border-l-4 border-blue-500'
                              : 'bg-gray-50 border-l-4 border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${
                              msg.role === 'user' ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {msg.role === 'user' ? 'YOU' : 'AI'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {msg.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
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

      {/* Audio element (hidden) */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}

export default function PracticeModePage() {
  return (
    <AuthGuard>
      <PracticeModeContent />
    </AuthGuard>
  )
}