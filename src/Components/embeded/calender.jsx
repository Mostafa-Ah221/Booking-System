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
  durationPeriod = "minutes",
  restCycle = 0,
  selectedTimeZone,      
  setSelectedTimezone,      
  workspaceTimezone   
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
  if (selectedDate) {
    const [day, monthAbbr, year] = selectedDate.split(' ');
    const monthIndex = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(monthAbbr);
    return monthIndex !== -1 ? monthIndex : new Date().getMonth();
  }
  return new Date().getMonth();
});

const [currentYear, setCurrentYear] = useState(() => {
  if (selectedDate) {
    const year = selectedDate.split(' ').pop();
    return parseInt(year);
  }
  return new Date().getFullYear();
});
console.log(disabledTimes);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // دالة تحويل التاريخ من workspace → user timezone
  const convertDateTimeWithTimezone = (dateStr, timeStr, fromTimezone, toTimezone) => {
    try {
      const [day, monthAbbr, year] = dateStr.split(' ');
      const monthIndex = monthAbbreviations.indexOf(monthAbbr);
      if (monthIndex === -1) return { date: dateStr, time: timeStr };

      const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
      const [hours, minutes] = timeStr.split(':').map(Number);
      const fullDateTime = `${isoDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

      const dateInTz = new Date(fullDateTime);

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: toTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(dateInTz);
      const y = parts.find(p => p.type === 'year')?.value;
      const m = parts.find(p => p.type === 'month')?.value;
      const d = parts.find(p => p.type === 'day')?.value;
      const h = parts.find(p => p.type === 'hour')?.value || '00';
      const min = parts.find(p => p.type === 'minute')?.value || '00';

      const newDate = `${d} ${monthAbbreviations[parseInt(m) - 1]} ${y}`;
      return { date: newDate, time: `${h}:${min}` };
    } catch (err) {
      return { date: dateStr, time: timeStr };
    }
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

 const getAvailableDayNumbers = () => {
    const times = availableTimesFromAPI.length > 0 ? availableTimesFromAPI : availableTimes || [];
    const mapping = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6 };
    return times.map(t => mapping[t.day_id]).filter(val => val !== undefined);
  };

  const isDateInUnavailableRange = (day, month, year) => {
    if (!unavailableDates?.length) return false;
    const check = new Date(Date.UTC(year, month, day));
    return unavailableDates.some(range => {
      try {
        let from = range.from.split(' ')[0].replace(/\//g, '-');
        let to = range.to?.split(' ')[0].replace(/\//g, '-');
        const partsFrom = from.split('-');
        if (partsFrom.length === 3 && parseInt(partsFrom[0]) <= 31) {
          from = `${partsFrom[2]}-${partsFrom[1]}-${partsFrom[0]}`;
        }
        const fromDate = new Date(from + 'T00:00:00Z');
        if (isNaN(fromDate)) return false;
        if (!to) return check >= fromDate;
        const partsTo = to.split('-');
        if (partsTo.length === 3 && parseInt(partsTo[0]) <= 31) {
          to = `${partsTo[2]}-${partsTo[1]}-${partsTo[0]}`;
        }
        const toDate = new Date(to + 'T00:00:00Z');
        return check >= fromDate && check <= toDate;
      } catch {
        return false;
      }
    });
  };

 const calculateEffectiveAvailableTimes = (day, month, year) => {
  const checkDate = new Date(Date.UTC(year, month, day));
  const dayOfWeek = checkDate.getUTCDay();
  const dayId = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
  const wsTz = workspaceTimezone;
  const userTz = selectedTimeZone || wsTz;

  const timesSrc = availableTimesFromAPI.length > 0 ? availableTimesFromAPI : availableTimes || [];
  const dayRanges = timesSrc.filter(t => String(t.day_id) === String(dayId));
  const unavailableRanges = unavailableTimes.filter(t => String(t.day_id) === String(dayId));
  let availableRanges = [];
  dayRanges.forEach(r => {
    if (!r.from || !r.to) return;
    let ranges = [{ from: timeToMinutes(r.from), to: timeToMinutes(r.to) }];
    
    if (isDateInUnavailableRange(day, month, year)) {
      unavailableRanges.forEach(u => {
        if (!u.from || !u.to) return;
        const uFrom = timeToMinutes(u.from);
        const uTo = timeToMinutes(u.to);
        const newRanges = [];
        ranges.forEach(seg => {
          if (uTo <= seg.from || uFrom >= seg.to) {
            newRanges.push(seg);
          } else if (uFrom <= seg.from && uTo < seg.to) {
            newRanges.push({ from: uTo, to: seg.to });
          } else if (uFrom > seg.from && uTo >= seg.to) {
            newRanges.push({ from: seg.from, to: uFrom });
          } else if (uFrom > seg.from && uTo < seg.to) {
            newRanges.push({ from: seg.from, to: uFrom });
            newRanges.push({ from: uTo, to: seg.to });
          }
        });
        ranges = newRanges;
      });
    }
    
    availableRanges.push(...ranges);
  });

    const durationMins = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
    const restMins = parseInt(restCycle) || 0;
    const totalSlot = durationMins + restMins;

    const slots = [];
    availableRanges.forEach(range => {
      for (let m = range.from; m < range.to; m += totalSlot) {
        const h = Math.floor(m / 60).toString().padStart(2, '0');
        const min = (m % 60).toString().padStart(2, '0');
        const timeStr = `${h}:${min}`;

        const iso = checkDate.toISOString().split('T')[0];
        const disabled = disabledTimes.some(d => d.date === iso && d.time.startsWith(timeStr));
        const now = new Date();
        const isToday = checkDate.toDateString() === now.toDateString();
        const isPast = isToday && (h * 60 + min) < (now.getHours() * 60 + now.getMinutes());

        if (!disabled && !isPast) slots.push(timeStr);
      }
    });

    let nextDaySlots = [];
    if (userTz !== wsTz) {
      const next = new Date(Date.UTC(year, month, day));
      next.setUTCDate(next.getUTCDate() + 1);
      const nextDay = next.getUTCDate();
      const nextMonth = next.getUTCMonth();
      const nextYear = next.getUTCFullYear();
      const nextDayId = next.getUTCDay() === 0 ? 1 : next.getUTCDay() + 1;

      const nextRanges = timesSrc.filter(t => String(t.day_id) === String(nextDayId));
      if (nextRanges.length > 0) {
        const nextDateStr = `${String(nextDay).padStart(2, '0')} ${monthAbbreviations[nextMonth]} ${nextYear}`;
        nextRanges.forEach(r => {
          const fromM = timeToMinutes(r.from);
          const toM = timeToMinutes(r.to);
          for (let m = fromM; m < toM; m += totalSlot) {
            const h = Math.floor(m / 60).toString().padStart(2, '0');
            const min = (m % 60).toString().padStart(2, '0');
            const converted = convertDateTimeWithTimezone(nextDateStr, `${h}:${min}`, wsTz, userTz);
            const currentDateStr = `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;
            if (converted.date === currentDateStr) {
              const iso = checkDate.toISOString().split('T')[0];
              const disabled = disabledTimes.some(d => d.date === iso && d.time.startsWith(converted.time));
              if (!disabled) nextDaySlots.push(converted.time);
            }
          }
        });
      }
    }

    return [...new Set([...slots, ...nextDaySlots])].sort((a, b) => a.localeCompare(b));
  };
const checkDateAvailability = (day, month, year) => {
  const checkDate = new Date(Date.UTC(year, month, day));
  const dayOfWeek = checkDate.getUTCDay();
  const availableDayNumbers = getAvailableDayNumbers();

  
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

  const isAvailableDay = availableDayNumbers.includes(dayOfWeek);

  if (!isAvailableDay) return false;

  // Calculate effective available times
  const effectiveAvailableTimes = calculateEffectiveAvailableTimes(day, month, year);
  
  return effectiveAvailableTimes.length > 0;
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
        return true; // ✅ فيه أوقات من اليوم التالي
      }
    }
  }
  
  return false; // ❌ مفيش أوقات متاحة
};

  const formatDateString = (day, month, year) => {
    return `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;
  };

  // const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();

const getFirstDayOfMonth = (m, y) => {
  const d = new Date(y, m, 1).getDay();  // غيرها من getUTCDay() لـ getDay()
  return d;  
};

  const generateCalendar = () => {
    const days = [];
    const startPad = getFirstDayOfMonth(currentMonth, currentYear);
    for (let i = 0; i < startPad; i++) {
      days.push(<div key={`pad-${i}`} className="w-10 h-10" />);
    }

    for (let day = 1; day <= getDaysInMonth(currentMonth, currentYear); day++) {
      const dateStr = formatDateString(day, currentMonth, currentYear);
      const available = isDateAvailable(day, currentMonth, currentYear);
      const unavailableRange = isDateInUnavailableRange(day, currentMonth, currentYear);
      const today = new Date();
      const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;
      const isPast = new Date(Date.UTC(currentYear, currentMonth, day)) < new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

      let className = 'w-10 h-10 text-sm font-medium rounded transition-colors flex items-center justify-center ';
      if (isPast || !available) {
        className += unavailableRange 
          ? 'text-red-400 bg-red-50 line-through cursor-not-allowed' 
          : 'text-gray-300 cursor-not-allowed';
      } else if (selectedDate === dateStr) {
        className += 'bg-black text-white';
      } else if (isToday) {
        className += 'bg-blue-100 text-blue-700 border-2 border-blue-500';
      } else {
        className += unavailableRange ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'hover:bg-gray-100';
      }

      days.push(
        <button
          key={day}
          disabled={!available}
          className={className}
          onClick={() => available && onDateSelect(dateStr) && onClose()}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  // أضف ده فوق الدالة navigateMonth
useEffect(() => {
  if (selectedDate && show) {
    const [day, monthAbbr, year] = selectedDate.split(' ');
    const monthIndex = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(monthAbbr);
    if (monthIndex !== -1) {
      setCurrentMonth(monthIndex);
      setCurrentYear(parseInt(year));
    }
  }
}, [selectedDate, show]);

  const navigateMonth = (dir) => {
    if (dir === 'prev') {
      if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
      else setCurrentMonth(m => m - 1);
    } else {
      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
      else setCurrentMonth(m => m + 1);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">{monthNames[currentMonth]} {currentYear}</h2>
            <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendar()}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
              Cancel
            </button>
            <button onClick={() => { setCurrentMonth(new Date().getMonth()); setCurrentYear(new Date().getFullYear()); }}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;