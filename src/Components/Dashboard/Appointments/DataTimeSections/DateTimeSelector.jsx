import { useState, useEffect } from 'react';
import {  ChevronDown } from 'lucide-react';
import { PiCalendarBlank, PiMonitorLight, PiUsers, PiUsersThreeLight, PiUsersThreeThin } from "react-icons/pi";
// Import Calendar and TimeSlots components (in real app)
// For demo purposes, we'll include simplified versions here
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import { editInterviewById } from '../../../../redux/apiCalls/interviewCallApi';
import { useDispatch, useSelector } from 'react-redux';
import { PiMonitorThin } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { interview } = useSelector(state => state.interview);
console.log(StaffInterview);

const isResourceMode = interview?.type === "resource";
const isCollectiveMode = interview?.type === "collective-booking";
const displayItems = isResourceMode 
  ? interview?.resources 
  : isCollectiveMode 
    ? interview?.staff_group  
    : StaffInterview;
console.log(interview);

useEffect(() => {
    dispatch(editInterviewById(selectedInterview?.id));
},[dispatch, selectedInterview?.id]);
console.log(interview?.staff_group);


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

  // ============= Time Checking Functions =============
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
        
        return disabledDate === formattedDate && disabledTimeFormatted === normalizedTime;
      });
      
      return isDisabled;
    } catch (error) {
      console.error('Error in isTimeDisabled:', error);
      return false;
    }
  };

const isDateInUnavailableDatesRange = (date) => {
  if (!date || !unavailableDates || unavailableDates.length === 0) return false;

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return unavailableDates.some(range => {
    if (!range?.from) return false;

    // Parse 'from' date
    let fromStr = range.from.split(' ')[0].replace(/\//g, '-');
    const parts = fromStr.split('-');
    if (parts.length === 3 && parseInt(parts[0], 10) <= 31) {
      // Format: DD-MM-YYYY → convert to YYYY-MM-DD
      fromStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const fromDate = new Date(fromStr);
    fromDate.setHours(0, 0, 0, 0);
    if (isNaN(fromDate.getTime())) return false;

    // Case 1: to is null → only the 'from' day is unavailable
    if (range.to === null || range.to === undefined || range.to === '' || range.to === 'null') {
      return checkDate.toDateString() === fromDate.toDateString();
    }

    // Case 2: has 'to' → full range
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

    // Parse from date
    let fromStr = range.from.split(' ')[0].replace(/\//g, '-');
    const parts = fromStr.split('-');
    if (parts.length === 3 && parseInt(parts[0]) <= 31) {
      fromStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const fromDate = new Date(fromStr);
    fromDate.setHours(0, 0, 0, 0);
    if (isNaN(fromDate.getTime())) return false;

    // لو to: null → يعني من from للأبد (من التاريخ ده وكل اللي بعده متاح)
    if (range.to === null || range.to === undefined || range.to === '' || range.to === 'null') {
      return checkDate >= fromDate;
    }

    // لو في to → نطبق النطاق عادي
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

  const dayId = getDayId(selectedDate);
  const dayAvailableTimes = availableTimesData.filter(t => 
    t.day_id.toString() === dayId.toString()
  );

  if (dayAvailableTimes.length === 0) return [];

  // الجديد: ناخد unavailable_times بس لو التاريخ داخل unavailable_dates
  const shouldApplyUnavailableTimes = isDateInUnavailableDatesRange(selectedDate);
  const dayUnavailableTimes = shouldApplyUnavailableTimes
    ? unavailableTimes.filter(t => t.day_id.toString() === dayId.toString())
    : []; // لو خارج الفترة → مفيش unavailable_times خالص

  // باقي الكود زي ما هو...
  const timeToMinutes = (timeStr) => {
    const normalized = normalizeTimeFormat(timeStr);
    const [h, m] = normalized.split(':').map(Number);
    return h * 60 + m;
  };

  const availableRanges = [];

  dayAvailableTimes.forEach(range => {
    if (!range?.from) return;
    const from = timeToMinutes(range.from);
    const to = range.to ? timeToMinutes(range.to) : 24 * 60;

    let current = [{ from, to }];

    // نطرح unavailable_times بس لو موجودة
    dayUnavailableTimes.forEach(un => {
      if (!un?.from) return;
      const uFrom = timeToMinutes(un.from);
      const uTo = un.to ? timeToMinutes(un.to) : 24 * 60;

      const newRanges = [];
      current.forEach(r => {
        if (uTo <= r.from || uFrom >= r.to) {
          newRanges.push(r);
        } else {
          if (uFrom > r.from) newRanges.push({ from: r.from, to: Math.min(r.to, uFrom) });
          if (uTo < r.to) newRanges.push({ from: Math.max(r.from, uTo), to: r.to });
        }
      });
      current = newRanges.filter(r => r.from < r.to);
    });

    availableRanges.push(...current);
  });

  // توليد السلوتس (نفس الكود القديم)
  const durationCycle = parseInt(interviewData?.duration_cycle) || 15;
  const durationPeriod = interviewData?.duration_period || "minutes";
  const restCycle = parseInt(interviewData?.rest_cycle) || 0;
  const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
  const totalSlotDuration = durationInMinutes + restCycle;

  const today = new Date();
  today.setHours(0,0,0,0);
  const isToday = new Date(selectedDate).setHours(0,0,0,0) === today.getTime();
  const nowMinutes = isToday ? new Date().getHours() * 60 + new Date().getMinutes() : -1;

  const slots = [];
  availableRanges.forEach(r => {
    for (let m = r.from; m + durationInMinutes <= r.to; m += totalSlotDuration) {
      if (isToday && m < nowMinutes) continue;
      
      const h = Math.floor(m / 60).toString().padStart(2, '0');
      const min = (m % 60).toString().padStart(2, '0');
      const timeStr = `${h}:${min}`;

      if (!isTimeDisabled(selectedDate, timeStr, disabledTimes)) {
        slots.push(timeStr);
      }
    }
  });

  return [...new Set(slots)].sort();
};


const isDateAvailable = (date) => {
  if (!date) return false;

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkDate < today) return false;

  // 1. لازم يكون في نطاق التواريخ المتاحة
  if (!isDateInAvailableRange(checkDate)) return false;

  // 2. لازم يكون لليوم ده أوقات متاحة
  const dayId = getDayId(checkDate);
  const hasAvailableTimes = availableTimes.some(t => 
    t.day_id.toString() === dayId.toString()
  );
  if (!hasAvailableTimes) return false;

  // 3. الأهم: نحسب الأوقات الفعلية بعد طرح unavailable_times (بس لو التاريخ داخل unavailable_dates)
  const slots = calculateEffectiveAvailableTimes(checkDate, availableTimes, disabledTimes, interviewDetails);

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
    // For resources: use interview data for dates/times, but resource's disabled_times
    if (isResourceMode && interviewDetails) {
      setAvailableDates(interviewDetails.available_dates || []);
      setAvailableTimes(interviewDetails.available_times || []);
      setUnavailableDates(interviewDetails.un_available_dates || []);
      setUnavailableTimes(interviewDetails.un_available_times || []);
      setDisabledTimes(staff.disabled_times || []);
    } else {
      setAvailableDates(staff.available_dates || []);
      setAvailableTimes(staff.available_times || []);
      setUnavailableDates(staff.un_available_dates || []);
      setUnavailableTimes(staff.un_available_times || []);
      setDisabledTimes(staff.disabled_times || []);
    }
    if (isCollectiveMode) {
      setAvailableDates(staff.collective_available_dates || []);
      setAvailableTimes(staff.collective_available_times || []);
      setUnavailableDates(staff.collective_unavailable_dates || []);
      setUnavailableTimes(staff.collective_unavailable_times || []);
      setDisabledTimes(staff.disabled_times || []);
    }
    
    if (staff.available_dates && staff.available_dates.length > 0) {
      // Determine which dates to use
      const datesToUse = isResourceMode && interviewDetails 
        ? interviewDetails.available_dates 
        : staff.available_dates;
      const timesToUse = isResourceMode && interviewDetails 
        ? interviewDetails.available_times 
        : staff.available_times;
      const disabledTimesToUse = staff.disabled_times || [];

      for (const dateRange of datesToUse) {
        if (!dateRange || !dateRange.from) continue;

        try {
          const fromDate = new Date(dateRange.from);
          if (isNaN(fromDate.getTime())) continue;

          const checkDates = isResourceMode && interviewDetails 
            ? interviewDetails.available_dates 
            : staff.available_dates;
          const checkTimes = isResourceMode && interviewDetails 
            ? interviewDetails.available_times 
            : staff.available_times;

          if (isDateAvailable(fromDate, checkDates, checkTimes)) {
            const availableTimeSlots = calculateEffectiveAvailableTimes(
              fromDate,
              checkTimes,
              disabledTimesToUse,
              interviewDetails
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

      const useStaffResource = appointment?.staff_resource && 
            typeof appointment.staff_resource === 'object' && 
            Object.keys(appointment.staff_resource).length > 0;

      const dataSource = useStaffResource ? appointment.staff_resource : interviewData;

      if (dataSource) {
        setInterviewDetails(interviewData);
        setAvailableDates(dataSource.available_dates || []);
        setAvailableTimes(dataSource.available_times || []);
        setUnavailableDates(dataSource.un_available_dates || []);
        setUnavailableTimes(dataSource.un_available_times || []);
        
        const disabledTimesToUse = isResourceMode && appointment?.resource?.disabled_times
          ? [...(dataSource.disabled_times || []), ...appointment.resource.disabled_times]
          : (dataSource.disabled_times || []);
        
        setDisabledTimes(disabledTimesToUse);

        if (dataSource.available_dates && dataSource.available_dates.length > 0) {
          for (const dateRange of dataSource.available_dates) {
            if (!dateRange || !dateRange.from) continue;

            try {
              const fromDate = new Date(dateRange.from);
              if (isNaN(fromDate.getTime())) continue;

              if (isDateAvailable(fromDate, dataSource.available_dates, dataSource.available_times)) {
                const availableTimeSlots = calculateEffectiveAvailableTimes(
                  fromDate,
                  dataSource.available_times || [],
                  disabledTimesToUse,
                  interviewData
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
                   displayItems.map((item) => (
                    <button
                     key={item.id || item.group_id}
                      onClick={() => handleStaffSelect(item)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-10 h-10 bg-cyan-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {item.name?.substring(0, 2).toUpperCase() || item.group_name?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium truncate  max-w-[150px]">{item.name || item.group_name}</div>
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
      {!isLoading && ( mode === 'reschedule' || 
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