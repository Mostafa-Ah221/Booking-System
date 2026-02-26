import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { reschedulePublic,getAppointmentByIdPublic } from '../../redux/apiCalls/AppointmentCallApi';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TimezoneSelect from 'react-timezone-select';
import { 
  convertDateToISO, 
  convertDisabledTimesToTimezone,
  convertDateTimeWithTimezone,
  isTimePast,
  timeToMinutes
} from './timezoneUtils';
const RescheduleSidebar = ({ 
  isOpen, 
  onClose, 
  appointmentData,
  outShareId,
  onRescheduleSuccess
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [activeTab, setActiveTab] = useState('start');
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
    const WORKSPACE_TIMEZONE = 'Africa/Cairo';

  
console.log(appointmentData?.id);

  const idAppointment = appointmentData?.id;
  const { id: shareId } = useParams();
  // const finalShareId = shareId || outShareId;
  

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

  


  // Calculate effective available times (similar to DateTimeSelector)

const calculateEffectiveAvailableTimes = (
  selectedDate, 
  availableTimesData, 
  disabledTimes, 
  interviewData
) => {
  if (!selectedDate || !availableTimesData || !Array.isArray(availableTimesData)) {
    return [];
  }

  const userTimezone = selectedTimezone || WORKSPACE_TIMEZONE;
  const isoDate = formatDateToYMD(selectedDate);
  if (!isoDate) return [];

  console.log('\n🔄 calculateEffectiveAvailableTimes');
  console.log('   Selected Date:', selectedDate.toDateString());
  console.log('   ISO Date:', isoDate);

  // تحويل disabled_times
  const convertedDisabledTimes = convertDisabledTimesToTimezone(
    disabledTimes || [],
    userTimezone,
    'UTC'
  );

  const disabledMap = {};
  convertedDisabledTimes.forEach(d => {
    if (d.date === isoDate) {
      const key = d.time.slice(0, 5);
      disabledMap[key] = true;
    }
  });

  // ══════════════════════════════════════════════════════════════
  // ✅ توليد الأوقات ليوم معين في UTC
  // ══════════════════════════════════════════════════════════════
  const generateUTCTimesForDay = (targetISODate) => {
    const checkDate = new Date(targetISODate + 'T00:00:00.000Z');
    const dayOfWeek = checkDate.getUTCDay();
    const dayId = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
    
    console.log(`\n   🌍 Generating UTC times for ${targetISODate} (day_id: ${dayId})`);
    
    // ✅ جيب الـ available_times لليوم ده
    const dayAvailableTimes = availableTimesData.filter(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );

    if (dayAvailableTimes.length === 0) {
      console.log('      ⚠️ No available_times for this day_id');
      return [];
    }

    console.log('      ✅ Available ranges (UTC):', 
      dayAvailableTimes.map(t => `${t.from}-${t.to || 'end'}`).join(', ')
    );

    // ✅ جيب الـ unavailable_times لليوم ده
    const dayUnavailableTimes = unavailableTimes.filter(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );

    if (dayUnavailableTimes.length > 0) {
      console.log('      ⚠️ Unavailable ranges (UTC):', 
        dayUnavailableTimes.map(t => `${t.from}-${t.to || 'end'}`).join(', ')
      );
    }

    // ══════════════════════════════════════════════════════════════
    // ✅ الجزء المهم: طرح unavailable_times من available_times
    // ══════════════════════════════════════════════════════════════
    
    const availableRanges = [];
    
    dayAvailableTimes.forEach((availableRange) => {
      if (!availableRange || !availableRange.from) return;
      
      const availableFromMinutes = timeToMinutes(availableRange.from);
      let availableToMinutes;

      if (!availableRange.to || availableRange.to === null) {
        availableToMinutes = 23 * 60 + 59;
      } else {
        availableToMinutes = timeToMinutes(availableRange.to);
      }
      
      let currentRanges = [{ from: availableFromMinutes, to: availableToMinutes }];
      
      // ═══════════════════════════════════════════════════════════
      // ✅ الحل الصحيح: طرح unavailable_times دائمًا!
      // ═══════════════════════════════════════════════════════════
      
      dayUnavailableTimes.forEach((unavailableRange) => {
        if (!unavailableRange || !unavailableRange.from) return;
        
        const unavailableFromMinutes = timeToMinutes(unavailableRange.from);
        let unavailableToMinutes;

        if (!unavailableRange.to || unavailableRange.to === null) {
          unavailableToMinutes = 23 * 60 + 59;
        } else {
          unavailableToMinutes = timeToMinutes(unavailableRange.to);
        }
        
        const newRanges = [];
        currentRanges.forEach((range) => {
          // ✅ لو الـ unavailable range مش بيتقاطع مع الـ available range
          if (unavailableToMinutes <= range.from || unavailableFromMinutes >= range.to) {
            newRanges.push(range);
          }
          // ✅ لو الـ unavailable range بيغطي الأول بس
          else if (unavailableFromMinutes <= range.from && unavailableToMinutes < range.to) {
            newRanges.push({ from: unavailableToMinutes, to: range.to });
          }
          // ✅ لو الـ unavailable range بيغطي الآخر بس
          else if (unavailableFromMinutes > range.from && unavailableToMinutes >= range.to) {
            newRanges.push({ from: range.from, to: unavailableFromMinutes });
          }
          // ✅ لو الـ unavailable range في النص
          else if (unavailableFromMinutes > range.from && unavailableToMinutes < range.to) {
            newRanges.push({ from: range.from, to: unavailableFromMinutes });
            newRanges.push({ from: unavailableToMinutes, to: range.to });
          }
          // ✅ لو الـ unavailable range بيغطي كل حاجة → مش هنضيف حاجة
        });
        currentRanges = newRanges;
      });
      
      availableRanges.push(...currentRanges);
    });

    // ✅ لو مفيش ranges بعد الطرح → return فاضي
    if (availableRanges.length === 0) {
      console.log('      ❌ No available ranges after subtracting unavailable_times');
      return [];
    }

    console.log('      ✅ Effective ranges after unavailable (UTC):', 
      availableRanges.map(r => {
        const fh = Math.floor(r.from / 60);
        const fm = r.from % 60;
        const th = Math.floor(r.to / 60);
        const tm = r.to % 60;
        return `${fh}:${String(fm).padStart(2,'0')}-${th}:${String(tm).padStart(2,'0')}`;
      }).join(', ')
    );

    // ══════════════════════════════════════════════════════════════
    // ✅ توليد الـ slots من الـ ranges المتاحة
    // ══════════════════════════════════════════════════════════════
    
    const utcTimeSlots = [];
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
    const selectedDateObj = new Date(targetISODate + 'T00:00:00.000Z');
    const isToday = selectedDateObj.toDateString() === today.toDateString();
    const nowMinutes = isToday ? (new Date().getHours() * 60 + new Date().getMinutes()) : -1;
    
    availableRanges.forEach((range) => {
      const startMinutes = range.from;
      const endMinutes = range.to;
      
      for (
        let currentMinutes = startMinutes; 
        currentMinutes + durationInMinutes <= endMinutes; 
        currentMinutes += totalSlotDuration
      ) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        let isPast = false;
        if (isToday) {
          const slotTimeMinutes = hours * 60 + minutes;
          isPast = slotTimeMinutes < nowMinutes;
        }
        
        if (!isPast) {
          utcTimeSlots.push(formattedTime);
        }
      }
    });

    console.log(`      ✅ Generated ${utcTimeSlots.length} UTC slots`);
    return [...new Set(utcTimeSlots)].sort();
  };

  // ══════════════════════════════════════════════════════════════
  // ✅ التحويل من UTC → User Timezone
  // ══════════════════════════════════════════════════════════════
  
  const convertUTCToUserTimezone = (utcDateISO, utcTime) => {
    try {
      const [hours, minutes] = utcTime.split(':').map(Number);
      const [year, month, day] = utcDateISO.split('-').map(Number);
      const utcTimestamp = Date.UTC(year, month - 1, day, hours, minutes, 0);
      const utcDate = new Date(utcTimestamp);

      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: userTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const formatted = formatter.format(utcDate);
      const [datePart, timePart] = formatted.split(', ');
      const [d, m, y] = datePart.split('/');
      const [h, min] = timePart.split(':');

      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const newDate = `${d} ${monthNames[parseInt(m) - 1]} ${y}`;
      const newTime = `${h}:${min}`;
      const newISODate = `${y}-${m}-${d}`;

      return { date: newDate, time: newTime, isoDate: newISODate };
    } catch (err) {
      console.error('❌ Conversion failed:', err);
      return null;
    }
  };

  // ══════════════════════════════════════════════════════════════
  // ✅ معالجة 3 أيام
  // ══════════════════════════════════════════════════════════════
  
  const allUserTimes = [];
  const dateStr = selectedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  console.log('\n🔄 Converting times from UTC to', userTimezone);

  // اليوم الحالي
  const currentDayTimes = generateUTCTimesForDay(isoDate);
  currentDayTimes.forEach(utcTime => {
    const converted = convertUTCToUserTimezone(isoDate, utcTime);
    if (converted && converted.isoDate === isoDate) {
      const timeKey = converted.time.slice(0, 5);
      const isDisabled = !!disabledMap[timeKey];
      const isPast = isTimePast(dateStr, converted.time);
      
      if (!isDisabled && !isPast) {
        allUserTimes.push(converted.time);
      }
    }
  });

  // اليوم السابق (للـ timezones المختلفة)
  if (userTimezone !== 'UTC') {
    const prevDate = new Date(isoDate + 'T00:00:00.000Z');
    prevDate.setUTCDate(prevDate.getUTCDate() - 1);
    const prevISO = prevDate.toISOString().split('T')[0];
    
    const prevTimes = generateUTCTimesForDay(prevISO);
    prevTimes.forEach(utcTime => {
      const converted = convertUTCToUserTimezone(prevISO, utcTime);
      if (converted && converted.isoDate === isoDate) {
        const timeKey = converted.time.slice(0, 5);
        const isDisabled = !!disabledMap[timeKey];
        const isPast = isTimePast(dateStr, converted.time);
        
        if (!isDisabled && !isPast) {
          allUserTimes.push(converted.time);
        }
      }
    });
  }

  // اليوم التالي
  if (userTimezone !== 'UTC') {
    const nextDate = new Date(isoDate + 'T00:00:00.000Z');
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const nextISO = nextDate.toISOString().split('T')[0];
    
    const nextTimes = generateUTCTimesForDay(nextISO);
    nextTimes.forEach(utcTime => {
      const converted = convertUTCToUserTimezone(nextISO, utcTime);
      if (converted && converted.isoDate === isoDate) {
        const timeKey = converted.time.slice(0, 5);
        const isDisabled = !!disabledMap[timeKey];
        const isPast = isTimePast(dateStr, converted.time);
        
        if (!isDisabled && !isPast) {
          allUserTimes.push(converted.time);
        }
      }
    });
  }

  // إزالة التكرارات والترتيب
  const uniqueTimes = [...new Set(allUserTimes)].sort((a, b) => {
    const [ha, ma] = a.split(':').map(Number);
    const [hb, mb] = b.split(':').map(Number);
    return ha * 60 + ma - (hb * 60 + mb);
  });

  console.log(`\n✅ Final result: ${uniqueTimes.length} available times`);
  return uniqueTimes;
};

  

const isDateAvailable = (date, interview = interviewDetails) => {
  if (!date || !interview) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  if (checkDate < today) {
    return false;
  }

  const isoDate = formatDateToYMD(checkDate);
  if (!isoDate) return false;

  const userTimezone = selectedTimezone || WORKSPACE_TIMEZONE;

  // ══════════════════════════════════════════════════════════════
  // 🌍 ده الجزء المهم: نجرب نجيب أوقات من اليوم ده
  // ══════════════════════════════════════════════════════════════
  const effectiveTimeSlots = calculateEffectiveAvailableTimes(
    checkDate, 
    interview.available_times, 
    interview.disabled_times || [], 
    interview
  );
  
  // لو فيه أي وقت متاح في اليوم ده (بعد التحويل)، يبقى اليوم متاح
  return effectiveTimeSlots.length > 0;
};



// ════════════════════════════════════════════════════════════════
// 🔧 تعديل generateTimeSlots
// ════════════════════════════════════════════════════════════════

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

const fetchInterviewDetails = async (shareLink, staffResource = null, resource = null) => {
  setIsLoading(true);
  setError(null);
  
  try {
    console.log('📦 Resources received in fetchInterviewDetails:', resource);
    console.log('📦 Resources disabled_times:', resource?.disabled_times);
    
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
      const combinedDisabledTimes = [
        ...(interview?.disabled_times || []),
      ];


      if (useStaffResource && staffResource?.disabled_times) {
        combinedDisabledTimes.push(...staffResource.disabled_times);
      }
      if (!useStaffResource && resource && resource?.disabled_times && Array.isArray(resource.disabled_times)) {
        console.log(' Adding disabled_times from resources:', resource.disabled_times);
        combinedDisabledTimes.push(...resource.disabled_times);
      }

      console.log(' Final Combined disabled_times:', combinedDisabledTimes);

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
    } else {
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

  const allPossibleDates = [];
  
  for (const dateRange of interview.available_dates) {
    if (!dateRange?.from) continue;
    
    try {
      const fromDate = new Date(dateRange.from.split(' ')[0]);
      const toDate = dateRange.to ? new Date(dateRange.to.split(' ')[0]) : new Date('2099-12-31');
      
      if (isNaN(fromDate.getTime())) continue;
      
      const currentDate = new Date(Math.max(fromDate.getTime(), today.getTime()));
      const endDate = new Date(toDate.getTime());
      
      // اجمع كل الأيام في الـ range ده
      while (currentDate <= endDate) {
        allPossibleDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } catch (err) {
      console.warn('Error processing date range:', dateRange, err);
      continue;
    }
  }
  allPossibleDates.sort((a, b) => a - b);

  for (const date of allPossibleDates) {
    const timeSlots = calculateEffectiveAvailableTimes(
      date,
      interview.available_times,
      interview.disabled_times || [],
      interview
    );
    
    if (timeSlots.length > 0) {
      setSelectedDate(new Date(date));
      setSelectedTime(timeSlots[0]);
      return;
    }
  }
  
  setSelectedDate(null);
  setSelectedTime('');
};

  // Memoized available time slots for performance
const availableTimeSlots = useMemo(() => {
  if (!selectedDate || !interviewDetails) return [];
  return generateTimeSlots(selectedDate, interviewDetails);
}, [selectedDate, interviewDetails, selectedTimezone]);
  // Load interview details when component opens


 useEffect(() => {
  if (!isOpen) {
    return;
  }
  
  if (!appointmentData?.id) {
    return;
  }
  
 

  let isMounted = true;
  let loadAttempts = 0;
  const maxAttempts = 5;
  

  const loadData = async () => {
    if (!isOpen || !appointmentData?.id ) return;
    
    setIsLoading(true);
    setInterviewDetails(null);
    setSelectedDate(null);
    setSelectedTime('');
    
    try {
      const result = await dispatch(getAppointmentByIdPublic(appointmentData?.id));
      

      const appointmentResult = result?.data?.appointment;
      
      
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
        const resource = appointmentResult?.resource;
        console.log(resource);
        console.log(staffResource);
        
       await fetchInterviewDetails(appointmentResult?.share_link, staffResource, resource);

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
}, [isOpen, appointmentData?.id]);

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
    if (selectedDate && interviewDetails && selectedTimezone) {
      // Recalculate available time slots for the selected date with new timezone
      const timeSlots = generateTimeSlots(selectedDate, interviewDetails);
      
      // Reset selections if current time is not available in new timezone
      if (selectedTime && !timeSlots.some(slot => slot.value === selectedTime)) {
        setSelectedTime(timeSlots.length > 0 ? timeSlots[0].value : '');
        setSelectedEndTime('');
      }
      
      // Check if the currently selected date is still available in the new timezone
      if (!isDateAvailable(selectedDate, interviewDetails)) {
        // Find first available date in new timezone
        findFirstAvailableDateTime(interviewDetails);
      }
    }
  }, [selectedTimezone, selectedDate, interviewDetails]);
  useEffect(() => {
    if (selectedDate && interviewDetails) {
      const timeSlots = generateTimeSlots(selectedDate, interviewDetails);
      
      // Reset selected time if it's not available for the new date
      if (selectedTime && !timeSlots.some(slot => slot.value === selectedTime)) {
        setSelectedTime(timeSlots.length > 0 ? timeSlots[0].value : '');
      }
    }
  }, [selectedDate, interviewDetails]);



// Reset end time when start time changes
useEffect(() => {
  if (interviewDetails?.type === "resource" && interviewDetails?.require_end_time === true) {
    setSelectedEndTime(''); // Clear end time when start time changes
  }
}, [selectedTime]);

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
  const isResourceWithEndTime = interviewDetails?.type === "resource" && interviewDetails?.require_end_time === true;
  
  if (!selectedDate || !selectedTime || !idAppointment) {
    setError('Please select both date and time');
    return;
  }
  
  if (isResourceWithEndTime && !selectedEndTime) {
    setError('Please select end time');
    return;
  }

  setIsRescheduling(true);
  setError(null);

  const formattedDate = selectedDate.toLocaleDateString('en-CA'); 
  const formattedTime = selectedTime.includes(':') && selectedTime.split(':').length === 2 
    ? `${selectedTime}:00` 
    : selectedTime;
  
  const formattedEndTime = selectedEndTime && selectedEndTime.includes(':') && selectedEndTime.split(':').length === 2
    ? `${selectedEndTime}:00`
    : selectedEndTime;
    
  try {
    const rescheduleData = {
      date: formattedDate,
      time: formattedTime,
      time_zone: selectedTimezone,
      ...(isResourceWithEndTime && { end_time: formattedEndTime })
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
                      <h3 className="font-medium truncate  max-w-[150px]">{appointmentData?.title || interviewDetails?.name || 'Interview'}</h3>
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
    {interviewDetails?.type === "resource" && interviewDetails?.require_end_time === true ? (
      // Resource Mode with Start/End Time Tabs
      <div className="space-y-4">
        <h3 className="font-medium mb-4">Available Time Slots</h3>
        
        {/* Tab Buttons */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('start')}
            className={`flex-1 py-3 px-4 font-medium text-sm transition-all relative ${
              activeTab === 'start'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Start Time
            {selectedTime && (
              <span className="block text-xs font-normal text-gray-500 mt-0.5">
                {availableTimeSlots.find(s => s.value === selectedTime)?.display}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('end')}
            disabled={!selectedTime}
            className={`flex-1 py-3 px-4 font-medium text-sm transition-all relative ${
              !selectedTime
                ? 'text-gray-300 cursor-not-allowed'
                : activeTab === 'end'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            End Time
            {selectedEndTime ? (
              <span className="block text-xs font-normal text-gray-500 mt-0.5">
                {availableTimeSlots.find(s => s.value === selectedEndTime)?.display}
              </span>
            ) : !selectedTime ? (
              <span className="block text-xs font-normal text-gray-400 mt-0.5">
                Select start time first
              </span>
            ) : null}
          </button>
        </div>

        {/* Time Slots Content */}
        <div className="mb-4">
          {activeTab === 'start' ? (
            // Start Time Slots
            <div className="grid grid-cols-3 gap-2">
              {availableTimeSlots.map((timeSlot) => (
                <button
                  key={timeSlot.value}
                  onClick={() => {
                    setSelectedTime(timeSlot.value);
                    setSelectedEndTime(''); // Reset end time when changing start time
                    setActiveTab('end'); // Switch to end time tab
                  }}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                    selectedTime === timeSlot.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  {timeSlot.display}
                </button>
              ))}
            </div>
          ) : (
            // End Time Slots
            <div>
              {!selectedTime ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">Please select a start time first</p>
                </div>
              ) : (() => {
                // Filter end times to only show times after selected start time
                const endTimeSlots = availableTimeSlots.filter(slot => {
                  const [startHour, startMin] = selectedTime.split(':').map(Number);
                  const [slotHour, slotMin] = slot.value.split(':').map(Number);
                  const startMinutes = startHour * 60 + startMin;
                  const slotMinutes = slotHour * 60 + slotMin;
                  return slotMinutes > startMinutes;
                });

                return endTimeSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No available end time slots after the selected start time</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {endTimeSlots.map((timeSlot) => (
                      <button
                        key={timeSlot.value}
                        onClick={() => setSelectedEndTime(timeSlot.value)}
                        className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                          selectedEndTime === timeSlot.value
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                        }`}
                      >
                        {timeSlot.display}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    ) : (
      // Normal Mode (No End Time Required)
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