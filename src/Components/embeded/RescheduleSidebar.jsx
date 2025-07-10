import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { rescheduleAppointment } from '../../redux/apiCalls/AppointmentCallApi';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Reschedule Sidebar Component
const RescheduleSidebar = ({ 
  isOpen, 
  onClose, 
  appointmentData,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [error, setError] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [disabledTimes, setDisabledTimes] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  const calendarRef = useRef(null);
  const dispatch = useDispatch();

  // Get IDs from props and params
  const idAppointment = appointmentData?.id;
  const { id: shareId } = useParams();

  console.log('📍 Appointment ID:', idAppointment);
  console.log('📍 Share ID:', shareId);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Fetch interview details from API
  const fetchInterviewDetails = async (shareLink) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://booking-system-demo.efc-eg.com/api/public/interview/${shareLink}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const interview = data?.data?.interview;

      console.log("📦 Full API Response:", data);
      console.log("🎯 Interview Data:", interview);

      if (interview) {
        setInterviewDetails(interview);
        setAvailableDates(interview.available_dates || []);
        setAvailableTimes(interview.available_times || []);
        setDisabledTimes(interview.disabled_times || []);

        // Set current month to first available date
        if (interview.available_dates && interview.available_dates.length > 0) {
          const firstDate = new Date(interview.available_dates[0].from);
          setCurrentMonth(firstDate);
          
          // Find first available date and time
          findFirstAvailableDateTime(interview);
        }
      } else {
        throw new Error("Interview data not available");
      }

    } catch (error) {
      console.error('❌ Error fetching interview details:', error);
      setError(`Error loading interview details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Find first available date and time
  const findFirstAvailableDateTime = (interview) => {
    if (!interview.available_dates || interview.available_dates.length === 0) return;

    for (const dateRange of interview.available_dates) {
      const startDate = new Date(dateRange.from.split(' ')[0]);
      const endDate = new Date(dateRange.to.split(' ')[0]);
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (isDateAvailable(new Date(d), interview)) {
          const timeSlots = generateTimeSlots(new Date(d), interview);
          if (timeSlots.length > 0) {
            setSelectedDate(new Date(d));
            setSelectedTime(timeSlots[0]);
            setAvailableTimeSlots(timeSlots);
            return;
          }
        }
      }
    }
  };

  // Check if date is available
  const isDateAvailable = (date, interview) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Check if date is within available date ranges
    const isInRange = interview.available_dates.some(range => {
      const startDate = new Date(range.from.split(' ')[0]);
      const endDate = new Date(range.to.split(' ')[0]);
      return date >= startDate && date <= endDate;
    });

    if (!isInRange) return false;

    // Check if day of week is available
    const isDayAvailable = interview.available_times.some(timeSlot => {
      return timeSlot.day_id === (dayOfWeek === 0 ? 7 : dayOfWeek); // Convert Sunday from 0 to 7
    });

    return isDayAvailable;
  };

  // Generate time slots for a specific date
  const generateTimeSlots = (date, interview) => {
    const dayOfWeek = date.getDay();
    const dayId = dayOfWeek === 0 ? 7 : dayOfWeek;
    
    // Find available times for this day
    const dayTimeSlot = interview.available_times.find(slot => slot.day_id === dayId);
    if (!dayTimeSlot) return [];

    const startTime = dayTimeSlot.from;
    const endTime = dayTimeSlot.to;
    const duration = parseInt(interview.duration_cycle || 15);
    
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + duration)) {
      const timeStr = time.toTimeString().substring(0, 5);
      
      // Check if this time slot is disabled
      const isDisabled = interview.disabled_times.some(disabled => {
        const disabledDate = disabled.date;
        const disabledTime = disabled.time.substring(0, 5);
        const currentDateStr = date.toISOString().split('T')[0];
        return disabledDate === currentDateStr && disabledTime === timeStr;
      });

      if (!isDisabled) {
        // Convert to 12-hour format
        const hour = time.getHours();
        const minute = time.getMinutes();
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour % 12 || 12;
        const displayTime = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
        
        slots.push({
          value: timeStr,
          display: displayTime
        });
      }
    }
    
    return slots;
  };

  // Load interview details when component opens
  useEffect(() => {
    if (isOpen && shareId && !interviewDetails) {
      fetchInterviewDetails(shareId);
    }
  }, [isOpen, shareId]);

  // Handle calendar outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
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

  // Update available time slots when date changes
  useEffect(() => {
    if (selectedDate && interviewDetails) {
      const timeSlots = generateTimeSlots(selectedDate, interviewDetails);
      setAvailableTimeSlots(timeSlots);
      
      // Reset selected time if it's not available for the new date
      if (selectedTime && !timeSlots.some(slot => slot.value === selectedTime)) {
        setSelectedTime(timeSlots.length > 0 ? timeSlots[0].value : '');
      }
    }
  }, [selectedDate, interviewDetails]);

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

  const handleDateClick = (day) => {
    if (!day || !interviewDetails) return;
    
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (isDateAvailable(clickedDate, interviewDetails)) {
      setSelectedDate(clickedDate);
      setIsCalendarOpen(false);
    }
  };

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
    if (!selectedDate || !selectedTime || !idAppointment) {
      setError('Please select both date and time');
      return;
    }

    setIsRescheduling(true);
    setError(null);

    const formattedDate = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log("🟢 Sending Reschedule Data:", {
      appointmentId: idAppointment,
      date: formattedDate,
      time: selectedTime,
      time_zone: timeZone,
    });

    try {
      const rescheduleData = {
        date: formattedDate,
        time: selectedTime,
        time_zone: timeZone,
      };

      console.log("📤 Dispatching reschedule action...");
      const result = await dispatch(rescheduleAppointment(idAppointment, rescheduleData));
      
      console.log("📨 Raw API Response:", result);
      console.log("📨 Response Type:", typeof result);
      console.log("📨 Response Keys:", Object.keys(result || {}));

      // Check for success in various response formats
      const isSuccess = 
        result === true ||
        result?.success === true ||
        result?.payload?.success === true ||
        result?.meta?.requestStatus === 'fulfilled' ||
        result?.type?.includes('fulfilled') ||
        (result?.status >= 200 && result?.status < 300);

      if (isSuccess) {
        console.log("✅ Reschedule successful!");
        alert('The appointment has been successfully rescheduled');
        onClose();
      } else {
        console.log("❌ Reschedule failed - Response:", result);
        const errorMessage = 
          result?.error?.message ||
          result?.payload?.message ||
          result?.data?.message ||
          result?.message ||
          'Unable to reschedule appointment. Please try again.';
        
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('❌ Error in handleReschedule:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      
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
      <div className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
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

            {/* Appointment Info */}
            {!isLoading && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{appointmentData?.title || interviewDetails?.name || 'Interview'}</h3>
                      {interviewDetails && (
                        <p className="text-sm text-gray-600">
                          Duration: {interviewDetails.duration_cycle} {interviewDetails.duration_period}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Booking Id: {appointmentData?.bookingId || 'N/A'}</p>
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
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Africa/Cairo - EEST (+03:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Slot Availability */}
            {!isLoading && selectedDate && availableTimeSlots.length > 0 && (
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

            {/* No available slots message */}
            {!isLoading && selectedDate && availableTimeSlots.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No available time slots for selected date
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