"use client"

import { getSupabaseClient } from "./supabase/client"

export type Task = {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "To Do" | "In Progress" | "Completed"
  category?: string
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export type TaskComment = {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: string
  user?: {
    fullName: string
    avatarUrl?: string
  }
}

export const taskService = {
  // Get all tasks for the current user
  getTasks: async (): Promise<Task[]> => {
    try {
      const supabase = getSupabaseClient()

      // Check if the user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // If not authenticated, return empty array
      if (!user) {
        return []
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        // If the error is that the table doesn't exist, return empty array
        if (error.code === "42P01") {
          // relation does not exist
          console.warn("Tasks table does not exist yet")
          return []
        }
        throw error
      }

      if (data) {
        // Transform from snake_case to camelCase
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          dueDate: item.due_date,
          priority: item.priority,
          status: item.status,
          category: item.category,
          userId: item.user_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      }

      return []
    } catch (error) {
      console.error("Error fetching tasks:", error)
      return [] // Return empty array instead of throwing
    }
  },

  // Get a single task by ID
  getTask: async (id: string): Promise<Task | null> => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "42P01") {
          // relation does not exist
          return null
        }
        throw error
      }

      if (data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          dueDate: data.due_date,
          priority: data.priority,
          status: data.status,
          category: data.category,
          userId: data.user_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      }

      return null
    } catch (error) {
      console.error("Error fetching task:", error)
      return null
    }
  },

  // Add a new task
  addTask: async (task: Omit<Task, "id">): Promise<Task | null> => {
    try {
      const supabase = getSupabaseClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Transform to snake_case for database
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: task.title,
          description: task.description,
          due_date: task.dueDate,
          priority: task.priority,
          status: task.status,
          category: task.category,
          user_id: user.id,
        })
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        // Transform back to camelCase
        return {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          dueDate: data[0].due_date,
          priority: data[0].priority,
          status: data[0].status,
          category: data[0].category,
          userId: data[0].user_id,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
        }
      }

      return null
    } catch (error) {
      console.error("Error adding task:", error)
      return null
    }
  },

  // Update a task
  updateTask: async (updatedTask: Partial<Task> & { id: string }): Promise<Task | null> => {
    try {
      const supabase = getSupabaseClient()

      // Transform to snake_case for database
      const updateData: any = {}
      if (updatedTask.title !== undefined) updateData.title = updatedTask.title
      if (updatedTask.description !== undefined) updateData.description = updatedTask.description
      if (updatedTask.dueDate !== undefined) updateData.due_date = updatedTask.dueDate
      if (updatedTask.priority !== undefined) updateData.priority = updatedTask.priority
      if (updatedTask.status !== undefined) updateData.status = updatedTask.status
      if (updatedTask.category !== undefined) updateData.category = updatedTask.category

      updateData.updated_at = new Date().toISOString()

      const { data, error } = await supabase.from("tasks").update(updateData).eq("id", updatedTask.id).select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        return {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          dueDate: data[0].due_date,
          priority: data[0].priority,
          status: data[0].status,
          category: data[0].category,
          userId: data[0].user_id,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
        }
      }

      return null
    } catch (error) {
      console.error("Error updating task:", error)
      return null
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<boolean> => {
    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase.from("tasks").delete().eq("id", id)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error("Error deleting task:", error)
      return false
    }
  },

  // Get task comments
  getTaskComments: async (taskId: string): Promise<TaskComment[]> => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("task_comments")
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      if (data) {
        return data.map((item) => ({
          id: item.id,
          taskId: item.task_id,
          userId: item.user_id,
          content: item.content,
          createdAt: item.created_at,
          user: {
            fullName: item.profiles?.full_name || "Unknown User",
            avatarUrl: item.profiles?.avatar_url,
          },
        }))
      }

      return []
    } catch (error) {
      console.error("Error fetching task comments:", error)
      throw new Error("Failed to fetch comments. Please try again.")
    }
  },

  // Add a task comment
  addTaskComment: async (taskId: string, content: string): Promise<TaskComment> => {
    try {
      const supabase = getSupabaseClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("task_comments")
        .insert({
          task_id: taskId,
          user_id: user.id,
          content,
        })
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)

      if (error) {
        throw error
      }

      if (data && data[0]) {
        return {
          id: data[0].id,
          taskId: data[0].task_id,
          userId: data[0].user_id,
          content: data[0].content,
          createdAt: data[0].created_at,
          user: {
            fullName: data[0].profiles?.full_name || "Unknown User",
            avatarUrl: data[0].profiles?.avatar_url,
          },
        }
      }

      throw new Error("Failed to add comment. No data returned.")
    } catch (error) {
      console.error("Error adding task comment:", error)
      throw new Error("Failed to add comment. Please try again.")
    }
  },

  // Delete a task comment
  deleteTaskComment: async (commentId: string): Promise<boolean> => {
    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase.from("task_comments").delete().eq("id", commentId)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error("Error deleting task comment:", error)
      throw new Error("Failed to delete comment. Please try again.")
    }
  },

  // Get task statistics
  getTaskStats: async (): Promise<{
    total: number
    todo: number
    inProgress: number
    completed: number
    urgent: number
    dueSoon: Task[]
  }> => {
    try {
      const tasks = await taskService.getTasks()

      const todo = tasks.filter((t) => t.status === "To Do").length
      const inProgress = tasks.filter((t) => t.status === "In Progress").length
      const completed = tasks.filter((t) => t.status === "Completed").length
      const urgent = tasks.filter((t) => t.priority === "Urgent").length

      // Get tasks due in the next 7 days
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)

      const dueSoon = tasks
        .filter((task) => {
          if (!task.dueDate) return false

          const [day, month, year] = task.dueDate.split("/").map(Number)
          const dueDate = new Date(year, month - 1, day)

          return dueDate >= today && dueDate <= nextWeek && task.status !== "Completed"
        })
        .sort((a, b) => {
          if (!a.dueDate || !b.dueDate) return 0

          const [dayA, monthA, yearA] = a.dueDate.split("/").map(Number)
          const [dayB, monthB, yearB] = b.dueDate.split("/").map(Number)

          const dateA = new Date(yearA, monthA - 1, dayA)
          const dateB = new Date(yearB, monthB - 1, dayB)

          return dateA.getTime() - dateB.getTime()
        })

      return {
        total: tasks.length,
        todo,
        inProgress,
        completed,
        urgent,
        dueSoon,
      }
    } catch (error) {
      console.error("Error getting task stats:", error)
      return {
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
        urgent: 0,
        dueSoon: [],
      }
    }
  },
}
