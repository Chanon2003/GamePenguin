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
import { useState } from "react"
import useMobile from "@/hooks/userMobile"

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const userId = useSelector((state: RootState) => state.user.id)
  const dispatch = useDispatch<AppDispatch>()

  const [opentapProfile, setOpentapProfile] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useMobile(768);

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
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white dark:bg-zinc-900 border-b relative">
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
        🚀 Penguin Game
      </h1>

      {/* Desktop / Mobile */}
      {isMobile ? (
        // Mobile: Hamburger menu
        <div className="relative">
          <button
            className="text-zinc-800 dark:text-zinc-100 p-2 bg-zinc-200 dark:bg-zinc-700 rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg py-2 flex flex-col gap-2">
              {/* Theme Toggle */}
              <button
                className="bg-transparent text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 p-2 rounded transition-colors"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>

              {userId ? (
                <>
                  <button
                    className="px-4 py-2 text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                    onClick={() => setOpentapProfile(!opentapProfile)}
                  >
                    Profile
                  </button>
                  {/* {opentapProfile && (
                    <div className="px-4 py-2 text-zinc-700 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-700 rounded">
                      Profile panel content
                    </div>
                  )} */}
                  <button
                    className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        // Desktop
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            className="bg-transparent text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 p-2 rounded transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {userId ? (
            <div className="flex items-center gap-3 relative">
              {/* Profile Avatar */}
              <div
                className="bg-white dark:bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow hover:shadow-md transition-shadow"
                onClick={() => setOpentapProfile(!opentapProfile)}
              >
                soi
              </div>

              {/* Profile Dropdown */}
              {opentapProfile && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg py-2">
                  <p className="px-4 py-2 text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                    Profile
                  </p>
                  <p
                    className="px-4 py-2 text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="bg-blue-500 text-white dark:bg-green-600 dark:text-yellow-300 dark:hover:bg-green-700 cursor-pointer px-4 py-2 rounded"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="bg-blue-500 text-white dark:bg-green-600 dark:text-yellow-300 dark:hover:bg-green-700 cursor-pointer px-4 py-2 rounded"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}


export default Navbar
