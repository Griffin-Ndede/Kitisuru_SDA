import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './Pages/Home'
import About from './Pages/About'
import './index.css'
import 'antd/dist/reset.css'; 
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
