"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/training/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LogOut, Briefcase, MapPin, Building, DollarSign, Calendar, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
  created_at: string
  is_active: boolean
}

function DashboardContent() {
  const { user, logout, token } = useAuth()
  const router = useRouter()
  
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJobPostings()
  }, [])

  const fetchJobPostings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/jobs/active', {
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
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Talent Scout AI"
                width={100}
                height={63}
                className="h-10 w-auto"
              />
              <span className="text-white font-semibold text-xl">Talent Scout AI</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user?.full_name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <Button
                size="sm"
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Bienvenido, {user?.full_name}
          </h1>
          <p className="text-xl text-gray-300">
            Encuentra tu próxima oportunidad profesional
          </p>
        </div>

        {/* Job Postings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              Vacantes Disponibles
            </h2>
            <span className="text-gray-400">
              {jobPostings.length} {jobPostings.length === 1 ? 'vacante' : 'vacantes'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-red-500" />
            </div>
          ) : jobPostings.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No hay vacantes disponibles
                </h3>
                <p className="text-gray-400">
                  Vuelve pronto para ver nuevas oportunidades
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPostings.map((job) => (
                <Card 
                  key={job.id} 
                  className="bg-gray-900 border-gray-800 hover:border-red-500 transition-all cursor-pointer group"
                  onClick={() => router.push(`/training/jobs/${job.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-white group-hover:text-red-500 transition-colors">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {job.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Building className="h-4 w-4 mr-2" />
                      {job.employment_type}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.salary_range}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Publicado: {new Date(job.created_at).toLocaleDateString()}
                    </div>

                    <Button 
                      className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/training/jobs/${job.id}`)
                      }}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}