import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const DateTimeSelector = ({ 
  selectedInterview, 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect,
  appointment,
  onStaffSelect,
  mode = 'schedule' 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [disabledTimes, setDisabledTimes] = useState([]);
  const [StaffInterview, setStaffInterview] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [restTimes, setRestTimes] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const formatDateToYMD = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
console.log('isLoading:', isLoading);
  const getDayId = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
  };

  const normalizeTimeFormat = (timeStr) => {
    if (!timeStr) return null;
    return timeStr.split(':').slice(0, 2).join(':');
  };

  const isTimeDisabled = (date, time, disabledTimes = []) => {
    if (!date || !time || !disabledTimes || !Array.isArray(disabledTimes)) {
      return false;
    }
    
    try {
      const formattedDate = formatDateToYMD(date);
      const normalizedTime = normalizeTimeFormat(time);
      
      const isDisabled = disabledTimes.some(disabledTime => {
        if (!disabledTime || !disabledTime.date || !disabledTime.time) {
          return false;
        }
        
        const disabledDate = formatDateToYMD(new Date(disabledTime.date));
        const disabledTimeFormatted = normalizeTimeFormat(disabledTime.time);
        
        const match = disabledDate === formattedDate && disabledTimeFormatted === normalizedTime;
        return match;
      });
      
      return isDisabled;
    } catch (error) {
      console.error('Error in isTimeDisabled:', error);
      return false;
    }
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    setShowStaffDropdown(false);
    
    if (onStaffSelect) {
      onStaffSelect(staff);
    }
    
    onDateSelect(null);
    onTimeSelect(null);
    setShowTimeSlots(false);
    
    if (staff) {
      setAvailableDates(staff.available_dates || []);
      setAvailableTimes(staff.available_times || []);
      setUnavailableDates(staff.un_available_dates || []);
      setUnavailableTimes(staff.un_available_times || []);
      setDisabledTimes(staff.disabled_times || []);
      
      if (staff.available_dates && staff.available_dates.length > 0) {
        for (const dateRange of staff.available_dates) {
          if (!dateRange || !dateRange.from) continue;

          try {
            const fromDate = new Date(dateRange.from);
            if (isNaN(fromDate.getTime())) continue;

            if (isDateAvailable(fromDate, staff.available_dates, staff.available_times)) {
              const availableTimeSlots = generateTimeSlots(
                staff.available_times || [],
                fromDate,
                staff.disabled_times || [],
                interviewDetails,
                true
              );

              const firstAvailableTime = getFirstAvailableTime(fromDate, availableTimeSlots);

              if (firstAvailableTime) {
                onDateSelect(fromDate);
                onTimeSelect(firstAvailableTime);
                break;
              }
            }
          } catch (error) {
            console.error("Error parsing date:", error);
          }
        }
      }
    }
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

  const isTimeUnavailable = (date, time) => {
    if (!date || !time || !unavailableTimes || !Array.isArray(unavailableTimes)) {
      return false;
    }

    const dayId = getDayId(date);
    const dayUnavailableTimes = unavailableTimes.filter(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );

    const hasUnavailableTimeForThisDay = dayUnavailableTimes.length > 0;
    if (hasUnavailableTimeForThisDay && isDateInUnavailableDatesRange(date)) {
      return true;
    }

    if (dayUnavailableTimes.length === 0) {
      return false;
    }
    
    const timeToMinutes = (timeStr) => {
      const normalizedTime = normalizeTimeFormat(timeStr);
      const [hours, minutes] = normalizedTime.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const checkTimeMinutes = timeToMinutes(time);
    
    return dayUnavailableTimes.some(dayUnavailableTime => {
      if (!dayUnavailableTime || !dayUnavailableTime.from) {
        return false;
      }
      
      const fromMinutes = timeToMinutes(dayUnavailableTime.from);
      
      if (!dayUnavailableTime.to || dayUnavailableTime.to === null) {
        return checkTimeMinutes >= fromMinutes;
      }
      
      const toMinutes = timeToMinutes(dayUnavailableTime.to);
      
      const isUnavailable = checkTimeMinutes >= fromMinutes && checkTimeMinutes <= toMinutes;
      console.log(`isTimeUnavailable: date=${formatDateToYMD(date)}, time=${time}, from=${dayUnavailableTime.from}, to=${dayUnavailableTime.to}, isUnavailable=${isUnavailable}`);
      return isUnavailable;
    });
  };

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

  const calculateEffectiveAvailableTimes = (selectedDate, availableTimesData, disabledTimes, interviewData) => {
    if (!selectedDate || !availableTimesData || !Array.isArray(availableTimesData)) {
      return [];
    }

    const dayId = getDayId(selectedDate);
    const hasUnavailableTimeForThisDay = unavailableTimes.some(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );

    if (hasUnavailableTimeForThisDay && isDateInUnavailableDatesRange(selectedDate)) {
      return [];
    }

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
      const normalizedTime = normalizeTimeFormat(timeStr);
      const [hours, minutes] = normalizedTime.split(':').map(Number);
      return hours * 60 + minutes;
    };

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

    const effectiveTimeSlots = [];
    let durationCycle = 15;
    let durationPeriod = "minutes";
    let restCycle = 0;
    
    if (interviewData) {
      durationCycle = parseInt(interviewData.duration_cycle) || 15;
      durationPeriod = interviewData.duration_period || "minutes";
      restCycle = parseInt(interviewData.rest_cycle) || 0;
      console.log(`calculateEffectiveAvailableTimes: durationCycle=${durationCycle}, durationPeriod=${durationPeriod}, restCycle=${restCycle}`);
    }
    
    const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
    const totalSlotDuration = durationInMinutes + restCycle;
    console.log(`calculateEffectiveAvailableTimes: durationInMinutes=${durationInMinutes}, totalSlotDuration=${totalSlotDuration}`);

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
        
        const isUnavailable = isTimeUnavailable(selectedDate, formattedTime);
        const isDisabled = isTimeDisabled(selectedDate, formattedTime, disabledTimes);
        
        let isPast = false;
        if (isToday) {
          const slotTimeMinutes = hours * 60 + minutes;
          isPast = slotTimeMinutes < nowMinutes;
        }
        
        console.log(`calculateEffectiveAvailableTimes: time=${formattedTime}, isUnavailable=${isUnavailable}, isDisabled=${isDisabled}, isPast=${isPast}`);
        if (!isDisabled && !isUnavailable && !isPast) {
          effectiveTimeSlots.push(formattedTime);
        }
      }
    });

    const sortedSlots = [...new Set(effectiveTimeSlots)].sort();
    console.log(`calculateEffectiveAvailableTimes: Generated slots for ${formatDateToYMD(selectedDate)}:`, sortedSlots);
    return sortedSlots;
  };

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
    let restCycle = 0; 
    
    if (interviewData) {
      durationCycle = parseInt(interviewData.duration_cycle) || 15;
      durationPeriod = interviewData.duration_period || "minutes";
      restCycle = parseInt(interviewData.rest_cycle) || 0;
      console.log(`generateTimeSlots: durationCycle=${durationCycle}, durationPeriod=${durationPeriod}, restCycle=${restCycle}`);
    }
    
    const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
    const totalSlotDuration = durationInMinutes + restCycle;
    console.log(`generateTimeSlots: durationInMinutes=${durationInMinutes}, totalSlotDuration=${totalSlotDuration}`);

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

      if (!timeRange.to || timeRange.to === null) {
        toMinutes = 23 * 60 + 59;
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

        console.log(`generateTimeSlots: time=${formattedTime}, isDisabled=${isDisabled}, isUnavailable=${isUnavailable}, isPast=${isPast}`);
        if (!isDisabled && !isUnavailable && !isPast) {
          timeSlots.push({ time: formattedTime });
        }
      }
    });

    const uniqueSlots = [...new Set(timeSlots.map((slot) => slot.time))]
      .sort()
      .map((time) => ({ time }));
    console.log(`generateTimeSlots: Generated slots for ${formatDateToYMD(selectedDate)}:`, uniqueSlots);
    return uniqueSlots;
  };

  const isDateAvailable = (date, availableDatesRanges = availableDates, availableTimesData = availableTimes) => {
    if (!date) return false;

    const dayId = getDayId(date);
    const hasUnavailableTimeForThisDay = unavailableTimes.some(timeRange => 
      timeRange.day_id.toString() === dayId.toString()
    );

    if (hasUnavailableTimeForThisDay && isDateInUnavailableDatesRange(date)) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < today) {
      return false;
    }

    const isInDateRange = isDateInAvailableRange(checkDate, availableDatesRanges);
    if (!isInDateRange) {
      return false;
    }

    const dayOfWeek = checkDate.getDay();
    const dayIdCheck = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
    const hasTimesForDay = availableTimesData.some(time => time.day_id.toString() === dayIdCheck.toString());
    
    if (!hasTimesForDay) {
      return false;
    }

    const effectiveAvailableTimes = calculateEffectiveAvailableTimes(date, availableTimesData, disabledTimes, interviewDetails);
    
    return effectiveAvailableTimes.length > 0;
  };

  const getFirstAvailableTime = (date, availableTimeSlots) => {
    if (!date || !availableTimeSlots || availableTimeSlots.length === 0) {
      return null;
    }
    
    if (availableTimeSlots[0] && typeof availableTimeSlots[0] === 'object' && availableTimeSlots[0].time) {
      const time = normalizeTimeFormat(availableTimeSlots[0].time);
      return time.includes(':00') ? time : time + ':00';
    }
    
    if (typeof availableTimeSlots[0] === 'string') {
      const timeStr = normalizeTimeFormat(availableTimeSlots[0]);
      return timeStr.includes(':00') ? timeStr : timeStr + ':00';
    }
    
    return null;
  };

 const fetchInterviewDetails = async (shareLink) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://backend-booking.appointroll.com/api/public/book/resource?interview_share_link=${shareLink}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const interviewData = data?.data?.interview;
      const isStaffs = interviewData?.staff;
      
      if (isStaffs && isStaffs.length > 0) {
        setStaffInterview(interviewData.staff);
      }
      
      console.log(interviewData);

      const useStaffResource = appointment?.staff_resource && 
            typeof appointment.staff_resource === 'object' && 
            Object.keys(appointment.staff_resource).length > 0;

      // ✅ التعديل: اجعل interviewData هو الـ default
      let dataSource = interviewData; // القيمة الافتراضية
      
      if (useStaffResource) {
        dataSource = appointment.staff_resource;
      } else if (isStaffs && isStaffs.length > 0) {
        dataSource = isStaffs[0];
      }
      // لو مفيش الاتنين، هيستخدم interviewData اللي محدد من فوق

      if (dataSource) {
        setInterviewDetails(interviewData);
        setAvailableDates(dataSource.available_dates || []);
        setAvailableTimes(dataSource.available_times || []);
        setUnavailableDates(dataSource.un_available_dates || []);
        setUnavailableTimes(dataSource.un_available_times || []);
        setDisabledTimes(dataSource.disabled_times || []);
        setRestTimes(interviewData?.rest_cycle || 0);

        if (dataSource.available_dates && dataSource.available_dates.length > 0) {
          for (const dateRange of dataSource.available_dates) {
            if (!dateRange || !dateRange.from) continue;

            try {
              const fromDate = new Date(dateRange.from);
              if (isNaN(fromDate.getTime())) continue;

              if (isDateAvailable(fromDate, dataSource.available_dates, dataSource.available_times)) {
                const availableTimeSlots = generateTimeSlots(
                  dataSource.available_times || [],
                  fromDate,
                  dataSource.disabled_times || [],
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
            } catch (error) {
              console.error("Error parsing date:", error);
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

      if (selectedTime && availableTimeSlots.length > 0 && !availableTimeSlots.some(slot => slot.time === normalizeTimeFormat(selectedTime))) {
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
console.log(mode);

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !interviewDetails) return [];
    
    const effectiveTimeSlots = calculateEffectiveAvailableTimes(
      selectedDate, 
      availableTimes, 
      disabledTimes, 
      interviewDetails
    );
    
    return effectiveTimeSlots.map(timeStr => {
      const normalizedTime = normalizeTimeFormat(timeStr);
      const [hour, min] = normalizedTime.split(':').map(Number);
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'pm' : 'am';
      const displayTime = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
      
      return { value: `${normalizedTime}:00`, display: displayTime };
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
      {mode === 'schedule' && StaffInterview && StaffInterview.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Select Staff
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowStaffDropdown(!showStaffDropdown)}
              className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {selectedStaff && Object.keys(selectedStaff).length > 0 ? (
                  <>
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {selectedStaff?.name?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium truncate  max-w-[150px]">{selectedStaff.name}</div>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">Select a staff</span>
                )}
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {showStaffDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {StaffInterview && StaffInterview.length > 0 ? (
                  StaffInterview.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => handleStaffSelect(staff)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {staff.name?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium truncate block max-w-[150px]">{staff.name}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No staff available</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
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

      {(mode === 'reschedule' || !isLoading) && (
        <>
          <button
            onClick={() => setShowTimeSlots(!showTimeSlots)}
            className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm">
                {selectedDate && selectedTime 
                  ? `${formatSelectedDate()} | ${getAvailableTimeSlots().find(slot => slot.value === normalizeTimeFormat(selectedTime))?.display || selectedTime}` 
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
                 <div className="text-gray-500 text-sm mt-4">No dates available currently</div>
                )}
              </div>
              
              <div className='w-1/3'>
                {selectedDate && getAvailableTimeSlots().length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Available Slots</h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
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