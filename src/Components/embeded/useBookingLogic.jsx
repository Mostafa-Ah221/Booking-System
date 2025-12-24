import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const useBookingLogic = (id, navigate, isInterviewMode, interviewId, share_link, isStaff,setTheme,theme) => {
  const location = useLocation();
  
  
  // State management
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  const [selectedService, setSelectedService] = useState('demo');
const getDefaultTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone; 
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

const convertDisabledTimesToTimezone = (disabledTimes, targetTimezone) => {
  if (!disabledTimes || !Array.isArray(disabledTimes)) return [];
  
  const WORKSPACE_TIMEZONE = 'Africa/Cairo';

  return disabledTimes.map(disabled => {
    try {
      let { date: originalDate, time } = disabled;
      if (!originalDate || !time) return disabled;

      // 1. لو التاريخ جاي ISO (مثل 2025-12-08) → استخدمه مباشرة
      let isoDate = originalDate;
      if (!originalDate.includes('-') || originalDate.split('-')[0].length !== 4) {
        // لو مش ISO → حوله
        isoDate = convertDateToISO(originalDate);
      }

      if (!isoDate) {
        console.warn('Could not parse disabled date:', originalDate);
        return { date: originalDate, time };
      }

      // 2. حوّل الوقت من Cairo → الـ timezone المستخدم
      const [hours, minutes] = time.split(':').map(Number);
      const utcDate = new Date(`${isoDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00Z`);

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: targetTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(utcDate);
      const year = parts.find(p => p.type === 'year').value;
      const month = parts.find(p => p.type === 'month').value;
      const day = parts.find(p => p.type === 'day').value;
      const hour = parts.find(p => p.type === 'hour').value;
      const minute = parts.find(p => p.type === 'minute').value;

      const convertedISO = `${year}-${month}-${day}`;
      const convertedTime = `${hour}:${minute}:00`;

      return { date: convertedISO, time: convertedTime };
    } catch (error) {
      console.warn('Failed to convert disabled time:', disabled, error);
      return disabled;
    }
  });
};

const convertDateTimeWithTimezone = (dateStr, timeStr, targetTimezone) => {
  try {
    // 1. تحويل التاريخ لـ ISO
    const isoDate = convertDateToISO(dateStr);
    if (!isoDate) return { date: dateStr, time: timeStr };

    // 2. الوقت من الباك هو UTC (مثال: 04:30:00)
    const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
    
    // 3. إنشاء Date object بـ UTC
    // ⚠️ المفتاح: استخدم Date.UTC() بدل string مع Z
    const utcTimestamp = Date.UTC(
      parseInt(isoDate.split('-')[0]), // year
      parseInt(isoDate.split('-')[1]) - 1, // month (0-indexed)
      parseInt(isoDate.split('-')[2]), // day
      hours,
      minutes,
      seconds
    );
    
    const utcDate = new Date(utcTimestamp);

    // 4. تحويل للـ target timezone
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: targetTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const formatted = formatter.format(utcDate);
    // formatted مثال: "06/12/2025, 06:30"
    
    const [datePart, timePart] = formatted.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    const newTime = `${hour}:${minute}`;

    console.log(`🔄 UTC ${timeStr} → ${targetTimezone} ${newTime}`);
    return { date: newDate, time: newTime };
  } catch (err) {
    console.error('❌ Conversion failed:', err);
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
  targetTimezone = 'Africa/Cairo'
) => {
  if (!availableTimes || !Array.isArray(availableTimes) || !selectedDate) {
    return [];
  }

  const formattedDate = convertDateToISO(selectedDate);
  if (!formattedDate) return [];

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

  const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
  const restInMinutes = restCycle;

  const utcTimeSlots = [];

  // ── 1️⃣ توليد الأوقات بـ UTC أولاً ──────────────────────────
  timeRangesForSelectedDay.forEach(range => {
    if (!range?.from || !range?.to) return;
    
    const [fromH, fromM] = range.from.split(':').map(Number);
    const [toH, toM] = range.to.split(':').map(Number);
    
    let currentMinutes = fromH * 60 + fromM;
    const endMinutes = toH * 60 + toM;

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      const endTimeMinutes = currentMinutes + durationInMinutes;
      if (endTimeMinutes > endMinutes) break;

      utcTimeSlots.push(timeStr);
      currentMinutes += durationInMinutes + restInMinutes;
    }
  });

  // ── 2️⃣ تحويل كل وقت من UTC → Target Timezone ───────────────
  const convertedSlots = [];
  
  utcTimeSlots.forEach(utcTime => {
    const converted = convertDateTimeWithTimezone(selectedDate, utcTime, targetTimezone);
    
    // تأكد أن التاريخ المحول = التاريخ المطلوب
    if (converted.date === selectedDate) {
      const isoDate = convertDateToISO(converted.date);
      const disabled = disabledTimes.some(d => 
        d.date === isoDate && d.time.startsWith(converted.time)
      );
      const past = isTimePast(converted.date, converted.time);
      
      if (!disabled && !past) {
        convertedSlots.push(converted.time);
      }
    }
  });

  // ── 3️⃣ إزالة التكرار وترتيب ──────────────────────────────
  const unique = [...new Set(convertedSlots)].sort((a, b) => {
    const [ha, ma] = a.split(':').map(Number);
    const [hb, mb] = b.split(':').map(Number);
    return ha * 60 + ma - (hb * 60 + mb);
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

const isTimeDisabled = (date, time, disabledTimes = []) => {
  if (!date || !time || !Array.isArray(disabledTimes)) return false;

  const isoDate = convertDateToISO(date); // "08 Dec 2025" → "2025-12-08"
  const timePrefix = time.slice(0, 5);   // "09:00" → "09:00"

  return disabledTimes.some(d => {
    return d.date === isoDate && d.time.startsWith(timePrefix);
  });
};

useEffect(() => {
  if (!selectedDate || !bookingData?.raw_available_times) return;

  const isoDate = convertDateToISO(selectedDate);
  if (!isoDate) return;

  const userTimezone = selectedTimezone || 'Africa/Cairo';

  const convertedDisabledTimes = (bookingData.disabled_times || []).map(disabled => {
    try {
      let { date: origDate, time } = disabled;
      if (!origDate || !time) return disabled;
      let dateISO = origDate;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(origDate)) {
        dateISO = convertDateToISO(origDate);
      }
      if (!dateISO) return disabled;

      const [year, month, day] = dateISO.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const tempDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;

      const converted = convertDateTimeWithTimezone(tempDate, time, userTimezone);
      const convertedISO = convertDateToISO(converted.date);

      return {
        date: convertedISO,
        time: converted.time + ':00'
      };
    } catch (err) {
      console.warn('Failed to convert disabled time:', disabled, err);
      return disabled;
    }
  });

  // بناء lookup
  const disabledMap = {};
  convertedDisabledTimes.forEach(d => {
    if (d.date === isoDate) {
      disabledMap[d.time.slice(0, 5)] = true;
    }
  });

  // توليد الأوقات
  const times = generateTimeSlots(
    bookingData.raw_available_times,
    parseInt(bookingData.duration_cycle),
    bookingData.duration_period || 'minutes',
    selectedDate,
    convertedDisabledTimes,
    bookingData.unavailable_times || [],
    bookingData.unavailable_dates || [],
    parseInt(bookingData.rest_cycle || '0'),
    userTimezone
  );

  setBookingData(prev => ({
    ...prev,
    available_times: times.map(t => ({ time: t })),
    converted_disabled_times: convertedDisabledTimes,
  }));

  if (times.length > 0) {
    setSelectedTime(prev => prev && times.includes(prev) ? prev : times[0]);
  } else {
    setSelectedTime('');
  }

}, [selectedDate, selectedTimezone, bookingData?.raw_available_times]);

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
  
   return {
    interview,
    theme: apiData.data?.theme || null
  };
};

 const calculateEndTime = (startTime, durationCycle, durationPeriod, restCycle = 0) => {
  if (!startTime) return '';
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  
  const durationInMinutes = durationPeriod === "hours" 
    ? durationCycle * 60 
    : durationCycle;
  
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

const findDefaultDateTime = (transformedData) => {


  if (!transformedData?.available_dates?.length || !transformedData?.raw_available_times?.length) {
 
    return { defaultDate: null, defaultTime: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const possibleDates = [];


 transformedData.available_dates.forEach(range => {
    try {

      let fromISO = range.from;
      if (range.from.includes(' ')) {
        fromISO = convertDateToISO(range.from.split(' ')[0]) || convertDateToISO(range.from);
      }
      
      let toISO = range.to || range.from;
      if (toISO.includes(' ')) {
        toISO = convertDateToISO(toISO.split(' ')[0]) || convertDateToISO(toISO);
      }
      
      if (!fromISO || !toISO) {
        console.warn('⚠️ Could not parse date range:', range);
        return;
      }
      
      const from = new Date(fromISO + 'T00:00:00.000Z');
      const to = new Date(toISO + 'T00:00:00.000Z');
      
      let current = new Date(from);
      while (current <= to) {
        if (current >= today) {
          const formatted = current.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
          possibleDates.push(formatted);
        }
        current.setDate(current.getDate() + 1);
      }
    } catch (e) {
      console.error('❌ Error parsing date range:', range, e);
    }
  });


  if (possibleDates.length === 0) {
    return { defaultDate: null, defaultTime: null };
  }

  possibleDates.sort((a, b) => new Date(a) - new Date(b));

  const userTimezone = selectedTimezone || WORKSPACE_TIMEZONE;

  const convertedDisabledTimes = (transformedData.disabled_times || []).map(disabled => {
    try {
      let { date: origDate, time } = disabled;
      if (!origDate || !time) return disabled;

      let dateISO = origDate;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(origDate)) {
        dateISO = convertDateToISO(origDate);
      }
      if (!dateISO) return disabled;

      const [h, m] = time.split(':').map(Number);
      const utcDateTime = new Date(`${dateISO}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`);

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: userTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(utcDateTime);
      const map = parts.reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});

      return {
        date: `${map.year}-${map.month}-${map.day}`,
        time: `${map.hour}:${map.minute}:00`
      };
    } catch (err) {
      console.error('❌ Error converting disabled time:', disabled, err);
      return disabled;
    }
  });

  console.log('✅ Converted disabled times:', convertedDisabledTimes.length);

  // 3️⃣ دالة توليد الأوقات
  const generateTimesForDay = (targetISODate) => {
    const times = generateTimeSlots(
      transformedData.raw_available_times,
      parseInt(transformedData.duration_cycle),
      transformedData.duration_period || 'minutes',
      targetISODate,
      [],
      transformedData.unavailable_times || [],
      transformedData.unavailable_dates || [],
      parseInt(transformedData.rest_cycle || '0'),
      WORKSPACE_TIMEZONE
    );
    console.log(`⏰ Generated ${times.length} times for ${targetISODate}`);
    return times;
  };

  // 4️⃣ دالة التحويل والفحص
  const convertAndCheck = (cairoDateStr, cairoTime, targetDateStr, isoDate, disabledMap) => {
    const converted = convertDateTimeWithTimezone(
      cairoDateStr,
      cairoTime,
      WORKSPACE_TIMEZONE,
      userTimezone
    );

    if (converted.date !== targetDateStr) return null;

    const timeKey = converted.time.slice(0, 5);
    const isDisabled = !!disabledMap[timeKey];
    const isPast = isTimePast(targetDateStr, converted.time);

    return (!isDisabled && !isPast) ? converted.time : null;
  };

  // 5️⃣ البحث في كل يوم
  for (let i = 0; i < possibleDates.length; i++) {
    const dateStr = possibleDates[i];
    console.log(`\n🔍 Checking date ${i + 1}/${possibleDates.length}: ${dateStr}`);
    
    const isoDate = convertDateToISO(dateStr);
    if (!isoDate) {
      console.log('❌ Failed to convert to ISO');
      continue;
    }

    // بناء lookup
    const disabledMap = {};
    convertedDisabledTimes.forEach(d => {
      if (d.date === isoDate) {
        disabledMap[d.time.slice(0, 5)] = true;
      }
    });

    console.log(`🚫 Disabled times for this date: ${Object.keys(disabledMap).length}`);

    const allUserTimes = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // اليوم الحالي
    console.log('  📍 Checking current day...');
    const currentDayTimes = generateTimesForDay(isoDate);
    currentDayTimes.forEach(time => {
      const result = convertAndCheck(dateStr, time, dateStr, isoDate, disabledMap);
      if (result) allUserTimes.push(result);
    });
    console.log(`    ✓ Found ${allUserTimes.length} times from current day`);

    // اليوم السابق
    if (userTimezone !== WORKSPACE_TIMEZONE) {
      console.log('  📍 Checking previous day...');
      const prevDate = new Date(isoDate + 'T00:00:00.000Z');
      prevDate.setUTCDate(prevDate.getUTCDate() - 1);
      const prevISO = prevDate.toISOString().split('T')[0];
      const prevTimes = generateTimesForDay(prevISO);
      const prevDay = String(prevDate.getUTCDate()).padStart(2, '0');
      const prevMonth = monthNames[prevDate.getUTCMonth()];
      const prevYear = prevDate.getUTCFullYear();
      const prevDateStr = `${prevDay} ${prevMonth} ${prevYear}`;

      let prevCount = 0;
      prevTimes.forEach(time => {
        const result = convertAndCheck(prevDateStr, time, dateStr, isoDate, disabledMap);
        if (result) {
          allUserTimes.push(result);
          prevCount++;
        }
      });
      console.log(`    ✓ Found ${prevCount} times from previous day`);
    }

    // اليوم التالي
    if (userTimezone !== WORKSPACE_TIMEZONE) {
      console.log('  📍 Checking next day...');
      const nextDate = new Date(isoDate + 'T00:00:00.000Z');
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      const nextISO = nextDate.toISOString().split('T')[0];
      const nextTimes = generateTimesForDay(nextISO);
      const nextDay = String(nextDate.getUTCDate()).padStart(2, '0');
      const nextMonth = monthNames[nextDate.getUTCMonth()];
      const nextYear = nextDate.getUTCFullYear();
      const nextDateStr = `${nextDay} ${nextMonth} ${nextYear}`;

      let nextCount = 0;
      nextTimes.forEach(time => {
        const result = convertAndCheck(nextDateStr, time, dateStr, isoDate, disabledMap);
        if (result) {
          allUserTimes.push(result);
          nextCount++;
        }
      });
      console.log(`    ✓ Found ${nextCount} times from next day`);
    }

    // إزالة التكرارات وترتيب
    const uniqueTimes = [...new Set(allUserTimes)].sort((a, b) => {
      const [ha, ma] = a.split(':').map(Number);
      const [hb, mb] = b.split(':').map(Number);
      return ha * 60 + ma - (hb * 60 + mb);
    });

    console.log(`📊 Total unique times: ${uniqueTimes.length}`);

    if (uniqueTimes.length > 0) {
      console.log(`✅ SUCCESS! Returning: ${dateStr} @ ${uniqueTimes[0]}`);
      return { defaultDate: dateStr, defaultTime: uniqueTimes[0] };
    }
  }

  console.log('⚠️ No valid times found anywhere, returning first date without time');
  return { defaultDate: possibleDates[0], defaultTime: null };
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
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const interviewId = id || share_link;
      if (!interviewId) return;

            const { interview, theme: fetchedTheme } = await fetchInterviewData(interviewId);
      if (fetchedTheme && !theme && typeof setTheme === 'function') {
        setTheme(fetchedTheme);
      }
      const transformedData = transformInterviewData(interview);


      setBookingData(transformedData);

      if (!transformedData.available_dates?.length) {
        setLoading(false);
        return;
      }

      let firstAvailableDate = null;
      let firstAvailableTime = null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const possibleDates = [];

      transformedData.available_dates.forEach(range => {
        try {
          const from = new Date(range.from.split(' ')[0]);
          const to = new Date((range.to || range.from).split(' ')[0]);

          let current = new Date(from);
          while (current <= to) {
            if (current >= today) {
              const formatted = current.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
              possibleDates.push(formatted);
            }
            current.setDate(current.getDate() + 1);
          }
        } catch (e) {}
      });

      possibleDates.sort((a, b) => new Date(a) - new Date(b));

      for (const dateStr of possibleDates) {
        const isoDate = convertDateToISO(dateStr);
        if (!isoDate) continue;

        const times = generateTimeSlots(
          transformedData.raw_available_times || [],
          parseInt(transformedData.duration_cycle),
          transformedData.duration_period || 'minutes',
          isoDate,
          transformedData.disabled_times || [],
          transformedData.unavailable_times || [],
          transformedData.unavailable_dates || [],
          parseInt(transformedData.rest_cycle || '0'),
          WORKSPACE_TIMEZONE
        );

        const validTimes = times.filter(time => {
          const isDisabled = (transformedData.disabled_times || []).some(d =>
            d.date === isoDate && d.time.startsWith(time)
          );
          const isPast = isTimePast(dateStr, time);
          return !isDisabled && !isPast;
        });

        if (validTimes.length > 0) {
          firstAvailableDate = dateStr;
          firstAvailableTime = validTimes[0];
          break;
        }
      }

      if (!firstAvailableDate && possibleDates.length > 0) {
        firstAvailableDate = possibleDates[0];
      }

      if (firstAvailableDate) {
        setSelectedDate(firstAvailableDate);
        if (firstAvailableTime) {
          setSelectedTime(firstAvailableTime);
        }
      }

    } catch (err) {
      console.error(err);
      setError('Failed to load booking data');
    } finally {
      setLoading(false);
    }
  };

  if (id || share_link) {
    loadInitialData();
  }
}, [id, share_link,selectedTimezone]); 

useEffect(() => {
  console.log('🔍 selectedStaff changed:', selectedStaff?.name);
  
  if (!selectedStaff || !bookingData?.duration_cycle) {
    return;
  }

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

  console.log('📊 Setting bookingData with:', {
    raw_available_times: updatedData.raw_available_times?.length,
    duration: updatedData.duration_cycle + updatedData.duration_period
  });

  setBookingData(updatedData);

  console.log('🕐 Calling findDefaultDateTime...');
  const { defaultDate, defaultTime } = findDefaultDateTime(updatedData);
  console.log('✅ Result:', { defaultDate, defaultTime });
  
  if (defaultDate) {
    setSelectedDate(defaultDate);
    if (defaultTime) {
      setSelectedTime(defaultTime);
    }
  } else {
    setSelectedDate('');
    setSelectedTime('');
  }
}, [selectedStaff, selectedTimezone, bookingData?.duration_cycle]);

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

  const { defaultDate, defaultTime } = findDefaultDateTime(updatedData);
  
  if (defaultDate) {
    setSelectedDate(defaultDate);
    if (defaultTime) {
      setSelectedTime(defaultTime);
    }
  } else {
    setSelectedDate('');
    setSelectedTime('');
  }
}, [selectedStaffGroup,selectedTimezone]);
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
}, [selectedResource, selectedDate, bookingData?.raw_available_times, selectedTimezone]);


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