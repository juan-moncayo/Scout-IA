"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  LogOut, 
  Briefcase, 
  Plus,
  Loader2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  CheckCircle,
  Users,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  FileText,
  Mail,
  Phone,
  Award,
  UserCheck,
  UserX
} from "lucide-react"

interface JobPosting {
  id: number
  title: string
  department: string
  location: string
  employment_type: string
  salary_range: string
  description: string
  requirements: string
  responsibilities: string
  interview_guidelines: string
  created_at: string
  updated_at: string
  is_active: boolean
  candidate_count?: number
}

interface Candidate {
  id: number
  full_name: string
  email: string
  phone: string
  resume_text: string
  cover_letter: string
  ai_evaluation: string | null
  status: 'pending' | 'approved' | 'rejected'
  applied_at: string
  evaluated_at: string | null
}

function HRDashboardContent() {
  const { user, logout, token } = useAuth()
  const [activeTab, setActiveTab] = useState<'postings' | 'candidates'>('postings')
  
  // Estados para vacantes
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [loadingPostings, setLoadingPostings] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPosting, setNewPosting] = useState({
    title: '',
    department: '',
    location: '',
    employment_type: 'Full-time',
    salary_range: '',
    description: '',
    requirements: '',
    responsibilities: '',
    interview_guidelines: ''
  })
  const [creatingPosting, setCreatingPosting] = useState(false)
  const [createSuccess, setCreateSuccess] = useState(false)
  const [createError, setCreateError] = useState('')

  // Estados para editar vacante
  const [editingPosting, setEditingPosting] = useState<JobPosting | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editPostingData, setEditPostingData] = useState<any>(null)
  const [savingPosting, setSavingPosting] = useState(false)

  // Estados para eliminar vacante
  const [deletingPostingId, setDeletingPostingId] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Estados para candidatos
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showCandidateModal, setShowCandidateModal] = useState(false)
  const [processingCandidate, setProcessingCandidate] = useState(false)

  // Cargar datos según tab activo
  useEffect(() => {
    if (activeTab === 'postings') {
      fetchJobPostings()
    } else if (activeTab === 'candidates') {
      fetchCandidates()
    }
  }, [activeTab])

  const fetchJobPostings = async () => {
    setLoadingPostings(true)
    try {
      const response = await fetch('/api/admin/job-postings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setJobPostings(data.postings)
      }
    } catch (error) {
      console.error('Error fetching job postings:', error)
    } finally {
      setLoadingPostings(false)
    }
  }

  const fetchCandidates = async () => {
    setLoadingCandidates(true)
    try {
      const response = await fetch('/api/admin/candidates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCandidates(data.candidates)
      }
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoadingCandidates(false)
    }
  }

  const handleCreatePosting = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingPosting(true)
    setCreateError('')
    setCreateSuccess(false)

    try {
      const response = await fetch('/api/admin/job-postings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPosting)
      })

      const data = await response.json()

      if (response.ok) {
        setCreateSuccess(true)
        setNewPosting({
          title: '',
          department: '',
          location: '',
          employment_type: 'Full-time',
          salary_range: '',
          description: '',
          requirements: '',
          responsibilities: '',
          interview_guidelines: ''
        })
        setShowCreateForm(false)
        fetchJobPostings()
        
        setTimeout(() => setCreateSuccess(false), 3000)
      } else {
        setCreateError(data.error || 'Failed to create job posting')
      }
    } catch (error) {
      setCreateError('Network error. Please try again.')
    } finally {
      setCreatingPosting(false)
    }
  }

  const handleEditPosting = (posting: JobPosting) => {
    setEditingPosting(posting)
    setEditPostingData({
      title: posting.title,
      department: posting.department,
      location: posting.location,
      employment_type: posting.employment_type,
      salary_range: posting.salary_range,
      description: posting.description,
      requirements: posting.requirements,
      responsibilities: posting.responsibilities,
      interview_guidelines: posting.interview_guidelines,
      is_active: posting.is_active
    })
    setShowEditModal(true)
  }

  const handleSavePosting = async () => {
    if (!editingPosting) return

    setSavingPosting(true)
    setCreateError('')

    try {
      const response = await fetch(`/api/admin/job-postings/${editingPosting.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editPostingData)
      })

      const data = await response.json()

      if (response.ok) {
        setShowEditModal(false)
        fetchJobPostings()
        setCreateSuccess(true)
        setTimeout(() => setCreateSuccess(false), 3000)
      } else {
        setCreateError(data.error || 'Failed to update job posting')
      }
    } catch (error) {
      setCreateError('Network error. Please try again.')
    } finally {
      setSavingPosting(false)
    }
  }

  const handleDeletePosting = (postingId: number) => {
    setDeletingPostingId(postingId)
    setShowDeleteConfirm(true)
  }

  const confirmDeletePosting = async () => {
    if (!deletingPostingId) return

    try {
      const response = await fetch(`/api/admin/job-postings/${deletingPostingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setShowDeleteConfirm(false)
        setDeletingPostingId(null)
        fetchJobPostings()
        setCreateSuccess(true)
        setTimeout(() => setCreateSuccess(false), 3000)
      } else {
        const data = await response.json()
        setCreateError(data.error || 'Failed to delete job posting')
      }
    } catch (error) {
      setCreateError('Network error. Please try again.')
    }
  }

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowCandidateModal(true)
  }

  const handleApproveCandidate = async (candidateId: number) => {
    setProcessingCandidate(true)
    setCreateError('')

    try {
      const response = await fetch(`/api/admin/candidates/${candidateId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setShowCandidateModal(false)
        setSelectedCandidate(null)
        fetchCandidates()
        setCreateSuccess(true)
        setTimeout(() => setCreateSuccess(false), 3000)
      } else {
        setCreateError(data.error || 'Failed to approve candidate')
      }
    } catch (error) {
      setCreateError('Network error. Please try again.')
    } finally {
      setProcessingCandidate(false)
    }
  }

  const handleRejectCandidate = async (candidateId: number) => {
    setProcessingCandidate(true)
    setCreateError('')

    try {
      const response = await fetch(`/api/admin/candidates/${candidateId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setShowCandidateModal(false)
        setSelectedCandidate(null)
        fetchCandidates()
        setCreateSuccess(true)
        setTimeout(() => setCreateSuccess(false), 3000)
      } else {
        setCreateError(data.error || 'Failed to reject candidate')
      }
    } catch (error) {
      setCreateError('Network error. Please try again.')
    } finally {
      setProcessingCandidate(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Talent Scout AI"
                width={100}
                height={63}
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-white">Recursos Humanos</h1>
                <p className="text-sm text-gray-400">Gestión de Vacantes y Candidatos</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.full_name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

              <Button
                onClick={logout}
                className="bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === 'postings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('postings')}
            className={activeTab === 'postings' ? 'bg-red-500 hover:bg-red-600 text-white font-semibold' : 'border-gray-700 text-white font-semibold'}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Gestionar Vacantes
          </Button>
          <Button
            variant={activeTab === 'candidates' ? 'default' : 'outline'}
            onClick={() => setActiveTab('candidates')}
            className={activeTab === 'candidates' ? 'bg-red-500 hover:bg-red-600 text-white font-semibold' : 'border-gray-700 text-white font-semibold'}
          >
            <Users className="h-4 w-4 mr-2" />
            Revisar Candidatos
          </Button>
        </div>

        {/* Success Message */}
        {createSuccess && (
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-center space-x-3 mb-6">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-500">¡Operación exitosa!</p>
          </div>
        )}

        {/* Job Postings Tab */}
        {activeTab === 'postings' && (
          <div className="space-y-6">
            {/* Create Posting Button */}
            {!showCreateForm && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Nueva Vacante
              </Button>
            )}

            {/* Create Posting Form */}
            {showCreateForm && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Crear Nueva Vacante</CardTitle>
                  <CardDescription className="text-gray-400">
                    Define los detalles de la posición y las pautas para la IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePosting} className="space-y-4">
                    {createError && (
                      <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-500">{createError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-300">
                          Título del Puesto *
                        </Label>
                        <Input
                          id="title"
                          placeholder="Ej: Diseñador Gráfico Senior"
                          value={newPosting.title}
                          onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-gray-300">
                          Departamento *
                        </Label>
                        <Input
                          id="department"
                          placeholder="Ej: Marketing, Ventas, IT"
                          value={newPosting.department}
                          onChange={(e) => setNewPosting({ ...newPosting, department: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-gray-300">
                          Ubicación *
                        </Label>
                        <Input
                          id="location"
                          placeholder="Ej: Remoto, Ciudad de México, Híbrido"
                          value={newPosting.location}
                          onChange={(e) => setNewPosting({ ...newPosting, location: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employment_type" className="text-gray-300">
                          Tipo de Empleo *
                        </Label>
                        <select
                          id="employment_type"
                          value={newPosting.employment_type}
                          onChange={(e) => setNewPosting({ ...newPosting, employment_type: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md"
                          required
                        >
                          <option value="Full-time">Tiempo Completo</option>
                          <option value="Part-time">Medio Tiempo</option>
                          <option value="Contract">Contrato</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="salary_range" className="text-gray-300">
                          Rango Salarial *
                        </Label>
                        <Input
                          id="salary_range"
                          placeholder="Ej: $30,000 - $45,000 USD/año"
                          value={newPosting.salary_range}
                          onChange={(e) => setNewPosting({ ...newPosting, salary_range: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-300">
                        Descripción del Puesto *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe el puesto, el equipo, y lo que hará el candidato..."
                        value={newPosting.description}
                        onChange={(e) => setNewPosting({ ...newPosting, description: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements" className="text-gray-300">
                        Requisitos *
                      </Label>
                      <Textarea
                        id="requirements"
                        placeholder="Lista los requisitos (educación, experiencia, habilidades técnicas)..."
                        value={newPosting.requirements}
                        onChange={(e) => setNewPosting({ ...newPosting, requirements: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responsibilities" className="text-gray-300">
                        Responsabilidades *
                      </Label>
                      <Textarea
                        id="responsibilities"
                        placeholder="Lista las responsabilidades principales del puesto..."
                        value={newPosting.responsibilities}
                        onChange={(e) => setNewPosting({ ...newPosting, responsibilities: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interview_guidelines" className="text-gray-300">
                        Pautas para la IA (Evaluación Automática) *
                      </Label>
                      <Textarea
                        id="interview_guidelines"
                        placeholder="Ejemplo: 'Evalúa experiencia con Adobe Creative Suite, portafolio de diseño, creatividad, atención al detalle y capacidad para trabajar bajo presión. Prioriza candidatos con +3 años de experiencia.'"
                        value={newPosting.interview_guidelines}
                        onChange={(e) => setNewPosting({ ...newPosting, interview_guidelines: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Estas pautas guiarán a la IA al evaluar automáticamente los CVs de los candidatos
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        className="bg-red-500 hover:bg-red-600"
                        disabled={creatingPosting}
                      >
                        {creatingPosting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creando...
                          </>
                        ) : (
                          'Crear Vacante'
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false)
                          setCreateError('')
                          setNewPosting({
                            title: '',
                            department: '',
                            location: '',
                            employment_type: 'Full-time',
                            salary_range: '',
                            description: '',
                            requirements: '',
                            responsibilities: '',
                            interview_guidelines: ''
                          })
                        }}
                        className="border-gray-700 text-white"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Job Postings List */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Vacantes Publicadas ({jobPostings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPostings ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                  </div>
                ) : jobPostings.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No hay vacantes publicadas. Crea tu primera vacante arriba.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {jobPostings.map((posting) => (
                      <div
                        key={posting.id}
                        className="flex items-start justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">{posting.title}</h3>
                            {posting.is_active ? (
                              <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                                Activa
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                                Inactiva
                              </span>
                            )}
                            {posting.candidate_count && posting.candidate_count > 0 && (
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                                {posting.candidate_count} candidato{posting.candidate_count !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {posting.department}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {posting.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {posting.employment_type}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {posting.salary_range}
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Creada: {new Date(posting.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            onClick={() => handleEditPosting(posting)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            onClick={() => handleDeletePosting(posting.id)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Candidatos Postulados ({candidates.length})</CardTitle>
                <CardDescription className="text-gray-400">
                  Revisa y aprueba candidatos. Al aprobar, se crea automáticamente su usuario.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCandidates ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                  </div>
                ) : candidates.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    Aún no hay candidatos postulados.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-white font-medium text-lg">{candidate.full_name}</h4>
                              <span className={`px-3 py-1 text-xs rounded-full ${
                                candidate.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                candidate.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                'bg-yellow-500/10 text-yellow-500'
                              }`}>
                                {candidate.status === 'approved' ? 'Aprobado' :
                                 candidate.status === 'rejected' ? 'Rechazado' :
                                 'Pendiente'}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-400">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {candidate.email}
                              </div>
                              {candidate.phone && (
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2" />
                                  {candidate.phone}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Aplicó: {new Date(candidate.applied_at).toLocaleDateString()}
                              </div>
                            </div>

                            {candidate.ai_evaluation && (
                              <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Award className="h-4 w-4 text-blue-400" />
                                  <p className="text-sm font-semibold text-blue-400">Evaluación IA</p>
                                </div>
                                <p className="text-xs text-gray-300 line-clamp-3">{candidate.ai_evaluation}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              onClick={() => handleViewCandidate(candidate)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Perfil
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Edit Posting Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Vacante</DialogTitle>
            <DialogDescription className="text-gray-400">
              Actualiza los detalles de la posición
            </DialogDescription>
          </DialogHeader>

          {editPostingData && (
            <div className="space-y-4">
              {createError && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{createError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Título del Puesto</Label>
                  <Input
                    value={editPostingData.title}
                    onChange={(e) => setEditPostingData({...editPostingData, title: e.target.value})}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Departamento</Label>
                  <Input
                    value={editPostingData.department}
                    onChange={(e) => setEditPostingData({...editPostingData, department: e.target.value})}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Ubicación</Label>
                  <Input
                    value={editPostingData.location}
                    onChange={(e) => setEditPostingData({...editPostingData, location: e.target.value})}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Rango Salarial</Label>
                  <Input
                    value={editPostingData.salary_range}
                    onChange={(e) => setEditPostingData({...editPostingData, salary_range: e.target.value})}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Descripción</Label>
                <Textarea
                  value={editPostingData.description}
                  onChange={(e) => setEditPostingData({...editPostingData, description: e.target.value})}
                  className="mt-1 bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-gray-300">Pautas para la IA</Label>
                <Textarea
                  value={editPostingData.interview_guidelines}
                  onChange={(e) => setEditPostingData({...editPostingData, interview_guidelines: e.target.value})}
                  className="mt-1 bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editPostingData.is_active}
                  onChange={(e) => setEditPostingData({...editPostingData, is_active: e.target.checked})}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active" className="text-gray-300">Vacante Activa</Label>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleSavePosting}
                  disabled={savingPosting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {savingPosting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Guardar Cambios
                </Button>
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  className="border-gray-700 text-white"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de que deseas eliminar esta vacante? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="flex space-x-3">
            <Button
              onClick={confirmDeletePosting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Vacante
            </Button>
            <Button
              onClick={() => {
                setShowDeleteConfirm(false)
                setDeletingPostingId(null)
              }}
              variant="outline"
              className="border-gray-700 text-white"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Candidate Modal */}
      <Dialog open={showCandidateModal} onOpenChange={setShowCandidateModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Perfil del Candidato</DialogTitle>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-6">
              {createError && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{createError}</p>
                </div>
              )}

              {/* Basic Info */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Nombre Completo</p>
                    <p className="text-white">{selectedCandidate.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{selectedCandidate.email}</p>
                  </div>
                  {selectedCandidate.phone && (
                    <div>
                      <p className="text-gray-400 text-sm">Teléfono</p>
                      <p className="text-white">{selectedCandidate.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-sm">Fecha de Postulación</p>
                    <p className="text-white">{new Date(selectedCandidate.applied_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Resume/CV */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">CV / Resumen</h3>
                <div className="bg-gray-900 rounded p-4 max-h-64 overflow-y-auto">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedCandidate.resume_text}</p>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedCandidate.cover_letter && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Carta de Presentación</h3>
                  <div className="bg-gray-900 rounded p-4 max-h-48 overflow-y-auto">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedCandidate.cover_letter}</p>
                  </div>
                </div>
              )}

              {/* AI Evaluation */}
              {selectedCandidate.ai_evaluation && (
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-4">
                    <Award className="h-6 w-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Evaluación Automática por IA</h3>
                  </div>
                  <div className="bg-gray-900/50 rounded p-4">
                    <p className="text-gray-200 whitespace-pre-wrap">{selectedCandidate.ai_evaluation}</p>
                  </div>
                  {selectedCandidate.evaluated_at && (
                    <p className="text-xs text-gray-400 mt-2">
                      Evaluado: {new Date(selectedCandidate.evaluated_at).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {selectedCandidate.status === 'pending' && (
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleApproveCandidate(selectedCandidate.id)}
                    disabled={processingCandidate}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingCandidate ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-2" />
                    )}
                    Aprobar y Crear Usuario
                  </Button>
                  <Button
                    onClick={() => handleRejectCandidate(selectedCandidate.id)}
                    disabled={processingCandidate}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {processingCandidate ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserX className="h-4 w-4 mr-2" />
                    )}
                    Rechazar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin>
      <HRDashboardContent />
    </AuthGuard>
  )
}