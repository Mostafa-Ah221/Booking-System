import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { rescheduleAppointment } from '../../../redux/apiCalls/AppointmentCallApi';
import { fetchAppointments } from '../../../redux/apiCalls/AppointmentCallApi';

const RescheduleSidebar = ({ isOpen, onClose, appointment, currentFilters = {}, onRescheduleSuccess }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showInterviewDropdown, setShowInterviewDropdown] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [disabledTimes, setDisabledTimes] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState(null); 
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { interviews = [] } = useSelector(state => state.interview);

  const isTimeDisabled = (date, time, disabledTimes = []) => {
    if (!date || !time || !disabledTimes || !Array.isArray(disabledTimes)) {
      return false;
    }
    
    try {
      let formattedDate;
      
      if (date instanceof Date) {
        formattedDate = date.toISOString().split('T')[0];
      } else if (typeof date === 'string') {
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

  const generateTimeSlots = (
    availableTimes,
    selectedDate = null,
    disabledTimes = [],
    interviewData = null
  ) => {
    if (!availableTimes || !Array.isArray(availableTimes) || !selectedDate) {
      return [];
    }

    const timeSlots = [];
    
    let durationCycle = 15;
    let durationPeriod = "minutes";
    
    if (interviewData) {
      durationCycle = parseInt(interviewData.duration_cycle) || 15;
      durationPeriod = interviewData.duration_period || "minutes";
    }
    
    console.log(`🕒 Using duration: ${durationCycle} ${durationPeriod}`);
    
    const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;

    const dayOfWeek = selectedDate.getDay();
    const dayMapping = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 };
    const dayId = dayMapping[dayOfWeek];

    const dayTimes = availableTimes.filter(timeRange => timeRange.day_id === dayId);

    dayTimes.forEach((timeRange) => {
      if (!timeRange || !timeRange.from || !timeRange.to) return;

      const [fromHour, fromMinute] = timeRange.from.split(":").map(Number);
      const [toHour, toMinute] = timeRange.to.split(":").map(Number);

      const start = new Date();
      start.setHours(fromHour, fromMinute, 0, 0);

      const end = new Date();
      end.setHours(toHour, toMinute, 0, 0);

      const current = new Date(start);

      while (current < end) {
        const hours = current.getHours().toString().padStart(2, "0");
        const minutes = current.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;

        if (!isTimeDisabled(selectedDate, formattedTime, disabledTimes)) {
          timeSlots.push({ time: formattedTime });
        }

        current.setMinutes(current.getMinutes() + durationInMinutes);
      }
    });

    const uniqueSlots = [...new Set(timeSlots.map((slot) => slot.time))]
      .sort()
      .map((time) => ({ time }));

    return uniqueSlots;
  };

  const getFirstAvailableTime = (date, availableTimeSlots, disabledTimes) => {
    if (!date || !availableTimeSlots || !Array.isArray(availableTimeSlots)) {
      return null;
    }
    
    const availableTime = availableTimeSlots.find(timeSlot => 
      !isTimeDisabled(date, timeSlot.time, disabledTimes)
    );
    
    return availableTime ? availableTime.time : null;
  };

  // Reset state when sidebar opens/closes
  useEffect(() => {
    if (isOpen && appointment) {
      const currentInterview = interviews.find(int => int.id === appointment.interview_id);
      if (currentInterview) {
        setSelectedInterview(currentInterview);
        fetchInterviewDetails(currentInterview.share_link);
      }
      // Reset error when opening
      setError(null);
    }
  }, [isOpen, appointment, interviews]);
  
  const fetchInterviewDetails = async (shareLink) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://booking-system-demo.efc-eg.com/api/public/interview/${shareLink}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const interviewData = data?.data?.interview;

      console.log("📦 Full API Response:", data);
      console.log("🎯 Extracted Interview Data:", interviewData);

      if (interviewData) {
        console.log("✅ Success fetching interview data");
        console.log("🗓️ Available Dates:", interviewData.available_dates);
        console.log("🕒 Available Times:", interviewData.available_times);
        console.log("⛔ Disabled Times:", interviewData.disabled_times);
        console.log("⏱️ Duration Settings:", {
          duration_cycle: interviewData.duration_cycle,
          duration_period: interviewData.duration_period
        });

        setInterviewDetails(interviewData); // حفظ تفاصيل المقابلة
        setAvailableDates(interviewData.available_dates || []);
        setAvailableTimes(interviewData.available_times || []);
        setDisabledTimes(interviewData.disabled_times || []);

        // البحث عن أول تاريخ ووقت متاح
        if (interviewData.available_dates && interviewData.available_dates.length > 0) {
          for (const dateRange of interviewData.available_dates) {
            if (!dateRange || !dateRange.from) continue;
            
            try {
              const dateObj = new Date(dateRange.from.split(' ')[0]);
              if (isNaN(dateObj.getTime())) continue;
              
              if (isDateAvailable(dateObj, interviewData.available_dates, interviewData.available_times)) {
                const availableTimeSlots = generateTimeSlots(
                  interviewData.available_times || [],
                  dateObj,
                  interviewData.disabled_times || [],
                  interviewData 
                );
                
                const firstAvailableTime = getFirstAvailableTime(
                  dateObj, 
                  availableTimeSlots, 
                  interviewData.disabled_times || []
                );
                
                if (firstAvailableTime) {
                  setSelectedDate(dateObj);
                  setSelectedTime(firstAvailableTime);
                  break;
                }
              }
            } catch (err) {
              console.warn('Error processing date:', dateRange.from, err);
              continue;
            }
          }
        }
      } else {
        throw new Error("بيانات المقابلة غير متوفرة");
      }

    } catch (error) {
      console.error('❌ Error fetching interview details:', error);
      setError(` ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowTimeSlots(false);
    setShowInterviewDropdown(false);
    setError(null);
    setInterviewDetails(null);
    fetchInterviewDetails(interview.share_link);
  };

  const isDateAvailable = (date, availableDatesRanges = availableDates, availableTimesData = availableTimes) => {
    if (!availableDatesRanges || availableDatesRanges.length === 0) return false;
  
    const dayOfWeek = date.getDay();
    const dayMapping = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 };
    const dayId = dayMapping[dayOfWeek];
  
    const isInDateRange = availableDatesRanges.some(range => {
      const fromDate = new Date(range.from.split(' ')[0] + 'T00:00:00');
      const toDate = new Date(range.to.split(' ')[0] + 'T23:59:59');
      return date >= fromDate && date <= toDate;
    });
  
    if (!isInDateRange) {
      return false;
    }

    const isDayAvailable = availableTimesData.some(
      time => time.day_id === dayId
    );

    if (isDayAvailable) {
      const timeSlots = generateTimeSlots(
        availableTimesData,
        date,
        disabledTimes,
        interviewDetails
      );
      return timeSlots.length > 0;
    }
  
    return false;
  };

  useEffect(() => {
    if (selectedDate && availableTimes.length > 0 && interviewDetails) {
      const availableTimeSlots = generateTimeSlots(
        availableTimes,
        selectedDate,
        disabledTimes,
        interviewDetails 
      );

      if (selectedTime && !getAvailableTimeSlots().some(slot => slot.value === selectedTime + ':00')) {
        const firstAvailable = getFirstAvailableTime(selectedDate, availableTimeSlots, disabledTimes);
        setSelectedTime(firstAvailable);
      }
    }
  }, [selectedDate, disabledTimes, availableTimes, interviewDetails]);

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !interviewDetails) return [];
    
    const durationCycle = parseInt(interviewDetails.duration_cycle) || 15;
    const durationPeriod = interviewDetails.duration_period || "minutes";
    const durationInMinutes = durationPeriod === "hours" ? durationCycle * 60 : durationCycle;
    
    const dayOfWeek = selectedDate.getDay();
    const dayMapping = {
      0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7
    };
    
    const availableDay = availableTimes.find(day => day.day_id === dayMapping[dayOfWeek]);
    if (!availableDay) return [];
    
    const slots = [];
    const fromTime = availableDay.from;
    const toTime = availableDay.to;
    
    const [fromHour, fromMin] = fromTime.split(':').map(Number);
    const [toHour, toMin] = toTime.split(':').map(Number);
    
    const fromMinutes = fromHour * 60 + fromMin;
    const toMinutes = toHour * 60 + toMin;
    
    for (let minutes = fromMinutes; minutes < toMinutes; minutes += durationInMinutes) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;
      const timeStrShort = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      if (!isTimeDisabled(selectedDate, timeStrShort, disabledTimes)) {
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayTime = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
        
        slots.push({ value: timeStr, display: displayTime });
      }
    }
    
    return slots;
  };

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
      setSelectedDate(selected);
      
      const availableTimeSlots = generateTimeSlots(
        availableTimes,
        selected,
        disabledTimes,
        interviewDetails 
      );
      
      const firstAvailable = getFirstAvailableTime(selected, availableTimeSlots, disabledTimes);
      setSelectedTime(firstAvailable);
      setShowTimeSlots(true);
    }
  };

  const handleTimeSelect = (timeValue) => {
    setSelectedTime(timeValue);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return `${String(selectedDate.getDate()).padStart(2, '0')}-${monthNames[selectedDate.getMonth()]}-${selectedDate.getFullYear()}`;
  };
  
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isAvailable = isDateAvailable(dayDate);
      const isToday = new Date().toDateString() === dayDate.toDateString();
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={!isAvailable}
          className={`p-2 w-10 h-10 text-sm rounded-lg transition-colors ${
            isToday ? 'border border-blue-500' : ''
          } ${
            selectedDate && selectedDate.toDateString() === dayDate.toDateString() 
              ? 'bg-blue-600 text-white' 
              : isAvailable 
                ? 'text-gray-800 hover:bg-gray-100 cursor-pointer' 
                : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !appointment) {
      return;
    }

    const timeShort = selectedTime.slice(0, 5);
    if (isTimeDisabled(selectedDate, timeShort, disabledTimes)) {
      
      const availableTimeSlots = generateTimeSlots(
        availableTimes,
        selectedDate,
        disabledTimes,
        interviewDetails
      );
      
      const alternativeTime = getFirstAvailableTime(selectedDate, availableTimeSlots, disabledTimes);
      if (alternativeTime) {
        setSelectedTime(alternativeTime);
      }
      return;
    }

    setIsRescheduling(true);
    setError(null);

    const formattedDate = selectedDate.toLocaleDateString('en-CA');
    const formattedTime = selectedTime?.slice(0, 5);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log("🟢 Sending Reschedule Data:", {
      appointmentId: appointment.id,
      date: formattedDate,
      time: formattedTime,
      time_zone: timeZone,
    });

    try {
      const rescheduleData = {
        date: formattedDate,
        time: formattedTime,
        time_zone: timeZone,
      };

      const result = await dispatch(rescheduleAppointment(appointment.id, rescheduleData));

      if (result.success) {
        console.log("✅ Reschedule successful:", result);
        
        // Show success message
        alert('The appointment has been successfully rescheduled');
        
        // Close the sidebar first
        onClose();
        
        // Call the success callback if provided
        if (onRescheduleSuccess) {
          onRescheduleSuccess();
        } else {
          // Fallback: Refresh appointments with broader filters
          try {
            // إضافة تأخير قصير للتأكد من تحديث البيانات في الخادم
            setTimeout(async () => {
              // استخدام فلاتر أوسع لضمان ظهور الموعد المُعدّل
              const broadFilters = {
                ...currentFilters,
                // إزالة فلاتر التاريخ المحددة لضمان عرض جميع المواعيد
                from_date: null,
                to_date: null,
                status: null, // إظهار جميع الحالات
              };
              
              await dispatch(fetchAppointments(broadFilters));
              console.log("✅ Appointments refreshed successfully with broad filters");
            }, 1000);
          } catch (fetchError) {
            console.warn("⚠️ Failed to refresh appointments list:", fetchError);
          }
        }

      } else {
        console.error("❌ Reschedule failed:", result);
        setError(`فشل في إعادة الجدولة: ${result.message}`);
        alert(`فشل في إعادة الجدولة: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Unexpected error during reschedule:', error);
      const errorMessage = 'حدث خطأ غير متوقع أثناء إعادة الجدولة';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsRescheduling(false);
    }
  };

  if (!isOpen) return null;

  const timeSlots = getAvailableTimeSlots();

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-xs text-red-500 hover:text-red-700 mt-1"
              >
                إخفاء
              </button>
            </div>
          )}

          {/* Duration Info Display */}
          {interviewDetails && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                ⏱️ Slot Duration: {interviewDetails.duration_cycle} {interviewDetails.duration_period}
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Interview</h3>
            <div className="relative">
              <button
                onClick={() => setShowInterviewDropdown(!showInterviewDropdown)}
                className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {selectedInterview ? (
                    <>
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {selectedInterview.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{selectedInterview.name}</div>
                        <div className="text-sm text-gray-500">
                          {selectedInterview.duration ? `${selectedInterview.duration} mins` : ''}
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500">Select an interview</span>
                  )}
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform ${showInterviewDropdown ? 'rotate-180' : ''}`} 
                />
              </button>

              {showInterviewDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {interviews.map((interview) => (
                    <button
                      key={interview.id}
                      onClick={() => handleInterviewSelect(interview)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {interview.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{interview.name}</div>
                        <div className="text-sm text-gray-500">
                          {interview.duration ? `${interview.duration} mins` : ''}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="mb-6 text-center py-4">
              <p className="text-sm text-gray-500">Loading availability...</p>
            </div>
          )}

          {selectedInterview && !isLoading && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Date & Time</h3>
              
              <button
                onClick={() => setShowTimeSlots(!showTimeSlots)}
                className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm">
                    {selectedDate && selectedTime 
                      ? `${formatSelectedDate()} | ${timeSlots.find(slot => slot.value === selectedTime)?.display || selectedTime.slice(0, 5)}` 
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
                <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
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

                  {!isLoading && availableDates.length > 0 ? (
                    <div className="grid grid-cols-7 gap-1 mt-4">
                      {renderCalendar()}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm mt-4">جاري تحميل التواريخ المتاحة...</div>
                  )}

                  {selectedDate && timeSlots.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Available Slots</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {timeSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleTimeSelect(slot.value)}
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

                  {selectedDate && timeSlots.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No available slots for this date</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {appointment && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Client</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {appointment.name?.substring(0, 1).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{appointment.name}</div>
                  <div className="text-sm text-gray-500">{appointment.email}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                defaultChecked
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Send updates to client</span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || !selectedInterview || isRescheduling || isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              selectedDate && selectedTime && selectedInterview && !isRescheduling && !isLoading
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isRescheduling ? 'Rescheduling...' : 'Reschedule Appointment'}
          </button>
        </div>
      </div>
    </>
  );
};

export default RescheduleSidebar; 