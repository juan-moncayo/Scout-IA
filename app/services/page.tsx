"use client"

import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Building2, Factory, Zap, Shield, Wrench, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"

const translations = {
  en: {
    title: "Our Services",
    subtitle: "Professional roofing and solar solutions for every need",
    getQuote: "Go to Agent",
  },
  es: {
    title: "Nuestros Servicios",
    subtitle: "Soluciones profesionales para tu empresa",
    getQuote: "Ir al Agente",
  },
}

export default function ServicesPage() {
  const { language } = useLanguage()
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [isServicesVisible, setIsServicesVisible] = useState(false)
  const [isWhyChooseVisible, setIsWhyChooseVisible] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const whyChooseRef = useRef<HTMLElement>(null)

  const currentLang = language || "es"
  const t = translations[currentLang] || translations.es

  const services = [
    {
      icon: Home,
      title: "Agente de Reclutamiento",
      description: "Evaluación automática y entrevistas inteligentes",
      services: [
        "Lectura de CVs",
        "Preguntas dinámicas",
        "Evaluación técnica",
        "Puntaje del candidato",
      ],
      bgColor: "bg-red-500",
    },
    {
      icon: Building2,
      title: "Filtro de Hojas de Vida",
      description: "Procesamiento inteligente de información",
      services: [
        "Análisis semántico",
        "Detección de habilidades",
        "Cruce con oferta laboral",
        "Eliminación de ruido",
      ],
      bgColor: "bg-gray-800",
    },
    {
      icon: Factory,
      title: "Asistente de Entrevista",
      description: "Preguntas adaptativas según el perfil",
      services: [
        "Evaluación por rol",
        "Preguntas niveladas",
        "Puntaje según desempeño",
        "Reporte del candidato",
      ],
      bgColor: "bg-red-500",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) {
              setIsHeroVisible(true)
            } else if (entry.target === servicesRef.current) {
              setIsServicesVisible(true)
            } else if (entry.target === whyChooseRef.current) {
              setIsWhyChooseVisible(true)
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) observer.observe(heroRef.current)
    if (servicesRef.current) observer.observe(servicesRef.current)
    if (whyChooseRef.current) observer.observe(whyChooseRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section ref={heroRef} className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {currentLang === "es" ? "Nuestros Servicios" : "Our Services"}
            </h1>

            <p className="text-xl text-gray-300 mt-6">
              {t.subtitle}
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section ref={servicesRef} className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-white text-black border-none shadow-lg hover:scale-105 transition"
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${service.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>

                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* BOTÓN EDITADO */}
                  <Button
                    size="sm"
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => (window.location.href = "/agente")}
                  >
                    {t.getQuote}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}
