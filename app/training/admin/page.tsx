"use client"

import { useState, useEffect, useMemo } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CandidateModal } from "@/components/candidate-modal"
import { 
  LogOut, 
  Briefcase, 
  Plus,
  Loader2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Save,
  CheckCircle,
  Users,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Sparkles,
  UserCheck,
  Award,
  XCircle,
  Search,
  Filter,
  Menu,
  X as CloseIcon
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
  fit_score: number
  status: 'pending' | 'approved' | 'rejected'
  applied_at: string
  evaluated_at: string | null
}

interface ApprovedAgent {
  id: number
  email: string
  full_name: string
  role: string
  is_active: boolean
  onboarding_completed: boolean
  created_at: string
  last_login: string | null
  voice_exam_passed: number
  voice_exam_date: string | null
  voice_exam_score: number | null
}

function HRDashboardContent() {
  const { user, logout, token } = useAuth()
  const [activeTab, setActiveTab] = useState<'postings' | 'candidates' | 'approved-agents'>('candidates')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Estados para vacantes
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [loadingPostings, setLoadingPostings] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [postingSearch, setPostingSearch] = useState('')
  const [postingFilter, setPostingFilter] = useState<'all' | 'active' | 'inactive'>('all')
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
  const [candidateSearch, setCandidateSearch] = useState('')
  const [candidateStatusFilter, setCandidateStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [candidateSortBy, setCandidateSortBy] = useState<'score' | 'date'>('score')

  // Estados para Candidatos Aprobados
  const [approvedAgents, setApprovedAgents] = useState<ApprovedAgent[]>([])
  const [loadingApprovedAgents, setLoadingApprovedAgents] = useState(false)
  const [agentSearch, setAgentSearch] = useState('')
  const [agentFilter, setAgentFilter] = useState<'all' | 'active' | 'inactive' | 'exam-passed'>('all')

  // Cargar datos según tab activo
  useEffect(() => {
    if (activeTab === 'postings') {
      fetchJobPostings()
    } else if (activeTab === 'candidates') {
      fetchCandidates()
    } else if (activeTab === 'approved-agents') {
      fetchApprovedAgents()
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

  const fetchApprovedAgents = async () => {
    setLoadingApprovedAgents(true)
    try {
      const response = await fetch('/api/admin/approved-agents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApprovedAgents(data.agents)
      }
    } catch (error) {
      console.error('Error fetching approved agents:', error)
    } finally {
      setLoadingApprovedAgents(false)
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
        
        alert(`✅ Usuario creado exitosamente!\n\nEmail: ${selectedCandidate?.email}\nContraseña temporal: ${data.tempPassword}\n\nNOTA: En producción, esto se enviaría por email.`)
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

  // 🔍 FILTROS Y ORDENAMIENTO con useMemo para performance

  // Filtrar y ordenar candidatos (SOLO PENDIENTES Y RECHAZADOS, NO APROBADOS)
  const filteredAndSortedCandidates = useMemo(() => {
    return candidates
      .filter(candidate => {
        // NO mostrar candidatos aprobados en esta pestaña
        if (candidate.status === 'approved') return false
        
        const matchesSearch = candidate.full_name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
                             candidate.email.toLowerCase().includes(candidateSearch.toLowerCase())
        const matchesStatus = candidateStatusFilter === 'all' || candidate.status === candidateStatusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (candidateSortBy === 'score') {
          return b.fit_score - a.fit_score
        } else {
          return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
        }
      })
  }, [candidates, candidateSearch, candidateStatusFilter, candidateSortBy])

  // Filtrar vacantes
  const filteredPostings = useMemo(() => {
    return jobPostings.filter(posting => {
      const matchesSearch = posting.title.toLowerCase().includes(postingSearch.toLowerCase()) ||
                           posting.department.toLowerCase().includes(postingSearch.toLowerCase())
      const matchesFilter = postingFilter === 'all' ||
                           (postingFilter === 'active' && posting.is_active) ||
                           (postingFilter === 'inactive' && !posting.is_active)
      return matchesSearch && matchesFilter
    })
  }, [jobPostings, postingSearch, postingFilter])

  // Filtrar Candidatos Aprobados
  const filteredAgents = useMemo(() => {
    return approvedAgents.filter(agent => {
      const matchesSearch = agent.full_name.toLowerCase().includes(agentSearch.toLowerCase()) ||
                           agent.email.toLowerCase().includes(agentSearch.toLowerCase())
      const matchesFilter = agentFilter === 'all' ||
                           (agentFilter === 'active' && agent.is_active) ||
                           (agentFilter === 'inactive' && !agent.is_active) ||
                           (agentFilter === 'exam-passed' && agent.voice_exam_passed === 1)
      return matchesSearch && matchesFilter
    })
  }, [approvedAgents, agentSearch, agentFilter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {/* Header - RESPONSIVE */}
      <header className="bg-black/40 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo.png"
                alt="Scout IA"
                width={100}
                height={63}
                className="h-8 sm:h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-white">Recursos Humanos</h1>
                <p className="text-xs sm:text-sm text-gray-400">Gestión de Vacantes y Candidatos</p>
              </div>
            </div>

            {/* Desktop user info */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.full_name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

              <Button
                onClick={logout}
                className="bg-red-600 text-white hover:bg-red-700 transition-colors"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-gray-800 hover:bg-gray-700"
              size="sm"
            >
              {mobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4 space-y-3">
              <div className="text-white">
                <p className="font-medium">{user?.full_name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
              <Button
                onClick={logout}
                className="w-full bg-red-600 text-white hover:bg-red-700"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Navigation Tabs - BOTONES BLANCOS */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-6 sm:mb-8">
          <Button
            variant="default"
            onClick={() => setActiveTab('candidates')}
            className="bg-white text-black hover:bg-gray-100 font-semibold justify-start sm:justify-center"
          >
            <Users className="h-4 w-4 mr-2" />
            Candidatos
          </Button>
          <Button
            variant="default"
            onClick={() => setActiveTab('postings')}
            className="bg-white text-black hover:bg-gray-100 font-semibold justify-start sm:justify-center"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Vacantes
          </Button>
          <Button
            variant="default"
            onClick={() => setActiveTab('approved-agents')}
            className="bg-white text-black hover:bg-gray-100 font-semibold justify-start sm:justify-center"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Candidatos Aprobados
          </Button>
        </div>

        {/* Success Message */}
        {createSuccess && (
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 sm:p-4 flex items-center space-x-3 mb-4 sm:mb-6">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-green-500 text-sm sm:text-base">¡Operación exitosa!</p>
          </div>
        )}

        {/* CANDIDATES TAB - SOLO MUESTRA PENDIENTES Y RECHAZADOS */}
        {activeTab === 'candidates' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Filtros Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  {/* Búsqueda */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                    />
                  </div>

                  {/* Filtros */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex-1">
                      <select
                        value={candidateStatusFilter}
                        onChange={(e) => setCandidateStatusFilter(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-md text-sm"
                      >
                        <option value="all">📋 Todos los estados</option>
                        <option value="pending">⏳ Pendientes</option>
                        <option value="rejected">❌ Rechazados</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <select
                        value={candidateSortBy}
                        onChange={(e) => setCandidateSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-md text-sm"
                      >
                        <option value="score">🎯 Mejor puntuación</option>
                        <option value="date">📅 Más recientes</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-400">
                    Mostrando {filteredAndSortedCandidates.length} candidatos
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de candidatos */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg sm:text-xl">
                  Candidatos Postulados ({filteredAndSortedCandidates.length})
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Revisa y aprueba candidatos. Al aprobar, se crea automáticamente su usuario.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCandidates ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                  </div>
                ) : filteredAndSortedCandidates.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 text-sm">
                    {candidateSearch || candidateStatusFilter !== 'all' 
                      ? 'No se encontraron candidatos con los filtros actuales.' 
                      : 'Aún no hay candidatos postulados.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredAndSortedCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-white font-medium text-base sm:text-lg">{candidate.full_name}</h4>
                              
                              <span className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                                candidate.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                              }`}>
                                {candidate.status === 'rejected' ? '❌ Rechazado' : '⏳ Pendiente'}
                              </span>

                              {candidate.fit_score > 0 && (
                                <span className={`px-2 py-1 text-xs rounded-full font-bold whitespace-nowrap ${
                                  candidate.fit_score >= 75 ? 'bg-green-500/20 text-green-400 border border-green-500' :
                                  candidate.fit_score >= 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500' :
                                  'bg-red-500/20 text-red-400 border border-red-500'
                                }`}>
                                  🎯 {candidate.fit_score}/100
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{candidate.email}</span>
                              </div>
                              {candidate.phone && (
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                  {candidate.phone}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                {new Date(candidate.applied_at).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>

                            {candidate.ai_evaluation && (
                              <div className="mt-2 p-2 sm:p-3 bg-gray-900 rounded-lg border border-gray-700">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                                  <p className="text-xs sm:text-sm font-semibold text-blue-400">Evaluación IA</p>
                                </div>
                                <p className="text-xs text-gray-300 line-clamp-2">{candidate.ai_evaluation}</p>
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleViewCandidate(candidate)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Perfil
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

        {/* POSTINGS TAB - CON FILTROS */}
        {activeTab === 'postings' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Filtros para vacantes */}
            {!showCreateForm && jobPostings.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por título o departamento..."
                        value={postingSearch}
                        onChange={(e) => setPostingSearch(e.target.value)}
                        className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={postingFilter}
                        onChange={(e) => setPostingFilter(e.target.value as any)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 text-black rounded-md text-sm"
                      >
                        <option value="all">📋 Todas las vacantes</option>
                        <option value="active">✅ Activas</option>
                        <option value="inactive">❌ Inactivas</option>
                      </select>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-400">
                      Mostrando {filteredPostings.length} de {jobPostings.length} vacantes
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create Button */}
            {!showCreateForm && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Nueva Vacante
              </Button>
            )}

            {/* Create Form */}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-300">
                          Título del Puesto *
                        </Label>
                        <Input
                          id="title"
                          placeholder="Ej: Diseñador Gráfico Senior"
                          value={newPosting.title}
                          onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
                          className="bg-white border-gray-300 text-black"
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
                          className="bg-white border-gray-300 text-black"
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
                          className="bg-white border-gray-300 text-black"
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
                          className="w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-md"
                          required
                        >
                          <option value="Full-time">Tiempo Completo</option>
                          <option value="Part-time">Medio Tiempo</option>
                          <option value="Contract">Contrato</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="salary_range" className="text-gray-300">
                          Rango Salarial *
                        </Label>
                        <Input
                          id="salary_range"
                          placeholder="Ej: $30,000 - $45,000 USD/año"
                          value={newPosting.salary_range}
                          onChange={(e) => setNewPosting({ ...newPosting, salary_range: e.target.value })}
                          className="bg-white border-gray-300 text-black"
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
                        className="bg-white border-gray-300 text-black min-h-[100px]"
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
                        className="bg-white border-gray-300 text-black min-h-[100px]"
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
                        className="bg-white border-gray-300 text-black min-h-[100px]"
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
                        className="bg-white border-gray-300 text-black min-h-[120px]"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Estas pautas guiarán a la IA al evaluar automáticamente los CVs de los candidatos
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
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
                        className="border-gray-700 text-white hover:bg-gray-800"
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
                <CardTitle className="text-white text-lg sm:text-xl">Vacantes Publicadas ({filteredPostings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPostings ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                  </div>
                ) : filteredPostings.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 text-sm">
                    {postingSearch || postingFilter !== 'all' 
                      ? 'No se encontraron vacantes con los filtros actuales.' 
                      : 'No hay vacantes publicadas. Crea tu primera vacante arriba.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredPostings.map((posting) => (
                      <div
                        key={posting.id}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold text-base sm:text-lg">{posting.title}</h3>
                            {posting.is_active ? (
                              <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/30">
                                ● Activa
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                                ○ Inactiva
                              </span>
                            )}
                            {posting.candidate_count && posting.candidate_count > 0 && (
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/30">
                                {posting.candidate_count} candidato{posting.candidate_count !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-400">
                            <div className="flex items-center">
                              <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{posting.department}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{posting.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{posting.employment_type}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{posting.salary_range}</span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Creada: {new Date(posting.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEditPosting(posting)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            onClick={() => handleDeletePosting(posting.id)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
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

        {/* APPROVED AGENTS TAB - SOLO CANDIDATOS APROBADOS */}
        {activeTab === 'approved-agents' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Filtros para Candidatos Aprobados */}
            {approvedAgents.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre o email..."
                        value={agentSearch}
                        onChange={(e) => setAgentSearch(e.target.value)}
                        className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={agentFilter}
                        onChange={(e) => setAgentFilter(e.target.value as any)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 text-black rounded-md text-sm"
                      >
                        <option value="all">📋 Todos los Candidatos Aprobados</option>
                        <option value="active">✅ Activos</option>
                        <option value="inactive">❌ Inactivos</option>
                        <option value="exam-passed">🏆 Examen aprobado</option>
                      </select>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-400">
                      Mostrando {filteredAgents.length} de {approvedAgents.length} Candidatos Aprobados
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg sm:text-xl">Candidatos Aprobados ({filteredAgents.length})</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Candidatos que han sido aprobados y convertidos en usuarios del sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingApprovedAgents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                  </div>
                ) : filteredAgents.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 text-sm">
                    {agentSearch || agentFilter !== 'all' 
                      ? 'No se encontraron candidatos con los filtros actuales.' 
                      : 'Aún no hay candidatos aprobados.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className="p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="text-white font-medium text-base sm:text-lg">{agent.full_name}</h4>
                              
                              {agent.is_active ? (
                                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/30 font-medium">
                                  ✓ Activo
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full border border-red-500/30 font-medium">
                                  ✗ Inactivo
                                </span>
                              )}

                              {agent.voice_exam_passed === 1 ? (
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/30 font-bold flex items-center">
                                  <Award className="h-3 w-3 mr-1" />
                                  Examen Aprobado ({agent.voice_exam_score}%)
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full border border-yellow-500/30 font-medium flex items-center">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Pendiente de Examen
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{agent.email}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                Creado: {new Date(agent.created_at).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              {agent.last_login && (
                                <div className="flex items-center">
                                  <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                  Último acceso: {new Date(agent.last_login).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              )}
                              {agent.voice_exam_passed === 1 && agent.voice_exam_date && (
                                <div className="flex items-center">
                                  <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                  Examen aprobado: {new Date(agent.voice_exam_date).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              )}
                            </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Título del Puesto</Label>
                  <Input
                    value={editPostingData.title}
                    onChange={(e) => setEditPostingData({...editPostingData, title: e.target.value})}
                    className="mt-1 bg-white border-gray-300 text-black"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Departamento</Label>
                  <Input
                    value={editPostingData.department}
                    onChange={(e) => setEditPostingData({...editPostingData, department: e.target.value})}
                    className="mt-1 bg-white border-gray-300 text-black"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Ubicación</Label>
                  <Input
                    value={editPostingData.location}
                    onChange={(e) => setEditPostingData({...editPostingData, location: e.target.value})}
                    className="mt-1 bg-white border-gray-300 text-black"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Rango Salarial</Label>
                  <Input
                    value={editPostingData.salary_range}
                    onChange={(e) => setEditPostingData({...editPostingData, salary_range: e.target.value})}
                    className="mt-1 bg-white border-gray-300 text-black"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Descripción</Label>
                <Textarea
                  value={editPostingData.description}
                  onChange={(e) => setEditPostingData({...editPostingData, description: e.target.value})}
                  className="mt-1 bg-white border-gray-300 text-black min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-gray-300">Pautas para la IA</Label>
                <Textarea
                  value={editPostingData.interview_guidelines}
                  onChange={(e) => setEditPostingData({...editPostingData, interview_guidelines: e.target.value})}
                  className="mt-1 bg-white border-gray-300 text-black min-h-[100px]"
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

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
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
                  className="border-gray-700 text-white hover:bg-gray-800"
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

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
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
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidate Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        isOpen={showCandidateModal}
        onClose={() => {
          setShowCandidateModal(false)
          setSelectedCandidate(null)
          setCreateError('')
        }}
        onApprove={handleApproveCandidate}
        onReject={handleRejectCandidate}
        processing={processingCandidate}
        error={createError}
      />
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
