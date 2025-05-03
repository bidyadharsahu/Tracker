"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/whatsapp-bg.png')] dark:bg-[url('/whatsapp-bg-dark.png')] bg-repeat">
        <div className="flex flex-col items-center justify-center p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg">
          <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
          <p className="mt-4 text-emerald-600 font-medium dark:text-emerald-400">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[url('/whatsapp-bg.png')] dark:bg-[url('/whatsapp-bg-dark.png')] bg-repeat">
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-5xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border dark:border-gray-700">
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
