import React, { useState, useEffect } from 'react';
import ClassicLayout from './ClassicLayout';
import FreshLayout from './FreshLayout';
import ModernWebLayout from './ModernWebLayout';
import NewLayout from './NewLayout';
import WorkspaceThemePanel from '../WorkspaceThemePanal';
import { Menu, X } from 'lucide-react';

export default function AllLayout() {
  const [selectedLayout, setSelectedLayout] = useState('classic'); 
  const [selectedColor, setSelectedColor] = useState('#4f46e5');
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      // Consider both mobile and tablet as compact views (anything under 1024px)
      const compact = window.innerWidth < 1024;
      setIsCompact(compact);
      
      // Auto-show panel on desktop, hide on mobile/tablet
      if (window.innerWidth >= 1024) {
        setIsPanelVisible(true);
      } else {
        setIsPanelVisible(false);
      }
    };

    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    if (isCompact) {
      setIsPanelVisible(false); // Auto-close panel after selection on mobile/tablet
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className="relative">
      {/* Mobile/Tablet Menu Icon */}
      {isCompact && (
        <button 
          onClick={togglePanel}
          className="fixed top-4 right-4 z-50 bg-indigo-600 text-white p-2 rounded-full shadow-lg"
          aria-label="Toggle theme panel"
        >
          {isPanelVisible ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Main Content */}
        <div className={`${isPanelVisible && isCompact ? 'opacity-50' : 'opacity-100'} col-span-1 lg:col-span-9 transition-opacity duration-300`}>
          {selectedLayout === 'classic' && <ClassicLayout themeColor={selectedColor} />}
          {selectedLayout === 'fresh' && <FreshLayout />}
          {selectedLayout === 'modernWeb' && <ModernWebLayout themeColor={selectedColor} />}
          {selectedLayout === 'newLayout' && <NewLayout themeColor={selectedColor} />}
        </div>
        
        {/* Theme Panel - Hidden on mobile/tablet until toggled */}
        {isPanelVisible && (
          <div className={`
            ${isCompact ? 'fixed inset-y-0 right-0 z-40 w-72 shadow-xl bg-white overflow-y-auto' : 'col-span-3'} 
            transform transition-transform duration-300 ease-in-out
          `}>
            <WorkspaceThemePanel 
              onLayoutChange={handleLayoutChange} 
              onColorChange={handleColorChange} 
            />
          </div>
        )}
      </div>
      
      {/* Overlay to close panel when clicking outside (mobile/tablet only) */}
      {isPanelVisible && isCompact && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setIsPanelVisible(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}