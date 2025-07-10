import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import SettingSidebar from './SettingSidebar';
import NavDashbord from '../Dashboard/NavDashbord';
import { Menu, X } from 'lucide-react';

export default function SettingsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    isMobile: false,
    isTablet: false
  });

  // Check viewport size on mount and window resize
  useEffect(() => {
    const checkViewportSize = () => {
      const width = window.innerWidth;
      setViewportSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024
      });
      
      // Auto-close sidebar on small screens, auto-open on large screens
      if (width >= 1024) {
        setSidebarOpen(true);
      } else if (!sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    checkViewportSize();
    
    // Add event listener
    window.addEventListener('resize', checkViewportSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkViewportSize);
  }, []);

  // Close sidebar when clicking outside on mobile or tablet
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

  // Handle toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determine if we're on a compact display (mobile or tablet)
  const isCompactDisplay = viewportSize.isMobile || viewportSize.isTablet;

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile/Tablet menu button */}
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

      {/* Overlay when sidebar is open on mobile/tablet */}
      {isCompactDisplay && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div 
        id="settings-sidebar"
        className={`
          ${isCompactDisplay ? 'fixed z-30 h-full' : 'relative w-64'} 
          ${isCompactDisplay && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} 
          transition-transform duration-300 ease-in-out shadow-md
        `}
      >
        <SettingSidebar 
          iconOnly={isCompactDisplay && !sidebarOpen} 
          onItemClick={() => isCompactDisplay && setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div>
          <NavDashbord 
            toggleSidebar={toggleSidebar} 
            isMobile={isCompactDisplay} 
            sidebarOpen={sidebarOpen}
          />
        </div>

        <div className="p-3 sm:p-4 lg:p-8 flex-1 overflow-auto bg-white rounded-lg shadow-md m-2 sm:mx-4 lg:mx-6 sm:my-3 lg:my-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}