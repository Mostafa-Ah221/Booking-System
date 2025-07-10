import { useState, useEffect } from 'react';
import {  ChevronLeft, ChevronRight } from 'lucide-react';

// Calendar Component
const CalendarModal = ({ 
  show, 
  onClose, 
  selectedDate, 
  onDateSelect, 
  availableDates = [],
  disabledTimes = [],
  availableTimes = [],
  availableTimesFromAPI = []
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

  // دالة للحصول على أرقام الأيام المتاحة من البيانات
  const getAvailableDayNumbers = () => {
    if (!availableTimesFromAPI || !Array.isArray(availableTimesFromAPI)) {
      return [];
    }
    
    // تحويل day_id إلى day number في JavaScript
    const dayMapping = {
      1: 0, // Sunday
      2: 1, // Monday  
      3: 2, // Tuesday
      4: 3, // Wednesday
      5: 4, // Thursday
      6: 5, // Friday
      7: 6  // Saturday
    };
    
    return availableTimesFromAPI.map(timeRange => dayMapping[timeRange.day_id]).filter(day => day !== undefined);
  };

  // دالة للعثور على أول شهر يحتوي على حجوزات متاحة
  const findFirstAvailableMonth = () => {
    if (!availableDates || availableDates.length === 0) {
      return { month: new Date().getMonth(), year: new Date().getFullYear() };
    }

    let earliestDate = null;

    // العثور على أقرب تاريخ متاح
    availableDates.forEach(dateRange => {
      try {
        const fromDate = new Date(dateRange.from);
        if (!isNaN(fromDate.getTime())) {
          if (!earliestDate || fromDate < earliestDate) {
            earliestDate = fromDate;
          }
        }
      } catch (error) {
        console.warn('Error parsing date range:', dateRange, error);
      }
    });

    if (earliestDate) {
      // البحث عن أول يوم متاح فعلياً في ذلك الشهر
      const startMonth = earliestDate.getMonth();
      const startYear = earliestDate.getFullYear();
      
      // فحص الشهر الحالي وما بعده
      for (let yearOffset = 0; yearOffset < 2; yearOffset++) {
        for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
          const checkYear = startYear + yearOffset;
          const checkMonth = (startMonth + monthOffset) % 12;
          
          // التحقق من وجود أيام متاحة في هذا الشهر
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

  // useEffect لتحديد الشهر الافتراضي عند فتح التقويم
  useEffect(() => {
    if (show && availableDates.length > 0) {
      const { month, year } = findFirstAvailableMonth();
      setCurrentMonth(month);
      setCurrentYear(year);
    }
  }, [show, availableDates]);

  // دالة لفحص إذا كان الوقت محجوز أم لا
  const isTimeDisabled = (date, time, disabledTimes) => {
    if (!disabledTimes || !Array.isArray(disabledTimes)) return false;
    
    try {
      // تحويل التاريخ المحدد إلى نفس الصيغة المستخدمة في disabled_times
      const dateObj = parseFormattedDate(date);
      if (!dateObj) return false;
      
      // تحويل التاريخ إلى صيغة YYYY-MM-DD بطريقة صحيحة
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // +1 لأن الشهور تبدأ من 0
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      // فحص إذا كان هناك وقت محجوز في نفس التاريخ والوقت
      return disabledTimes.some(disabledTime => {
        if (!disabledTime || !disabledTime.date || !disabledTime.time) return false;
        const disabledDate = disabledTime.date;
        const disabledTimeFormatted = disabledTime.time.slice(0, 5); // أخذ أول 5 أحرف (HH:MM)
        
        return disabledDate === formattedDate && disabledTimeFormatted === time;
      });
    } catch (error) {
      console.error('Error in isTimeDisabled:', error);
      return false;
    }
  };

  // دالة لفحص إذا كان التاريخ يحتوي على أوقات متاحة
  const hasAvailableTimes = (date, availableTimes, disabledTimes) => {
    if (!availableTimes || !Array.isArray(availableTimes)) return false;
    
    // فحص إذا كان هناك على الأقل وقت واحد متاح في هذا التاريخ
    return availableTimes.some(timeSlot => 
      !isTimeDisabled(date, timeSlot.time, disabledTimes)
    );
  };

  // دالة محسنة لتحويل التاريخ إلى الصيغة المطلوبة "DD MMM YYYY"
  const formatDateString = (day, month, year) => {
    const dayFormatted = day.toString().padStart(2, '0');
    const monthFormatted = monthAbbreviations[month];
    return `${dayFormatted} ${monthFormatted} ${year}`;
  };

  const parseFormattedDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return null;
    
    try {
      const parts = dateString.split(' ');
      if (parts.length !== 3) return null;
      
      const day = parseInt(parts[0]);
      const monthIndex = monthAbbreviations.indexOf(parts[1]);
      const year = parseInt(parts[2]);
      
      if (isNaN(day) || monthIndex === -1 || isNaN(year)) return null;
      
      return new Date(Date.UTC(year, monthIndex, day));
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return null;
    }
  };

  const isDateAvailable = (day, month, year) => {
    const checkDate = new Date(Date.UTC(year, month, day));
    
    // 0. التحقق من أن التاريخ ليس في الماضي
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    if (checkDate < todayUTC) return false;
    
    // 1. التحقق من أن التاريخ ضمن النطاق المتاح
    const isInDateRange = availableDates.some(dateRange => {
      try {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return checkDate >= fromDate && checkDate <= toDate;
      } catch (error) {
        console.warn('Error parsing date range:', dateRange, error);
        return false;
      }
    });
    
    if (!isInDateRange) return false;
  
    // 2. التحقق من أن اليوم متاح حسب البيانات من API
    const dayOfWeek = checkDate.getUTCDay(); // 0 لأحد، 1 لإثنين، إلخ
    const availableDayNumbers = getAvailableDayNumbers();
    const isAvailableDay = availableDayNumbers.includes(dayOfWeek);
  
    if (!isAvailableDay) return false;
  
    // 3. التحقق من وجود أوقات متاحة في هذا اليوم
    const dateString = formatDateString(day, month, year);
    return hasAvailableTimes(dateString, availableTimes, disabledTimes);
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
      
      const today = new Date();
      const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      const currentDateUTC = new Date(Date.UTC(currentYear, currentMonth, day));
      const isToday = todayUTC.getTime() === currentDateUTC.getTime();
      
      days.push(
        <button
          key={day}
          disabled={!isAvailable}
          className={`w-10 h-10 text-sm font-medium rounded cursor-pointer transition-colors ${
            !isAvailable 
              ? 'text-gray-300 cursor-not-allowed' 
              : isSelected 
                ? 'bg-gray-800 text-white' 
                : isToday 
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-400 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            if (isAvailable) {
              console.log('Selected date string:', dateString);
              console.log('Day:', day, 'Month:', currentMonth, 'Year:', currentYear);
              
              // التأكد من أن التاريخ صحيح قبل الإرسال
              const testDate = parseFormattedDate(dateString);
              if (testDate) {
                console.log('Parsed date check:', testDate.getUTCDate(), testDate.getUTCMonth(), testDate.getUTCFullYear());
                console.log('Original values:', day, currentMonth, currentYear);
              }
              
              onDateSelect(dateString);
              onClose();
            }
          }}
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

  // دالة محسنة لزر Today
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