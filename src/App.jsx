import React from 'react'
import { createBrowserRouter, Outlet, redirect, RouterProvider } from 'react-router'
import { ToastProvider } from './Context/ToastContext'
import Home from './Pages/Home'
import About from './Pages/About'
import './index.css'
import GetInvolved from './Pages/GetInvolved'
import Giving from './Pages/Giving'
import Contact from './Pages/Contact'
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
import Ministries from './Pages/Dashboard/Ministries'
import MinistryDetail from './Pages/Dashboard/MinistryDetail'
import Library from './Pages/Dashboard/Library'
import Announcements from './Pages/Dashboard/Announcements'
import SignUpAccess from './Pages/Dashboard/SignUpAccess'
import Requests from './Pages/Dashboard/Requests'
import Privacy from './Pages/Privacy'
import {
  homeLoader,
  ministriesLoader,
  ministryDetailsLoader,
  libraryLoader,
  announcementsLoader,
  overviewLoader,
  getInvolvedLoader,
  requestsLoader,
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
      // Ministries and the library moved into the dashboard
      { path: 'ministries/*', loader: () => redirect('/dashboard/ministries') },
      { path: 'resources', loader: () => redirect('/dashboard/library') },
      { path: 'giving', element: <Giving /> },
      { path: 'getinvolved', element: <GetInvolved />, loader: getInvolvedLoader },
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
          { index: true, element: <Overview />, loader: overviewLoader },
          { path: 'announcements', element: <Announcements />, loader: announcementsLoader },
          { path: 'profile', element: <Profile /> },
          { path: 'ministries', element: <Ministries />, loader: ministriesLoader },
          { path: 'ministries/:id', element: <MinistryDetail />, loader: ministryDetailsLoader },
          { path: 'library', element: <Library />, loader: libraryLoader },
          // Admin only: the API answers 403 to anyone else and the error page explains
          { path: 'members', element: <Members />, loader: membersLoader },
          { path: 'clusters', element: <Clusters />, loader: membersLoader },
          { path: 'requests', element: <Requests />, loader: requestsLoader },
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
