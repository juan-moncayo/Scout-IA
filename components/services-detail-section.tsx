"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Building2, Zap, Shield, Wrench, CheckCircle, ArrowRight, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

const translations = {
  en: {
    title: "Our Expert Services",
    subtitle: "Comprehensive roofing and solar solutions tailored to your specific needs",
    services: {
      residential: {
        title: "Residential Roofing",
        description: "Complete roofing solutions for your home",
        features: [
          "New Roof Installation",
          "Roof Replacement",
          "Shingle Repair",
          "Gutter Systems",
          "Attic Ventilation",
        ],
      },
      commercial: {
        title: "Commercial Roofing",
        description: "Professional roofing for businesses and commercial properties",
        features: [
          "Flat Roof Systems",
          "Metal Roofing",
          "Roof Maintenance",
          "Emergency Repairs",
          "Waterproofing",
        ],
      },
      solar: {
        title: "Solar Solutions",
        description: "Harness the power of the sun for your energy needs",
        features: [
          "Solar Panel Installation",
          "Battery Storage",
          "Energy Monitoring",
          "Maintenance Plans",
          "Tax Incentive Assistance",
        ],
      },
      maintenance: {
        title: "Maintenance & Repair",
        description: "Keep your roof in perfect condition year-round",
        features: [
          "Regular Inspections",
          "Preventive Maintenance",
          "Storm Damage Repair",
          "Leak Detection",
          "Emergency Services",
        ],
      },
    },
    whatsIncluded: "What's Included:",
    getEstimate: "Get Free Estimate",
    callNow: "Call Now",
    licensedInsured: "Licensed & Insured",
  },

  es: {
    title: "Nuestros Servicios Expertos",
    subtitle: "Soluciones integrales de techos y energía solar adaptadas a sus necesidades",
    services: {
      residential: {
        title: "Techos Residenciales",
        description: "Soluciones completas de techado para hogares",
        features: [
          "Instalación de Techo Nuevo",
          "Reemplazo de Techo",
          "Reparación de Tejas",
          "Sistemas de Canaletas",
          "Ventilación de Ático",
        ],
      },
      commercial: {
        title: "Techos Comerciales",
        description: "Techado profesional para empresas",
        features: [
          "Sistemas de Techo Plano",
          "Techado Metálico",
          "Mantenimiento de Techos",
          "Reparaciones de Emergencia",
          "Impermeabilización",
        ],
      },
      solar: {
        title: "Soluciones Solares",
        description: "Aprovecha la energía del sol",
        features: [
          "Instalación de Paneles Solares",
          "Almacenamiento con Batería",
          "Monitoreo de Energía",
          "Planes de Mantenimiento",
          "Asesoría en Incentivos Fiscales",
        ],
      },
      maintenance: {
        title: "Mantenimiento y Reparación",
        description: "Mantén tu techo en óptimas condiciones todo el año",
        features: [
          "Inspecciones Regulares",
          "Mantenimiento Preventivo",
          "Reparación por Tormentas",
          "Detección de Filtraciones",
          "Servicios de Emergencia",
        ],
      },
    },
    whatsIncluded: "Qué Incluye:",
    getEstimate: "Cotización Gratuita",
    callNow: "Llamar Ahora",
    licensedInsured: "Licenciado y Asegurado",
  },
};

export function ServicesDetailSection() {
  const [activeService, setActiveService] = useState("residential");
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fallback seguro
  const t = translations[language] || translations.es;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Armado de servicios con fallback
  const services = [
    {
      id: "residential",
      icon: Home,
      ...(t.services?.residential || {}),
      image: "/residential-roof-installation.png",
    },
    {
      id: "commercial",
      icon: Building2,
      ...(t.services?.commercial || {}),
      image: "/commercial-building-roof.png",
    },
    {
      id: "solar",
      icon: Zap,
      ...(t.services?.solar || {}),
      image: "/solar-panel-installation.png",
    },
    {
      id: "maintenance",
      icon: Wrench,
      ...(t.services?.maintenance || {}),
      image: "/roof-maintenance-inspection.png",
    },
  ];

  const currentService = services.find((s) => s.id === activeService);

  return (
    <section id="services" ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <h2 className="text-3xl font-bold">{t.title}</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* BOTONES */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {services.map((service) => {
            const IconComponent = service.icon;

            return (
              <Button
                key={service.id}
                variant={activeService === service.id ? "default" : "outline"}
                onClick={() => setActiveService(service.id)}
                className={`flex items-center gap-2 text-sm transition-all ${
                  activeService === service.id
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {service.title}
              </Button>
            );
          })}
        </div>

        {/* DETALLES */}
        {currentService && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Texto */}
            <div className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600 rounded-lg">
                  <currentService.icon className="h-8 w-8 text-white" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold">{currentService.title}</h3>
                  <p className="text-gray-800">{currentService.description}</p>
                </div>
              </div>

              <h4 className="font-semibold mt-6">{t.whatsIncluded}</h4>
              <div className="space-y-2 mt-3">
                {(currentService.features || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <Link href="/contact">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    {t.getEstimate}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white"
                  onClick={() => window.open("tel:+16823762497", "_self")}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  {t.callNow}
                </Button>
              </div>
            </div>

            {/* Imagen */}
            <div>
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={currentService.image}
                  alt={currentService.title}
                  className="w-full h-72 object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-red-600 text-white flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  {t.licensedInsured}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
