"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "Privacy Policy",
    subtitle: "Your privacy matters to us. Learn how we protect and handle your personal information.",
    lastUpdated: "Last updated: January 2024",
    sections: {
      introduction: {
        title: "Introduction",
        content: "X Roofing & Solar ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services."
      },
      informationCollect: {
        title: "Information We Collect",
        content: "We may collect information about you in a variety of ways. The information we may collect includes:",
        items: [
          "Personal Data: Name, email address, phone number, and mailing address when you contact us or request services",
          "Usage Data: Information about how you use our website, including your IP address, browser type, and pages visited",
          "Communication Data: Records of your communications with us, including emails, phone calls, and chat messages"
        ]
      },
      howWeUse: {
        title: "How We Use Your Information",
        content: "We use the information we collect to:",
        items: [
          "Provide, operate, and maintain our roofing and solar services",
          "Improve, personalize, and expand our website and services",
          "Understand and analyze how you use our website",
          "Communicate with you about our services, including customer service and updates",
          "Send you marketing and promotional communications (with your consent)",
          "Process transactions and send related information"
        ]
      },
      informationSharing: {
        title: "Information Sharing and Disclosure",
        content: "We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:",
        items: [
          "Service Providers: We may share information with trusted third parties who assist us in operating our website and conducting our business",
          "Legal Requirements: We may disclose information if required by law or in response to valid requests by public authorities",
          "Business Transfers: Information may be transferred if we are involved in a merger, acquisition, or sale of assets"
        ]
      },
      dataSecurity: {
        title: "Data Security",
        content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
      },
      yourRights: {
        title: "Your Privacy Rights",
        content: "Depending on your location, you may have the following rights:",
        items: [
          "Access: Request information about the personal data we hold about you",
          "Correction: Request correction of inaccurate or incomplete personal data",
          "Deletion: Request deletion of your personal data in certain circumstances",
          "Opt-out: Unsubscribe from marketing communications at any time"
        ]
      },
      cookies: {
        title: "Cookies and Tracking",
        content: "Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences."
      },
      contact: {
        title: "Contact Us",
        content: "If you have questions about this Privacy Policy or our privacy practices, please contact us:",
        contactInfo: [
          "Email: info@xroofingandsolar.com",
          "Phone: (682) 376-2497",
          "Address: 940 N Belt Line Rd Suite 121 Irving, TX 75061"
        ]
      }
    }
  },
  es: {
    title: "Política de Privacidad",
    subtitle: "Tu privacidad es importante para nosotros. Conoce cómo protegemos y manejamos tu información personal.",
    lastUpdated: "Última actualización: Enero 2024",
    sections: {
      introduction: {
        title: "Introducción",
        content: "X Roofing & Solar ('nosotros', 'nuestro', o 'nos') está comprometido a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando visitas nuestro sitio web o usas nuestros servicios."
      },
      informationCollect: {
        title: "Información que Recopilamos",
        content: "Podemos recopilar información sobre ti de varias maneras. La información que podemos recopilar incluye:",
        items: [
          "Datos Personales: Nombre, dirección de correo electrónico, número de teléfono y dirección postal cuando nos contactas o solicitas servicios",
          "Datos de Uso: Información sobre cómo usas nuestro sitio web, incluyendo tu dirección IP, tipo de navegador y páginas visitadas",
          "Datos de Comunicación: Registros de tus comunicaciones con nosotros, incluyendo correos electrónicos, llamadas telefónicas y mensajes de chat"
        ]
      },
      howWeUse: {
        title: "Cómo Usamos Tu Información",
        content: "Usamos la información que recopilamos para:",
        items: [
          "Proporcionar, operar y mantener nuestros servicios de techado y energía solar",
          "Mejorar, personalizar y expandir nuestro sitio web y servicios",
          "Entender y analizar cómo usas nuestro sitio web",
          "Comunicarnos contigo sobre nuestros servicios, incluyendo atención al cliente y actualizaciones",
          "Enviarte comunicaciones de marketing y promocionales (con tu consentimiento)",
          "Procesar transacciones y enviar información relacionada"
        ]
      },
      informationSharing: {
        title: "Compartir y Divulgación de Información",
        content: "No vendemos, comerciamos o transferimos tu información personal a terceros, excepto en las siguientes circunstancias:",
        items: [
          "Proveedores de Servicios: Podemos compartir información con terceros confiables que nos ayudan a operar nuestro sitio web y realizar nuestro negocio",
          "Requisitos Legales: Podemos divulgar información si es requerido por ley o en respuesta a solicitudes válidas de autoridades públicas",
          "Transferencias de Negocio: La información puede ser transferida si estamos involucrados en una fusión, adquisición o venta de activos"
        ]
      },
      dataSecurity: {
        title: "Seguridad de Datos",
        content: "Implementamos medidas de seguridad apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por internet es 100% seguro."
      },
      yourRights: {
        title: "Tus Derechos de Privacidad",
        content: "Dependiendo de tu ubicación, puedes tener los siguientes derechos:",
        items: [
          "Acceso: Solicitar información sobre los datos personales que tenemos sobre ti",
          "Corrección: Solicitar corrección de datos personales inexactos o incompletos",
          "Eliminación: Solicitar eliminación de tus datos personales en ciertas circunstancias",
          "Exclusión: Cancelar suscripción de comunicaciones de marketing en cualquier momento"
        ]
      },
      cookies: {
        title: "Cookies y Seguimiento",
        content: "Nuestro sitio web puede usar cookies y tecnologías de seguimiento similares para mejorar tu experiencia de navegación. Puedes controlar la configuración de cookies a través de las preferencias de tu navegador."
      },
      contact: {
        title: "Contáctanos",
        content: "Si tienes preguntas sobre esta Política de Privacidad o nuestras prácticas de privacidad, por favor contáctanos:",
        contactInfo: [
          "Email: info@xroofingandsolar.com",
          "Teléfono: (682) 376-2497",
          "Dirección: 940 N Belt Line Rd Suite 121 Irving, TX 75061"
        ]
      }
    }
  }
}

export default function PrivacyPolicyPage() {
  const { language } = useLanguage()
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)
  
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  
  // Fallback para el idioma
  const currentLang = language || 'en'
  const t = translations[currentLang] || translations.en
  
  console.log('Privacy Policy - Current language:', currentLang) // Debug

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) {
              setIsHeroVisible(true)
            } else if (entry.target === contentRef.current) {
              setIsContentVisible(true)
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) observer.observe(heroRef.current)
    if (contentRef.current) observer.observe(contentRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section ref={heroRef} className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className={`transition-all duration-1000 ${
                isHeroVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
              }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                {currentLang === 'es' ? (
                  <><span className="text-red-500">Política de</span> Privacidad</>
                ) : (
                  <><span className="text-red-500">Privacy</span> Policy</>
                )}
              </h1>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.subtitle}</p>
              <p className="text-sm text-gray-400 mt-4">{t.lastUpdated}</p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section ref={contentRef} className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 delay-200 ${
                isContentVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
              }`}
            >
              <div className="prose prose-lg max-w-none text-white prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300">
                
                {/* Introduction */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.introduction.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{t.sections.introduction.content}</p>
                </div>

                {/* Information We Collect */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.informationCollect.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.informationCollect.content}</p>
                  <ul className="space-y-2">
                    {t.sections.informationCollect.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* How We Use Information */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.howWeUse.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.howWeUse.content}</p>
                  <ul className="space-y-2">
                    {t.sections.howWeUse.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Information Sharing */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.informationSharing.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.informationSharing.content}</p>
                  <ul className="space-y-2">
                    {t.sections.informationSharing.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Data Security */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.dataSecurity.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{t.sections.dataSecurity.content}</p>
                </div>

                {/* Your Rights */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.yourRights.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.yourRights.content}</p>
                  <ul className="space-y-2">
                    {t.sections.yourRights.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Cookies */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.cookies.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{t.sections.cookies.content}</p>
                </div>

                {/* Contact */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.contact.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.contact.content}</p>
                  <ul className="space-y-2">
                    {t.sections.contact.contactInfo.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}