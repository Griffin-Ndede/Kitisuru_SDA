import React from 'react'
import { Church } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBible } from '@fortawesome/free-solid-svg-icons'

function Navbar() {
  return (
    <>
    
      <nav className="fixed w-full z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-full px-8 py-6 shadow-lg mt-8">
            <div className="flex items-center justify-between">
              {/* Logo and Church Name */}
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faBible} className="h-8 w-8 text-white" />
                <span className="text-2xl font-semibold text-white">SDA Kitisuru</span>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center space-x-8">
                <a href="#" className="text-white font-light hover:text-gray-200 transition-colors duration-200">Home</a>
                <a href="#" className="text-white font-light hover:text-gray-200 transition-colors duration-200">About</a>
                <a href="#" className="text-white font-light hover:text-gray-200 transition-colors duration-200">Ministries</a>
                <a href="#" className="text-white font-light hover:text-gray-200 transition-colors duration-200">Events</a>
                <a href="#" className="text-white font-light hover:text-gray-200 transition-colors duration-200">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
