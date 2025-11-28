"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content?: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
}

interface BlogModalProps {
  post: BlogPost | null
  isOpen: boolean
  onClose: () => void
}

const translations = {
  en: {
    author: "By",
    readTime: "min read",
    categories: {
      recruitment: "Recruitment",
      ai: "AI",
      hr: "Human Resources",
      tips: "Tips",
      business: "Business"
    },
  },
  es: {
    author: "Por",
    readTime: "min de lectura",
    categories: {
      recruitment: "Reclutamiento",
      ai: "IA",
      hr: "Recursos Humanos",
      tips: "Consejos",
      business: "Negocios"
    },
  },
}

// CONTENIDO REAL DE BLOGS PARA EL AGENTE DE RECLUTAMIENTO
const blogContents = {
  es: {
    1: {
      title: "Cómo un Agente de IA Revoluciona el Reclutamiento en PYMES",
      content: `
El reclutamiento en pequeñas y medianas empresas suele ser lento, manual y lleno de sesgos. Los agentes inteligentes están cambiando ese panorama.

**1. Filtrado Automático de Hojas de Vida**
El agente usa procesamiento de lenguaje natural (NLP) para leer CVs y extraer habilidades, experiencia y logros. Esto elimina trabajo manual y reduce errores.

**2. Entrevistas Automáticas con Preguntas Adaptativas**
El sistema formula preguntas personalizadas según el perfil del candidato. Si detecta que domina un tema, profundiza; si no, cambia el enfoque.

**3. Scoring de Candidatos en Tiempo Real**
El agente genera un puntaje basado en habilidades técnicas, comunicación y compatibilidad con el rol.

**4. Reducción de Sesgos Inconscientes**
La IA analiza únicamente datos relevantes, evitando discriminación por edad, género o apariencia.

**5. Mejora Continua (Network Effect)**
Cuantas más empresas lo usen, más inteligente se vuelve la IA, ajustando preguntas y predicciones.

Implementar un agente así permite contratar más rápido, con mayor precisión y menor costo.
      `
    },
    2: {
      title: "Guía para Crear Preguntas Adaptativas con IA",
      content: `
Las preguntas adaptativas permiten evaluar mejor a un candidato ajustándose a sus respuestas anteriores.

**1. Detectar Nivel de Conocimiento**
Si el candidato menciona una tecnología (React, Python, etc.), la IA genera preguntas más específicas.

**2. Variar Dificultad**
El agente incrementa dificultad si detecta fluidez o retrocede si nota inseguridad.

**3. Evaluar Soft Skills**
La IA analiza el tono, claridad y coherencia de las respuestas para puntuar comunicación y liderazgo.

**4. Generar Reporte Automático**
Al final, la IA resume:
- fortalezas
- debilidades
- probabilidad de éxito en el rol

Este tipo de evaluación es imposible de lograr manualmente sin alto costo.
      `
    },
    3: {
      title: "Errores Comunes al Filtrar Candidatos (y Cómo la IA los Evita)",
      content: `
Muchas PYMES cometen los mismos errores al reclutar, lo que genera contrataciones pobres y rotación alta.

**1. Leer CVs de Forma Superficial**
Los reclutadores humanos a veces pasan por alto detalles clave. La IA analiza todo el contenido.

**2. Juzgar por Apariencia o Forma del CV**
La IA evalúa habilidades reales, no diseño.

**3. Falta de Objetividad**
El agente usa una rúbrica estandarizada para calificar a todos.

**4. No Hacer Preguntas Relevantes**
La IA ajusta preguntas según rol y experiencia del candidato.

Evitar estos errores puede mejorar drásticamente la calidad de contratación.
      `
    }
  }
}

export function BlogModal({ post, isOpen, onClose }: BlogModalProps) {
  const { language } = useLanguage()
  const t = translations[language]

  if (!post) return null

  const getCategoryColor = (category: string) => {
    const colors = {
      recruitment: "bg-blue-500",
      ai: "bg-purple-500",
      hr: "bg-green-500",
      business: "bg-yellow-500",
      tips: "bg-red-500"
    }
    return colors[category.toLowerCase()] || "bg-gray-500"
  }

  const contentData = blogContents[language]?.[post.id]
  const fullContent = contentData ? contentData.content : post.content || post.excerpt

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
        <DialogHeader className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
            <Badge className={`absolute top-4 left-4 ${getCategoryColor(post.category)} text-white`}>
              {t.categories[post.category.toLowerCase() as keyof typeof t.categories] || post.category}
            </Badge>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-white">
            {post.title}
          </DialogTitle>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{t.author} {post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6 prose prose-invert max-w-none">
          {fullContent.split("\n").map((paragraph, index) => {
            if (!paragraph.trim()) return null;

            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return (
                <h3 key={index} className="text-xl font-bold text-white mt-6 mb-4">
                  {paragraph.replace(/\*\*/g, "")}
                </h3>
              );
            }

            return (
              <p key={index} className="mb-4 text-gray-300 leading-relaxed">
                {paragraph.trim()}
              </p>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
