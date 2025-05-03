"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Import the SupabaseTest component
import SupabaseTest from "@/components/supabase-test"

// Import the LoginTroubleshooter component
import LoginTroubleshooter from "@/components/login-troubleshooter"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Update the showTest state to include the troubleshooter
  const [showTest, setShowTest] = useState<"none" | "connection" | "troubleshooter">("none")

  // Update the handleSubmit function to provide better feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Login attempt with email:", email)
      const { error, data } = await signIn(email, password)

      if (error) {
        console.error("Login error:", error)
        toast({
          title: "Login Failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Successful login
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      })

      // Force navigation to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Unexpected login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/whatsapp-bg.png')] dark:bg-[url('/whatsapp-bg-dark.png')] bg-repeat">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login to Task Manager</CardTitle>
          <CardDescription className="text-center">Enter your email and password to access your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="dark:bg-gray-800"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
            >
              Sign up
            </Link>
          </div>
          {/* Add this button at the bottom of the CardFooter */}
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Having trouble logging in?{" "}
              <button
                type="button"
                onClick={() => setShowTest(showTest === "connection" ? "none" : "connection")}
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Test Connection
              </button>
              {" | "}
              <button
                type="button"
                onClick={() => setShowTest(showTest === "troubleshooter" ? "none" : "troubleshooter")}
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Troubleshoot
              </button>
            </div>
            {showTest === "connection" && (
              <div className="mt-4">
                <SupabaseTest />
              </div>
            )}
            {showTest === "troubleshooter" && (
              <div className="mt-4">
                <LoginTroubleshooter />
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
