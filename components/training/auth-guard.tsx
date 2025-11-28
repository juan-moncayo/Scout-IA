// components/training/auth-guard.tsx
"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      // No hay usuario, redirigir al login
      if (!user) {
        router.push('/training/login')
        return
      }

      // Requiere admin pero el usuario no lo es
      if (requireAdmin && !isAdmin) {
        router.push('/training/dashboard')
        return
      }
    }
  }, [user, isLoading, isAdmin, requireAdmin, pathname, router])

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario después de cargar, no mostrar nada
  if (!user) {
    return null
  }

  // Si requiere admin y no lo es, no mostrar nada
  if (requireAdmin && !isAdmin) {
    return null
  }

  // Todo bien, mostrar el contenido
  return <>{children}</>
}