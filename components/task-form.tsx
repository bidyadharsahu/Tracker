"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Task } from "@/lib/task-service"

type TaskFormProps = {
  onSubmit: (task: Omit<Task, "id" | "userId">) => Promise<void>
  onCancel: () => void
  initialData?: Partial<Task>
}

export default function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "")
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">(initialData?.priority || "Medium")
  const [status, setStatus] = useState<"To Do" | "In Progress" | "Completed">(initialData?.status || "To Do")
  const [category, setCategory] = useState(initialData?.category || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    title?: string
    dueDate?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      title?: string
      dueDate?: string
    } = {}

    if (!title.trim()) {
      newErrors.title = "Task title is required"
    }

    if (dueDate) {
      // Check if due date is in correct format
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/
      if (!datePattern.test(dueDate)) {
        newErrors.dueDate = "Due date must be in DD/MM/YYYY format"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await onSubmit({
        title,
        description,
        dueDate: dueDate || undefined,
        priority,
        status,
        category: category || undefined,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
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
    setDueDate(formatted)

    // Clear error when user types
    if (errors.dueDate) {
      setErrors((prev) => ({ ...prev, dueDate: undefined }))
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)

    // Clear error when user types
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="dark:text-gray-200">
          Task Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter task title"
          required
          className={`dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
            errors.title ? "border-red-500 dark:border-red-500" : ""
          }`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="description" className="dark:text-gray-200">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task..."
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate" className="dark:text-gray-200">
            Due Date (DD/MM/YYYY)
          </Label>
          <Input
            id="dueDate"
            value={dueDate}
            onChange={handleDateChange}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            className={`dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${
              errors.dueDate ? "border-red-500 dark:border-red-500" : ""
            }`}
          />
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
        </div>

        <div>
          <Label htmlFor="category" className="dark:text-gray-200">
            Category
          </Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Work, Personal, etc."
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority" className="dark:text-gray-200">
            Priority
          </Label>
          <Select value={priority} onValueChange={(value: "Low" | "Medium" | "High" | "Urgent") => setPriority(value)}>
            <SelectTrigger id="priority" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
              <SelectItem value="Low" className="text-blue-600 font-medium dark:text-blue-300">
                Low
              </SelectItem>
              <SelectItem value="Medium" className="text-yellow-600 font-medium dark:text-yellow-300">
                Medium
              </SelectItem>
              <SelectItem value="High" className="text-orange-600 font-medium dark:text-orange-300">
                High
              </SelectItem>
              <SelectItem value="Urgent" className="text-red-600 font-medium dark:text-red-300">
                Urgent
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status" className="dark:text-gray-200">
            Status
          </Label>
          <Select value={status} onValueChange={(value: "To Do" | "In Progress" | "Completed") => setStatus(value)}>
            <SelectTrigger id="status" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
              <SelectItem value="To Do" className="text-gray-600 font-medium dark:text-gray-300">
                To Do
              </SelectItem>
              <SelectItem value="In Progress" className="text-blue-600 font-medium dark:text-blue-300">
                In Progress
              </SelectItem>
              <SelectItem value="Completed" className="text-green-600 font-medium dark:text-green-300">
                Completed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            "Save Task"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
