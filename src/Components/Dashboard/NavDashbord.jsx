import React, { useState, useEffect, useRef } from 'react';
import { Bell, Settings, Plus } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import AddNewMenu from './AddMenus/AddNewMenu';
import Notifictions from './Notifictions';
import ProfilePanel from './ProfilePanel';

export default function NavDashbord() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const notificationsRef = useRef(null);
  const bellButtonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative shadow-[0_6px_10px_-4px_rgba(0,0,0,0.1)]">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Your trial ends in 15 days.
          <a href="#" className="text-purple-600 ml-1 hover:underline">Upgrade now</a>
        </div>
        <div className="flex items-center gap-4">
          {/* Add Button */}
          <button 
            ref={buttonRef} 
            onClick={toggleMenu} 
            className="p-2 text-purple-600 bg-purple-600 bg-opacity-10 rounded-full hover:bg-opacity-20 transition-colors"
          >
            <Plus size={18} />
          </button>

          {/* Notifications Button */}
          <button 
            ref={bellButtonRef} 
            onClick={toggleNotifications} 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell size={18} />
          </button>

          {/* Settings Button */}
          <Link 
            to='/setting' 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings size={18} />
          </Link>

          {/* Profile Button */}
          <button 
            onClick={toggleProfile} 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CgProfile className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </header>

      {/* AddNewMenu */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-14 right-3 z-20">
          <AddNewMenu />
        </div>
      )}

      {/* Notifications Panel */}
      {isNotificationsOpen && (
        <div ref={notificationsRef} className="absolute top-14 right-0 z-20">
          <Notifictions 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>
      )}

      {/* Profile Panel - Rendered at root level */}
      <ProfilePanel 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}