import { Outlet } from "react-router-dom"

const DashBoard = () => {
  
  return (
    <section>
      <div className="">
        <Outlet />
      </div>
    </section>
  )
}
export default DashBoard