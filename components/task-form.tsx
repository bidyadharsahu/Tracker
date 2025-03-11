"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Task } from "./task-manager"
import { PlusCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type TaskFormProps = {
  addTask: (task: Omit<Task, "id">) => void
}

export default function TaskForm({ addTask }: TaskFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [internshipName, setInternshipName] = useState("")
  const [applicationLink, setApplicationLink] = useState("")
  const [deadline, setDeadline] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!internshipName || !deadline) return

    addTask({
      internshipName,
      applicationLink,
      deadline,
      applicationStatus: "Not Started",
      resultStatus: "Pending",
    })

    // Reset form
    setInternshipName("")
    setApplicationLink("")
    setDeadline("")
    setIsFormOpen(false)
  }

  const formatDate = (input: string) => {
    // Remove non-numeric characters
    const numbers = input.replace(/\D/g, "")

    // Format as DD/MM/YYYY
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value)
    setDeadline(formatted)
  }

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            key="add-button"
          >
            <Button
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white shadow-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Internship Application
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            key="form"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 relative shadow-sm"
            >
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <Label htmlFor="internshipName" className="dark:text-gray-200">
                  Internship Name *
                </Label>
                <Input
                  id="internshipName"
                  value={internshipName}
                  onChange={(e) => setInternshipName(e.target.value)}
                  placeholder="Company Name - Position"
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="applicationLink" className="dark:text-gray-200">
                  Application Link
                </Label>
                <Input
                  id="applicationLink"
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="deadline" className="dark:text-gray-200">
                  Deadline (DD/MM/YYYY) *
                </Label>
                <Input
                  id="deadline"
                  value={deadline}
                  onChange={handleDateChange}
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  className="dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

