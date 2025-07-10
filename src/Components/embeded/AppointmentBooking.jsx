import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import CalendarModal from './calender';
import TimeSelectionModal from './teime';
import TimezoneModal from './timezone';
import { useNavigate, useParams } from 'react-router-dom';
import BookingSummarySidebar from './BookingSummarySidebar';
import Loader from '../Loader';

const AppointmentBooking = () => {
  const {id} = useParams();
  const navigate=useNavigate()
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  const [selectedService, setSelectedService] = useState('demo');
  const [selectedTimezone, setSelectedTimezone] = useState('Africa/Cairo - EEST (+03:00)');
  const [selectedDate, setSelectedDate] = useState(''); 
  const [selectedTime, setSelectedTime] = useState(''); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    code_phone: '+20'
  });
  
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isTimeDisabled = (date, time, disabledTimes) => {
    if (!date || !time || !disabledTimes || !Array.isArray(disabledTimes)) {
      return false;
    }
    
    try {
      let formattedDate;
      
      if (typeof date === 'string' && date.includes(' ')) {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date format:', date);
          return false;
        }
        formattedDate = dateObj.toISOString().split('T')[0];
      } else {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date format:', date);
          return false;
        }
        formattedDate = dateObj.toISOString().split('T')[0];
      }
      
      return disabledTimes.some(disabledTime => {
        if (!disabledTime || !disabledTime.date || !disabledTime.time) {
          return false;
        }
        
        const disabledDate = disabledTime.date;
        const disabledTimeFormatted = disabledTime.time.slice(0, 5);
        
        return disabledDate === formattedDate && disabledTimeFormatted === time;
      });
    } catch (error) {
      console.error('Error in isTimeDisabled:', error);
      return false;
    }
  };

  const hasAvailableTimes = (date, availableTimes, disabledTimes) => {
    if (!date || !availableTimes || !Array.isArray(availableTimes)) {
      return false;
    }
    
    return availableTimes.some(timeSlot => 
      !isTimeDisabled(date, timeSlot.time, disabledTimes)
    );
  };

  const getFirstAvailableTime = (date, availableTimes, disabledTimes) => {
    if (!date || !availableTimes || !Array.isArray(availableTimes)) {
      return null;
    }
    
    const availableTime = availableTimes.find(timeSlot => 
      !isTimeDisabled(date, timeSlot.time, disabledTimes)
    );
    
    return availableTime ? availableTime.time : null;
  };

  const generateTimeSlots = (
    availableTimes,
    durationCycle = 15,
    durationPeriod = "minutes",
    selectedDate = null, 
    disabledTimes = []
  ) => {
    if (!availableTimes || !Array.isArray(availableTimes) || !selectedDate) {
      return [];
    }
  
    // تحويل التاريخ المحدد إلى day of week
    const getDayOfWeekFromDate = (dateString) => {
      try {
        let date;
        
        // إذا كان التاريخ بصيغة YYYY-MM-DD
        if (dateString.includes('-') && dateString.split('-').length === 3) {
          date = new Date(dateString + 'T00:00:00.000Z');
        } else {
          // إذا كان التاريخ بصيغة أخرى
          date = new Date(dateString);
        }
        
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', dateString);
          return null;
        }
        
        // الحصول على day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = date.getUTCDay();
        
        // تحويل إلى نظام day_id المستخدم في API (1 = Sunday, 2 = Monday, etc.)
        return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
        
      } catch (error) {
        console.error('Error getting day of week:', error);
        return null;
      }
    };
  
    const targetDayId = getDayOfWeekFromDate(selectedDate);
    if (!targetDayId) {
      console.error('Could not determine day of week for date:', selectedDate);
      return [];
    }
  
    console.log('Selected date:', selectedDate, 'Day ID:', targetDayId);
  
    // فلترة الأوقات حسب اليوم المحدد فقط
    const timeRangesForSelectedDay = availableTimes.filter(timeRange => {
      return timeRange && timeRange.day_id === targetDayId;
    });
  
    console.log('Time ranges for selected day:', timeRangesForSelectedDay);
  
    if (timeRangesForSelectedDay.length === 0) {
      console.log('No time ranges found for day_id:', targetDayId);
      return [];
    }
  
    const timeSlots = [];
    const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
  
    // معالجة كل timeRange للوقت المحدد
    timeRangesForSelectedDay.forEach((timeRange) => {
      if (!timeRange || !timeRange.from || !timeRange.to) {
        console.warn('Invalid time range:', timeRange);
        return;
      }
  
      console.log('Processing time range:', timeRange);
  
      const [fromHour, fromMinute] = timeRange.from.split(":").map(Number);
      const [toHour, toMinute] = timeRange.to.split(":").map(Number);
  
      // التحقق من صحة الأوقات
      if (isNaN(fromHour) || isNaN(fromMinute) || isNaN(toHour) || isNaN(toMinute)) {
        console.warn('Invalid time format in range:', timeRange);
        return;
      }
  
      const start = new Date();
      start.setHours(fromHour, fromMinute, 0, 0);
  
      const end = new Date();
      end.setHours(toHour, toMinute, 0, 0);
  
      const current = new Date(start);
  
      while (current < end) {
        const hours = current.getHours().toString().padStart(2, "0");
        const minutes = current.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;
  
        // التحقق من عدم تعارض الوقت مع الأوقات المحجوزة
        const isDisabled = disabledTimes && disabledTimes.some(
          (disabled) =>
            disabled.date === selectedDate &&
            disabled.time.startsWith(formattedTime)
        );
  
        if (!isDisabled) {
          timeSlots.push({ time: formattedTime, day_id: timeRange.day_id });
        }
  
        current.setMinutes(current.getMinutes() + durationInMinutes);
      }
    });
  
    // إزالة التكرارات وترتيب الأوقات
    const uniqueSlots = [...new Set(timeSlots.map((slot) => slot.time))]
      .sort()
      .map((time) => ({ time }));
  
    console.log('Generated time slots for date', selectedDate, ':', uniqueSlots);
    
    return uniqueSlots;
  };
  
  


  useEffect(() => {
    if (bookingData && selectedDate && bookingData.raw_available_times) {
      const dateForAPI = (() => {
        try {
          if (typeof selectedDate === 'string' && selectedDate.includes(' ')) {
            const parts = selectedDate.split(' ');
            const day = parseInt(parts[0]);
            const monthAbbrev = parts[1];
            const year = parseInt(parts[2]);
            
            const monthAbbreviations = [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            
            const monthIndex = monthAbbreviations.indexOf(monthAbbrev);
            const date = new Date(Date.UTC(year, monthIndex, day));
            return date.toISOString().split('T')[0];
          }
          return null;
        } catch (error) {
          console.error('Error converting date:', error);
          return null;
        }
      })();
      
      if (dateForAPI) {
        console.log('Generating times for date:', dateForAPI);
        console.log('Available times from API:', bookingData.raw_available_times);
        
        const availableTimesForDate = generateTimeSlots(
          bookingData.raw_available_times || [],
          parseInt(bookingData.duration?.match(/\d+/)?.[0] || '15'),
          bookingData.duration?.includes('hour') ? 'hours' : 'minutes',
          dateForAPI, // استخدام التاريخ بصيغة YYYY-MM-DD
          bookingData.disabled_times || []
        );
        
        console.log('Generated times for selected date:', availableTimesForDate);
        
        setBookingData(prev => ({
          ...prev,
          available_times: availableTimesForDate
        }));
        
        // التحقق من الوقت المحدد حالياً
        const isCurrentTimeAvailable = selectedTime && 
          availableTimesForDate.some(timeSlot => timeSlot.time === selectedTime) &&
          !isTimeDisabled(selectedDate, selectedTime, bookingData.disabled_times);
        
        if (!isCurrentTimeAvailable) {
          const firstAvailableTime = availableTimesForDate.find(timeSlot => 
            !isTimeDisabled(selectedDate, timeSlot.time, bookingData.disabled_times)
          );
          
          if (firstAvailableTime) {
            setSelectedTime(firstAvailableTime.time);
            console.log('Auto-selected first available time:', firstAvailableTime.time);
          } else {
            setSelectedTime('');
            console.log('No available times found for selected date');
          }
        }
      }
    }
  }, [selectedDate, bookingData?.disabled_times, bookingData?.raw_available_times]);
 // دالة مشتركة لاستدعاء الـ API
const fetchInterviewData = async (interviewId) => {
  const response = await fetch(`https://booking-system-demo.efc-eg.com/api/public/interview/${interviewId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const apiData = await response.json();
  
  if (!apiData.data || !apiData.data.interview) {
    throw new Error('Invalid API response structure');
  }
  
  return apiData.data.interview;
};

// دالة لتحويل البيانات
const transformInterviewData = (interview) => {
  return {
    available_dates: interview.available_dates || [],
    available_times: [], 
    name: interview.name || 'Interview',
    customer_id: interview.customer_id,
    id: interview.id,
    service_name: interview.name || 'Interview Session',
    provider_name: 'Interview Provider',
    duration: `${interview.duration_cycle}${interview.duration_period}`,
    work_space_id: interview.work_space_id,
    photo: interview.photo,
    disabled_times: interview.disabled_times || [],
    created_at: interview.created_at,
    raw_available_times: interview.available_times
  };
};

// دالة للعثور على التاريخ والوقت الافتراضي
const findDefaultDateTime = (transformedData, interview) => {
  let defaultDate = null;
  let defaultTime = null;
  
  if (transformedData.available_dates && transformedData.available_dates.length > 0) {
    for (const dateRange of transformedData.available_dates) {
      if (!dateRange || !dateRange.from) continue;
      
      try {
        const dateObj = new Date(dateRange.from);
        if (isNaN(dateObj.getTime())) continue;
        
        const formattedDate = dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        
        // إنشاء available_times للتاريخ المحدد
        const availableTimesForDate = generateTimeSlots(
          interview.available_times || [],
          parseInt(interview.duration_cycle),
          interview.duration_period,
          dateObj.toISOString().split('T')[0],
          interview.disabled_times || []
        );
        
        // البحث عن أول وقت متاح غير محجوز
        const firstAvailableTime = availableTimesForDate.find(timeSlot => 
          !isTimeDisabled(formattedDate, timeSlot.time, interview.disabled_times || [])
        );
        
        if (firstAvailableTime) {
          defaultDate = formattedDate;
          defaultTime = firstAvailableTime.time;
          transformedData.available_times = availableTimesForDate;
          break;
        }
      } catch (err) {
        console.warn('Error processing date:', dateRange.from, err);
        continue;
      }
    }
  }
  
  return { defaultDate, defaultTime };
};

// useEffect الأول للتحميل الأولي
useEffect(() => {
  const fetchBookingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const interview = await fetchInterviewData(id);
      console.log('API Response:', { data: { interview } });
      console.log(`${interview?.duration_cycle} ${interview?.duration_period}`);
      console.log(interview);
      
      const transformedData = transformInterviewData(interview);
      console.log(transformedData);
      
      const { defaultDate, defaultTime } = findDefaultDateTime(transformedData, interview);
      
      setBookingData(transformedData);
      
      // تحديد التاريخ والوقت الافتراضي
      if (defaultDate) {
        setSelectedDate(defaultDate);
        if (defaultTime) {
          setSelectedTime(defaultTime);
        }
      }
      
    } catch (err) {
      console.error('Error fetching booking data:', err);
      setError(err.message || 'Failed to load booking data');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchBookingData();
  }
}, [id]);

// useEffect الثاني للتحديث الدوري
useEffect(() => {
  if (!id || !bookingData) return;

  const intervalId = setInterval(async () => {
    try {
      const interview = await fetchInterviewData(id);
      const newDisabledTimes = interview.disabled_times || [];
      console.log(interview);
      
      if (JSON.stringify(newDisabledTimes) !== JSON.stringify(bookingData.disabled_times)) {
        console.log('Disabled times updated:', newDisabledTimes);
        setBookingData(prevData => ({
          ...prevData,
          disabled_times: newDisabledTimes
        }));
        
        if (selectedDate && selectedTime && isTimeDisabled(selectedDate, selectedTime, newDisabledTimes)) {
          console.log('Currently selected time is now disabled, finding alternative...');
          
          const alternativeTime = getFirstAvailableTime(selectedDate, bookingData.available_times, newDisabledTimes);
          
          if (alternativeTime) {
            setSelectedTime(alternativeTime);
            alert(`الوقت المحدد ${selectedTime} أصبح محجوز. تم اختيار وقت بديل: ${alternativeTime} / Selected time ${selectedTime} is now booked. Alternative time selected: ${alternativeTime}`);
          } else {
            setSelectedTime('');
            alert(`الوقت المحدد ${selectedTime} أصبح محجوز ولا توجد أوقات متاحة أخرى في هذا التاريخ. يرجى اختيار تاريخ آخر. / Selected time ${selectedTime} is now booked and no other times are available on this date. Please select another date.`);
          }
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }, 60000);

  return () => clearInterval(intervalId);
}, [id, bookingData, selectedDate, selectedTime]);
  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('يرجى اختيار التاريخ والوقت أولاً / Please select date and time first');
      return;
    }
    
    if (isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)) {
      alert('الوقت المحدد غير متاح. يرجى اختيار وقت آخر. / Selected time is not available. Please choose another time.');
      
      const alternativeTime = getFirstAvailableTime(selectedDate, bookingData.available_times, bookingData.disabled_times);
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
        alert('يرجى اختيار التاريخ والوقت أولاً / Please select date and time first');
        return;
      }
      
      if (isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)) {
        alert('الوقت المحدد غير متاح. يرجى اختيار وقت آخر. / Selected time is not available. Please choose another time.');
        return;
      }
      
      const formatDateForAPI = (dateString) => {
        try {
          if (typeof dateString === 'string' && dateString.includes(' ')) {
            const parts = dateString.split(' ');
            if (parts.length !== 3) {
              throw new Error('Invalid date format');
            }
            
            const day = parseInt(parts[0]);
            const monthAbbrev = parts[1];
            const year = parseInt(parts[2]);
            
            const monthAbbreviations = [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            
            const monthIndex = monthAbbreviations.indexOf(monthAbbrev);
            
            if (monthIndex === -1 || isNaN(day) || isNaN(year)) {
              throw new Error('Invalid date components');
            }
            
            const date = new Date(Date.UTC(year, monthIndex, day));
            
            if (isNaN(date.getTime())) {
              throw new Error('Invalid date');
            }
            
            const formattedYear = date.getUTCFullYear();
            const formattedMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
            const formattedDay = String(date.getUTCDate()).padStart(2, '0');
            
            return `${formattedYear}-${formattedMonth}-${formattedDay}`;
          } else {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
              throw new Error('Invalid date');
            }
            return date.toISOString().split('T')[0];
          }
        } catch (error) {
          console.error('Error formatting date:', error);
          return null;
        }
      };

      const formattedDate = formatDateForAPI(selectedDate);
      if (!formattedDate) {
        throw new Error('Invalid date format');
      }

      const appointmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formattedDate,
        time: selectedTime, 
        time_zone: selectedTimezone,
        code_phone: formData.code_phone 
      };

      console.log('Sending appointment data:', appointmentData);

      const response = await fetch(`https://booking-system-demo.efc-eg.com/api/public/interview/${id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      const responseData = await response.json();
      // console.log('API Response:', responseData);
      navigate(`/share/${id}/appointmentConfirmation`,{
        state:responseData
      });
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      alert(responseData?.message);
      setShowBookingSummary(false);
      setFormData({ name: '', email: '', phone: '', code_phone: '+20' });
      
      const newDisabledTime = {
        date: formattedDate,
        time: selectedTime + ':00'
      };
      
      setBookingData(prevData => ({
        ...prevData,
        disabled_times: [...prevData.disabled_times, newDisabledTime]
      }));
      
      const alternativeTime = getFirstAvailableTime(selectedDate, bookingData.available_times, [...bookingData.disabled_times, newDisabledTime]);
      if (alternativeTime) {
        setSelectedTime(alternativeTime);
      } else {
        setSelectedTime('');
      }
      
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const handlePhoneCodeChange = (code) => {
    setFormData({...formData, code_phone: code});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
              <div className="text-lg"> <Loader/></div>
            </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isBookButtonDisabled = !selectedDate || !selectedTime || isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className='flex items-center gap-2 mb-4'>
        <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              xmlSpace="preserve"
              width={37}
            >
              <path
                fill="#226DB4"
                d="M995.8,249.6c-16.5-39.1-40.2-74.3-70.4-104.5S860,91.3,820.9,74.7c-13-5.5-26.3-10.1-39.8-13.9V32.9  c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9v17.2c-9.4-0.8-18.9-1.2-28.4-1.2h-301c-16.5,0-29.9,13.4-29.9,29.9  c0,16.5,13.4,29.9,29.9,29.9H693c9.6,0,19,0.5,28.4,1.5v15.3c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9v-2  c37.9,13.1,72.7,34.8,102,64c50.8,50.8,78.8,118.3,78.8,190.1v315.4c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8  h-73c-16.5,0-29.9,13.4-29.9,29.9s13.4,29.9,29.9,29.9h73c44.4,0,87.4-8.7,127.9-25.8c39.1-16.5,74.3-40.2,104.5-70.4  s53.9-65.3,70.4-104.5c17.2-40.5,25.8-83.6,25.8-127.9V377.5C1021.6,333.2,1012.9,290.1,995.8,249.6z"
              />
              <path
                fill="#226DB4"
                d="M659.6,692.6c0-44.4-8.7-87.4-25.8-127.9c-11.1-26.2-25.4-50.7-42.7-73l-43.9,40.9c34.2,46,52.7,101.6,52.7,160  c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8s-139.3-28-190.1-78.8c-50.8-50.8-78.8-118.3-78.8-190.1  s28-139.3,78.8-190.1c50.8-50.8,118.3-78.8,190.1-78.8c65.1,0,126.7,23,175.4,65.1l43.9-40.9c-27.1-24.4-57.8-43.9-91.4-58.1  c-40.5-17.2-83.6-25.8-127.9-25.8s-87.4,8.7-127.9,25.8c-39.1,16.5-74.3,40.2-104.5,70.4c-13.5,13.5-25.7,28-36.5,43.3v-126  c0-62.6,22-123.5,61.8-171.6c31.4-37.9,72.7-66.4,118.6-82.4v1.2c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9V84.9  c0-0.1,0-0.3,0-0.4V32.3c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9V61c-64,17.9-121.8,55.2-164.6,106.8  c-23.9,28.9-42.6,61.3-55.5,96.3C9.1,300.4,2.4,338.5,2.4,377.5v315.4c0,44.4,8.7,87.4,25.8,127.9c16.5,39.1,40.2,74.3,70.4,104.5  c30.2,30.2,65.3,53.9,104.5,70.4c40.5,17.2,83.6,25.8,127.9,25.8c1.6,0,3.2-0.1,4.8-0.4c42.6-0.6,84-9.2,123.1-25.8  c39.1-16.5,74.3-40.2,104.5-70.4s53.9-65.3,70.4-104.5C651,780,659.6,736.9,659.6,692.6z"
              />
              <path
                fill="#089949"
                d="M332.4,650.7l-76.3-81.4c-11.3-12-30.2-12.7-42.2-1.4c-12,11.3-12.6,30.2-1.4,42.2l96.6,103.1  c5.9,6.3,13.8,9.5,21.8,9.5c7.3,0,14.6-2.7,20.3-8l195.8-182.3l43.9-40.9l56.8-52.9c12.1-11.2,12.8-30.2,1.5-42.2  c-11.2-12.1-30.1-12.8-42.2-1.5l-56.8,52.9l-43.9,40.9L332.4,650.7z"
              />
        </svg>
          <h1 className="text-4xl font-bold text-gray-800 ">
            Book Your Appointment
          </h1>

          </div>
          <p className="text-gray-600 text-lg">
            Book your appointment in a few simple steps: Choose a service, pick your date and time, and fill in your details. See you soon!
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Booking: {bookingData?.name || 'Loading...'}
          </div>
        </div>

        {/* First Row - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Service Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between h-full">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {bookingData?.service_name || 'Service'}
                </h3>
                <p className="text-sm text-gray-500">
                  ( {bookingData?.duration} )
                </p>
              </div>
              <span></span>
            </div>
          </div>

          {/* Provider Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center h-full">
              <div className="w-full flex justify-between items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {bookingData?.photo ? (
                    <img 
                      src={bookingData.photo} 
                      alt="Provider" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {bookingData?.provider_name || 'Provider'}
                </h3>
                <span></span>
              </div>
            </div>
          </div>

          {/* Date Card */}
          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowCalendarModal(true)}
          >
            <div className="flex items-center justify-between h-full">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">{selectedDate || 'Select Date'}</h3>
              <span></span>
            </div>
          </div>
        </div>

        {/* Second Row - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Timezone Card */}
          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center"
            onClick={() => setShowTimezoneModal(true)}
          >
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Timezone</h3>
            </div>
            <div className="text-sm text-gray-600 break-words">
              {selectedTimezone}
            </div>
            <span></span>
          </div>

          {/* Time Card */}
          <div 
            className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center ${
              selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) 
                ? 'border-2 border-red-300 bg-red-50' 
                : ''
            }`}
            onClick={() => setShowTimeModal(true)}
          >
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Time</h3>
            </div>
            <div className={`text-lg font-semibold ${
              selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                ? 'text-red-600 line-through'
                : 'text-gray-800'
            }`}>
              {selectedTime || 'Select Time'}
              {selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) && (
                <span className="text-xs text-red-500 ml-2 font-normal">(Booked)</span>
              )}
            </div>
            <span></span>
          </div>

          {/* Book Appointment Card */}
          <div className="bg-white rounded-lg shadow-sm p flex items-center justify-center">
            <button
              onClick={handleBookAppointment}
              disabled={isBookButtonDisabled}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg w-full h-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {!selectedDate || !selectedTime 
                ? 'Select Date & Time' 
                : isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) 
                  ? 'Time Not Available' 
                  : 'Book Appointment'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CalendarModal
  show={showCalendarModal}
  onClose={() => setShowCalendarModal(false)}
  selectedDate={selectedDate}
  onDateSelect={setSelectedDate}
  availableDates={bookingData?.available_dates || []}
  unavailableDates={bookingData?.un_available_dates || []}
  disabledTimes={bookingData?.disabled_times || []} 
  availableTimes={bookingData?.available_times || []}
  availableTimesFromAPI={bookingData?.raw_available_times || []} 
/>

      <TimeSelectionModal
        show={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        availableTimes={bookingData?.available_times || []}
        unavailableTimes={bookingData?.un_available_times || []}
        selectedDate={selectedDate} 
        disabledTimes={bookingData?.disabled_times || []} 
      />

      <TimezoneModal
        show={showTimezoneModal}
        onClose={() => setShowTimezoneModal(false)}
        selectedTimezone={selectedTimezone}
        onTimezoneSelect={setSelectedTimezone}
      />

      {/* Booking Summary Sidebar */}
      <BookingSummarySidebar
        show={showBookingSummary}
        onClose={() => setShowBookingSummary(false)}
        bookingData={bookingData}
        selectedService={selectedService}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedTimezone={selectedTimezone}
        formData={formData}
        onFormChange={handleFormChange}
        onPhoneCodeChange={handlePhoneCodeChange}
        onScheduleAppointment={handleScheduleAppointment}
        isBooking={isBooking}
      />
    </div>
  );
};

export default AppointmentBooking;