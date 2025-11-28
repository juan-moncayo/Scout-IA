"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, Award } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "About the Intelligent Recruiting Agent",
    missionTitle: "Our Purpose",
    missionText1:
      "We help small and medium-sized businesses automate the filtering, evaluation, and prioritization of candidates using AI-driven interviews and adaptive questioning.",
    missionText2:
      "Our goal is to make hiring faster, more accurate, and more accessible without requiring specialized HR teams.",
    expertTeam: "Trained AI Models",
    expertTeamDesc: "Optimized for evaluating junior and mid-level candidates",
    qualityFirst: "Smart Evaluation",
    qualityFirstDesc: "Adaptive interviews based on skills and behavior",
    established: "Improving Companies Since",
    establishedDesc: "Helping teams hire better with intelligent automation",
  },

  es: {
    title: "Acerca del Agente de Reclutamiento Inteligente",
    missionTitle: "Nuestro Propósito",
    missionText1:
      "Ayudamos a las pequeñas y medianas empresas a automatizar el filtrado, evaluación y priorización de candidatos mediante entrevistas impulsadas por IA y preguntas adaptativas.",
    missionText2:
      "Nuestro objetivo es hacer los procesos de contratación más rápidos, precisos y accesibles sin necesidad de equipos de RR.HH. especializados.",
    expertTeam: "Modelos Entrenados",
    expertTeamDesc: "Optimizados para evaluar candidatos junior y semi-senior",
    qualityFirst: "Evaluación Inteligente",
    qualityFirstDesc: "Entrevistas adaptativas según habilidades y comportamiento",
    established: "Transformando Empresas Desde",
    establishedDesc: "Mejorando contrataciones con automatización inteligente",
  },
}

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="font-work-sans text-3xl md:text-5xl font-bold text-white mb-6">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* MISIÓN */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "animate-slide-in-left opacity-100" : "opacity-0"
            }`}
          >
            <Card className="card-hover border border-gray-200 shadow-lg bg-black">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="font-work-sans text-2xl font-semibold text-white">
                    {t.missionTitle}
                  </h3>
                </div>

                <p className="text-gray-300 leading-relaxed text-lg">
                  {t.missionText1}
                </p>
                <p className="text-gray-300 leading-relaxed text-lg mt-4">
                  {t.missionText2}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* TARJETAS */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Equipo experto */}
              <Card className="card-hover text-center p-6 border border-gray-200 shadow-lg bg-black">
                <CardContent className="p-4">
                  <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h4 className="font-work-sans text-xl font-semibold mb-2 text-white">
                    {t.expertTeam}
                  </h4>
                  <p className="text-gray-300">{t.expertTeamDesc}</p>
                </CardContent>
              </Card>

              {/* Calidad */}
              <Card className="card-hover text-center p-6 border border-gray-200 shadow-lg bg-black">
                <CardContent className="p-4">
                  <Award className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h4 className="font-work-sans text-xl font-semibold mb-2 text-white">
                    {t.qualityFirst}
                  </h4>
                  <p className="text-gray-300">{t.qualityFirstDesc}</p>
                </CardContent>
              </Card>

              {/* Fecha */}
              <Card className="card-hover text-center p-6 border border-gray-200 shadow-lg bg-black sm:col-span-2">
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-red-600 mb-2">2024</div>
                  <h4 className="font-work-sans text-xl font-semibold mb-2 text-white">
                    {t.established}
                  </h4>
                  <p className="text-gray-300">{t.establishedDesc}</p>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
