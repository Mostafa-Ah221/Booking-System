import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import TimezoneSelect from 'react-timezone-select';
import { getTimeZones } from "@vvo/tzdb";
 // كل التايم زون
const CalendarSection4 = ({ 
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const popupRef = useRef(null);
    const timezones = getTimeZones()
// console.log(timezones);

  const colors = themeColor ? JSON.parse(themeColor) : {};
  const primary = colors?.primary || "220-38-38";
  const [firstColor] = primary.split("-");
  const textColor = colors?.text_color || "#ffffff";

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

    let nextDaySlots = [];
    
    if (userTimezone !== wsTimezone) {
      const nextDate = new Date(Date.UTC(year, month, day));
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      
      const nextDay = nextDate.getUTCDate();
      const nextMonth = nextDate.getUTCMonth();
      const nextYear = nextDate.getUTCFullYear();
      const nextDayOfWeek = nextDate.getUTCDay();
      const nextDayId = nextDayOfWeek === 0 ? 1 : nextDayOfWeek + 1;

      const nextDayAvailableTimes = (availableTimesFromAPI && availableTimesFromAPI.length > 0 
        ? availableTimesFromAPI 
        : availableTimes || []
      ).filter(timeRange => String(timeRange.day_id) === String(nextDayId));

      if (nextDayAvailableTimes.length > 0) {
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
            
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const nextDateStr = `${String(nextDay).padStart(2, '0')} ${monthNames[nextMonth]} ${nextYear}`;
            
            const converted = convertDateTimeWithTimezone(
              nextDateStr,
              formattedTime,
              wsTimezone,
              userTimezone
            );

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

    const allSlots = [...new Set([...effectiveTimeSlots, ...nextDaySlots])].sort((a, b) => {
      const [ha, ma] = a.split(':').map(Number);
      const [hb, mb] = b.split(':').map(Number);
      return ha * 60 + ma - (hb * 60 + mb);
    });

    return allSlots;
  };

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
    
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    if (checkDate < todayUTC) {
      return false;
    }
    
    const wsTimezone = workspaceTimezone || 'Africa/Cairo';
    const selectedTimezone = selectedTimeZone || wsTimezone;
    
    if (selectedTimezone === wsTimezone) {
      return checkDateAvailability(day, month, year);
    }
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDateStr = `${String(day).padStart(2, '0')} ${monthNames[month]} ${year}`;
    
    const currentDayAvailable = checkDateAvailability(day, month, year);
    if (currentDayAvailable) return true;
    
    const prevDate = new Date(Date.UTC(year, month, day));
    prevDate.setUTCDate(prevDate.getUTCDate() - 1);
    const prevDay = prevDate.getUTCDate();
    const prevMonth = prevDate.getUTCMonth();
    const prevYear = prevDate.getUTCFullYear();
    
    const prevDayAvailable = checkDateAvailability(prevDay, prevMonth, prevYear);
    if (prevDayAvailable) {
      const prevDateStr = `${String(prevDay).padStart(2, '0')} ${monthNames[prevMonth]} ${prevYear}`;
      const prevDayTimes = calculateEffectiveAvailableTimes(prevDay, prevMonth, prevYear);
      
      for (let time of prevDayTimes) {
        const converted = convertDateTimeWithTimezone(prevDateStr, time, wsTimezone, selectedTimezone);
        if (converted.date === currentDateStr) {
          return true;
        }
      }
    }
    
    const nextDate = new Date(Date.UTC(year, month, day));
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const nextDay = nextDate.getUTCDate();
    const nextMonth = nextDate.getUTCMonth();
    const nextYear = nextDate.getUTCFullYear();
    
    const nextDayAvailable = checkDateAvailability(nextDay, nextMonth, nextYear);
    if (nextDayAvailable) {
      const nextDateStr = `${String(nextDay).padStart(2, '0')} ${monthNames[nextMonth]} ${nextYear}`;
      const nextDayTimes = calculateEffectiveAvailableTimes(nextDay, nextMonth, nextYear);
      
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

    const dayOfWeek = checkDate.getUTCDay();
    const availableDayNumbers = getAvailableDayNumbers();
    const isAvailableDay = availableDayNumbers.includes(dayOfWeek);

    if (!isAvailableDay) return false;

    const effectiveAvailableTimes = calculateEffectiveAvailableTimes(day, month, year);
    
    return effectiveAvailableTimes.length > 0;
  };

  // توليد أيام الشهر
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // أيام فارغة قبل بداية الشهر
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // أيام الشهر
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, month, year });
    }

    return days;
  };

  const days = getDaysInMonth();

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const formatDateString = (day, month, year) => {
    return `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Timezone Selector */}
      <div className="mt-6">
        <TimezoneSelect
          value={selectedTimeZone}
          onChange={(tz) => setSelectedTimezone(tz.value)}
          className="react-timezone-select"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: textColor,
            }),
            singleValue: (base) => ({ ...base, color: textColor }),
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <button onClick={handlePrevMonth} className="p-2">
          <ChevronLeft className="w-6 h-6" style={{ color: textColor }} />
        </button>
        
        <h2 className="text-xl font-semibold" style={{ color: textColor }}>
          {monthsFull[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button onClick={handleNextMonth} className="p-2">
          <ChevronRight className="w-6 h-6" style={{ color: textColor }} />
        </button>
      </div>

      {/* أيام الأسبوع */}
      <div className="grid grid-cols-7 text-center text-xs font-medium" style={{ color: "#ffffff88" }}>
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* أيام الشهر */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((item, index) => {
          if (!item) {
            return <div key={`empty-${index}`} className="h-16" />;
          }

          const { day, month, year } = item;
          const dateStr = formatDateString(day, month, year);
          const isAvailable = isDateAvailable(day, month, year);
          const isSelected = selectedDate === dateStr;
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <button
              key={day}
              onClick={() => isAvailable && onDateSelect(dateStr)}
              disabled={!isAvailable}
              className={`
                h-10 w-14 rounded-md font-medium transition-all
                ${isSelected ? 'text-white' : 'text-white'}
                ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:bg-opacity-10'}
              `}
              style={{
                background: isSelected ? `${firstColor}` : 'transparent',
                border: isToday ? `2px solid rgb(${firstColor}, 38, 38)` : '2px solid transparent',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      
    </div>
  );
};

export default CalendarSection4;