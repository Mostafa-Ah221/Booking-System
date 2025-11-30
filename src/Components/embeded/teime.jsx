import { Calendar, Clock, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TimeSelectionModal = ({ 
  show, 
  onClose, 
  selectedTime, 
  onTimeSelect, 
  availableTimes = [],
  selectedDate,
  disabledTimes = [],
  unavailableTimes = [],
  unavailableDates = [],
  requireEndTime = false,
  selectedEndTime = '',
  durationCycle = 0,
  durationPeriod = 'minutes',
  setSelectedEndTime
}) => {
  console.log(availableTimes);
  
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const startDropdownRef = useRef(null);
  const endDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDropdownRef.current && !startDropdownRef.current.contains(event.target)) {
        setShowStartDropdown(false);
      }
      if (endDropdownRef.current && !endDropdownRef.current.contains(event.target)) {
        setShowEndDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
useEffect(() => {
  if (requireEndTime && selectedTime && setSelectedEndTime) {
    const endOptions = generateEndTimeOptions();
    
    const firstAvailableEndTime = endOptions.find(time => 
      !isTimeBooked(selectedDate, time)
    );
        if (firstAvailableEndTime) {
      setSelectedEndTime(firstAvailableEndTime);
    }
  }
}, [selectedTime, requireEndTime, selectedDate]);
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

        if (dateRange.to === null || dateRange.to === undefined) {
          return checkDate >= fromDate;
        }

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

  const calculateEndTime = (startTime) => {
    if (!startTime) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    
    const durationInMinutes = durationPeriod === "hours" 
      ? durationCycle * 60 
      : durationCycle;
    
    const endMinutes = startMinutes + durationInMinutes;
    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    
    return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
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

  // Generate end time options based on selected start time
  const generateEndTimeOptions = () => {
    if (!selectedTime) return [];
    
    const startMinutes = timeToMinutes(selectedTime);
    
    // Get all filtered times (same as start time options)
    const allFilteredTimes = getFilteredTimes(availableTimes);
    
    // Filter to only show times AFTER the selected start time
    const endTimeOptions = allFilteredTimes
      .map(timeSlot => typeof timeSlot === 'string' ? timeSlot : timeSlot?.time)
      .filter(time => {
        if (!time) return false;
        const timeMinutes = timeToMinutes(time);
        // Only show times that are after the start time
        return timeMinutes > startMinutes;
      });
    
    return endTimeOptions;
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
            const endTime = requireEndTime ? calculateEndTime(time) : null;
            
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
                    if (!requireEndTime) {
                      onClose();
                    }
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <span className={`text-sm font-medium ${isBooked ? 'line-through' : ''}`}>
                    {displayTime}
                  </span>
                  {isBooked && (
                    <span className="text-[10px] text-red-500 mt-1 font-medium bg-red-100 px-2 py-0.5 rounded-full">
                      Booked
                    </span>
                  )}
                  {selectedTime === time && !isBooked && (
                    <span className="text-[10px] text-blue-500 mt-1 font-medium">
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
  const endTimeOptions = generateEndTimeOptions();

  // If requireEndTime is true, show dropdowns UI
  if (requireEndTime) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Select Time Range</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {selectedDate && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center text-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">Selected Date: {selectedDate}</span>
                </div>
              </div>
            )}

            <div className=" flex gap-3">
              {/* Start Time Dropdown */}
              <div ref={startDropdownRef} className="relative m-0 flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Start Time
                </label>
                <div
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between bg-white"
                  onClick={() => setShowStartDropdown(!showStartDropdown)}
                >
                  <span className={selectedTime ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                    {selectedTime || 'Select start time'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showStartDropdown ? 'rotate-180' : ''}`} />
                </div>
                
                {showStartDropdown && (
                  <div className="absolute -top-20 left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {filteredTimes.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No available times
                      </div>
                    ) : (
                      filteredTimes.slice(0, -1).map(timeSlot => {
                        const time = typeof timeSlot === 'string' ? timeSlot : timeSlot?.time;
                        const isBooked = isTimeBooked(selectedDate, time);
                        
                        return (
                          <div
                            key={time}
                            className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                              isBooked ? 'opacity-50 cursor-not-allowed bg-red-50' : ''
                            } ${selectedTime === time ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                            onClick={() => {
                              if (!isBooked) {
                                onTimeSelect(time);
                                setShowStartDropdown(false);
                                
                                // Set end time to the next available time slot
                                const startMinutes = timeToMinutes(time);
                                const nextAvailableTime = filteredTimes
                                  .map(timeSlot => typeof timeSlot === 'string' ? timeSlot : timeSlot?.time)
                                  .find(t => {
                                    if (!t) return false;
                                    const tMinutes = timeToMinutes(t);
                                    return tMinutes > startMinutes && !isTimeBooked(selectedDate, t);
                                  });
                                
                                if (setSelectedEndTime && nextAvailableTime) {
                                  setSelectedEndTime(nextAvailableTime);
                                }
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{time}</span>
                              {isBooked && (
                                <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                                  Booked
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* End Time Dropdown */}
              <div ref={endDropdownRef} className="relative flex-1 m-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  End Time
                </label>
                <div
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between bg-white ${
                    !selectedTime ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => selectedTime && setShowEndDropdown(!showEndDropdown)}
                >
                  <span className={selectedEndTime ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                    {selectedEndTime || 'Select end time'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showEndDropdown ? 'rotate-180' : ''}`} />
                </div>
                
                {showEndDropdown && selectedTime && (
                  <div className="absolute  left-0 right-0 -top-20 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {endTimeOptions.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No available end times after {selectedTime}
                      </div>
                    ) : (
                      endTimeOptions.map(time => {
                        const isBooked = isTimeBooked(selectedDate, time);
                        
                        return (
                          <div
                            key={time}
                            className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                              isBooked 
                                ? 'opacity-50 cursor-not-allowed bg-red-50' 
                                : selectedEndTime === time 
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'hover:bg-gray-50'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isBooked) {
                                if (setSelectedEndTime) {
                                  setSelectedEndTime(time);
                                }
                                setShowEndDropdown(false);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{time}</span>
                              {isBooked && (
                                <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                                  Booked
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={!selectedTime || !selectedEndTime}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Time Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original popup UI for when requireEndTime is false
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