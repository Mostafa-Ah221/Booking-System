import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const DateTimeSelector = ({ 
  selectedInterview, 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [disabledTimes, setDisabledTimes] = useState([]);
  const [restTimes, setRestTimes] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const formatDateToYMD = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getDayId = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
  };

  const isTimeDisabled = (date, time, disabledTimes = []) => {
    if (!date || !time || !disabledTimes || !Array.isArray(disabledTimes)) {
      return false;
    }
    
    try {
      const formattedDate = formatDateToYMD(date);
      return disabledTimes.some(disabledTime => {
        if (!disabledTime || !disabledTime.date || !disabledTime.time) {
          return false;
        }
        
        const disabledDate = formatDateToYMD(disabledTime.date);
        const disabledTimeFormatted = disabledTime.time.slice(0, 5);
        
        return disabledDate === formattedDate && disabledTimeFormatted === time;
      });
    } catch (error) {
      console.error('Error in isTimeDisabled:', error);
      return false;
    }
  };

  // التحقق إذا كان التاريخ ضمن النطاق غير المتاح - مع دعم to: null (نفس CalendarModal)
  const isDateInUnavailableDatesRange = (date) => {
    if (!date || !unavailableDates || unavailableDates.length === 0) {
      return false;
    }
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
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

        // إذا كان to هو null، يبقى التاريخ غير متاح إلى ما لا نهاية
        if (dateRange.to === null || dateRange.to === undefined) {
          return checkDate >= fromDate;
        }

        // إذا كان to موجود، نتعامل معه بالطريقة العادية
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

  // التحقق إذا كان الوقت غير متاح - مع دعم to: null
  const isTimeUnavailable = (date, time) => {
    if (!date || !time || !unavailableTimes || !Array.isArray(unavailableTimes)) {
      return false;
    }
    
    if (isDateInUnavailableDatesRange(date)) {
      return true;
    }
    
    const dayId = getDayId(date);
    const dayUnavailableTimes = unavailableTimes.filter(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );
    
    if (dayUnavailableTimes.length === 0) {
      return false;
    }
    
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const checkTimeMinutes = timeToMinutes(time);
    
    return dayUnavailableTimes.some(dayUnavailableTime => {
      if (!dayUnavailableTime || !dayUnavailableTime.from) {
        return false;
      }
      
      const fromMinutes = timeToMinutes(dayUnavailableTime.from.slice(0, 5));
      
      // لو to هو null يبقى من الوقت ده لآخر اليوم غير متاح
      if (!dayUnavailableTime.to || dayUnavailableTime.to === null) {
        return checkTimeMinutes >= fromMinutes;
      }
      
      const toMinutes = timeToMinutes(dayUnavailableTime.to.slice(0, 5));
      
      return checkTimeMinutes >= fromMinutes && checkTimeMinutes <= toMinutes;
    });
  };

  // التحقق إذا كان اليوم موجوداً في availableTimes (مرجع قديم)
  const isDayAvailableInTimes = (date, availableTimesData) => {
    if (!date || !availableTimesData || !Array.isArray(availableTimesData)) {
      return false;
    }
    
    const dayId = getDayId(date);
    return availableTimesData.some(time => time.day_id.toString() === dayId.toString());
  };

  // التحقق إذا كان التاريخ ضمن النطاق المتاح - مع دعم to: null (محسن لمعالجة أفضل للتواريخ)
  const isDateInAvailableRange = (date, availableDatesRanges) => {
    if (!date || !availableDatesRanges || availableDatesRanges.length === 0) {
      return false;
    }
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return availableDatesRanges.some(dateRange => {
      try {
        if (!dateRange || !dateRange.from) {
          return false;
        }

        // معالجة تاريخ البداية - أخذ الجزء الخاص بالتاريخ فقط
        let fromDateStr = dateRange.from;
        if (fromDateStr.includes(' ')) {
          fromDateStr = fromDateStr.split(' ')[0];
        }
        
        // إنشاء تاريخ البداية
        const fromDate = new Date(fromDateStr);
        fromDate.setHours(0, 0, 0, 0);
        
        if (isNaN(fromDate.getTime())) {
          console.warn('Invalid from date:', dateRange.from);
          return false;
        }

        // إذا كان to هو null، يبقى من التاريخ ده لآخر الحياة متاح
        if (dateRange.to === null || dateRange.to === undefined) {
          return checkDate >= fromDate;
        }
        
        // معالجة تاريخ النهاية
        let toDateStr = dateRange.to;
        if (toDateStr.includes(' ')) {
          toDateStr = toDateStr.split(' ')[0];
        }
        
        const toDate = new Date(toDateStr);
        toDate.setHours(23, 59, 59, 999);
        
        if (isNaN(toDate.getTime())) {
          console.warn('Invalid to date:', dateRange.to);
          return false;
        }

        return checkDate >= fromDate && checkDate <= toDate;
      } catch (error) {
        console.error('Error in isDateInAvailableRange:', error, dateRange);
        return false;
      }
    });
  };

  // حساب الأوقات المتاحة الفعلية (نفس منطق CalendarModal)
  const calculateEffectiveAvailableTimes = (selectedDate, availableTimesData, disabledTimes, interviewData) => {
    if (!selectedDate || !availableTimesData || !Array.isArray(availableTimesData)) {
      return [];
    }

    const dayId = getDayId(selectedDate);
    const dayAvailableTimes = availableTimesData.filter(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );

    if (dayAvailableTimes.length === 0) {
      return [];
    }

    const dayUnavailableTimes = unavailableTimes.filter(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );

    const timeToMinutes = (timeStr) => {
      if (!timeStr || !timeStr.includes(':')) return 0;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const availableRanges = [];
    
    dayAvailableTimes.forEach((availableRange) => {
      if (!availableRange || !availableRange.from) return;
      
      const availableFromMinutes = timeToMinutes(availableRange.from);
      let availableToMinutes;

      // لو to هو null يبقى آخر اليوم (23:59)
      if (!availableRange.to || availableRange.to === null) {
        availableToMinutes = 23 * 60 + 59;
      } else {
        availableToMinutes = timeToMinutes(availableRange.to);
      }
      
      let currentRanges = [{ from: availableFromMinutes, to: availableToMinutes }];
      
      // طرح الأوقات غير المتاحة من الأوقات المتاحة
      dayUnavailableTimes.forEach((unavailableRange) => {
        if (!unavailableRange || !unavailableRange.from) return;
        
        const unavailableFromMinutes = timeToMinutes(unavailableRange.from.slice(0, 5));
        let unavailableToMinutes;

        // لو to هو null يبقى آخر اليوم
        if (!unavailableRange.to || unavailableRange.to === null) {
          unavailableToMinutes = 23 * 60 + 59;
        } else {
          unavailableToMinutes = timeToMinutes(unavailableRange.to.slice(0, 5));
        }
        
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
      
      availableRanges.push(...currentRanges);
    });

    // توليد الفترات الزمنية من النطاقات المتاحة
    const effectiveTimeSlots = [];
    let durationCycle = 15;
    let durationPeriod = "minutes";
    let restCycle = 0;
    
    if (interviewData) {
      durationCycle = parseInt(interviewData.duration_cycle) || 15;
      durationPeriod = interviewData.duration_period || "minutes";
      restCycle = parseInt(interviewData.rest_cycle) || 0;
    }
    
    const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
    const totalSlotDuration = durationInMinutes + restCycle;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    const isToday = selectedDateObj.getTime() === today.getTime();
    const nowMinutes = isToday ? (new Date().getHours() * 60 + new Date().getMinutes()) : -1;
    
    availableRanges.forEach((range) => {
      const startMinutes = range.from;
      const endMinutes = range.to;
      
      for (let currentMinutes = startMinutes; currentMinutes + durationInMinutes <= endMinutes; currentMinutes += totalSlotDuration) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const dateISO = selectedDateObj.toISOString().split('T')[0];
        const isDisabled = disabledTimes && disabledTimes.some(disabledTime => {
          if (!disabledTime || !disabledTime.date || !disabledTime.time) return false;
          const disabledDate = disabledTime.date;
          const disabledTimeFormatted = disabledTime.time.slice(0, 5);
          return disabledDate === dateISO && disabledTimeFormatted === formattedTime;
        });
        
        let isPast = false;
        if (isToday) {
          const slotTimeMinutes = hours * 60 + minutes;
          isPast = slotTimeMinutes < nowMinutes;
        }
        
        if (!isDisabled && !isPast) {
          effectiveTimeSlots.push(formattedTime);
        }
      }
    });

    return [...new Set(effectiveTimeSlots)].sort();
  };

  // توليد الفترات الزمنية المتاحة مع إضافة rest_cycle
  const generateTimeSlots = (
    availableTimes,
    selectedDate = null,
    disabledTimes = [],
    interviewData = null,
    filterPastTimes = true
  ) => {
    if (!availableTimes || !Array.isArray(availableTimes) || !selectedDate) {
      return [];
    }

    const timeSlots = [];
    
    let durationCycle = 15;
    let durationPeriod = "minutes";
    let restCycle = 0; // فترة الراحة بين المواعيد
    
    if (interviewData) {
      durationCycle = parseInt(interviewData.duration_cycle) || 15;
      durationPeriod = interviewData.duration_period || "minutes";
      restCycle = parseInt(interviewData.rest_cycle) || 0;
    }
    
    const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
    const totalSlotDuration = durationInMinutes + restCycle; // المدة الكلية شاملة الراحة

    const dayId = getDayId(selectedDate);

    const dayTimes = availableTimes.filter(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );

    if (dayTimes.length === 0) {
      return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    const isToday = selectedDateObj.getTime() === today.getTime();
    
    const nowMinutes = (filterPastTimes && isToday) ? 
      (new Date().getHours() * 60 + new Date().getMinutes()) : -1;

    dayTimes.forEach((timeRange) => {
      if (!timeRange || !timeRange.from) {
        return;
      }

      const [fromHour, fromMinute] = timeRange.from.split(":").map(Number);
      
      if (isNaN(fromHour) || isNaN(fromMinute)) {
        return;
      }

      const fromMinutes = fromHour * 60 + fromMinute;
      let toMinutes;

      // لو to هو null يبقى آخر اليوم (23:59)
      if (!timeRange.to || timeRange.to === null) {
        toMinutes = 23 * 60 + 59; // 23:59
      } else {
        const [toHour, toMinute] = timeRange.to.split(":").map(Number);
        if (isNaN(toHour) || isNaN(toMinute)) {
          return;
        }
        toMinutes = toHour * 60 + toMinute;
      }

      for (let minutes = fromMinutes; minutes + durationInMinutes <= toMinutes; minutes += totalSlotDuration) {
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        const formattedTime = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;

        const currentMinutes = hour * 60 + min;

        const isDisabled = isTimeDisabled(selectedDate, formattedTime, disabledTimes);
        const isUnavailable = isTimeUnavailable(selectedDate, formattedTime);
        const isPast = filterPastTimes && isToday && currentMinutes <= nowMinutes;

        if (!isDisabled && !isUnavailable && !isPast) {
          timeSlots.push({ time: formattedTime });
        }
      }
    });

    const uniqueSlots = [...new Set(timeSlots.map((slot) => slot.time))]
      .sort()
      .map((time) => ({ time }));

    return uniqueSlots;
  };

  // الحصول على أول وقت متاح

  // التحقق إذا كان التاريخ متاحًا بشكل كامل (نفس منطق CalendarModal)
  const isDateAvailable = (date, availableDatesRanges = availableDates, availableTimesData = availableTimes) => {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // 1. التحقق إذا كان التاريخ في الماضي (اليوم الحالي مسموح)
    if (checkDate < today) {
      return false;
    }

    // 2. التحقق إذا كان التاريخ ضمن النطاق المتاح
    const isInDateRange = isDateInAvailableRange(checkDate, availableDatesRanges);
    if (!isInDateRange) {
      return false;
    }

    // 3. التحقق إذا كان اليوم له أوقات متاحة في availableTimes
    const dayOfWeek = checkDate.getDay();
    const dayId = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
    const hasTimesForDay = availableTimesData.some(time => time.day_id.toString() === dayId.toString());
    
    if (!hasTimesForDay) {
      return false;
    }

    // 4. حساب الأوقات المتاحة الفعلية
    const effectiveAvailableTimes = calculateEffectiveAvailableTimes(date, availableTimesData, disabledTimes, interviewDetails);
    
    return effectiveAvailableTimes.length > 0;
  };

  // جلب تفاصيل المقابلة من API
  const fetchInterviewDetails = async (shareLink) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://backend-booking.appointroll.com/api/public/interview/${shareLink}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const interviewData = data?.data?.interview;
      console.log(interviewData);

      if (interviewData) {
        setInterviewDetails(interviewData);
        setAvailableDates(interviewData.available_dates || []);
        setAvailableTimes(interviewData.available_times || []);
        setUnavailableDates(interviewData.un_available_dates || []);
        setUnavailableTimes(interviewData.un_available_times || []);
        setDisabledTimes(interviewData.disabled_times || []);
        setRestTimes(interviewData.rest_cycle || 0);
      
        if (interviewData.available_dates && interviewData.available_dates.length > 0) {
          for (const dateRange of interviewData.available_dates) {
            if (!dateRange || !dateRange.from) continue;
            
            try {
              const fromDate = new Date(dateRange.from);
              if (isNaN(fromDate.getTime())) {
                continue;
              }
              
              if (isDateAvailable(fromDate, interviewData.available_dates, interviewData.available_times)) {
                const availableTimeSlots = generateTimeSlots(
                  interviewData.available_times || [],
                  fromDate,
                  interviewData.disabled_times || [],
                  interviewData,
                  true
                );
                
                const firstAvailableTime = getFirstAvailableTime(fromDate, availableTimeSlots);
                
                if (firstAvailableTime) {
                  onDateSelect(fromDate);
                  onTimeSelect(firstAvailableTime);
                  break;
                }
              }
            } catch (err) {
              console.warn('Error processing date:', dateRange.from, err);
              continue;
            }
          }
        }
      } 

    } catch (error) {
      setError(`${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedInterview) {
      onDateSelect(null);
      onTimeSelect(null);
      setShowTimeSlots(false);
      setError(null);
      setInterviewDetails(null);
      fetchInterviewDetails(selectedInterview.share_link);
    }
  }, [selectedInterview]);

  useEffect(() => {
    if (selectedDate && availableTimes.length > 0 && interviewDetails) {
      const availableTimeSlots = generateTimeSlots(
        availableTimes,
        selectedDate,
        disabledTimes,
        interviewDetails,
        true 
      );

      if (selectedTime && availableTimeSlots.length > 0 && !availableTimeSlots.some(slot => slot.time === selectedTime)) {
        const firstAvailable = getFirstAvailableTime(selectedDate, availableTimeSlots);
        onTimeSelect(firstAvailable);
      }
    }
  }, [selectedDate, disabledTimes, availableTimes, interviewDetails]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateAvailable(selected)) {
      onDateSelect(selected);
      
      const availableTimeSlots = generateTimeSlots(
        availableTimes,
        selected,
        disabledTimes,
        interviewDetails,
        true 
      );
      
      const firstAvailable = getFirstAvailableTime(selected, availableTimeSlots);
      onTimeSelect(firstAvailable);
      setShowTimeSlots(true);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !interviewDetails) return [];
    
    // استخدام الطريقة الجديدة لحساب الأوقات المتاحة الفعلية
    const effectiveTimeSlots = calculateEffectiveAvailableTimes(
      selectedDate, 
      availableTimes, 
      disabledTimes, 
      interviewDetails
    );
    
    // تحويل الأوقات لصيغة العرض
    return effectiveTimeSlots.map(timeStr => {
      const [hour, min] = timeStr.split(':').map(Number);
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'pm' : 'am';
      const displayTime = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
      
      return { value: timeStr, display: displayTime };
    });
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return `${String(selectedDate.getDate()).padStart(2, '0')}-${monthNames[selectedDate.getMonth()]}-${selectedDate.getFullYear()}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      dayDate.setHours(0, 0, 0, 0);
      
      const isAvailable = isDateAvailable(dayDate);
      const isToday = today.toDateString() === dayDate.toDateString();
      // إزالة شرط isPastDate اللي كان بيمنع اليوم الحالي - خلي التحقق في isDateAvailable بس
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={!isAvailable}
          className={`p-2 w-10 h-10 text-sm rounded-lg transition-colors ${
            isToday ? 'border-2 border-blue-500' : ''
          } ${
            selectedDate && selectedDate.toDateString() === dayDate.toDateString() 
              ? 'bg-blue-600 text-white' 
              : !isAvailable
                ? 'text-gray-300 cursor-not-allowed bg-gray-100'
                : 'text-gray-800 hover:bg-gray-100 cursor-pointer'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Date & Time</h3>
      
      {interviewDetails && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            ⏱️ Slot Duration: {interviewDetails.duration_cycle} {interviewDetails.duration_period}
            {interviewDetails.rest_cycle && interviewDetails.rest_cycle > 0 && (
              <span className="ml-2">| Rest Time: {interviewDetails.rest_cycle} minutes</span>
            )}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mb-6 text-center py-4">
          <p className="text-sm text-gray-500">Loading availability...</p>
        </div>
      )}

      {!isLoading && (
        <>
          <button
            onClick={() => setShowTimeSlots(!showTimeSlots)}
            className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm">
                {selectedDate && selectedTime 
                  ? `${formatSelectedDate()} | ${getAvailableTimeSlots().find(slot => slot.value === selectedTime)?.display || selectedTime}` 
                  : 'Select date and time'
                }
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform ${showTimeSlots ? 'rotate-180' : ''}`} 
            />
          </button>

          {showTimeSlots && (
            <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-2 justify-between">
              <div className='w-2/3'>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-medium">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>

                {availableDates.length > 0 ? (
                  <div className="grid grid-cols-7 gap-1 mt-4">
                    {renderCalendar()}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm mt-4">Loading available dates...</div>
                )}
              </div>
              
              <div className='w-1/3'>
                {selectedDate && getAvailableTimeSlots().length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Available Slots</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {getAvailableTimeSlots().map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => onTimeSelect(slot.value)}
                          className={`w-full p-2 text-sm border rounded-lg text-center transition-colors ${
                            selectedTime === slot.value
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {slot.display}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && getAvailableTimeSlots().length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">No available slots for this date</p>
                    <p className="text-xs text-gray-400">
                      {(() => {
                        const dayId = getDayId(selectedDate);
                        const hasTimes = availableTimes.some(time => time.day_id.toString() === dayId.toString());
                        
                        if (!hasTimes) {
                          return "This day is not available in working hours";
                        } else if (isDateInUnavailableDatesRange(selectedDate)) {
                          return "This date is in an unavailable range";
                        } else {
                          return "All time slots are either booked or in unavailable periods";
                        }
                      })()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DateTimeSelector;