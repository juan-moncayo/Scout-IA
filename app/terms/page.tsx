"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

const translations = {
  en: {
    title: "Terms of Service",
    subtitle: "Please read these terms carefully before using our roofing and solar services.",
    lastUpdated: "Last updated: January 2024",
    sections: {
      acceptance: {
        title: "Acceptance of Terms",
        content: "By accessing and using the services of X Roofing & Solar ('Company', 'we', 'us', or 'our'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
      },
      services: {
        title: "Our Services",
        content: "X Roofing & Solar provides professional roofing and solar installation services including:",
        items: [
          "Roof installation, repair, and maintenance",
          "Solar panel installation and system design",
          "Emergency roofing services",
          "Home improvement consultations",
          "Warranty and maintenance services"
        ]
      },
      serviceAgreement: {
        title: "Service Agreement",
        content: "All roofing and solar services are provided subject to a separate service agreement. Key terms include:",
        items: [
          "Written estimates and contracts are required for all projects",
          "Work schedules are subject to weather conditions and material availability",
          "Changes to original scope require written approval and may affect pricing",
          "Payment terms are specified in individual contracts",
          "Permits and inspections are handled according to local regulations"
        ]
      },
      warranties: {
        title: "Warranties and Guarantees",
        content: "We provide warranties on our work and materials as follows:",
        items: [
          "Labor warranty: Varies by project type and scope (typically 1-5 years)",
          "Material warranties: As provided by manufacturers",
          "Solar system warranties: Performance and equipment warranties as specified",
          "Warranty claims must be reported promptly and in writing",
          "Warranties may be voided by unauthorized modifications or improper maintenance"
        ]
      },
      limitations: {
        title: "Limitations of Liability",
        content: "Our liability is limited as follows:",
        items: [
          "We are not liable for damages caused by acts of nature, vandalism, or normal wear and tear",
          "Our maximum liability is limited to the contract price of the specific project",
          "We are not responsible for consequential or indirect damages",
          "Claims must be made within the warranty period specified in your contract",
          "We maintain appropriate insurance coverage for our operations"
        ]
      },
      customerResponsibilities: {
        title: "Customer Responsibilities",
        content: "As our customer, you agree to:",
        items: [
          "Provide accurate information about your property and needs",
          "Ensure safe access to work areas",
          "Obtain necessary permissions from HOAs or landlords if applicable",
          "Make timely payments according to contract terms",
          "Report any concerns or issues promptly",
          "Follow recommended maintenance procedures"
        ]
      },
      intellectual: {
        title: "Intellectual Property",
        content: "All designs, proposals, and custom solutions created by X Roofing & Solar remain our intellectual property until paid for in full. You may not reproduce or distribute our proprietary designs without written permission."
      },
      cancellation: {
        title: "Cancellation Policy",
        content: "Project cancellations are subject to the following terms:",
        items: [
          "You may cancel within 3 business days of signing a contract (cooling-off period)",
          "Cancellations after work has begun may be subject to costs for completed work and materials",
          "We reserve the right to cancel projects due to safety concerns or permit issues",
          "Emergency services may have different cancellation terms"
        ]
      },
      compliance: {
        title: "Legal Compliance",
        content: "We operate in compliance with all applicable laws and regulations including building codes, safety regulations, and licensing requirements. All work is performed by licensed and insured professionals."
      },
      disputes: {
        title: "Dispute Resolution",
        content: "Any disputes arising from our services will be resolved through:",
        items: [
          "Direct communication and good faith negotiation",
          "Mediation through a mutually agreed mediator if needed",
          "Arbitration or litigation in Dallas County, Texas courts",
          "Texas state law governs these terms and any disputes"
        ]
      },
      modifications: {
        title: "Modifications to Terms",
        content: "We reserve the right to modify these terms at any time. Changes will be posted on our website and take effect immediately for new contracts. Existing contracts remain subject to the terms in effect at the time of signing."
      },
      contact: {
        title: "Contact Information",
        content: "For questions about these Terms of Service or our services, contact us:",
        contactInfo: [
          "Email: info@xroofingandsolar.com",
          "Phone: (682) 376-2497",
          "Address: 940 N Belt Line Rd Suite 121 Irving, TX 75061",
          "Business Hours: Monday-Friday 10:00 AM - 4:00 PM"
        ]
      }
    }
  },
  es: {
    title: "Términos de Servicio",
    subtitle: "Por favor lee estos términos cuidadosamente antes de usar nuestros servicios de techado y energía solar.",
    lastUpdated: "Última actualización: Enero 2024",
    sections: {
      acceptance: {
        title: "Aceptación de Términos",
        content: "Al acceder y usar los servicios de X Roofing & Solar ('Compañía', 'nosotros', 'nuestro'), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con estos términos, por favor no uses nuestros servicios."
      },
      services: {
        title: "Nuestros Servicios",
        content: "X Roofing & Solar proporciona servicios profesionales de techado e instalación solar incluyendo:",
        items: [
          "Instalación, reparación y mantenimiento de techos",
          "Instalación de paneles solares y diseño de sistemas",
          "Servicios de emergencia de techado",
          "Consultas de mejoras del hogar",
          "Servicios de garantía y mantenimiento"
        ]
      },
      serviceAgreement: {
        title: "Acuerdo de Servicio",
        content: "Todos los servicios de techado y solar se proporcionan sujetos a un acuerdo de servicio separado. Los términos clave incluyen:",
        items: [
          "Se requieren estimaciones y contratos escritos para todos los proyectos",
          "Los horarios de trabajo están sujetos a condiciones climáticas y disponibilidad de materiales",
          "Los cambios al alcance original requieren aprobación escrita y pueden afectar el precio",
          "Los términos de pago se especifican en contratos individuales",
          "Los permisos e inspecciones se manejan según las regulaciones locales"
        ]
      },
      warranties: {
        title: "Garantías",
        content: "Proporcionamos garantías en nuestro trabajo y materiales de la siguiente manera:",
        items: [
          "Garantía de mano de obra: Varía por tipo y alcance del proyecto (típicamente 1-5 años)",
          "Garantías de materiales: Según lo proporcionado por los fabricantes",
          "Garantías de sistemas solares: Garantías de rendimiento y equipo según se especifique",
          "Las reclamaciones de garantía deben reportarse prontamente y por escrito",
          "Las garantías pueden ser anuladas por modificaciones no autorizadas o mantenimiento inadecuado"
        ]
      },
      limitations: {
        title: "Limitaciones de Responsabilidad",
        content: "Nuestra responsabilidad está limitada de la siguiente manera:",
        items: [
          "No somos responsables por daños causados por actos de la naturaleza, vandalismo o desgaste normal",
          "Nuestra responsabilidad máxima está limitada al precio del contrato del proyecto específico",
          "No somos responsables por daños consecuentes o indirectos",
          "Las reclamaciones deben hacerse dentro del período de garantía especificado en tu contrato",
          "Mantenemos cobertura de seguro apropiada para nuestras operaciones"
        ]
      },
      customerResponsibilities: {
        title: "Responsabilidades del Cliente",
        content: "Como nuestro cliente, aceptas:",
        items: [
          "Proporcionar información precisa sobre tu propiedad y necesidades",
          "Asegurar acceso seguro a las áreas de trabajo",
          "Obtener permisos necesarios de HOAs o propietarios si aplica",
          "Hacer pagos oportunos según los términos del contrato",
          "Reportar cualquier preocupación o problema prontamente",
          "Seguir los procedimientos de mantenimiento recomendados"
        ]
      },
      intellectual: {
        title: "Propiedad Intelectual",
        content: "Todos los diseños, propuestas y soluciones personalizadas creadas por X Roofing & Solar siguen siendo nuestra propiedad intelectual hasta ser pagadas en su totalidad. No puedes reproducir o distribuir nuestros diseños propietarios sin permiso escrito."
      },
      cancellation: {
        title: "Política de Cancelación",
        content: "Las cancelaciones de proyectos están sujetas a los siguientes términos:",
        items: [
          "Puedes cancelar dentro de 3 días hábiles de firmar un contrato (período de reflexión)",
          "Las cancelaciones después de que el trabajo haya comenzado pueden estar sujetas a costos por trabajo completado y materiales",
          "Nos reservamos el derecho de cancelar proyectos debido a preocupaciones de seguridad o problemas de permisos",
          "Los servicios de emergencia pueden tener términos de cancelación diferentes"
        ]
      },
      compliance: {
        title: "Cumplimiento Legal",
        content: "Operamos en cumplimiento con todas las leyes y regulaciones aplicables incluyendo códigos de construcción, regulaciones de seguridad y requisitos de licencias. Todo el trabajo es realizado por profesionales licenciados y asegurados."
      },
      disputes: {
        title: "Resolución de Disputas",
        content: "Cualquier disputa que surja de nuestros servicios será resuelta a través de:",
        items: [
          "Comunicación directa y negociación de buena fe",
          "Mediación a través de un mediador mutuamente acordado si es necesario",
          "Arbitraje o litigio en las cortes del Condado de Dallas, Texas",
          "La ley del estado de Texas gobierna estos términos y cualquier disputa"
        ]
      },
      modifications: {
        title: "Modificaciones a los Términos",
        content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán publicados en nuestro sitio web y tomarán efecto inmediatamente para nuevos contratos. Los contratos existentes permanecen sujetos a los términos en efecto al momento de la firma."
      },
      contact: {
        title: "Información de Contacto",
        content: "Para preguntas sobre estos Términos de Servicio o nuestros servicios, contáctanos:",
        contactInfo: [
          "Email: info@xroofingandsolar.com",
          "Teléfono: (682) 376-2497",
          "Dirección: 940 N Belt Line Rd Suite 121 Irving, TX 75061",
          "Horario de Atención: Lunes-Viernes 10:00 AM - 4:00 PM"
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
  
  // Fallback para el idioma
  const currentLang = language || 'en'
  const t = translations[currentLang] || translations.en
  
  console.log('Terms - Current language:', currentLang) // Debug

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

                {/* Warranties */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.warranties.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.warranties.content}</p>
                  <ul className="space-y-2">
                    {t.sections.warranties.items.map((item, index) => (
                      <li key={index} className="text-gray-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
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

                {/* Customer Responsibilities */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{t.sections.customerResponsibilities.title}</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">{t.sections.customerResponsibilities.content}</p>
                  <ul className="space-y-2">
                    {t.sections.customerResponsibilities.items.map((item, index) => (
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