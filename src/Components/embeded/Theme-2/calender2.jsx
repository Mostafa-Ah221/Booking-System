import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
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
  initialDate,
  durationPeriod = "minutes",
  restCycle = 0,
  setSelectedTimezone,
  selectedTimeZone,
  themeColor,
  workspaceTimezone
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
  if (initialDate) {
    const parts = initialDate.split(' ');
    const months = {
      'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,
      'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11
    };
    const date = new Date(
      parseInt(parts[2]),
      months[parts[1]],
      parseInt(parts[0])
    );
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return monday;
  }
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
  const [visibleDaysCount, setVisibleDaysCount] = useState(7);
  const colors = themeColor ? JSON.parse(themeColor) : {};
  const primary = colors?.primary || "";
  const [firstColor, secondColor] = primary.split("-");
  const textColor = colors?.text_color;
const [hasNavigated, setHasNavigated] = useState(false);
const [isFirstLoad, setIsFirstLoad] = useState(true);

  const monthAbbreviations = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthsFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


const hasAutoNavigated = useRef(false);
const hasSetInitialWeek = useRef(false);

useEffect(() => {
  if (!initialDate) return;
  
  const parts = initialDate.split(' ');
  const months = {
    'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,
    'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11
  };
  const date = new Date(
    parseInt(parts[2]),
    months[parts[1]],
    parseInt(parts[0])
  );

  setCurrentWeekStart(date);
  hasSetInitialWeek.current = true;
  setIsFirstLoad(false);
}, [initialDate]);
  // Close popup when clicking outside
  useEffect(() => {
    if (!showMonthPicker) return;
    
    const handleOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowMonthPicker(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
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



  useEffect(() => {
    const updateVisibleDays = () => {
      const width = window.innerWidth;
      
      if (width < 480) {          
        setVisibleDaysCount(2);
      } else if (width < 640) {   
        setVisibleDaysCount(3);
      } else if (width < 768) {   
        setVisibleDaysCount(4);
      } else if (width < 1024) {  
        setVisibleDaysCount(5);
      } else {                    
        setVisibleDaysCount(7);
      }
    };

    updateVisibleDays();
    window.addEventListener('resize', updateVisibleDays);
    
    return () => window.removeEventListener('resize', updateVisibleDays);
  }, []);

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
        const nowUTC = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes()
        ));

        const slotUTC = new Date(Date.UTC(year, month, day, hours, minutes));
        const isPast = slotUTC < nowUTC; 
        
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

    const allSlots = [...new Set([...effectiveTimeSlots, ...nextDaySlots])].sort((a, b) => {
      const [ha, ma] = a.split(':').map(Number);
      const [hb, mb] = b.split(':').map(Number);
      return ha * 60 + ma - (hb * 60 + mb);
    });

    return allSlots;
  };

const convertDateTimeWithTimezone = (dateStr, timeStr, fromTimezone, toTimezone) => {
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const [day, month, year] = dateStr.split(' ');
  const monthIndex = monthNames.indexOf(month);

  if (monthIndex === -1) {
    return { date: dateStr, time: timeStr };
  }

  const [hours, minutes] = timeStr.split(':').map(Number);

  // 1️⃣ نعتبر الوقت "في الـ fromTimezone" باستخدام Intl (بدون Date.UTC)
  const baseDate = new Date(Date.UTC(year, monthIndex, day, hours, minutes));

  // 2️⃣ نحول من fromTimezone إلى toTimezone مباشرة باستخدام Intl
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: toTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(baseDate);

  const map = {};
  parts.forEach(p => {
    if (p.type !== 'literal') {
      map[p.type] = p.value;
    }
  });

  const newDate = `${map.day} ${monthNames[parseInt(map.month, 10) - 1]} ${map.year}`;
  const newTime = `${map.hour}:${map.minute}`;

  return {
    date: newDate,
    time: newTime,
  };
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
    
    
    if (selectedTimezone === wsTimezone) {
      return checkDateAvailability(day, month, year);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // If the timezone is different → we check 3 days (previous, current, next)
    // ═══════════════════════════════════════════════════════════════════════
    
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
  setHasNavigated(true);
  const newDate = new Date(currentWeekStart);
  if (direction === 'prev') {
    newDate.setDate(newDate.getDate() - visibleDaysCount);
  } else {
    newDate.setDate(newDate.getDate() + visibleDaysCount);
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

 const getVisibleDays = () => {
  const allWeekDays = getDaysInWeek();
  return allWeekDays.slice(0, visibleDaysCount);
};
  const visibleDays = getVisibleDays();

  // ═══════════════════════════════════════════════════════════════════
  // الكاش الصحيح: نحسب بعد ما نحدد الـ visibleDays
  // ═══════════════════════════════════════════════════════════════════
  const availableDatesCache = useMemo(() => {
    const cache = new Map(); // استخدم Map بدل Set عشان نخزن التاريخ والـ available status
    
    visibleDays.forEach(date => {
      const dateStr = formatDateString(date);
      const isAvailable = isDateAvailable(date.getDate(), date.getMonth(), date.getFullYear());
      cache.set(dateStr, isAvailable);
    });
    
    return cache;
  }, [
    currentWeekStart,         
    visibleDaysCount,           
    availableDates,
    disabledTimes,
    availableTimesFromAPI,
    availableTimes,
    unavailableDates,
    unavailableTimes,
    selectedTimeZone,
    workspaceTimezone,
    durationCycle,
    durationPeriod,
    restCycle
  ]);

const checkAndNavigateIfNeeded = () => {
  if (!selectedDate) return;

  const parts = selectedDate.split(' ');
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const d = parseInt(parts[0]);
  const m = months[parts[1]];
  const y = parseInt(parts[2]);

  const isStillAvailable = isDateAvailable(d, m, y);
  if (isStillAvailable) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const cd = checkDate.getDate();
    const cm = checkDate.getMonth();
    const cy = checkDate.getFullYear();

    if (isDateAvailable(cd, cm, cy)) {
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const newDateStr = `${String(cd).padStart(2, '0')} ${monthNames[cm]} ${cy}`;
      setCurrentWeekStart(new Date(checkDate));
      onDateSelect(newDateStr);
      break;
    }

    checkDate.setDate(checkDate.getDate() + 1);
  }
};

// حالة 2: لما slots تتحجز
useEffect(() => {
  checkAndNavigateIfNeeded();
}, [disabledTimes]);

// حالة 1: لما الوقت يعدي (كل دقيقة)
useEffect(() => {
  const interval = setInterval(() => {
    checkAndNavigateIfNeeded();
  }, 60000);

  return () => clearInterval(interval);
}, [selectedDate, disabledTimes]);

  // Use the middle day of the week to determine current month/year
  const currentMonth = currentWeekStart.getMonth();
  const currentYear = currentWeekStart.getFullYear();
  
  useEffect(() => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, [currentMonth, currentYear]);

  // ═══════════════════════════════════════════════════════════════════
  // Auto-navigate on mobile to show the first available date
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (visibleDaysCount >= 7 || hasNavigated || isFirstLoad || availableDatesCache.size === 0) {
      return; 
    }

    const firstAvailableInView = visibleDays.find(date => {
      const dateStr = formatDateString(date);
      return availableDatesCache.get(dateStr);
    });

    if (firstAvailableInView) {
      return; 
    }

    const allDays = getDaysInWeek();
    const firstAvailableOverall = allDays.find(date => {
      const dateStr = formatDateString(date);
      const isAvailable = isDateAvailable(date.getDate(), date.getMonth(), date.getFullYear());
      return isAvailable;
    });

    if (firstAvailableOverall && !visibleDays.includes(firstAvailableOverall)) {
      const newDate = new Date(firstAvailableOverall);
      newDate.setDate(newDate.getDate() - (newDate.getDay() === 0 ? 6 : newDate.getDay() - 1));
      setCurrentWeekStart(newDate);
      setHasNavigated(true);
    }
  }, [visibleDaysCount, hasNavigated, isFirstLoad, availableDatesCache, visibleDays]);


useEffect(() => {
  if (hasAutoNavigated.current || hasNavigated) return;
  if (!availableDates?.length || !availableTimesFromAPI?.length) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDate = new Date(today);
  let found = null;

  for (let i = 0; i < 365; i++) {
    const d = checkDate.getDate();
    const m = checkDate.getMonth();
    const y = checkDate.getFullYear();

    if (isDateAvailable(d, m, y)) {
      found = new Date(checkDate);
      break;
    }

    checkDate.setDate(checkDate.getDate() + 1);
  }

  if (found) {
    setCurrentWeekStart(new Date(found));
    hasAutoNavigated.current = true;
    setIsFirstLoad(false);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const day = String(found.getDate()).padStart(2, '0');
    const month = monthNames[found.getMonth()];
    const year = found.getFullYear();
    const dateStr = `${day} ${month} ${year}`;

    setTimeout(() => {
      onDateSelect(dateStr);
    }, 100);
  }
}, [availableDates, availableTimesFromAPI, disabledTimes]);


  return (
    <div className="w-full px-2 sm:px-0">
      {/* Month Selector */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-4 sm:mb-6">
        <div className="flex-1 relative">
          <div
            className="w-full sm:w-fit flex gap-1 justify-between sm:justify-start cursor-pointer p-[10px] rounded-ms outline-none bg-transparent text-gray-800 text-sm sm:text-base"
            style={{ color: textColor }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMonthPicker(prev => !prev);

            }}

          >
            <span>{monthsFull[currentMonth]}, {currentYear}</span>
            <span><ChevronDown className='w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1'/></span>
          </div>

          {/* Month Picker Popup */}
          {showMonthPicker && (
            <div 
              ref={popupRef}
              className="absolute top-full left-0 sm:left-auto right-0 sm:right-auto mt-2 bg-white rounded-lg shadow-xl z-50 p-4 sm:p-6 w-full sm:w-80 max-w-sm"
              style={{ border: '1px solid #e5e7eb' }}
            >
              {/* Year Navigation */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button
                  onClick={() => handleYearChange('prev')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="text-base sm:text-lg font-semibold">{selectedYear}</div>
                <button
                  onClick={() => handleYearChange('next')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {monthAbbreviations.map((month, index) => {
                  const isCurrentMonth = index === new Date().getMonth() && selectedYear === new Date().getFullYear();
                  const isViewingMonth = index === currentMonth && selectedYear === currentYear;
                  
                  return (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className="py-2 sm:py-3 px-2 rounded text-xs sm:text-sm font-medium transition-all"
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
        
        <div 
          className={`grid gap-2 flex-1`}
          style={{
            gridTemplateColumns: `repeat(${visibleDaysCount}, minmax(0, 1fr))`
          }}
        >
          {visibleDays.map((date, idx) => {
            const dateStr = formatDateString(date);
            // ═══════════════════════════════════════════════════════════════════
            // استخدم الكاش بدل استدعاء isDateAvailable مباشرة
            // ═══════════════════════════════════════════════════════════════════
            const isAvailable = availableDatesCache.get(dateStr) ?? false;
            const isSelected = selectedDate === dateStr;
            const isToday = date.toDateString() === new Date().toDateString();
            const isInUnavailableRange = isDateInUnavailableRange(date.getDate(), date.getMonth(), date.getFullYear());

            return (
              <button
                key={idx}
                disabled={!isAvailable}
                className={`p-2 sm:p-3 text-center transition-all text-xs sm:text-sm`}
                style={{
                  background: isSelected
                    ? secondColor
                    : isAvailable
                    ? `${secondColor}20`
                    : isToday
                    ? "rgba(0,0,0,0.10)"
                    : isInUnavailableRange
                    ? "rgba(0,0,0,0.07)"
                    : `${secondColor}20`,
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
                    ? firstColor
                    : !isAvailable
                    ? textColor
                    : textColor,
                  cursor: !isAvailable ? "not-allowed" : "pointer",
                  boxShadow: isSelected ? `0 0 6px ${firstColor}60` : "none",
                }}
                onClick={() => isAvailable && onDateSelect(dateStr)}
              >
                <div className="font-semibold">{date.getDate()}</div>
                <div className="text-[10px] sm:text-xs uppercase mt-1">
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