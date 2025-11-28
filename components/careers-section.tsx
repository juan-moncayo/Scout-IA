"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function CareersSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: ''
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
      
      if (!validTypes.includes(file.type)) {
        setError('Por favor sube un archivo PDF, DOC, DOCX o TXT')
        return
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo debe ser menor a 5MB')
        return
      }

      setCvFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validaciones
    if (!formData.fullName || !formData.email || !cvFile) {
      setError('Por favor completa todos los campos obligatorios y sube tu CV')
      return
    }

    setUploading(true)

    try {
      // Crear FormData para enviar archivo
      const formDataToSend = new FormData()
      formDataToSend.append('full_name', formData.fullName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('cover_letter', formData.coverLetter)
      formDataToSend.append('cv_file', cvFile)

      const response = await fetch('/api/candidates/apply', {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Limpiar formulario
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          coverLetter: ''
        })
        setCvFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        // Scroll suave hacia arriba para ver el mensaje
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setError(data.error || 'Error al enviar tu postulación. Intenta de nuevo.')
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-black via-red-950 to-black overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Únete a Nuestro Equipo</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Impulsa Tu Carrera con{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              IA
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sube tu CV y nuestra IA analizará tu perfil para encontrar las mejores oportunidades.
            Recibe una evaluación personalizada en minutos.
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <Card className="bg-green-500/10 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-green-500 font-semibold text-lg mb-1">
                        ¡Postulación Exitosa!
                      </h3>
                      <p className="text-green-400 text-sm">
                        Tu CV ha sido recibido y nuestra IA está analizándolo. 
                        Recursos Humanos revisará tu perfil pronto. Te contactaremos por email.
                      </p>
                    </div>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-green-500 hover:text-green-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-gray-900 border-gray-800 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}

                {/* Nombre Completo */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-300">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Email y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">
                      Teléfono (Opcional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Upload CV */}
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    Curriculum Vitae (CV) *
                  </Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                      transition-all duration-300
                      ${cvFile 
                        ? 'border-green-500 bg-green-500/5' 
                        : 'border-gray-700 bg-gray-800 hover:border-red-500 hover:bg-gray-750'
                      }
                    `}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {cvFile ? (
                      <div className="flex flex-col items-center space-y-3">
                        <FileText className="h-12 w-12 text-green-500" />
                        <div>
                          <p className="text-white font-medium">{cvFile.name}</p>
                          <p className="text-sm text-gray-400">
                            {(cvFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCvFile(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          Cambiar archivo
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <Upload className="h-12 w-12 text-gray-500" />
                        <div>
                          <p className="text-white font-medium mb-1">
                            Haz clic para subir tu CV
                          </p>
                          <p className="text-sm text-gray-400">
                            PDF, DOC, DOCX o TXT (máx. 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carta de Presentación */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter" className="text-gray-300">
                    Carta de Presentación (Opcional)
                  </Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Cuéntanos por qué quieres unirte a nuestro equipo..."
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-6 text-lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analizando tu CV con IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Enviar Postulación
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Al enviar tu CV, aceptas que nuestra IA analice tu perfil para encontrar 
                  las mejores oportunidades laborales.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Evaluación con IA</h3>
            <p className="text-gray-400 text-sm">
              Análisis automático de tu CV usando inteligencia artificial
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Respuesta Rápida</h3>
            <p className="text-gray-400 text-sm">
              Recibe feedback en minutos, no en días
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Match Inteligente</h3>
            <p className="text-gray-400 text-sm">
              Te conectamos con las vacantes más adecuadas para ti
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}