import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import SettingSidebar from './SettingSidebar';
import { Menu, X } from 'lucide-react';

export default function SettingsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    isMobile: false,
    isTablet: false
  });

  useEffect(() => {
    const checkViewportSize = () => {
      const width = window.innerWidth;
      setViewportSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024
      });
      
      if (width >= 1024) {
        setSidebarOpen(true);
      } else if (!sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    checkViewportSize();
    window.addEventListener('resize', checkViewportSize);
    
    return () => window.removeEventListener('resize', checkViewportSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('settings-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if ((viewportSize.isMobile || viewportSize.isTablet) && 
          sidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          menuButton && 
          !menuButton.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [viewportSize, sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isCompactDisplay = viewportSize.isMobile || viewportSize.isTablet;

  return (
    <div className="flex h-full bg-gray-50">
      {isCompactDisplay && (
        <button 
          id="mobile-menu-button"
          onClick={toggleSidebar} 
          className="fixed z-40 bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {isCompactDisplay && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div 
        id="settings-sidebar"
        className={`
          ${isCompactDisplay ? 'fixed z-30 h-full top-0' : 'relative w-64'} 
          ${isCompactDisplay && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} 
          transition-transform duration-300 ease-in-out shadow-md
        `}
      >
        <SettingSidebar 
          iconOnly={isCompactDisplay && !sidebarOpen} 
          onItemClick={() => isCompactDisplay && setSidebarOpen(false)}
        />
      </div>

      {/* Main content - NO overflow here! */}
      <div className="flex-1 p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-md h-full p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}