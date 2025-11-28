export interface Module {
  id: string
  phase: number
  title: string
  description: string
  duration: string
  content: ModuleContent[]
  quiz?: QuizQuestion[]
  requiresExam?: boolean
}

export interface ModuleContent {
  type: 'text' | 'image' | 'text-image' | 'example' | 'checklist' | 'warning' | 'exam' | 'video' // 👈 ADDED 'video'
  title?: string
  text?: string
  image?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  imageSize?: 'small' | 'medium' | 'large'
  imageStyle?: 'square' | 'rectangle' | 'circle'
  items?: string[]
  example?: {
    title: string
    scenario: string
    correct: string
    incorrect: string
  }
  // 👇 NEW: Video properties
  videoUrl?: string
  videoTitle?: string
  // Exam properties
  description?: string
  passingScore?: number
  questions?: Question[]
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Question {
  id: number
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correctAnswer: 'A' | 'B' | 'C' | 'D'
}