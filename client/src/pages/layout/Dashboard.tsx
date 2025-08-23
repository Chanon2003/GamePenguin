import { Outlet } from "react-router-dom"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

const DashBoard = () => {
  const userId = useSelector((state: RootState) => state.user.role)


  return (
    <section>
      dashboard
      <div className="">
        <Outlet />
      </div>
    </section>
  )
}
export default DashBoard