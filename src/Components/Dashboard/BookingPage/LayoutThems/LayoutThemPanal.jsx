import React, { useState, useEffect } from 'react';
import ThemePanel from './ThemePanel';
import ThemeBody from './ThemeBody';
import { Menu, X } from 'lucide-react';

const LayoutThemPanel = () => {
  const [layout, setLayout] = useState('default');
  const [themeColor, setThemeColor] = useState('bg-indigo-600');
  const [header, setHeader] = useState({ title: 'Ahmed', logo: null });
  const [pageProperties, setPageProperties] = useState({
    title: 'Welcome!',
    description: 'Book your appointment in a few simple steps...',
    language: 'Based on customer location',
  });
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      // Consider anything below 1024px as compact view (mobile and tablet)
      const isCompact = window.innerWidth < 1024;
      setIsCompactView(isCompact);
      
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

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className="relative min-h-screen">
      {/* Toggle Button for Mobile/Tablet */}
      {isCompactView && (
        <button 
          onClick={togglePanel}
          className="fixed top-4 right-4 z-50 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Toggle theme panel"
        >
          {isPanelVisible ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main Content Area */}
        <div 
          className={`
            ${isPanelVisible && isCompactView ? 'opacity-50' : 'opacity-100'} 
            col-span-1 lg:col-span-9 
            transition-opacity duration-300
          `}
        >
          <ThemeBody
            layout={layout} 
            themeColor={themeColor}
            header={header}
            pageProperties={pageProperties}
          />
        </div>
        
        {/* Theme Panel */}
        {isPanelVisible && (
          <div 
            className={`
              ${isCompactView 
                ? 'fixed inset-y-0 right-0 z-40 w-80 shadow-xl bg-white overflow-y-auto' 
                : 'col-span-3 h-screen sticky top-0'
              } 
              transform transition-all duration-300 ease-in-out
            `}
          >
            <ThemePanel
              onLayoutChange={setLayout} 
              onColorChange={setThemeColor}
              onHeaderChange={setHeader}
              onPagePropertiesChange={setPageProperties}
            />
          </div>
        )}
      </div>
      
      {/* Overlay for compact views */}
      {isPanelVisible && isCompactView && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setIsPanelVisible(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LayoutThemPanel;