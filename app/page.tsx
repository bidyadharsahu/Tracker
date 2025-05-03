import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-[url('/whatsapp-bg.png')] dark:bg-[url('/whatsapp-bg-dark.png')] bg-repeat">
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border dark:border-gray-700 mt-10">
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">Task Manager</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Organize your tasks, boost your productivity, and never miss a deadline again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Organize</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create, categorize, and prioritize your tasks to stay organized.
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Track</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your progress and never miss important deadlines.
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Collaborate</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Share tasks and work together with your team efficiently.
            </p>
          </div>
        </div>
        <footer className="py-4 px-8 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
          <p>
            Developed by <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bidyadhar</span> with ❤️
          </p>
        </footer>
      </div>
    </main>
  )
}
