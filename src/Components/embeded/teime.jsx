import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, X, ChevronLeft, ChevronRight } from 'lucide-react';

const TimeSelectionModal = ({ 
  show, 
  onClose, 
  selectedTime, 
  onTimeSelect, 
  availableTimes = [],
  selectedDate,
  disabledTimes = []
}) => {
  console.log(availableTimes);
  
  // Enhanced function to check if time is disabled
  const isTimeDisabled = (selectedDate, timeToCheck) => {
    if (!selectedDate || !timeToCheck || !disabledTimes || disabledTimes.length === 0) {
      return false;
    }

    // Convert date from "20 Jul 2025" to "2025-07-20"
    const convertDateFormat = (dateStr) => {
      try {
        const months = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        
        const parts = dateStr.trim().split(' ');
        if (parts.length !== 3) return null;
        
        const [day, month, year] = parts;
        const monthNum = months[month];
        
        if (!monthNum) return null;
        
        return `${year}-${monthNum}-${day.padStart(2, '0')}`;
      } catch (error) {
        console.error('Error converting date format:', error);
        return null;
      }
    };

    const formattedSelectedDate = convertDateFormat(selectedDate);
    if (!formattedSelectedDate) {
      console.warn('Could not format date:', selectedDate);
      return false;
    }

    // Clean time to check (remove seconds if present)
    const cleanTimeToCheck = timeToCheck.includes(':') ? timeToCheck.substring(0, 5) : timeToCheck;

    // Check all disabled times
    for (let disabledTime of disabledTimes) {
      if (!disabledTime || !disabledTime.date || !disabledTime.time) continue;
      
      const disabledDate = disabledTime.date;
      // Clean disabled time (remove seconds)
      const disabledTimeStr = disabledTime.time.substring(0, 5);
      
      // Compare date and time
      if (disabledDate === formattedSelectedDate && disabledTimeStr === cleanTimeToCheck) {
        console.log(`Time ${timeToCheck} on ${selectedDate} is disabled - API data:`, disabledTime);
        return true;
      }
    }
    
    return false;
  };

  // Group times by time of day
  const groupTimesByPeriod = (times) => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    times.forEach(timeSlot => {
      const time = timeSlot.time || timeSlot;
      const hour = parseInt(time.split(':')[0]);
      
      if (hour < 12) {
        morning.push(time);
      } else if (hour < 17) {
        afternoon.push(time);
      } else {
        evening.push(time);
      }
    });

    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = groupTimesByPeriod(availableTimes);

  const TimeSection = ({ title, times, bgColor = "bg-gray-50" }) => {
    if (times.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className={`text-sm font-medium text-gray-600 mb-3 ${bgColor} p-2 rounded`}>
          {title}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {times.map((time) => {
            const timeDisabled = isTimeDisabled(selectedDate, time);
            const [hours, minutes] = time.split(':');
            const displayTime = `${hours}:${minutes}`;
            
            return (
              <button
                key={time}
                disabled={timeDisabled}
                className={`p-3 text-sm border rounded-lg transition-all duration-200 relative ${
                  timeDisabled
                    ? 'border-red-300 bg-red-50 text-red-600 cursor-not-allowed opacity-75 hover:bg-red-50'
                    : selectedTime === time 
                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                      : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 hover:shadow-sm'
                }`}
                onClick={() => {
                  if (!timeDisabled) {
                    onTimeSelect(time);
                    onClose();
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <span className={`text-sm font-medium ${timeDisabled ? 'line-through' : ''}`}>
                    {displayTime}
                  </span>
                  {timeDisabled && (
                    <span className="text-xs text-red-500 mt-1 font-medium bg-red-100 px-2 py-1 rounded-full">
                      Booked
                    </span>
                  )}
                  {selectedTime === time && !timeDisabled && (
                    <span className="text-xs text-blue-500 mt-1 font-medium">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!show) return null;

  // Calculate statistics
  const totalTimes = availableTimes.length;
  const disabledCount = availableTimes.filter(timeSlot => {
    const time = timeSlot.time || timeSlot;
    return isTimeDisabled(selectedDate, time);
  }).length;
  const availableCount = totalTimes - disabledCount;

  // Show debug info in console
  useEffect(() => {
    if (show && selectedDate && disabledTimes.length > 0) {
      console.log('Debug Info:');
      console.log('Selected Date:', selectedDate);
      console.log('Disabled Times from API:', disabledTimes);
      console.log('Available Times:', availableTimes);
      console.log('Statistics - Total:', totalTimes, 'Available:', availableCount, 'Disabled:', disabledCount);
    }
  }, [show, selectedDate, disabledTimes, availableTimes]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Select Time</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {selectedDate && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Selected Date: {selectedDate}</span>
                </div>
                <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {availableCount} available, {disabledCount} booked
                </div>
              </div>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            <TimeSection title="🌅 Morning (6:00 AM - 12:00 PM)" times={morning} bgColor="bg-yellow-50" />
            <TimeSection title="☀️ Afternoon (12:00 PM - 5:00 PM)" times={afternoon} bgColor="bg-orange-50" />
            <TimeSection title="🌙 Evening (5:00 PM - 11:00 PM)" times={evening} bgColor="bg-purple-50" />
            
            {availableTimes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No Available Times</p>
                <p className="text-sm">
                  {selectedDate 
                    ? `No available times for ${selectedDate}. Please select another date.`
                    : 'Please select a date first to view available times.'
                  }
                </p>
              </div>
            )}
          </div>

          {availableTimes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-50 border border-blue-300 rounded mr-2"></div>
                  <span>Available for booking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-50 border border-red-300 rounded mr-2"></div>
                  <span>Already booked</span>
                </div>
              </div>
              
              {/* Debug info - can be removed in production */}
              {process.env.NODE_ENV === 'development' && disabledTimes.length > 0 && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                  <strong>Debug:</strong> Found {disabledTimes.length} disabled times
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelectionModal;