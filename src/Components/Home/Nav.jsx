import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <a href="/" className="flex items-center gap-2 sm:gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              xmlSpace="preserve"
              className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
            >
              <path
                fill="#226DB4"
                d="M995.8,249.6c-16.5-39.1-40.2-74.3-70.4-104.5S860,91.3,820.9,74.7c-13-5.5-26.3-10.1-39.8-13.9V32.9  c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9v17.2c-9.4-0.8-18.9-1.2-28.4-1.2h-301c-16.5,0-29.9,13.4-29.9,29.9  c0,16.5,13.4,29.9,29.9,29.9H693c9.6,0,19,0.5,28.4,1.5v15.3c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9v-2  c37.9,13.1,72.7,34.8,102,64c50.8,50.8,78.8,118.3,78.8,190.1v315.4c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8  h-73c-16.5,0-29.9,13.4-29.9,29.9s13.4,29.9,29.9,29.9h73c44.4,0,87.4-8.7,127.9-25.8c39.1-16.5,74.3-40.2,104.5-70.4  s53.9-65.3,70.4-104.5c17.2-40.5,25.8-83.6,25.8-127.9V377.5C1021.6,333.2,1012.9,290.1,995.8,249.6z"
              />
              <path
                fill="#226DB4"
                d="M659.6,692.6c0-44.4-8.7-87.4-25.8-127.9c-11.1-26.2-25.4-50.7-42.7-73l-43.9,40.9c34.2,46,52.7,101.6,52.7,160  c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8s-139.3-28-190.1-78.8c-50.8-50.8-78.8-118.3-78.8-190.1  s28-139.3,78.8-190.1c50.8-50.8,118.3-78.8,190.1-78.8c65.1,0,126.7,23,175.4,65.1l43.9-40.9c-27.1-24.4-57.8-43.9-91.4-58.1  c-40.5-17.2-83.6-25.8-127.9-25.8s-87.4,8.7-127.9,25.8c-39.1,16.5-74.3,40.2-104.5,70.4c-13.5,13.5-25.7,28-36.5,43.3v-126  c0-62.6,22-123.5,61.8-171.6c31.4-37.9,72.7-66.4,118.6-82.4v1.2c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9V84.9  c0-0.1,0-0.3,0-0.4V32.3c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9V61c-64,17.9-121.8,55.2-164.6,106.8  c-23.9,28.9-42.6,61.3-55.5,96.3C9.1,300.4,2.4,338.5,2.4,377.5v315.4c0,44.4,8.7,87.4,25.8,127.9c16.5,39.1,40.2,74.3,70.4,104.5  c30.2,30.2,65.3,53.9,104.5,70.4c40.5,17.2,83.6,25.8,127.9,25.8c1.6,0,3.2-0.1,4.8-0.4c42.6-0.6,84-9.2,123.1-25.8  c39.1-16.5,74.3-40.2,104.5-70.4s53.9-65.3,70.4-104.5C651,780,659.6,736.9,659.6,692.6z"
              />
              <path
                fill="#089949"
                d="M332.4,650.7l-76.3-81.4c-11.3-12-30.2-12.7-42.2-1.4c-12,11.3-12.6,30.2-1.4,42.2l96.6,103.1  c5.9,6.3,13.8,9.5,21.8,9.5c7.3,0,14.6-2.7,20.3-8l195.8-182.3l43.9-40.9l56.8-52.9c12.1-11.2,12.8-30.2,1.5-42.2  c-11.2-12.1-30.1-12.8-42.2-1.5l-56.8,52.9l-43.9,40.9L332.4,650.7z"
              />
            </svg>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              Appoint Roll
            </div>
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