import React, { useState } from 'react';
import { Settings, ChevronDown, Bell } from 'lucide-react';

const Notifictions = ({ isOpen, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = [
    'All',
    'Connections',
    'Appointments',
    'Users',
    'Event Types',
    'Payment'
  ];

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}
      
      <div className={`
        fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          
          <div className="flex items-center space-x-4">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={toggleFilter}
                className="flex items-center space-x-2 px-3 py-1.5 border rounded-md hover:bg-gray-50"
              >
                <span>{selectedFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      className={`
                        w-full px-4 py-2 text-left hover:bg-gray-50
                        ${selectedFilter === filter ? 'bg-gray-50' : ''}
                      `}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setIsFilterOpen(false);
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button className="p-1.5 hover:bg-gray-100 rounded-full">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] p-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
        </div>
      </div>
    </>
  );
};

export default Notifictions;