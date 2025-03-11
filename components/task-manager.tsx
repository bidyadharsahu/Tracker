"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import TaskForm from "./task-form"
import TaskTable from "./task-table"
import TaskTabs from "./task-tabs"
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Task = {
  id: string
  internshipName: string
  applicationLink: string
  deadline: string
  applicationStatus: "Not Started" | "Pending" | "Completed"
  resultStatus: "Selected" | "Rejected" | "Pending"
}

export default function TaskManager() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("internshipTasks")
      return savedTasks ? JSON.parse(savedTasks) : []
    }
    return []
  })

  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all")
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem("internshipTasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      document.body.style.backgroundColor = "#121212"
    } else {
      document.documentElement.classList.remove("dark")
      document.body.style.backgroundColor = ""
    }
  }, [darkMode])

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    }
    setTasks([...tasks, newTask])
    toast({
      title: "Application Added",
      description: `${task.internshipName} has been added to your tracker.`,
    })
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    setTasks(tasks.filter((task) => task.id !== id))
    toast({
      title: "Application Removed",
      description: `${taskToDelete?.internshipName} has been removed from your tracker.`,
      variant: "destructive",
    })
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    toast({
      title: "Status Updated",
      description: `${updatedTask.internshipName} status has been updated.`,
    })
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
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-emerald-600 font-medium">Loading your applications...</p>
      </div>
    )
  }

  return (
    <div className="p-4 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Your Applications</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
          className={`rounded-full transition-all duration-300 ${darkMode ? "bg-gray-700 text-yellow-300 border-gray-600" : "bg-white text-gray-700 border-gray-200"}`}
        >
          {darkMode ? (
            <>
              <SunIcon className="h-4 w-4 mr-2" /> Light Mode
            </>
          ) : (
            <>
              <MoonIcon className="h-4 w-4 mr-2" /> Dark Mode
            </>
          )}
        </Button>
      </div>
      <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <TaskForm addTask={addTask} />
      <TaskTable tasks={filteredTasks} deleteTask={deleteTask} updateTask={updateTask} />
    </div>
  )
}

