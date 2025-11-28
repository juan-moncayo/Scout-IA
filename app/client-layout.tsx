"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { usePathname } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"

function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showSplash, setShowSplash] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited")
    if (pathname === "/" && !hasVisited) {
      setShowSplash(true)
      setPageVisible(false)
      sessionStorage.setItem("hasVisited", "true")
    }
  }, [pathname])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setTimeout(() => setPageVisible(true), 100)
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className={`transition-opacity duration-500 ${pageVisible ? "opacity-100" : "opacity-0"}`}>{children}</div>
    </>
  )
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
