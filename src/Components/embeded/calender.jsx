import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarModal = ({ 
  show, 
  onClose, 
  selectedDate, 
  onDateSelect, 
  availableDates = [],
  disabledTimes = [],
  availableTimes = [],
  unavailableDates = [],
  unavailableTimes = [],
  availableTimesFromAPI = [],
  durationCycle = 15,
  durationPeriod = "minutes"
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthAbbreviations = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getAvailableDayNumbers = () => {
    const timesData = (availableTimesFromAPI && availableTimesFromAPI.length > 0 
      ? availableTimesFromAPI 
      : availableTimes || []
    );
    
    if (!timesData || !Array.isArray(timesData)) {
      return [];
    }
    
    const dayMapping = {
      1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6
    };
    
    return timesData.map(timeRange => dayMapping[timeRange.day_id]).filter(day => day !== undefined);
  };

  const isDateInUnavailableRange = (day, month, year) => {
  if (!unavailableDates || !Array.isArray(unavailableDates) || unavailableDates.length === 0) {
    return false;
  }

  const checkDate = new Date(Date.UTC(year, month, day));
  
  return unavailableDates.some(dateRange => {
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
      
      if (isNaN(fromDate.getTime())) {
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
      return false;
    }
  });
};

  const timeToMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const calculateEffectiveAvailableTimes = (day, month, year) => {
    const checkDate = new Date(Date.UTC(year, month, day));
    const dayOfWeek = checkDate.getUTCDay();
    const dayId = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
   
    
    const dayAvailableTimes = (availableTimesFromAPI && availableTimesFromAPI.length > 0 
      ? availableTimesFromAPI 
      : availableTimes || []
    ).filter(timeRange => String(timeRange.day_id) === String(dayId));
    
    const dayUnavailableTimes = unavailableTimes.filter(timeRange => String(timeRange.day_id) === String(dayId));
    
    
    const availableRanges = [];
    dayAvailableTimes.forEach((availableRange) => {
      if (!availableRange || !availableRange.from || !availableRange.to) return;
      
      const availableFromMinutes = timeToMinutes(availableRange.from);
      const availableToMinutes = timeToMinutes(availableRange.to);
      
      let currentRanges = [{ from: availableFromMinutes, to: availableToMinutes }];
      
      if (isDateInUnavailableRange(day, month, year)) {
        dayUnavailableTimes.forEach((unavailableRange) => {
          if (!unavailableRange || !unavailableRange.from || !unavailableRange.to) return;
          
          const unavailableFromMinutes = timeToMinutes(unavailableRange.from);
          const unavailableToMinutes = timeToMinutes(unavailableRange.to);
          
          const newRanges = [];
          currentRanges.forEach((range) => {
            if (unavailableToMinutes <= range.from || unavailableFromMinutes >= range.to) {
              newRanges.push(range);
            } else if (unavailableFromMinutes <= range.from && unavailableToMinutes < range.to) {
              newRanges.push({ from: unavailableToMinutes, to: range.to });
            } else if (unavailableFromMinutes > range.from && unavailableToMinutes >= range.to) {
              newRanges.push({ from: range.from, to: unavailableFromMinutes });
            } else if (unavailableFromMinutes > range.from && unavailableToMinutes < range.to) {
              newRanges.push({ from: range.from, to: unavailableFromMinutes });
              newRanges.push({ from: unavailableToMinutes, to: range.to });
            }
          });
          currentRanges = newRanges;
        });
      }
      
      availableRanges.push(...currentRanges);
    });
    
    const effectiveTimeSlots = [];
    const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
    
    availableRanges.forEach((range) => {
      const startMinutes = range.from;
      const endMinutes = range.to;
      
      for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += durationInMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const dateISO = checkDate.toISOString().split('T')[0];
        const isDisabled = disabledTimes.some(disabledTime => {
          if (!disabledTime || !disabledTime.date || !disabledTime.time) return false;
          const disabledDate = disabledTime.date;
          const disabledTimeFormatted = disabledTime.time.slice(0, 5);
          return disabledDate === dateISO && disabledTimeFormatted === formattedTime;
        });
        
        const now = new Date();
        const isToday = checkDate.toDateString() === now.toDateString();
        let isPast = false;
        if (isToday) {
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const slotTimeMinutes = hours * 60 + minutes;
          isPast = slotTimeMinutes < currentTime;
        }
        
        if (!isDisabled && !isPast) {
          effectiveTimeSlots.push(formattedTime);
        }
      }
    });
    return [...new Set(effectiveTimeSlots)].sort();
  };

  const findFirstAvailableMonth = () => {
    if (!availableDates || availableDates.length === 0) {
      return { month: new Date().getMonth(), year: new Date().getFullYear() };
    }

    let earliestDate = null;

    availableDates.forEach(dateRange => {
      try {
        const fromDate = new Date(dateRange.from);
        if (!isNaN(fromDate.getTime())) {
          if (!earliestDate || fromDate < earliestDate) {
            earliestDate = fromDate;
          }
        }
      } catch (error) {
        // Silent error handling
      }
    });

    if (earliestDate) {
      const startMonth = earliestDate.getMonth();
      const startYear = earliestDate.getFullYear();
      
      for (let yearOffset = 0; yearOffset < 2; yearOffset++) {
        for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
          const checkYear = startYear + yearOffset;
          const checkMonth = (startMonth + monthOffset) % 12;
          
          const daysInMonth = getDaysInMonth(checkMonth, checkYear);
          for (let day = 1; day <= daysInMonth; day++) {
            if (isDateAvailable(day, checkMonth, checkYear)) {
              return { month: checkMonth, year: checkYear };
            }
          }
        }
      }
    }

    return { month: new Date().getMonth(), year: new Date().getFullYear() };
  };

  useEffect(() => {
    if ( availableDates.length > 0) {
      const { month, year } = findFirstAvailableMonth();
      setCurrentMonth(month);
      setCurrentYear(year);

      // Find the first available date in the current month/year
      const daysInMonth = getDaysInMonth(month, year);
      let firstAvailableDate = null;

      for (let day = 1; day <= daysInMonth; day++) {
        if (isDateAvailable(day, month, year)) {
          firstAvailableDate = formatDateString(day, month, year);
          break;
        }
      }

      if (firstAvailableDate && !selectedDate) {
        onDateSelect(firstAvailableDate);
      }
    }
  }, [ availableDates, selectedDate, onDateSelect]);

  const formatDateString = (day, month, year) => {
    const dayFormatted = day.toString().padStart(2, '0');
    const monthFormatted = monthAbbreviations[month];
    return `${dayFormatted} ${monthFormatted} ${year}`;
  };

const isDateAvailable = (day, month, year) => {
  const checkDate = new Date(Date.UTC(year, month, day));
  
  // Check if date is not in the past
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  if (checkDate < todayUTC) {
    return false;
  }
  
  // Check if date is in available date range
  const isInDateRange = availableDates.some(dateRange => {
    try {
      let fromDateStr = dateRange.from.split(' ')[0];
      
      fromDateStr = fromDateStr.replace(/\//g, '-');
      let fromParts = fromDateStr.split('-');
      if (fromParts.length === 3 && parseInt(fromParts[0], 10) <= 31) {
        fromDateStr = `${fromParts[2]}-${fromParts[1]}-${fromParts[0]}`;
      }

      const fromDate = new Date(fromDateStr + 'T00:00:00.000Z');
      
      if (dateRange.to === null || dateRange.to === undefined) {
        return checkDate >= fromDate;
      }
      
      let toDateStr = dateRange.to.split(' ')[0];
      toDateStr = toDateStr.replace(/\//g, '-');
      let toParts = toDateStr.split('-');
      if (toParts.length === 3 && parseInt(toParts[0], 10) <= 31) {
        toDateStr = `${toParts[2]}-${toParts[1]}-${toParts[0]}`;
      }

      const toDate = new Date(toDateStr + 'T00:00:00.000Z');
      
      return checkDate >= fromDate && checkDate <= toDate;
    } catch (error) {
      return false;
    }
  });
  
  if (!isInDateRange) {
    return false;
  }

  // Check if this day of the week is available
  const dayOfWeek = checkDate.getUTCDay();
  const availableDayNumbers = getAvailableDayNumbers();
  const isAvailableDay = availableDayNumbers.includes(dayOfWeek);

  if (!isAvailableDay) {
    return false;
  }

  // Calculate effective available times
  const effectiveAvailableTimes = calculateEffectiveAvailableTimes(day, month, year);
  
  return effectiveAvailableTimes.length > 0;
};

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const startDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(day, currentMonth, currentYear);
      const isSelected = selectedDate === dateString;
      const isAvailable = isDateAvailable(day, currentMonth, currentYear);
      const isInUnavailableRange = isDateInUnavailableRange(day, currentMonth, currentYear);
      
      const today = new Date();
      const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      const currentDateUTC = new Date(Date.UTC(currentYear, currentMonth, day));
      const isToday = todayUTC.getTime() === currentDateUTC.getTime();
      const isPastDate = currentDateUTC < todayUTC;
      
      let buttonClass = 'w-10 h-10 text-sm font-medium rounded transition-colors ';
      let isClickable = true;
      
      if (isPastDate) {
        buttonClass += 'text-gray-300 cursor-not-allowed pointer-events-none';
        isClickable = false;
      } else if (!isAvailable) {
        if (isInUnavailableRange) {
          buttonClass += 'text-red-400 bg-red-50 cursor-not-allowed line-through pointer-events-none';
        } else {
          buttonClass += 'text-gray-300 cursor-not-allowed pointer-events-none';
        }
        isClickable = false;
      } else if (isSelected) {
        buttonClass += 'bg-gray-800 text-white';
      } else if (isToday) {
        buttonClass += 'bg-blue-100 text-blue-600 border-2 border-blue-400 shadow-sm';
      } else {
        if (isInUnavailableRange) {
          buttonClass += 'bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200';
        } else {
          buttonClass += 'text-gray-700 hover:bg-gray-100';
        }
      }
      
      days.push(
        <button
          key={day}
          disabled={!isClickable}
          className={buttonClass}
          onClick={() => {
            if (isClickable && isAvailable) {
              onDateSelect(dateString);
              onClose();
            }
          }}
          title={
            isPastDate ? 'Past date' :
            !isAvailable && isInUnavailableRange ? 'Date unavailable - no times left' :
            !isAvailable ? 'No available times' :
            isInUnavailableRange ? 'Partially available - limited times' :
            isToday ? 'Today' : ''
          }
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 min-w-[150px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => setCurrentYear(currentYear - 1)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {currentYear - 1}
            </button>
            <span className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded">
              {currentYear}
            </span>
            <button
              onClick={() => setCurrentYear(currentYear + 1)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {currentYear + 1}
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {generateCalendar()}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border-2 border-blue-400 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-50 text-red-400 rounded flex items-center justify-center">
                <span className="text-xs line-through">×</span>
              </div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-800 rounded"></div>
              <span>Selected</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={goToToday}
              className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;