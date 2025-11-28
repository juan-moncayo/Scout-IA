"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Phone } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    errorCode: "404",
    errorTitle: "Page Not Found",
    errorMessage: "Oops! The page you're looking for doesn't exist or has been moved.",
    errorDescription: "Don't worry, it happens to the best of us. Here are some helpful links to get you back on track:",
    goHome: "Go Home",
    goBack: "Go Back",
    contactUs: "Contact Us",
  },
  es: {
    errorCode: "404",
    errorTitle: "Página No Encontrada",
    errorMessage: "¡Ups! La página que buscas no existe o ha sido movida.",
    errorDescription: "No te preocupes, nos pasa a todos. Aquí tienes algunos enlaces útiles para volver al camino correcto:",
    goHome: "Ir al Inicio",
    goBack: "Volver",
    contactUs: "Contáctanos",
  }
}

export default function NotFound() {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const currentLang = language || 'en'
  const t = translations[currentLang] || translations.en

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const goBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-20">
        {/* Error Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div
              ref={contentRef}
              className={`transition-all duration-1000 ${
                isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
              }`}
            >
              {/* Large 404 */}
              <div className="mb-6">
                <h1 className="text-8xl md:text-9xl font-bold text-red-500 mb-4">
                  {t.errorCode}
                </h1>
                <div className="w-32 h-2 bg-red-500 mx-auto mb-6 rounded-full"></div>
              </div>

              {/* Error Title */}
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                {t.errorTitle}
              </h2>

              {/* Error Message */}
              <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                {t.errorMessage}
              </p>

              {/* Description */}
              <p className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto">
                {t.errorDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-5 justify-center items-center mt-8">
                {/* Go Home */}
                <Link href="/">
                  <Button className="bg-white text-black px-8 py-4 text-lg font-semibold rounded-xl 
                    shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 
                    transition-all duration-500 transform hover:-translate-y-1">
                    <Home className="h-5 w-5 mr-2 text-black" />
                    {t.goHome}
                  </Button>
                </Link>

                {/* Go Back */}
                <Button
                  onClick={goBack}
                  className="bg-white text-black px-8 py-4 text-lg font-semibold rounded-xl 
                    shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 
                    transition-all duration-500 transform hover:-translate-y-1"
                >
                  <ArrowLeft className="h-5 w-5 mr-2 text-black" />
                  {t.goBack}
                </Button>

                {/* Contact Us (rojo destacado) */}
                <Link href="/contact">
                  <Button className="bg-red-500 text-white px-8 py-4 text-lg font-semibold rounded-xl 
                    shadow-md hover:shadow-xl hover:bg-red-600 
                    transition-all duration-500 transform hover:-translate-y-1">
                    <Phone className="h-5 w-5 mr-2 text-white" />
                    {t.contactUs}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
