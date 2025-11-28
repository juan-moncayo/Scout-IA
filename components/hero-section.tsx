"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const translations = {
  en: {
    title: "Your Intelligent Recruiting Agent",
    titleAccent: "for Small Businesses",
    subtitle:
      "Scout IA optimizes your hiring process with smart filtering, adaptive interviews, and candidate scoring — all automated.",
    getQuote: "Ir al Agente",
    viewWork: "Ver Funcionalidades",
    qualityTitle: "Evaluación Inteligente",
    qualityDesc: "Preguntas adaptativas según el perfil del candidato",
    solarTitle: "Filtrado Automático",
    solarDesc: "Procesa CVs y clasifica candidatos por habilidades",
    experienceTitle: "Optimización Continua",
    experienceDesc: "El sistema mejora conforme más empresas lo usan",
  },
  es: {
    title: "Tu Agente Inteligente de Reclutamiento",
    titleAccent: "para PYMES",
    subtitle:
      "Scout IA optimiza tu proceso de selección con filtrado automático, entrevistas adaptativas y puntuación avanzada de candidatos.",
    getQuote: "Ir al Agente",
    viewWork: "Ver Funcionalidades",
    qualityTitle: "Evaluación Inteligente",
    qualityDesc: "Preguntas adaptativas basadas en el perfil del candidato",
    solarTitle: "Filtrado Automático",
    solarDesc: "Procesamiento y clasificación de CVs en segundos",
    experienceTitle: "Optimización Continua",
    experienceDesc: "El agente mejora con cada proceso realizado",
  },
};

interface HeroSectionProps {
  startAnimation?: boolean;
}

export function HeroSection({ startAnimation = false }: HeroSectionProps) {
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { language } = useLanguage();

  const t = translations[language];

  useEffect(() => {
    if (!isInitialized) {
      setTitleVisible(false);
      setSubtitleVisible(false);
      setButtonsVisible(false);
      setCardsVisible(false);
      setIsInitialized(true);
    }

    if (startAnimation && isInitialized) {
      const titleTimer = setTimeout(() => setTitleVisible(true), 100);
      const subtitleTimer = setTimeout(() => setSubtitleVisible(true), 500);
      const buttonsTimer = setTimeout(() => setButtonsVisible(true), 900);
      const cardsTimer = setTimeout(() => setCardsVisible(true), 1300);

      return () => {
        clearTimeout(titleTimer);
        clearTimeout(subtitleTimer);
        clearTimeout(buttonsTimer);
        clearTimeout(cardsTimer);
      };
    } else if (!startAnimation) {
      const titleTimer = setTimeout(() => setTitleVisible(true), 300);
      const subtitleTimer = setTimeout(() => setSubtitleVisible(true), 600);
      const buttonsTimer = setTimeout(() => setButtonsVisible(true), 900);
      const cardsTimer = setTimeout(() => setCardsVisible(true), 1200);

      return () => {
        clearTimeout(titleTimer);
        clearTimeout(subtitleTimer);
        clearTimeout(buttonsTimer);
        clearTimeout(cardsTimer);
      };
    }
  }, [startAnimation, isInitialized]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 sm:pt-32 md:pt-36"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover brightness-90 contrast-125"
        >
          <source src="/videos/hero-section.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <div
          className={`transition-all duration-[980ms] ease-out transform ${
            titleVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="font-work-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            <span className="block">{t.title}</span>{" "}
            <span className="text-accent block">{t.titleAccent}</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-all duration-[980ms] ease-out transform ${
            subtitleVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
            {t.subtitle}
          </p>
        </div>

        {/* Buttons */}
        <div
          className={`transition-all duration-[980ms] ease-out transform ${
            buttonsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Button
              size="lg"
              className="button-hover bg-accent text-accent-foreground hover:bg-accent/90 group w-full sm:w-auto"
              onClick={() => (window.location.href = "/agente")}
            >
              {t.getQuote}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="button-hover border-2 border-white text-white hover:bg-white hover:text-black bg-transparent w-full sm:w-auto"
              onClick={() => (window.location.href = "/funcionalidades")}
            >
              {t.viewWork}
            </Button>
          </div>
        </div>

        {/* Cards */}
        <div
          className={`transition-all duration-[980ms] ease-out transform ${
            cardsVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            
            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg card-hover border border-white/20">
              <Shield className="h-12 w-12 text-accent mb-4" />
              <h3 className="font-work-sans text-lg font-semibold mb-2 text-white">{t.qualityTitle}</h3>
              <p className="text-white/80 text-center">{t.qualityDesc}</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg card-hover border border-white/20">
              <Zap className="h-12 w-12 text-accent mb-4" />
              <h3 className="font-work-sans text-lg font-semibold mb-2 text-white">{t.solarTitle}</h3>
              <p className="text-white/80 text-center">{t.solarDesc}</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg card-hover border border-white/20">
              <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-xl mb-4">
                IA
              </div>
              <h3 className="font-work-sans text-lg font-semibold mb-2 text-white">{t.experienceTitle}</h3>
              <p className="text-white/80 text-center">{t.experienceDesc}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
