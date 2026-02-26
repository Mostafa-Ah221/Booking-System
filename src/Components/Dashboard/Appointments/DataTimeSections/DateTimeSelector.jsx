
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PiCalendarBlank, PiMonitorLight, PiUsersThreeLight } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import { editInterviewById } from '../../../../redux/apiCalls/interviewCallApi';
import { useDispatch, useSelector } from 'react-redux';
import { 
  convertDisabledTimesToTimezone,
  convertDateTimeWithTimezone,
  isTimePast,
  timeToMinutes as utilTimeToMinutes
} from '../../../embeded/timezoneUtils';

const DateTimeSelector = ({ 
  selectedInterview, 
  selectedDate,
  selectedTime, 
  onDateSelect, 
  onTimeSelect,
  onEndTimeSelect,
  selectedEndTime,
  appointment,
  onStaffSelect,
  mode = 'schedule',
  selectedTimezone,
  WORKSPACE_TIMEZONE = 'UTC' 
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const { interview } = useSelector(state => state.interview);

  const isResourceMode = interview?.type === "resource";
  const isCollectiveMode = interview?.type === "collective-booking";
  const displayItems = isResourceMode 
    ? interview?.resources 
    : isCollectiveMode 
      ? interview?.staff_group  
      : StaffInterview;

  useEffect(() => {
    dispatch(editInterviewById(selectedInterview?.id));
  }, [dispatch, selectedInterview?.id]);

  // ============= Helper Functions =============
  const formatDateToYMD = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getDayId = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? 1 : dayOfWeek + 1;
  };

  const normalizeTimeFormat = (timeStr) => {
    if (!timeStr) return null;
    return timeStr.split(':').slice(0, 2).join(':');
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return `${String(selectedDate.getDate()).padStart(2, '0')}-${monthNames[selectedDate.getMonth()]}-${selectedDate.getFullYear()}`;
  };

  // ============= Date Range Checking Functions =============
  const isDateInUnavailableDatesRange = (date) => {
    if (!date || !unavailableDates || unavailableDates.length === 0) return false;

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return unavailableDates.some(range => {
      if (!range?.from) return false;

      let fromStr = range.from.split(' ')[0].replace(/\//g, '-');
      const parts = fromStr.split('-');
      if (parts.length === 3 && parseInt(parts[0], 10) <= 31) {
        fromStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      const fromDate = new Date(fromStr);
      fromDate.setHours(0, 0, 0, 0);
      if (isNaN(fromDate.getTime())) return false;

      if (range.to === null || range.to === undefined || range.to === '' || range.to === 'null') {
        return checkDate.toDateString() === fromDate.toDateString();
      }

      let toStr = range.to.split(' ')[0].replace(/\//g, '-');
      const toParts = toStr.split('-');
      if (toParts.length === 3 && parseInt(toParts[0], 10) <= 31) {
        toStr = `${toParts[2]}-${toParts[1]}-${toParts[0]}`;
      }
      const toDate = new Date(toStr);
      toDate.setHours(23, 59, 59, 999);
      if (isNaN(toDate.getTime())) return false;

      return checkDate >= fromDate && checkDate <= toDate;
    });
  };

  const isDateInAvailableRange = (date, availableDatesRanges = availableDates) => {
    if (!date || !availableDatesRanges || availableDatesRanges.length === 0) {
      return false;
    }

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return availableDatesRanges.some(range => {
      if (!range?.from) return false;

      let fromStr = range.from.split(' ')[0].replace(/\//g, '-');
      const parts = fromStr.split('-');
      if (parts.length === 3 && parseInt(parts[0]) <= 31) {
        fromStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      const fromDate = new Date(fromStr);
      fromDate.setHours(0, 0, 0, 0);
      if (isNaN(fromDate.getTime())) return false;

      if (range.to === null || range.to === undefined || range.to === '' || range.to === 'null') {
        return checkDate >= fromDate;
      }

      let toStr = range.to.split(' ')[0].replace(/\//g, '-');
      const toParts = toStr.split('-');
      if (toParts.length === 3 && parseInt(toParts[0]) <= 31) {
        toStr = `${toParts[2]}-${toParts[1]}-${toParts[0]}`;
      }
      const toDate = new Date(toStr);
      toDate.setHours(23, 59, 59, 999);
      if (isNaN(toDate.getTime())) return false;

      return checkDate >= fromDate && checkDate <= toDate;
    });
  };

  // ============= Time Slot Generation =============
  const calculateEffectiveAvailableTimes = (selectedDate, availableTimesData, disabledTimes, interviewData) => {
    if (!selectedDate || !availableTimesData || !Array.isArray(availableTimesData)) {
      return [];
    }

    const userTimezone = selectedTimezone || WORKSPACE_TIMEZONE;
    const isoDate = formatDateToYMD(selectedDate);
    if (!isoDate) return [];

    const convertedDisabledTimes = convertDisabledTimesToTimezone(
      disabledTimes || [],
      userTimezone,
      WORKSPACE_TIMEZONE
    );

    const disabledMap = {};
    convertedDisabledTimes.forEach(d => {
      if (d.date === isoDate) {
        const key = d.time.slice(0, 5);
        disabledMap[key] = true;
      }
    });

    const generateTimesForDay = (targetISODate) => {
      const checkDate = new Date(targetISODate + 'T00:00:00.000Z');
      const dayOfWeek = checkDate.getUTCDay();
      const dayId = dayOfWeek === 0 ? 1 : dayOfWeek + 1;
      
      // ✅ Filter available and unavailable times for this day in UTC
      const dayAvailableTimesUTC = availableTimesData.filter(timeRange => 
        timeRange.day_id.toString() === dayId.toString()
      );

      if (dayAvailableTimesUTC.length === 0) return [];

      const dayUnavailableTimesUTC = unavailableTimes.filter(timeRange => 
        timeRange.day_id.toString() === dayId.toString()
      );

      // ✅ Convert times from UTC to user timezone and get final ranges
      const availableRanges = [];
      
      dayAvailableTimesUTC.forEach((availableRange) => {
        if (!availableRange || !availableRange.from) return;
        
        const availableFromMinutes = utilTimeToMinutes(availableRange.from);
        let availableToMinutes;

        if (!availableRange.to || availableRange.to === null) {
          availableToMinutes = 23 * 60 + 59;
        } else {
          availableToMinutes = utilTimeToMinutes(availableRange.to);
        }
        
        let currentRanges = [{ from: availableFromMinutes, to: availableToMinutes }];
        
        dayUnavailableTimesUTC.forEach((unavailableRange) => {
          if (!unavailableRange || !unavailableRange.from) return;
          
          const unavailableFromMinutes = utilTimeToMinutes(unavailableRange.from);
          let unavailableToMinutes;

          if (!unavailableRange.to || unavailableRange.to === null) {
            unavailableToMinutes = 23 * 60 + 59;
          } else {
            unavailableToMinutes = utilTimeToMinutes(unavailableRange.to);
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

      // ✅ Generate time slots from ranges IN UTC first
      const utcTimeSlots = [];
      const durationCycle = parseInt(interviewData?.duration_cycle) || 15;
      const durationPeriod = interviewData?.duration_period || "minutes";
      const restCycle = parseInt(interviewData?.rest_cycle) || 0;
      
      const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
      const totalSlotDuration = durationInMinutes + restCycle;
      
      availableRanges.forEach((range) => {
        const startMinutes = range.from;
        const endMinutes = range.to;
        
        for (let currentMinutes = startMinutes; currentMinutes + durationInMinutes <= endMinutes; currentMinutes += totalSlotDuration) {
          const hours = Math.floor(currentMinutes / 60);
          const minutes = currentMinutes % 60;
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
         if (isSlotPastInUTC(targetISODate, formattedTime)) {
    continue;
  }
          utcTimeSlots.push(formattedTime);
        }
      });

      return utcTimeSlots;
    };
    
    const allUserTimes = [];
    const dateStr = selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const currentDayTimesUTC = generateTimesForDay(isoDate);
    
    currentDayTimesUTC.forEach(utcTime => {
      const converted = convertDateTimeWithTimezone(
        dateStr,
        utcTime,
        WORKSPACE_TIMEZONE, 
        userTimezone        
      );
      
      // Only include if it falls on the target date after conversion
      if (converted.date === dateStr) {
        const timeKey = converted.time.slice(0, 5);
        const isDisabled = !!disabledMap[timeKey];
        const isPastTime = isTimePast(isoDate, converted.time);
        
        if (!isDisabled && !isPastTime) {
          allUserTimes.push(converted.time);
        }
      }
    });

    // ✅ Check previous day (for times that might shift to current day)
    if (userTimezone !== WORKSPACE_TIMEZONE) {
      const prevDate = new Date(isoDate + 'T00:00:00.000Z');
      prevDate.setUTCDate(prevDate.getUTCDate() - 1);
      const prevISO = prevDate.toISOString().split('T')[0];
      const prevTimesUTC = generateTimesForDay(prevISO);
      
      const prevDay = String(prevDate.getUTCDate()).padStart(2, '0');
      const prevMonth = monthNames[prevDate.getUTCMonth()];
      const prevYear = prevDate.getUTCFullYear();
      const prevDateStr = `${prevDay} ${prevMonth} ${prevYear}`;

      prevTimesUTC.forEach(utcTime => {
        const converted = convertDateTimeWithTimezone(
          prevDateStr,
          utcTime,
          WORKSPACE_TIMEZONE,
          userTimezone
        );
        
        if (converted.date === dateStr) {
          const timeKey = converted.time.slice(0, 5);
          const isDisabled = !!disabledMap[timeKey];
          const isPastTime = isTimePast(isoDate, converted.time);
          
          if (!isDisabled && !isPastTime) {
            allUserTimes.push(converted.time);
          }
        }
      });
    }

    // ✅ Check next day (for times that might shift from current day)
    if (userTimezone !== WORKSPACE_TIMEZONE) {
      const nextDate = new Date(isoDate + 'T00:00:00.000Z');
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      const nextISO = nextDate.toISOString().split('T')[0];
      const nextTimesUTC = generateTimesForDay(nextISO);
      
      const nextDay = String(nextDate.getUTCDate()).padStart(2, '0');
      const nextMonth = monthNames[nextDate.getUTCMonth()];
      const nextYear = nextDate.getUTCFullYear();
      const nextDateStr = `${nextDay} ${nextMonth} ${nextYear}`;

      nextTimesUTC.forEach(utcTime => {
        const converted = convertDateTimeWithTimezone(
          nextDateStr,
          utcTime,
          WORKSPACE_TIMEZONE,
          userTimezone
        );
        
        if (converted.date === dateStr) {
          const timeKey = converted.time.slice(0, 5);
          const isDisabled = !!disabledMap[timeKey];
          const isPastTime = isTimePast(isoDate, converted.time);
          
          if (!isDisabled && !isPastTime) {
            allUserTimes.push(converted.time);
          }
        }
      });
    }

    const uniqueTimes = [...new Set(allUserTimes)].sort((a, b) => {
      const [ha, ma] = a.split(':').map(Number);
      const [hb, mb] = b.split(':').map(Number);
      return ha * 60 + ma - (hb * 60 + mb);
    });

    return uniqueTimes;
  };
const isSlotPastInUTC = (isoDate, utcTime) => {
  const now = new Date();
  const slotDateTimeUTC = new Date(`${isoDate}T${utcTime}Z`); // Z = UTC
  return slotDateTimeUTC < now;
};
  const isDateAvailable = (date) => {
    if (!date) return false;

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkDate < today) return false;

    if (!isDateInAvailableRange(checkDate, availableDates)) {
      return false;
    }

    const slots = calculateEffectiveAvailableTimes(
      checkDate, 
      availableTimes, 
      disabledTimes, 
      interviewDetails
    );
    
    return slots.length > 0;
  };

  const getFirstAvailableTime = (date, availableTimeSlots) => {
    if (!date || !availableTimeSlots || availableTimeSlots.length === 0) {
      return null;
    }
    
    const timeStr = Array.isArray(availableTimeSlots) ? availableTimeSlots[0] : null;
    if (!timeStr) return null;
    
    const normalizedTime = normalizeTimeFormat(timeStr);
    return normalizedTime.includes(':00') ? normalizedTime : normalizedTime + ':00';
  };

  // ============= Staff Selection =============
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
      // All times from API are in UTC - no conversion needed here
      if (isResourceMode && interviewDetails) {
        setAvailableDates(interviewDetails.available_dates || []);
        setAvailableTimes(interviewDetails.available_times || []);
        setUnavailableDates(interviewDetails.un_available_dates || []);
        setUnavailableTimes(interviewDetails.un_available_times || []);
        setDisabledTimes(staff.disabled_times || []);
      } else if (isCollectiveMode) {
        setAvailableDates(staff.collective_available_dates || []);
        setAvailableTimes(staff.collective_available_times || []);
        setUnavailableDates(staff.collective_unavailable_dates || []);
        setUnavailableTimes(staff.collective_unavailable_times || []);
        setDisabledTimes(staff.disabled_times || []);
      } else {
        // Regular staff mode
        setAvailableDates(staff.available_dates || []);
        setAvailableTimes(staff.available_times || []);
        setUnavailableDates(staff.un_available_dates || []);
        setUnavailableTimes(staff.un_available_times || []);
        setDisabledTimes(staff.disabled_times || []);
      }
      
      findFirstAvailableDateTime(staff);
    }
  };

  // ============= Find First Available Date/Time =============
  const findFirstAvailableDateTime = (staffData) => {
    const datesToUse = isResourceMode && interviewDetails 
      ? interviewDetails.available_dates 
      : isCollectiveMode 
        ? staffData.collective_available_dates
        : staffData.available_dates;
        
    const timesToUse = isResourceMode && interviewDetails 
      ? interviewDetails.available_times 
      : isCollectiveMode 
        ? staffData.collective_available_times
        : staffData.available_times;

    if (!datesToUse || datesToUse.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allPossibleDates = [];
    
    for (const dateRange of datesToUse) {
      if (!dateRange?.from) continue;
      
      try {
        const fromDate = new Date(dateRange.from.split(' ')[0]);
        const toDate = dateRange.to ? new Date(dateRange.to.split(' ')[0]) : new Date('2099-12-31');
        
        if (isNaN(fromDate.getTime())) continue;
        
        const startDate = new Date(Math.max(fromDate.getTime(), today.getTime()));
        startDate.setDate(startDate.getDate() - 1);
        
        const currentDate = new Date(Math.max(startDate.getTime(), today.getTime()));
        const endDate = new Date(toDate.getTime());
        endDate.setDate(endDate.getDate() + 1);
        
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
        timesToUse,
        staffData.disabled_times || [],
        interviewDetails
      );
      
      if (timeSlots.length > 0) {
        onDateSelect(new Date(date));
        onTimeSelect(timeSlots[0]);
        return;
      }
    }
    
    onDateSelect(null);
    onTimeSelect(null);
  };

  // ============= API Fetch =============
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

      // ✅ CRITICAL: In reschedule mode, always use fresh interview data, not appointment.staff_resource
      // appointment.staff_resource might have already converted times
      const useStaffResource = appointment?.staff_resource && 
      typeof appointment.staff_resource === 'object' && 
      Object.keys(appointment.staff_resource).length > 0;

      const dataSource = useStaffResource ? appointment.staff_resource : interviewData;
      console.log(dataSource);
      
      if (dataSource) {
        setInterviewDetails(interviewData);
        console.log('📊 Data Source:', useStaffResource ? 'staff_resource' : 'fresh API');
        console.log('⏰ Available Times (UTC):', dataSource.available_times);
        
        // All times from API are in UTC
        setAvailableDates(dataSource.available_dates || []);
        setAvailableTimes(dataSource.available_times || []);
        setUnavailableDates(dataSource.un_available_dates || []);
        setUnavailableTimes(dataSource.un_available_times || []);
        let disabledTimesToUse = dataSource.disabled_times || [];

      if (mode === 'reschedule') {
        if (appointment?.staff_resource?.disabled_times) {
          disabledTimesToUse = [...disabledTimesToUse, ...appointment.staff_resource.disabled_times];
        }
        if (appointment?.resource?.disabled_times) {
          disabledTimesToUse = [...disabledTimesToUse, ...appointment.resource.disabled_times];
        }
      }
        
        setDisabledTimes(disabledTimesToUse);

        if (dataSource.available_dates && dataSource.available_dates.length > 0) {
          const firstDate = new Date(dataSource.available_dates[0].from);
          setCurrentMonth(firstDate);
          
          setTimeout(() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const allPossibleDates = [];
            
            for (const dateRange of dataSource.available_dates) {
              if (!dateRange?.from) continue;
              
              try {
                const fromDate = new Date(dateRange.from.split(' ')[0]);
                const toDate = dateRange.to ? new Date(dateRange.to.split(' ')[0]) : new Date('2099-12-31');
                
                if (isNaN(fromDate.getTime())) continue;
                
                const startDate = new Date(Math.max(fromDate.getTime(), today.getTime()));
                startDate.setDate(startDate.getDate() - 1);
                
                const currentDate = new Date(Math.max(startDate.getTime(), today.getTime()));
                const endDate = new Date(toDate.getTime());
                endDate.setDate(endDate.getDate() + 1);
                
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
                dataSource.available_times || [],
                disabledTimesToUse,
                interviewData
              );
              
              if (timeSlots.length > 0) {
                onDateSelect(new Date(date));
                onTimeSelect(timeSlots[0]);
                break;
              }
            }
          }, 100);
        }
      }
    } catch (error) {
      setError(`${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ============= Effects =============
  useEffect(() => {
    if (selectedInterview) {
      onDateSelect(null);
      onTimeSelect(null);
      setShowTimeSlots(false);
      setError(null);
      setSelectedStaff([]); 
      setStaffInterview(null);
      setShowStaffDropdown(false);
      setInterviewDetails(null);
      fetchInterviewDetails(selectedInterview.share_link);
    }
  }, [selectedInterview]);

  useEffect(() => {
    if (selectedDate && availableTimes.length > 0 && interviewDetails) {
      const availableTimeSlots = calculateEffectiveAvailableTimes(
        selectedDate,
        availableTimes,
        disabledTimes,
        interviewDetails
      );

      if (selectedTime && availableTimeSlots.length > 0 && !availableTimeSlots.includes(normalizeTimeFormat(selectedTime))) {
        const firstAvailable = getFirstAvailableTime(selectedDate, availableTimeSlots);
        onTimeSelect(firstAvailable);
      }
    }
  }, [selectedDate, disabledTimes, availableTimes, interviewDetails]);

  useEffect(() => {
    if (selectedDate && interviewDetails && selectedTimezone) {
      const timeSlots = calculateEffectiveAvailableTimes(
        selectedDate,
        availableTimes,
        disabledTimes,
        interviewDetails
      );
      
      if (selectedTime && !timeSlots.some(slot => normalizeTimeFormat(slot) === normalizeTimeFormat(selectedTime))) {
        const firstAvailable = getFirstAvailableTime(selectedDate, timeSlots);
        onTimeSelect(firstAvailable);
      }
      
      if (!isDateAvailable(selectedDate)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allPossibleDates = [];
        
        for (const dateRange of availableDates) {
          if (!dateRange?.from) continue;
          
          try {
            const fromDate = new Date(dateRange.from.split(' ')[0]);
            const toDate = dateRange.to ? new Date(dateRange.to.split(' ')[0]) : new Date('2099-12-31');
            
            if (isNaN(fromDate.getTime())) continue;
            
            const startDate = new Date(Math.max(fromDate.getTime(), today.getTime()));
            startDate.setDate(startDate.getDate() - 1);
            
            const currentDate = new Date(Math.max(startDate.getTime(), today.getTime()));
            const endDate = new Date(toDate.getTime());
            endDate.setDate(endDate.getDate() + 1);
            
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
          const slots = calculateEffectiveAvailableTimes(
            date,
            availableTimes,
            disabledTimes,
            interviewDetails
          );
          
          if (slots.length > 0) {
            onDateSelect(new Date(date));
            onTimeSelect(slots[0]);
            return;
          }
        }
        
        onDateSelect(null);
        onTimeSelect(null);
      }
    }
  }, [selectedTimezone]);

  // ============= Event Handlers =============
  const handleDateSelectFromCalendar = (date) => {
    onDateSelect(date);
    
    const availableTimeSlots = calculateEffectiveAvailableTimes(
      date,
      availableTimes,
      disabledTimes,
      interviewDetails
    );
    
    const firstAvailable = getFirstAvailableTime(date, availableTimeSlots);
    onTimeSelect(firstAvailable);
    setShowTimeSlots(true);
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !interviewDetails) return [];
    
    return calculateEffectiveAvailableTimes(
      selectedDate, 
      availableTimes, 
      disabledTimes, 
      interviewDetails
    );
  };

  const getFormattedDisplayTime = () => {
    if (!selectedTime) return '';
    
    const timeSlots = getAvailableTimeSlots();
    const normalizedSelectedTime = normalizeTimeFormat(selectedTime);
    
    const timeStr = timeSlots.find(slot => normalizeTimeFormat(slot) === normalizedSelectedTime) || normalizedSelectedTime;
    const [hour, min] = normalizeTimeFormat(timeStr).split(':').map(Number);
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? 'pm' : 'am';
    
    return `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
  };

  // ============= Render =============
  return (
    <div className="mb-6">
      {/* Staff Selector */}
      {mode === 'schedule' && displayItems && displayItems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            {
              isResourceMode 
                ? <PiMonitorLight size={20} />
                : isCollectiveMode 
                ? <PiUsersThreeLight size={22} />
                : <AiOutlineUser size={18} />
            }
            {isResourceMode ? 'Select Resource' : isCollectiveMode ? 'Select Group': 'Select Staff'}
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowStaffDropdown(!showStaffDropdown)}
              className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {selectedStaff && Object.keys(selectedStaff).length > 0 ? (
                  <>
                    <div className="w-10 h-10 bg-cyan-800 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {selectedStaff?.name?.substring(0, 2).toUpperCase() || selectedStaff?.group_name?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium truncate max-w-[150px]">{selectedStaff.name || selectedStaff.group_name}</div>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">
                    {isResourceMode ? 'Select a resource' : isCollectiveMode ? 'Select a group': 'Select a staff'}
                  </span>
                )}
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {showStaffDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {displayItems && displayItems.length > 0 ? (
                  displayItems.map((item, index) => (
                    <button
                      key={
                        item.id || 
                        item.group_id || 
                        item.resource_id || 
                        item.staff_id || 
                        `item-${index}`
                      }
                      onClick={() => handleStaffSelect(item)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-10 h-10 bg-cyan-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {item.name?.substring(0, 2).toUpperCase() || item.group_name?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium truncate max-w-[150px]">{item.name || item.group_name}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {isResourceMode ? 'No resources available' : 'No staff available'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date & Time Section */}
      <h3 className="text-sm font-medium text-gray-700 mb-3">Date & Time</h3>
      
      {/* Interview Details Info */}
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

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 text-center py-4">
          <p className="text-sm text-gray-500">Loading availability...</p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (mode === 'reschedule' || 
        (selectedStaff && Object.keys(selectedStaff).length > 0) ||
        (!displayItems || displayItems.length === 0)) && (
        <>
          {/* Date Time Display Button */}
          <button
            onClick={() => setShowTimeSlots(!showTimeSlots)}
            className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <PiCalendarBlank size={16} className="text-gray-400" />
              <span className="text-sm">
                {selectedDate && selectedTime 
                  ? `${formatSelectedDate()} | ${getFormattedDisplayTime()}` 
                  : 'Select date and time'
                }
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform ${showTimeSlots ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Calendar and Time Slots */}
          {showTimeSlots && (
            <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-2 justify-between">
              {/* Calendar Section */}
              <div className='w-2/3'>
                {availableDates.length > 0 ? (
                  <Calendar
                    currentMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelectFromCalendar}
                    isDateAvailable={isDateAvailable}
                  />
                ) : (
                  <div className="text-gray-500 text-sm mt-4">No dates available currently</div>
                )}
              </div>
              
              {/* Time Slots Section */}
              <div className='w-1/3'>
                <TimeSlots
                  selectedInterview={interview}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  selectedEndTime={selectedEndTime}
                  onTimeSelect={onTimeSelect}
                  onEndTimeSelect={onEndTimeSelect} 
                  availableTimeSlots={getAvailableTimeSlots()}
                  getDayId={getDayId}
                  availableTimes={availableTimes}
                  isDateInUnavailableDatesRange={isDateInUnavailableDatesRange}
                  isResourceMode={isResourceMode}
                  requireEndTime={interview?.require_end_time === true}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DateTimeSelector;