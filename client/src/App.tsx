import { Outlet } from "react-router-dom"
import Navbar from "./pages/layout/Navbar"
import { Toaster } from 'sonner'

function App() {
  return (
    <div>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
        <Navbar />
        <main>
          <Outlet /> {/* หน้านี้จะถูกแทนที่ด้วย children route */}
        </main>
      </div>
    </div>
  )
}

export default App