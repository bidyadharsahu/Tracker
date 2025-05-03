"use client"

import { useEffect, useState } from "react"
import { taskService } from "@/lib/task-service"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-mobile"

type NewsItem = {
  id: string
  text: string
  type: "deadline" | "status" | "info" | "error"
}

// Default news items when data can't be loaded
const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "default-1",
    text: "Welcome to your Task Manager! Add your first task to get started.",
    type: "info",
  },
  {
    id: "tip-1",
    text: "Tip: Keep your task status updated to track your progress effectively",
    type: "info",
  },
  {
    id: "tip-2",
    text: "Tip: Set due dates for your tasks to never miss a deadline",
    type: "info",
  },
]

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await taskService.getTaskStats()

        const newsItems: NewsItem[] = []

        // Add upcoming deadlines
        stats.dueSoon.forEach((task) => {
          newsItems.push({
            id: `deadline-${task.id}`,
            text: `Upcoming Deadline: ${task.title} due on ${task.dueDate}`,
            type: "deadline",
          })
        })

        // Add status info
        newsItems.push({
          id: "status-1",
          text: `Tasks Summary: ${stats.total} total, ${stats.completed} completed, ${stats.todo} to do, ${stats.inProgress} in progress`,
          type: "status",
        })

        // Add urgent tasks info
        if (stats.urgent > 0) {
          newsItems.push({
            id: "status-2",
            text: `You have ${stats.urgent} urgent ${stats.urgent === 1 ? "task" : "tasks"} that need your attention`,
            type: "info",
          })
        }

        // Add tips
        newsItems.push({
          id: "tip-1",
          text: "Tip: Keep your task status updated to track your progress effectively",
          type: "info",
        })

        newsItems.push({
          id: "tip-2",
          text: "Tip: Set due dates for your tasks to never miss a deadline",
          type: "info",
        })

        if (newsItems.length > 0) {
          setNews(newsItems)
          setError(null)
        }
      } catch (error) {
        console.error("Error loading stats:", error)
        setError("Unable to load latest statistics.")
        // Keep using default news items
      }
    }

    loadStats()

    // Refresh every 30 seconds
    const refreshInterval = setInterval(loadStats, 30000)

    return () => {
      clearInterval(refreshInterval)
    }
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deadline":
        return "text-red-600 dark:text-red-400"
      case "status":
        return "text-blue-600 dark:text-blue-400"
      case "info":
        return "text-emerald-600 dark:text-emerald-400"
      case "error":
        return "text-amber-600 dark:text-amber-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // If there was an error loading stats, add an error message to the news items
  const displayNews = error
    ? [
        {
          id: "error-1",
          text: error,
          type: "error",
        },
        ...news,
      ]
    : news

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 overflow-hidden">
      <div className="relative flex items-center h-10 overflow-hidden">
        <motion.div
          className="whitespace-nowrap flex items-center gap-8 absolute"
          animate={{
            x: isMobile ? ["100%", "-180%"] : ["100%", "-120%"],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: isMobile ? 45 : 60,
              ease: "linear",
            },
          }}
        >
          {displayNews.map((item) => (
            <span key={item.id} className={`text-sm font-medium ${getTypeColor(item.type)} flex items-center`}>
              <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
              {item.text}
            </span>
          ))}

          {/* Duplicate items to ensure smooth looping */}
          {displayNews.map((item) => (
            <span key={`${item.id}-dup`} className={`text-sm font-medium ${getTypeColor(item.type)} flex items-center`}>
              <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
              {item.text}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
