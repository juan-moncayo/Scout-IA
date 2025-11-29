// app/training/admin/knowledge/page.tsx
"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { 
  LogOut, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen,
  Filter,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Save,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"

interface KnowledgeItem {
  id: number
  category: string
  question: string
  answer: string
  keywords: string[]
  phase?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

function KnowledgeManagementContent() {
  const { user, logout, token } = useAuth()
  const router = useRouter()

  // Estados
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Modal estados
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form estados
  const [formData, setFormData] = useState({
    category: "",
    question: "",
    answer: "",
    keywords: "",
    phase: ""
  })

  // Feedback
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Cargar datos
  useEffect(() => {
    fetchKnowledge()
  }, [])

  const fetchKnowledge = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/knowledge', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setKnowledge(data.knowledge)
        setCategories(data.categories || [])
      } else {
        showError('Error al cargar el conocimiento')
      }
    } catch (error) {
      console.error('Error:', error)
      showError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage("")

    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)

      if (keywordsArray.length === 0) {
        showError('Debes agregar al menos una palabra clave')
        setIsSaving(false)
        return
      }

      const response = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: formData.category,
          question: formData.question,
          answer: formData.answer,
          keywords: keywordsArray,
          phase: formData.phase ? parseInt(formData.phase) : undefined
        })
      })

      if (response.ok) {
        showSuccess('Conocimiento creado exitosamente')
        setShowCreateModal(false)
        resetForm()
        fetchKnowledge()
      } else {
        const data = await response.json()
        showError(data.error || 'Error al crear')
      }
    } catch (error) {
      showError('Error de conexión')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    setIsSaving(true)
    setErrorMessage("")

    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)

      const response = await fetch(`/api/admin/knowledge/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: formData.category,
          question: formData.question,
          answer: formData.answer,
          keywords: keywordsArray,
          phase: formData.phase ? parseInt(formData.phase) : undefined
        })
      })

      if (response.ok) {
        showSuccess('Conocimiento actualizado exitosamente')
        setShowEditModal(false)
        setEditingItem(null)
        resetForm()
        fetchKnowledge()
      } else {
        const data = await response.json()
        showError(data.error || 'Error al actualizar')
      }
    } catch (error) {
      showError('Error de conexión')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este conocimiento?')) return

    try {
      const response = await fetch(`/api/admin/knowledge/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showSuccess('Conocimiento eliminado exitosamente')
        fetchKnowledge()
      } else {
        showError('Error al eliminar')
      }
    } catch (error) {
      showError('Error de conexión')
    }
  }

  const openEditModal = (item: KnowledgeItem) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      question: item.question,
      answer: item.answer,
      keywords: item.keywords.join(', '),
      phase: item.phase?.toString() || ""
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      category: "",
      question: "",
      answer: "",
      keywords: "",
      phase: ""
    })
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(""), 5000)
  }

  // Filtrar conocimiento
  const filteredKnowledge = knowledge.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => router.push('/training/admin')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Image
                src="/logo.png"
                alt="Scout IA"
                width={100}
                height={63}
                className="h-8 sm:h-10 w-auto"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Knowledge Base</h1>
                <p className="text-xs sm:text-sm text-gray-400">Gestión de Conocimiento para IA</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.full_name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

              <Button
                onClick={logout}
                className="bg-red-600 text-white hover:bg-red-700"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 bg-green-500/10 border border-green-500 rounded-lg p-3 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-500 text-sm">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-center space-x-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Entradas</p>
                  <p className="text-3xl font-bold text-white">{knowledge.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Categorías</p>
                  <p className="text-3xl font-bold text-white">{categories.length}</p>
                </div>
                <Filter className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Filtradas</p>
                  <p className="text-3xl font-bold text-white">{filteredKnowledge.length}</p>
                </div>
                <Search className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Create Button */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar en preguntas, respuestas o keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-black"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 text-black rounded-md"
              >
                <option value="all">📚 Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Create Button */}
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Conocimiento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge List */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              Entradas de Conocimiento ({filteredKnowledge.length})
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gestiona la información que la IA usa para responder preguntas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
              </div>
            ) : filteredKnowledge.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  {searchTerm || selectedCategory !== "all" 
                    ? "No se encontraron resultados con los filtros actuales" 
                    : "No hay entradas de conocimiento. Crea la primera."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredKnowledge.map(item => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/30">
                            {item.category}
                          </span>
                          {item.phase && (
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/30">
                              Fase {item.phase}
                            </span>
                          )}
                        </div>

                        <h4 className="text-white font-semibold mb-2">{item.question}</h4>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.answer}</p>

                        <div className="flex flex-wrap gap-1">
                          {item.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditModal(item)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Crear Nueva Entrada de Conocimiento</DialogTitle>
            <DialogDescription className="text-gray-400">
              Agrega información que la IA usará para responder preguntas
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Categoría *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="ej: evaluacion_candidatos"
                  className="bg-white border-gray-300 text-black"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Fase (opcional)</Label>
                <Input
                  type="number"
                  value={formData.phase}
                  onChange={(e) => setFormData({...formData, phase: e.target.value})}
                  placeholder="1, 2, 3..."
                  className="bg-white border-gray-300 text-black"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Pregunta *</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                placeholder="¿Cómo evaluar candidatos?"
                className="bg-white border-gray-300 text-black"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Respuesta *</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                placeholder="Respuesta detallada..."
                className="bg-white border-gray-300 text-black min-h-[120px]"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Keywords (separadas por comas) *</Label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                placeholder="evaluación, candidatos, entrevista"
                className="bg-white border-gray-300 text-black"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Palabras clave para búsqueda</p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Conocimiento</DialogTitle>
            <DialogDescription className="text-gray-400">
              Actualiza la información existente
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Categoría *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="bg-white border-gray-300 text-black"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-300">Fase (opcional)</Label>
                <Input
                  type="number"
                  value={formData.phase}
                  onChange={(e) => setFormData({...formData, phase: e.target.value})}
                  className="bg-white border-gray-300 text-black"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Pregunta *</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="bg-white border-gray-300 text-black"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Respuesta *</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                className="bg-white border-gray-300 text-black min-h-[120px]"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Keywords (separadas por comas) *</Label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                className="bg-white border-gray-300 text-black"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingItem(null)
                  resetForm()
                }}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function KnowledgeManagementPage() {
  return (
    <AuthGuard requireAdmin>
      <KnowledgeManagementContent />
    </AuthGuard>
  )
}