import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { reschedulePublic,getAppointmentByIdPublic } from '../../redux/apiCalls/AppointmentCallApi';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TimezoneSelect from 'react-timezone-select';

const RescheduleSidebar = ({ 
  isOpen, 
  onClose, 
  appointmentData,
  outShareId,
  onRescheduleSuccess
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [error, setError] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [disabledTimes, setDisabledTimes] = useState([]);
  const [appointmentApi, setAppointmentApi] = useState(null);
   const [restTimes, setRestTimes] = useState();
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  
  
console.log(appointmentData);

  const idAppointment = appointmentData?.id;
  const { id: shareId } = useParams();
  const finalShareId = shareId || outShareId;
  

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Helper functions from DateTimeSelector
  const formatDateToYMD = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getDayId = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? 1 : dayOfWeek + 1; 
  };

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
        const fromDate = new Date(fromDateStr);
        fromDate.setHours(0, 0, 0, 0);
        
        if (isNaN(fromDate.getTime())) {
          return false;
        }

        // If to is null, date remains unavailable indefinitely
        if (dateRange.to === null || dateRange.to === undefined) {
          return checkDate >= fromDate;
        }

        // If to exists, handle it normally
        let toDateStr = dateRange.to.includes(' ') ? dateRange.to.split(' ')[0] : dateRange.to;
        const toDate = new Date(toDateStr);
        toDate.setHours(23, 59, 59, 999);

        if (isNaN(toDate.getTime())) {
          return false;
        }

        return checkDate >= fromDate && checkDate <= toDate;
      } catch (error) {
        return false;
      }
    });
  };

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
      
      const fromMinutes = timeToMinutes(dayUnavailableTime.from);
      
      // If to is null, from this time to end of day is unavailable
      if (!dayUnavailableTime.to || dayUnavailableTime.to === null) {
        return checkTimeMinutes >= fromMinutes;
      }
      
      const toMinutes = timeToMinutes(dayUnavailableTime.to);
      
      return checkTimeMinutes >= fromMinutes && checkTimeMinutes <= toMinutes;
    });
  };

  // Check if date is in available range with support for to: null
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

        let fromDateStr = dateRange.from;
        if (fromDateStr.includes(' ')) {
          fromDateStr = fromDateStr.split(' ')[0];
        }
        
        const fromDate = new Date(fromDateStr);
        fromDate.setHours(0, 0, 0, 0);
        
        if (isNaN(fromDate.getTime())) {
          console.warn('Invalid from date:', dateRange.from);
          return false;
        }

        // If to is null, range is open-ended
        if (dateRange.to === null || dateRange.to === undefined) {
          return checkDate >= fromDate;
        }
        
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

  // Calculate effective available times (similar to DateTimeSelector)
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

      // If to is null, end of day (23:59)
      if (!availableRange.to || availableRange.to === null) {
        availableToMinutes = 23 * 60 + 59;
      } else {
        availableToMinutes = timeToMinutes(availableRange.to);
      }
      
      let currentRanges = [{ from: availableFromMinutes, to: availableToMinutes }];
      
      // Subtract unavailable times from available times
      dayUnavailableTimes.forEach((unavailableRange) => {
        if (!unavailableRange || !unavailableRange.from) return;
        
        const unavailableFromMinutes = timeToMinutes(unavailableRange.from);
        let unavailableToMinutes;

        // If to is null, end of day
        if (!unavailableRange.to || unavailableRange.to === null) {
          unavailableToMinutes = 23 * 60 + 59;
        } else {
          unavailableToMinutes = timeToMinutes(unavailableRange.to);
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

    // Generate time slots from available ranges
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
        
        const dateISO = formatDateToYMD(selectedDateObj);
        const isDisabled = disabledTimes && disabledTimes.some(disabledTime => {
          if (!disabledTime || !disabledTime.date || !disabledTime.time) return false;
          const disabledDate = disabledTime.date;
          const disabledTimeFormatted = disabledTime.time.substring(0, 5);
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

  
// Check if date is available with new logic
const isDateAvailable = (date, interview = interviewDetails) => {
  if (!date || !interview) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  // Check if date is in the past
  if (checkDate < today) {
    return false;
  }

  const dayId = getDayId(checkDate);

  // PRIORITY 1: Check unavailable_dates + unavailable_times
  const isInUnavailableRange = isDateInUnavailableDatesRange(checkDate);
  if (isInUnavailableRange) {
    const isDayInUnavailableTimes = unavailableTimes.some(
      time => time.day_id.toString() === dayId.toString()
    );
    if (isDayInUnavailableTimes) {
      return false;
    }
  }

  // PRIORITY 2: Check if date is in available range
  const isInDateRange = isDateInAvailableRange(checkDate, interview.available_dates);
  if (!isInDateRange) {
    return false;
  }

  // PRIORITY 3: Check if day has available times
  const hasTimesForDay = interview.available_times.some(time => time.day_id.toString() === dayId.toString());
  
  if (!hasTimesForDay) {
    return false;
  }

  // PRIORITY 4: Calculate effective available times
  const effectiveAvailableTimes = calculateEffectiveAvailableTimes(date, interview.available_times, interview.disabled_times || [], interview);
  
  return effectiveAvailableTimes.length > 0;
};

  // Generate time slots with rest_cycle support
  const generateTimeSlots = (date, interview) => {
    if (!date || !interview) return [];

    const effectiveTimeSlots = calculateEffectiveAvailableTimes(
      date, 
      interview.available_times, 
      interview.disabled_times || [], 
      interview
    );
    
    return effectiveTimeSlots.map(timeStr => {
      const [hour, min] = timeStr.split(':').map(Number);
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'pm' : 'am';
      const displayTime = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
      
      return {
        value: timeStr,
        display: displayTime
      };
    });
  };

 const fetchInterviewDetails = async (shareLink, staffResource = null) => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch(`https://backend-booking.appointroll.com/api/public/book/resource?interview_share_link=${shareLink}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const interview = data?.data?.interview;
    
    const useStaffResource = staffResource && 
          typeof staffResource === 'object' && 
          Object.keys(staffResource).length > 0;

    const dataSource = useStaffResource ? staffResource : interview;
    
    
     if (dataSource) {
  // ✅ دمج disabled_times من المصدرين
  const combinedDisabledTimes = [
    ...(interview?.disabled_times || []),
    ...(dataSource?.disabled_times || [])
  ];

  const mergedInterview = {
    ...interview,
    available_dates: dataSource.available_dates || [],
    available_times: dataSource.available_times || [],
    disabled_times: combinedDisabledTimes,
    un_available_dates: dataSource.un_available_dates || [],
    un_available_times: dataSource.un_available_times || []
  };
  
  setInterviewDetails(mergedInterview);
  setAvailableDates(dataSource.available_dates || []);
  setAvailableTimes(dataSource.available_times || []);
  setUnavailableDates(dataSource.un_available_dates || []);
  setUnavailableTimes(dataSource.un_available_times || []);
  setDisabledTimes(combinedDisabledTimes); 
  setRestTimes(interview?.rest_cycle || 0);

  if (dataSource.available_dates && dataSource.available_dates.length > 0) {
    const firstDate = new Date(dataSource.available_dates[0].from);
    setCurrentMonth(firstDate);
    
    setTimeout(() => {
      findFirstAvailableDateTime(mergedInterview);
    }, 100);
  }
}else {
      throw new Error("Interview data not available");
    }

  } catch (error) {
    setError(`Error loading interview details: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};


const findFirstAvailableDateTime = (interview) => {
  if (!interview.available_dates || interview.available_dates.length === 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // استخدم البيانات من interview مباشرة
  const tempUnavailableDates = interview.un_available_dates || [];
  const tempUnavailableTimes = interview.un_available_times || [];

  for (const dateRange of interview.available_dates) {
    if (!dateRange?.from) continue;
    
    try {
      const fromDate = new Date(dateRange.from.split(' ')[0]);
      const toDate = dateRange.to ? new Date(dateRange.to.split(' ')[0]) : new Date('2099-12-31');
      
      if (isNaN(fromDate.getTime())) continue;
      
      const currentDate = new Date(Math.max(fromDate.getTime(), today.getTime()));
      const endDate = new Date(toDate.getTime());
      
      while (currentDate <= endDate) {
        const dayId = getDayId(currentDate);
        
        // تحقق من unavailable مباشرة هنا
        const isInUnavailableRange = tempUnavailableDates.some(dr => {
          if (!dr?.from) return false;
          const fromDateCheck = new Date(dr.from.split(' ')[0]);
          fromDateCheck.setHours(0, 0, 0, 0);
          
          if (dr.to === null) {
            return currentDate >= fromDateCheck;
          }
          
          const toDateCheck = new Date(dr.to.split(' ')[0]);
          toDateCheck.setHours(23, 59, 59, 999);
          return currentDate >= fromDateCheck && currentDate <= toDateCheck;
        });
        
        // إذا كان في unavailable range، تحقق من اليوم
        if (isInUnavailableRange) {
          const isDayUnavailable = tempUnavailableTimes.some(
            time => time.day_id.toString() === dayId.toString()
          );
          
          if (isDayUnavailable) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue; // تخطى هذا اليوم
          }
        }
        
        // استخدم isDateAvailable للفحص الكامل
        if (isDateAvailable(currentDate, interview)) {
          const timeSlots = generateTimeSlots(currentDate, interview);
          if (timeSlots.length > 0) {
            setSelectedDate(new Date(currentDate));
            setSelectedTime(timeSlots[0].value);
            return;
          }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
    } catch (err) {
      console.warn('Error processing date range:', dateRange, err);
      continue;
    }
  }
  
  setSelectedDate(null);
  setSelectedTime('');
};

  // Memoized available time slots for performance
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !interviewDetails) return [];
    return generateTimeSlots(selectedDate, interviewDetails);
  }, [selectedDate, interviewDetails, disabledTimes, unavailableTimes]);

  // Load interview details when component opens


 useEffect(() => {
  console.log('🔵 useEffect FIRED!', { isOpen, id: appointmentData?.id, finalShareId });
  
  if (!isOpen) {
    console.log('⏸️ Sidebar not open, exiting useEffect');
    return;
  }
  
  if (!appointmentData?.id) {
    console.log('❌ No appointment ID, exiting useEffect');
    return;
  }
  
  if (!finalShareId) {
    console.log('❌ No finalShareId, exiting useEffect');
    return;
  }

  let isMounted = true;
  let loadAttempts = 0;
  const maxAttempts = 5;
  

  const loadData = async () => {
    if (!isOpen || !appointmentData?.id || !finalShareId) return;
    
    setIsLoading(true);
    setInterviewDetails(null);
    setSelectedDate(null);
    setSelectedTime('');
    
    try {
      const result = await dispatch(getAppointmentByIdPublic(appointmentData?.id));
      

      const appointmentResult = result?.payload?.appointment || result?.appointment || result?.payload;
      
      
      console.log('Appointment result:', appointmentResult);
      
      
      if (!isMounted) return;
      
      if (appointmentResult && appointmentResult.staff_resource === undefined && loadAttempts < maxAttempts) {
        loadAttempts++;
        console.log(`Retrying... attempt ${loadAttempts}`);
        setTimeout(() => loadData(), 300);
        return;
      }
      
      if (appointmentResult) {
        setAppointmentApi(appointmentResult);
        
        const staffResource = appointmentResult?.staff_resource;
        await fetchInterviewDetails(appointmentResult?.share_link, staffResource || null);
      } else {
        console.error('No appointment result found');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };
  
  if (isOpen) {
    loadData();
  }
  
  return () => {
    isMounted = false;
  };
}, [isOpen, appointmentData?.id, finalShareId]);

useEffect(() => {
  const handleClickOutside = (event) => {
    
    const isCalendarClick = calendarRef.current?.contains(event.target);
    const isInputClick = event.target.closest('.relative input[type="text"]');
    const isCalendarIcon = event.target.closest('.lucide-calendar');
    
    if (isCalendarClick || isInputClick || isCalendarIcon) {
      return;
    }
    
    const isClickableElement = 
      event.target.tagName === 'BUTTON' ||
      event.target.tagName === 'LABEL' ||
      event.target.tagName === 'H3' ||
      event.target.closest('button') ||
      event.target.closest('.grid');
    
    if (isClickableElement) {
      setIsCalendarOpen(false);
    }
  };

  if (isCalendarOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isCalendarOpen]);

  // Update selected time when date changes
  useEffect(() => {
    if (selectedDate && interviewDetails) {
      const timeSlots = generateTimeSlots(selectedDate, interviewDetails);
      
      // Reset selected time if it's not available for the new date
      if (selectedTime && !timeSlots.some(slot => slot.value === selectedTime)) {
        setSelectedTime(timeSlots.length > 0 ? timeSlots[0].value : '');
      }
    }
  }, [selectedDate, interviewDetails]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Make Monday = 0

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDateClick = useCallback((day) => {
    if (!day || !interviewDetails) return;
    
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (isDateAvailable(clickedDate, interviewDetails)) {
      setSelectedDate(clickedDate);
      setIsCalendarOpen(false);
    }
  }, [currentMonth, interviewDetails]);

  const isSelectedDay = (day) => {
    if (!day || !selectedDate) return false;
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return dayDate.toDateString() === selectedDate.toDateString();
  };

  const isDayAvailable = (day) => {
    if (!day || !interviewDetails) return false;
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return isDateAvailable(dayDate, interviewDetails);
  };

  // Handle reschedule submission
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !idAppointment) {
      setError('Please select both date and time');
      return;
    }

    setIsRescheduling(true);
    setError(null);

    const formattedDate = selectedDate.toLocaleDateString('en-CA'); 
    const formattedTime = selectedTime.includes(':') && selectedTime.split(':').length === 2 
    ? `${selectedTime}:00` 
    : selectedTime;
    try {
      const rescheduleData = {
        date: formattedDate,
        time: formattedTime ,
        time_zone: selectedTimezone,
      };

      const result = await dispatch(reschedulePublic(appointmentData?.id, rescheduleData));

      const isSuccess = 
        result === true ||
        result?.success === true ||
        result?.payload?.success === true ||
        result?.meta?.requestStatus === 'fulfilled' ||
        result?.type?.includes('fulfilled') ||
        (result?.status >= 200 && result?.status < 300);

      if (isSuccess) {
         if (onRescheduleSuccess) {
          onRescheduleSuccess();
        }
        onClose();
      } else {
        const errorMessage = 
          result?.error?.message ||
          result?.payload?.message ||
          result?.data?.message ||
          result?.message ||
          'Unable to reschedule appointment. Please try again.';
        
        throw new Error(errorMessage);
      }

    } catch (error) {
      let errorMessage = 'Failed to reschedule appointment.';
      
      if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'You are not authorized to reschedule this appointment.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Appointment not found.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid reschedule data. Please check your selection.';
      } else if (error.message && error.message !== 'Failed to reschedule appointment') {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsRescheduling(false);
    }
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Reschedule Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading available times...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Interview Details Info */}
            {!isLoading && interviewDetails && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  ⏱️ Slot Duration: {interviewDetails.duration_cycle} {interviewDetails.duration_period}
                  {interviewDetails.rest_cycle && interviewDetails.rest_cycle > 0 && (
                    <span className="ml-2">| Rest Time: {interviewDetails.rest_cycle} minutes</span>
                  )}
                </p>
              </div>
            )}

            {/* Appointment Info */}
            {!isLoading && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                    {interviewDetails?.photo ? (
                      <img
                        src={interviewDetails.photo}
                        alt="Booking"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {interviewDetails?.name?.charAt(0) || "?"}
                      </span>
                    )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{appointmentData?.title || interviewDetails?.name || 'Interview'}</h3>
                      {interviewDetails && (
                        <p className="text-sm text-gray-600">
                          Duration: {interviewDetails.duration_cycle} {interviewDetails.duration_period}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Booking Id: {appointmentData?.id || 'N/A'}</p>
                      <p className="text-sm text-gray-600">
                        Current: {appointmentData?.date} | {appointmentData?.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reschedule To Section */}
            {!isLoading && interviewDetails && (
              <div className="mb-6">
                <h3 className="font-medium mb-4">Reschedule To</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatDisplayDate(selectedDate)}
                        onClick={() => setIsCalendarOpen(true)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        placeholder="Select date"
                      />
                      <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* Calendar */}
                    {isCalendarOpen && (
                      <div 
                        ref={calendarRef}
                        className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80"
                      >
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={handlePreviousMonth}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          <h3 className="font-medium text-gray-900">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                          </h3>
                          
                          <button
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-1">
                          {days.map((day, index) => (
                            <button
                              key={index}
                              onClick={() => handleDateClick(day)}
                              disabled={!day || !isDayAvailable(day)}
                              className={`
                                h-8 w-8 text-sm rounded-md transition-colors flex items-center justify-center
                                ${!day ? 'invisible' : ''}
                                ${!isDayAvailable(day) && day ? 'text-gray-300 cursor-not-allowed' : ''}
                                ${isSelectedDay(day) 
                                  ? 'bg-blue-600 text-white' 
                                  : isDayAvailable(day) 
                                    ? 'hover:bg-blue-100 text-gray-700 cursor-pointer'
                                    : ''
                                }
                              `}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time zone</label>
                    <div className="border border-gray-300 rounded-md">
                      <TimezoneSelect
                        value={selectedTimezone}
                        onChange={(timezone) => setSelectedTimezone(timezone.value)}
                        className="react-timezone-select w-full"
                        classNamePrefix="select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: 'none',
                            boxShadow: 'none',
                            width: '100%', 
                            '&:hover': {
                              border: 'none',
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            width: '100%',
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slot Availability */}
            {!isLoading && selectedDate && availableTimeSlots.length > 0 && (
              <div>
                <h3 className="font-medium mb-4">Available Time Slots</h3>
                
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((timeSlot) => (
                      <button
                        key={timeSlot.value}
                        onClick={() => setSelectedTime(timeSlot.value)}
                        className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                          selectedTime === timeSlot.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {timeSlot.display}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No available slots message */}
            {!isLoading && selectedDate && availableTimeSlots.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-2">No available time slots for selected date</p>
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

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isRescheduling}
            >
              Cancel
            </button>
            <button 
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedTime || isRescheduling}
              className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isRescheduling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Rescheduling...
                </>
              ) : (
                'Reschedule'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RescheduleSidebar;