import Home from './Pages/Home'
import About from './Pages/About'
import './index.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Ministries from './Pages/Ministries'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/ministries' element={<Ministries/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
