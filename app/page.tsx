import TaskManager from "@/components/task-manager"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-[url('/whatsapp-bg.jpg')] dark:bg-[url('/whatsapp-bg-dark.jpg')] bg-repeat">
      <div className="max-w-md mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border dark:border-gray-700">
        <h1 className="text-xl font-bold p-4 bg-emerald-600 dark:bg-emerald-800 text-white text-center">
          Summer Internship Tracker
        </h1>
        <TaskManager />
        <Footer />
      </div>
    </main>
  )
}

