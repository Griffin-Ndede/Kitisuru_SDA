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
import { homeLoader } from './Loaders/Homeloader'
import { ministriesLoader } from './Loaders/MinistriesLoader'
import { ministriesDetailsLoader } from './Loaders/MinistriesDetailsLoader'

function App() {

  const Router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      loader: homeLoader
    },
    {
      path: '/about',
      element: <About />,

    },
    {
      path: '/ministries',
      element: <Ministries />,
      loader: ministriesLoader
    },
    {
      path: '/contact',
      element: <Contact />
    },
    {
      path: '/getinvolved',
      element: <GetInvolved />
    },
    {
      path: '/giving',
      element: <Giving />
    },
    {
      path: '/resources',
      element: <Resources />
    },
    {
      path: '/ministries/:id',
      element: <MinistriesDetails />,
      loader: ministriesDetailsLoader
    }
  ])

  return (
    <>
      <RouterProvider router={Router} />
    </>
  )
}

export default App



  {/* <div className="w-full max-w-6xl mx-auto p-6 rounded-2xl shadow-lg bg-white space-y-6 mb-10">
            <h2 className="text-2xl font-bold text-center text-gray-800">Fundraising Progress</h2>

            <div className="text-center">
              <p className="text-sm text-white">Total fundraising progress</p>
              <p className="font-medium text-gray-700">
                {amountRaised} of {totalGoal}
              </p>
            </div>

            <div className="w-full">
              <div className="flex justify-between text-sm mb-1 font-medium text-gray-600">
                <span>{value}%</span>
                <span>{value}% of goal reached</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-green-600 transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>

            <div className=" flex justify-between gap-4 text-center py-4 ">
              <div className="space-y-1 bg-green-600 p-5 rounded-3xl w-full">
                <p className="text-lg">Raised</p>
                <p className="font-bold ">{amountRaised}</p>
              </div>
              <div className="space-y-1 bg-amber-400 p-5 rounded-3xl w-full">
                <p className="text-lg  ">Target</p>
                <p className="font-bold ">{totalGoal}</p>
              </div>
              <div className="space-y-1 bg-red-600 p-5 rounded-3xl w-full">
                <p className="text-lg">Balance</p>
                <p className="font-bold ">{totalGoal - amountRaised}</p>
              </div>
            </div>
          </div> */}