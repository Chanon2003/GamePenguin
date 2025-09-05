import type { ReactNode } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store" 

interface AdminPermisionProps {
  children: ReactNode
}

const AdminPermision: React.FC<AdminPermisionProps> = ({ children }) => {
  // ดึง user จาก Redux store
  const user = useSelector((state: RootState) => state.user)
  return (
    <>
      {(user?.id && (user.role === "user" || user.role === "admin")) ? (
      children
    ) : (
      <p className="text-red-600 bg-red-100 p-4">
        Do not have permission !!
      </p>
    )}
    </>
  )
}

export default AdminPermision
