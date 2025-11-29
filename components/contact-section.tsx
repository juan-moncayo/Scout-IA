"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Clock, Paperclip, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "Get Personalized Job Guidance!",
    subtitle: "Our AI helps recruiters evaluate candidates efficiently and guides applicants toward the best fitting positions.",
    sendMessage: "Contact HR AI",
    name: "Full Name*",
    email: "Email*",
    phone: "Phone*",
    address: "Location (City, Country)*",
    details: "Tell us about your skills and experience, and our AI will suggest the most suitable positions for you.*",
    sendBtn: "Send Information",
    attachFiles: "Attach Resume or Certificates",
    attachments: "Attachments",
    privacy: "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
    seeInPerson: "Want a direct consult?",
    communication:
      "Recruiters will stay in touch until the evaluation is complete. For any questions or special requests, just contact us.",
    businessHours: "Business Hours",
    hours: "Mon - Fri: 08:00 AM - 6:00 PM\nSat - Sun: Closed",
    sending: "Sending...",
    messageSent: "Information sent successfully!",
    messageError: "Error sending information. Please try again.",
    fillRequired: "Please fill in all required fields.",
  },
  es: {
    title: "¡Obtén Orientación Personalizada de Empleo!",
    subtitle: "Nuestra IA ayuda a los reclutadores a evaluar candidatos y guía a los postulantes hacia los puestos que mejor se ajustan a su perfil.",
    sendMessage: "Contactar IA de RRHH",
    name: "Nombre Completo*",
    email: "Correo Electrónico*",
    phone: "Teléfono*",
    address: "Ubicación (Ciudad, País)*",
    details: "Cuéntanos sobre tus habilidades y experiencia, y nuestra IA te sugerirá los puestos más adecuados.*",
    sendBtn: "Enviar Información",
    attachFiles: "Adjuntar CV o Certificados",
    attachments: "Archivos Adjuntos",
    privacy:
      "Este sitio está protegido por reCAPTCHA y se aplican la Política de Privacidad y los Términos de Servicio de Google.",
    seeInPerson: "¿Deseas una consulta directa?",
    communication:
      "Los reclutadores se mantendrán en contacto hasta completar la evaluación. Para cualquier pregunta o solicitud especial, contáctanos.",
    businessHours: "Horario de Atención",
    hours: "Lun - Vie: 08:00 AM - 6:00 PM\nSáb - Dom: Cerrado",
    sending: "Enviando...",
    messageSent: "¡Información enviada exitosamente!",
    messageError: "Error al enviar la información. Por favor intenta de nuevo.",
    fillRequired: "Por favor completa todos los campos requeridos.",
  },
}

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    details: "",
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const sectionRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { language } = useLanguage()

  const t = translations[language]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => setAttachments(prev => prev.filter((_, i) => i !== index))

  const validateForm = () => {
    return formData.name && formData.email && formData.phone && formData.address && formData.details
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      alert(t.fillRequired)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([k, v]) => submitData.append(k, v))
      attachments.forEach((file, i) => submitData.append(`attachment_${i}`, file))

      const response = await fetch("/api/send-email", { method: "POST", body: submitData })
      if (!response.ok) throw new Error("Failed to send email")
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", address: "", details: "" })
      setAttachments([])
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (err) {
      console.error(err)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
        >
          <h2 className="font-work-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 px-4">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-left opacity-100" : "opacity-0"}`}>
            <Card className="border border-gray-700 shadow-lg bg-gray-900 text-white">
              <CardHeader>
                <CardTitle className="font-work-sans text-xl sm:text-2xl text-white">{t.sendMessage}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      placeholder={t.name}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      required
                    />
                    <Input
                      name="email"
                      placeholder={t.email}
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <Input
                    name="phone"
                    placeholder={t.phone}
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    name="address"
                    placeholder={t.address}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    required
                  />
                  <Textarea
                    name="details"
                    placeholder={t.details}
                    value={formData.details}
                    onChange={handleInputChange}
                    className="min-h-24 sm:min-h-32 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    required
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-black border-red-600 hover:bg-red-600"
                      >
                        <Paperclip className="h-4 w-4" />
                        {t.attachFiles}
                      </Button>
                      <span className="text-gray-300 text-sm">{t.attachments} ({attachments.length})</span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx"
                    />

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                              <X className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full button-hover bg-red-600 text-white hover:bg-red-700"
                  >
                    {isSubmitting ? t.sending : t.sendBtn}
                  </Button>

                  {submitStatus === "success" && <p className="text-green-500 text-center">{t.messageSent}</p>}
                  {submitStatus === "error" && <p className="text-red-500 text-center">{t.messageError}</p>}
                </form>

                <p className="text-xs sm:text-sm text-gray-400 text-center">{t.privacy}</p>
              </CardContent>
            </Card>
          </div>

          <div className={`transition-all duration-1000 delay-400 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
            <div className="space-y-6">
              <Card className="card-hover border border-gray-700 shadow-lg bg-gray-900 text-white">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-work-sans text-lg sm:text-xl font-semibold mb-4 text-white">{t.seeInPerson}</h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-6">{t.communication}</p>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white">Scout IA</p>
                        <a
                          href="https://maps.google.com/?q=Pasto,+Nariño,+Colombia"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Pasto, Nariño, Colombia
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <a
                        href="https://wa.me/573165031355?text=Hola%2C%20quiero%20contactarme%20con%20Scout%20IA%20para%20evaluar%20candidatos%20y%20postulantes."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:text-red-600 transition-colors text-white"
                      >
                        +57 316 5031355
                      </a>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm sm:text-base text-white">{t.businessHours}</p>
                        <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-line">{t.hours}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
