"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Home, CheckSquare, Calendar, Clock, Star, Tag, ChevronRight, ChevronLeft, Plus } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Hide sidebar completely on mobile
  if (isMobile) {
    return null
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-gray-500"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2 space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              pathname === "/dashboard"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <Home className="h-5 w-5 mr-3 flex-shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>

          <Link
            href="/dashboard/tasks"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              pathname === "/dashboard/tasks"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <CheckSquare className="h-5 w-5 mr-3 flex-shrink-0" />
            {!isCollapsed && <span>All Tasks</span>}
          </Link>

          <Link
            href="/dashboard/calendar"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              pathname === "/dashboard/calendar"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <Calendar className="h-5 w-5 mr-3 flex-shrink-0" />
            {!isCollapsed && <span>Calendar</span>}
          </Link>

          <Link
            href="/dashboard/upcoming"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              pathname === "/dashboard/upcoming"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <Clock className="h-5 w-5 mr-3 flex-shrink-0" />
            {!isCollapsed && <span>Upcoming</span>}
          </Link>

          {!isCollapsed && (
            <div className="pt-4 pb-2">
              <div className="px-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Link
            href="/dashboard/categories/work"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              pathname === "/dashboard/categories/work"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <Tag className="h-5 w-5 mr-3 flex-shrink-0" />
            {!isCollapsed && <span>Work</span>}
          </Link>

          <Link
            href="/dashboard/categories/personal"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              pathname === "/dashboard/categories/personal"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <Star className="h-5 w-5 mr-3 flex-shrink-0" />
            {!isCollapsed && <span>Personal</span>}
          </Link>
        </nav>
      </div>
    </div>
  )
}
