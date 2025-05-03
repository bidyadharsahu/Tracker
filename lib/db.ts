"use client"

import type { Task } from "@/components/task-manager"
import { getSupabaseClient } from "./supabase/client"

// Database operations - fully database-driven
export const db = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        // Transform from snake_case to camelCase
        return data.map((item) => ({
          id: item.id,
          internshipName: item.internship_name,
          applicationLink: item.application_link,
          deadline: item.deadline,
          applicationStatus: item.application_status,
          resultStatus: item.result_status,
          notes: item.notes,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      }

      return []
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw new Error("Failed to fetch applications. Please try again.")
    }
  },

  // Add a new task
  addTask: async (task: Omit<Task, "id">): Promise<Task> => {
    try {
      const supabase = getSupabaseClient()

      // Transform to snake_case for database
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          internship_name: task.internshipName,
          application_link: task.applicationLink,
          deadline: task.deadline,
          application_status: task.applicationStatus,
          result_status: task.resultStatus,
          notes: task.notes,
        })
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        // Transform back to camelCase
        return {
          id: data[0].id,
          internshipName: data[0].internship_name,
          applicationLink: data[0].application_link,
          deadline: data[0].deadline,
          applicationStatus: data[0].application_status,
          resultStatus: data[0].result_status,
          notes: data[0].notes,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
        }
      }

      throw new Error("Failed to add application. No data returned.")
    } catch (error) {
      console.error("Error adding task:", error)
      throw new Error("Failed to add application. Please try again.")
    }
  },

  // Update a task
  updateTask: async (updatedTask: Task): Promise<Task> => {
    try {
      const supabase = getSupabaseClient()

      // Transform to snake_case for database
      const { error } = await supabase
        .from("tasks")
        .update({
          internship_name: updatedTask.internshipName,
          application_link: updatedTask.applicationLink,
          deadline: updatedTask.deadline,
          application_status: updatedTask.applicationStatus,
          result_status: updatedTask.resultStatus,
          notes: updatedTask.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedTask.id)

      if (error) {
        throw error
      }

      return updatedTask
    } catch (error) {
      console.error("Error updating task:", error)
      throw new Error("Failed to update application. Please try again.")
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
      throw new Error("Failed to delete application. Please try again.")
    }
  },

  // Get task statistics
  getStats: async (): Promise<{
    total: number
    notStarted: number
    pending: number
    completed: number
    selected: number
    rejected: number
    upcomingDeadlines: Task[]
  }> => {
    try {
      const tasks = await db.getTasks()

      const notStarted = tasks.filter((t) => t.applicationStatus === "Not Started").length
      const pending = tasks.filter((t) => t.applicationStatus === "Pending").length
      const completed = tasks.filter((t) => t.applicationStatus === "Completed").length

      const selected = tasks.filter((t) => t.resultStatus === "Selected").length
      const rejected = tasks.filter((t) => t.resultStatus === "Rejected").length

      // Get upcoming deadlines (next 7 days)
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)

      const upcomingDeadlines = tasks
        .filter((task) => {
          if (!task.deadline) return false

          const [day, month, year] = task.deadline.split("/").map(Number)
          const deadlineDate = new Date(year, month - 1, day)

          return deadlineDate >= today && deadlineDate <= nextWeek
        })
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.deadline.split("/").map(Number)
          const [dayB, monthB, yearB] = b.deadline.split("/").map(Number)

          const dateA = new Date(yearA, monthA - 1, dayA)
          const dateB = new Date(yearB, monthB - 1, dayB)

          return dateA.getTime() - dateB.getTime()
        })

      return {
        total: tasks.length,
        notStarted,
        pending,
        completed,
        selected,
        rejected,
        upcomingDeadlines,
      }
    } catch (error) {
      console.error("Error getting stats:", error)
      throw new Error("Failed to get application statistics. Please try again.")
    }
  },
}
