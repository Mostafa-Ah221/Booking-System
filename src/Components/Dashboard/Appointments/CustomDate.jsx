import React, { useState } from 'react';
import { Plus, Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const CustomDate = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('12 Feb 2025');
  const [currentMonth, setCurrentMonth] = useState(2); 
  const [currentYear, setCurrentYear] = useState(2025);
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const quickRanges = [
    { label: 'Today', selected: true },
    { label: 'Tomorrow', selected: false },
    { label: 'This Week', selected: false },
    { label: 'This Month', selected: false },
    { label: 'This Year', selected: false }
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const getWeekDays = () => ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="text-center ">
      <div className="mt-6 relative">
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <Calendar size={18} />
          {selectedDate}
        </button>

        {showCalendar && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 mt-2 rounded-lg w-[400px] md:w-[700px]">
            <div className="flex gap-4 flex-col md:flex-row">
              {/* Quick Range Section */}
              <div className="w-full md:w-48 border-r pr-4">
                <h4 className="text-base font-medium mb-4">Quick Range</h4>
                <div className="space-y-2">
                  {quickRanges.map((range, index) => (
                    <button
                      key={index}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                        range.selected ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      {range.label}
                      {range.selected && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 grid grid-cols-2 gap-8">
                {[currentMonth, currentMonth + 1].map((month, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-4">
                      {index === 0 && (
                        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                          <ChevronLeft size={16} />
                        </button>
                      )}
                      <span className="font-medium">
                        {months[month % 12]} {currentYear + Math.floor(month / 12)}
                      </span>
                      {index === 1 && (
                        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {getWeekDays().map((day, i) => (
                        <div key={i} className="text-center text-sm text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                      
                      {generateCalendarDays(month % 12, currentYear + Math.floor(month / 12)).map((day, i) => (
                        <button
                          key={i}
                          className={`
                            py-1 text-sm rounded-md
                            ${day ? 'hover:bg-gray-100' : ''}
                            ${day === 12 ? 'bg-purple-50 text-purple-600' : ''}
                            ${!day ? 'text-gray-300' : 'text-gray-700'}
                          `}
                          disabled={!day}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="inline-block mb-6">
        <img
          src="https://static.zohocdn.com/bookings/V9_383_2O_5/dist/com/zb-ui/images/empty-screen/zb-appointment-empty-22698452b0aab9c28c70f0d8d8b0fe35.svg"
          alt="No appointments"
          className="mx-auto"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">No appointments for the selected dates</h3>
      <p className="text-gray-500 mb-6">Organize your schedule by adding appointments here.</p>

      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto">
        <Plus size={18} />
        New Appointment
      </button>

      
    </div>
  );
};

export default CustomDate;