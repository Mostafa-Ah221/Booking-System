import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

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
  workspaceTimezone,
  themeColor
}) => {
const [currentMonth, setCurrentMonth] = useState(() => {
  if (selectedDate) {
    const parts = selectedDate.split(' ');
    const monthIndex = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(parts[1]);
    return monthIndex !== -1 ? monthIndex : new Date().getMonth();
  }
  return new Date().getMonth();
});

const [currentYear, setCurrentYear] = useState(() => {
  if (selectedDate) {
    const parts = selectedDate.split(' ');
    return parseInt(parts[2]) || new Date().getFullYear();
  }
  return new Date().getFullYear();
});

// ── Month Picker State ──────────────────────────────────────────────────
const [showMonthPicker, setShowMonthPicker] = useState(false);
const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0, width: 0 });
const triggerRef = useRef(null);
const pickerRef = useRef(null);

const DEFAULT_COLORS = {
  primary: "#ffffff-rgb(241 82 179)",
  text_color: "#111827",
};

let apiColors = {};
try {
  apiColors = themeColor?.colors ? JSON.parse(themeColor.colors) : {};
} catch {
  apiColors = {};
}

const colors = themeColor?.theme === "theme2"
  ? { ...DEFAULT_COLORS, ...apiColors }
  : DEFAULT_COLORS;

const primary = colors.primary ?? DEFAULT_COLORS.primary;
const [firstColor, secondColor] = primary?.includes("-")
  ? primary.split("-")
  : [primary, primary];
const textColor = colors.text_color;

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── Close picker on outside click ──────────────────────────────────────
useEffect(() => {
  if (!showMonthPicker) return;
  const handleOutside = (e) => {
    if (
      pickerRef.current && !pickerRef.current.contains(e.target) &&
      triggerRef.current && !triggerRef.current.contains(e.target)
    ) {
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

// ── Toggle picker with fixed position calculation ───────────────────────
const handleTogglePicker = (e) => {
  e.stopPropagation();
  if (!showMonthPicker && triggerRef.current) {
    const rect = triggerRef.current.getBoundingClientRect();
    const pickerHeight = 300;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top;
    if (spaceBelow >= pickerHeight || spaceBelow >= spaceAbove) {
      top = rect.bottom + 8;
    } else {
      top = rect.top - pickerHeight - 8;
    }

    setPickerPosition({
      top,
      left: rect.left,
      width: Math.max(rect.width, 280),
    });
    setPickerYear(currentYear);
  }
  setShowMonthPicker(prev => !prev);
};

// ── Month Picker select ─────────────────────────────────────────────────
const handleMonthSelect = (monthIndex) => {
  const now = new Date();
  const isPast =
    pickerYear < now.getFullYear() ||
    (pickerYear === now.getFullYear() && monthIndex < now.getMonth());
  if (isPast) return;

  setCurrentMonth(monthIndex);
  setCurrentYear(pickerYear);
  setShowMonthPicker(false);
};

const handlePickerYearChange = (dir) => {
  const now = new Date();
  if (dir === 'prev' && pickerYear <= now.getFullYear()) return;
  setPickerYear(prev => dir === 'next' ? prev + 1 : prev - 1);
};

  // ── Timezone helpers ────────────────────────────────────────────────────
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
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      });
      const parts = formatter.formatToParts(dateInTz);
      const y = parts.find(p => p.type === 'year')?.value;
      const m = parts.find(p => p.type === 'month')?.value;
      const d = parts.find(p => p.type === 'day')?.value;
      const h = parts.find(p => p.type === 'hour')?.value || '00';
      const min = parts.find(p => p.type === 'minute')?.value || '00';
      const newDate = `${d} ${monthAbbreviations[parseInt(m) - 1]} ${y}`;
      return { date: newDate, time: `${h}:${min}` };
    } catch {
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
            if (uTo <= seg.from || uFrom >= seg.to) newRanges.push(seg);
            else if (uFrom <= seg.from && uTo < seg.to) newRanges.push({ from: uTo, to: seg.to });
            else if (uFrom > seg.from && uTo >= seg.to) newRanges.push({ from: seg.from, to: uFrom });
            else if (uFrom > seg.from && uTo < seg.to) {
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
        const isPast = isToday && (parseInt(h) * 60 + parseInt(min)) < (now.getHours() * 60 + now.getMinutes());
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
    const isInDateRange = availableDates.some(dateRange => {
      try {
        if (!dateRange || !dateRange.from) return false;
        let fromDateStr = dateRange.from.split(' ')[0].replace(/\//g, '-');
        let fromParts = fromDateStr.split('-');
        if (fromParts.length === 3 && parseInt(fromParts[0], 10) <= 31) {
          fromDateStr = `${fromParts[2]}-${fromParts[1]}-${fromParts[0]}`;
        }
        const fromDate = new Date(fromDateStr + 'T00:00:00.000Z');
        if (isNaN(fromDate.getTime())) return false;
        if (dateRange.to === null || dateRange.to === undefined) return checkDate >= fromDate;
        let toDateStr = dateRange.to.split(' ')[0].replace(/\//g, '-');
        let toParts = toDateStr.split('-');
        if (toParts.length === 3 && parseInt(toParts[0], 10) <= 31) {
          toDateStr = `${toParts[2]}-${toParts[1]}-${toParts[0]}`;
        }
        const toDate = new Date(toDateStr + 'T00:00:00.000Z');
        return checkDate >= fromDate && checkDate <= toDate;
      } catch {
        return false;
      }
    });
    if (!isInDateRange) return false;
    if (!availableDayNumbers.includes(dayOfWeek)) return false;
    return calculateEffectiveAvailableTimes(day, month, year).length > 0;
  };

  const isDateAvailable = (day, month, year) => {
    const checkDate = new Date(Date.UTC(year, month, day));
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    if (checkDate < todayUTC) return false;
    const wsTimezone = workspaceTimezone || 'Africa/Cairo';
    const selTz = selectedTimeZone || wsTimezone;
    if (selTz === wsTimezone) return checkDateAvailability(day, month, year);
    const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const currentDateStr = `${String(day).padStart(2, '0')} ${names[month]} ${year}`;
    if (checkDateAvailability(day, month, year)) return true;
    const prevDate = new Date(Date.UTC(year, month, day));
    prevDate.setUTCDate(prevDate.getUTCDate() - 1);
    if (checkDateAvailability(prevDate.getUTCDate(), prevDate.getUTCMonth(), prevDate.getUTCFullYear())) {
      const prevDateStr = `${String(prevDate.getUTCDate()).padStart(2, '0')} ${names[prevDate.getUTCMonth()]} ${prevDate.getUTCFullYear()}`;
      for (const time of calculateEffectiveAvailableTimes(prevDate.getUTCDate(), prevDate.getUTCMonth(), prevDate.getUTCFullYear())) {
        if (convertDateTimeWithTimezone(prevDateStr, time, wsTimezone, selTz).date === currentDateStr) return true;
      }
    }
    const nextDate = new Date(Date.UTC(year, month, day));
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    if (checkDateAvailability(nextDate.getUTCDate(), nextDate.getUTCMonth(), nextDate.getUTCFullYear())) {
      const nextDateStr = `${String(nextDate.getUTCDate()).padStart(2, '0')} ${names[nextDate.getUTCMonth()]} ${nextDate.getUTCFullYear()}`;
      for (const time of calculateEffectiveAvailableTimes(nextDate.getUTCDate(), nextDate.getUTCMonth(), nextDate.getUTCFullYear())) {
        if (convertDateTimeWithTimezone(nextDateStr, time, wsTimezone, selTz).date === currentDateStr) return true;
      }
    }
    return false;
  };

  const formatDateString = (day, month, year) =>
    `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

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
          : 'opacity-30 cursor-not-allowed';
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
          onClick={() => { if (available) { onDateSelect(dateStr); onClose(); } }}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  useEffect(() => {
    if (!show) return;
    if (selectedDate) {
      const [, monthAbbr, year] = selectedDate.split(' ');
      const monthIndex = monthAbbreviations.indexOf(monthAbbr);
      if (monthIndex !== -1) { setCurrentMonth(monthIndex); setCurrentYear(parseInt(year)); }
      return;
    }
    if (!availableDates?.length || !availableTimesFromAPI?.length) return;
    const today = new Date();
    let checkDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    for (let i = 0; i < 365; i++) {
      const d = checkDate.getUTCDate(), m = checkDate.getUTCMonth(), y = checkDate.getUTCFullYear();
      if (isDateAvailable(d, m, y)) { setCurrentMonth(m); setCurrentYear(y); break; }
      checkDate.setUTCDate(checkDate.getUTCDate() + 1);
    }
  }, [show, selectedDate, availableDates, availableTimesFromAPI]);

  const navigateMonth = (dir) => {
    const now = new Date();
    if (dir === 'prev') {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      if (prevYear < now.getFullYear() || (prevYear === now.getFullYear() && prevMonth < now.getMonth())) return;
      setCurrentMonth(prevMonth);
      setCurrentYear(prevYear);
    } else {
      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
      else setCurrentMonth(m => m + 1);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* ── Modal ───────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
        <div className="rounded-lg shadow-2xl max-w-md w-full" style={{ backgroundColor: firstColor }}>
          <div className="p-6">

            {/* Header: Month picker trigger + navigation */}
            <div className="flex items-center justify-between mb-6">
              {/* Prev arrow — disabled if already at current month */}
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-black/10 transition-colors"
                disabled={
                  currentYear < new Date().getFullYear() ||
                  (currentYear === new Date().getFullYear() && currentMonth <= new Date().getMonth())
                }
                style={{ opacity: (currentYear === new Date().getFullYear() && currentMonth <= new Date().getMonth()) ? 0.3 : 1 }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: secondColor }} />
              </button>

              {/* Month/Year trigger */}
              <button
                ref={triggerRef}
                onClick={handleTogglePicker}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/10 transition-colors"
                style={{ color: textColor }}
              >
                <span className="text-xl font-bold">{monthNames[currentMonth]} {currentYear}</span>
                <ChevronDown className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-black/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5" style={{ color: secondColor }} />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold mb-3" style={{ color: `${textColor}80` }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendar()}
            </div>

            {/* Footer */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg font-medium transition-all hover:bg-black/10"
                style={{ background: `${textColor}15`, color: textColor }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const d = today.getDate(), m = today.getMonth(), y = today.getFullYear();
                  setCurrentMonth(m); setCurrentYear(y);
                  if (isDateAvailable(d, m, y)) {
                    onDateSelect(formatDateString(d, m, y));
                    onClose();
                  }
                }}
                className="flex-1 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                style={{ background: secondColor }}
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Month Picker Popup — fixed, always visible ───────────────────── */}
      {showMonthPicker && (
        <div
          ref={pickerRef}
          className="bg-white rounded-xl shadow-2xl p-5"
          style={{
            position: 'fixed',
            top: pickerPosition.top,
            left: pickerPosition.left,
            width: pickerPosition.width,
            zIndex: 9999,
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handlePickerYearChange('prev')}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={pickerYear <= new Date().getFullYear()}
              style={{ opacity: pickerYear <= new Date().getFullYear() ? 0.3 : 1 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-base font-semibold text-gray-800">{pickerYear}</span>
            <button
              onClick={() => handlePickerYearChange('next')}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Months grid */}
          <div className="grid grid-cols-3 gap-2">
            {monthAbbreviations.map((month, index) => {
              const now = new Date();
              const isPast =
                pickerYear < now.getFullYear() ||
                (pickerYear === now.getFullYear() && index < now.getMonth());
              const isCurrentMonth = index === now.getMonth() && pickerYear === now.getFullYear();
              const isViewingMonth = index === currentMonth && pickerYear === currentYear;

              return (
                <button
                  key={month}
                  onClick={() => !isPast && handleMonthSelect(index)}
                  disabled={isPast}
                  className="py-2.5 px-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isViewingMonth
                      ? '#111827'
                      : isCurrentMonth
                      ? 'rgba(0,0,0,0.08)'
                      : 'transparent',
                    color: isViewingMonth
                      ? '#ffffff'
                      : isPast
                      ? '#d1d5db'
                      : '#111827',
                    border: isCurrentMonth && !isViewingMonth
                      ? `1.5px solid ${firstColor || '#111827'}`
                      : '1.5px solid transparent',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    opacity: isPast ? 0.45 : 1,
                  }}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarModal;