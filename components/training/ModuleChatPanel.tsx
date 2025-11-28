"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AvatarDisplay } from "@/components/training/AvatarDisplay"
import { Send, Loader2, MessageCircle, X, ChevronDown, ChevronUp } from "lucide-react"

interface ModuleChatPanelProps {
  token: string
  moduleTitle: string
  currentSectionContent: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ModuleChatPanel({ token, moduleTitle, currentSectionContent }: ModuleChatPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sugerencias contextuales
  const suggestions = [
    "Summarize this in simple terms",
    "Give me a practical example",
    "Why is this important?",
    "What are common mistakes?",
    "How do I apply this?"
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
      const contextPrompt = `You are a helpful roofing training assistant. The trainee just finished reading about: "${moduleTitle}".

Section content summary:
${currentSectionContent.substring(0, 600)}

Trainee's question: ${textToSend}

Provide a clear, concise answer (max 100 words) in a conversational tone. Focus on practical application.`

      const chatResponse = await fetch('/api/training/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: contextPrompt,
          conversationHistory: messages.slice(-3).map(msg => ({
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
      console.error('[CHAT] Error:', error)
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

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        setIsSpeaking(true)
        
        audioRef.current.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }

        await audioRef.current.play()
      }
    } catch (error) {
      console.error('[CHAT] TTS Error:', error)
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
    <div className="w-full bg-white border-t-4 border-blue-600 shadow-lg">
      {/* Header */}
      <div 
        className="bg-blue-600 text-white px-6 py-4 cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold text-lg">Questions about this section?</h3>
            <p className="text-xs text-blue-100">Click to ask the AI assistant</p>
          </div>
        </div>
        {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Avatar and Quick Actions */}
            <div className="flex items-start space-x-6 mb-6">
              <div className="flex-shrink-0">
                <AvatarDisplay isSpeaking={isSpeaking} token={token} />
              </div>
              
              <div className="flex-1">
                <h4 className="text-gray-900 font-semibold mb-3">Quick questions:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      disabled={isProcessing}
                      className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 transition-all text-left disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            {messages.length > 0 && (
              <div className="mb-4 space-y-3 max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            <div className="flex space-x-3">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here..."
                className="flex-1 min-h-[56px] max-h-[120px] resize-none"
                disabled={isProcessing}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isProcessing || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white h-[56px] px-6"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Press Enter to send • Shift+Enter for new line</p>
          </div>
        </div>
      )}

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}