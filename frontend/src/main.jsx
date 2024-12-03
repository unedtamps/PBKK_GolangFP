import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from './pages/Login'
import Landing from './pages/Landing'
import Register from './pages/Register'
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardUser from './pages/DashboardUser'
import BookListUser from './pages/BookListUser'
import MyBookUser from './pages/MyBookUser'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Landing/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/register",
      element: <Register/>
    },
    {
      path: "/dashboard",
      element: <DashboardAdmin/>
    },
    {
      path: "/dashboarduser",
      element: <DashboardUser/>
    },
    {
      path: "/booklistuser",
      element: <BookListUser/>
    },
    {
      path: "/mybook",
      element: <MyBookUser/>
    },
  ]
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
