import { Outlet } from "react-router-dom"
import Navbar from "./pages/layout/Navbar"

function App() {
  return (
    <div>
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