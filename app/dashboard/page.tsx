"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { taskService, type Task } from "@/lib/task-service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import TaskForm from "@/components/task-form"
import NewsTicker from "@/components/news-ticker"
import { initializeDatabase } from "@/lib/supabase/client"

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<{
    total: number
    todo: number
    inProgress: number
    completed: number
    urgent: number
    dueSoon: Task[]
  }>({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    urgent: 0,
    dueSoon: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Initialize database if needed
        await initializeDatabase()

        const [fetchedTasks, taskStats] = await Promise.all([taskService.getTasks(), taskService.getTaskStats()])
        setTasks(fetchedTasks)
        setStats(taskStats)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleAddTask = async (task: Omit<Task, "id" | "userId">) => {
    try {
      const newTask = await taskService.addTask(task)
      if (newTask) {
        setIsFormOpen(false)

        // Refresh data
        const [fetchedTasks, taskStats] = await Promise.all([taskService.getTasks(), taskService.getTaskStats()])
        setTasks(fetchedTasks)
        setStats(taskStats)

        toast({
          title: "Task Added",
          description: "Your task has been added successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to add task:", error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "Urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
        <p className="mt-4 text-emerald-600 font-medium dark:text-emerald-400">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's an overview of your tasks.</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>Add a new task to your list</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskForm onSubmit={handleAddTask} onCancel={() => setIsFormOpen(false)} />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">To Do</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.todo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-emerald-500" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.dueSoon.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <p>No upcoming tasks due in the next 7 days</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.dueSoon.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/upcoming")} className="w-full">
              View All Upcoming Tasks
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Urgent Tasks
            </CardTitle>
            <CardDescription>Tasks marked as urgent</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.filter((t) => t.priority === "Urgent").length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <p>No urgent tasks at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks
                  .filter((t) => t.priority === "Urgent")
                  .slice(0, 5)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                        {task.dueDate && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/tasks?priority=Urgent")}
              className="w-full"
            >
              View All Urgent Tasks
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
            Recent Tasks
          </CardTitle>
          <CardDescription>Your most recently added tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="todo">To Do</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {tasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <p>No tasks found. Create your first task to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                        {task.dueDate && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="todo">
              {tasks.filter((t) => t.status === "To Do").length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <p>No tasks in To Do status</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks
                    .filter((t) => t.status === "To Do")
                    .slice(0, 5)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                          {task.dueDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                          )}
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="in-progress">
              {tasks.filter((t) => t.status === "In Progress").length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <p>No tasks in In Progress status</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks
                    .filter((t) => t.status === "In Progress")
                    .slice(0, 5)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                          {task.dueDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                          )}
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed">
              {tasks.filter((t) => t.status === "Completed").length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <p>No completed tasks</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks
                    .filter((t) => t.status === "Completed")
                    .slice(0, 5)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                          {task.dueDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                          )}
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/tasks")} className="w-full">
            View All Tasks
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6">
        <NewsTicker />
      </div>
    </div>
  )
}
