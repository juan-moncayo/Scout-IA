"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Home, Building2, Zap, Wrench, CheckCircle, ArrowRight, Phone, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// ================= TRANSLATIONS =================
const translations = {
  en: {
    servicesTitle: "Our Expert Services",
    servicesSubtitle: "Comprehensive roofing and solar solutions tailored to your specific needs",
    services: {
      residential: {
        title: "Residential Roofing",
        description: "Complete roofing solutions for your home",
        features: ["New Roof Installation","Roof Replacement","Shingle Repair","Gutter Systems","Attic Ventilation"],
      },
      commercial: {
        title: "Commercial Roofing",
        description: "Professional roofing for businesses and commercial properties",
        features: ["Flat Roof Systems","Metal Roofing","Roof Maintenance","Emergency Repairs","Waterproofing"],
      },
      solar: {
        title: "Solar Solutions",
        description: "Harness the power of the sun for your energy needs",
        features: ["Solar Panel Installation","Battery Storage","Energy Monitoring","Maintenance Plans","Tax Incentive Assistance"],
      },
      maintenance: {
        title: "Maintenance & Repair",
        description: "Keep your roof in perfect condition year-round",
        features: ["Regular Inspections","Preventive Maintenance","Storm Damage Repair","Leak Detection","Emergency Services"],
      },
    },
    whatsIncluded: "What's Included:",
    getEstimate: "Get Free Estimate",
    callNow: "Call Now",
    licensedInsured: "Licensed & Insured",
    testimonialsTitle: "What Our Customers Say",
    testimonialsSubtitle: "Real feedback from satisfied homeowners",
    projectsTitle: "Projects Gallery",
    projectsSubtitle: "Explore our portfolio of successful AI projects that demonstrate the power and efficiency of intelligent recruitment.",
    projects: [
      { title: "AI Candidate Scoring", description: "Automated scoring model for evaluating junior candidates." },
      { title: "Smart Interview Agent", description: "Adaptive interview questions using real-time candidate analysis." },
      { title: "CV Parsing System", description: "Extraction and classification of candidate skills from CVs." },
      { title: "Recruitment Dashboard", description: "Dashboard for tracking talent pipelines and candidate rankings." },
      { title: "AI Behavioral Analysis", description: "Behavioral pattern detection during candidate responses." },
      { title: "Automated Job Matching", description: "AI model that matches candidates with company job profiles." },
    ]
  },
  es: {
    servicesTitle: "Nuestros Servicios Expertos",
    servicesSubtitle: "Soluciones integrales de techos y energía solar adaptadas a sus necesidades",
    services: {
      residential: {
        title: "Techos Residenciales",
        description: "Soluciones completas de techado para hogares",
        features: ["Instalación de Techo Nuevo","Reemplazo de Techo","Reparación de Tejas","Sistemas de Canaletas","Ventilación de Ático"],
      },
      commercial: {
        title: "Techos Comerciales",
        description: "Techado profesional para empresas",
        features: ["Sistemas de Techo Plano","Techado Metálico","Mantenimiento de Techos","Reparaciones de Emergencia","Impermeabilización"],
      },
      solar: {
        title: "Soluciones Solares",
        description: "Aprovecha la energía del sol",
        features: ["Instalación de Paneles Solares","Almacenamiento con Batería","Monitoreo de Energía","Planes de Mantenimiento","Asesoría en Incentivos Fiscales"],
      },
      maintenance: {
        title: "Mantenimiento y Reparación",
        description: "Mantén tu techo en óptimas condiciones todo el año",
        features: ["Inspecciones Regulares","Mantenimiento Preventivo","Reparación por Tormentas","Detección de Filtraciones","Servicios de Emergencia"],
      },
    },
    whatsIncluded: "Qué Incluye:",
    getEstimate: "Cotización Gratuita",
    callNow: "Llamar Ahora",
    licensedInsured: "Licenciado y Asegurado",
    testimonialsTitle: "Lo Que Dicen Nuestros Clientes",
    testimonialsSubtitle: "Comentarios reales de propietarios satisfechos",
    projectsTitle: "Galería de Proyectos",
    projectsSubtitle: "Explora nuestro portafolio de proyectos exitosos de IA aplicados al reclutamiento inteligente.",
    projects: [
      { title: "Sistema de Puntaje de Candidatos", description: "Modelo automatizado que evalúa candidatos junior." },
      { title: "Agente de Entrevistas Inteligente", description: "Preguntas adaptativas según el perfil del candidato." },
      { title: "Parser de Hojas de Vida", description: "Extracción automática de habilidades y datos clave." },
      { title: "Dashboard de Reclutamiento", description: "Panel para gestionar pipelines y rankings de candidatos." },
      { title: "Análisis Conductual por IA", description: "Detección de patrones conductuales durante entrevistas." },
      { title: "Matching Automático de Vacantes", description: "El sistema encuentra el mejor candidato para cada rol." },
    ]
  }
};

// ================= PROJECT IMAGES =================
const projectImages = [
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/ADNR0738.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/HNUE4272.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/LBIZ5431-0510a97.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/XYJD4444.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/SUUV2804.JPG/:/rs=w:1300,h:800",
  "https://img1.wsimg.com/isteam/ip/b9aaa3d7-9f79-4365-adf2-250a3ed47138/OOCA8886.JPG/:/rs=w:1300,h:800",
];

// ================= SERVICES SECTION =================
export function ServicesDetailSection() {
  const [activeService, setActiveService] = useState("residential");
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const t = translations[language] ?? translations.es;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const services = [
    { id: "residential", icon: Home, ...(t.services.residential || {}), image: "/residential-roof-installation.png" },
    { id: "commercial", icon: Building2, ...(t.services.commercial || {}), image: "/commercial-building-roof.png" },
    { id: "solar", icon: Zap, ...(t.services.solar || {}), image: "/solar-panel-installation.png" },
    { id: "maintenance", icon: Wrench, ...(t.services.maintenance || {}), image: "/roof-maintenance-inspection.png" },
  ];
  const currentService = services.find(s => s.id === activeService);

  return (
    <section id="services" ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <h2 className="text-3xl font-bold">{t.servicesTitle}</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">{t.servicesSubtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {services.map(s => {
            const Icon = s.icon;
            return (
              <Button
                key={s.id}
                variant={activeService === s.id ? "default" : "outline"}
                onClick={() => setActiveService(s.id)}
                className={`flex items-center gap-2 text-sm transition-all ${activeService === s.id ? "bg-red-600 text-white hover:bg-red-700" : "border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white"}`}
              >
                <Icon className="h-4 w-4" /> {s.title}
              </Button>
            );
          })}
        </div>

        {currentService && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
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
                {currentService.features.map((f,i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-red-600" /> <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <Link href="/contact">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">{t.getEstimate} <ArrowRight className="ml-2 h-5 w-5" /></Button>
                </Link>
                <Button variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white" onClick={() => window.open("tel:+16823762497", "_self")}>
                  <Phone className="mr-2 h-5 w-5" /> {t.callNow}
                </Button>
              </div>
            </div>

            <div>
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <Image src={currentService.image} alt={currentService.title} width={600} height={400} className="object-cover w-full h-72"/>
                <Badge className="absolute top-4 right-4 bg-red-600 text-white flex items-center gap-1">
                  <Shield className="h-4 w-4" /> {t.licensedInsured}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ================= TESTIMONIALS SECTION =================
export function TestimonialsSection() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const t = translations[language] ?? translations.es;

  const testimonials = [
    { id: 1, name: "Juan Moncayo", location: "Pasto, Colombia", rating: 5, text: "Scout IA me ayudó a automatizar evaluaciones de candidatos junior de manera increíble." },
    { id: 2, name: "Empresa XYZ", location: "Bogotá, Colombia", rating: 5, text: "El sistema de entrevistas inteligentes nos ahorró mucho tiempo y mejoró la calidad de la selección." },
    { id: 3, name: "Reclutador ABC", location: "Medellín, Colombia", rating: 5, text: "El dashboard de reclutamiento y scoring automático es súper útil y fácil de usar." },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className={`py-20 bg-black text-white transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-work-sans text-3xl md:text-4xl font-bold text-white mb-4">{t.testimonialsTitle}</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.testimonialsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className={`border border-gray-700 shadow-lg bg-gray-800 hover:shadow-xl transition-shadow duration-300 group hover:scale-105 ${isVisible ? `opacity-100 transform translate-y-0 transition-all duration-1000 delay-${index*200}` : "opacity-0 transform translate-y-8"}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-red-600 mr-3" />
                  <div className="flex">{[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}</div>
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ================= PROJECTS GALLERY =================
export function ProjectsGallery() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const t = translations[language] ?? translations.es;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          <h2 className="text-4xl font-bold mb-6">{t.projectsTitle}</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">{t.projectsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {t.projects.map((project, index) => (
            <div key={index} className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`} style={{ animationDelay: `${index*100}ms` }}>
              <Card className="border-0 shadow-xl bg-gray-800 overflow-hidden group hover:scale-105 transition-transform h-[480px] flex flex-col">
                <div className="relative h-2/3">
                  <Image src={projectImages[index] || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
                <CardContent className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-6 text-white">{project.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300">{project.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
