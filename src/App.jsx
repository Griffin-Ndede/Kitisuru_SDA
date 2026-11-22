import React from 'react'
import { createBrowserRouter, Outlet, redirect, RouterProvider } from 'react-router'
import { ToastProvider } from './Context/ToastContext'
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
import DashboardLayout from './Pages/Dashboard/DashboardLayout'
import Overview from './Pages/Dashboard/Overview'
import Profile from './Pages/Dashboard/Profile'
import Members from './Pages/Dashboard/Members'
import Clusters from './Pages/Dashboard/Clusters'
import SignUpAccess from './Pages/Dashboard/SignUpAccess'
import Privacy from './Pages/Privacy'
import {
  homeLoader,
  ministriesLoader,
  ministryDetailsLoader,
  resourcesLoader,
  signInLoader,
  dashboardLoader,
  membersLoader,
  signUpAccessLoader,
  joinLoader,
} from './Loaders/loaders'

// All the site's pages. The root route's errorElement is shown instead of a
// page if its loader fails or the address doesn't exist.
// To add a page, add it here and give it a loader in src/Loaders/loaders.js.
const router = createBrowserRouter([
  {
    path: '/',
    // Wraps every page so any of them can show a toast
    element: <ToastProvider><Outlet /></ToastProvider>,
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
      { path: 'privacy', element: <Privacy /> },
      // The old address of the dashboard
      { path: 'app/*', loader: () => redirect('/dashboard') },
      {
        // The dashboard. dashboardLoader sends signed-out people to /signin.
        path: 'dashboard',
        id: 'dashboard',
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          { index: true, element: <Overview /> },
          { path: 'profile', element: <Profile /> },
          // Admin only: the API answers 403 to anyone else and the error page explains
          { path: 'members', element: <Members />, loader: membersLoader },
          { path: 'clusters', element: <Clusters />, loader: membersLoader },
          { path: 'sign-up', element: <SignUpAccess />, loader: signUpAccessLoader },
        ],
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
