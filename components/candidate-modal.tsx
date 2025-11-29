"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Sparkles, 
  Clock,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  Trash2,
  Download,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { useState } from "react"

interface Candidate {
  id: number
  full_name: string
  email: string
  phone: string
  resume_text: string
  cover_letter: string
  ai_evaluation: string | null
  fit_score: number
  status: 'pending' | 'approved' | 'rejected'
  applied_at: string
  evaluated_at: string | null
}

interface CandidateModalProps {
  candidate: Candidate | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: number) => void
  onReject: (id: number) => void
  processing: boolean
  error: string
}

export function CandidateModal({
  candidate,
  isOpen,
  onClose,
  onApprove,
  onReject,
  processing,
  error
}: CandidateModalProps) {
  
  const [localProcessing, setLocalProcessing] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<{
    type: 'approve' | 'reject' | 'delete' | 'reevaluate'
    message: string
  } | null>(null)
  const [showFullEvaluation, setShowFullEvaluation] = useState(false)

  if (!candidate) return null

  const token = typeof window !== 'undefined' ? localStorage.getItem('training_token') : null

  // Extraer best match si está en el resume_text
  const hasBestMatch = candidate.resume_text.includes('MEJOR MATCH:')
  const bestMatchLine = hasBestMatch 
    ? candidate.resume_text.split('\n\n')[0] 
    : null

  // Para la evaluación IA con "Ver más"
  const evaluationPreview = candidate.ai_evaluation
    ? candidate.ai_evaluation.substring(0, 400) + '...'
    : ''
  const shouldShowViewMore = candidate.ai_evaluation && candidate.ai_evaluation.length > 400

  const handleReEvaluate = async () => {
    if (!candidate || !token) {
      alert('❌ Error: No hay sesión activa')
      return
    }
    
    if (confirm('¿Re-evaluar este candidato con IA? Esto sobrescribirá la evaluación actual.')) {
      setLocalProcessing(true)
      setActionSuccess(null)
      
      try {
        const response = await fetch(`/api/admin/candidates/${candidate.id}/re-evaluate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        
        if (response.ok) {
          setActionSuccess({
            type: 'reevaluate',
            message: `✅ Re-evaluación exitosa! Fit Score: ${data.fit_score}/100. Mejor Match: ${data.best_match}`
          })
          
          // Recargar después de 2 segundos
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          alert(`❌ Error: ${data.error}`)
        }
      } catch (error: any) {
        alert('❌ Error de red')
      } finally {
        setLocalProcessing(false)
      }
    }
  }

  const handleDelete = async () => {
    if (!candidate || !token) {
      alert('❌ Error: No hay sesión activa')
      return
    }
    
    if (confirm(`⚠️ ¿Eliminar permanentemente a ${candidate.full_name}?\n\nEsta acción no se puede deshacer.`)) {
      setLocalProcessing(true)
      setActionSuccess(null)
      
      try {
        const response = await fetch(`/api/admin/candidates/${candidate.id}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          setActionSuccess({
            type: 'delete',
            message: '✅ Candidato eliminado exitosamente. Recargando...'
          })
          
          // Recargar después de 1.5 segundos
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        } else {
          const data = await response.json()
          alert(`❌ Error: ${data.error}`)
        }
      } catch (error) {
        alert('❌ Error de red')
      } finally {
        setLocalProcessing(false)
      }
    }
  }

  const handleDownloadCV = async () => {
    if (!token || !candidate) return
    
    try {
      const response = await fetch(
        `/api/admin/candidates/${candidate.id}/download-cv`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        const contentDisposition = response.headers.get('Content-Disposition')
        const fileNameMatch = contentDisposition?.match(/filename="(.+)"/)
        const fileName = fileNameMatch ? fileNameMatch[1] : `CV_${candidate.full_name.replace(/\s+/g, '_')}.pdf`
        
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        alert(`❌ Error al descargar: ${data.error}`)
      }
    } catch (error) {
      alert('❌ Error al descargar CV')
    }
  }

  const handleApproveWithReload = async () => {
    if (!candidate || !token) {
      alert('❌ Error: No hay sesión activa')
      return
    }

    const confirmMessage = `¿Aprobar a ${candidate.full_name} y crear su usuario?\n\nSe le dará acceso al sistema de entrenamiento.`
    
    if (confirm(confirmMessage)) {
      setLocalProcessing(true)
      setActionSuccess(null)
      
      try {
        console.log('[MODAL] Sending approve request for candidate:', candidate.id)
        
        const response = await fetch(`/api/admin/candidates/${candidate.id}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('[MODAL] Approve response status:', response.status)
        const data = await response.json()
        console.log('[MODAL] Approve response data:', data)
        
        if (response.ok) {
          setActionSuccess({
            type: 'approve',
            message: `✅ Usuario creado exitosamente! Email: ${candidate.email}. Recargando...`
          })
          
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          console.error('[MODAL] Approve failed:', data)
          alert(`❌ Error al aprobar: ${data.error || 'Error desconocido'}`)
          setLocalProcessing(false)
        }
      } catch (error: any) {
        console.error('[MODAL] Network error approving:', error)
        alert('❌ Error de red al aprobar candidato')
        setLocalProcessing(false)
      }
    }
  }

  const handleRejectWithReload = async () => {
    if (!candidate || !token) {
      alert('❌ Error: No hay sesión activa')
      return
    }
    
    const confirmMessage = `¿Rechazar a ${candidate.full_name}?\n\nEsta acción cambiará su estado a "rechazado".`
    
    if (confirm(confirmMessage)) {
      setLocalProcessing(true)
      setActionSuccess(null)
      
      try {
        console.log('[MODAL] Sending reject request for candidate:', candidate.id)
        
        const response = await fetch(`/api/admin/candidates/${candidate.id}/reject`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('[MODAL] Reject response status:', response.status)
        const data = await response.json()
        console.log('[MODAL] Reject response data:', data)
        
        if (response.ok) {
          setActionSuccess({
            type: 'reject',
            message: '✅ Candidato rechazado exitosamente. Recargando...'
          })
          
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          console.error('[MODAL] Reject failed:', data)
          alert(`❌ Error al rechazar: ${data.error || 'Error desconocido'}`)
          setLocalProcessing(false)
        }
      } catch (error: any) {
        console.error('[MODAL] Network error rejecting:', error)
        alert('❌ Error de red al rechazar candidato')
        setLocalProcessing(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-700">
          <DialogTitle className="text-white text-2xl flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold">
                {candidate.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl truncate">{candidate.full_name}</p>
              <p className="text-sm text-gray-400 font-normal">
                Postulación: {new Date(candidate.applied_at).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
          {/* Mensaje de éxito */}
          {actionSuccess && (
            <div className={`border-2 rounded-lg p-4 flex items-start space-x-3 ${
              actionSuccess.type === 'approve' ? 'bg-green-500/10 border-green-500' :
              actionSuccess.type === 'reject' ? 'bg-red-500/10 border-red-500' :
              actionSuccess.type === 'delete' ? 'bg-orange-500/10 border-orange-500' :
              'bg-blue-500/10 border-blue-500'
            }`}>
              <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                actionSuccess.type === 'approve' ? 'text-green-500' :
                actionSuccess.type === 'reject' ? 'text-red-500' :
                actionSuccess.type === 'delete' ? 'text-orange-500' :
                'text-blue-500'
              }`} />
              <div className="flex-1">
                <p className={`font-semibold ${
                  actionSuccess.type === 'approve' ? 'text-green-400' :
                  actionSuccess.type === 'reject' ? 'text-red-400' :
                  actionSuccess.type === 'delete' ? 'text-orange-400' :
                  'text-blue-400'
                }`}>
                  {actionSuccess.message}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  La página se recargará automáticamente...
                </p>
              </div>
            </div>
          )}

          {error && !actionSuccess && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Fit Score + Status - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center ${
              candidate.fit_score >= 75 ? 'bg-green-500/20 border-4 border-green-500' :
              candidate.fit_score >= 60 ? 'bg-yellow-500/20 border-4 border-yellow-500' :
              'bg-red-500/20 border-4 border-red-500'
            }`}>
              <div className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-white">{candidate.fit_score}</p>
                <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider">Fit Score</p>
              </div>
            </div>

            <span className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-full ${
              candidate.status === 'approved' ? 'bg-green-500/20 text-green-400 border-2 border-green-500' :
              candidate.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-2 border-red-500' :
              'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500'
            }`}>
              {candidate.status === 'approved' ? '✅ Aprobado' :
               candidate.status === 'rejected' ? '❌ Rechazado' :
               '⏳ Pendiente de Revisión'}
            </span>
          </div>

          {/* Best Match destacado - Responsive */}
          {bestMatchLine && (
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-2 border-green-500 rounded-lg p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white">Mejor Vacante para el Candidato</h3>
              </div>
              <pre className="text-green-300 text-sm sm:text-lg font-semibold whitespace-pre-wrap leading-relaxed break-words">
                {bestMatchLine}
              </pre>
            </div>
          )}

          {/* Información de Contacto */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-red-500" />
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Nombre Completo</p>
                <p className="text-white font-medium">{candidate.full_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white font-medium break-all">{candidate.email}</p>
              </div>
              {candidate.phone && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Teléfono</p>
                  <p className="text-white font-medium">{candidate.phone}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm mb-1">Fecha de Postulación</p>
                <p className="text-white font-medium">
                  {new Date(candidate.applied_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Evaluación IA con Ver Más */}
          {candidate.ai_evaluation && (
            <div className="bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 rounded-lg p-4 sm:p-6 border-2 border-blue-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Evaluación Automática por IA</h3>
                  <p className="text-xs sm:text-sm text-gray-300">Análisis generado por Claude Sonnet</p>
                </div>
              </div>
              
              <div className="bg-gray-900/80 rounded-lg p-3 sm:p-5 border border-gray-700">
                <div className={`${showFullEvaluation ? '' : 'max-h-64 sm:max-h-96'} overflow-y-auto`}>
                  <pre className="whitespace-pre-wrap text-gray-200 text-xs sm:text-sm leading-relaxed font-sans">
{showFullEvaluation ? candidate.ai_evaluation : evaluationPreview}
                  </pre>
                </div>
                
                {shouldShowViewMore && (
                  <button
                    onClick={() => setShowFullEvaluation(!showFullEvaluation)}
                    className="mt-3 w-full sm:w-auto text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-center sm:justify-start space-x-1 transition-colors"
                  >
                    {showFullEvaluation ? (
                      <>
                        <span>Ver menos</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Ver más evaluación</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {candidate.evaluated_at && (
                <p className="text-xs text-gray-400 mt-3 flex items-center">
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  Evaluado: {new Date(candidate.evaluated_at).toLocaleString('es-ES')}
                </p>
              )}
            </div>
          )}

          {/* CV Original - Botón de Descarga */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-red-500" />
                Curriculum Vitae Original
              </h3>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
                
                <div>
                  <p className="text-white font-semibold text-lg mb-2">
                    CV Recibido del Candidato
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Descarga el archivo original en formato PDF/DOC que subió el candidato.
                  </p>
                </div>

                <Button
                  onClick={handleDownloadCV}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar CV Original
                </Button>

                <p className="text-xs text-gray-500 italic">
                  💡 Descarga el CV en su formato original (PDF, DOC, DOCX o TXT)
                </p>
              </div>
            </div>
          </div>

          {/* Carta de Presentación */}
          {candidate.cover_letter && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-red-500" />
                Carta de Presentación
              </h3>
              <div className="bg-gray-900 rounded-lg p-5 border border-gray-700 max-h-64 overflow-y-auto">
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
{candidate.cover_letter}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-700 space-y-3">
          {/* Botones de Re-evaluar y Eliminar */}
          <div className="flex space-x-3">
            <Button
              onClick={handleReEvaluate}
              disabled={processing || localProcessing || actionSuccess !== null}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {(processing || localProcessing) && actionSuccess?.type === 'reevaluate' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Re-evaluar con IA
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={processing || localProcessing || actionSuccess !== null}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-900/20 py-3"
            >
              {(processing || localProcessing) && actionSuccess?.type === 'delete' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Eliminar
            </Button>
          </div>

          {/* Botones de Aprobar/Rechazar */}
          {candidate.status === 'pending' ? (
            <div className="flex space-x-3">
              <Button
                onClick={handleApproveWithReload}
                disabled={processing || localProcessing || actionSuccess !== null}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
              >
                {(processing || localProcessing) && actionSuccess?.type === 'approve' ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <UserCheck className="h-5 w-5 mr-2" />
                )}
                Aprobar y Crear Usuario
              </Button>
              <Button
                onClick={handleRejectWithReload}
                disabled={processing || localProcessing || actionSuccess !== null}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
              >
                {(processing || localProcessing) && actionSuccess?.type === 'reject' ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <UserX className="h-5 w-5 mr-2" />
                )}
                Rechazar
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-300 flex items-center justify-center space-x-2">
                {candidate.status === 'approved' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>Este candidato ya fue <strong className="text-green-400">aprobado</strong></span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span>Este candidato ya fue <strong className="text-red-400">rechazado</strong></span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}