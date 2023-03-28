
import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { Reptile } from './pages/Reptile'
import { Login } from './pages/Login'
import React from 'react'

const router = createBrowserRouter([{
  path: "/",
  element: <Home />
}, {
  path: "/signup",
  element: <Signup />
}, {
  path: "/dashboard",
  element: <Dashboard />
}, {
  path: "/reptiles/:id",
  element: <Reptile />
}, 
{
  path: "/login",
  element: <Login />
}
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
