
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { SignUp } from './pages/SignUp'
import { Dashboard } from './pages/Dashboard'
import { Reptile } from './pages/Reptile'

const router = createBrowserRouter([{
  path: "/",
  element: <Home />
}, {
  path: "/signup",
  element: <SignUp />
}, {
  path: "/dashboard",
  element: <Dashboard />
}, {
  path: "/reptiles/:id",
  element: <Reptile />
}])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
