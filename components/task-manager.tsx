"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import TaskForm from "./task-form"
import TaskTable from "./task-table"
import TaskTabs from "./task-tabs"
import TaskStats from "./task-stats"
import { MoonIcon, SunIcon, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import { getSupabaseClient, checkDatabaseConnection } from "@/lib/supabase/client"

export type Task = {
  id: string
  internshipName: string
  applicationLink: string
  deadline: string
  applicationStatus: "Not Started" | "Pending" | "Completed"
  resultStatus: "Selected" | "Rejected" | "Pending"
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export default function TaskManager() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const { theme, setTheme } = useTheme()
  const supabaseSubscription = useRef<any>(null)

  const isMobile = useMediaQuery("(max-width: 640px)")

  // Check database connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkDatabaseConnection()
        setIsConnected(isConnected)
        if (!isConnected) {
          setConnectionError("Unable to connect to the database. Please check your connection.")
        } else {
          setConnectionError(null)
        }
      } catch (error) {
        console.error("Connection check error:", error)
        setIsConnected(false)
        setConnectionError("Unable to connect to the database. Please check your connection.")
      }
    }

    checkConnection()

    // Check connection when the app comes back online
    const handleOnline = () => {
      checkConnection()
    }

    window.addEventListener("online", handleOnline)
    return () => window.removeEventListener("online", handleOnline)
  }, [])

  // Function to refresh tasks
  const refreshTasks = async () => {
    setIsRefreshing(true)
    try {
      const fetchedTasks = await db.getTasks()
      setTasks(fetchedTasks)
      setConnectionError(null)
      setIsConnected(true)
    } catch (error) {
      console.error("Failed to refresh tasks:", error)
      setConnectionError("Failed to refresh applications. Please try again later.")
      toast({
        title: "Connection Error",
        description: "Failed to refresh applications. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    const setupSubscription = async () => {
      try {
        // Clean up any existing subscription
        if (supabaseSubscription.current) {
          supabaseSubscription.current.unsubscribe()
        }

        const supabase = getSupabaseClient()

        // Subscribe to changes
        supabaseSubscription.current = supabase
          .channel("tasks-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "tasks",
            },
            () => {
              // Refresh data when changes occur
              refreshTasks()
            },
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log("Successfully subscribed to real-time updates")
            }
            if (status === "CHANNEL_ERROR") {
              console.error("Failed to subscribe to real-time updates")
            }
          })
      } catch (err) {
        console.error("Failed to set up subscription:", err)
      }
    }

    setupSubscription()

    return () => {
      // Clean up subscription
      if (supabaseSubscription.current) {
        supabaseSubscription.current.unsubscribe()
      }
    }
  }, [])

  // Initial load
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true)
      try {
        await refreshTasks()
      } catch (error) {
        console.error("Failed to load tasks:", error)
        setConnectionError("Failed to load applications. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [toast])

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      await db.addTask(task)
      toast({
        title: "Application Added",
        description: `${task.internshipName} has been added to your tracker.`,
      })
      // No need to manually refresh as the real-time subscription will handle it
    } catch (error) {
      console.error("Failed to add task:", error)
      toast({
        title: "Error",
        description: "Failed to add application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const taskToDelete = tasks.find((task) => task.id === id)
      await db.deleteTask(id)
      toast({
        title: "Application Removed",
        description: `${taskToDelete?.internshipName} has been removed from your tracker.`,
        variant: "destructive",
      })
      // No need to manually refresh as the real-time subscription will handle it
    } catch (error) {
      console.error("Failed to delete task:", error)
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateTask = async (updatedTask: Task) => {
    try {
      await db.updateTask(updatedTask)
      toast({
        title: "Status Updated",
        description: `${updatedTask.internshipName} status has been updated.`,
      })
      // No need to manually refresh as the real-time subscription will handle it
    } catch (error) {
      console.error("Failed to update task:", error)
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return task.applicationStatus !== "Completed"
    if (activeTab === "completed") return task.applicationStatus === "Completed"
    return true
  })

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
        <p className="mt-4 text-emerald-600 font-medium dark:text-emerald-400">Loading your applications...</p>
      </div>
    )
  }

  return (
    <div className="p-4 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold dark:text-white">Your Applications</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshTasks}
            disabled={isRefreshing}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>

          {!isConnected && (
            <span className="flex items-center text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
              <AlertCircle className="h-3 w-3 mr-1" />
              Connection Error
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{tasks.length}</span> applications
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`rounded-full transition-all duration-300 ${theme === "dark" ? "bg-gray-700 text-yellow-300 border-gray-600" : "bg-white text-gray-700 border-gray-200"}`}
          >
            {theme === "dark" ? (
              <>
                <SunIcon className="h-4 w-4 mr-2" /> Light
              </>
            ) : (
              <>
                <MoonIcon className="h-4 w-4 mr-2" /> Dark
              </>
            )}
          </Button>
        </div>
      </div>

      {connectionError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-md text-red-700 dark:text-red-400 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>{connectionError}</p>
        </div>
      )}

      {/* Status bar moved above content */}
      <TaskStats tasks={tasks} />

      <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <TaskForm addTask={addTask} />

      <TaskTable tasks={filteredTasks} deleteTask={deleteTask} updateTask={updateTask} isMobile={isMobile} />
    </div>
  )
}
