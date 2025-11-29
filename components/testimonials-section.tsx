"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function TestimonialsSection() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const translations = {
    en: {
      title: "AI Training Highlights",
      subtitle: "Snapshots of AI learning and improvements",
      testimonials: [
        { id: 1, name: "Scout IA", location: "Platform", rating: 5, text: "Successfully evaluated 500+ candidate profiles, improving matching accuracy by 35%." },
        { id: 2, name: "RecruitBot", location: "Platform", rating: 5, text: "Adaptive interview questions reduced average candidate time by 20%, streamlining the hiring process." },
        { id: 3, name: "TalentScout AI", location: "Platform", rating: 5, text: "Automated CV classification achieved 92% precision in skill tagging across diverse industries." },
      ],
    },
    es: {
      title: "Resultados de Entrenamiento de IA",
      subtitle: "Vistazos al aprendizaje y mejoras de la IA",
      testimonials: [
        { id: 1, name: "Scout IA", location: "Plataforma", rating: 5, text: "Evaluó con éxito más de 500 perfiles de candidatos, mejorando la precisión en coincidencias en un 35%." },
        { id: 2, name: "RecruitBot", location: "Plataforma", rating: 5, text: "Las preguntas adaptativas redujeron el tiempo promedio del candidato en un 20%, agilizando el proceso de selección." },
        { id: 3, name: "TalentScout AI", location: "Plataforma", rating: 5, text: "La clasificación automática de CV alcanzó un 92% de precisión en el etiquetado de habilidades en diversas industrias." },
      ],
    },
  };

  const t = translations[language] || translations.es;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`py-20 bg-black text-white transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-work-sans text-3xl md:text-4xl font-bold text-white mb-4">{t.title}</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`border border-gray-700 shadow-lg bg-gray-800 hover:shadow-xl transition-shadow duration-300 group hover:scale-105 ${
                isVisible
                  ? `opacity-100 transform translate-y-0 transition-all duration-1000 delay-${index * 200}`
                  : "opacity-0 transform translate-y-8"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-red-600 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
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
