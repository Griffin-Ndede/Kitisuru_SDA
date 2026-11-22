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
  ministryDetailsLoader,
  resourcesLoader,
} from './Loaders/loaders'

// All the site's pages. The root route's errorElement is shown instead of a
// page if its loader fails or the address doesn't exist.
// To add a page, add it here and give it a loader in src/Loaders/loaders.js.
const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      { path: 'about', element: <About /> },
      { path: 'ministries', element: <Ministries />, loader: ministriesLoader },
      { path: 'ministries/:id', element: <MinistriesDetails />, loader: ministryDetailsLoader },
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
