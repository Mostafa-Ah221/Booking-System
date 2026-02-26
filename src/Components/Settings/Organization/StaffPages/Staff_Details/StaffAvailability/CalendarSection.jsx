import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, Edit, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStaffById } from '../../../../../../redux/apiCalls/StaffCallApi';

const CalendarSection = ({ 
  timeZone, 
  currentMonth: initialMonth,
  goToPreviousMonth, 
  goToNextMonth,
  handleDateClick,
  handleSave,
  availabilityMode = 'available',
}) => {
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayDates, setDisplayDates] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(initialMonth || new Date());

  // Month/Year selector states
  const [selectorView, setSelectorView] = useState('calendar'); // 'calendar', 'months', 'years'
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
  const [yearPageIndex, setYearPageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // الحد الأدنى: 5 سنوات للوراء
  const MIN_ALLOWED_YEAR = new Date().getFullYear() - 5; // 2020
  const minAllowedDate = new Date(MIN_ALLOWED_YEAR, 0, 1); // 1 يناير 2020

  const { id } = useParams();
  const { staff } = useSelector(state => state.staff);
  const dispatch = useDispatch();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getStaffById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (staff?.staff) {
      const dateSource = availabilityMode === 'available' 
        ? staff.staff.available_dates 
        : staff.staff.un_available_dates;

      if (dateSource?.length > 0) {
        const lastRange = dateSource[dateSource.length - 1];
        if (lastRange?.from && lastRange?.to) {
          setRangeStart(lastRange.from);
          setRangeEnd(lastRange.to);
          const datesInRange = generateDatesInRange(lastRange.from, lastRange.to);
          setDisplayDates(datesInRange);
          if (handleDateClick) handleDateClick(datesInRange);
        }
      } else {
        setDisplayDates([]);
        setRangeStart(null);
        setRangeEnd(null);
      }
    }
  }, [staff?.staff, availabilityMode, handleDateClick]);

  const generateDatesInRange = (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      dates.push({ date: formatDate(new Date(current)) });
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const createDate = (year, month, day) => new Date(year, month, day);

  // تعطيل التواريخ قبل 5 سنين
  const isDateDisabled = (dateStr) => {
    const checkDate = new Date(dateStr);
    return checkDate < minAllowedDate;
  };

  const isInSelectedRange = (day, month, year) => {
    if (!isEditMode && displayDates.length > 0) {
      const dateStr = formatDate(createDate(year, month, day));
      return displayDates.some(d => d.date === dateStr);
    }
    if (!rangeStart || !rangeEnd) return false;
    const date = createDate(year, month, day);
    return date >= new Date(rangeStart) && date <= new Date(rangeEnd);
  };

  const isRangeStart = (day, month, year) => {
    if (!isEditMode && displayDates.length > 0) return displayDates[0]?.date === formatDate(createDate(year, month, day));
    if (!rangeStart) return false;
    return formatDate(createDate(year, month, day)) === rangeStart;
  };

  const isRangeEnd = (day, month, year) => {
    if (!isEditMode && displayDates.length > 0) return displayDates[displayDates.length - 1]?.date === formatDate(createDate(year, month, day));
    if (!rangeEnd) return false;
    return formatDate(createDate(year, month, day)) === rangeEnd;
  };

  const handleDateSelect = (day, monthOffset = 0) => {
    if (!isEditMode || selectorView !== 'calendar') return;

    const year = monthOffset === 1 && currentMonth.getMonth() === 11
      ? currentMonth.getFullYear() + 1
      : currentMonth.getFullYear();
    const month = monthOffset === 1
      ? currentMonth.getMonth() === 11 ? 0 : currentMonth.getMonth() + 1
      : currentMonth.getMonth();

    const dateStr = formatDate(createDate(year, month, day));

    if (isDateDisabled(dateStr)) {
      alert('لا يمكن اختيار تاريخ قبل 5 سنوات');
      return;
    }

    if (!selecting) {
      setRangeStart(dateStr);
      setRangeEnd(null);
      setSelecting(true);
      if (handleDateClick) handleDateClick([{ date: dateStr }]);
    } else {
      const start = new Date(rangeStart);
      const clicked = createDate(year, month, day);
      const newStart = clicked < start ? dateStr : rangeStart;
      const newEnd = clicked < start ? rangeStart : dateStr;

      setRangeStart(newStart);
      setRangeEnd(newEnd);
      setSelecting(false);

      const datesInRange = generateDatesInRange(newStart, newEnd);
      if (handleDateClick) handleDateClick(datesInRange);
    }
  };

  const generateCalendarDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = MIN_ALLOWED_YEAR; i <= currentYear + 50; i++) {
      years.push(i);
    }
    return years;
  };

  // Month/Year Picker Handlers
  const handleHeaderClick = () => {
    if (!isEditMode) return;
    setIsAnimating(true);
    setTimeout(() => {
      setSelectorView('months');
      setIsAnimating(false);
    }, 150);
  };

  const handleYearClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const years = generateYears();
      const index = years.indexOf(selectedYear);
      setYearPageIndex(Math.floor(index / 12));
      setSelectorView('years');
      setIsAnimating(false);
    }, 150);
  };

  const handleMonthSelect = (monthIndex) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMonth(new Date(selectedYear, monthIndex, 1));
      setSelectorView('calendar');
      setIsAnimating(false);
    }, 150);
  };

  const handleYearSelect = (year) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedYear(year);
      setSelectorView('months');
      setIsAnimating(false);
    }, 150);
  };

  const handleCancelSelector = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectorView('calendar');
      setIsAnimating(false);
    }, 150);
  };

  const handlePreviousYear = () => selectedYear > MIN_ALLOWED_YEAR && setSelectedYear(y => y - 1);
  const handleNextYear = () => setSelectedYear(y => y + 1);

  const handlePreviousYearPage = () => setYearPageIndex(p => Math.max(0, p - 1));
  const handleNextYearPage = () => {
    const years = generateYears();
    const max = Math.ceil(years.length / 12) - 1;
    setYearPageIndex(p => Math.min(max, p + 1));
  };

  const handleSaveClick = async () => {
    if (!rangeStart || !rangeEnd) return;
    try {
      if (handleSave) {
        const result = await handleSave({ available_dates: [{ from: rangeStart, to: rangeEnd }] });
        if (result?.success) {
          const newDates = generateDatesInRange(rangeStart, rangeEnd);
          setDisplayDates(newDates);
          await dispatch(getStaffById(id));
          setIsEditMode(false);
          resetSelection();
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setSelectorView('calendar');
    if (displayDates.length > 0) {
      setRangeStart(displayDates[0].date);
      setRangeEnd(displayDates[displayDates.length - 1].date);
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setSelectorView('calendar');
    resetSelection();
  };

  const resetSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelecting(false);
    if (handleDateClick) handleDateClick([]);
  };

  const SingleCalendar = ({ year, month, monthOffset = 0, isOverlay = false }) => {
    const days = generateCalendarDays(year, month);
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    const isToday = (day) => day && createDate(year, month, day).toDateString() === new Date().toDateString();

    const getCellStyle = (day) => {
      if (!day) return 'invisible';
      const dateStr = formatDate(createDate(year, month, day));
      const disabled = isDateDisabled(dateStr);

      if (disabled) return 'bg-gray-100 text-gray-400 cursor-not-allowed line-through';
      if (isRangeStart(day, month, year)) return availabilityMode === 'available' ? 'bg-blue-600 text-white rounded-l-full' : 'bg-red-600 text-white rounded-l-full';
      if (isRangeEnd(day, month, year)) return availabilityMode === 'available' ? 'bg-blue-600 text-white rounded-r-full' : 'bg-red-600 text-white rounded-r-full';
      if (isInSelectedRange(day, month, year)) return availabilityMode === 'available' ? 'bg-blue-100 text-blue-900' : 'bg-red-100 text-red-900';
      if (isToday(day)) return 'bg-blue-500 text-white rounded-full font-semibold';
      return isEditMode ? 'hover:bg-gray-100' : '';
    };

    // Months View
    if (selectorView === 'months' && monthOffset === 0) {
      return (
        <div className={`flex-1 transition-all duration-200 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="flex justify-between items-center mb-4 px-4">
            <button onClick={handlePreviousYear} disabled={selectedYear <= MIN_ALLOWED_YEAR} className={`p-2 rounded-full ${selectedYear <= MIN_ALLOWED_YEAR ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleYearClick} className="font-semibold hover:bg-gray-100 px-4 py-2 rounded">{selectedYear}</button>
            <button onClick={handleNextYear} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-3 gap-2 px-4">
            {months.map((name, i) => (
              <button
                key={i}
                onClick={() => selectedYear >= MIN_ALLOWED_YEAR + 1 && handleMonthSelect(i)}
                disabled={selectedYear < MIN_ALLOWED_YEAR + 1}
                className={`p-2.5 rounded-lg text-xs font-medium ${selectedYear < MIN_ALLOWED_YEAR + 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'} ${currentMonth.getMonth() === i && currentMonth.getFullYear() === selectedYear ? 'border border-blue-600 text-blue-600' : 'bg-gray-50'}`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={handleCancelSelector} className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 flex items-center gap-2">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      );
    }

    // Years View
    if (selectorView === 'years' && monthOffset === 0) {
      const years = generateYears();
      const start = yearPageIndex * 12;
      const visible = years.slice(start, start + 12);
      const maxPage = Math.ceil(years.length / 12) - 1;

      return (
        <div className={`flex-1 transition-all duration-200 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="flex justify-between items-center mb-4 px-4">
            <button onClick={handlePreviousYearPage} disabled={yearPageIndex === 0} className={`p-2 rounded-full ${yearPageIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}><ChevronLeft size={18} /></button>
            <h3 className="font-semibold">Select Year</h3>
            <button onClick={handleNextYearPage} disabled={yearPageIndex === maxPage} className={`p-2 rounded-full ${yearPageIndex === maxPage ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-4 gap-2 px-4">
            {visible.map(y => (
              <button key={y} onClick={() => handleYearSelect(y)} className={`p-2.5 rounded-lg text-xs font-medium hover:bg-blue-50 hover:text-blue-600 ${selectedYear === y ? 'border border-blue-600 text-blue-600' : 'bg-gray-50'}`}>
                {y}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={handleCancelSelector} className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 flex items-center gap-2">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      );
    }

    // Calendar View
    return (
      <div className={`flex-1 ${isOverlay ? 'relative' : ''}`}>
        {isOverlay && selectorView !== 'calendar' && <div className="absolute inset-0 bg-white/10 z-10 rounded-lg"></div>}
        <div className={`transition-all duration-200 ${selectorView !== 'calendar' ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className="text-center mb-2 sm:mb-3">
            <button
              onClick={monthOffset === 0 ? handleHeaderClick : undefined}
              disabled={!isEditMode || monthOffset !== 0}
              className={`font-medium text-xs sm:text-sm ${isEditMode && monthOffset === 0 ? 'hover:bg-gray-100 px-3 py-1 rounded-lg cursor-pointer' : 'opacity-75'}`}
            >
              {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-gray-500 text-[10px] sm:text-xs h-5 sm:h-6 flex items-center justify-center font-medium">{d}</div>
            ))}
          </div>
          <div className={`grid grid-cols-7 gap-0 ${!isEditMode || selectorView !== 'calendar' ? 'pointer-events-none' : ''}`}>
            {weeks.map((week, wi) => week.map((day, di) => {
              const dateStr = day ? formatDate(createDate(year, month, day)) : null;
              const disabled = dateStr && isDateDisabled(dateStr);
              return (
                <div key={`${wi}-${di}`} className={`h-7 sm:h-8 md:h-9 flex items-center justify-center ${day === null ? 'invisible' : ''}`}>
                  <button
                    onClick={() => day && !disabled && handleDateSelect(day, monthOffset)}
                    className={`h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 flex items-center justify-center text-[10px] sm:text-xs ${getCellStyle(day)}`}
                    disabled={day === null || !isEditMode || disabled || selectorView !== 'calendar'}
                    title={disabled ? 'تاريخ غير مسموح (قبل 5 سنوات)' : ''}
                  >
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
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    const handlePrev = () => {
      if (selectorView !== 'calendar') return;
      const prev = new Date(currentMonth);
      prev.setMonth(prev.getMonth() - 1);
      if (prev >= minAllowedDate) {
        setCurrentMonth(prev);
        if (goToPreviousMonth) goToPreviousMonth();
      }
    };

    const handleNext = () => {
      if (selectorView !== 'calendar') return;
      const next = new Date(currentMonth);
      next.setMonth(next.getMonth() + 1);
      setCurrentMonth(next);
      if (goToNextMonth) goToNextMonth();
    };

    return (
      <div className="mt-3 sm:mt-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <button onClick={isEditMode ? handlePrev : undefined} disabled={!isEditMode || selectorView !== 'calendar'} className={`p-1 sm:p-2 rounded-full ${isEditMode && selectorView === 'calendar' ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}>
            <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
          </button>
          <div className={`flex ${isMobile ? 'flex-1' : 'space-x-4 sm:space-x-8'} justify-center`}>
            <SingleCalendar year={year} month={month} monthOffset={0} />
            {!isMobile && <SingleCalendar year={nextYear} month={nextMonth} monthOffset={1} isOverlay={true} />}
          </div>
          <button onClick={isEditMode ? handleNext : undefined} disabled={!isEditMode || selectorView !== 'calendar'} className={`p-1 sm:p-2 rounded-full ${isEditMode && selectorView === 'calendar' ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}>
            <ChevronRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Header */}
      {!isEditMode && (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-xl font-semibold">
              {availabilityMode === 'available' ? 'Available Dates' : 'Unavailable Dates'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {availabilityMode === 'available' ? 'Select a range of available dates' : 'Select a range of unavailable dates'}
            </p>
          </div>
          <button onClick={handleEditClick} className={`px-3 sm:px-4 py-1.5 sm:py-2 text-white rounded-md flex items-center ${availabilityMode === 'available' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
            <Edit size={14} className="mr-2" />
            <span className="text-xs sm:text-sm">Edit</span>
          </button>
        </div>
      )}

      {/* Edit Mode Buttons */}
      {isEditMode && (
        <div className="flex justify-end gap-2 mb-4 sm:mb-6">
          <button onClick={handleCancelClick} className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSaveClick} className={`px-3 sm:px-4 py-1.5 sm:py-2 text-white rounded-md flex items-center ${availabilityMode === 'available' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
            <Send size={14} className="mr-2" />
            Save
          </button>
        </div>
      )}

      <div className="border rounded-lg p-2 sm:p-3 md:p-4 mb-4 sm:mb-6">
        {isEditMode && selectorView === 'calendar' && (
          <div className="text-gray-600 mb-2 text-xs sm:text-sm">
            {selecting ? 'Select range end date' : 'Select range start date'}
          </div>
        )}
        <Calendar year={currentMonth.getFullYear()} month={currentMonth.getMonth()} />

        {((isEditMode && (rangeStart || rangeEnd)) || (!isEditMode && displayDates.length > 0)) && selectorView === 'calendar' && (
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <input type="text" value={rangeStart || (displayDates[0]?.date || '')} readOnly className="px-2 py-1 border rounded text-[10px] sm:text-xs w-24" placeholder="Start" />
              <span className="text-gray-500 text-xs">to</span>
              <input type="text" value={rangeEnd || (displayDates[displayDates.length - 1]?.date || '')} readOnly className="px-2 py-1 border rounded text-[10px] sm:text-xs w-24" placeholder="End" />
            </div>
            {isEditMode && <button onClick={resetSelection} className="text-xs text-red-600 hover:text-red-800">Reset</button>}
          </div>
        )}
      </div>

      {selectorView === 'calendar' && (
        <div className="text-gray-600 text-xs sm:text-sm">
          {isEditMode
            ? rangeStart && rangeEnd
              ? `Selected: ${new Date(rangeStart).toLocaleDateString()} to ${new Date(rangeEnd).toLocaleDateString()}`
              : 'No date range selected'
            : displayDates.length > 0
              ? `${availabilityMode === 'available' ? 'Available' : 'Unavailable'} from ${new Date(displayDates[0].date).toLocaleDateString()} to ${new Date(displayDates[displayDates.length - 1].date).toLocaleDateString()}`
              : `No ${availabilityMode} dates set`}
        </div>
      )}
    </div>
  );
};

export default CalendarSection;