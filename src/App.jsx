import Home from './Pages/Home'
import About from './Pages/About'
import './index.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Ministries from './Pages/Ministries'
import GetInvolved from './Pages/GetInvolved'
import  Giving from './Pages/Giving'
import Contact from './Pages/Contact'
import Resources from './Pages/Resources'
import MinistriesDetails from './Pages/MinistriesDetails'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/ministries' element={<Ministries/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/getinvolved' element={<GetInvolved/>}/>
          <Route path='/giving' element={<Giving/>}/>
          <Route path='/resources' element={<Resources/>}/>
          <Route path='/ministriesdetail' element= {<MinistriesDetails/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
