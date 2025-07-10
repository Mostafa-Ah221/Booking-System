import React, { useState } from 'react';

const ResourceAvailability = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const defaultHours = [
    { day: 'Monday', start: '09:00 am', end: '06:00 pm', available: true },
    { day: 'Tuesday', start: '09:00 am', end: '06:00 pm', available: true },
    { day: 'Wednesday', start: '09:00 am', end: '06:00 pm', available: true },
    { day: 'Thursday', start: '09:00 am', end: '06:00 pm', available: true },
    { day: 'Friday', start: '09:00 am', end: '06:00 pm', available: true },
    { day: 'Saturday', start: '', end: '', available: false },
    { day: 'Sunday', start: '', end: '', available: false }
  ];

  return (
    <div className=" mx-auto p-4">
      <div className="border rounded-lg shadow-sm bg-white">
        {/* Working Hours Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Working Hours</h2>
            <p className="text-sm text-gray-500">Set weekly available days and hours.</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center px-3 py-1.5 rounded-md border border-blue-100 hover:bg-blue-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Customize working hours
          </button>
        </div>

        {/* Info Message */}
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center text-sm text-blue-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            test follows usual working hours.
          </div>
        </div>

        {/* Expanded Working Hours */}
        {isExpanded && (
          <div className="p-4">
            {defaultHours.map((schedule, index) => (
              <div key={schedule.day} className="flex items-center py-2 border-b last:border-0">
                <div className="w-32">
                  <span className={`text-sm ${schedule.available ? 'text-gray-900' : 'text-red-500'}`}>
                    {schedule.day}
                  </span>
                </div>
                {schedule.available ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{schedule.start}</span>
                    <span className="text-sm text-gray-400">—</span>
                    <span className="text-sm text-gray-600">{schedule.end}</span>
                  </div>
                ) : (
                  <span className="text-sm text-red-500">Not Available</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Special Working Hours Section */}
      <div className="mt-4 border rounded-lg p-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Special Working Hours</h3>
            <p className="text-sm text-gray-500">Add extra available days or hours.</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center px-3 py-1.5 rounded-md border border-blue-100 hover:bg-blue-50">
            + Add
          </button>
        </div>
      </div>

      {/* Unavailability Section */}
      <div className="mt-4 border rounded-lg p-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Unavailability</h3>
            <p className="text-sm text-gray-500">Add extra unavailable days or hours.</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center px-3 py-1.5 rounded-md border border-blue-100 hover:bg-blue-50">
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceAvailability;