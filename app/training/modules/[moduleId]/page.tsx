"use client"

import { use, useState, useRef } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ModuleContent } from "@/components/training/ModuleContent"
import { CompletionModal } from "@/components/training/CompletionModal"
import { getModuleById } from "@/lib/training/modules"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Volume2, VolumeX, Send, Loader2, Sparkles, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { AvatarDisplay } from "@/components/training/AvatarDisplay"

interface ModulePageProps {
  params: Promise<{
    moduleId: string
  }>
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function ModulePageContent({ moduleId }: { moduleId: string }) {
  const { user, token } = useAuth()
  const router = useRouter()
  const module = getModuleById(moduleId)
  const [currentSection, setCurrentSection] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [isReadingContent, setIsReadingContent] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
  const [examPassed, setExamPassed] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  if (!module) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <Button 
            onClick={() => router.push('/training/dashboard')}
            className="bg-red-600 hover:bg-red-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const hasExam = module.content.some(content => content.type === 'exam')

  const suggestions = [
    "Resume this section",
    "Quiz me on this",
    "Give me a scenario",
    "Explain it simply"
  ]

  const handleNext = () => {
    if (currentSection < module.content.length - 1) {
      // 🔥 Detener audio/video antes de cambiar de sección
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsReadingContent(false)
      setIsSpeaking(false)
      
      setCurrentSection(currentSection + 1)
      setMessages([])
      setShowChat(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      // 🔥 Detener audio/video antes de cambiar de sección
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsReadingContent(false)
      setIsSpeaking(false)
      
      setCurrentSection(currentSection - 1)
      setMessages([])
      setShowChat(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleExamPassed = () => {
    setExamPassed(true)
  }

  const handleComplete = async () => {
    if (hasExam && !examPassed) {
      alert('You must pass the exam with 80% or higher before completing this module.')
      return
    }

    setIsCompleting(true)
    
    try {
      const response = await fetch('/api/training/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleId: module.id,
          phaseNumber: module.phase,
          moduleName: module.title
        })
      })

      if (response.ok) {
        setShowCompletionModal(true)
      } else {
        alert('Module completed locally, but failed to sync with server')
        sessionStorage.setItem('dashboardScrollPosition', '0')
        router.push('/training/dashboard')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
      alert('Module completed! (offline mode)')
      sessionStorage.setItem('dashboardScrollPosition', '0')
      router.push('/training/dashboard')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleCloseModal = () => {
    setShowCompletionModal(false)
    sessionStorage.setItem('dashboardScrollPosition', '0')
    router.push('/training/dashboard')
  }

  const handleReadContent = async () => {
    if (isReadingContent || isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsReadingContent(false)
      setIsSpeaking(false)
      return
    }

    const cleanText = getCurrentSectionText()
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1500)

    if (cleanText.length < 10) {
      console.error('[READ CONTENT] Text too short:', cleanText.length)
      alert('This section doesn\'t have enough text to read aloud.')
      return
    }

    console.log('[MODULE-TTS] ========== STARTING READ CONTENT ==========');
    console.log('[MODULE-TTS] Text length:', cleanText.length, 'characters');

    setIsReadingContent(true)

    try {
      setIsSpeaking(true);
      console.log('[MODULE-TTS] ✅ isSpeaking = TRUE (before generating audio)');

      const ttsResponse = await fetch('/api/training/ai/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: cleanText })
      })

      if (!ttsResponse.ok) {
        console.error('[MODULE-TTS] ❌ TTS API failed:', ttsResponse.status);
        setIsReadingContent(false)
        setIsSpeaking(false);
        alert('Text-to-speech error. Please try again.')
        return
      }

      const ttsData = await ttsResponse.json()
      const audioBlob = base64ToBlob(ttsData.audio, 'audio/mp3')
      const audioUrl = URL.createObjectURL(audioBlob)

      console.log('[MODULE-TTS] Audio blob created, size:', audioBlob.size, 'bytes');

      if (audioRef.current) {
        audioRef.current.onloadedmetadata = null;
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.onpause = null;

        audioRef.current.src = audioUrl
        
        audioRef.current.onloadedmetadata = () => {
          const duration = audioRef.current?.duration || 0;
          console.log('[MODULE-TTS] ✅ Audio loaded, duration:', duration.toFixed(2), 'seconds');
        };

        audioRef.current.onplay = () => {
          console.log('[MODULE-TTS] ✅ Audio PLAY event fired');
        };
        
        audioRef.current.onended = () => {
          console.log('[MODULE-TTS] ✅ Audio ENDED - stopping');
          setIsReadingContent(false);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.onerror = (e) => {
          console.error('[MODULE-TTS] ❌ Audio ERROR:', e);
          setIsReadingContent(false);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audioRef.current.play();
        console.log('[MODULE-TTS] Play command sent');
      }
    } catch (error) {
      console.error('[MODULE-TTS] ❌ Exception:', error)
      setIsReadingContent(false)
      setIsSpeaking(false)
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim()
    if (!textToSend || isProcessing) return

    setShowChat(true)
    setInputMessage("")
    setIsProcessing(true)

    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const sectionContent = getCurrentSectionText().substring(0, 800)
      
      const contextualizedMessage = `You are helping a trainee with their roofing training.

Current Training Context:
- Phase: ${module.phase}
- Module: "${module.title}"
- Section: ${currentSection + 1} of ${module.content.length}
- Section Title: "${module.content[currentSection].title || 'Untitled'}"

Section Content (excerpt):
${sectionContent}

---

Trainee's Question: ${textToSend}

Please provide a clear, helpful answer that relates directly to this specific section. Keep your response concise (max 100 words) and practical.`

      const chatResponse = await fetch('/api/training/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: contextualizedMessage,
          conversationHistory: messages.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (!chatResponse.ok) {
        throw new Error('Chat request failed')
      }

      const chatData = await chatResponse.json()
      const assistantText = chatData.response

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantText
      }
      setMessages(prev => [...prev, assistantMessage])

      console.log('[MODULE-CHAT-TTS] ========== STARTING CHAT TTS ==========');
      setIsSpeaking(true);

      const ttsResponse = await fetch('/api/training/ai/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: assistantText })
      })

      if (ttsResponse.ok) {
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
            console.log('[MODULE-CHAT-TTS] Audio loaded');
          };

          audioRef.current.onplay = () => {
            console.log('[MODULE-CHAT-TTS] Audio started');
          };
          
          audioRef.current.onended = () => {
            console.log('[MODULE-CHAT-TTS] Audio ended');
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };

          audioRef.current.onerror = (e) => {
            console.error('[MODULE-CHAT-TTS] Audio error:', e);
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };

          await audioRef.current.play();
        }
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('[MODULE-CHAT] Error:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false)
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleResetChat = () => {
    setMessages([])
    setShowChat(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsSpeaking(false)
  }

  const getCurrentSectionText = () => {
    const content = module.content[currentSection]
    let textParts: string[] = []

    if (content.title) {
      textParts.push(content.title)
    }

    switch (content.type) {
      case 'text':
        if (content.text) {
          textParts.push(content.text)
        }
        break

      case 'text-image':
        if (content.text) {
          textParts.push(content.text)
        }
        if (content.items && content.items.length > 0) {
          const itemsText = content.items
            .filter(item => item && item.trim())
            .join('. ')
          textParts.push(itemsText)
        }
        break

      case 'checklist':
        if (content.items && content.items.length > 0) {
          const checklistText = content.items
            .filter(item => item && item.trim())
            .join('. ')
          textParts.push(checklistText)
        }
        break

      case 'warning':
        if (content.text) {
          textParts.push(content.text)
        }
        break

      case 'example':
        if (content.example) {
          if (content.example.scenario) {
            textParts.push(`Scenario: ${content.example.scenario}`)
          }
          if (content.example.correct) {
            textParts.push(`Correct approach: ${content.example.correct}`)
          }
          if (content.example.incorrect) {
            textParts.push(`Incorrect approach: ${content.example.incorrect}`)
          }
        }
        break

      case 'exam':
        if (content.description) {
          textParts.push(content.description)
        }
        textParts.push('This section contains an interactive exam that cannot be read aloud.')
        break

      case 'image':
        if (content.text) {
          textParts.push(content.text)
        }
        if (content.imageAlt) {
          textParts.push(`Image description: ${content.imageAlt}`)
        }
        break

      default:
        if (content.text) {
          textParts.push(content.text)
        }
    }

    if (textParts.length === 0) {
      textParts.push(module.title)
      textParts.push(module.description)
    }

    const finalText = textParts.join(' ').trim()

    console.log('[GET SECTION TEXT] Type:', content.type, 'Length:', finalText.length)

    return finalText
  }

  function base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64)
    const byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    return new Blob(byteArrays, { type: contentType })
  }

  const progress = ((currentSection + 1) / module.content.length) * 100

  const canShowCompleteButton = !hasExam || examPassed

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-900 border-b border-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  sessionStorage.setItem('dashboardScrollPosition', '0')
                  router.push('/training/dashboard')
                }}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReadContent}
                disabled={isProcessing}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {isReadingContent || isSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    Stop Reading
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Read Aloud
                  </>
                )}
              </Button>
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user?.full_name}</p>
                <p className="text-xs text-gray-400">Phase {module.phase}</p>
              </div>
            </div>
          </div>

          <div className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 font-medium">
                Section {currentSection + 1} of {module.content.length}
              </span>
              <span className="text-sm text-gray-300 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-white text-sm font-semibold mb-2">
                <span>Phase {module.phase}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {module.duration}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{module.title}</h1>
              <p className="text-base text-gray-300">{module.description}</p>
            </div>

            <Card className="bg-white border-gray-200 shadow-lg p-6 mb-4">
              <ModuleContent 
                content={module.content[currentSection]} 
                onExamPassed={handleExamPassed}
              />
            </Card>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 0}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentSection < module.content.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Next Section
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                canShowCompleteButton ? (
                  <Button
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isCompleting ? 'Saving...' : 'Complete'}
                  </Button>
                ) : (
                  <div className="text-right">
                    <p className="text-sm text-red-600 font-semibold">🔒 Complete the exam to unlock</p>
                    <p className="text-xs text-gray-500">Pass the exam with 80% or higher</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <Card className="bg-gray-900 border border-gray-700 shadow-md">
                <div className="bg-gray-900 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-semibold text-sm">AI Coach</span>
                  </div>
                  {showChat && (
                    <button
                      onClick={handleResetChat}
                      className="text-white hover:text-gray-300 transition-colors"
                      title="Reset chat"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="px-4 py-3 bg-gray-900 border-b border-gray-700" style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ 
                    width: '120%', 
                    height: '850px', 
                    position: 'absolute', 
                    top: '10px',
                    left: '-10%', 
                    transform: 'scale(0.6)', 
                    transformOrigin: 'center top' 
                  }}>
                    <AvatarDisplay isSpeaking={isSpeaking} token={token!} currentText="" />
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-900 border-b border-gray-700">
                  <p className="text-sm font-semibold text-white">Hello, {user?.full_name?.split(' ')[0]}!</p>
                  <p className="text-xs text-gray-400 mt-1">How can I help you?</p>
                </div>

                {!showChat ? (
                  <div className="px-4 py-3 bg-gray-900 border-b border-gray-700 h-[240px] flex flex-col justify-center">
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          disabled={isProcessing}
                          className="w-full text-left text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-700 transition-all disabled:opacity-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[240px] overflow-y-auto px-4 py-3 bg-gray-900 border-b border-gray-700">
                    <div className="space-y-2">
                      {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[90%] rounded-lg px-3 py-2 text-xs ${
                            msg.role === 'user' ? 'bg-red-600 text-white' : 'bg-gray-800 border border-gray-700 text-gray-200'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                )}

                <div className="px-4 py-3 bg-gray-900 rounded-b-lg">
                  <div className="flex space-x-2">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Ask me anything"
                      className="flex-1 min-h-[38px] max-h-[60px] resize-none text-xs bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={isProcessing || !inputMessage.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white h-[38px] px-3"
                    >
                      {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={handleCloseModal}
        moduleName={module.title}
        phaseNumber={module.phase}
      />

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}

export default function ModulePage({ params }: ModulePageProps) {
  const resolvedParams = use(params)
  
  return (
    <AuthGuard>
      <ModulePageContent moduleId={resolvedParams.moduleId} />
    </AuthGuard>
  )
}