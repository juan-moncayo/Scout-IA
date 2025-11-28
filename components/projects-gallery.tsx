"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "Projects Gallery",
    subtitle:
      "Explore our portfolio of successful AI projects that demonstrate the power and efficiency of intelligent recruitment.",
    projects: [
      {
        title: "AI Candidate Scoring",
        description: "Automated scoring model for evaluating junior candidates.",
      },
      {
        title: "Smart Interview Agent",
        description: "Adaptive interview questions using real-time candidate analysis.",
      },
      {
        title: "CV Parsing System",
        description: "Extraction and classification of candidate skills from CVs.",
      },
      {
        title: "Recruitment Dashboard",
        description: "Dashboard for tracking talent pipelines and candidate rankings.",
      },
      {
        title: "AI Behavioral Analysis",
        description: "Behavioral pattern detection during candidate responses.",
      },
      {
        title: "Automated Job Matching",
        description: "AI model that matches candidates with company job profiles.",
      },
    ],
  },

  es: {
    title: "Galería de Proyectos",
    subtitle:
      "Explora nuestro portafolio de proyectos exitosos de IA aplicados al reclutamiento inteligente.",
    projects: [
      {
        title: "Sistema de Puntaje de Candidatos",
        description: "Modelo automatizado que evalúa candidatos junior.",
      },
      {
        title: "Agente de Entrevistas Inteligente",
        description: "Preguntas adaptativas según el perfil del candidato.",
      },
      {
        title: "Parser de Hojas de Vida",
        description: "Extracción automática de habilidades y datos clave.",
      },
      {
        title: "Dashboard de Reclutamiento",
        description: "Panel para gestionar pipelines y rankings de candidatos.",
      },
      {
        title: "Análisis Conductual por IA",
        description: "Detección de patrones conductuales durante entrevistas.",
      },
      {
        title: "Matching Automático de Vacantes",
        description: "El sistema encuentra el mejor candidato para cada rol.",
      },
    ],
  },
}

const projectImages = [
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/ADNR0738.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/HNUE4272.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/LBIZ5431-0510a97.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/XYJD4444.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/SUUV2804.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/OOCA8886.JPG/:/rs=w:1300,h:800",
]

export function ProjectsGallery() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { language } = useLanguage()

  // fallback seguro
  const t = translations[language as keyof typeof translations] ?? translations.es

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 bg-black text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TÍTULO */}
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 px-4">
            {t.title}
          </h2>

          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            {t.subtitle}
          </p>
        </div>

        {/* GRID DE TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {t.projects.map((project, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="border-0 shadow-xl bg-gray-800 overflow-hidden group hover:scale-105 transition-transform h-[480px] flex flex-col">
                
                {/* IMG */}
                <div className="relative h-2/3">
                  <Image
                    src={projectImages[index] || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* TEXTO */}
                <CardContent className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-6 text-white">
                    {project.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-300">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
