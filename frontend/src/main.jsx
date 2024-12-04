import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from './pages/Login'
import Landing from './pages/Landing'
import Register from './pages/Register'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import DashboardUser from './pages/user/DashboardUser'
import BookListUser from './pages/user/BookListUser'
import BookListAdmin from './pages/admin/BookListAdmin'
import MyBookUser from './pages/user/MyBookUser'
import AccountListAdmin from './pages/admin/AccountListAdmin'

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
      path: "/accountlist",
      element: <AccountListAdmin/>
    },
    {
      path: "/booklistadmin",
      element: <BookListAdmin/>
    },
    {
      path: "/borrowlist",
      element: <MyBookUser/>
    },
  ]
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
