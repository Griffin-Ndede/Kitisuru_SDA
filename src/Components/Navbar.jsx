import React, { useState } from 'react';
import { Church, Menu, X } from 'lucide-react'; // Added Menu and X icons for mobile toggle
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 ">
      <div className="bg-black/50 backdrop-blur-xs  py-6 px-4 shadow-lg ">
        <div className="flex items-center justify-between">
          {/* Logo and Church Name - Always visible */}
          <div className="flex items-center space-x-5">
            <img
              src="/images/Kitisuru Logo.png" 
              alt="Kitisuru Logo"
              className='h-10'
            />
            <Link to="/">
              <span className="text-base sm:text-xl font-extralight text-white items-center">Seventh Day Adventist <br />Church Kitisuru</span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link to="/" className="text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">Home</Link>
            <Link to='/about' className="text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">About</Link>
            <Link to="/ministries" className="text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">Ministries</Link>
            <Link to='/giving' className='text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer'>Giving</Link>
            {/* <a href="/resources" className="text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">Library</a> */}
            <Link to='/contact' className="text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">Contact</Link>
            <Link to='/getinvolved'>
              <button className='bg-white text-custom-blue py-2 px-3 rounded-3xl cursor-pointer transition-all duration-200 ease-in-out hover:cursor-pointer'>Get Involved</button>
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
            <Link to="/" className="block text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">Home</Link>
            <Link to="/about" className="block text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">About</Link>
            <Link to="/ministries" className="block text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">Ministries</Link>
            <Link to='/giving' className='text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer'>Giving</Link>
            {/* <a href="/resources" className="block text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">Library</a> */}
            <Link to='/contact' className="block text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer">Contact</Link>
            <Link to='/getinvolved' className='text-white font-light hover:text-custom-blue transition-colors duration-200 hover:cursor-pointer'><button>Get Involved</button></Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;