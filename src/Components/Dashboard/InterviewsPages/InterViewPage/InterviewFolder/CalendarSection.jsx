import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, Edit } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewById } from '../../../../../redux/apiCalls/interviewCallApi';
import toast from "react-hot-toast";

const CalendarSection = ({ 
  timeZone, 
  currentMonth,
  selectedDates,
  goToPreviousMonth, 
  goToNextMonth,
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
  const { interview, loading } = useSelector(state => state.interview);

  const { id } = useOutletContext();
  const dispatch = useDispatch();



  const isDateInWorkspaceRange = (dateStr) => {
    if (!getWorkspaceData?.available_dates || getWorkspaceData.available_dates.length === 0) {
      return true; // If no restrictions, allow all dates
    }

    const checkDate = new Date(dateStr);
    
    return getWorkspaceData.available_dates.some(range => {
      const rangeStart = new Date(range.from);
      const rangeEnd = new Date(range.to);
      return checkDate >= rangeStart && checkDate <= rangeEnd;
    });
  };

  
  const isDateInWorkspaceUnavailable = (dateStr) => {
    if (!getWorkspaceData?.un_available_dates || getWorkspaceData.un_available_dates.length === 0) {
      return false;
    }

    const checkDate = new Date(dateStr);
    
    return getWorkspaceData.un_available_dates.some(range => {
      const rangeStart = new Date(range.from);
      const rangeEnd = new Date(range.to);
      return checkDate >= rangeStart && checkDate <= rangeEnd;
    });
  };

  // Check if date is disabled (outside workspace range or in unavailable dates)
  const isDateDisabled = (dateStr) => {
    return !isDateInWorkspaceRange(dateStr) || isDateInWorkspaceUnavailable(dateStr);
  };

  useEffect(() => {
    if (id) {
      dispatch(editInterviewById(id));
    }
  }, [id, dispatch]);

 
  useEffect(() => {
    if (interview) {
     
      const dateSource = availabilityMode === 'available' 
        ? interview.available_dates 
        : interview.un_available_dates;

      if (dateSource?.length > 0) {
        const lastRange = dateSource[dateSource.length - 1];
        if (lastRange?.from && lastRange?.to) {
        
          setRangeStart(lastRange.from);
          setRangeEnd(lastRange.to);

          
          const datesInRange = generateDatesInRange(lastRange.from, lastRange.to);
          setDisplayDates(datesInRange);
          
          
          handleDateClick(datesInRange);
        }
      } else {
     
        setDisplayDates([]);
        setRangeStart(null);
        setRangeEnd(null);
      }
    }
  }, [interview, availabilityMode]);

  
  const generateDatesInRange = (startDate, endDate) => {
    const datesInRange = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      datesInRange.push({ date: formatDate(new Date(currentDate)) });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return datesInRange;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const createDate = (year, month, day) => {
    return new Date(year, month, day);
  };

  const getDateString = (day, monthOffset = 0) => {
    const year =
      monthOffset === 1 && currentMonth.getMonth() === 11
        ? currentMonth.getFullYear() + 1
        : currentMonth.getFullYear();
    const month =
      monthOffset === 1
        ? currentMonth.getMonth() === 11
          ? 0
          : currentMonth.getMonth() + 1
        : currentMonth.getMonth();
    return formatDate(new Date(year, month, day));
  };

  const isInSelectedRange = (day, month, year) => {
    // استخدام displayDates بدلاً من rangeStart/rangeEnd في العرض
    if (!isEditMode && displayDates.length > 0) {
      const dateStr = formatDate(createDate(year, month, day));
      return displayDates.some(d => d.date === dateStr);
    }
    
    // في وضع التحرير، استخدم rangeStart/rangeEnd
    if (!rangeStart || !rangeEnd) return false;
    const date = createDate(year, month, day);
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    return date >= start && date <= end;
  };

  const isRangeStart = (day, month, year) => {
    if (!isEditMode && displayDates.length > 0) {
      const dateStr = formatDate(createDate(year, month, day));
      return displayDates[0]?.date === dateStr;
    }
    
    if (!rangeStart) return false;
    const date = formatDate(createDate(year, month, day));
    return date === rangeStart;
  };

  const isRangeEnd = (day, month, year) => {
    if (!isEditMode && displayDates.length > 0) {
      const dateStr = formatDate(createDate(year, month, day));
      return displayDates[displayDates.length - 1]?.date === dateStr;
    }
    
    if (!rangeEnd) return false;
    const date = formatDate(createDate(year, month, day));
    return date === rangeEnd;
  };

  // ✅ التعديل 2: إضافة validation للتواريخ عند الاختيار
  const handleDateSelect = (day, monthOffset = 0) => {
    if (!isEditMode) return;
    
    const year =
      monthOffset === 1 && currentMonth.getMonth() === 11
        ? currentMonth.getFullYear() + 1
        : currentMonth.getFullYear();
    const month =
      monthOffset === 1
        ? currentMonth.getMonth() === 11
          ? 0
          : currentMonth.getMonth() + 1
        : currentMonth.getMonth();
    const date = createDate(year, month, day);
    const dateStr = formatDate(date);

    // Check if date is disabled
    if (isDateDisabled(dateStr)) {
      toast.error('This date is outside the workspace available range');
      return;
    }

    if (!selecting) {
      setRangeStart(dateStr);
      setRangeEnd(null);
      setSelecting(true);
      handleDateClick([{ date: dateStr }]);
    } else {
      const startDate = new Date(rangeStart);
      const clickedDate = date;

      if (clickedDate < startDate) {
        setRangeEnd(rangeStart);
        setRangeStart(dateStr);
      } else {
        setRangeEnd(dateStr);
      }

      setSelecting(false);
      const start = new Date(Math.min(new Date(rangeStart), clickedDate));
      const end = new Date(Math.max(new Date(rangeStart), clickedDate));
      
      // Validate all dates in range
      const currentDate = new Date(start);
      const datesInRange = [];
      let hasDisabledDate = false;

      while (currentDate <= end) {
        const checkDateStr = formatDate(new Date(currentDate));
        if (isDateDisabled(checkDateStr)) {
          hasDisabledDate = true;
          break;
        }
        datesInRange.push({ date: checkDateStr });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (hasDisabledDate) {
        toast.error('Selected range contains dates outside workspace availability');
        resetSelection();
        return;
      }

      handleDateClick(datesInRange);
    }
  };

  // Generate calendar days for a month
  const generateCalendarDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const result = [];
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      result.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(i);
    }
    
    return result;
  };

  // Format selected dates for API
  const formatSelectedDates = () => {
    if (!selectedDates || selectedDates.length === 0) return [];
    
    // With range selection, we can simplify to just one range
    if (rangeStart && rangeEnd) {
      return [{ from: rangeStart, to: rangeEnd }];
    }
    
    // Extract date strings and sort them
    const sortedDates = [...selectedDates]
      .map(date => typeof date === 'object' && date.date ? date.date : date)
      .sort();
    
    // Group consecutive dates into ranges  
    const dateRanges = [];
    let currentRange = null;
    
    sortedDates.forEach(date => {
      if (!currentRange) {
        currentRange = { from: date, to: date };
      } else if (isConsecutiveDate(currentRange.to, date)) {
        currentRange.to = date;
      } else {
        dateRanges.push(currentRange);
        currentRange = { from: date, to: date };
      }
    });
    
    if (currentRange) {
      dateRanges.push(currentRange);
    }
    
    return dateRanges;
  };

  // Check if two dates are consecutive
  const isConsecutiveDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setDate(d1.getDate() + 1);
    return formatDate(d1) === date2;
  };

  // Handle save action
  const handleSaveClick = async () => {
    const available_dates = formatSelectedDates();
    
    try {
      if (handleSave) {
        const result = await handleSave({ available_dates });
        
        if (result && result.success) {
          const newDisplayDates = [];
          available_dates.forEach(range => {
            const datesInRange = generateDatesInRange(range.from, range.to);
            newDisplayDates.push(...datesInRange);
          });
          setDisplayDates(newDisplayDates);
          
          await dispatch(editInterviewById(id));
          
          setIsEditMode(false);
          resetSelection();
        }
      }
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  // Handle edit mode toggle
  const handleEditClick = () => {
    setIsEditMode(true);
    if (displayDates.length > 0) {
      setRangeStart(displayDates[0].date);
      setRangeEnd(displayDates[displayDates.length - 1].date);
    }
  };

  // Handle cancel action
  const handleCancelClick = () => {
    setIsEditMode(false);
    resetSelection();
  };

  // Reset range selection
  const resetSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelecting(false);
    if (handleDateClick) {
      handleDateClick([]);
    }
  };

  // Calendar component for single month
  const SingleCalendar = ({ year, month, monthOffset = 0 }) => {
    const calendarDays = generateCalendarDays(year, month);
    const weeks = [];
    
    // Create weeks array
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    // Check if date is today
    const isToday = (day) => {
      if (day === null) return false;
      const today = new Date();
      const dateToCheck = new Date(year, month, day);
      return dateToCheck.toDateString() === today.toDateString();
    };

    // ✅ التعديل 3: إضافة styling للتواريخ الـ disabled
    const getDateCellStyle = (day) => {
      if (day === null) return 'invisible';
      
      const dateYear = year;
      const dateMonth = month;
      const dateStr = formatDate(createDate(dateYear, dateMonth, day));
      
      // Check if date is disabled
      const disabled = isDateDisabled(dateStr);
      
      let baseStyle = '';
      
      if (disabled) {
        baseStyle = 'bg-gray-100 text-gray-400 cursor-not-allowed line-through';
      } else if (isRangeStart(day, dateMonth, dateYear)) {
        baseStyle = availabilityMode === 'available' ? 
          'bg-blue-600 text-white rounded-l-full' : 
          'bg-red-600 text-white rounded-l-full';
      } else if (isRangeEnd(day, dateMonth, dateYear)) {
        baseStyle = availabilityMode === 'available' ? 
          'bg-blue-600 text-white rounded-r-full' : 
          'bg-red-600 text-white rounded-r-full';
      } else if (isInSelectedRange(day, dateMonth, dateYear)) {
        baseStyle = availabilityMode === 'available' ? 
          'bg-blue-100 text-blue-900' : 
          'bg-red-100 text-red-900';
      } else if (selecting && rangeStart === getDateString(day, monthOffset)) {
        baseStyle = availabilityMode === 'available' ? 
          'bg-blue-600 text-white rounded-full' : 
          'bg-red-600 text-white rounded-full';
      } else if (isToday(day)) {
        baseStyle = 'bg-blue-500 text-white rounded-full font-semibold';
      } else {
        baseStyle = isEditMode ? 'hover:bg-gray-100' : '';
      }
      
      // Add blur effect if not in edit mode
      if (!isEditMode && !disabled) {
        baseStyle += ' opacity-50 cursor-not-allowed';
      }
      
      return baseStyle;
    };

    return (
      <div className="flex-1">
        <div className="text-center mb-3">
          <div className="font-medium text-sm">{`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`}</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center font-medium text-gray-500 text-xs h-6 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>

        {/* ✅ التعديل 4: إضافة disabled state للأزرار وtooltip */}
        <div className={`grid grid-cols-7 gap-0 ${!isEditMode ? 'pointer-events-none' : ''}`}>
          {weeks.map((week, weekIndex) => (
            week.map((day, dayIndex) => {
              const dateStr = day !== null ? formatDate(createDate(year, month, day)) : null;
              const disabled = dateStr ? isDateDisabled(dateStr) : true;
              
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`h-8 flex items-center justify-center relative ${day === null ? 'invisible' : ''}`}
                >
                  <button
                    onClick={() => day !== null && !disabled && handleDateSelect(day, monthOffset)}
                    className={`h-8 w-8 flex items-center justify-center text-xs ${getDateCellStyle(day)}`}
                    disabled={day === null || !isEditMode || disabled}
                    title={disabled && day !== null ? 'Date outside workspace availability' : ''}
                  >
                    {day}
                  </button>
                </div>
              );
            })
          ))}
        </div>
      </div>
    );
  };

  // Double calendar component
  const Calendar = ({ year, month }) => {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={isEditMode ? goToPreviousMonth : undefined} 
            className={`p-1 rounded-full ${isEditMode ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!isEditMode}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex space-x-8 flex-1 justify-center">
            <SingleCalendar year={year} month={month} monthOffset={0} />
            <SingleCalendar year={nextYear} month={nextMonth} monthOffset={1} />
          </div>
          <button 
            onClick={isEditMode ? goToNextMonth : undefined} 
            className={`p-1 rounded-full ${isEditMode ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!isEditMode}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {!isEditMode && (
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {availabilityMode === 'available' ? 'Available Dates' : 'Unavailable Dates'}
            </h2>
            <p className="text-gray-500">
              {availabilityMode === 'available' ? 
                'Select a range of available dates' : 
                'Select a range of unavailable dates'
              }
            </p>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={handleEditClick}
              className={`px-4 py-2 text-white rounded-md shadow-sm flex items-center ${
                availabilityMode === 'available' ? 
                'bg-blue-600 hover:bg-blue-700' : 
                'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Edit size={16} className="mr-2" />
              <span className='text-sm'>Edit</span>
              
            </button>
          </div>
        </div>
      )}

      {/* Show action buttons only when in edit mode */}
      {isEditMode && (
        <div className="space-x-3 flex justify-end mb-6">
          <div className="space-x-2 flex gap-3">
            <button
              onClick={handleCancelClick}
              className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <span className='text-sm'>Cancel</span>
              
            </button>
            <button
              onClick={handleSaveClick}
              className={`px-4 py-1 text-white rounded-md shadow-sm flex items-center ${
                availabilityMode === 'available' ? 
                'bg-blue-600 hover:bg-blue-700' : 
                'bg-red-600 hover:bg-red-700'
              }`}
              //  disabled={!rangeStart}
            >
              <Send size={16} className="mr-2" />
              <span className='text-sm'>Save</span>
               
            </button>
          </div>
        </div>
      )}

      <div className="border rounded-lg p-4 mb-6">
        {isEditMode && (
          <div className="text-gray-600 mb-2 text-sm">
            {selecting ? 'Select range end date' : 'Select range start date'}
          </div>
        )}
        
        <Calendar 
          year={currentMonth.getFullYear()} 
          month={currentMonth.getMonth()} 
        />
        
        {/* عرض النطاق الحالي */}
        {((isEditMode && (rangeStart || rangeEnd)) || (!isEditMode && displayDates.length > 0)) && (
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <input
                type="text"
                value={isEditMode ? 
                  (rangeStart ? new Date(rangeStart).toLocaleDateString('en-CA') : '') :
                  (displayDates.length > 0 ? displayDates[0].date : '')
                }
                readOnly
                className="px-2 py-1 border rounded text-xs w-24"
                placeholder="Start date"
              />
              <span className="text-xs text-gray-500 flex items-center">to</span>
              <input
                type="text"
                value={isEditMode ? 
                  (rangeEnd ? new Date(rangeEnd).toLocaleDateString('en-CA') : '') :
                  (displayDates.length > 0 ? displayDates[displayDates.length - 1].date : '')
                }
                readOnly
                className="px-2 py-1 border rounded text-xs w-24"
                placeholder="End date"
              />
            </div>
            {isEditMode && (
              <button
                onClick={resetSelection}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-gray-600 text-sm">
          {isEditMode ? (
            rangeStart && rangeEnd ? 
              `Selected range from ${new Date(rangeStart).toLocaleDateString()} to ${new Date(rangeEnd).toLocaleDateString()}` : 
              'No date range selected'
          ) : (
            displayDates.length > 0 ? 
              `${availabilityMode === 'available' ? 'Available' : 'Unavailable'} from ${new Date(displayDates[0].date).toLocaleDateString()} to ${new Date(displayDates[displayDates.length - 1].date).toLocaleDateString()}` : 
              `No ${availabilityMode} dates set`
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;