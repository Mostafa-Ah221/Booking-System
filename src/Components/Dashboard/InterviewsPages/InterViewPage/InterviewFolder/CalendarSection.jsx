import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, Edit, X } from 'lucide-react';

const CalendarSection = ({ 
  timeZone, 
  currentMonth: initialMonth = new Date(),
  handleDateClick,
  handleSave,
  availabilityMode = 'available',
  getWorkspaceData
}) => {
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayDates, setDisplayDates] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  // Month/Year Picker
  const [selectorView, setSelectorView] = useState('calendar');
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
  const [yearPageIndex, setYearPageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const MIN_YEAR = new Date().getFullYear() - 5;
  const minDate = new Date(MIN_YEAR, 0, 1);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const source = availabilityMode === 'available' 
      ? getWorkspaceData?.available_dates 
      : getWorkspaceData?.un_available_dates;

    if (source?.length > 0) {
      const last = source[source.length - 1];
      if (last?.from && last?.to) {
        setRangeStart(last.from);
        setRangeEnd(last.to);
        const dates = generateDatesInRange(last.from, last.to);
        setDisplayDates(dates);
        handleDateClick?.(dates);
      }
    } else {
      setDisplayDates([]);
      setRangeStart(null);
      setRangeEnd(null);
    }
  }, [getWorkspaceData, availabilityMode, handleDateClick]);

  const generateDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const stop = new Date(end);
    while (current <= stop) {
      dates.push({ date: formatDate(current) });
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const createDate = (y, m, d) => new Date(y, m, d);

  const isDateDisabled = (dateStr) => new Date(dateStr) < minDate;

  const isInRange = (day, month, year) => {
    if (!isEditMode && displayDates.length > 0) {
      return displayDates.some(d => d.date === formatDate(createDate(year, month, day)));
    }
    if (!rangeStart || !rangeEnd) return false;
    const date = createDate(year, month, day);
    return date >= new Date(rangeStart) && date <= new Date(rangeEnd);
  };

  const isStart = (day, month, year) => {
    const str = formatDate(createDate(year, month, day));
    return (!isEditMode ? displayDates[0]?.date : rangeStart) === str;
  };

  const isEnd = (day, month, year) => {
    const str = formatDate(createDate(year, month, day));
    return (!isEditMode ? displayDates[displayDates.length - 1]?.date : rangeEnd) === str;
  };

  const handleDateSelect = (day, offset = 0) => {
    if (!isEditMode || selectorView !== 'calendar') return;

    const y = offset === 1 && currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear();
    const m = offset === 1 ? (currentMonth.getMonth() === 11 ? 0 : currentMonth.getMonth() + 1) : currentMonth.getMonth();
    const dateStr = formatDate(createDate(y, m, day));


    if (!selecting) {
      setRangeStart(dateStr);
      setRangeEnd(null);
      setSelecting(true);
      handleDateClick?.([{ date: dateStr }]);
    } else {
      const start = new Date(rangeStart);
      const clicked = createDate(y, m, day);
      const newStart = clicked < start ? dateStr : rangeStart;
      const newEnd = clicked < start ? rangeStart : dateStr;

      setRangeStart(newStart);
      setRangeEnd(newEnd);
      setSelecting(false);
      handleDateClick?.(generateDatesInRange(newStart, newEnd));
    }
  };

  const generateDays = (y, m) => {
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const days = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const generateYears = () => {
    const current = new Date().getFullYear();
    return Array.from({ length: current + 50 - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);
  };

  // Picker Handlers
  const openMonths = () => { setIsAnimating(true); setTimeout(() => { setSelectorView('months'); setIsAnimating(false); }, 150); };
  const openYears = () => { setIsAnimating(true); setTimeout(() => { const years = generateYears(); setYearPageIndex(Math.floor(years.indexOf(selectedYear) / 12)); setSelectorView('years'); setIsAnimating(false); }, 150); };
  const closePicker = () => { setIsAnimating(true); setTimeout(() => { setSelectorView('calendar'); setIsAnimating(false); }, 150); };

  const selectMonth = (i) => { setIsAnimating(true); setTimeout(() => { setCurrentMonth(new Date(selectedYear, i, 1)); setSelectorView('calendar'); setIsAnimating(false); }, 150); };
  const selectYear = (y) => { setIsAnimating(true); setTimeout(() => { setSelectedYear(y); setSelectorView('months'); setIsAnimating(false); }, 150); };

  const prevYear = () => selectedYear > MIN_YEAR && setSelectedYear(y => y - 1);
  const nextYear = () => setSelectedYear(y => y + 1);

  const handleSaveClick = async () => {
    if (!rangeStart || !rangeEnd) return;
    await handleSave?.({ available_dates: [{ from: rangeStart, to: rangeEnd }] });
    setIsEditMode(false);
    resetSelection();
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setSelectorView('calendar');
    if (displayDates.length > 0) {
      setRangeStart(displayDates[0].date);
      setRangeEnd(displayDates[displayDates.length - 1].date);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setSelectorView('calendar');
    resetSelection();
  };

  const resetSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelecting(false);
    handleDateClick?.([]);
  };

  const SingleCalendar = ({ year, month, offset = 0, overlay = false }) => {
    const days = generateDays(year, month);
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    const cellStyle = (day) => {
      if (!day) return 'invisible';
      const str = formatDate(createDate(year, month, day));
      const disabled = isDateDisabled(str);
      if (disabled) return 'bg-gray-100 text-gray-400 line-through cursor-not-allowed';
      if (isStart(day, month, year)) return availabilityMode === 'available' ? 'bg-blue-600 text-white rounded-l-full' : 'bg-red-600 text-white rounded-l-full';
      if (isEnd(day, month, year)) return availabilityMode === 'available' ? 'bg-blue-600 text-white rounded-r-full' : 'bg-red-600 text-white rounded-r-full';
      if (isInRange(day, month, year)) return availabilityMode === 'available' ? 'bg-blue-100 text-blue-900' : 'bg-red-100 text-red-900';
      return isEditMode ? 'hover:bg-gray-100' : '';
    };

    // Months Picker
    if (selectorView === 'months' && offset === 0) {
      return (
        <div className={`flex-1 transition-all duration-200 ${isAnimating ? 'scale-95 opacity-0' : ''}`}>
          <div className="flex justify-between items-center mb-4 px-4">
            <button onClick={prevYear} disabled={selectedYear <= MIN_YEAR} className={`p-2 rounded-full ${selectedYear <= MIN_YEAR ? 'opacity-50' : 'hover:bg-gray-100'}`}><ChevronLeft size={18}/></button>
            <button onClick={openYears} className="font-semibold hover:bg-gray-100 px-4 py-2 rounded">{selectedYear}</button>
            <button onClick={nextYear} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={18}/></button>
          </div>
          <div className="grid grid-cols-3 gap-2 px-4">
            {months.map((name, i) => (
              <button key={i} onClick={() => selectedYear >= MIN_YEAR + 1 && selectMonth(i)} disabled={selectedYear < MIN_YEAR + 1}
                className={`p-2.5 rounded-lg text-xs ${selectedYear < MIN_YEAR + 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-50'} ${currentMonth.getMonth() === i && currentMonth.getFullYear() === selectedYear ? 'border border-blue-600 text-blue-600' : 'bg-gray-50'}`}>
                {name}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={closePicker} className="flex items-center gap-2 text-xs text-gray-600"><X size={14}/> Cancel</button>
          </div>
        </div>
      );
    }

    // Years Picker
    if (selectorView === 'years' && offset === 0) {
      const years = generateYears();
      const visible = years.slice(yearPageIndex * 12, yearPageIndex * 12 + 12);
      return (
        <div className={`flex-1 transition-all duration-200 ${isAnimating ? 'scale-95 opacity-0' : ''}`}>
          <div className="flex justify-between mb-4 px-4">
            <button onClick={() => setYearPageIndex(p => Math.max(0, p-1))} disabled={yearPageIndex===0} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={18}/></button>
            <h3 className="font-semibold">Select Year</h3>
            <button onClick={() => setYearPageIndex(p => p+1)} disabled={yearPageIndex >= Math.ceil(years.length/12)-1} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={18}/></button>
          </div>
          <div className="grid grid-cols-4 gap-2 px-4">
            {visible.map(y => (
              <button key={y} onClick={() => selectYear(y)} className={`p-2.5 rounded-lg text-xs hover:bg-blue-50 ${selectedYear === y ? 'border border-blue-600 text-blue-600' : 'bg-gray-50'}`}>
                {y}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={closePicker} className="flex items-center gap-2 text-xs text-gray-600"><X size={14}/> Cancel</button>
          </div>
        </div>
      );
    }

    // Normal Calendar
    return (
      <div className={`flex-1 ${overlay ? 'relative' : ''}`}>
        {overlay && selectorView !== 'calendar' && <div className="absolute inset-0 bg-white/10 z-10 rounded-lg"/>}
        <div className={`transition-all ${selectorView !== 'calendar' ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className="text-center mb-3">
            <button onClick={offset === 0 ? openMonths : undefined} disabled={!isEditMode || offset !== 0}
              className={`font-medium text-sm ${isEditMode && offset === 0 ? 'hover:bg-gray-100 px-3 py-1 rounded cursor-pointer' : 'opacity-75'}`}>
              {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-gray-500 text-xs">{d}</div>)}
          </div>
          <div className={`grid grid-cols-7 gap-0 ${!isEditMode || selectorView !== 'calendar' ? 'pointer-events-none' : ''}`}>
            {weeks.map((week, i) => week.map((day, j) => {
              const str = day ? formatDate(createDate(year, month, day)) : null;
              const disabled = str && isDateDisabled(str);
              return (
                <div key={`${i}-${j}`} className={`h-9 flex items-center justify-center ${day === null ? 'invisible' : ''}`}>
                  <button onClick={() => day && !disabled && handleDateSelect(day, offset)}
                    className={`w-9 h-9 rounded flex items-center justify-center text-xs ${cellStyle(day)}`}
                    disabled={disabled || !isEditMode}>
                    {day}
                  </button>
                </div>
              );
            }))}
          </div>
        </div>
      </div>
    );
  };

  const Calendar = ({ year, month }) => {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;

    const prevMonth = () => {
      const prev = new Date(currentMonth);
      prev.setMonth(prev.getMonth() - 1);
      if (prev >= minDate) setCurrentMonth(prev);
    };

    const nextMonth = () => {
      const next = new Date(currentMonth);
      next.setMonth(next.getMonth() + 1);
      setCurrentMonth(next);
    };

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={isEditMode ? prevMonth : undefined} disabled={!isEditMode} className={`p-2 rounded-full ${isEditMode ? 'hover:bg-gray-100' : 'opacity-50'}`}><ChevronLeft/></button>
          <div className={`flex ${isMobile ? 'flex-1' : 'space-x-8'} justify-center`}>
            <SingleCalendar year={year} month={month} />
            {!isMobile && <SingleCalendar year={nextY} month={nextM} offset={1} overlay={true} />}
          </div>
          <button onClick={isEditMode ? nextMonth : undefined} disabled={!isEditMode} className={`p-2 rounded-full ${isEditMode ? 'hover:bg-gray-100' : 'opacity-50'}`}><ChevronRight/></button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      {!isEditMode && (
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold">{availabilityMode === 'available' ? 'Available Dates' : 'Unavailable Dates'}</h2>
            <p className="text-sm text-gray-500 mt-1">Select a range of dates</p>
          </div>
          <button onClick={handleEdit} className={`px-4  text-white rounded flex items-center gap-2 ${availabilityMode === 'available' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
            <Edit size={16}/> Edit
          </button>
        </div>
      )}

      {isEditMode && (
        <div className="flex justify-end gap-2 mb-6">
          <button onClick={handleCancel} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSaveClick} className={`px-4 py-2 text-white rounded flex items-center gap-2 ${availabilityMode === 'available' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
            <Send size={16}/> Save
          </button>
        </div>
      )}

      <div className="border rounded-lg p-4">
        {isEditMode && selectorView === 'calendar' && <div className="text-gray-600 mb-3 text-sm">{selecting ? 'Select end date' : 'Select start date'}</div>}
        <Calendar year={currentMonth.getFullYear()} month={currentMonth.getMonth()} />

        {(rangeStart || rangeEnd || displayDates.length > 0) && selectorView === 'calendar' && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <input readOnly value={rangeStart || displayDates[0]?.date || ''} className="px-3 py-1 border rounded w-28 text-sm" />
              <span className="text-gray-500">to</span>
              <input readOnly value={rangeEnd || displayDates[displayDates.length-1]?.date || ''} className="px-3 py-1 border rounded w-28 text-sm" />
            </div>
            {isEditMode && <button onClick={resetSelection} className="text-red-600 text-sm hover:text-red-800">Reset</button>}
          </div>
        )}
      </div>

      {selectorView === 'calendar' && (
        <div className="mt-4 text-sm text-gray-600">
          {isEditMode 
            ? (rangeStart && rangeEnd ? `Selected: ${new Date(rangeStart).toLocaleDateString()} - ${new Date(rangeEnd).toLocaleDateString()}` : 'No selection')
            : displayDates.length > 0 
              ? `${availabilityMode === 'available' ? 'Available' : 'Unavailable'} from ${new Date(displayDates[0].date).toLocaleDateString()} to ${new Date(displayDates[displayDates.length-1].date).toLocaleDateString()}`
              : `No dates set`}
        </div>
      )}
    </div>
  );
};

export default CalendarSection;