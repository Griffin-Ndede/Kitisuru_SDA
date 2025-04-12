import Home from './Pages/Home'
import About from './Pages/About'
import './index.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Ministries from './Pages/Ministries'
import GetInvolved from './Pages/GetInvolved'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/ministries' element={<Ministries/>}/>
          <Route path='/getinvolved' element={<GetInvolved/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
