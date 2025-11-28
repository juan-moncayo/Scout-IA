"use client"

import React from 'react'
import Image from 'next/image'
import { ModuleContent as ModuleContentType } from '@/lib/training/modules/types'
import { AlertTriangle, CheckSquare, Play } from 'lucide-react'

interface ModuleContentProps {
  content: ModuleContentType
  onExamPassed?: () => void
}

// 🔥 Función helper para convertir **texto** en <strong>texto</strong>
function renderTextWithBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2)
      return <strong key={index} className="font-bold">{boldText}</strong>
    }
    return <span key={index}>{part}</span>
  })
}

export function ModuleContent({ content, onExamPassed }: ModuleContentProps) {
  switch (content.type) {
    case 'text':
      return (
        <div className="space-y-6">
          {content.title && (
            <h3 className="text-3xl font-bold text-black">{content.title}</h3>
          )}
          {content.text && (
            <div className="text-gray-900 leading-relaxed text-lg whitespace-pre-line">
              {content.text.split('\n').map((line, i) => {
                if (!line) return <br key={i} />
                return (
                  <div key={i}>
                    {renderTextWithBold(line)}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )

    case 'image':
      return (
        <div className="space-y-4">
          {content.title && (
            <h3 className="text-3xl font-bold text-black">{content.title}</h3>
          )}
          <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
            <Image
              src={content.image || '/placeholder.jpg'}
              alt={content.imageAlt || 'Module image'}
              fill
              className="object-cover"
            />
          </div>
          {content.text && (
            <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
              {content.text.split('\n').map((line, i) => {
                if (!line) return <br key={i} />
                return (
                  <div key={i}>
                    {renderTextWithBold(line)}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )

    case 'video':
      return (
        <div className="space-y-6">
          {content.title && (
            <h3 className="text-3xl font-bold text-black mb-4">{content.title}</h3>
          )}
          
          {/* Video Player Container */}
          <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-gray-300">
            <div className="relative pb-[56.25%]">
              <video
                key={content.videoUrl}
                controls
                className="absolute top-0 left-0 w-full h-full"
                poster="/training/video-placeholder.jpg"
              >
                <source src={content.videoUrl} type="video/webm" />
                <source src={content.videoUrl?.replace('.webm', '.mp4')} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Video Title Badge */}
          {content.videoTitle && (
            <div className="flex items-center space-x-2 bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-3">
              <Play className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <p className="text-blue-900 font-semibold text-base">{content.videoTitle}</p>
            </div>
          )}

          {/* Text Content Below Video */}
          {content.text && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <div className="text-gray-900 leading-relaxed text-base whitespace-pre-line">
                {content.text.split('\n').map((line, i) => {
                  if (!line) return <br key={i} />
                  return (
                    <div key={i}>
                      {renderTextWithBold(line)}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )

    case 'text-image':
      const imagePosition = content.imagePosition || 'right'
      const imageSize = (content.imageSize || 'medium') as 'small' | 'medium' | 'large'
      const imageStyle = (content.imageStyle || 'square') as 'square' | 'rectangle' | 'circle'
      
      const imageSizeClasses: Record<'small' | 'medium' | 'large', string> = {
        small: 'w-64 h-64',
        medium: 'w-80 h-80',
        large: 'w-96 h-96'
      }
      
      const imageShapeClasses: Record<'square' | 'rectangle' | 'circle', string> = {
        square: 'rounded-lg',
        rectangle: 'rounded-lg',
        circle: 'rounded-full'
      }
      
      return (
        <div className="space-y-6">
          {content.title && (
            <h3 className="text-3xl font-bold text-black mb-4">{content.title}</h3>
          )}
          
          {content.image ? (
            <div className={`flex ${imagePosition === 'right' ? 'flex-row' : 'flex-row-reverse'} gap-8 items-start`}>
              <div className="flex-1 space-y-4">
                {content.text && (
                  <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                    {content.text.split('\n').map((line, i) => {
                      if (!line) return <br key={i} />
                      return (
                        <div key={i}>
                          {renderTextWithBold(line)}
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {content.items && content.items.length > 0 && (
                  <ul className="space-y-3 mt-4">
                    {content.items.map((item, index) => {
                      if (!item) {
                        return <li key={index} className="h-2"></li>
                      }
                      
                      return (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-red-600 mt-1 font-bold flex-shrink-0 text-xl">•</span>
                          <span className="text-gray-900 text-base leading-relaxed">
                            {renderTextWithBold(item)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <div className={`relative ${imageSizeClasses[imageSize]} ${imageShapeClasses[imageStyle]} overflow-hidden border-4 border-gray-300 shadow-2xl`}>
                  <Image
                    src={content.image}
                    alt={content.imageAlt || 'Module image'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {content.text && (
                <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                  {content.text.split('\n').map((line, i) => {
                    if (!line) return <br key={i} />
                    return (
                      <div key={i}>
                        {renderTextWithBold(line)}
                      </div>
                    )
                  })}
                </div>
              )}
              
              {content.items && content.items.length > 0 && (
                <ul className="space-y-3 mt-4">
                  {content.items.map((item, index) => {
                    if (!item) {
                      return <li key={index} className="h-2"></li>
                    }
                    
                    return (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-red-600 mt-1 font-bold flex-shrink-0 text-xl">•</span>
                        <span className="text-gray-900 text-lg leading-relaxed">
                          {renderTextWithBold(item)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )

    case 'checklist':
      return (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
          {content.title && (
            <h3 className="text-xl font-bold text-blue-900 flex items-center">
              <CheckSquare className="h-6 w-6 mr-2 text-blue-600" />
              {content.title}
            </h3>
          )}
          {content.items && (
            <ul className="space-y-3">
              {content.items.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded border-2 border-blue-400 bg-white" />
                  <span className="text-gray-800">
                    {renderTextWithBold(item)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )

    case 'warning':
      return (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-7 w-7 text-yellow-600 flex-shrink-0" />
            {content.title && (
              <h3 className="text-xl font-bold text-yellow-900">{content.title}</h3>
            )}
          </div>
          {content.text && (
            <div className="text-yellow-900 leading-relaxed text-lg whitespace-pre-line">
              {content.text.split('\n').map((line, i) => {
                if (!line) return <br key={i} />
                return (
                  <div key={i}>
                    {renderTextWithBold(line)}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )

    case 'example':
      return (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 space-y-4">
          {content.example && (
            <>
              <h3 className="text-xl font-bold text-gray-900">{content.example.title}</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Scenario:</p>
                  <p className="text-gray-800">{content.example.scenario}</p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="text-sm font-semibold text-green-900 mb-1">✓ Correct Approach:</p>
                  <p className="text-gray-800">{content.example.correct}</p>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-sm font-semibold text-red-900 mb-1">✗ Incorrect Approach:</p>
                  <p className="text-gray-800">{content.example.incorrect}</p>
                </div>
              </div>
            </>
          )}
        </div>
      )

    case 'exam':
      return <ExamComponent content={content} onExamPassed={onExamPassed} />

    default:
      return null
  }
}

function ExamComponent({ content, onExamPassed }: { content: any; onExamPassed?: () => void }) {
  const [answers, setAnswers] = React.useState<Record<number, string>>({})
  const [submitted, setSubmitted] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [showResults, setShowResults] = React.useState(false)
  const [passed, setPassed] = React.useState(false)

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = () => {
    let correct = 0
    content.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    
    const percentage = (correct / content.questions.length) * 100
    setScore(percentage)
    const hasPassed = percentage >= content.passingScore
    setPassed(hasPassed)
    setSubmitted(true)
    setShowResults(true)

    if (hasPassed && onExamPassed) {
      onExamPassed()
    }
  }

  const handleRetake = () => {
    setAnswers({})
    setSubmitted(false)
    setShowResults(false)
    setScore(0)
    setPassed(false)
  }

  const allAnswered = content.questions.every((q: any) => answers[q.id])

  return (
    <div className="space-y-6">
      {content.title && (
        <h3 className="text-2xl font-bold text-gray-900">{content.title}</h3>
      )}
      
      {content.description && (
        <p className="text-gray-700 text-lg">{content.description}</p>
      )}

      {!passed && !showResults && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-5 flex items-start space-x-3">
          <AlertTriangle className="h-7 w-7 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-red-900 text-lg">🔒 Module Completion Blocked</p>
            <p className="text-red-800">You cannot mark this module as complete until you pass this exam with {content.passingScore}% or higher. The "Complete" button will appear once you pass.</p>
          </div>
        </div>
      )}

      <>
        {showResults ? (
          <div className={`p-6 rounded-xl border-2 ${passed ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
            <h4 className={`text-2xl font-bold mb-4 ${passed ? 'text-green-900' : 'text-red-900'}`}>
              {passed ? '🎉 Exam Passed!' : '❌ Exam Not Passed'}
            </h4>
            <p className={`text-xl mb-4 ${passed ? 'text-green-800' : 'text-red-800'}`}>
              Your Score: {score.toFixed(0)}% ({Math.round(score * content.questions.length / 100)} out of {content.questions.length} correct)
            </p>
            <p className={`text-lg mb-6 ${passed ? 'text-green-700' : 'text-red-700'}`}>
              {passed 
                ? 'Excellent work! You have passed the knowledge assessment. You can now complete this module using the "Complete" button at the bottom of the page.' 
                : `You need ${content.passingScore}% or higher to pass. Please review the training material and try again.`}
            </p>
            
            {!passed && (
              <button
                onClick={handleRetake}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Retake Exam
              </button>
            )}
            
            {passed && (
              <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
                <p className="text-green-900 font-semibold">✓ Exam Completed Successfully</p>
                <p className="text-green-700 text-sm mt-1">Scroll down to the bottom of the page to find the "Complete" button and finish this module.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {content.questions.map((question: any, index: number) => (
                <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    {index + 1}. {question.question}
                  </p>
                  
                  <div className="space-y-3">
                    {Object.entries(question.options).map(([letter, text]: [string, any]) => (
                      <label
                        key={letter}
                        className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[question.id] === letter
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={letter}
                          checked={answers[question.id] === letter}
                          onChange={() => handleAnswerSelect(question.id, letter)}
                          className="mt-1 mr-3 h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-900">
                          <strong>{letter})</strong> {text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-4 bg-white shadow-xl rounded-xl border-2 border-gray-300 p-6">
              <div className="flex items-center justify-between">
                <div className="text-gray-700">
                  <p className="font-semibold text-lg">Progress: {Object.keys(answers).length} of {content.questions.length} answered</p>
                  <p className="text-sm">Passing score required: {content.passingScore}% or higher</p>
                  <p className="text-xs text-red-600 mt-1">⚠️ Complete button will appear after passing the exam</p>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`font-bold py-4 px-8 rounded-lg transition-colors text-lg ${
                    allAnswered
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  )
}