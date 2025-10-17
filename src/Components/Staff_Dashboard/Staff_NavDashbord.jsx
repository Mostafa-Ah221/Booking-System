import React, { useState, useEffect, useRef } from 'react';
import { Bell, Settings, Plus, Menu } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileData, StaffFetchProfileData } from '../../redux/apiCalls/ProfileCallApi';
import ProfilePanel from '../Dashboard/ProfilePanel';

export default function StaffNavDashbord({ isSidebarOpen, setIsSidebarOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const userType = localStorage.getItem("userType");

  const { profile, staffProfile, loading = false } = useSelector(state => state.profileData);

  
  const currentProfile = userType === 'staff' ? staffProfile : profile;
  const fetchFunction = userType === 'staff' ? StaffFetchProfileData : fetchProfileData;

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const notificationsRef = useRef(null);
  const bellButtonRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentProfile && !loading && !profileLoaded) {
      dispatch(fetchFunction());
      setProfileLoaded(true);
    }
  }, [dispatch, currentProfile, loading, profileLoaded, fetchFunction]);

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
    <div className="w-full flex items-center relative shadow-[0_6px_10px_-4px_rgba(0,0,0,0.1)]">
      {/* Mobile Menu Button */}
      <div className="flex w-full items-center bg-white px-4 py-[10px] lg:hidden">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-gray-600 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {/* Your trial ends in 15 days.
          <a href="#" className="text-purple-600 ml-1 hover:underline">Upgrade now</a> */}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Profile Button - تحسين التعامل مع الصورة */}
          <button
            onClick={toggleProfile}
            className="w-7 h-7 xs:w-7 xs:h-7 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center overflow-hidden"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : currentProfile?.user?.photo ? (
              <img
                src={currentProfile.user.photo}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border border-gray-200"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <CgProfile className="w-5 h-5 text-gray-400" />
            )}
            
            {/* Fallback icon (مخفي افتراضياً) */}
            {currentProfile?.user?.photo && (
              <CgProfile 
                className="w-5 h-5 text-gray-400" 
                style={{ display: 'none' }}
              />
            )}
          </button>
        </div>
      </header>

      {/* Profile Panel - Rendered at root level */}
      <ProfilePanel 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}