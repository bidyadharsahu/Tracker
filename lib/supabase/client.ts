"use client"

import { createClient } from "@supabase/supabase-js"

// Create a singleton to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

// Update the getSupabaseClient function to add better error handling and logging
export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase credentials:", {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey,
        })
        throw new Error("Supabase credentials are missing. Please check your environment variables.")
      }

      console.log("Initializing Supabase client with URL:", supabaseUrl)
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: "taskmanager-auth-storage",
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })

      console.log("Supabase client initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      throw new Error("Failed to connect to the database. Please try again later.")
    }
  }
  return supabaseInstance
}

// Function to check database connection
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    // Simple query to check if database is accessible
    const { error } = await supabase.from("tasks").select("id").limit(1).maybeSingle()

    // If there's an error other than "no rows found", database might be down
    if (error && error.code !== "PGRST116") {
      console.error("Database connection check failed:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Database connection check error:", error)
    return false
  }
}

// Function to check if tables exist and create them if they don't
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()

    // Check if tasks table exists
    const { error: checkError } = await supabase.from("tasks").select("id").limit(1).maybeSingle()

    // If table doesn't exist, create it
    if (checkError && checkError.code === "42P01") {
      // relation does not exist
      const { error: createError } = await supabase.rpc("initialize_database")

      if (createError) {
        console.error("Failed to initialize database:", createError)
        return false
      }

      return true
    }

    return true
  } catch (error) {
    console.error("Database initialization error:", error)
    return false
  }
}
