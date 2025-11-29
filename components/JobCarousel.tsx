"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Building, MapPin, DollarSign, Briefcase } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface JobPosting {
  id: number
  title: string
  department: string
  location: string
  employment_type: string
  salary_range: string
  description: string
  requirements: string
}

interface JobCarouselProps {
  language: 'en' | 'es'
}

export function JobCarousel({ language }: JobCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchActiveJobs()
  }, [])

  const fetchActiveJobs = async () => {
    try {
      // Esta es una llamada pública, no requiere autenticación
      const response = await fetch('/api/public/active-jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % jobs.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + jobs.length) % jobs.length)
  }

  const translations = {
    en: {
      title: "Current Job Opportunities",
      subtitle: "Discover positions that match your profile",
      applyNow: "Apply with your CV below",
      noJobs: "No job openings available at the moment",
      checkBack: "Check back soon for new opportunities",
    },
    es: {
      title: "Oportunidades Laborales Actuales",
      subtitle: "Descubre posiciones que coinciden con tu perfil",
      applyNow: "Postúlate con tu CV abajo",
      noJobs: "No hay vacantes disponibles en este momento",
      checkBack: "Vuelve pronto para nuevas oportunidades",
    }
  }

  const t = translations[language]

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
        <p className="text-gray-400 mt-4">Cargando ofertas...</p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-12 text-center">
          <Briefcase className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t.noJobs}</h3>
          <p className="text-gray-400">{t.checkBack}</p>
        </CardContent>
      </Card>
    )
  }

  const currentJob = jobs[currentIndex]

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-3">{t.title}</h3>
        <p className="text-gray-400">{t.subtitle}</p>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        {jobs.length > 1 && (
          <>
            <Button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 p-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 p-0"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Job Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-500/30 shadow-2xl">
              <CardContent className="p-8">
                {/* Job Title */}
                <div className="mb-6">
                  <h4 className="text-3xl font-bold text-white mb-2">
                    {currentJob.title}
                  </h4>
                  <div className="flex flex-wrap gap-3 text-gray-300">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-red-500" />
                      {currentJob.department}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-red-500" />
                      {currentJob.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-red-500" />
                      {currentJob.employment_type}
                    </div>
                    {currentJob.salary_range && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-red-500" />
                        {currentJob.salary_range}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {currentJob.description.substring(0, 300)}
                    {currentJob.description.length > 300 ? '...' : ''}
                  </p>
                </div>

                {/* Requirements Preview */}
                <div className="mb-6">
                  <h5 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-1 h-6 bg-red-500 mr-3"></span>
                    {language === 'en' ? 'Key Requirements' : 'Requisitos Clave'}
                  </h5>
                  <ul className="space-y-2">
                    {currentJob.requirements
                      .split('\n')
                      .filter(r => r.trim())
                      .slice(0, 3)
                      .map((req, idx) => (
                        <li key={idx} className="flex items-start text-gray-300">
                          <span className="text-red-500 mr-2">•</span>
                          <span>{req.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-white font-semibold mb-2">
                    {language === 'en' ? '👇 Interested in this position?' : '👇 ¿Te interesa esta posición?'}
                  </p>
                  <p className="text-red-400 text-sm">{t.applyNow}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        {jobs.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {jobs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-red-500 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {jobs.length > 1 && (
          <p className="text-center text-gray-400 text-sm mt-4">
            {currentIndex + 1} / {jobs.length}
          </p>
        )}
      </div>
    </div>
  )
}