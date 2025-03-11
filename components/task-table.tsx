"use client"
import type { Task } from "./task-manager"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type TaskTableProps = {
  tasks: Task[]
  deleteTask: (id: string) => void
  updateTask: (task: Task) => void
}

export default function TaskTable({ tasks, deleteTask, updateTask }: TaskTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border dark:border-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border dark:border-yellow-800"
      case "Completed":
      case "Selected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border dark:border-gray-600"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Not Started":
      case "Rejected":
        return "bg-red-500"
      case "Pending":
        return "bg-yellow-500"
      case "Completed":
      case "Selected":
        return "bg-green-500"
      default:
        return "bg-gray-500"
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
          <p className="mb-2 dark:text-gray-300">No internship applications found</p>
          <p className="text-sm dark:text-gray-400">Add your first one using the button above!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-4 rounded-lg border dark:border-gray-700 shadow-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-300">
              Internship
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-300">
              Link
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-300">
              Deadline
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-300">
              App Status
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-300">
              Result
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.tr
                key={task.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3 }}
                layout
              >
                <td className="py-2 px-3 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {task.internshipName}
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {task.applicationLink ? (
                    <a
                      href={task.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center dark:text-blue-400"
                    >
                      <span className="mr-1">Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {task.deadline}
                </td>
                <td className="py-2 px-3 text-sm whitespace-nowrap">
                  <Select
                    value={task.applicationStatus}
                    onValueChange={(value: "Not Started" | "Pending" | "Completed") => {
                      updateTask({
                        ...task,
                        applicationStatus: value,
                      })
                    }}
                  >
                    <SelectTrigger className={`w-28 h-7 text-xs ${getStatusColor(task.applicationStatus)}`}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="Not Started" className="text-red-600 font-medium dark:text-red-300">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                          Not Started
                        </div>
                      </SelectItem>
                      <SelectItem value="Pending" className="text-yellow-600 font-medium dark:text-yellow-300">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                          Pending
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
                </td>
                <td className="py-2 px-3 text-sm whitespace-nowrap">
                  <Select
                    value={task.resultStatus}
                    onValueChange={(value: "Selected" | "Rejected" | "Pending") => {
                      updateTask({
                        ...task,
                        resultStatus: value,
                      })
                    }}
                  >
                    <SelectTrigger className={`w-28 h-7 text-xs ${getStatusColor(task.resultStatus)}`}>
                      <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="Pending" className="text-yellow-600 font-medium dark:text-yellow-300">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="Selected" className="text-green-600 font-medium dark:text-green-300">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          Selected
                        </div>
                      </SelectItem>
                      <SelectItem value="Rejected" className="text-red-600 font-medium dark:text-red-300">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                          Rejected
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-3 text-sm whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

