import React, { useState } from 'react';
import { Church, Menu, X } from 'lucide-react'; // Added Menu and X icons for mobile toggle
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 px-4 py-5">
      <div className="max-w-7xl mx-auto lg:rounded-full rounded-3xl">
        <div className="bg-black/50 backdrop-blur-xs lg:rounded-full rounded-3xl px-4 sm:px-10 py-4 sm:py-8 shadow-lg mt-4 sm:mt-8">
          <div className="flex items-center justify-between">
            {/* Logo and Church Name - Always visible */}
            <div className="flex items-center space-x-3">
              <Link to="/"> <span className="text-2xl sm:text-4xl text-white">SDA Kitisuru</span></Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link to="/" className="text-white font-light hover:text-blue-700 transition-colors duration-200">Home</Link>
              <Link to='/about' className="text-white font-light hover:text-blue-700 transition-colors duration-200">About</Link>
              <Link to="/ministries" className="text-white font-light hover:text-blue-700 transition-colors duration-200">Ministries</Link>
              <Link to='/giving' className='text-white font-light hover:text-blue-700 transition-colors duration-200'>Giving</Link>
              <a href="#upcoming" className="text-white font-light hover:text-blue-700 transition-colors duration-200">Events</a>
              <Link to='/contact' className="text-white font-light hover:text-blue-700 transition-colors duration-200">Contact</Link>
              <Link to='/getinvolved'>
                <button className='bg-white text-blue-700 py-2 px-3 rounded-3xl cursor-pointer transition-all duration-200 ease-in-out'>Get Involved</button>
              </Link>
            </div>

            {/* Mobile Menu Button - Visible only on mobile */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu - Slides down when open */}
          {isOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 rounded-3xl">
              <Link to="/" className="block text-white font-light hover:text-blue-700 transition-colors duration-200">Home</Link>
              <Link to="/about" className="block text-white font-light hover:text-blue-700 transition-colors duration-200">About</Link>
              <Link to="/ministries" className="block text-white font-light hover:text-blue-700 transition-colors duration-200">Ministries</Link>
              <Link to='/giving' className='text-white font-light hover:text-blue-700 transition-colors duration-200'>Giving</Link>
              <a href="#upcoming" className="block text-white font-light hover:text-blue-700 transition-colors duration-200">Events</a>
              <Link to='/contact' className="block text-white font-light hover:text-blue-700 transition-colors duration-200">Contact</Link>
              <Link to='/getinvolved' className='text-white font-light hover:text-blue-700 transition-colors duration-200'><button>Get Involved</button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;