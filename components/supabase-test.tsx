"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupabaseTest() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [envVars, setEnvVars] = useState<{ url?: string; key?: string }>({})

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setStatus("loading")
      setMessage("Testing Supabase connection...")

      // Check environment variables
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setEnvVars({
        url: url ? "✅ Set" : "❌ Missing",
        key: key ? "✅ Set" : "❌ Missing",
      })

      if (!url || !key) {
        setStatus("error")
        setMessage("Environment variables are missing")
        return
      }

      // Test Supabase connection
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("profiles").select("id").limit(1).maybeSingle()

      if (error && error.code !== "PGRST116") {
        setStatus("error")
        setMessage(`Connection error: ${error.message}`)
        return
      }

      setStatus("success")
      setMessage("Supabase connection successful!")
    } catch (error: any) {
      setStatus("error")
      setMessage(`Error: ${error.message}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status:</span>
            <span
              className={
                status === "success" ? "text-green-500" : status === "error" ? "text-red-500" : "text-yellow-500"
              }
            >
              {status === "loading" ? "Testing..." : status === "success" ? "Connected" : "Connection Failed"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>NEXT_PUBLIC_SUPABASE_URL:</span>
            <span>{envVars.url || "Checking..."}</span>
          </div>
          <div className="flex justify-between">
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
            <span>{envVars.key || "Checking..."}</span>
          </div>
          <p className="text-sm mt-2">{message}</p>
        </div>
        <Button onClick={checkConnection} className="w-full">
          Test Connection Again
        </Button>
      </CardContent>
    </Card>
  )
}
