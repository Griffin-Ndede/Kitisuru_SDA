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
import SignIn from './Pages/SignIn'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'
import Join from './Pages/Join'
import PortalLayout from './Pages/Portal/PortalLayout'
import PortalHome from './Pages/Portal/PortalHome'
import People from './Pages/Portal/People'
import {
  homeLoader,
  ministriesLoader,
  ministryDetailsLoader,
  resourcesLoader,
  signInLoader,
  portalLoader,
  peopleLoader,
  joinLoader,
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
      { path: 'signin', element: <SignIn />, loader: signInLoader },
      { path: 'join', element: <Join />, loader: joinLoader },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      {
        // The member portal. portalLoader sends signed-out people to /signin.
        path: 'app',
        id: 'portal',
        element: <PortalLayout />,
        loader: portalLoader,
        children: [
          { index: true, element: <PortalHome /> },
          { path: 'people', element: <People />, loader: peopleLoader },
        ],
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
