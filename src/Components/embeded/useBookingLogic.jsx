import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const useBookingLogic = (id, navigate, isInterviewMode, interviewId, share_link, isStaff) => {
  const location = useLocation();
  
  
  // State management
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  const [selectedService, setSelectedService] = useState('demo');
  // في بداية useBookingLogic
const getDefaultTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone; // زي "Africa/Cairo"
  } catch {
    return 'Africa/Cairo';
  }
};

// وبعدين
const [selectedTimezone, setSelectedTimezone] = useState(getDefaultTimezone());
  // const [selectedTimezone, setSelectedTimezone] = useState('Africa/Cairo');
  const [selectedDate, setSelectedDate] = useState(''); 
  const [selectedTime, setSelectedTime] = useState(''); 
  const [selectedEndTime, setSelectedEndTime] = useState(''); 
  const [requireEndTime, setRequireEndTime] = useState(false);

  const [availableStaff, setAvailableStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  // 
  const [availableStaffGroups, setAvailableStaffGroups] = useState([]);
  const [selectedStaffGroup, setSelectedStaffGroup] = useState(null);

  const [availableResources, setAvailableResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  const [totalPrice, setTotalPrice] = useState(0);
const [numberOfSlots, setNumberOfSlots] = useState(0);
const lastResourceIdRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    code_phone: '+20',
    address: ''
  });
  
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const WORKSPACE_TIMEZONE = 'Africa/Cairo';
 
 const getNavigationPath = () => {
  const pathname = location.pathname;

  const pathParts = pathname.split("/").filter(Boolean);
  const orgBase = pathParts[0]; 

  if (pathname.includes("/w/")) {
    // Workspace
    const workspaceSlug = pathParts[2]; 
    return `/${orgBase}/w/${workspaceSlug}/appointmentConfirmation`;
  } 
  else if (pathname.includes("/s/")) {
    // Staff
    const staffSlug = pathParts[2];
    return `/${orgBase}/s/${staffSlug}/appointmentConfirmation`;
  } 
  else if (pathname.includes("/service/")) {
    // Service
    const serviceSlug = pathParts[2];
    return `/${orgBase}/service/${serviceSlug}/appointmentConfirmation`;
  } 
  else {
    // Organization only
    return `/${orgBase}/appointmentConfirmation`;
  }
};

const convertTimeWithTimezone = (timeStr, dateStr, fromTimezone, toTimezone) => {
  try {
    const isoDate = convertDateToISO(dateStr);
    if (!isoDate) return timeStr;

    // نبني تاريخ كامل بالوقت الأصلي + توقيت الـ workspace
    const [hours, minutes] = timeStr.split(':').map(Number);
    const dateTimeStr = `${isoDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    // نحول التاريخ ده للـ timezone المطلوب
    const dateInTargetTz = new Date(dateTimeStr);
    const options = {
      timeZone: toTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const parts = formatter.formatToParts(dateInTargetTz);
    
    const hour = parts.find(p => p.type === 'hour')?.value || '00';
    const minute = parts.find(p => p.type === 'minute')?.value || '00';

    return `${hour}:${minute}`;
  } catch (err) {
    console.warn('Timezone conversion failed:', err);
    return timeStr;
  }
};
const convertDateTimeWithTimezone = (dateStr, timeStr, fromTimezone, toTimezone) => {
  try {
    const isoDate = convertDateToISO(dateStr);
    if (!isoDate) return { date: dateStr, time: timeStr };

    const [hours, minutes] = timeStr.split(':').map(Number);
    const dateTimeStr = `${isoDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    // نحول للـ UTC أولاً من الـ workspace timezone
    const dateInWorkspaceTz = new Date(dateTimeStr);
    
    // نحول للـ target timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: toTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(dateInWorkspaceTz);
    
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value || '00';
    const minute = parts.find(p => p.type === 'minute')?.value || '00';

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    const newTime = `${hour}:${minute}`;

    return { date: newDate, time: newTime };
  } catch (err) {
    console.warn('DateTime conversion failed:', err);
    return { date: dateStr, time: timeStr };
  }
};
  const convertDateToISO = (dateStr) => {
    try {
      if (typeof dateStr === 'string' && dateStr.includes(' ')) {
        const months = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        
        const parts = dateStr.trim().split(' ');
        if (parts.length !== 3) return null;
        
        const [day, month, year] = parts;
        const monthNum = months[month];
        
        if (!monthNum) return null;
        
        return `${year}-${monthNum}-${day.padStart(2, '0')}`;
      }
      return dateStr;
    } catch (error) {
      console.error('Error converting date:', error);
      return null;
    }
  };

  const isTimePast = (dateStr, timeStr) => {
    try {
      const formattedDate = convertDateToISO(dateStr);
      if (!formattedDate || !timeStr || !timeStr.includes(':')) return false;
      
      const now = new Date();
      const selectedDateTime = new Date(`${formattedDate}T${timeStr}:00`);
      
      return selectedDateTime < now;
    } catch (error) {
      return false;
    }
  };

const generateTimeSlots = (
  availableTimes,
  durationCycle = 15,
  durationPeriod = "minutes",
  selectedDate = null,
  disabledTimes = [],
  unavailableTimes = [],
  unavailableDates = [],
  restCycle = 0,
  timezone = 'Africa/Cairo'
) => {
  if (!availableTimes || !Array.isArray(availableTimes) || !selectedDate) {
    console.warn('Missing required data for time slot generation');
    return [];
  }

  const WORKSPACE_TIMEZONE = 'Africa/Cairo';
  const formattedDate = convertDateToISO(selectedDate);
  if (!formattedDate) {
    console.error('Failed to format date:', selectedDate);
    return [];
  }

  const getDayOfWeekFromDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00.000Z');
    if (isNaN(date.getTime())) return null;
    const dayOfWeek = date.getUTCDay();
    return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
  };

  const targetDayId = getDayOfWeekFromDate(formattedDate);
  if (!targetDayId) return [];

  const timeRangesForSelectedDay = availableTimes.filter(
    tr => tr && Number(tr.day_id) === Number(targetDayId)
  );

  // ── اليوم السابق (للـ timezone المختلف) ─────────────────────────────────────
  let previousDaySlots = [];

  if (timezone !== WORKSPACE_TIMEZONE) {
    const prevDate = new Date(formattedDate + 'T00:00:00.000Z');
    prevDate.setUTCDate(prevDate.getUTCDate() - 1);
    const prevDateISO = prevDate.toISOString().split('T')[0];
    const prevDayId = getDayOfWeekFromDate(prevDateISO);

    if (prevDayId) {
      const prevRanges = availableTimes.filter(
        tr => tr && Number(tr.day_id) === Number(prevDayId)
      );

      if (prevRanges.length > 0) {
        const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
        const restInMinutes = restCycle;

        const prevSlots = [];
        prevRanges.forEach(range => {
          const [fromH, fromM] = range.from.split(':').map(Number);
          const [toH, toM] = range.to.split(':').map(Number);
          const start = new Date(); start.setHours(fromH, fromM, 0, 0);
          const end = new Date(); end.setHours(toH, toM, 0, 0);
          let current = new Date(start);

          while (current < end) {
            const timeStr = `${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`;
            const endApp = new Date(current);
            endApp.setMinutes(endApp.getMinutes() + durationInMinutes);
            if (endApp <= end) prevSlots.push(timeStr);
            current.setMinutes(current.getMinutes() + durationInMinutes + restInMinutes);
          }
        });

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const prevDay = prevDate.getUTCDate().toString().padStart(2, '0');
        const prevMonth = monthNames[prevDate.getUTCMonth()];
        const prevYear = prevDate.getUTCFullYear();
        const prevDateStr = `${prevDay} ${prevMonth} ${prevYear}`;

        prevSlots.forEach(time => {
          const converted = convertDateTimeWithTimezone(prevDateStr, time, WORKSPACE_TIMEZONE, timezone);
          if (converted.date === selectedDate) {
            const iso = convertDateToISO(converted.date);
            const disabled = disabledTimes.some(d => d.date === iso && d.time.startsWith(converted.time));
            if (!disabled) previousDaySlots.push(converted.time);
          }
        });
      }
    }
  }

  // ── الأوقات العادية لليوم الحالي ─────────────────────────────────────
  const timeSlots = [];
  const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
  const restInMinutes = restCycle;

  timeRangesForSelectedDay.forEach(range => {
    if (!range?.from || !range?.to) return;
    const [fromH, fromM] = range.from.split(':').map(Number);
    const [toH, toM] = range.to.split(':').map(Number);
    const start = new Date(); start.setHours(fromH, fromM, 0, 0);
    const end = new Date(); end.setHours(toH, toM, 0, 0);
    let current = new Date(start);

    while (current < end) {
      const timeStr = `${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`;
      const endApp = new Date(current);
      endApp.setMinutes(endApp.getMinutes() + durationInMinutes);
      if (endApp > end) break;

      const disabled = disabledTimes.some(d => d.date === formattedDate && d.time.startsWith(timeStr));
      const past = isTimePast(selectedDate, timeStr);

      if (!disabled && !past) {
        timeSlots.push(timeStr);
      }

      current.setMinutes(current.getMinutes() + durationInMinutes + restInMinutes);
    }
  });

  const all = [...previousDaySlots, ...timeSlots];
  const unique = [...new Set(all)].sort((a, b) => {
    const [ha, ma] = a.split(':').map(Number);
    const [hb, mb] = b.split(':').map(Number);
    return ha * 60 + ma - hb * 60 - mb;
  });

  return unique;
};

 const isDateUnavailable = (day, month, year, unavailableDates) => {
    if (!unavailableDates || !Array.isArray(unavailableDates) || unavailableDates.length === 0) {
      return false;
    }

    const checkDate = new Date(Date.UTC(year, month, day));
    
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

        if (dateRange.to === null || dateRange.to === undefined) {
          return checkDate >= fromDate;
        }

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

  const isTimeDisabled = (date, time, disabledTimes) => {
    if (!date || !time || !disabledTimes || !Array.isArray(disabledTimes)) {
      return false;
    }
    
    try {
      const formattedDate = convertDateToISO(date);
      if (!formattedDate) return false;
      
      return disabledTimes.some(disabledTime => {
        if (!disabledTime || !disabledTime.date || !disabledTime.time) return false;
        
        const disabledTimeFormatted = disabledTime.time.slice(0, 5);
        return disabledTime.date === formattedDate && disabledTimeFormatted === time;
      });
    } catch (error) {
      return false;
    }
  };


useEffect(() => {
  if (!selectedDate || !bookingData?.raw_available_times) return;

  const isoDate = convertDateToISO(selectedDate);
  if (!isoDate) return;

  const wsTimezone = WORKSPACE_TIMEZONE;
  const userTimezone = selectedTimezone || wsTimezone;

  let allAvailableTimes = [];

  // ────────────────────────────────
  // 1. أوقات اليوم الحالي
  // ────────────────────────────────
  const currentDayTimes = generateTimeSlots(
    bookingData.raw_available_times,
    parseInt(bookingData.duration_cycle),
    bookingData.duration_period || 'minutes',
    isoDate,
    bookingData.disabled_times || [],
    bookingData.unavailable_times || [],
    bookingData.unavailable_dates || [],
    parseInt(bookingData.rest_cycle || '0'),
    wsTimezone
  );

  currentDayTimes.forEach(time => {
    const converted = convertDateTimeWithTimezone(selectedDate, time, wsTimezone, userTimezone);
    if (converted.date === selectedDate) {
      const isDisabled = bookingData.disabled_times?.some(d =>
        d.date === isoDate && d.time.startsWith(converted.time)
      );
      const isPast = isTimePast(selectedDate, converted.time);

      if (!isDisabled && !isPast) {
        allAvailableTimes.push(converted.time);
      }
    }
  });

  // ────────────────────────────────
  // 2. أوقات من اليوم السابق (للـ timezones القدام زي Auckland)
  // ────────────────────────────────
  if (userTimezone !== wsTimezone) {
    const prevDate = new Date(isoDate + 'T00:00:00.000Z');
    prevDate.setUTCDate(prevDate.getUTCDate() - 1);
    const prevDateISO = prevDate.toISOString().split('T')[0];

    const prevDayTimes = generateTimeSlots(
      bookingData.raw_available_times,
      parseInt(bookingData.duration_cycle),
      bookingData.duration_period || 'minutes',
      prevDateISO,
      bookingData.disabled_times || [],
      bookingData.unavailable_times || [],
      bookingData.unavailable_dates || [],
      parseInt(bookingData.rest_cycle || '0'),
      wsTimezone
    );

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const prevDay = prevDate.getUTCDate();
    const prevMonth = monthNames[prevDate.getUTCMonth()];
    const prevYear = prevDate.getUTCFullYear();
    const prevDateStr = `${String(prevDay).padStart(2, '0')} ${prevMonth} ${prevYear}`;

    prevDayTimes.forEach(time => {
      const converted = convertDateTimeWithTimezone(prevDateStr, time, wsTimezone, userTimezone);
      if (converted.date === selectedDate) {
        const isDisabled = bookingData.disabled_times?.some(d =>
          d.date === isoDate && d.time.startsWith(converted.time)
        );
        const isPast = isTimePast(selectedDate, converted.time);

        if (!isDisabled && !isPast) {
          allAvailableTimes.push(converted.time);
        }
      }
    });
  }

  // ────────────────────────────────
  // 3. أوقات من اليوم التالي (للـ timezones الورا زي Hawaii)
  // ────────────────────────────────
  if (userTimezone !== wsTimezone) {
    const nextDate = new Date(isoDate + 'T00:00:00.000Z');
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const nextDateISO = nextDate.toISOString().split('T')[0];

    const nextDayTimes = generateTimeSlots(
      bookingData.raw_available_times,
      parseInt(bookingData.duration_cycle),
      bookingData.duration_period || 'minutes',
      nextDateISO,
      bookingData.disabled_times || [],
      bookingData.unavailable_times || [],
      bookingData.unavailable_dates || [],
      parseInt(bookingData.rest_cycle || '0'),
      wsTimezone
    );

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const nextDay = nextDate.getUTCDate();
    const nextMonth = monthNames[nextDate.getUTCMonth()];
    const nextYear = nextDate.getUTCFullYear();
    const nextDateStr = `${String(nextDay).padStart(2, '0')} ${nextMonth} ${nextYear}`;

    nextDayTimes.forEach(time => {
      const converted = convertDateTimeWithTimezone(nextDateStr, time, wsTimezone, userTimezone);
      if (converted.date === selectedDate) {
        const isDisabled = bookingData.disabled_times?.some(d =>
          d.date === isoDate && d.time.startsWith(converted.time)
        );
        const isPast = isTimePast(selectedDate, converted.time);

        if (!isDisabled && !isPast) {
          allAvailableTimes.push(converted.time);
        }
      }
    });
  }

  // ترتيب وإزالة التكرار
  const uniqueTimes = [...new Set(allAvailableTimes)].sort((a, b) => {
    const [ha, ma] = a.split(':').map(Number);
    const [hb, mb] = b.split(':').map(Number);
    return ha * 60 + ma - (hb * 60 + mb);
  });

  console.log('📅 Final Times for', selectedDate, ':', uniqueTimes);

  setBookingData(prev => ({
    ...prev,
    available_times: uniqueTimes.map(t => ({ time: t }))
  }));

  if (uniqueTimes.length > 0) {
    setSelectedTime(uniqueTimes[0]);
  } else {
    setSelectedTime('');
  }

}, [
  selectedDate,
  selectedTimezone,
  bookingData?.raw_available_times,
  bookingData?.disabled_times,
  bookingData?.unavailable_times,
  bookingData?.unavailable_dates,
  bookingData?.duration_cycle,
  bookingData?.duration_period,
  bookingData?.rest_cycle
]);


const getFirstAvailableTime = (date, availableTimes, disabledTimes = [], unavailableTimes = [], unavailableDates = []) => {
    if (!date || !availableTimes || !Array.isArray(availableTimes)) {
      return null;
    }
    
    const availableTime = availableTimes.find(time => {
      const timeString = typeof time === 'string' ? time : time.time;
      if (!timeString) return false;
      
      const isBooked = isTimeDisabled(date, timeString, disabledTimes);
      const isPast = isTimePast(date, timeString);
      
      return !isBooked && !isPast;
    });
    
    return availableTime ? (typeof availableTime === 'string' ? availableTime : availableTime.time) : null;
  };

 const fetchInterviewData = async (interviewId) => {
  const response = await fetch(`https://backend-booking.appointroll.com/api/public/book/resource?interview_share_link=${interviewId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const apiData = await response.json();
  console.log(apiData);
  
  if (!apiData.data || !apiData.data.interview) {
    throw new Error('Invalid API response structure');
  }
  
  const interview = apiData.data.interview;
  setRequireEndTime(interview.require_end_time === "1" || interview.require_end_time === 1 || interview.require_end_time === true);

  if (interview.staff_group && Array.isArray(interview.staff_group) && interview.staff_group.length > 0) {
   
    setAvailableStaffGroups(prev => {
      const prevIds = prev.map(g => g.group_id).sort().join(',');
      const newIds = interview.staff_group.map(g => g.group_id).sort().join(',');
      return prevIds !== newIds ? interview.staff_group : prev;
    });
  } else {
    setAvailableStaffGroups([]);
  }

  if (interview.resources && Array.isArray(interview.resources) && interview.resources.length > 0) {
    setAvailableResources(prev => {
      const prevIds = prev.map(r => r.id).sort().join(',');
      const newIds = interview.resources.map(r => r.id).sort().join(',');
      return prevIds !== newIds ? interview.resources : prev;
    });
  } else {
    setAvailableResources([]);
  }

  if (interview.staff && Array.isArray(interview.staff) && interview.staff.length > 0) {
    setAvailableStaff(prev => {
      const prevIds = prev.map(s => s.id).sort().join(',');
      const newIds = interview.staff.map(s => s.id).sort().join(',');
      return prevIds !== newIds ? interview.staff : prev;
    });
    
    if (isStaff && share_link) {
      const staffMember = interview.staff.find(staff => staff.share_link === share_link);
      
      if (staffMember) {
        setSelectedStaff(staffMember);
        setAvailableStaff([]); 
      }
    }
  } else {
    setAvailableStaff([]);
  }
  
  localStorage.setItem('double_book', interview.double_book);
  localStorage.setItem('approve_appo', interview.approve_appointment);
  
  return interview;
};

 const calculateEndTime = (startTime, durationCycle, durationPeriod, restCycle = 0) => {
  if (!startTime) return '';
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  
  const durationInMinutes = durationPeriod === "hours" 
    ? durationCycle * 60 
    : durationCycle;
  
  // إضافة rest_cycle للـ duration
  const totalMinutes = durationInMinutes + restCycle;
  
  const endMinutes = startMinutes + totalMinutes;
  const endHours = Math.floor(endMinutes / 60) % 24;
  const endMins = endMinutes % 60;
  
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};

 const transformInterviewData = (interview) => {
  let sourceData;
  
  if (selectedResource) {
    sourceData = {
      available_dates: interview.available_dates || [],
      unavailable_dates: interview.un_available_dates || [],
      unavailable_times: interview.un_available_times || [],
      available_times: interview.available_times || [],
      disabled_times: selectedResource.disabled_times || [] 
    };
  } else if (selectedStaffGroup) {
    sourceData = {
      available_dates: selectedStaffGroup.collective_available_dates || [],
      unavailable_dates:selectedStaffGroup.collective_unavailable_dates || [],
      unavailable_times:selectedStaffGroup.collective_unavailable_times || [],
      available_times: selectedStaffGroup.collective_available_times || [],
      disabled_times: selectedStaffGroup.disabled_times || []
    };
  } else if (selectedStaff) {
    sourceData = selectedStaff;
  } else {
    sourceData = interview;
  }
  
  return {
    available_dates: sourceData.available_dates || [],
    unavailable_dates: sourceData.un_available_dates || [],
    unavailable_times: sourceData.un_available_times || [],
    available_times: sourceData.available_times || [], 
    name: interview.name || 'Interview',
    customer_id: interview.customer_id,
    id: interview.id,
    service_name: interview.name || 'Interview Session',
    provider_name: interview.customer_name,
    duration: `${interview.duration_cycle}${interview.duration_period}`,
    work_space_id: interview.work_space_id,
    photo: interview.photo,
    disabled_times: sourceData.disabled_times || [], 
    created_at: interview.created_at,
    raw_available_times: sourceData.available_times,
    duration_cycle: interview.duration_cycle,
    duration_period: interview.duration_period,
    rest_cycle: interview.rest_cycle || '0',
    status_of_pay: interview.status_of_pay,
    price: interview.price || '0',
    mode: interview.mode,
    inperson_mode: interview.inperson_mode,
    currency: interview.currency,
    has_staff: availableStaff.length > 0,
    has_staff_groups: availableStaffGroups.length > 0,
    staff: availableStaff,
    require_end_time: interview.require_end_time,
    staff_groups: availableStaffGroups,
    has_resources: availableResources.length > 0,
    resources: availableResources
  };
};

  const findDefaultDateTime = (transformedData, interview) => {
    let defaultDate = null;
    let defaultTime = null;

    if (!transformedData.available_dates || transformedData.available_dates.length === 0) {
      return { defaultDate, defaultTime };
    }

    const allAvailableDates = [];
    
    transformedData.available_dates.forEach(dateRange => {
      try {
        const fromDate = new Date(dateRange.from.split(' ')[0] + 'T00:00:00.000Z');
        const toDate = new Date(dateRange.to.split(' ')[0] + 'T00:00:00.000Z');
        
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return;
        }

        const currentDate = new Date(fromDate);
        while (currentDate <= toDate) {
          allAvailableDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } catch (error) {
        return;
      }
    });

    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    const validDates = allAvailableDates
      .filter(date => date >= todayUTC)
      .filter(date => {
        const day = date.getUTCDate();
        const month = date.getUTCMonth();
        const year = date.getUTCFullYear();
        
        if (isDateUnavailable(day, month, year, transformedData.unavailable_dates)) {
          return false;
        }
        
        const dayOfWeek = date.getUTCDay();
        const dayId = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
        
        const hasTimesForDay = interview.available_times?.some(timeRange => 
          timeRange.day_id === dayId
        );
        
        if (!hasTimesForDay) {
          return false;
        }

        const dateISO = date.toISOString().split('T')[0];
        const availableTimesForDate = generateTimeSlots(
          interview.available_times || [],
          parseInt(interview.duration_cycle),
          interview.duration_period || 'minutes',
          dateISO,
          interview.disabled_times || [],
          interview.un_available_times || [],
          transformedData.unavailable_dates || []
        );
        
        return availableTimesForDate.length > 0;
      })
      .sort((a, b) => a - b);

    if (validDates.length === 0) {
      return { defaultDate, defaultTime };
    }

    const firstAvailableDate = validDates[0];
    const formattedDate = firstAvailableDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const dateISO = firstAvailableDate.toISOString().split('T')[0];
    
    const availableTimesForDate = generateTimeSlots(
      interview.available_times || [],
      parseInt(interview.duration_cycle),
      interview.duration_period || 'minutes',
      dateISO,
      interview.disabled_times || [],
      interview.un_available_times || [],
      transformedData.unavailable_dates || [],
      parseInt(interview.rest_cycle || '0')
    );

    const firstAvailableTime = getFirstAvailableTime(
      formattedDate,
      availableTimesForDate.map(time => ({ time })),
      interview.disabled_times || [],
      interview.un_available_times || [],
      transformedData.unavailable_dates || []
    );

    if (firstAvailableTime) {
      defaultDate = formattedDate;
      defaultTime = firstAvailableTime;
      transformedData.available_times = availableTimesForDate.map(time => ({ time }));
    }

    return { defaultDate, defaultTime };
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) {
      throw new Error('Date string is empty or null');
    }
    
    return convertDateToISO(dateString);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time first');
      return;
    }
    
    if (isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)) {
      toast.error('Selected time is not available. Please choose another time.');
      
      const alternativeTime = getFirstAvailableTime(
        selectedDate,
        bookingData.available_times,
        bookingData.disabled_times,
        bookingData.unavailable_times,
        bookingData.unavailable_dates
      );
      if (alternativeTime) {
        setSelectedTime(alternativeTime);
      }
      return;
    }
    
    setShowBookingSummary(true);
  };

  const handleScheduleAppointment = async () => {
    try {
      setIsBooking(true);

      if (!selectedDate || !selectedTime) {
        toast.error('Please select date and time first');
        return;
      }

      if (isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)) {
        toast.error('Selected time is not available. Please choose another time.');
        return;
      }

      let formattedDate;
      try {
        formattedDate = formatDateForAPI(selectedDate);
      } catch (error) {
        toast.error(`Date formatting error: ${error.message}`);
        return;
      }

      const appointmentData = {
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  date: formattedDate,
  time: selectedTime,
  end_time: selectedEndTime,
  time_zone: selectedTimezone,
  code_phone: formData.code_phone,
  address: formData.address || '',
  type: selectedType,
  ...(isInterviewMode && interviewId ? { interview_id: interviewId } : {}),
  ...(selectedStaff ? { staff_id: selectedStaff.id } : {}),
  ...(selectedStaffGroup ? { group_id: selectedStaffGroup.group_id} : {}),
  ...(selectedResource ? { resource_id: selectedResource.id } : {})
};

      const apiEndpoint = `https://backend-booking.appointroll.com/api/public/interview/${bookingData?.id}/book`;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      
      const navigationPath = getNavigationPath();
      navigate(navigationPath, {
        state:{
          data: responseData,
          share_link:share_link
        } 

      });

      const approve_appo = localStorage.getItem('approve_appo');
      toast.success(
        approve_appo == 1 ? 'Appointment Created Successfully, but is pending approval' : "Appointment Created Successfully",
        {
          position: 'top-center',
          duration: 5000,
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '500',
          },
        }
      );

      setShowBookingSummary(false);
      setFormData({ name: '', email: '', phone: '', code_phone: '+20', address: '' });

      const newDisabledTime = {
        date: formattedDate,
        time: selectedTime + ':00'
      };

      setBookingData(prevData => ({
        ...prevData,
        disabled_times: [...prevData.disabled_times, newDisabledTime]
      }));

      const alternativeTime = getFirstAvailableTime(
        selectedDate,
        bookingData.available_times,
        [...bookingData.disabled_times, newDisabledTime],
        bookingData.unavailable_times,
        bookingData.unavailable_dates
      );
      if (alternativeTime) {
        setSelectedTime(alternativeTime);
      } else {
        setSelectedTime('');
      }

    } catch (error) {
      if (error.errors) {
        console.log(error);
        
        Object.values(error.errors).flat().forEach(errMsg => {
          toast.error(errMsg, {
            position: 'top-center',
            duration: 4000,
            style: {
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
              padding: '12px 16px',
            },
          });
        });
      } else {
        toast.error(error.message || 'Unknown error');
      }
    } finally {
      setIsBooking(false);
    }
  };
const calculatePriceBasedOnTime = (startTime, endTime, durationCycle, durationPeriod, restCycle, price) => {
  if (!startTime || !endTime || !price) return { slots: 0, total: 0 };
  
  // تحويل الأوقات إلى دقائق
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startInMinutes = startHours * 60 + startMinutes;
  const endInMinutes = endHours * 60 + endMinutes;
  
  // حساب الفرق بالدقائق
  const diffInMinutes = endInMinutes - startInMinutes;
  
  // تحويل مدة الفترة إلى دقائق
  const slotDurationInMinutes = durationPeriod === "hours" 
    ? durationCycle * 60 
    : durationCycle;
  
  // إضافة rest_cycle لكل فترة
  const restInMinutes = parseInt(restCycle) || 0;
  const totalSlotDuration = slotDurationInMinutes + restInMinutes; // duration + rest
  
  // حساب عدد الفترات
  // نستخدم slotDurationInMinutes فقط (بدون rest) لآخر فترة
  const slots = Math.ceil((diffInMinutes - restInMinutes) / totalSlotDuration);
  
  // حساب السعر الإجمالي
  const total = slots * parseFloat(price);
  
  return { slots, total, totalSlotDuration };
};
useEffect(() => {
  if (requireEndTime && selectedTime && selectedEndTime && bookingData?.price) {
    const { slots, total } = calculatePriceBasedOnTime(
      selectedTime,
      selectedEndTime,
      parseInt(bookingData.duration_cycle),
      bookingData.duration_period,
      parseInt(bookingData.rest_cycle || '0'),
      bookingData.price
    );
    
    setNumberOfSlots(slots);
    setTotalPrice(total);
  } else {
    setNumberOfSlots(0);
    setTotalPrice(0);
  }
}, [selectedTime, selectedEndTime, requireEndTime, bookingData]);

  // useEffect hooks
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const interviewId = id || share_link; 
        if (!interviewId) return;

        const interview = await fetchInterviewData(interviewId);
        const transformedData = transformInterviewData(interview);
        const { defaultDate, defaultTime } = findDefaultDateTime(transformedData, selectedStaff || interview);
        
        setBookingData(transformedData);
        
        if (defaultDate) {
          setSelectedDate(defaultDate);
          if (defaultTime) {
            setSelectedTime(defaultTime);
          }
        }
        
      } catch (err) {
        setError(err.message || 'Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingData();
    }
  }, [id]); 

  useEffect(() => {
    if (!selectedStaff) return;

    const sourceData = selectedStaff;
    
    const updatedData = {
      ...bookingData,
      available_dates: sourceData.available_dates || [],
      unavailable_dates: sourceData.un_available_dates || [],
      unavailable_times: sourceData.un_available_times || [],
      available_times: sourceData.available_times || [],
      disabled_times: sourceData.disabled_times || [],
      raw_available_times: sourceData.available_times,
      duration_cycle: bookingData?.duration_cycle,
      duration_period: bookingData?.duration_period,
      rest_cycle: bookingData?.rest_cycle || '0',
    };

    setBookingData(updatedData);

    const { defaultDate, defaultTime } = findDefaultDateTime(updatedData, sourceData);
    
    if (defaultDate) {
      setSelectedDate(defaultDate);
      if (defaultTime) {
        setSelectedTime(defaultTime);
      }
    } else {
      setSelectedDate('');
      setSelectedTime('');
    }
  }, [selectedStaff]);

useEffect(() => {
  if (!selectedStaffGroup) return;

  const updatedData = {
    ...bookingData,
    available_dates: selectedStaffGroup.collective_available_dates || [],
    unavailable_dates: selectedStaffGroup.collective_unavailable_dates || [], // ✅ أضفها
    unavailable_times: selectedStaffGroup.collective_unavailable_times || [],
    available_times: selectedStaffGroup.collective_available_times || [],
    disabled_times: selectedStaffGroup.disabled_times || [],
    raw_available_times: selectedStaffGroup.collective_available_times || [],
    duration_cycle: bookingData?.duration_cycle,
    duration_period: bookingData?.duration_period,
    rest_cycle: bookingData?.rest_cycle || '0',
  };

  setBookingData(updatedData);

  const { defaultDate, defaultTime } = findDefaultDateTime(updatedData, selectedStaffGroup);
  
  if (defaultDate) {
    setSelectedDate(defaultDate);
    if (defaultTime) {
      setSelectedTime(defaultTime);
    }
  } else {
    setSelectedDate('');
    setSelectedTime('');
  }
}, [selectedStaffGroup]);
useEffect(() => {
  if (requireEndTime && selectedTime && bookingData) {
    const calculatedEndTime = calculateEndTime(
      selectedTime,
      parseInt(bookingData.duration_cycle),
      bookingData.duration_period,
      parseInt(bookingData.rest_cycle || 0) 
    );
    setSelectedEndTime(calculatedEndTime);
  }
}, [selectedTime, requireEndTime, bookingData]);

useEffect(() => {
  if (!selectedResource) {
    lastResourceIdRef.current = null;
    return;
  }

  if (lastResourceIdRef.current === selectedResource.id) {
    return; 
  }

  lastResourceIdRef.current = selectedResource.id;

  const sourceData = {
    available_dates: bookingData?.available_dates || [],
    unavailable_dates: bookingData?.unavailable_dates || [],
    unavailable_times: bookingData?.unavailable_times || [],
    available_times: bookingData?.available_times || [],
    disabled_times: selectedResource.disabled_times || [] 
  };
  
  const updatedData = {
    ...bookingData,
    disabled_times: sourceData.disabled_times,
    raw_available_times: bookingData?.raw_available_times,
    duration_cycle: bookingData?.duration_cycle,
    duration_period: bookingData?.duration_period,
    rest_cycle: bookingData?.rest_cycle || '0',
  };

  setBookingData(updatedData);

  if (selectedDate && bookingData?.raw_available_times) {
    const formattedDate = convertDateToISO(selectedDate);
    
    const availableTimesForDate = generateTimeSlots(
      bookingData.raw_available_times,
      parseInt(bookingData.duration_cycle),
      bookingData.duration_period || 'minutes',
      formattedDate,
      sourceData.disabled_times,
      bookingData.unavailable_times || [],
      bookingData.unavailable_dates || [],
      parseInt(bookingData.rest_cycle || '0')
    );

    setBookingData(prev => ({
      ...prev,
      available_times: availableTimesForDate.map(time => ({ time })),
      disabled_times: sourceData.disabled_times
    }));

    const firstAvailableTime = getFirstAvailableTime(
      selectedDate,
      availableTimesForDate.map(time => ({ time })),
      sourceData.disabled_times,
      bookingData.unavailable_times || [],
      bookingData.unavailable_dates || []
    );

    if (firstAvailableTime) {
      setSelectedTime(firstAvailableTime);
    } else {
      setSelectedTime('');
    }
  }
}, [selectedResource, selectedDate, bookingData?.raw_available_times]);



  useEffect(() => {
    if (!id || !bookingData) return;

    const intervalId = setInterval(async () => {
      try {
        const interview = await fetchInterviewData(id);
        const newDisabledTimes = interview.disabled_times || [];
        
        if (JSON.stringify(newDisabledTimes) !== JSON.stringify(bookingData.disabled_times)) {
          setBookingData(prevData => ({
            ...prevData,
            disabled_times: newDisabledTimes
          }));
          
          if (selectedDate && selectedTime && isTimeDisabled(selectedDate, selectedTime, newDisabledTimes)) {
            const alternativeTime = getFirstAvailableTime(
              selectedDate,
              bookingData.available_times,
              newDisabledTimes,
              bookingData.unavailable_times,
              bookingData.unavailable_dates
            );
          }
        }
      } catch (error) {
        // Silent error handling
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [id, bookingData, selectedDate, selectedTime]);

  return {
    bookingData,
    loading,
    error,
    selectedService,
    selectedTimezone,
    selectedDate,
    selectedTime,
    formData,
    isBooking,
    showBookingSummary,
    showTimeModal,
    showCalendarModal,
    
    setSelectedService,
    setSelectedTimezone,
    setSelectedDate,
    setSelectedTime,
    setFormData,
    setIsBooking,
    setShowBookingSummary,
    setShowTimeModal,
    setShowCalendarModal,
    
    handleBookAppointment,
    handleScheduleAppointment,
    isTimeDisabled,
    getFirstAvailableTime,
    generateTimeSlots,
    isDateUnavailable,
    convertDateToISO,

    availableStaff,
    selectedStaff,
    setSelectedStaff,
    availableStaffGroups,
  selectedStaffGroup,
  setSelectedStaffGroup,
    requireEndTime,
  selectedEndTime,
  setSelectedEndTime,
  calculateEndTime,
  availableResources,
  selectedResource,
  setSelectedResource,
   selectedType,  
  setSelectedType,
   totalPrice,
  numberOfSlots,
  calculatePriceBasedOnTime,
  };
};

export default useBookingLogic;