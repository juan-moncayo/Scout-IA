"use client"

import { useRef, useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { useLanguage } from "@/contexts/language-context"

export default function AboutUsPage() {
  const { language } = useLanguage()
  const currentLang = language || "es"

  const sectionRef = useRef<HTMLDivElement>(null)

  const team = [
    {
      name: "Juan Moncayo",
      role: "Programador FullStack",
      bio: "Desarrollador apasionado por sistemas y soluciones web.",
      bg: "bg-red-500",
    },
    {
      name: "Jairo Potosi",
      role: "Diseñador UX/UI",
      bio: "Creador de experiencias visuales atractivas y funcionales.",
      bg: "bg-blue-500",
    },
    {
      name: "Jhon Caicedo",
      role: "Project Manager",
      bio: "Organiza proyectos y coordina equipos para el éxito.",
      bg: "bg-green-500",
    },
  ]

  const scrollToCareers = () => {
    const element = document.getElementById("careers-section")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <motion.section
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-24 bg-gradient-to-br from-red-900 via-black to-black relative"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
            <Sparkles className="h-5 w-5 text-red-400" />
            <span className="text-red-400 text-sm font-medium">
              {currentLang === "es" ? "Conoce Nuestro Equipo" : "Meet Our Team"}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {currentLang === "es" ? "Sobre Scout IA" : "About Scout IA"}
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            {currentLang === "es"
              ? "Somos un equipo apasionado por la tecnología y la inteligencia artificial, enfocados en crear soluciones innovadoras y efectivas para empresas y profesionales."
              : "We are a passionate team of technology and AI enthusiasts, focused on creating innovative and effective solutions for businesses and professionals."}
          </p>
        </motion.section>

        {/* Team */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8 max-w-7xl mx-auto py-20"
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.8 }}
            >
              <Card className="bg-gray-900 border border-gray-700 shadow-xl hover:scale-105 transition-transform duration-300">
                <CardHeader className="text-center">
                  <div
                    className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold ${member.bg}`}
                  >
                    {member.name.split(" ")[0][0]}
                  </div>
                  <CardTitle className="mt-4">{member.name}</CardTitle>
                  <CardDescription className="text-gray-400">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-16"
        >
          <Button
            className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-5 shadow-xl hover:shadow-2xl transition-all"
            onClick={scrollToCareers}
          >
            {currentLang === "es"
              ? "Envía tu CV y únete al equipo"
              : "Send your CV and join the team"}
          </Button>
        </motion.section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}
