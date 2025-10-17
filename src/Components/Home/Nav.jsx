import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from '../../assets/image/logo.png';
import logo_icon from '../../assets/image/logo_icon.png';
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <a href="/" className="flex items-center gap-2 sm:gap-3">    
            <img 
              src={logo} 
              alt="Logo" 
              className=" h-[6.5rem] w-[100%] object-cover relative right-4 " 
            />
                      
          </a>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <li>
              <Link to="/features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-1">
                Features
              </Link>
            </li>
            <li>
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-1">
                Industries
              </a>
            </li>
            <li>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-1">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/webinars" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-1">
                Webinars
              </Link>
            </li>
         
          </ul>

          {/* Desktop Auth Links */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login" 
              className="text-red-600 hover:text-red-800 font-semibold text-lg transition-colors duration-200 px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              to="/signup" 
              className="text-red-600 hover:text-red-800 font-semibold text-lg transition-colors duration-200 px-2 py-1"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 border-t border-gray-100 bg-gray-50">
            <ul className="space-y-1 px-4">
              <li>
                <a href="/" className="block py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b border-gray-200">
                  Features
                </a>
              </li>
              <li>
                <a href="/" className="block py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b border-gray-200">
                  Industries
                </a>
              </li>
              <li>
                <Link to="/pricing" className="block py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b border-gray-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/webinars" className="block py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b border-gray-200">
                  Webinars
                </Link>
              </li>
             
              
              {/* Auth Links Mobile */}
              <div className="pt-4 space-y-3">
                <Link
                  to="/login" 
                  className="block w-full text-center py-3 text-red-600 hover:text-red-800 font-semibold text-lg border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup" 
                  className="block w-full text-center py-3 text-red-600 hover:text-red-800 font-semibold text-lg border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;