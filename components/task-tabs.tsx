"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type TaskTabsProps = {
  activeTab: "all" | "active" | "completed"
  setActiveTab: (tab: "all" | "active" | "completed") => void
}

export default function TaskTabs({ activeTab, setActiveTab }: TaskTabsProps) {
  return (
    <div className="flex border-b mb-4 dark:border-gray-700 relative">
      <button
        className={cn(
          "px-4 py-2 font-medium text-sm relative",
          activeTab === "all"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
        )}
        onClick={() => setActiveTab("all")}
      >
        All
        {activeTab === "all" && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 dark:bg-emerald-400"
            layoutId="activeTab"
          />
        )}
      </button>
      <button
        className={cn(
          "px-4 py-2 font-medium text-sm relative",
          activeTab === "active"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
        )}
        onClick={() => setActiveTab("active")}
      >
        Active
        {activeTab === "active" && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 dark:bg-emerald-400"
            layoutId="activeTab"
          />
        )}
      </button>
      <button
        className={cn(
          "px-4 py-2 font-medium text-sm relative",
          activeTab === "completed"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
        )}
        onClick={() => setActiveTab("completed")}
      >
        Completed
        {activeTab === "completed" && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 dark:bg-emerald-400"
            layoutId="activeTab"
          />
        )}
      </button>
    </div>
  )
}

