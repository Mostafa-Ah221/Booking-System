import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import TimezoneSelect from 'react-timezone-select';

const CalendarSection2 = ({ 
  selectedDate, 
  onDateSelect, 
  availableDates = [],
  disabledTimes = [],
  availableTimes = [],
  unavailableDates = [],
  unavailableTimes = [],
  availableTimesFromAPI = [],
  durationCycle = 15,
  durationPeriod = "minutes",
  restCycle = 0,
  setSelectedTimezone,
  selectedTimeZone,
  themeColor,
  workspaceTimezone
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return monday;
  });
  
console.log(availableDates);

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const popupRef = useRef(null);

  const colors = themeColor ? JSON.parse(themeColor) : {};
  const primary = colors?.primary || "";
  const [firstColor, secondColor] = primary.split("-");
  const textColor = colors?.text_color;

  const monthAbbreviations = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthsFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowMonthPicker(false);
      }
    };

    if (showMonthPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMonthPicker]);

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
  
  const wsTimezone = workspaceTimezone || 'Africa/Cairo';
  const userTimezone = selectedTimeZone || wsTimezone;
  
  // ═══════════════════════════════════════════════════════════════════
  // الجزء الأول: أوقات اليوم الحالي
  // ═══════════════════════════════════════════════════════════════════
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
  const restInMinutes = parseInt(restCycle) || 0;
  const totalSlotDuration = durationInMinutes + restInMinutes;
  
  availableRanges.forEach((range) => {
    const startMinutes = range.from;
    const endMinutes = range.to;
    
    for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += totalSlotDuration) {
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

  // ═══════════════════════════════════════════════════════════════════
  // الجزء الثاني: أوقات من اليوم التالي (لو الـ timezone مختلف)
  // ═══════════════════════════════════════════════════════════════════
  let nextDaySlots = [];
  
  if (userTimezone !== wsTimezone) {
    const nextDate = new Date(Date.UTC(year, month, day));
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    
    const nextDay = nextDate.getUTCDate();
    const nextMonth = nextDate.getUTCMonth();
    const nextYear = nextDate.getUTCFullYear();
    const nextDayOfWeek = nextDate.getUTCDay();
    const nextDayId = nextDayOfWeek === 0 ? 1 : nextDayOfWeek + 1;

    // نجيب أوقات اليوم التالي
    const nextDayAvailableTimes = (availableTimesFromAPI && availableTimesFromAPI.length > 0 
      ? availableTimesFromAPI 
      : availableTimes || []
    ).filter(timeRange => String(timeRange.day_id) === String(nextDayId));

    if (nextDayAvailableTimes.length > 0) {
      // نولد الأوقات لليوم التالي
      const nextAvailableRanges = [];
      nextDayAvailableTimes.forEach((availableRange) => {
        if (!availableRange || !availableRange.from || !availableRange.to) return;
        
        const fromMinutes = timeToMinutes(availableRange.from);
        const toMinutes = timeToMinutes(availableRange.to);
        
        nextAvailableRanges.push({ from: fromMinutes, to: toMinutes });
      });

      nextAvailableRanges.forEach((range) => {
        for (let currentMinutes = range.from; currentMinutes < range.to; currentMinutes += totalSlotDuration) {
          const hours = Math.floor(currentMinutes / 60);
          const minutes = currentMinutes % 60;
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          // نحول الوقت ده من اليوم التالي للـ user timezone
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const nextDateStr = `${String(nextDay).padStart(2, '0')} ${monthNames[nextMonth]} ${nextYear}`;
          
          const converted = convertDateTimeWithTimezone(
            nextDateStr,
            formattedTime,
            wsTimezone,
            userTimezone
          );

          // لو الوقت المحول بقى في اليوم الحالي → نضيفه
          const currentDateStr = `${String(day).padStart(2, '0')} ${monthNames[month]} ${year}`;
          if (converted.date === currentDateStr) {
            const dateISO = checkDate.toISOString().split('T')[0];
            const isDisabled = disabledTimes.some(disabledTime => {
              if (!disabledTime || !disabledTime.date || !disabledTime.time) return false;
              return disabledTime.date === dateISO && disabledTime.time.startsWith(converted.time);
            });

            if (!isDisabled) {
              nextDaySlots.push(converted.time);
            }
          }
        }
      });
    }
  }

  // نجمع كل الأوقات ونرتبها
  const allSlots = [...new Set([...effectiveTimeSlots, ...nextDaySlots])].sort((a, b) => {
    const [ha, ma] = a.split(':').map(Number);
    const [hb, mb] = b.split(':').map(Number);
    return ha * 60 + ma - (hb * 60 + mb);
  });

  return allSlots;
};

// ═══════════════════════════════════════════════════════════════════
// استبدل دالة convertDateTimeWithTimezone الموجودة في CalendarSection2
// ═══════════════════════════════════════════════════════════════════
const convertDateTimeWithTimezone = (dateStr, timeStr, fromTimezone, toTimezone) => {
  try {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [day, month, year] = dateStr.split(' ');
    const monthIndex = monthNames.indexOf(month);
    
    if (monthIndex === -1) return { date: dateStr, time: timeStr };
    
    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const dateTimeStr = `${isoDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    const dateInWorkspaceTz = new Date(dateTimeStr);
    
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: toTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(dateInWorkspaceTz);
    
    const yearPart = parts.find(p => p.type === 'year')?.value;
    const monthPart = parts.find(p => p.type === 'month')?.value;
    const dayPart = parts.find(p => p.type === 'day')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value || '00';
    const minute = parts.find(p => p.type === 'minute')?.value || '00';

    const newDate = `${dayPart} ${monthNames[parseInt(monthPart) - 1]} ${yearPart}`;
    const newTime = `${hour}:${minute}`;

    return { date: newDate, time: newTime };
  } catch (err) {
    console.warn('DateTime conversion failed:', err);
    return { date: dateStr, time: timeStr };
  }
};


const isDateAvailable = (day, month, year) => {
  const checkDate = new Date(Date.UTC(year, month, day));
  
  // Check if date is not in the past
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  if (checkDate < todayUTC) {
    return false;
  }
  
  const wsTimezone = workspaceTimezone || 'Africa/Cairo';
  const selectedTimezone = selectedTimeZone || wsTimezone;
  
  // لو الـ timezone نفس الـ workspace → نستخدم الطريقة العادية
  if (selectedTimezone === wsTimezone) {
    return checkDateAvailability(day, month, year);
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // لو الـ timezone مختلف → نشيك على 3 أيام (السابق، الحالي، التالي)
  // ═══════════════════════════════════════════════════════════════════════
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDateStr = `${String(day).padStart(2, '0')} ${monthNames[month]} ${year}`;
  
  // 1️⃣ نشيك اليوم الحالي
  const currentDayAvailable = checkDateAvailability(day, month, year);
  if (currentDayAvailable) return true;
  
  // 2️⃣ نشيك اليوم السابق (للـ timezones اللي قدامنا زي Auckland +13)
  const prevDate = new Date(Date.UTC(year, month, day));
  prevDate.setUTCDate(prevDate.getUTCDate() - 1);
  const prevDay = prevDate.getUTCDate();
  const prevMonth = prevDate.getUTCMonth();
  const prevYear = prevDate.getUTCFullYear();
  
  const prevDayAvailable = checkDateAvailability(prevDay, prevMonth, prevYear);
  if (prevDayAvailable) {
    // نجيب أوقات اليوم السابق ونحولها
    const prevDateStr = `${String(prevDay).padStart(2, '0')} ${monthNames[prevMonth]} ${prevYear}`;
    const prevDayTimes = calculateEffectiveAvailableTimes(prevDay, prevMonth, prevYear);
    
    // نشوف لو في أوقات من اليوم السابق هتظهر في اليوم الحالي
    for (let time of prevDayTimes) {
      const converted = convertDateTimeWithTimezone(prevDateStr, time, wsTimezone, selectedTimezone);
      if (converted.date === currentDateStr) {
        return true; // ✅ فيه أوقات من اليوم السابق
      }
    }
  }
  
  // 3️⃣ نشيك اليوم التالي (للـ timezones اللي ورانا زي Hawaii -10)
  const nextDate = new Date(Date.UTC(year, month, day));
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  const nextDay = nextDate.getUTCDate();
  const nextMonth = nextDate.getUTCMonth();
  const nextYear = nextDate.getUTCFullYear();
  
  const nextDayAvailable = checkDateAvailability(nextDay, nextMonth, nextYear);
  if (nextDayAvailable) {
    // نجيب أوقات اليوم التالي ونحولها
    const nextDateStr = `${String(nextDay).padStart(2, '0')} ${monthNames[nextMonth]} ${nextYear}`;
    const nextDayTimes = calculateEffectiveAvailableTimes(nextDay, nextMonth, nextYear);
    
    // نشوف لو في أوقات من اليوم التالي هتظهر في اليوم الحالي
    for (let time of nextDayTimes) {
      const converted = convertDateTimeWithTimezone(nextDateStr, time, wsTimezone, selectedTimezone);
      if (converted.date === currentDateStr) {
        return true; 
      }
    }
  }
  
  return false; 
};

const checkDateAvailability = (day, month, year) => {
  const checkDate = new Date(Date.UTC(year, month, day));
  
  // Check if date is in available date range
  const isInDateRange = availableDates.some(dateRange => {
    try {
      if (!dateRange || !dateRange.from) return false;

      let fromDateStr = dateRange.from.split(' ')[0];
      fromDateStr = fromDateStr.replace(/\//g, '-');
      let fromParts = fromDateStr.split('-');
      if (fromParts.length === 3 && parseInt(fromParts[0], 10) <= 31) {
        fromDateStr = `${fromParts[2]}-${fromParts[1]}-${fromParts[0]}`;
      }

      const fromDate = new Date(fromDateStr + 'T00:00:00.000Z');
      if (isNaN(fromDate.getTime())) return false;

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
  
  if (!isInDateRange) return false;

  // Check if this day of the week is available
  const dayOfWeek = checkDate.getUTCDay();
  const availableDayNumbers = getAvailableDayNumbers();
  const isAvailableDay = availableDayNumbers.includes(dayOfWeek);

  if (!isAvailableDay) return false;

  // Calculate effective available times
  const effectiveAvailableTimes = calculateEffectiveAvailableTimes(day, month, year);
  
  return effectiveAvailableTimes.length > 0;
};




  const getDaysInWeek = () => {
    const startDate = new Date(currentWeekStart);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentWeekStart(newDate);
  };

  const formatDateString = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthAbbreviations[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleMonthSelect = (monthIndex) => {
    // Create date in local timezone to match calendar display
    const newDate = new Date(selectedYear, monthIndex, 15); // Use middle of month to avoid timezone edge cases
    const dayOfWeek = newDate.getDay();
    const monday = new Date(newDate);
    monday.setDate(newDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    setCurrentWeekStart(monday);
    setShowMonthPicker(false);
  };

  const handleYearChange = (direction) => {
    setSelectedYear(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const weekDays = getDaysInWeek();
  // Use the middle day of the week to determine current month/year
  const middleDay = weekDays[3] || new Date();
  const currentMonth = middleDay.getMonth();
  const currentYear = middleDay.getFullYear();
  
  // Update selectedMonth and selectedYear based on current view
  useEffect(() => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      for (const date of weekDays) {
        if (isDateAvailable(date.getDate(), date.getMonth(), date.getFullYear())) {
          onDateSelect(formatDateString(date));
          break;
        }
      }
    }
  }, [availableDates, availableTimesFromAPI]);

  return (
    <div>
      {/* Month Selector */}
      <div className="flex gap-4 items-center mb-6">
        <div className="flex-1 relative">
          <div
            className="w-fit flex gap-1 cursor-pointer p-[10px] rounded-ms outline-none bg-transparent text-gray-800"
            style={{ color: textColor }}
            onClick={() => setShowMonthPicker(!showMonthPicker)}
          >
            {monthsFull[currentMonth]}, {currentYear}
            <span><ChevronDown className='w-5 h-5 mt-1'/></span>
          </div>

          {/* Month Picker Popup */}
          {showMonthPicker && (
            <div 
              ref={popupRef}
              className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl z-50 p-6 w-80"
              style={{ border: '1px solid #e5e7eb' }}
            >
              {/* Year Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => handleYearChange('prev')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-lg font-semibold">{selectedYear}</div>
                <button
                  onClick={() => handleYearChange('next')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-3 gap-3">
                {monthAbbreviations.map((month, index) => {
                  const isCurrentMonth = index === new Date().getMonth() && selectedYear === new Date().getFullYear();
                  const isViewingMonth = index === currentMonth && selectedYear === currentYear;
                  
                  return (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className="py-3 px-2 rounded text-sm font-medium transition-all"
                      style={{
                        backgroundColor: isViewingMonth 
                          ?  '#000000'
                          : isCurrentMonth 
                          ? 'rgba(0,0,0,0.1)'
                          : 'transparent',
                        color: isViewingMonth 
                          ?  '#ffffff'
                          :  '#000000',
                        border: isCurrentMonth && !isViewingMonth
                          ? `1px solid ${firstColor || '#000000'}`
                          : '1px solid transparent'
                      }}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <TimezoneSelect
            value={selectedTimeZone}
            onChange={(tz) => setSelectedTimezone(tz.value)}
            className="react-timezone-select w-full"
            styles={{
              control: (base, state) => ({
                ...base,
                border: '1px solid #d1d5db',
                borderRadius: '2px',
                padding: '0.25rem',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                },
                outline: 'none',
                background: 'transparent',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: textColor,
              }),
            }}
          />
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex gap-2 items-center mb-6">
        <button 
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 text-xl"
        >
          <ChevronLeft />
        </button>
        
        <div className="grid grid-cols-7 gap-2 flex-1">
          {weekDays.map((date, idx) => {
            const isAvailable = isDateAvailable(date.getDate(), date.getMonth(), date.getFullYear());
            const dateStr = formatDateString(date);
            const isSelected = selectedDate === dateStr;
            const isToday = date.toDateString() === new Date().toDateString();
            const isInUnavailableRange = isDateInUnavailableRange(date.getDate(), date.getMonth(), date.getFullYear());

            return (
              <button
                key={idx}
                disabled={!isAvailable}
                className={`p-2 text-center transition-all`}
                style={{
                  background: isSelected
                    ? firstColor
                    : !isAvailable
                    ? "rgba(0,0,0,0.05)"
                    : isToday
                    ? "rgba(0,0,0,0.10)"
                    : isInUnavailableRange
                    ? "rgba(0,0,0,0.07)"
                    : "transparent",
                  border: isSelected
                    ? `2px solid ${firstColor}`
                    : isToday
                    ? `1px solid ${firstColor}`
                    : isInUnavailableRange
                    ? `1px solid ${firstColor}55`
                    : !isAvailable
                    ? "1px solid transparent"
                    : `1px solid ${firstColor}77`,
                  color: isSelected
                    ? textColor
                    : !isAvailable
                    ? "#cccccc"
                    : firstColor,
                  cursor: !isAvailable ? "not-allowed" : "pointer",
                  boxShadow: isSelected ? `0 0 6px ${firstColor}60` : "none",
                }}
                onClick={() => isAvailable && onDateSelect(dateStr)}
              >
                <div className="font-semibold">{date.getDate()}</div>
                <div className="text-xs uppercase mt-1">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]}
                </div>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 text-xl"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CalendarSection2;