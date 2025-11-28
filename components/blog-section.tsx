"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { BlogModal } from "./blog-modal"

export function BlogSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { language } = useLanguage()

  const translations = {
    es: {
      title: "Últimos Artículos y Tendencias en Reclutamiento",
      subtitle: "Explora ideas, estrategias y buenas prácticas para potenciar tus procesos de selección con IA",
      readMore: "Leer más",
      viewAll: "Ver todos los artículos",
      blogPosts: [
        {
          id: 1,
          title: "Cómo un Agente de IA Revoluciona el Reclutamiento en PYMES",
          excerpt:
            "Descubre cómo un agente inteligente puede filtrar candidatos, hacer entrevistas y puntuar perfiles en minutos.",
          author: "Equipo Talent Scout AI",
          date: "2024-02-01",
          readTime: "6 min de lectura",
          category: "Reclutamiento",
          image: "/reclutamiento-ia.jpg",
        },
        {
          id: 2,
          title: "Guía para Crear Preguntas Adaptativas con IA",
          excerpt:
            "Las entrevistas automáticas ahora pueden ajustarse a cada candidato según sus respuestas en tiempo real.",
          author: "Equipo Talent Scout AI",
          date: "2024-01-18",
          readTime: "7 min de lectura",
          category: "IA",
          image: "/entrevista-ia.jpg",
        },
        {
          id: 3,
          title: "Errores Comunes al Filtrar Candidatos (y Cómo la IA los Evita)",
          excerpt:
            "Muchas empresas pierden talento por errores simples. La IA ayuda a eliminar sesgos y mejorar decisiones.",
          author: "Equipo Talent Scout AI",
          date: "2024-01-10",
          readTime: "5 min de lectura",
          category: "Recursos Humanos",
          image: "/filtro-candidatos.jpg",
        },
      ],
    },

    en: {
      title: "Latest Insights on AI Recruitment",
      subtitle: "Explore ideas and strategies to enhance your hiring process using intelligent automation",
      readMore: "Read more",
      viewAll: "View all articles",
      blogPosts: [
        {
          id: 1,
          title: "How an AI Agent Is Transforming Recruitment for Small Businesses",
          excerpt:
            "Learn how an intelligent agent can screen candidates, conduct interviews, and score profiles in minutes.",
          author: "Talent Scout AI Team",
          date: "2024-02-01",
          readTime: "6 min read",
          category: "Recruitment",
          image: "/reclutamiento-ia.jpg",
        },
        {
          id: 2,
          title: "Guide to Building Adaptive Interview Questions with AI",
          excerpt:
            "Automated interviews can now adjust to each candidate based on real-time responses.",
          author: "Talent Scout AI Team",
          date: "2024-01-18",
          readTime: "7 min read",
          category: "AI",
          image: "/entrevista-ia.jpg",
        },
        {
          id: 3,
          title: "Common Mistakes When Screening Candidates (and How AI Fixes Them)",
          excerpt:
            "Companies often lose great talent due to simple mistakes. AI removes bias and improves decision-making.",
          author: "Talent Scout AI Team",
          date: "2024-01-10",
          readTime: "5 min read",
          category: "Human Resources",
          image: "/filtro-candidatos.jpg",
        },
      ],
    },
  }

  const t = translations[language]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section
        id="blog"
        ref={sectionRef}
        className={`py-20 bg-white transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-work-sans text-3xl md:text-4xl font-bold text-black mb-4">{t.title}</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {t.blogPosts.map((post) => (
              <Card
                key={post.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-200 bg-white ${
                  hoveredCard === post.id ? "transform -translate-y-2" : ""
                }`}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-600 text-white">{post.category}</Badge>
                </div>

                <CardHeader>
                  <CardTitle className="font-work-sans text-xl group-hover:text-red-600 transition-colors text-black">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{post.excerpt}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-red-600 group-hover:text-white transition-colors text-black"
                    onClick={() => setSelectedPost(post)}
                  >
                    {t.readMore}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog">
              <Button
                size="lg"
                variant="outline"
                className="button-hover border-gray-300 text-black hover:bg-red-600 hover:text-white hover:border-red-600 bg-transparent"
              >
                {t.viewAll}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {selectedPost && <BlogModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />}
    </>
  )
}
