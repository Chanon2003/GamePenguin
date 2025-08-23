import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import type { AppDispatch } from "@/store/store"
import { toast } from "sonner"
import SummaryApi from "@/common/SummaryApi"
import Axios from "@/utils/Axios"

// import { persistor } from '@/store/store'
import { logout } from "@/store/userSlice"

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const userId = useSelector((state: RootState) => state.user.id)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      }) // ไปสั่ง backend clear cookie
      if (response.data.success) {
        localStorage.clear()        // ถ้าอยากเคลียร์ persist ทั้งหมด
        dispatch(logout())          // เคลียร์ user state ใน redux
        toast.success("Logged out successfully")
        navigate("/login")
      }
    } catch (err) {
      toast.error("Error logging out")
    }
  }


  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white dark:bg-zinc-900 border-b">
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
        🚀 Penguin Game
      </h1>

      <div className="flex items-center gap-4">
        <Button
          className="bg-transparent text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        {
          userId
            ? <Button
              className="bg-blue-500 text-white dark:bg-green-600 dark:text-yellow-300 dark:hover:bg-green-700 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Button>
            : <>
              <Button
                className="bg-blue-500 text-white dark:bg-green-600 dark:text-yellow-300 dark:hover:bg-green-700 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="bg-blue-500 text-white dark:bg-green-600 dark:text-yellow-300 dark:hover:bg-green-700 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                sign up
              </Button>
            </>
        }
      </div>
    </header>
  )
}


export default Navbar
