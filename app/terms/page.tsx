"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "Terms of Service",
    subtitle: "Please read these terms carefully before using our AI recruitment services.",
    lastUpdated: "Last updated: January 2025",
    sections: {
      acceptance: {
        title: "Acceptance of Terms",
        content: "By accessing and using the services of Scout IA ('Company', 'we', 'us', or 'our'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
      },
      services: {
        title: "Our Services",
        content: "Scout IA provides AI-powered recruitment and candidate evaluation services including:",
        items: [
          "Automated CV/resume analysis and parsing",
          "AI-driven voice interviews with candidates",
          "Intelligent candidate matching with job positions",
          "Automated candidate scoring and evaluation",
          "Interview transcription and analysis services"
        ]
      },
      serviceAgreement: {
        title: "Service Agreement",
        content: "All AI recruitment services are provided subject to the following terms:",
        items: [
          "Service agreements can be established through our online platform",
          "AI evaluations are assistive tools and do not replace human decision-making",
          "Interview schedules are coordinated through our platform",
          "Pricing is based on usage tiers and number of evaluations",
          "Data retention policies comply with applicable privacy regulations"
        ]
      },
      accuracy: {
        title: "AI Accuracy and Limitations",
        content: "While our AI systems are highly sophisticated, users should be aware:",
        items: [
          "AI evaluations are recommendations, not final hiring decisions",
          "Results may vary based on input data quality",
          "Human recruiters should review all AI-generated assessments",
          "We continuously improve our algorithms but cannot guarantee 100% accuracy",
          "Cultural and language nuances may affect evaluation results"
        ]
      },
      dataUsage: {
        title: "Data Usage and Privacy",
        content: "Your use of our services involves data processing:",
        items: [
          "CVs and personal data are processed in accordance with our Privacy Policy",
          "Interview recordings are encrypted and securely stored",
          "Candidate data is only shared with authorized recruiters",
          "We do not sell candidate data to third parties",
          "Users can request data deletion in accordance with privacy laws"
        ]
      },
      userResponsibilities: {
        title: "User Responsibilities",
        content: "As a user of Scout IA, you agree to:",
        items: [
          "Provide accurate and truthful information in your CV/resume",
          "Respond honestly during AI-conducted interviews",
          "Comply with interview scheduling and attendance requirements",
          "Not attempt to manipulate or deceive the AI evaluation system",
          "Respect confidentiality of proprietary AI evaluation methods",
          "Report any technical issues or concerns promptly"
        ]
      },
      recruiterResponsibilities: {
        title: "Recruiter Responsibilities",
        content: "Companies and recruiters using our platform agree to:",
        items: [
          "Use AI evaluations as one component of hiring decisions",
          "Comply with anti-discrimination and employment laws",
          "Provide accurate job descriptions and requirements",
          "Respect candidate privacy and data protection rights",
          "Not misuse candidate data obtained through our platform",
          "Provide feedback on AI evaluation accuracy when requested"
        ]
      },
      intellectual: {
        title: "Intellectual Property",
        content: "All AI algorithms, evaluation methods, interview frameworks, and proprietary technologies used by Scout IA remain our exclusive intellectual property. You may not reverse engineer, copy, or reproduce our AI systems without written permission."
      },
      cancellation: {
        title: "Cancellation and Refund Policy",
        content: "Service cancellations and refunds are subject to:",
        items: [
          "Subscription services can be canceled with 30 days notice",
          "Completed evaluations are non-refundable",
          "Unused evaluation credits may be refunded within 90 days",
          "Interview no-shows by candidates are not eligible for refunds",
          "We reserve the right to terminate accounts violating these terms"
        ]
      },
      compliance: {
        title: "Legal Compliance",
        content: "Scout IA operates in compliance with applicable laws including data protection regulations (GDPR, CCPA), employment laws, and AI ethics guidelines. Our AI systems are designed to be fair, transparent, and non-discriminatory."
      },
      limitations: {
        title: "Limitations of Liability",
        content: "Our liability is limited as follows:",
        items: [
          "We are not liable for hiring decisions made based on AI recommendations",
          "Maximum liability is limited to fees paid in the past 12 months",
          "We are not responsible for candidate misrepresentation or fraud",
          "Technical issues or service interruptions may occur without liability",
          "We maintain appropriate professional liability insurance"
        ]
      },
      disputes: {
        title: "Dispute Resolution",
        content: "Any disputes arising from our services will be resolved through:",
        items: [
          "Direct communication and good faith negotiation",
          "Mediation through a mutually agreed mediator if needed",
          "Arbitration under Colombian commercial arbitration rules",
          "Colombian law governs these terms and any disputes"
        ]
      },
      modifications: {
        title: "Modifications to Terms",
        content: "We reserve the right to modify these terms at any time. Changes will be posted on our website and users will be notified via email. Continued use of services after changes constitutes acceptance of modified terms."
      },
      contact: {
        title: "Contact Information",
        content: "For questions about these Terms of Service or our services, contact us:",
        contactInfo: [
          "Email: legal@scoutia.com",
          "Phone: +57 316 5031355",
          "Address: Pasto, Nariño, Colombia",
          "WhatsApp: https://wa.me/573165031355"
        ]
      }
    }
  },
  es: {
    title: "Términos de Servicio",
    subtitle: "Por favor lee estos términos cuidadosamente antes de usar nuestros servicios de reclutamiento con IA.",
    lastUpdated: "Última actualización: Enero 2025",
    sections: {
      acceptance: {
        title: "Aceptación de Términos",
        content: "Al acceder y usar los servicios de Scout IA ('Compañía', 'nosotros', 'nuestro'), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con estos términos, por favor no uses nuestros servicios."
      },
      services: {
        title: "Nuestros Servicios",
        content: "Scout IA proporciona servicios de reclutamiento y evaluación de candidatos impulsados por IA, incluyendo:",
        items: [
          "Análisis y extracción automática de CVs/hojas de vida",
          "Entrevistas de voz impulsadas por IA con candidatos",
          "Emparejamiento inteligente de candidatos con puestos de trabajo",
          "Puntuación y evaluación automática de candidatos",
          "Servicios de transcripción y análisis de entrevistas"
        ]
      },
      serviceAgreement: {
        title: "Acuerdo de Servicio",
        content: "Todos los servicios de reclutamiento con IA se proporcionan sujetos a los siguientes términos:",
        items: [
          "Los acuerdos de servicio se pueden establecer a través de nuestra plataforma en línea",
          "Las evaluaciones de IA son herramientas asistivas y no reemplazan la toma de decisiones humanas",
          "Los horarios de entrevista se coordinan a través de nuestra plataforma",
          "Los precios se basan en niveles de uso y número de evaluaciones",
          "Las políticas de retención de datos cumplen con las regulaciones de privacidad aplicables"
        ]
      },
      accuracy: {
        title: "Precisión y Limitaciones de la IA",
        content: "Aunque nuestros sistemas de IA son altamente sofisticados, los usuarios deben estar conscientes:",
        items: [
          "Las evaluaciones de IA son recomendaciones, no decisiones finales de contratación",
          "Los resultados pueden variar según la calidad de los datos de entrada",
          "Los reclutadores humanos deben revisar todas las evaluaciones generadas por IA",
          "Mejoramos continuamente nuestros algoritmos pero no podemos garantizar 100% de precisión",
          "Los matices culturales y de idioma pueden afectar los resultados de evaluación"
        ]
      },
      dataUsage: {
        title: "Uso de Datos y Privacidad",
        content: "Tu uso de nuestros servicios implica procesamiento de datos:",
        items: [
          "Los CVs y datos personales se procesan de acuerdo con nuestra Política de Privacidad",
          "Las grabaciones de entrevistas están encriptadas y almacenadas de forma segura",
          "Los datos de candidatos solo se comparten con reclutadores autorizados",
          "No vendemos datos de candidatos a terceros",
          "Los usuarios pueden solicitar eliminación de datos de acuerdo con las leyes de privacidad"
        ]
      },
      userResponsibilities: {
        title: "Responsabilidades del Usuario",
        content: "Como usuario de Scout IA, aceptas:",
        items: [
          "Proporcionar información precisa y veraz en tu CV/hoja de vida",
          "Responder honestamente durante entrevistas realizadas por IA",
          "Cumplir con los requisitos de programación y asistencia a entrevistas",
          "No intentar manipular o engañar al sistema de evaluación de IA",
          "Respetar la confidencialidad de los métodos de evaluación de IA propietarios",
          "Reportar cualquier problema técnico o inquietud prontamente"
        ]
      },
      recruiterResponsibilities: {
        title: "Responsabilidades del Reclutador",
        content: "Las empresas y reclutadores que usan nuestra plataforma aceptan:",
        items: [
          "Usar las evaluaciones de IA como un componente de las decisiones de contratación",
          "Cumplir con las leyes anti-discriminación y de empleo",
          "Proporcionar descripciones y requisitos de trabajo precisos",
          "Respetar la privacidad y los derechos de protección de datos de los candidatos",
          "No hacer mal uso de los datos de candidatos obtenidos a través de nuestra plataforma",
          "Proporcionar retroalimentación sobre la precisión de la evaluación de IA cuando se solicite"
        ]
      },
      intellectual: {
        title: "Propiedad Intelectual",
        content: "Todos los algoritmos de IA, métodos de evaluación, marcos de entrevista y tecnologías propietarias utilizadas por Scout IA siguen siendo nuestra propiedad intelectual exclusiva. No puedes realizar ingeniería inversa, copiar o reproducir nuestros sistemas de IA sin permiso escrito."
      },
      cancellation: {
        title: "Política de Cancelación y Reembolso",
        content: "Las cancelaciones de servicio y reembolsos están sujetos a:",
        items: [
          "Los servicios de suscripción pueden cancelarse con 30 días de aviso",
          "Las evaluaciones completadas no son reembolsables",
          "Los créditos de evaluación no utilizados pueden reembolsarse dentro de 90 días",
          "Las inasistencias a entrevistas por parte de candidatos no son elegibles para reembolso",
          "Nos reservamos el derecho de terminar cuentas que violen estos términos"
        ]
      },
      compliance: {
        title: "Cumplimiento Legal",
        content: "Scout IA opera en cumplimiento con las leyes aplicables incluyendo regulaciones de protección de datos (GDPR, CCPA), leyes de empleo y directrices de ética de IA. Nuestros sistemas de IA están diseñados para ser justos, transparentes y no discriminatorios."
      },
      limitations: {
        title: "Limitaciones de Responsabilidad",
        content: "Nuestra responsabilidad está limitada de la siguiente manera:",
        items: [
          "No somos responsables por decisiones de contratación basadas en recomendaciones de IA",
          "La responsabilidad máxima está limitada a las tarifas pagadas en los últimos 12 meses",
          "No somos responsables por tergiversación o fraude del candidato",
          "Pueden ocurrir problemas técnicos o interrupciones del servicio sin responsabilidad",
          "Mantenemos seguro de responsabilidad profesional apropiado"
        ]
      },
      disputes: {
        title: "Resolución de Disputas",
        content: "Cualquier disputa que surja de nuestros servicios será resuelta a través de:",
        items: [
          "Comunicación directa y negociación de buena fe",
          "Mediación a través de un mediador mutuamente acordado si es necesario",
          "Arbitraje bajo las reglas de arbitraje comercial colombianas",
          "La ley colombiana gobierna estos términos y cualquier disputa"
        ]
      },
      modifications: {
        title: "Modificaciones a los Términos",
        content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se publicarán en nuestro sitio web y se notificará a los usuarios por correo electrónico. El uso continuado de los servicios después de los cambios constituye aceptación de los términos modificados."
      },
      contact: {
        title: "Información de Contacto",
        content: "Para preguntas sobre estos Términos de Servicio o nuestros servicios, contáctanos:",
        contactInfo: [
          "Email: legal@scoutia.com",
          "Teléfono: +57 316 5031355",
          "Dirección: Pasto, Nariño, Colombia",
          "WhatsApp: https://wa.me/573165031355"
        ]
      }
    }
  }
}

export default function TermsOfServicePage() {
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
                  <><span className="text-red-500">Términos de</span> Servicio</>
                ) : (
                  <><span className="text-red-500">Terms of</span> Service</>
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
                
                {/* Acceptance of Terms */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.acceptance.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{t.sections.acceptance.content}</p>
                </div>

                {/* Our Services */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.services.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.services.content}</p>
                  <ul className="space-y-2">
                    {t.sections.services.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Service Agreement */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.serviceAgreement.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.serviceAgreement.content}</p>
                  <ul className="space-y-2">
                    {t.sections.serviceAgreement.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* AI Accuracy */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.accuracy.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.accuracy.content}</p>
                  <ul className="space-y-2">
                    {t.sections.accuracy.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Data Usage */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.dataUsage.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.dataUsage.content}</p>
                  <ul className="space-y-2">
                    {t.sections.dataUsage.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* User Responsibilities */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.userResponsibilities.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.userResponsibilities.content}</p>
                  <ul className="space-y-2">
                    {t.sections.userResponsibilities.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Recruiter Responsibilities */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.recruiterResponsibilities.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.recruiterResponsibilities.content}</p>
                  <ul className="space-y-2">
                    {t.sections.recruiterResponsibilities.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Intellectual Property */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.intellectual.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{t.sections.intellectual.content}</p>
                </div>

                {/* Cancellation Policy */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.cancellation.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.cancellation.content}</p>
                  <ul className="space-y-2">
                    {t.sections.cancellation.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Legal Compliance */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.compliance.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{t.sections.compliance.content}</p>
                </div>

                {/* Limitations */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.limitations.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.limitations.content}</p>
                  <ul className="space-y-2">
                    {t.sections.limitations.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Dispute Resolution */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.disputes.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.disputes.content}</p>
                  <ul className="space-y-2">
                    {t.sections.disputes.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Modifications to Terms */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.modifications.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{t.sections.modifications.content}</p>
                </div>

                {/* Contact Information */}
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