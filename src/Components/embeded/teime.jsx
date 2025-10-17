import { Calendar, Clock, X } from 'lucide-react';

const TimeSelectionModal = ({ 
  show, 
  onClose, 
  selectedTime, 
  onTimeSelect, 
  availableTimes = [],
  selectedDate,
  disabledTimes = [],
  unavailableTimes = [],
  unavailableDates = []
}) => {
  // Debug logs
 

  const timeToMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

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

  const getDayIdFromDate = (dateStr) => {
    try {
      const date = new Date(convertDateFormat(dateStr) + 'T00:00:00.000Z');
      if (isNaN(date.getTime())) return null;
      const dayOfWeek = date.getUTCDay();
      return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
    } catch (error) {
      console.error('Error getting day ID:', error);
      return null;
    }
  };

  const isTimePast = (dateStr, timeStr) => {
    try {
      const formattedDate = convertDateFormat(dateStr);
      if (!formattedDate || !timeStr || !timeStr.includes(':')) return false;
      
      const now = new Date();
      const selectedDateTime = new Date(`${formattedDate}T${timeStr}:00`);
      
      return selectedDateTime < now;
    } catch (error) {
      console.error('Error checking if time is past:', error);
      return false;
    }
  };

 const isTimeUnavailable = (selectedDate, timeToCheck) => {
  if (!selectedDate || !timeToCheck || !timeToCheck.includes(':')) {
    return false;
  }

  const formattedSelectedDate = convertDateFormat(selectedDate);
  if (!formattedSelectedDate) {
    return false;
  }

  const isInUnavailableDateRange = unavailableDates.some(dateRange => {
    try {
      // تحقق من وجود from
      if (!dateRange || !dateRange.from) {
        return false;
      }

      let fromDateStr = dateRange.from.includes(' ') ? dateRange.from.split(' ')[0] : dateRange.from;
      fromDateStr = fromDateStr.replace(/\//g, '-');

      let fromParts = fromDateStr.split('-');
      if (fromParts.length === 3 && parseInt(fromParts[0], 10) <= 31) {
        fromDateStr = `${fromParts[2]}-${fromParts[1]}-${fromParts[0]}`;
      }

      const fromDate = new Date(fromDateStr + 'T00:00:00.000Z');
      const checkDate = new Date(formattedSelectedDate + 'T00:00:00.000Z');

      if (isNaN(fromDate.getTime()) || isNaN(checkDate.getTime())) {
        return false;
      }

      // إذا كان to = null، التاريخ unavailable للأبد
      if (dateRange.to === null || dateRange.to === undefined) {
        return checkDate >= fromDate;
      }

      // إذا كان to موجود، عالجه عادي
      let toDateStr = dateRange.to.includes(' ') ? dateRange.to.split(' ')[0] : dateRange.to;
      toDateStr = toDateStr.replace(/\//g, '-');

      let toParts = toDateStr.split('-');
      if (toParts.length === 3 && parseInt(toParts[0], 10) <= 31) {
        toDateStr = `${toParts[2]}-${toParts[1]}-${toParts[0]}`;
      }

      const toDate = new Date(toDateStr + 'T00:00:00.000Z');

      if (isNaN(toDate.getTime())) {
        return false;
      }

      return checkDate >= fromDate && checkDate <= toDate;
    } catch (error) {
      console.error('Error checking unavailable date range:', error);
      return false;
    }
  });

  if (!isInUnavailableDateRange) {
    return false;
  }

  const dayId = getDayIdFromDate(selectedDate);
  if (!dayId) {
    return false;
  }

  const cleanTimeToCheck = timeToCheck.includes(':') ? timeToCheck.substring(0, 5) : timeToCheck;

  if (unavailableTimes && Array.isArray(unavailableTimes) && unavailableTimes.length > 0) {
    const dayUnavailableTimes = unavailableTimes.find(time => time.day_id === dayId);
    
    if (dayUnavailableTimes && dayUnavailableTimes.from) {
      const fromTime = dayUnavailableTimes.from.substring(0, 5);
      
      // إذا كان to = null، من هذا الوقت لنهاية اليوم unavailable
      if (!dayUnavailableTimes.to || dayUnavailableTimes.to === null) {
        const timeToCheckMinutes = timeToMinutes(cleanTimeToCheck);
        const fromMinutes = timeToMinutes(fromTime);
        return timeToCheckMinutes >= fromMinutes;
      }
      
      const toTime = dayUnavailableTimes.to.substring(0, 5);
      const timeToCheckMinutes = timeToMinutes(cleanTimeToCheck);
      const fromMinutes = timeToMinutes(fromTime);
      const toMinutes = timeToMinutes(toTime);
      
      if (timeToCheckMinutes >= fromMinutes && timeToCheckMinutes <= toMinutes) {
        return true;
      }
    }
  }

  return false;
};
  const isTimeBooked = (selectedDate, timeToCheck) => {
    if (!selectedDate || !timeToCheck || !timeToCheck.includes(':')) {
      return false;
    }

    const formattedSelectedDate = convertDateFormat(selectedDate);
    if (!formattedSelectedDate) {
      return false;
    }

    const cleanTimeToCheck = timeToCheck.includes(':') ? timeToCheck.substring(0, 5) : timeToCheck;

    for (let disabledTime of disabledTimes) {
      if (!disabledTime || !disabledTime.date || !disabledTime.time) continue;
      
      const disabledDate = disabledTime.date;
      const disabledTimeStr = disabledTime.time.substring(0, 5);
      
      if (disabledDate === formattedSelectedDate && disabledTimeStr === cleanTimeToCheck) {
        return true;
      }
    }

    return false;
  };

  const getFilteredTimes = (times) => {
   
    
    const filtered = times.filter(timeSlot => {
      const time = typeof timeSlot === 'string' ? timeSlot : timeSlot?.time;
      if (!time || !time.includes(':')) {
        return false;
      }
      
      const isUnavailable = isTimeUnavailable(selectedDate, time);
      const isPast = isTimePast(selectedDate, time);
      const isValid = !isUnavailable && !isPast;
      
      return isValid;
    });
    
    return filtered;
  };

  const groupTimesByPeriod = (times) => {
    const filteredTimes = getFilteredTimes(times);
    
    const morning = [];
    const afternoon = [];
    const evening = [];

    filteredTimes.forEach(timeSlot => {
      const time = typeof timeSlot === 'string' ? timeSlot : timeSlot?.time;
      if (!time || !time.includes(':')) {
        return;
      }
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
            const isBooked = isTimeBooked(selectedDate, time);
            const [hours, minutes] = time.split(':');
            const displayTime = `${hours}:${minutes}`;
            
            return (
              <button
                key={time}
                disabled={isBooked}
                className={`p-3 text-sm border rounded-lg transition-all duration-200 relative ${
                  isBooked
                    ? 'border-red-300 bg-red-50 text-red-600 cursor-not-allowed opacity-75 hover:bg-red-50'
                    : selectedTime === time 
                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                      : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 hover:shadow-sm'
                }`}
                onClick={() => {
                  if (!isBooked) {
                    onTimeSelect(time);
                    onClose();
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <span className={`text-sm font-medium ${isBooked ? 'line-through' : ''}`}>
                    {displayTime}
                  </span>
                  {isBooked && (
                    <span className="text-xs text-red-500 mt-1 font-medium bg-red-100 px-2 py-1 rounded-full">
                      Booked
                    </span>
                  )}
                  {selectedTime === time && !isBooked && (
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

  const filteredTimes = getFilteredTimes(availableTimes);
  const totalFilteredTimes = filteredTimes.length;
  const bookedCount = filteredTimes.filter(timeSlot => {
    const time = typeof timeSlot === 'string' ? timeSlot : timeSlot?.time;
    return isTimeBooked(selectedDate, time);
  }).length;
  const availableCount = totalFilteredTimes - bookedCount;
  const hiddenUnavailableCount = availableTimes.length - filteredTimes.length;

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
                  {availableCount} available
                  {bookedCount > 0 && `, ${bookedCount} booked`}
                  {hiddenUnavailableCount > 0 && ` (${hiddenUnavailableCount} hidden)`}
                </div>
              </div>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            <TimeSection title="Morning (6:00 AM - 12:00 PM)" times={morning} bgColor="bg-yellow-50" />
            <TimeSection title="Afternoon (12:00 PM - 5:00 PM)" times={afternoon} bgColor="bg-orange-50" />
            <TimeSection title="Evening (5:00 PM - 11:00 PM)" times={evening} bgColor="bg-purple-50" />
            
            {filteredTimes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No Available Times</p>
                <p className="text-sm">
                  {selectedDate 
                    ? hiddenUnavailableCount > 0
                      ? `All available times for ${selectedDate} are currently unavailable or have passed. Please select another date.`
                      : `No available times for ${selectedDate}. Please select another date.`
                    : 'Please select a date first to view available times.'
                  }
                </p>
              </div>
            )}
          </div>

          {filteredTimes.length > 0 && (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelectionModal;