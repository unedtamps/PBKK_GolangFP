import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from './pages/Login'
import Landing from './pages/Landing'
import Register from './pages/Register'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import Home from './pages/user/Home'
import BookListAdmin from './pages/admin/BookListAdmin'
import AccountListAdmin from './pages/admin/AccountListAdmin'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import MyBooks from './pages/user/MyBookUser'
import BorrowHistory from './pages/admin/BorrowHistory'
import BookListUser from './pages/user/BookListUser'


const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Landing />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/dashboard",
      element: <DashboardAdmin />
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/accountlist",
      element: <AccountListAdmin />
    },
    {
      path: "/booklistadmin",
      element: <BookListAdmin />
    },
    {
      path: "/mybook",
      element: <MyBooks />
    },
    {
      path: "/borrow-history",
      element: <BorrowHistory />
    },
    {
      path: "/allbook",
      element: <BookListUser />
    },
  ]
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>,
)
