"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "Privacy Policy",
    subtitle: "Your privacy matters to us. Learn how we protect and handle your personal information.",
    lastUpdated: "Last updated: January 2025",
    sections: {
      introduction: {
        title: "Introduction",
        content: "Scout IA ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our AI recruitment services."
      },
      informationCollect: {
        title: "Information We Collect",
        content: "We may collect information about you in a variety of ways. The information we may collect includes:",
        items: [
          "Personal Data: Name, email address, phone number when you contact us or apply for positions",
          "CV/Resume Data: Educational background, work experience, skills, and professional information",
          "Usage Data: Information about how you use our website, including your IP address, browser type, and pages visited",
          "Communication Data: Records of your communications with us, including emails, chat messages, and voice interview recordings"
        ]
      },
      howWeUse: {
        title: "How We Use Your Information",
        content: "We use the information we collect to:",
        items: [
          "Provide, operate, and maintain our AI recruitment services",
          "Process job applications and match candidates with suitable positions",
          "Conduct AI-powered interviews and candidate evaluations",
          "Improve, personalize, and expand our AI algorithms and services",
          "Understand and analyze how you use our website",
          "Communicate with you about job opportunities and service updates",
          "Send you relevant job recommendations based on your profile"
        ]
      },
      informationSharing: {
        title: "Information Sharing and Disclosure",
        content: "We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:",
        items: [
          "Potential Employers: With your consent, we may share your CV and interview results with companies hiring for positions",
          "Service Providers: We may share information with trusted third parties who assist us in operating our AI services (e.g., cloud hosting, AI processing)",
          "Legal Requirements: We may disclose information if required by law or in response to valid requests by public authorities",
          "Business Transfers: Information may be transferred if we are involved in a merger, acquisition, or sale of assets"
        ]
      },
      dataSecurity: {
        title: "Data Security",
        content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your CV data and interview recordings are encrypted and stored securely. However, no method of transmission over the internet is 100% secure."
      },
      yourRights: {
        title: "Your Privacy Rights",
        content: "Depending on your location, you may have the following rights:",
        items: [
          "Access: Request information about the personal data we hold about you, including your CV and interview records",
          "Correction: Request correction of inaccurate or incomplete personal data",
          "Deletion: Request deletion of your personal data, CV, and interview recordings in certain circumstances",
          "Opt-out: Unsubscribe from job recommendation emails at any time",
          "Data Portability: Request a copy of your data in a machine-readable format"
        ]
      },
      aiProcessing: {
        title: "AI Processing and Automated Decisions",
        content: "Our platform uses artificial intelligence to analyze CVs, conduct interviews, and evaluate candidates. AI-generated scores and recommendations are used to assist in the recruitment process but are not the sole basis for hiring decisions. Human recruiters review all AI recommendations."
      },
      cookies: {
        title: "Cookies and Tracking",
        content: "Our website may use cookies and similar tracking technologies to enhance your browsing experience and improve our AI recommendations. You can control cookie settings through your browser preferences."
      },
      contact: {
        title: "Contact Us",
        content: "If you have questions about this Privacy Policy or our privacy practices, please contact us:",
        contactInfo: [
          "Email: privacy@scoutia.com",
          "Phone: +57 316 5031355",
          "Address: Pasto, Nariño, Colombia",
          "WhatsApp: https://wa.me/573165031355"
        ]
      }
    }
  },
  es: {
    title: "Política de Privacidad",
    subtitle: "Tu privacidad es importante para nosotros. Conoce cómo protegemos y manejamos tu información personal.",
    lastUpdated: "Última actualización: Enero 2025",
    sections: {
      introduction: {
        title: "Introducción",
        content: "Scout IA ('nosotros', 'nuestro', o 'nos') está comprometido a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando visitas nuestro sitio web o usas nuestros servicios de reclutamiento con IA."
      },
      informationCollect: {
        title: "Información que Recopilamos",
        content: "Podemos recopilar información sobre ti de varias maneras. La información que podemos recopilar incluye:",
        items: [
          "Datos Personales: Nombre, dirección de correo electrónico, número de teléfono cuando nos contactas o aplicas a puestos",
          "Datos de CV/Hoja de Vida: Formación académica, experiencia laboral, habilidades e información profesional",
          "Datos de Uso: Información sobre cómo usas nuestro sitio web, incluyendo tu dirección IP, tipo de navegador y páginas visitadas",
          "Datos de Comunicación: Registros de tus comunicaciones con nosotros, incluyendo correos electrónicos, mensajes de chat y grabaciones de entrevistas de voz"
        ]
      },
      howWeUse: {
        title: "Cómo Usamos Tu Información",
        content: "Usamos la información que recopilamos para:",
        items: [
          "Proporcionar, operar y mantener nuestros servicios de reclutamiento con IA",
          "Procesar solicitudes de empleo y emparejar candidatos con puestos adecuados",
          "Realizar entrevistas impulsadas por IA y evaluaciones de candidatos",
          "Mejorar, personalizar y expandir nuestros algoritmos de IA y servicios",
          "Entender y analizar cómo usas nuestro sitio web",
          "Comunicarnos contigo sobre oportunidades laborales y actualizaciones del servicio",
          "Enviarte recomendaciones de trabajo relevantes basadas en tu perfil"
        ]
      },
      informationSharing: {
        title: "Compartir y Divulgación de Información",
        content: "No vendemos, comerciamos o transferimos tu información personal a terceros, excepto en las siguientes circunstancias:",
        items: [
          "Empleadores Potenciales: Con tu consentimiento, podemos compartir tu CV y resultados de entrevista con empresas contratando para puestos",
          "Proveedores de Servicios: Podemos compartir información con terceros confiables que nos ayudan a operar nuestros servicios de IA (ej: hosting en la nube, procesamiento de IA)",
          "Requisitos Legales: Podemos divulgar información si es requerido por ley o en respuesta a solicitudes válidas de autoridades públicas",
          "Transferencias de Negocio: La información puede ser transferida si estamos involucrados en una fusión, adquisición o venta de activos"
        ]
      },
      dataSecurity: {
        title: "Seguridad de Datos",
        content: "Implementamos medidas de seguridad apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Tus datos de CV y grabaciones de entrevistas están encriptados y almacenados de forma segura. Sin embargo, ningún método de transmisión por internet es 100% seguro."
      },
      yourRights: {
        title: "Tus Derechos de Privacidad",
        content: "Dependiendo de tu ubicación, puedes tener los siguientes derechos:",
        items: [
          "Acceso: Solicitar información sobre los datos personales que tenemos sobre ti, incluyendo tu CV y registros de entrevista",
          "Corrección: Solicitar corrección de datos personales inexactos o incompletos",
          "Eliminación: Solicitar eliminación de tus datos personales, CV y grabaciones de entrevistas en ciertas circunstancias",
          "Exclusión: Cancelar suscripción de correos de recomendaciones de trabajo en cualquier momento",
          "Portabilidad de Datos: Solicitar una copia de tus datos en formato legible por máquina"
        ]
      },
      aiProcessing: {
        title: "Procesamiento por IA y Decisiones Automatizadas",
        content: "Nuestra plataforma utiliza inteligencia artificial para analizar CVs, realizar entrevistas y evaluar candidatos. Los puntajes y recomendaciones generados por IA se usan para asistir en el proceso de reclutamiento, pero no son la única base para decisiones de contratación. Reclutadores humanos revisan todas las recomendaciones de IA."
      },
      cookies: {
        title: "Cookies y Seguimiento",
        content: "Nuestro sitio web puede usar cookies y tecnologías de seguimiento similares para mejorar tu experiencia de navegación y mejorar nuestras recomendaciones de IA. Puedes controlar la configuración de cookies a través de las preferencias de tu navegador."
      },
      contact: {
        title: "Contáctanos",
        content: "Si tienes preguntas sobre esta Política de Privacidad o nuestras prácticas de privacidad, por favor contáctanos:",
        contactInfo: [
          "Email: privacy@scoutia.com",
          "Teléfono: +57 316 5031355",
          "Dirección: Pasto, Nariño, Colombia",
          "WhatsApp: https://wa.me/573165031355"
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
  
  const currentLang = language || 'es'
  const t = translations[currentLang] || translations.es

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

                {/* AI Processing */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.aiProcessing.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{t.sections.aiProcessing.content}</p>
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