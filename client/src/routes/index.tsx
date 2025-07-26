import App from "@/App";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import Home from "@/pages/layout/Home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {path: "", element: <Home />},
      {path: "/login", element: <Login />},
      {path: "/register", element: <Register />},

    ],
  }
])