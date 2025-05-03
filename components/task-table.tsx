"use client"
import { useState } from "react"
import type { Task } from "@/lib/task-service"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, AlertCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type TaskTableProps = {
  tasks: Task[]
  deleteTask: (id: string) => void
  updateTask: (task: Task) => void
  isMobile: boolean
}

export default function TaskTable({ tasks, deleteTask, updateTask, isMobile }: TaskTableProps) {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({})
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border dark:border-blue-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border dark:border-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border dark:border-orange-800"
      case "Urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border dark:border-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border dark:border-gray-600"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border dark:border-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border dark:border-gray-600"
    }
  }

  const handleStatusChange = async (task: Task, value: "To Do" | "In Progress" | "Completed") => {
    setIsUpdating(task.id)
    try {
      await updateTask({
        ...task,
        status: value,
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handlePriorityChange = async (task: Task, value: "Low" | "Medium" | "High" | "Urgent") => {
    setIsUpdating(task.id)
    try {
      await updateTask({
        ...task,
        priority: value,
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return

    setIsDeleting(true)
    try {
      await deleteTask(taskToDelete.id)
    } finally {
      setIsDeleting(false)
      setTaskToDelete(null)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p className="mb-2 dark:text-gray-300">No tasks found</p>
          <p className="text-sm dark:text-gray-400">Add your first task using the button above!</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Collapsible
            key={task.id}
            open={expandedTasks[task.id]}
            onOpenChange={() => toggleTaskExpansion(task.id)}
            className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
          >
            <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Select
                  value={task.status}
                  onValueChange={(value: "To Do" | "In Progress" | "Completed") => handleStatusChange(task, value)}
                  disabled={isUpdating === task.id}
                >
                  <SelectTrigger className={`w-28 h-8 text-xs ${getStatusColor(task.status)}`}>
                    <SelectValue placeholder="Status" />
                    {isUpdating === task.id && (
                      <span className="ml-2 h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                    <SelectItem value="To Do" className="text-gray-600 font-medium dark:text-gray-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                        To Do
                      </div>
                    </SelectItem>
                    <SelectItem value="In Progress" className="text-blue-600 font-medium dark:text-blue-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="Completed" className="text-green-600 font-medium dark:text-green-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Completed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={task.priority}
                  onValueChange={(value: "Low" | "Medium" | "High" | "Urgent") => handlePriorityChange(task, value)}
                  disabled={isUpdating === task.id}
                >
                  <SelectTrigger className={`w-28 h-8 text-xs ${getPriorityColor(task.priority)}`}>
                    <SelectValue placeholder="Priority" />
                    {isUpdating === task.id && (
                      <span className="ml-2 h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                    <SelectItem value="Low" className="text-blue-600 font-medium dark:text-blue-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="Medium" className="text-yellow-600 font-medium dark:text-yellow-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="High" className="text-orange-600 font-medium dark:text-orange-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="Urgent" className="text-red-600 font-medium dark:text-red-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTaskToDelete(task)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      {expandedTasks[task.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>

            <CollapsibleContent>
              <div className="px-4 pb-4 border-t dark:border-gray-700 pt-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {task.description ? (
                    <div>
                      <h4 className="font-medium mb-1">Description:</h4>
                      <p className="whitespace-pre-line">{task.description}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No description for this task.</p>
                  )}
                  {task.category && (
                    <div className="mt-2">
                      <h4 className="font-medium mb-1">Category:</h4>
                      <p>{task.category}</p>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
