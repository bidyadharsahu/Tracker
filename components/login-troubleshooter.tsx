"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function LoginTroubleshooter() {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<
    Array<{ name: string; status: "success" | "error" | "warning"; message: string }>
  >([])

  const runDiagnostics = async () => {
    setIsChecking(true)
    setResults([])

    // Check 1: Environment Variables
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!url || !key) {
        setResults((prev) => [
          ...prev,
          {
            name: "Environment Variables",
            status: "error",
            message: "Missing Supabase environment variables",
          },
        ])
      } else {
        setResults((prev) => [
          ...prev,
          {
            name: "Environment Variables",
            status: "success",
            message: "Supabase environment variables are set",
          },
        ])
      }
    } catch (error) {
      setResults((prev) => [
        ...prev,
        {
          name: "Environment Variables",
          status: "error",
          message: "Error checking environment variables",
        },
      ])
    }

    // Check 2: Supabase Connection
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("profiles").select("id").limit(1).maybeSingle()

      if (error && error.code !== "PGRST116") {
        setResults((prev) => [
          ...prev,
          {
            name: "Supabase Connection",
            status: "error",
            message: `Connection error: ${error.message}`,
          },
        ])
      } else {
        setResults((prev) => [
          ...prev,
          {
            name: "Supabase Connection",
            status: "success",
            message: "Successfully connected to Supabase",
          },
        ])
      }
    } catch (error: any) {
      setResults((prev) => [
        ...prev,
        {
          name: "Supabase Connection",
          status: "error",
          message: `Error: ${error.message}`,
        },
      ])
    }

    // Check 3: Auth Service
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setResults((prev) => [
          ...prev,
          {
            name: "Auth Service",
            status: "error",
            message: `Auth error: ${error.message}`,
          },
        ])
      } else {
        setResults((prev) => [
          ...prev,
          {
            name: "Auth Service",
            status: "success",
            message: data.session ? "User is authenticated" : "Auth service working (no active session)",
          },
        ])
      }
    } catch (error: any) {
      setResults((prev) => [
        ...prev,
        {
          name: "Auth Service",
          status: "error",
          message: `Error: ${error.message}`,
        },
      ])
    }

    setIsChecking(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Troubleshooter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={isChecking} className="w-full">
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running Diagnostics...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2 mt-4">
            {results.map((result, index) => (
              <div key={index} className="p-3 rounded-md border bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">{result.name}</span>
                  <span
                    className={
                      result.status === "success"
                        ? "text-green-500"
                        : result.status === "error"
                          ? "text-red-500"
                          : "text-yellow-500"
                    }
                  >
                    {result.status === "success" ? "✅ Success" : result.status === "error" ? "❌ Error" : "⚠️ Warning"}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{result.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
