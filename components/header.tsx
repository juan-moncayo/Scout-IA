"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";

const translations = {
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    getQuote: "Go to Agent",
  },
  es: {
    home: "Inicio",
    about: "Nosotros",
    services: "Servicios",
    getQuote: "Ir al Agente",
  },
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToCareers = () => {
    const element = document.getElementById("careers-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { href: "/", label: t.home },
    { href: "/about", label: t.about },
    { href: "/services", label: t.services },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Scout IA"
              width={140}
              height={88}
              className="h-14 w-auto transition-transform duration-300 hover:rotate-3"
              priority
            />
            <span className="font-bold text-lg text-black">Scout IA</span>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-black hover:text-red-500 transition-all duration-300 font-medium group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                <span className="absolute inset-0 bg-red-500/10 rounded-md scale-0 transition-transform duration-300 group-hover:scale-100 -z-10"></span>
              </Link>
            ))}
          </nav>

          {/* LANG + CTA */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:scale-105 transition-transform duration-300 text-black hover:text-red-500"
                >
                  <Globe className="h-4 w-4" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")}>
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={scrollToCareers}
            >
              {t.getQuote}
            </Button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:scale-110 transition-transform duration-300 text-black p-3"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </Button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-slide-in-bottom">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-black hover:text-red-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col space-y-2 px-3 py-2">
                {/* LANG MOBILE */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Globe className="h-4 w-4" />
                      {language.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setLanguage("en")}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("es")}>
                      Español
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* CTA MOBILE */}
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 w-full text-white"
                  onClick={() => {
                    scrollToCareers();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {t.getQuote}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
