import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';

const FreshLayout = ({ themeData }) => {
  const { header } = themeData;
  const [selectedDay, setSelectedDay] = useState(3);

  const days = [
    { day: 23, month: 'Feb', weekday: 'SUN' },
    { day: 24, month: 'Feb', weekday: 'MON' },
    { day: 25, month: 'Feb', weekday: 'TUE' },
    { day: 26, month: 'Feb', weekday: 'WED' },
    { day: 27, month: 'Feb', weekday: 'THU' },
    { day: 28, month: 'Feb', weekday: 'FRI' },
    { day: 1, month: 'Mar', weekday: 'SAT' },
  ];

  return (
    <div className="bg-gray-100 rounded-md overflow-hidden mx-2">
    

      {/* Back Link */}
      <div className="p-4 bg-white border-b flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="text-gray-600">Recruitment Strategy Meeting</span>
      </div>

      {/* Dropdowns */}
      <div className="p-4 bg-white border-b flex flex-col md:flex-row justify-between">
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

      {/* Calendar */}
      <div className="p-8 bg-white">
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
                  ${selectedDay === index ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-blue-400 hover:border-blue-700'}
                  ${index === selectedDay - 1 || index === selectedDay + 1 ? 'border-blue-300' : ''}
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