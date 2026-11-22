import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './Pages/Home'
import About from './Pages/About'
import './index.css'
import Ministries from './Pages/Ministries'
import GetInvolved from './Pages/GetInvolved'
import Giving from './Pages/Giving'
import Contact from './Pages/Contact'
import Resources from './Pages/Resources'
import MinistriesDetails from './Pages/MinistriesDetails'
import ErrorPage from './Pages/ErrorPage'
import {
  homeLoader,
  ministriesLoader,
  ministryLoader,
  resourcesLoader,
} from './Loaders/loaders'

// The root route's errorElement catches every loader failure and unknown address.
const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      { path: 'about', element: <About /> },
      { path: 'ministries', element: <Ministries />, loader: ministriesLoader },
      { path: 'ministries/:id', element: <MinistriesDetails />, loader: ministryLoader },
      { path: 'resources', element: <Resources />, loader: resourcesLoader },
      { path: 'giving', element: <Giving /> },
      { path: 'getinvolved', element: <GetInvolved /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
