import React, { useState, useEffect } from 'react';
import { Search, Share, Layout, ExternalLink, RefreshCw, Settings } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import ShareBooking from './ShareBooking';

const BookPage = () => {
  const [activeTab, setActiveTab] = useState('interviews');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  
  const tabs = [
    { id: 'interviews', label: 'Interviews' },
    { id: 'recruiters', label: 'Recruiters' },
    { id: 'workspace', label: 'Workspace' }
  ];

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsCompactView(window.innerWidth < 1024);
    };

    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsShareModalOpen(false);
  };

  // Render the appropriate content based on the active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'workspace':
        return (
          <div className="p-4 lg:p-6">
            {/* Search bar for workspace */}
            <div className="relative mb-4 lg:mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            
            {/* Workspace item */}
            <div className="rounded-lg bg-gray-50 p-3 lg:p-4 mb-4">
              <Link to='/bookPage/workspace-themes' className="flex items-center justify-between">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-pink-300 rounded-md flex items-center justify-center text-white">
                    <span>AH</span>
                  </div>
                  <span className="font-medium">Ahmed</span>
                </div>
                <div className="flex items-center gap-1 lg:gap-2">
                  <button className="p-1 lg:p-2 rounded-full hover:bg-gray-200">
                    <RefreshCw size={isCompactView ? 16 : 18} />
                  </button>
                  <button className="p-1 lg:p-2 rounded-full hover:bg-gray-200">
                    <Share size={isCompactView ? 16 : 18} />
                  </button>
                  <button className="p-1 lg:p-2 rounded-full hover:bg-gray-200">
                    <Settings size={isCompactView ? 16 : 18} />
                  </button>
                </div>
              </Link>
            </div>
          </div>
        );
      case 'interviews':
        return (
          <>
            {/* Search Section */}
            <div className="p-4 lg:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Meeting Item */}
            <div className="p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-medium">RS</span>
                </div>
                <div>
                  <h3 className="font-medium">Recruitment Strategy Meeting</h3>
                  <p className="text-gray-600 text-sm">30 mins | One-on-One</p>
                </div>
              </div>
            </div>
          </>
        );
      case 'recruiters':
        return (
          <div className="p-4 lg:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search recruiters"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <div className="p-4 lg:p-6 text-center text-gray-500">
              No recruiters found
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="p-4 lg:p-6">
          <h1 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">Booking Pages</h1>
          
          {/* Profile Section */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="text-gray-400"><CgProfile className="w-5 h-5 lg:w-6 lg:h-6 rounded-full text-gray-400"/></div>
                </div>
                <div>
                  <h2 className="text-base lg:text-lg font-medium">Mostafa Ahmed</h2>
                  <p className="text-gray-600 text-xs lg:text-sm">mostafa_ahmed@gmail.com</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button className="flex items-center gap-2 px-3 lg:px-4 py-2 border rounded-md hover:bg-gray-50 flex-1 sm:flex-none justify-center text-sm lg:text-base">
                  <ExternalLink size={isCompactView ? 16 : 18} />
                  <span>Open Page</span>
                </button>
                <button 
                  onClick={handleShareClick}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 border rounded-md hover:bg-gray-50 flex-1 sm:flex-none justify-center text-sm lg:text-base"
                >
                  <Share size={isCompactView ? 16 : 18} />
                  <span>Share</span>
                </button>
                <Link to="/bookPage/themes-and-layout" className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex-1 sm:flex-none justify-center text-sm lg:text-base">
                  <Layout size={isCompactView ? 16 : 18} />
                  <span>Themes and Layouts</span>
                </Link>
              </div>
            </div>
            <p className="text-gray-600 text-sm lg:text-base mt-3 lg:mt-4 pb-5 lg:pb-7">
              This is your unique booking page. It lists all the interviews you offer.
            </p>
            <hr />
          </div>
            <ShareBooking 
            isOpen={isShareModalOpen} 
            onClose={handleCloseModal}
          />
        </div>

        {/* Navigation Tabs - Scrollable on mobile */}
        <div className="border-b overflow-x-auto">
          <nav className="flex gap-4 lg:gap-8 px-4 lg:px-6 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`py-3 lg:py-4 px-1 border-b-2 transition-colors text-sm lg:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BookPage;