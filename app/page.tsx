"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CareersSection } from "@/components/careers-section"; // ⭐ NUEVO
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SplashScreen } from "@/components/splash-screen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const handleSplashComplete = () => {
    setSplashFade(true);
    setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        setHeroVisible(true);
      }, 50);
    }, 100);
  };

  return (
    <>
      <div className="relative min-h-screen bg-black">
        {showSplash && (
          <SplashScreen
            onComplete={handleSplashComplete}
            fadeOut={splashFade}
          />
        )}

        <main
          className={`bg-black transition-opacity duration-700 ${
            showSplash ? "opacity-0" : "opacity-100"
          }`}
        >
          <Header />
          <HeroSection key={heroVisible ? 'visible' : 'hidden'} startAnimation={heroVisible} />
          <div className="section-black">
            <AboutSection />
          </div>
          <div className="section-black">
            <TestimonialsSection />
          </div>
          {/* Seccion de cv */}
          <CareersSection />
          <div className="section-white">
            <ContactSection />
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}