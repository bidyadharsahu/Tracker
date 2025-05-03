import type { Task } from "@/lib/task-service"

type TaskStatsProps = {
  tasks: Task[]
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  if (tasks.length === 0) return null

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-800/30">
        <div className="text-xs text-gray-500 dark:text-gray-400">To Do</div>
        <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
          {tasks.filter((t) => t.status === "To Do").length}
        </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800/30">
        <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {tasks.filter((t) => t.status === "In Progress").length}
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-100 dark:border-green-800/30">
        <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
        <div className="text-lg font-bold text-green-600 dark:text-green-400">
          {tasks.filter((t) => t.status === "Completed").length}
        </div>
      </div>
    </div>
  )
}
