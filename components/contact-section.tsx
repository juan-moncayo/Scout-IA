"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Clock, Paperclip, X, MessageCircle } from "lucide-react"

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    details: "",
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const sectionRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    return formData.name && formData.email && formData.phone && formData.company && formData.details
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      alert("Por favor completa todos los campos requeridos.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("email", formData.email)
      submitData.append("phone", formData.phone)
      submitData.append("company", formData.company)
      submitData.append("details", formData.details)

      attachments.forEach((file, index) => {
        submitData.append(`attachment_${index}`, file)
      })

      const response = await fetch("/api/send-email", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) throw new Error("Failed to send email")
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", company: "", details: "" })
      setAttachments([])

      setTimeout(() => setSubmitStatus("idle"), 4000)
    } catch (error) {
      console.error("Error:", error)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* ---------------------- TITULO ---------------------- */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-4xl font-bold text-black mb-4">
            Contacta a Nuestro Agente de Reclutamiento Inteligente
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Optimiza tus procesos de selección con IA. Nuestro agente analiza hojas de vida, entrevista candidatos y recomienda los mejores perfiles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ---------------------- FORMULARIO ---------------------- */}
          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-black">Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre*" required />
                  <Input name="email" value={formData.email} type="email" onChange={handleInputChange} placeholder="Correo*" required />
                </div>

                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Teléfono*" required />

                <Input name="company" value={formData.company} onChange={handleInputChange} placeholder="Empresa*" required />

                <Textarea
                  name="details"
                  placeholder="Cuéntanos qué tipo de perfiles buscas o qué proceso deseas automatizar*"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="min-h-28"
                  required
                />

                {/* Archivos */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-black"
                  >
                    <Paperclip className="h-4 w-4" />
                    Adjuntar Archivos (Opcional)
                  </Button>

                  <input ref={fileInputRef} type="file" multiple className="hidden"
                    onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx" />

                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-black text-white">
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>

                {submitStatus === "success" && <p className="text-green-600 text-center">Mensaje enviado correctamente</p>}
                {submitStatus === "error" && <p className="text-red-600 text-center">Error al enviar mensaje</p>}
              </form>
            </CardContent>
          </Card>

          {/* ---------------------- INFORMACIÓN Y CTA REAL ---------------------- */}
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-lg bg-white">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-semibold text-black">Habla con el Agente</h3>
                <p className="text-gray-600">
                  Nuestro agente de reclutamiento basado en IA está disponible para ayudarte a evaluar candidatos,
                  filtrar perfiles y automatizar entrevistas.
                </p>

                <div className="space-y-4">

                  <a
                    href="https://wa.me/573165031355"
                    target="_blank"
                    className="flex items-center gap-3 text-lg font-medium text-green-600 hover:underline"
                  >
                    <MessageCircle className="h-6 w-6" /> Hablar con el Agente (+57 316 5031355)
                  </a>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-black" />
                    <p className="text-gray-700">
                      Colombia – Atención para PYMES en Latinoamérica
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-black" />
                    <p className="text-gray-700">
                      Lunes a Viernes<br /> 8:00 AM – 6:00 PM
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
