"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    description:
      "Smart hiring for growing businesses. Our AI agent filters candidates, evaluates skills, and selects the best profiles for your company.",
    services: "Platform",
    roofInstallation: "AI Candidate Filtering",
    roofRepair: "Adaptive Interview Agent",
    solarPanels: "Scoring & Ranking System",
    emergencyServices: "Real-Time Candidate Evaluation",
    contactInfo: "Contact",
    hours: "Mon-Fri: 08:00 AM - 6:00 PM",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    rights: "All Rights Reserved.",
  },
  es: {
    description:
      "Contratación inteligente para pequeñas y medianas empresas. Nuestro agente de IA filtra candidatos, evalúa habilidades y selecciona los mejores perfiles.",
    services: "Plataforma",
    roofInstallation: "Filtro Inteligente de Candidatos",
    roofRepair: "Agente de Entrevistas Adaptativas",
    solarPanels: "Sistema de Puntuación y Ranking",
    emergencyServices: "Evaluación en Tiempo Real",
    contactInfo: "Contacto",
    hours: "Lun-Vie: 08:00 AM - 6:00 PM",
    legal: "Legal",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos del Servicio",
    rights: "Todos los Derechos Reservados.",
  },
}

export function Footer() {
  const { language } = useLanguage()
  const pathname = usePathname()
  const t = translations[language]
  const currentYear = new Date().getFullYear()

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Logo + Desc */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Link href="/" onClick={handleLogoClick} className="inline-block hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="Scout AI"
                width={112}
                height={70}
                className="h-12 w-auto mb-4"
                priority
              />
            </Link>

            <p className="text-white/80 mb-6 max-w-md leading-relaxed">{t.description}</p>

            {/* Redes */}
            <div className="flex space-x-4 sm:space-x-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-600 transition-colors duration-300 transform hover:scale-110"
              >
                <Instagram className="h-6 w-6 sm:h-8 sm:w-8" />
              </a>
            </div>
          </div>

          {/* Plataforma / Servicios */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t.services}</h3>
            <ul className="space-y-2 sm:space-y-3 text-white/80">
              <li><Link href="/platform" className="hover:text-red-600 transition-colors block py-1">{t.roofInstallation}</Link></li>
              <li><Link href="/platform" className="hover:text-red-600 transition-colors block py-1">{t.roofRepair}</Link></li>
              <li><Link href="/platform" className="hover:text-red-600 transition-colors block py-1">{t.solarPanels}</Link></li>
              <li><Link href="/platform" className="hover:text-red-600 transition-colors block py-1">{t.emergencyServices}</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t.contactInfo}</h3>
            <ul className="space-y-2 sm:space-y-3 text-white/80">

              <li className="py-1">Pasto, Nariño – Colombia</li>
              <li>
                <a href="mailto:contact@talentscoutai.com"
                   className="hover:text-red-600 transition-colors block py-1">
                  contact@talentscoutai.com
                </a>
              </li>
              <li className="py-1">{t.hours}</li>

            </ul>
          </div>
        </div>

        {/* Legal Mobile */}
        <div className="mt-8 pt-8 border-t border-white/20 sm:hidden">
          <h3 className="text-lg font-semibold mb-4 text-center">{t.legal}</h3>
          <div className="flex justify-center space-x-8">
            <Link href="/privacy-policy" className="text-white/80 hover:text-red-600">{t.privacyPolicy}</Link>
            <Link href="/terms" className="text-white/80 hover:text-red-600">{t.termsOfService}</Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <p className="text-white/60 text-sm text-center sm:text-left">
              © {currentYear} Scout AI – {t.rights}
            </p>
            <div className="hidden sm:flex space-x-4 text-sm">
              <Link href="/privacy-policy" className="text-white/60 hover:text-red-600">{t.privacyPolicy}</Link>
              <span className="text-white/40">•</span>
              <Link href="/terms" className="text-white/60 hover:text-red-600">{t.termsOfService}</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
