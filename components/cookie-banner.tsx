"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Cookie } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

const translations = {
  en: {
    message: "We use cookies to enhance your browsing experience and improve system performance.",
    accept: "Accept",
    decline: "Decline",
    learnMore: "Learn More"
  },
  es: {
    message: "Usamos cookies para mejorar tu experiencia y el rendimiento del agente de reclutamiento.",
    accept: "Aceptar",
    decline: "Rechazar",
    learnMore: "Más información"
  }
}

export function CookieBanner() {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  const currentLang = language || "en"
  const t = translations[currentLang] || translations.en

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent')
    if (!hasConsent) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: "1.0"
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    setIsVisible(false)
  }

  const handleDecline = () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: "1.0"
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <Cookie className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-800 mb-3">
              {t.message}
            </p>

            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-black font-semibold text-xs px-3 py-1 h-auto"
                >
                  {t.accept}
                </Button>

                <Button
                  onClick={handleDecline}
                  variant="outline"
                  size="sm"
                  className="text-black border-gray-300 hover:bg-gray-50 font-semibold text-xs px-3 py-1 h-auto"
                >
                  {t.decline}
                </Button>
              </div>

              <Link
                href="/privacy-policy"
                className="text-xs text-red-600 hover:text-red-700 underline self-start"
              >
                {t.learnMore}
              </Link>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
