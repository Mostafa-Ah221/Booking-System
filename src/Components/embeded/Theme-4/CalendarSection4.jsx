import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import TimezoneSelect from 'react-timezone-select';

const CalendarSection4 = ({
  selectedDate, onDateSelect,
  availableDates = [], disabledTimes = [], availableTimes = [],
  unavailableDates = [], unavailableTimes = [], availableTimesFromAPI = [],
  durationCycle = 15, durationPeriod = "minutes", restCycle = 0,
  setSelectedTimezone, selectedTimeZone, themeColor, workspaceTimezone,
  initialDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const popupRef = useRef(null);
  const hasAutoNavigated = useRef(false);

  // ── Color parsing ──────────────────────────────────────────────────────────
  const colors = themeColor ? JSON.parse(themeColor) : {};
  const primary = colors?.primary || "#3B817B-#F6CB45";
  const [bgColor, accentColor] = primary.split("-");
  const textColor = colors?.text_color || "#FFFFFF";

  const hexToRgba = (hex, opacity) => {
    const clean = (hex || '#F6CB45').replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const accentRgba = (op) => hexToRgba(accentColor, op);
  const textRgba = (op) => hexToRgba(textColor, op);

  const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // ── Navigate to initialDate when provided ─────────────────────────────────
  useEffect(() => {
    if (!initialDate) return;
    const parts = initialDate.split(' ');
    const monthIdx = monthAbbreviations.indexOf(parts[1]);
    if (monthIdx === -1) return;
    const d = new Date(parseInt(parts[2]), monthIdx, parseInt(parts[0]));
    setCurrentMonth(d);
  }, [initialDate]);

  // ── Auto-navigate to first available date ─────────────────────────────────
  useEffect(() => {
    if (hasAutoNavigated.current) return;
    if (!availableDates?.length || !availableTimesFromAPI?.length) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      const d = checkDate.getDate();
      const m = checkDate.getMonth();
      const y = checkDate.getFullYear();
      if (isDateAvailable(d, m, y)) {
        setCurrentMonth(new Date(y, m, 1));
        hasAutoNavigated.current = true;
        if (!selectedDate) {
          const dateStr = `${String(d).padStart(2, '0')} ${monthAbbreviations[m]} ${y}`;
          setTimeout(() => onDateSelect(dateStr), 100);
        }
        break;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
  }, [availableDates, availableTimesFromAPI, disabledTimes]);

  // ── Re-check if selected date still available (لما slots تتحجز) ──────────
  useEffect(() => {
    if (!selectedDate) return;
    const parts = selectedDate.split(' ');
    const monthIdx = monthAbbreviations.indexOf(parts[1]);
    if (monthIdx === -1) return;
    const d = parseInt(parts[0]), m = monthIdx, y = parseInt(parts[2]);
    if (isDateAvailable(d, m, y)) return;

    // لو مش متاح دور على أول تاريخ متاح
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);
    for (let i = 0; i < 365; i++) {
      const cd = checkDate.getDate(), cm = checkDate.getMonth(), cy = checkDate.getFullYear();
      if (isDateAvailable(cd, cm, cy)) {
        const newDateStr = `${String(cd).padStart(2, '0')} ${monthAbbreviations[cm]} ${cy}`;
        setCurrentMonth(new Date(cy, cm, 1));
        onDateSelect(newDateStr);
        break;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
  }, [disabledTimes]);

  const getAvailableDayNumbers = () => {
    const timesData = (availableTimesFromAPI?.length > 0 ? availableTimesFromAPI : availableTimes) || [];
    const dayMapping = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6 };
    return timesData.map(t => dayMapping[t.day_id]).filter(d => d !== undefined);
  };

  const isDateInUnavailableRange = (day, month, year) => {
    if (!unavailableDates?.length) return false;
    const checkDate = new Date(Date.UTC(year, month, day));
    return unavailableDates.some(dateRange => {
      try {
        if (!dateRange?.from) return false;
        let fromStr = dateRange.from.split(' ')[0].replace(/\//g, '-');
        let fp = fromStr.split('-');
        if (fp.length === 3 && parseInt(fp[0]) <= 31) fromStr = `${fp[2]}-${fp[1]}-${fp[0]}`;
        const fromDate = new Date(fromStr + 'T00:00:00.000Z');
        if (isNaN(fromDate.getTime())) return false;
        if (dateRange.to === null || dateRange.to === undefined) return checkDate >= fromDate;
        let toStr = dateRange.to.split(' ')[0].replace(/\//g, '-');
        let tp = toStr.split('-');
        if (tp.length === 3 && parseInt(tp[0]) <= 31) toStr = `${tp[2]}-${tp[1]}-${tp[0]}`;
        const toDate = new Date(toStr + 'T00:00:00.000Z');
        if (isNaN(toDate.getTime())) return false;
        return checkDate >= fromDate && checkDate <= toDate;
      } catch { return false; }
    });
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr?.includes(':')) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const calculateEffectiveAvailableTimes = (day, month, year) => {
    const checkDate = new Date(Date.UTC(year, month, day));
    const dayOfWeek = checkDate.getUTCDay();
    const dayId = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
    const wsTimezone = workspaceTimezone || 'Africa/Cairo';
    const userTimezone = selectedTimeZone || wsTimezone;
    const timesSource = availableTimesFromAPI?.length > 0 ? availableTimesFromAPI : availableTimes || [];
    const dayAvailableTimes = timesSource.filter(t => String(t.day_id) === String(dayId));
    const dayUnavailableTimes = unavailableTimes.filter(t => String(t.day_id) === String(dayId));
    const availableRanges = [];
    dayAvailableTimes.forEach(availableRange => {
      if (!availableRange?.from || !availableRange?.to) return;
      let currentRanges = [{ from: timeToMinutes(availableRange.from), to: timeToMinutes(availableRange.to) }];
      if (isDateInUnavailableRange(day, month, year)) {
        dayUnavailableTimes.forEach(ur => {
          if (!ur?.from || !ur?.to) return;
          const uFrom = timeToMinutes(ur.from), uTo = timeToMinutes(ur.to);
          const newRanges = [];
          currentRanges.forEach(range => {
            if (uTo <= range.from || uFrom >= range.to) newRanges.push(range);
            else if (uFrom <= range.from && uTo < range.to) newRanges.push({ from: uTo, to: range.to });
            else if (uFrom > range.from && uTo >= range.to) newRanges.push({ from: range.from, to: uFrom });
            else if (uFrom > range.from && uTo < range.to) { newRanges.push({ from: range.from, to: uFrom }); newRanges.push({ from: uTo, to: range.to }); }
          });
          currentRanges = newRanges;
        });
      }
      availableRanges.push(...currentRanges);
    });
    const effectiveSlots = [];
    const durMin = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
    const restMin = parseInt(restCycle) || 0;
    const totalSlot = durMin + restMin;
    const dateISO = checkDate.toISOString().split('T')[0];
    const now = new Date();
    const isToday = checkDate.toDateString() === now.toDateString();
    availableRanges.forEach(range => {
      for (let cur = range.from; cur < range.to; cur += totalSlot) {
        const h = Math.floor(cur / 60), m = cur % 60;
        const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const isDisabled = disabledTimes.some(dt => dt?.date === dateISO && dt?.time?.slice(0, 5) === formatted);
        const isPast = isToday && cur < now.getHours() * 60 + now.getMinutes();
        if (!isDisabled && !isPast) effectiveSlots.push(formatted);
      }
    });
    let nextDaySlots = [];
    if (userTimezone !== wsTimezone) {
      const nextDate = new Date(Date.UTC(year, month, day));
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      const nd = nextDate.getUTCDate(), nm = nextDate.getUTCMonth(), ny = nextDate.getUTCFullYear();
      const nextDayId = (nextDate.getUTCDay() === 0 ? 1 : nextDate.getUTCDay() + 1);
      const nextDayTimes = timesSource.filter(t => String(t.day_id) === String(nextDayId));
      if (nextDayTimes.length > 0) {
        nextDayTimes.forEach(at => {
          if (!at?.from || !at?.to) return;
          for (let cur = timeToMinutes(at.from); cur < timeToMinutes(at.to); cur += totalSlot) {
            const h = Math.floor(cur / 60), m = cur % 60;
            const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            const nextDateStr = `${String(nd).padStart(2, '0')} ${monthAbbreviations[nm]} ${ny}`;
            const converted = convertDateTimeWithTimezone(nextDateStr, formatted, wsTimezone, userTimezone);
            const currentDateStr = `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;
            if (converted.date === currentDateStr) {
              const isDisabled = disabledTimes.some(dt => dt?.date === dateISO && dt?.time?.startsWith(converted.time));
              if (!isDisabled) nextDaySlots.push(converted.time);
            }
          }
        });
      }
    }
    return [...new Set([...effectiveSlots, ...nextDaySlots])].sort((a, b) => {
      const [ha, ma] = a.split(':').map(Number), [hb, mb] = b.split(':').map(Number);
      return ha * 60 + ma - (hb * 60 + mb);
    });
  };

  const convertDateTimeWithTimezone = (dateStr, timeStr, fromTimezone, toTimezone) => {
    try {
      const [day, month, year] = dateStr.split(' ');
      const monthIndex = monthAbbreviations.indexOf(month);
      if (monthIndex === -1) return { date: dateStr, time: timeStr };
      const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
      const [hours, minutes] = timeStr.split(':').map(Number);
      const dt = new Date(`${isoDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
      const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: toTimezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
      const parts = formatter.formatToParts(dt);
      const yp = parts.find(p => p.type === 'year')?.value;
      const mp = parts.find(p => p.type === 'month')?.value;
      const dp = parts.find(p => p.type === 'day')?.value;
      const hp = parts.find(p => p.type === 'hour')?.value || '00';
      const minp = parts.find(p => p.type === 'minute')?.value || '00';
      return { date: `${dp} ${monthAbbreviations[parseInt(mp) - 1]} ${yp}`, time: `${hp}:${minp}` };
    } catch { return { date: dateStr, time: timeStr }; }
  };

  const isDateAvailable = (day, month, year) => {
    const checkDate = new Date(Date.UTC(year, month, day));
    const todayUTC = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
    if (checkDate < todayUTC) return false;
    const wsTimezone = workspaceTimezone || 'Africa/Cairo';
    const selTz = selectedTimeZone || wsTimezone;
    if (selTz === wsTimezone) return checkDateAvailability(day, month, year);
    if (checkDateAvailability(day, month, year)) return true;
    const prev = new Date(Date.UTC(year, month, day));
    prev.setUTCDate(prev.getUTCDate() - 1);
    if (checkDateAvailability(prev.getUTCDate(), prev.getUTCMonth(), prev.getUTCFullYear())) {
      const prevStr = `${String(prev.getUTCDate()).padStart(2, '0')} ${monthAbbreviations[prev.getUTCMonth()]} ${prev.getUTCFullYear()}`;
      const currStr = `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;
      for (let t of calculateEffectiveAvailableTimes(prev.getUTCDate(), prev.getUTCMonth(), prev.getUTCFullYear())) {
        if (convertDateTimeWithTimezone(prevStr, t, wsTimezone, selTz).date === currStr) return true;
      }
    }
    const next = new Date(Date.UTC(year, month, day));
    next.setUTCDate(next.getUTCDate() + 1);
    if (checkDateAvailability(next.getUTCDate(), next.getUTCMonth(), next.getUTCFullYear())) {
      const nextStr = `${String(next.getUTCDate()).padStart(2, '0')} ${monthAbbreviations[next.getUTCMonth()]} ${next.getUTCFullYear()}`;
      const currStr = `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;
      for (let t of calculateEffectiveAvailableTimes(next.getUTCDate(), next.getUTCMonth(), next.getUTCFullYear())) {
        if (convertDateTimeWithTimezone(nextStr, t, wsTimezone, selTz).date === currStr) return true;
      }
    }
    return false;
  };

  const checkDateAvailability = (day, month, year) => {
    const checkDate = new Date(Date.UTC(year, month, day));
    const isInRange = availableDates.some(dr => {
      try {
        if (!dr?.from) return false;
        let fs = dr.from.split(' ')[0].replace(/\//g, '-');
        let fp = fs.split('-');
        if (fp.length === 3 && parseInt(fp[0]) <= 31) fs = `${fp[2]}-${fp[1]}-${fp[0]}`;
        const fd = new Date(fs + 'T00:00:00.000Z');
        if (isNaN(fd.getTime())) return false;
        if (dr.to === null || dr.to === undefined) return checkDate >= fd;
        let ts = dr.to.split(' ')[0].replace(/\//g, '-');
        let tp = ts.split('-');
        if (tp.length === 3 && parseInt(tp[0]) <= 31) ts = `${tp[2]}-${tp[1]}-${tp[0]}`;
        const td = new Date(ts + 'T00:00:00.000Z');
        return checkDate >= fd && checkDate <= td;
      } catch { return false; }
    });
    if (!isInRange) return false;
    const dow = checkDate.getUTCDay();
    if (!getAvailableDayNumbers().includes(dow)) return false;
    return calculateEffectiveAvailableTimes(day, month, year).length > 0;
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear(), month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push({ day: d, month, year });
    return days;
  };

  // ── Date availability cache (زي CalendarSection2) ─────────────────────────
  const days = getDaysInMonth();

  const availabilityCache = useMemo(() => {
    const cache = new Map();
    days.forEach(item => {
      if (!item) return;
      const { day, month, year } = item;
      const dateStr = `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;
      cache.set(dateStr, isDateAvailable(day, month, year));
    });
    return cache;
  }, [
    currentMonth,
    availableDates, disabledTimes, availableTimesFromAPI,
    availableTimes, unavailableDates, unavailableTimes,
    selectedTimeZone, workspaceTimezone, durationCycle, durationPeriod, restCycle
  ]);

  const handlePrevMonth = () => setCurrentMonth(prev => { const d = new Date(prev); d.setMonth(prev.getMonth() - 1); return d; });
  const handleNextMonth = () => setCurrentMonth(prev => { const d = new Date(prev); d.setMonth(prev.getMonth() + 1); return d; });
  const formatDateString = (day, month, year) => `${String(day).padStart(2, '0')} ${monthAbbreviations[month]} ${year}`;

  return (
    <div className="space-y-4">
      {/* Timezone Selector */}
      <div>
        <TimezoneSelect
          value={selectedTimeZone}
          onChange={(tz) => setSelectedTimezone(tz.value)}
          className="react-timezone-select"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: accentRgba(0.15),
              border: `1px solid ${accentRgba(0.4)}`,
              borderRadius: '8px',
              color: textColor,
              boxShadow: 'none',
              '&:hover': { borderColor: accentColor },
            }),
            singleValue: (base) => ({ ...base, color: textColor }),
            menu: (base) => ({ ...base, backgroundColor: bgColor, border: `1px solid ${accentRgba(0.3)}` }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? accentRgba(0.15) : 'transparent',
              color: textColor,
            }),
            input: (base) => ({ ...base, color: textColor }),
          }}
        />
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ backgroundColor: accentRgba(0.15) }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = accentRgba(0.3)}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = accentRgba(0.15)}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: textColor }} />
        </button>

        <h2 className="text-base font-bold" style={{ color: textColor }}>
          {monthsFull[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <button
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ backgroundColor: accentRgba(0.15) }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = accentRgba(0.3)}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = accentRgba(0.15)}
        >
          <ChevronRight className="w-5 h-5" style={{ color: textColor }} />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 text-center">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
          <div key={d} className="py-1 text-xs font-semibold" style={{ color: textRgba(0.45) }}>{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((item, index) => {
          if (!item) return <div key={`empty-${index}`} className="h-10" />;

          const { day, month, year } = item;
          const dateStr = formatDateString(day, month, year);
          const isAvailable = availabilityCache.get(dateStr) ?? false;
          const isSelected = selectedDate === dateStr;
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <button
              key={`${day}-${month}-${year}`}
              onClick={() => isAvailable && onDateSelect(dateStr)}
              disabled={!isAvailable}
              className="h-10 w-full rounded-lg font-medium text-sm transition-all duration-150"
              style={{
                backgroundColor: isSelected ? accentColor : isToday ? accentRgba(0.2) : 'transparent',
                color: isSelected ? bgColor : textColor,
                opacity: !isAvailable ? 0.25 : 1,
                cursor: !isAvailable ? 'not-allowed' : 'pointer',
                border: isToday && !isSelected ? `1.5px solid ${accentColor}` : '1.5px solid transparent',
                fontWeight: isSelected || isToday ? '700' : '500',
              }}
              onMouseEnter={(e) => { if (isAvailable && !isSelected) e.currentTarget.style.backgroundColor = accentRgba(0.2); }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = isToday ? accentRgba(0.2) : 'transparent'; }}
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