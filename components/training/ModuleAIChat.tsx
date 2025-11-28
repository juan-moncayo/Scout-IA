"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AvatarDisplay } from "@/components/training/AvatarDisplay"
import { Send, Loader2, Volume2, VolumeX, BookOpen, Sparkles } from "lucide-react"

interface ModuleAIChatProps {
  token: string
  moduleTitle: string
  moduleContent: any
  currentSectionContent: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ModuleAIChat({ token, moduleTitle, moduleContent, currentSectionContent }: ModuleAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isReadingContent, setIsReadingContent] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getSuggestions = () => {
    return [
      `Summarize this section simply`,
      `Give me a real-world example`,
      `Why is this important on the job?`,
      `What are common mistakes here?`,
      `How do I remember this?`,
      `Quiz me on this topic`
    ]
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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

    setIsReadingContent(true)
    
    const cleanText = currentSectionContent
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1000)

    await speakText(cleanText)
    setIsReadingContent(false)
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim()
    if (!textToSend || isProcessing) return

    setInputMessage("")
    setIsProcessing(true)

    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const contextPrompt = `You are a roofing training assistant helping a trainee understand the module: "${moduleTitle}".

Current section content:
${currentSectionContent.substring(0, 800)}

Trainee's question: ${textToSend}

Provide a clear, concise, and practical answer (max 150 words) that helps them understand and apply this knowledge. Use simple language and relate it to real roofing scenarios.`

      const chatResponse = await fetch('/api/training/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: contextPrompt,
          conversationHistory: messages.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (!chatResponse.ok) throw new Error('Failed to get AI response')

      const chatData = await chatResponse.json()
      const aiResponse = chatData.response

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])

      await speakText(aiResponse)

    } catch (error) {
      console.error('[MODULE CHAT] Error:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const speakText = async (text: string) => {
    try {
      console.log('[TTS] ========== STARTING NEW TTS ==========');
      console.log('[TTS] Text to speak:', text.substring(0, 50) + '...');
      
      const ttsResponse = await fetch('/api/training/ai/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      })

      if (!ttsResponse.ok) throw new Error('Failed to generate speech')

      const ttsData = await ttsResponse.json()
      const audioBlob = base64ToBlob(ttsData.audio, 'audio/mp3')
      const audioUrl = URL.createObjectURL(audioBlob)

      console.log('[TTS] Audio blob created, size:', audioBlob.size, 'bytes');

      if (audioRef.current) {
        // Limpiar eventos anteriores
        audioRef.current.onloadedmetadata = null;
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.onpause = null;
        audioRef.current.ontimeupdate = null;

        audioRef.current.src = audioUrl
        
        audioRef.current.onloadedmetadata = () => {
          const duration = audioRef.current?.duration || 0;
          console.log('[TTS] ✅ Audio loaded, duration:', duration.toFixed(2), 'seconds');
        };

        audioRef.current.onplay = () => {
          console.log('[TTS] ✅ Audio PLAY event - setting isSpeaking = TRUE');
          setIsSpeaking(true);
        };

        audioRef.current.ontimeupdate = () => {
          const current = audioRef.current?.currentTime || 0;
          const duration = audioRef.current?.duration || 0;
          if (Math.floor(current) % 5 === 0 && current > 0) {
            console.log('[TTS] 🎵 Playing:', current.toFixed(1), '/', duration.toFixed(1), 'seconds');
          }
        };
        
        audioRef.current.onended = () => {
          console.log('[TTS] ✅ Audio ENDED event - setting isSpeaking = FALSE');
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.onpause = () => {
          const current = audioRef.current?.currentTime || 0;
          const duration = audioRef.current?.duration || 0;
          console.log('[TTS] ⚠️ Audio PAUSED at', current.toFixed(1), '/', duration.toFixed(1), 'seconds');
          // NO cambiar isSpeaking aquí
        };

        audioRef.current.onerror = (e) => {
          console.error('[TTS] ❌ Audio ERROR:', e);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audioRef.current.play();
        console.log('[TTS] Play command sent');
      }
    } catch (error) {
      console.error('[MODULE CHAT] TTS Error:', error)
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="bg-white border-2 border-gray-200 shadow-lg h-full flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-semibold text-lg">AI Assistant</h3>
        </div>
        <p className="text-xs text-blue-100">Ask me anything about this module</p>
      </div>

      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-center mb-3">
          <div className="scale-90">
            <AvatarDisplay isSpeaking={isSpeaking} token={token} />
          </div>
        </div>
        
        <Button
          onClick={handleReadContent}
          disabled={isProcessing}
          className={`w-full ${
            isReadingContent || isSpeaking
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isReadingContent || isSpeaking ? (
            <>
              <VolumeX className="h-4 w-4 mr-2" />
              Stop Reading
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              Read This Section
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-2">
            <p className="mb-2">👋 Hi! I can help you with:</p>
            <p className="font-semibold text-gray-700 text-xs mb-3">{moduleTitle}</p>
            <p className="text-xs text-gray-400">Try the suggestions below or ask your own question</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2 font-medium">Quick questions:</p>
        <div className="grid grid-cols-2 gap-2">
          {getSuggestions().map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(suggestion)}
              disabled={isProcessing}
              className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-gray-700 px-3 py-2 rounded-lg border border-gray-200 transition-all text-left disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="flex-1 min-h-[50px] max-h-[100px] resize-none text-sm"
            disabled={isProcessing}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isProcessing || !inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white h-[50px] px-4"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>

      <audio ref={audioRef} className="hidden" />
    </Card>
  )
}