import React from 'react';
import { Pencil, Plus, ChevronRight, Info } from 'lucide-react';

const ReadOnlyView = ({ sections, onEdit, activeTab, handleTabChange, availabilityMode = 'available', showTabs = false }) => {
  const handleUnavailabilityAdd = () => {
    // Switch to unavailable mode and show unavailable times tab
    handleTabChange('unavailable-times');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Show tabs only when showTabs is true */}
      {showTabs && (
        <div className="border-b flex">
          {availabilityMode === 'available' ? (
            <>
              <button
                onClick={() => handleTabChange('available-times')}
                className={`px-4 py-2 ${activeTab === 'available-times' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
              >
                Available Times
              </button>
              <button
                onClick={() => handleTabChange('available-dates')}
                className={`px-4 py-2 ${activeTab === 'available-dates' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
              >
                Available Dates
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleTabChange('unavailable-times')}
                className={`px-4 py-2 ${activeTab === 'unavailable-times' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
              >
                Unavailable Times
              </button>
              <button
                onClick={() => handleTabChange('unavailable-dates')}
                className={`px-4 py-2 ${activeTab === 'unavailable-dates' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
              >
                Unavailable Dates
              </button>
            </>
          )}
        </div>
      )}
      
      {sections.map((section) => (
        <div key={section.id} className="border rounded-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <ChevronRight size={16} className="text-gray-400" />
              <div>
                <h3 className="font-medium">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
            {section.id === 'working-hours' ? (
              <button 
                onClick={onEdit}
                className="px-3 py-1 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 flex items-center text-sm"
              >
                <Pencil size={14} className="mr-1" />
                edit
              </button>
            ) : section.id === 'unavailability' ? (
              <button 
                onClick={handleUnavailabilityAdd}
                className="px-3 py-1 border border-red-600 text-red-600 rounded-md hover:bg-red-50 flex items-center text-sm"
              >
                <Plus size={14} className="mr-1" />
                Add
              </button>
            ) : (
              <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center text-sm">
                <Plus size={14} className="mr-1" />
                Add
              </button>
            )}
          </div>
          
          {section.id === 'working-hours' && (
            <div className="mx-4 mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
              <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">test follows availability based on staff.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReadOnlyView;