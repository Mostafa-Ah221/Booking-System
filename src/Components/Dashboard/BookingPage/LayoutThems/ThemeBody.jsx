import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown, User, Clock } from 'lucide-react';

const ThemeBody = ({ layout = 'default', themeColor = 'bg-indigo-600', header, pageProperties }) => {
  const [selectedDate, setSelectedDate] = useState('25');
  const [selectedTime, setSelectedTime] = useState('09:00 am');
  
  const timeSlots = [
    '09:00 am', '09:30 am', '10:00 am', '10:30 am',
    '11:00 am', '11:30 am', '12:00 pm'
  ];

  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 28; i++) {
      days.push(i.toString());
    }
    return days;
  };

  if (layout === 'sleek') {
    return (
      <div className="flex flex-col md:flex-row h-full md:h-screen">
        {/* Left Sidebar - Full width on mobile, 1/4 on desktop */}
        <div className={`w-full md:w-1/4 ${themeColor} text-white p-4 md:p-8`}>
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8">{header.title}</h1>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-full mb-4 flex items-center justify-center">
              {header.logo ? (
                <img src={header.logo} alt="Logo" className="w-10 h-10 md:w-16 md:h-16 rounded-full" />
              ) : (
                <User className="w-10 h-10 md:w-16 md:h-16 text-gray-400" />
              )}
            </div>
            <h2 className="text-lg md:text-xl">Kris Marrier</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 bg-gray-50 overflow-y-auto">
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{pageProperties.title}</h1>
            <p className="text-gray-600 mb-6 md:mb-8">
              {pageProperties.description}
            </p>

            <h2 className="text-lg md:text-xl font-semibold mb-4">Pick a Interview</h2>
            <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-6 md:mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                  <div className="ml-3 md:ml-4">
                    <p className="text-xs md:text-sm text-gray-500">Consultation</p>
                    <p className="font-medium text-sm md:text-base">30mins</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex items-center mb-4">
                <CalendarDays className={`w-5 h-5 mr-2 ${themeColor.replace('bg-', 'text-')}`} />
                <h3 className="font-medium">Select Date & Time</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-medium">February 2025</span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                      <div key={day} className="text-center text-xs py-1 md:py-2 text-gray-500">
                        {day}
                      </div>
                    ))}
                    
                    {getDaysInMonth().map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          py-1 md:py-2 rounded-full text-xs md:text-sm
                          ${selectedDate === day 
                            ? `${themeColor} text-white` 
                            : 'hover:bg-gray-100'
                          }
                        `}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <div className="mb-4">
                    <select className="w-full p-2 border rounded-lg text-sm">
                      <option>Africa/Cairo</option>
                    </select>
                  </div>

                  <p className="text-xs md:text-sm font-medium mb-2 md:mb-3">Morning</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          py-1 md:py-2 px-2 md:px-4 rounded-lg text-xs md:text-sm
                          ${selectedTime === time
                            ? `${themeColor} text-white`
                            : 'border hover:border-indigo-600'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default layout
  return (
    <div className="mx-auto bg-white p-4 md:p-8 rounded-lg">
      <div className="border-b mb-2">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8">{header.title}</h1>
      </div>
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-xl md:text-2xl font-semibold mb-2">{pageProperties.title}</h1>
        <p className="text-sm md:text-base text-gray-600">
          {pageProperties.description}
        </p>
      </div>

      <div className="flex items-center mb-6 md:mb-8 border-b pb-4 md:pb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center">
          {header.logo ? (
            <img src={header.logo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
          ) : (
            <User className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          )}
        </div>
        <div className="ml-3 md:ml-4">
          <h2 className="text-sm md:text-base font-medium">Kris Marrier</h2>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="ml-2 md:ml-3">
              <p className="text-xs md:text-sm text-gray-500">Interview</p>
              <p className="text-sm md:text-base font-medium">Consultation | 30mins</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </div>
      </div>

      <div className="shadow-md p-3 md:p-4">
        <div className="mb-5 md:mb-6">
          <div className="flex items-center mb-3 md:mb-4">
            <CalendarDays className="w-4 h-4 md:w-5 md:h-5 mr-2 text-indigo-600" />
            <h3 className="text-sm md:text-base font-medium">Date, Time & Recruiter</h3>
          </div>
          <p className="text-sm md:text-base text-indigo-600 font-medium mb-3 md:mb-4">25 Feb 2025 | 09:00 am</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <span className="text-sm md:text-base font-medium">February 2025</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="text-center text-xs py-1 md:py-2 text-gray-500">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth().map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    py-1 md:py-2 rounded-full text-xs md:text-sm
                    ${selectedDate === day 
                      ? 'bg-indigo-600 text-white' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 md:mb-4">
              <select className="w-full p-2 border rounded-lg text-sm">
                <option>Africa/Cairo</option>
              </select>
            </div>

            <p className="text-xs md:text-sm font-medium mb-2 md:mb-3">Morning</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-1 md:py-2 px-2 md:px-4 rounded-lg text-xs md:text-sm
                    ${selectedTime === time
                      ? 'bg-indigo-600 text-white'
                      : 'border hover:border-indigo-600'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 border rounded-md p-3 md:p-4">
        <div className="flex items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          </div>
          <h3 className="ml-2 text-sm md:text-base font-medium">Your Info</h3>
        </div>
      </div>
    </div>
  );
};

export default ThemeBody;