
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';

const FreshLayout = ({ layoutWorkspace = "classic" }) => {
  const [selectedDay, setSelectedDay] = useState(3); 
  
  // Mock data for the calendar
  const days = [
    { day: 23, month: 'Feb', weekday: 'SUN' },
    { day: 24, month: 'Feb', weekday: 'MON' },
    { day: 25, month: 'Feb', weekday: 'TUE' },
    { day: 26, month: 'Feb', weekday: 'WED' },
    { day: 27, month: 'Feb', weekday: 'THU' },
    { day: 28, month: 'Feb', weekday: 'FRI' },
    { day: 1, month: 'Feb', weekday: 'SAT' }
  ];
  
  return (
    <div className={`bg-gray-100 shadow-md rounded-md overflow-hidden mx-2 ${layoutWorkspace === 'modernWeb' ? 'bg-white' : ''}`}>
      {/* Header */}
      <div className={`p-4 ${layoutWorkspace === 'modernWeb' ? 'bg-gray-50' : 'bg-white'} border-b`}>
        <h1 className="text-xl font-medium">Ahmed</h1>
      </div>
      
      {/* Back to meeting link */}
      <div className={`p-4 ${layoutWorkspace === 'modernWeb' ? 'bg-gray-50' : 'bg-white'} border-b flex items-center`}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="text-gray-600">Recruitment Strategy Meeting</span>
      </div>
      
      {/* Dropdown selectors */}
      <div className={`p-4 ${layoutWorkspace === 'modernWeb' ? 'bg-gray-50' : 'bg-white'} border-b flex flex-col md:flex-row justify-between`}>
        <div className="mb-3 md:mb-0">
          <label className="block text-sm text-gray-600 mb-1">Choose Recruiter</label>
          <div className="relative">
            <select className="appearance-none border rounded-md p-2 w-full md:w-64 bg-white">
              <option>Kris Marrier</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Choose Timezone</label>
          <div className="relative">
            <select className="appearance-none border rounded-md p-2 w-full md:w-64 bg-white">
              <option>Africa/Cairo</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
      
      {/* Calendar section */}
      <div className={`p-8 ${layoutWorkspace === 'modernWeb' ? 'bg-gray-50' : 'bg-white'}`}>
        <h2 className="text-center text-lg font-medium mb-8">Select a Day</h2>
        
        <div className="flex justify-center items-center relative">
          <button className="absolute left-0 text-blue-500">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex overflow-x-auto space-x-2 py-4 px-8 justify-center">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border 
                  ${selectedDay === index 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-blue-300'}
                  ${index === selectedDay - 1 || index === selectedDay + 1 
                    ? 'border-blue-300' : ''}
                `}
              >
                <span className="text-xs">{day.month}</span>
                <span className="text-lg font-medium">{day.day}</span>
                <span className="text-xs">{day.weekday}</span>
              </button>
            ))}
          </div>
          
          <button className="absolute right-0 text-blue-500">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreshLayout;
