import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useBookingLogic = (id, navigate, isInterviewMode, interviewId,idCustomer) => {
  // State management
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  const [selectedService, setSelectedService] = useState('demo');
  const [selectedTimezone, setSelectedTimezone] = useState('Africa/Cairo');
  const [selectedDate, setSelectedDate] = useState(''); 
  const [selectedTime, setSelectedTime] = useState(''); 
 
  
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
  restCycle = 0 
) => {
 

  if (!availableTimes || !Array.isArray(availableTimes) || !selectedDate) {
    console.warn('Missing required data for time slot generation');
    return [];
  }

  // تحويل التاريخ إلى ISO
  const formattedDate = convertDateToISO(selectedDate);
  if (!formattedDate) {
    console.error('Failed to format date:', selectedDate);
    return [];
  }

  const getDayOfWeekFromDate = (dateString) => {
    try {
      const date = new Date(dateString + 'T00:00:00.000Z');
      if (isNaN(date.getTime())) return null;
      
      const dayOfWeek = date.getUTCDay();
      return dayOfWeek === 0 ? 1 : dayOfWeek + 1; 
    } catch (error) {
      console.error('Error getting day of week:', error);
      return null;
    }
  };

  const targetDayId = getDayOfWeekFromDate(formattedDate);

  if (!targetDayId) {
    console.error('Could not determine day ID for date:', formattedDate);
    return [];
  }

  const timeRangesForSelectedDay = availableTimes.filter(timeRange => 
    timeRange && Number(timeRange.day_id) === Number(targetDayId)
  );


  if (timeRangesForSelectedDay.length === 0) {
    console.warn('No time ranges found for day ID:', targetDayId);
    return [];
  }

const isDateInUnavailableRange = unavailableDates?.some(dateRange => {
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
    const checkDate = new Date(formattedDate + 'T00:00:00.000Z');

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
}) || false;

  const timeSlots = [];
  const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
  const restInMinutes = restCycle; 

  timeRangesForSelectedDay.forEach((timeRange) => {
    if (!timeRange || !timeRange.from || !timeRange.to) return;

    const [fromHour, fromMinute] = timeRange.from.split(":").map(Number);
    const [toHour, toMinute] = timeRange.to.split(":").map(Number);

    if (isNaN(fromHour) || isNaN(fromMinute) || isNaN(toHour) || isNaN(toMinute)) return;

    const start = new Date();
    start.setHours(fromHour, fromMinute, 0, 0);

    const end = new Date();
    end.setHours(toHour, toMinute, 0, 0);

    const current = new Date(start);

    while (current < end) {
      const hours = current.getHours().toString().padStart(2, "0");
      const minutes = current.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;

      const isDisabled = disabledTimes?.some(disabled => {
        return disabled.date === formattedDate && disabled.time.startsWith(formattedTime);
      }) || false;

      const isUnavailable = isDateInUnavailableRange && unavailableTimes?.some(unavailableTime => {
        if (!unavailableTime.day_id || !unavailableTime.from || !unavailableTime.to) return false;
        if (Number(unavailableTime.day_id) !== Number(targetDayId)) return false;

        const timeToMinutes = (timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const timeMinutes = timeToMinutes(formattedTime);
        const fromMinutes = timeToMinutes(unavailableTime.from.substring(0, 5));
        const toMinutes = timeToMinutes(unavailableTime.to.substring(0, 5));

        return timeMinutes >= fromMinutes && timeMinutes <= toMinutes;
      }) || false;

      const isPast = isTimePast(selectedDate, formattedTime);

      if (!isDisabled && !isUnavailable && !isPast) {
        timeSlots.push(formattedTime);
      }

      current.setMinutes(current.getMinutes() + durationInMinutes + restInMinutes);
    }
  });

  const uniqueSlots = [...new Set(timeSlots)].sort();
  
  return uniqueSlots;
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

      const fromDate = new Date(dateRange.from.split(' ')[0] + 'T00:00:00.000Z');
      
      if (isNaN(fromDate.getTime())) {
        return false;
      }

      if (dateRange.to === null || dateRange.to === undefined) {
        return checkDate >= fromDate;
      }

      const toDate = new Date(dateRange.to.split(' ')[0] + 'T00:00:00.000Z');
      
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

  // دوال API
  const fetchInterviewData = async (interviewId) => {
    const response = await fetch(`https://backend-booking.appointroll.com/api/public/interview/${interviewId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiData = await response.json();
    
    if (!apiData.data || !apiData.data.interview) {
      throw new Error('Invalid API response structure');
    }
    console.log('Fetched interview data:', apiData.data.interview);
    localStorage.setItem('double_book', apiData?.data.interview.double_book);
    localStorage.setItem('approve_appo', apiData?.data.interview.approve_appointment);
    
    return apiData.data.interview;
  };

const transformInterviewData = (interview) => {
  return {
    available_dates: interview.available_dates || [],
    unavailable_dates: interview.un_available_dates || [],
    unavailable_times: interview.un_available_times || [],
    available_times: interview.available_times || [], 
    name: interview.name || 'Interview',
    customer_id: interview.customer_id,
    id: interview.id,
    service_name: interview.name || 'Interview Session',
    provider_name: interview.customer_name,
    duration: `${interview.duration_cycle}${interview.duration_period}`,
    work_space_id: interview.work_space_id,
    photo: interview.photo,
    disabled_times: interview.disabled_times || [],
    created_at: interview.created_at,
    raw_available_times: interview.available_times,
    duration_cycle: interview.duration_cycle,
    duration_period: interview.duration_period,
    rest_cycle: interview.rest_cycle || '0',
    price: interview.price || '0',
    offline_mode: interview.offline_mode,
    currency: interview.currency 
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
          parseInt(interview.duration_cycle || '15'),
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
  parseInt(interview.duration_cycle || '15'),
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
        time_zone: selectedTimezone,
        code_phone: formData.code_phone,
        address: formData.address || '',
        // Add interview_id if in interview mode and interviewId exists
        ...(isInterviewMode && interviewId ? { interview_id: interviewId } : {})
      };

      console.log('Data to send:', appointmentData);

      const apiEndpoint = isInterviewMode
        ? `https://backend-booking.appointroll.com/api/public/company/interviews/${idCustomer}/book`
        : `https://backend-booking.appointroll.com/api/public/interview/${id}/book`;

      console.log('API endpoint:', apiEndpoint);

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

      console.log('API response:', responseData);

      navigate(`/share/${id}/appointmentConfirmation`, {
        state: responseData
      });

      const approve_appo = localStorage.getItem('approve_appo');
      toast.success(
        approve_appo == 1 ? 'Appointment Created Successfully' : "Appointment Created Successfully, but is pending approval",
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
      console.log(error);
      

  if (error.errors) {
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


  // useEffect hooks
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const interview = await fetchInterviewData(id);
        const transformedData = transformInterviewData(interview);
        const { defaultDate, defaultTime } = findDefaultDateTime(transformedData, interview);
        
 
        
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
    
    if (!bookingData || !selectedDate || !bookingData.raw_available_times) {
      return;
    }

    const formattedDate = convertDateToISO(selectedDate);
    if (!formattedDate) {
      console.error('Failed to convert date:', selectedDate);
      return;
    }


 const availableTimesForDate = generateTimeSlots(
  bookingData.raw_available_times,
  parseInt(bookingData.duration_cycle || '15'),
  bookingData.duration_period || 'minutes',
  formattedDate,
  bookingData.disabled_times || [],
  bookingData.unavailable_times || [],
  bookingData.unavailable_dates || [],
  parseInt(bookingData.rest_cycle || '0')
);


    setBookingData(prev => ({
      ...prev,
      available_times: availableTimesForDate.map(time => ({ time }))
    }));

    const firstAvailableTime = getFirstAvailableTime(
      selectedDate,
      availableTimesForDate.map(time => ({ time })),
      bookingData.disabled_times || [],
      bookingData.unavailable_times || [],
      bookingData.unavailable_dates || []
    );


    if (firstAvailableTime) {
      setSelectedTime(firstAvailableTime);
    } else {
      setSelectedTime('');
    }
  }, [selectedDate, bookingData?.disabled_times]);

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
            
            if (alternativeTime) {
              setSelectedTime(alternativeTime);
              toast.error(
                `The selected time ${selectedTime} is already booked. An alternative time has been chosen: ${alternativeTime}.`
              );
            } else {
              setSelectedTime('');
              toast.error(
                `The selected time ${selectedTime} is already booked and no other times are available on this date. Please select another date.`
              );
            }
          }
        }
      } catch (error) {
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
    convertDateToISO
  };
};

export default useBookingLogic;