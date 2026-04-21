import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const useBookingLogic = (id, navigate, isInterviewMode, interviewId, share_link, isStaff,setTheme,theme) => {
  const location = useLocation();
  
  
  // State management
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [displayedTimes, setDisplayedTimes] = useState([]);
  const [selectedService, setSelectedService] = useState('demo');
  const [modalDisplayedTimes, setModalDisplayedTimes] = useState([]);

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
    code_phone: '',
    address: ''
  });
  
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const WORKSPACE_TIMEZONE = 'Africa/Cairo';
 const lastFetchTimeRef = useRef(0);
 const FETCH_COOLDOWN = 60000; 
  const getNavigationPath = (token = '') => {
  const pathname = location.pathname;
  const pathParts = pathname.split("/").filter(Boolean);
  const orgBase = pathParts[0];
console.log(token);

  const tokenQuery = token ? `?apptok=${token}` : '';

  if (pathname.includes("/w/")) {
    const workspaceSlug = pathParts[2];
    return `/${orgBase}/w/${workspaceSlug}/appointmentConfirmation${tokenQuery}`;
  } 
  else if (pathname.includes("/s/")) {
    const staffSlug = pathParts[2];
    return `/${orgBase}/s/${staffSlug}/appointmentConfirmation${tokenQuery}`;
  } 
  else if (pathname.includes("/service/")) {
    const serviceSlug = pathParts[2];
    return `/${orgBase}/service/${serviceSlug}/appointmentConfirmation${tokenQuery}`;
  } 
  else {
    return `/${orgBase}/appointmentConfirmation${tokenQuery}`;
  }
};
const convertDisabledTimesToTimezone = (disabledTimes, targetTimezone) => {
  if (!disabledTimes || !Array.isArray(disabledTimes)) return [];
  
  const WORKSPACE_TIMEZONE = 'Africa/Cairo';

  return disabledTimes.map(disabled => {
    try {
      let { date: originalDate, time } = disabled;
      if (!originalDate || !time) return disabled;

      // 1. لو التاريخ جاي ISO (مثل 2026-12-08) → استخدمه مباشرة
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

const refreshTimesForModal = (date) => {
  if (!date || !bookingData?.raw_available_times) {
    setModalDisplayedTimes([]);
    return;
  }

  const isoDate = convertDateToISO(date);
  if (!isoDate) {
    setModalDisplayedTimes([]);
    return;
  }

  const userTimezone = selectedTimezone || WORKSPACE_TIMEZONE;
const convertedDisabledTimes = (bookingData.disabled_times || []).map(disabled => {
    try {
        let { date: origDate, time } = disabled;
        if (!origDate || !time) return disabled;

        // الباك بيرجع UTC date + UTC time
        let dateISO = origDate;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(origDate)) {
            dateISO = convertDateToISO(origDate);
        }
        if (!dateISO) return disabled;

        const [h, m] = time.split(':').map(Number);
        
        // ✅ صح: بنبني UTC timestamp صريح
        const utcDate = new Date(Date.UTC(
            parseInt(dateISO.split('-')[0]),
            parseInt(dateISO.split('-')[1]) - 1,
            parseInt(dateISO.split('-')[2]),
            h, m, 0
        ));

        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: userTimezone, // timezone المستخدم
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false,
        });

        const parts = formatter.formatToParts(utcDate);
        const map = parts.reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

        return {
            date: `${map.year}-${map.month}-${map.day}`,
            time: `${map.hour}:${map.minute}:00`
        };
    } catch (err) {
        return disabled;
    }
});

  const times = generateTimeSlots(
    bookingData.raw_available_times,
    parseInt(bookingData.duration_cycle),
    bookingData.duration_period || 'minutes',
    date,
    convertedDisabledTimes,
    bookingData.unavailable_times || [],
    bookingData.unavailable_dates || [],
    parseInt(bookingData.rest_cycle || '0'),
    userTimezone
  );

  console.log(`🔄 Refreshed times for modal on ${date}:`, times);
  setModalDisplayedTimes(times);
};
const convertDateTimeWithTimezone = (dateStr, timeStr, targetTimezone) => {
  try {
    // 1. تحويل التاريخ لـ ISO
    const isoDate = convertDateToISO(dateStr);
    if (!isoDate) return { date: dateStr, time: timeStr };

    // 2. الوقت من الباك هو UTC (مثال: 04:30:00)
    const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
    
    // 3. إنشاء Date object بـ UTC
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
  durationCycle ,
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

  // Helper: Convert "08 Dec 2026" → "2026-12-08"
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

  const formattedDate = convertDateToISO(selectedDate);
  if (!formattedDate) {
    console.log('❌ Could not convert selectedDate to ISO:', selectedDate);
    return [];
  }

  // Helper: Get day_id from ISO date (1=Sunday, 7=Saturday)
  const getDayOfWeekFromDate = (isoDateString) => {
    const date = new Date(isoDateString + 'T00:00:00.000Z');
    if (isNaN(date.getTime())) return null;
    const dayOfWeek = date.getUTCDay();
    return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
  };

  // Helper: Time string to minutes
  const timeToMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper: Check if time is in unavailable range
const isTimeInUnavailableRange = (timeStr, dayId) => {
  if (!unavailableTimes?.length) return false;
  const timeMinutes = timeToMinutes(timeStr);
  return unavailableTimes.some(range => {
    if (Number(range.day_id) !== Number(dayId)) return false;
    const fromMinutes = timeToMinutes(range.from);
    if (!range.to || range.to === null) {
      return timeMinutes >= fromMinutes;
    }
    const toMinutes = timeToMinutes(range.to);
    return timeMinutes >= fromMinutes && timeMinutes < toMinutes;
  });
};

 const isTimePast = (targetIsoDate, localTimeStr, targetTimezone) => {
  try {
    const [hours, minutes] = localTimeStr.split(':').map(Number);

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: targetTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const dateParts = targetIsoDate.split('-');
    const testDate = new Date(Date.UTC(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2]),
      hours,
      minutes,
      0
    ));

    const formattedParts = formatter.formatToParts(testDate);
    const partsMap = formattedParts.reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

    const localDateTime = new Date(
      `${partsMap.year}-${partsMap.month}-${partsMap.day}T${partsMap.hour}:${partsMap.minute}:00`
    );

    return localDateTime < new Date();
  } catch (error) {
    console.error('Error in isTimePast:', error);
    return false;
  }
};

  // Helper: Convert UTC time to target timezone
 const convertUTCTimeToTimezone = (utcDateISO, utcTime, targetTz) => {
  try {
    const [hours, minutes] = utcTime.split(':').map(Number);
    const utcTimestamp = Date.UTC(
      parseInt(utcDateISO.split('-')[0]),
      parseInt(utcDateISO.split('-')[1]) - 1,
      parseInt(utcDateISO.split('-')[2]),
      hours, minutes, 0
    );
    const utcDate = new Date(utcTimestamp);

    // ✅ استخدم formatToParts بدل format + split
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: targetTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(utcDate);
    const map = parts.reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

    // fix hour "24" bug
    let hour = map.hour;
    if (hour === '24') hour = '00';

    const isoDate = `${map.year}-${map.month}-${map.day}`;
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const newDate = `${map.day} ${monthNames[parseInt(map.month) - 1]} ${map.year}`;
    const newTime = `${hour}:${map.minute}`;

    return { date: newDate, time: newTime, isoDate };
  } catch (err) {
    console.error('❌ Conversion failed:', err);
    return null;
  }
};

  // Helper: Generate UTC slots for a specific day_id
const generateUTCSlotsForDay = (dayId) => {
  const timeRangesForDay = availableTimes.filter(
    tr => tr && Number(tr.day_id) === Number(dayId)
  );

  if (timeRangesForDay.length === 0) {
    return [];
  }

  const slots = [];
  const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
  const restInMinutes = parseInt(restCycle) || 0;

  timeRangesForDay.forEach(range => {
    if (!range?.from || !range?.to) return;
    
    const [fromH, fromM] = range.from.split(':').map(Number);
    const [toH, toM] = range.to.split(':').map(Number);
    
    let currentMinutes = fromH * 60 + fromM;
    const endMinutes = toH * 60 + toM;
    
    let lastValidSlot = null;

   while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      const endTimeMinutes = currentMinutes + durationInMinutes;
      if (endTimeMinutes > endMinutes) break;

      if (!isTimeInUnavailableRange(timeStr, dayId)) {
        slots.push(timeStr);
        currentMinutes += durationInMinutes + restInMinutes;
      } else {
        currentMinutes += 1;
      }
    }
  });

  return slots;
};

  // ═══════════════════════ Main Logic ═══════════════════════
  
  const convertedSlots = [];
  const targetDateISO = formattedDate;

  // Get 3 days: previous, current, next
  const dates = [];
  
  // Previous day
  const prevDate = new Date(formattedDate + 'T00:00:00.000Z');
  prevDate.setUTCDate(prevDate.getUTCDate() - 1);
  const prevISO = prevDate.toISOString().split('T')[0];
  dates.push({ iso: prevISO, label: 'Previous' });
  
  // Current day
  dates.push({ iso: formattedDate, label: 'Current' });
  
  // Next day
  const nextDate = new Date(formattedDate + 'T00:00:00.000Z');
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  const nextISO = nextDate.toISOString().split('T')[0];
  dates.push({ iso: nextISO, label: 'Next' });

  console.log(`📅 Checking 3 days:`, dates.map(d => `${d.label}: ${d.iso}`).join(', '));

  dates.forEach(({ iso, label }) => {
    const dayId = getDayOfWeekFromDate(iso);
    if (!dayId) {
      console.log(`   ⚠️ ${label} day: Could not get day_id for ${iso}`);
      return;
    }

    console.log(`\n📅 ${label} day: ${iso} (day_id: ${dayId})`);
    const utcSlots = generateUTCSlotsForDay(dayId);
    console.log(`   📌 Generated ${utcSlots.length} UTC slots`);

    if (utcSlots.length === 0) return;

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [y, m, d] = iso.split('-');
    const readableDate = `${d} ${monthNames[parseInt(m)-1]} ${y}`;

   utcSlots.forEach(utcTime => {
  const [hours, minutes] = utcTime.split(':').map(Number);
  const slotUTC = Date.UTC(
    parseInt(iso.split('-')[0]),
    parseInt(iso.split('-')[1]) - 1,
    parseInt(iso.split('-')[2]),
    hours,
    minutes,
    0
  );
  console.log(`🕐 Slot: ${iso} ${utcTime} UTC`);
  console.log(`   slotUTC: ${new Date(slotUTC).toISOString()}`);
  console.log(`   Date.now(): ${new Date(Date.now()).toISOString()}`);
  console.log(`   isPast: ${slotUTC < Date.now()}`);
  if (slotUTC < Date.now()) {
    console.log(`   ⏭️ ${iso} ${utcTime} UTC → skipped (past in UTC)`);
    return;
  }

  const converted = convertUTCTimeToTimezone(iso, utcTime, targetTimezone);
  if (!converted) return;
console.log(`🔄 UTC ${iso} ${utcTime} → ${targetTimezone}: date=${converted.isoDate} time=${converted.time} | targetDate=${targetDateISO} | match=${converted.isoDate === targetDateISO}`);

  if (converted.isoDate !== targetDateISO) {
    return;
  }

  const disabled = disabledTimes.some(d => 
    d.date === targetDateISO && d.time.startsWith(converted.time)
  );

  if (!disabled) {
    convertedSlots.push(converted.time);
  } 
});
  });

  // Remove duplicates and sort
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

  const isoDate = convertDateToISO(date); // "08 Dec 2026" → "2026-12-08"
  const timePrefix = time.slice(0, 5);   // "09:00" → "09:00"

  return disabledTimes.some(d => {
    return d.date === isoDate && d.time.startsWith(timePrefix);
  });
};

useEffect(() => {
  if (!selectedDate || !bookingData?.raw_available_times) return;

  const isoDate = convertDateToISO(selectedDate);
  if (!isoDate) return;

  const userTimezone = selectedTimezone || WORKSPACE_TIMEZONE;

  // ✅ تحويل disabled_times من UTC → user timezone
  const convertedDisabledTimes = (bookingData.disabled_times || []).map(disabled => {
    try {
      let { date: origDate, time } = disabled;
      if (!origDate || !time) return disabled;

      let dateISO = origDate;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(origDate)) {
        dateISO = convertDateToISO(origDate);
      }
      if (!dateISO) return disabled;

      const [h, m] = time.split(':').map(Number);

      console.log(`🔄 Converting disabled: ${dateISO} ${time} UTC → ${userTimezone}`);

      const utcDate = new Date(Date.UTC(
        parseInt(dateISO.split('-')[0]),
        parseInt(dateISO.split('-')[1]) - 1,
        parseInt(dateISO.split('-')[2]),
        h, m, 0
      ));

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: userTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(utcDate);
      const map = parts.reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});

      // ✅ Fix: hour "24" bug
      let hour = map.hour;
      if (hour === '24') hour = '00';

      const convertedISO = `${map.year}-${map.month}-${map.day}`;
      const convertedTime = `${hour}:${map.minute}:00`;

      console.log(`✅ Converted: ${convertedISO} ${convertedTime} (${userTimezone})`);

      return { date: convertedISO, time: convertedTime };
    } catch (err) {
      console.error('❌ Failed to convert disabled time:', disabled, err);
      return disabled;
    }
  });


  const convertedUnavailableTimes = (bookingData.unavailable_times || []).map(unavailable => {
    try {
      if (!unavailable?.day_id || !unavailable?.from || !unavailable?.to) return unavailable;

      const [fromH, fromM] = unavailable.from.split(':').map(Number);
      const [toH, toM] = unavailable.to.split(':').map(Number);

      const referenceDate = new Date();
      const refISO = referenceDate.toISOString().split('T')[0];

      const fromUTC = new Date(Date.UTC(
        parseInt(refISO.split('-')[0]),
        parseInt(refISO.split('-')[1]) - 1,
        parseInt(refISO.split('-')[2]),
        fromH, fromM, 0
      ));

      const toUTC = new Date(Date.UTC(
        parseInt(refISO.split('-')[0]),
        parseInt(refISO.split('-')[1]) - 1,
        parseInt(refISO.split('-')[2]),
        toH, toM, 0
      ));

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: userTimezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const fromParts = formatter.formatToParts(fromUTC);
      const toParts = formatter.formatToParts(toUTC);

      const fromMap = fromParts.reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});
      const toMap = toParts.reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});

      let fromHour = fromMap.hour;
      let toHour = toMap.hour;
      if (fromHour === '24') fromHour = '00';
      if (toHour === '24') toHour = '00';

      return {
        ...unavailable,
        from: `${fromHour}:${fromMap.minute}:00`,
        to: `${toHour}:${toMap.minute}:00`
      };
    } catch (err) {
      console.error('❌ Failed to convert unavailable time:', unavailable, err);
      return unavailable;
    }
  });

  console.log('📋 Converted unavailable times:', convertedUnavailableTimes);

  const times = generateTimeSlots(
    bookingData.raw_available_times,
    parseInt(bookingData.duration_cycle),
    bookingData.duration_period || 'minutes',
    selectedDate,
    convertedDisabledTimes, // ✅ محوّلة
    convertedUnavailableTimes, // ✅ محوّلة الآن
    bookingData.unavailable_dates || [],
    parseInt(bookingData.rest_cycle || '0'),
    userTimezone
  );

  console.log('⏰ Generated times after filtering disabled:', times);

  setDisplayedTimes(times);

  // ✅ خزّن converted_disabled_times في bookingData عشان TimeSelectionSection2 تستخدمها
  setBookingData(prev => ({
    ...prev,
    available_times: times.map(t => ({ time: t })),
    converted_disabled_times: convertedDisabledTimes,
  }));

  if (times.length > 0) {
    if (selectedTime && times.includes(selectedTime)) {
      // keep current
    } else {
      setSelectedTime(times[0]);
    }
  } else {
    setSelectedTime('');
  }

}, [selectedDate, selectedTimezone, bookingData?.raw_available_times, bookingData?.disabled_times]);

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
  
   const url = isStaff && share_link
    ? `https://backend-booking.appointroll.com/api/public/book/resource?interview_share_link=${interviewId}&from_staff=1`
    : `https://backend-booking.appointroll.com/api/public/book/resource?interview_share_link=${interviewId}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const apiData = await response.json();

  console.log(apiData);
  
  if (!apiData.data || !apiData.data.interview) {
    throw new Error('Invalid API response structure');
  }
  
  const interview = apiData.data.interview;
  
  let availableStaffGroups = [];
  if (interview.staff_group && Array.isArray(interview.staff_group) && interview.staff_group.length > 0) {
    availableStaffGroups = interview.staff_group;
  }

  let availableResources = [];
  if (interview.resources && Array.isArray(interview.resources) && interview.resources.length > 0) {
    availableResources = interview.resources;
  }

  let availableStaff = [];
  let initialSelectedStaff = null;
  if (interview.staff && Array.isArray(interview.staff) && interview.staff.length > 0) {
    availableStaff = interview.staff;
    
    if (isStaff && share_link) {
      const staffMember = interview.staff.find(staff => staff.share_link === share_link);
      if (staffMember) {
        initialSelectedStaff = staffMember;
        availableStaff = []; 
      }
    }
  }
  
  localStorage.setItem('double_book', interview.double_book);
  localStorage.setItem('approve_appo', interview.approve_appointment);
  
  return {
    interview,
    theme: apiData.data?.theme || null,
    requireEndTime: interview.require_end_time === "1" || interview.require_end_time === 1 || interview.require_end_time === true,
    availableStaffGroups,
    availableResources,
    availableStaff,
    initialSelectedStaff
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

const transformInterviewData = (interview, initialSelectedStaff = null) => {
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
      unavailable_dates: selectedStaffGroup.collective_unavailable_dates || [],
      unavailable_times: selectedStaffGroup.collective_unavailable_times || [],
      available_times: selectedStaffGroup.collective_available_times || [],
      disabled_times: selectedStaffGroup.disabled_times || []
    };
  } else if (selectedStaff || initialSelectedStaff) {
    sourceData = initialSelectedStaff || selectedStaff;
  } else {
    sourceData = interview;
  }

  const rawDisabledTimes = sourceData.disabled_times || [];

  // ✅ حول disabled_times من UTC لـ user timezone فوراً
  const convertedDisabled = rawDisabledTimes.map(disabled => {
    try {
      const { date: dateISO, time } = disabled;
      if (!dateISO || !time) return disabled;

      const [h, m] = time.split(':').map(Number);
      
      const utcDate = new Date(Date.UTC(
        parseInt(dateISO.split('-')[0]),
        parseInt(dateISO.split('-')[1]) - 1,
        parseInt(dateISO.split('-')[2]),
        h, m, 0
      ));

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: selectedTimezone || 'Africa/Cairo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(utcDate);
      const map = parts.reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

      return {
        date: `${map.year}-${map.month}-${map.day}`,
        time: `${map.hour}:${map.minute}:00`
      };
    } catch (err) {
      console.error('❌ Failed to convert disabled time in transform:', disabled, err);
      return disabled;
    }
  });

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
    disabled_times: rawDisabledTimes,
    converted_disabled_times: convertedDisabled, // ✅ جاهز من الأول
    created_at: interview.created_at,
    raw_available_times: sourceData.available_times || [],
    duration_cycle: interview.duration_cycle,
    duration_period: interview.duration_period,
    rest_cycle: interview.rest_cycle || '0',
    status_of_pay: interview.status_of_pay,
    price: interview.price || '0',
    payment_details: interview.payment_details || null,
    mode: interview.mode,
    extra_modes: interview.extra_modes || [],
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
      const appointmentToken = responseData?.data?.appointment?.token;
      console.log(responseData);
      console.log(appointmentToken);
      
      const navigationPath = getNavigationPath(appointmentToken);
      
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
      setFormData({ name: '', email: '', phone: '', code_phone: '', address: '' });

      const convertUserTimeToUTC = (isoDate, localTime, userTimezone) => {
  try {
    const [h, m] = localTime.split(':').map(Number);
    let utcGuess = new Date(`${isoDate}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00Z`);
    
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: userTimezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    
    for (let i = 0; i < 3; i++) {
      const parts = formatter.formatToParts(utcGuess);
      const map = parts.reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});
      const localH = parseInt(map.hour);
      const localM = parseInt(map.minute);
      const diffMinutes = (h * 60 + m) - (localH * 60 + localM);
      if (diffMinutes === 0) break;
      utcGuess = new Date(utcGuess.getTime() - diffMinutes * 60000);
    }
    
    return {
      date: utcGuess.toISOString().split('T')[0],
      time: `${String(utcGuess.getUTCHours()).padStart(2,'0')}:${String(utcGuess.getUTCMinutes()).padStart(2,'0')}:00`
    };
  } catch (err) {
    return { date: isoDate, time: localTime + ':00' };
  }
};

const utcDisabled = convertUserTimeToUTC(formattedDate, selectedTime, selectedTimezone);
const newDisabledTime = {
  date: utcDisabled.date,
  time: utcDisabled.time
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
  let isMounted = true;
  
  const loadInitialData = async () => {
    if (!isMounted) return;
    
    try {
      setLoading(true);
      setError(null);

      const interviewId = id || share_link;
      if (!interviewId) return;

      const fetchedData = await fetchInterviewData(interviewId);

      if (!isMounted) return;

      setRequireEndTime(fetchedData.requireEndTime);
      setAvailableStaffGroups(fetchedData.availableStaffGroups);
      setAvailableResources(fetchedData.availableResources);
      setAvailableStaff(fetchedData.availableStaff);

      if (fetchedData.initialSelectedStaff) {
        setSelectedStaff(fetchedData.initialSelectedStaff);
      }

      if (fetchedData.theme && !theme && typeof setTheme === 'function') {
        setTheme(fetchedData.theme);
      }

      const transformedData = transformInterviewData(
        fetchedData.interview,
        fetchedData.initialSelectedStaff || null
      );

      setBookingData(transformedData);

      // ✅ هنا التعديل: نجيب أول تاريخ متاح فيه أوقات
      if (transformedData.available_dates?.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let firstAvailableDate = null;
        
        // نلف على كل الـ date ranges
        for (const range of transformedData.available_dates) {
          try {
            let fromISO = convertDateToISO(range.from.includes(' ') ? range.from.split(' ')[0] : range.from);
            let toISO = range.to 
              ? convertDateToISO(range.to.includes(' ') ? range.to.split(' ')[0] : range.to)
              : fromISO;

            if (!fromISO || !toISO) continue;

            const fromDate = new Date(fromISO + 'T00:00:00.000Z');
            const toDate = new Date(toISO + 'T00:00:00.000Z');
            
            // نبدأ من اليوم الحالي أو من تاريخ البداية (أيهما أكبر)
            let current = new Date(Math.max(fromDate.getTime(), today.getTime()));
            
            // نلف على الأيام لحد ما نلاقي يوم فيه أوقات متاحة
            while (current <= toDate && !firstAvailableDate) {
              const day = current.getDate();
              const month = current.getMonth();
              const year = current.getFullYear();
              
              // نشيك لو اليوم ده متاح وفيه أوقات
              const times = generateTimeSlots(
                transformedData.raw_available_times || transformedData.available_times,
                parseInt(transformedData.duration_cycle),
                transformedData.duration_period || 'minutes',
                current.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }).replace(/\//g, ' '),
                transformedData.disabled_times || [],
                transformedData.unavailable_times || [],
                transformedData.unavailable_dates || [],
                parseInt(transformedData.rest_cycle || '0'),
                selectedTimezone
              );
              
              if (times && times.length > 0) {
                // لقينا أول يوم فيه أوقات متاحة
                firstAvailableDate = current.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }).replace(/\//g, ' ');
                break;
              }
              
              // ننتقل لليوم التالي
              current.setDate(current.getDate() + 1);
            }
            
            if (firstAvailableDate) break;
            
          } catch (e) {
            console.error('Error processing date range:', e);
          }
        }
        
        if (firstAvailableDate) {
          setSelectedDate(firstAvailableDate);
          console.log('📅 First available date with times:', firstAvailableDate);
        }
      }
      
    } catch (err) {
      if (!isMounted) return;
      console.error('Failed to load initial booking data:', err);
      setError('Failed to load booking data');
      setDataNotFound?.(true); 
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  if (id || share_link) {
    loadInitialData();
  }

  return () => {
    isMounted = false;
  };
}, [id, share_link]);

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

  setBookingData(updatedData);

  // ✅ التعديل هنا: نجيب أول تاريخ فيه أوقات متاحة
  const possibleDates = [];
  updatedData.available_dates.forEach(range => {
    try {
      let fromISO = convertDateToISO(range.from.includes(' ') ? range.from.split(' ')[0] : range.from);
      let toISO = range.to 
        ? convertDateToISO(range.to.includes(' ') ? range.to.split(' ')[0] : range.to)
        : fromISO;

      if (!fromISO || !toISO) return;

      const from = new Date(fromISO + 'T00:00:00.000Z');
      const to = new Date(toISO + 'T00:00:00.000Z');
      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);

      let current = new Date(Math.max(from.getTime(), todayUTC.getTime()));

      while (current <= to) {
        const formatted = current.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        }).replace(/\//g, ' ');
        
        // ✅ نشيك لو اليوم ده فيه أوقات متاحة
        const times = generateTimeSlots(
          updatedData.raw_available_times,
          parseInt(updatedData.duration_cycle),
          updatedData.duration_period || 'minutes',
          formatted,
          updatedData.disabled_times || [],
          updatedData.unavailable_times || [],
          updatedData.unavailable_dates || [],
          parseInt(updatedData.rest_cycle || '0'),
          selectedTimezone
        );
        
        if (times && times.length > 0) {
          possibleDates.push(formatted);
        }
        
        current.setUTCDate(current.getUTCDate() + 1);
      }
    } catch (e) {
      console.error('Error:', e);
    }
  });

  if (possibleDates.length > 0) {
    // possibleDates.sort((a, b) => new Date(convertDateToISO(a)) - new Date(convertDateToISO(b)));
    setSelectedDate(possibleDates[0]); // أول تاريخ فيه أوقات
    console.log(`📅 Staff selected, first date with times: ${possibleDates[0]}`);
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
    unavailable_dates: selectedStaffGroup.collective_unavailable_dates || [],
    unavailable_times: selectedStaffGroup.collective_unavailable_times || [],
    available_times: selectedStaffGroup.collective_available_times || [],
    disabled_times: selectedStaffGroup.disabled_times || [],
    raw_available_times: selectedStaffGroup.collective_available_times || [],
    duration_cycle: bookingData?.duration_cycle,
    duration_period: bookingData?.duration_period,
    rest_cycle: bookingData?.rest_cycle || '0',
  };

  setBookingData(updatedData);

  // ✅ التعديل هنا: نجيب أول تاريخ فيه أوقات متاحة
  const possibleDates = [];
  updatedData.available_dates.forEach(range => {
    try {
      let fromISO = convertDateToISO(range.from.includes(' ') ? range.from.split(' ')[0] : range.from);
      let toISO = range.to 
        ? convertDateToISO(range.to.includes(' ') ? range.to.split(' ')[0] : range.to)
        : fromISO;

      if (!fromISO || !toISO) return;

      const from = new Date(fromISO + 'T00:00:00.000Z');
      const to = new Date(toISO + 'T00:00:00.000Z');
      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);

      let current = new Date(Math.max(from.getTime(), todayUTC.getTime()));

      while (current <= to) {
        const formatted = current.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        }).replace(/\//g, ' ');
        
        // ✅ نشيك لو اليوم ده فيه أوقات متاحة
        const times = generateTimeSlots(
          updatedData.raw_available_times,
          parseInt(updatedData.duration_cycle),
          updatedData.duration_period || 'minutes',
          formatted,
          updatedData.disabled_times || [],
          updatedData.unavailable_times || [],
          updatedData.unavailable_dates || [],
          parseInt(updatedData.rest_cycle || '0'),
          selectedTimezone
        );
        
        if (times && times.length > 0) {
          possibleDates.push(formatted);
        }
        
        current.setUTCDate(current.getUTCDate() + 1);
      }
    } catch (e) {
      console.error('Error:', e);
    }
  });

  if (possibleDates.length > 0) {
    setSelectedDate(possibleDates[0]); // أول تاريخ فيه أوقات
    console.log(`📅 StaffGroup selected, first date with times: ${possibleDates[0]}`);
  } else {
    setSelectedDate('');
    setSelectedTime('');
  }
}, [selectedStaffGroup, selectedTimezone]);
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

  const checkForUpdates = async () => {
    const now = Date.now();
    
    // ✅ امنع الـ fetch إلا لو مر دقيقة
    if (now - lastFetchTimeRef.current < FETCH_COOLDOWN) {
      return;
    }

    try {
      lastFetchTimeRef.current = now;
      
      const fetchedData = await fetchInterviewData(id);
      const newDisabledTimes = fetchedData.interview.disabled_times || [];

      const currentDisabledTimesStr = JSON.stringify(
        (bookingData.disabled_times || []).sort((a, b) => 
          a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
        )
      );
      const newDisabledTimesStr = JSON.stringify(
        newDisabledTimes.sort((a, b) => 
          a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
        )
      );

      // ✅ Update فقط لو في تغيير فعلي
      if (currentDisabledTimesStr !== newDisabledTimesStr) {
        setBookingData(prev => ({
          ...prev,
          disabled_times: newDisabledTimes
        }));

        if (selectedDate && selectedTime) {
          const isoDate = convertDateToISO(selectedDate);
          const isSelectedTimeNowDisabled = newDisabledTimes.some(disabled => 
            disabled.date === isoDate && disabled.time.startsWith(selectedTime)
          );

          if (isSelectedTimeNowDisabled) {
            const currentAvailableTimes = bookingData.available_times || [];
            const timesArray = currentAvailableTimes.map(slot => 
              typeof slot === 'string' ? slot : slot.time
            );

            const alternativeTime = timesArray.find(time => {
              const isDisabled = newDisabledTimes.some(d => 
                d.date === isoDate && d.time.startsWith(time)
              );
              const isPast = isTimePast(selectedDate, time);
              return !isDisabled && !isPast;
            });

            if (alternativeTime) {
              setSelectedTime(alternativeTime);
            } else {
              setSelectedTime('');
            }
          }
        }
      }
    } catch (error) {
      console.error('Check for updates error:', error);
    }
  };

  // ✅ نادي الـ check مرة واحدة عند mount
  checkForUpdates();

  // ✅ واستخدم interval بس لو User لسه شغال على الصفحة
  const intervalId = setInterval(checkForUpdates, FETCH_COOLDOWN);

  return () => clearInterval(intervalId);
}, [id]);

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
    displayedTimes,
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
   modalDisplayedTimes,    
  refreshTimesForModal, 
  };
};

export default useBookingLogic;