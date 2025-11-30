import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, ChevronLeft, ChevronRight, User, X, Package } from 'lucide-react';

// ==================== Theme Configuration ====================
const theme = {
  primary: '#6C5CE7',
  primaryHover: '#5B4BC4',
  secondary: '#A29BFE',
  success: '#00B894',
  danger: '#FF7675',
  light: '#F8F9FA',
  dark: '#2D3436'
};

// ==================== Modern Calendar Modal Component ====================
const ModernCalendarModal = ({ 
  show, 
  onClose, 
  selectedDate, 
  onDateSelect, 
  availableDates = [],
  unavailableDates = [],
  disabledTimes = [],
  availableTimesFromAPI = [],
  unavailableTimes = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
      return null;
    }
  };

  const isDateAvailable = (day, month, year) => {
    const checkDate = new Date(Date.UTC(year, month, day));
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    
    if (checkDate < todayUTC) return false;

    const isInDateRange = availableDates.some(dateRange => {
      try {
        let fromDateStr = dateRange.from.split(' ')[0];
        fromDateStr = fromDateStr.replace(/\//g, '-');
        let fromParts = fromDateStr.split('-');
        if (fromParts.length === 3 && parseInt(fromParts[0], 10) <= 31) {
          fromDateStr = `${fromParts[2]}-${fromParts[1]}-${fromParts[0]}`;
        }
        const fromDate = new Date(fromDateStr + 'T00:00:00.000Z');
        
        if (dateRange.to === null || dateRange.to === undefined) {
          return checkDate >= fromDate;
        }
        
        let toDateStr = dateRange.to.split(' ')[0];
        toDateStr = toDateStr.replace(/\//g, '-');
        let toParts = toDateStr.split('-');
        if (toParts.length === 3 && parseInt(toParts[0], 10) <= 31) {
          toDateStr = `${toParts[2]}-${toParts[1]}-${toParts[0]}`;
        }
        const toDate = new Date(toDateStr + 'T00:00:00.000Z');
        return checkDate >= fromDate && checkDate <= toDate;
      } catch (error) {
        return false;
      }
    });
    
    if (!isInDateRange) return false;

    const dayOfWeek = checkDate.getUTCDay();
    const availableDayNumbers = availableTimesFromAPI
      .map(timeRange => {
        const dayMapping = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6 };
        return dayMapping[timeRange.day_id];
      })
      .filter(day => day !== undefined);
    
    return availableDayNumbers.includes(dayOfWeek);
  };

  const formatDateString = (day, month, year) => {
    const dayFormatted = day.toString().padStart(2, '0');
    const monthFormatted = monthAbbreviations[month];
    return `${dayFormatted} ${monthFormatted} ${year}`;
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const startDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(day, currentMonth, currentYear);
      const isSelected = selectedDate === dateString;
      const isAvailable = isDateAvailable(day, currentMonth, currentYear);
      const currentDateUTC = new Date(Date.UTC(currentYear, currentMonth, day));
      const isToday = todayUTC.getTime() === currentDateUTC.getTime();
      const isPastDate = currentDateUTC < todayUTC;
      
      days.push(
        <button
          key={day}
          disabled={!isAvailable || isPastDate}
          onClick={() => {
            if (isAvailable && !isPastDate) {
              onDateSelect(dateString);
              onClose();
            }
          }}
          className={`w-10 h-10 text-sm font-medium rounded-lg transition-all ${
            isPastDate ? 'text-gray-300 cursor-not-allowed' :
            !isAvailable ? 'text-gray-300 cursor-not-allowed' :
            isSelected ? 'bg-purple-600 text-white shadow-lg scale-110' :
            isToday ? 'bg-blue-100 text-blue-600 border-2 border-blue-400' :
            'text-gray-700 hover:bg-purple-100 hover:scale-105'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Select Date</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateMonth('prev')} 
              className="p-2 hover:bg-purple-100 rounded-lg transition-all">
              <ChevronLeft className="w-5 h-5 text-purple-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button onClick={() => navigateMonth('next')} 
              className="p-2 hover:bg-purple-100 rounded-lg transition-all">
              <ChevronRight className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendar()}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mt-6 pt-4 border-t">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border-2 border-blue-400 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-600 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== Modern Time Selection Modal ====================
const ModernTimeModal = ({ 
  show, 
  onClose, 
  selectedTime, 
  onTimeSelect, 
  availableTimes = [],
  selectedDate,
  disabledTimes = [],
  unavailableTimes = [],
  unavailableDates = []
}) => {
  const convertDateFormat = (dateStr) => {
    try {
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
    } catch (error) {
      return null;
    }
  };

  const isTimeBooked = (selectedDate, timeToCheck) => {
    if (!selectedDate || !timeToCheck) return false;
    const formattedSelectedDate = convertDateFormat(selectedDate);
    if (!formattedSelectedDate) return false;
    const cleanTimeToCheck = timeToCheck.substring(0, 5);

    return disabledTimes.some(disabledTime => {
      if (!disabledTime || !disabledTime.date || !disabledTime.time) return false;
      const disabledTimeStr = disabledTime.time.substring(0, 5);
      return disabledTime.date === formattedSelectedDate && disabledTimeStr === cleanTimeToCheck;
    });
  };

  const groupTimesByPeriod = (times) => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    times.forEach(timeSlot => {
      const time = typeof timeSlot === 'string' ? timeSlot : timeSlot?.time;
      if (!time || !time.includes(':')) return;
      const hour = parseInt(time.split(':')[0]);
      
      if (hour < 12) morning.push(time);
      else if (hour < 17) afternoon.push(time);
      else evening.push(time);
    });

    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = groupTimesByPeriod(availableTimes);

  const TimeSection = ({ title, times, bgColor }) => {
    if (times.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className={`text-sm font-semibold text-gray-700 mb-3 px-3 py-2 ${bgColor} rounded-lg`}>
          {title}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {times.map((time) => {
            const isBooked = isTimeBooked(selectedDate, time);
            
            return (
              <button
                key={time}
                disabled={isBooked}
                onClick={() => {
                  if (!isBooked) {
                    onTimeSelect(time);
                    onClose();
                  }
                }}
                className={`p-3 text-sm font-medium rounded-lg transition-all ${
                  isBooked
                    ? 'border-2 border-red-200 bg-red-50 text-red-600 cursor-not-allowed line-through'
                    : selectedTime === time 
                      ? 'bg-purple-600 text-white shadow-lg scale-105' 
                      : 'border-2 border-gray-200 hover:bg-purple-50 hover:border-purple-300 text-gray-700'
                }`}
              >
                {time}
                {isBooked && <div className="text-[10px] mt-1">Booked</div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Select Time</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {selectedDate && (
            <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center text-purple-700">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-semibold text-sm">Selected Date: {selectedDate}</span>
              </div>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto pr-2">
            <TimeSection title="☀️ Morning (6:00 AM - 12:00 PM)" times={morning} bgColor="bg-yellow-50" />
            <TimeSection title="🌤️ Afternoon (12:00 PM - 5:00 PM)" times={afternoon} bgColor="bg-orange-50" />
            <TimeSection title="🌙 Evening (5:00 PM - 11:00 PM)" times={evening} bgColor="bg-indigo-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== Main Booking Component ====================
const ModernBookingApp = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('Africa/Cairo');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', code_phone: '+20' });
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Mock interview ID - replace with actual from URL params
  const interviewId = 'demo-interview-123';

  // Fetch booking data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = {
          name: 'Recruitment Strategy Meeting',
          service_name: 'Recruitment Strategy Meeting',
          provider_name: 'Frist Space',
          duration: '30 mins',
          duration_cycle: 30,
          duration_period: 'minutes',
          photo: null,
          available_dates: [
            { from: '2025-11-01 00:00:00', to: '2025-11-30 23:59:59' }
          ],
          unavailable_dates: [],
          unavailable_times: [],
          available_times: [
            { day_id: 1, from: '09:00:00', to: '17:00:00' },
            { day_id: 2, from: '09:00:00', to: '17:00:00' },
            { day_id: 3, from: '09:00:00', to: '17:00:00' },
            { day_id: 4, from: '09:00:00', to: '17:00:00' },
            { day_id: 5, from: '09:00:00', to: '17:00:00' }
          ],
          raw_available_times: [
            { day_id: 1, from: '09:00:00', to: '17:00:00' },
            { day_id: 2, from: '09:00:00', to: '17:00:00' },
            { day_id: 3, from: '09:00:00', to: '17:00:00' },
            { day_id: 4, from: '09:00:00', to: '17:00:00' },
            { day_id: 5, from: '09:00:00', to: '17:00:00' }
          ],
          disabled_times: []
        };
        
        setBookingData(mockData);
        
        // Auto-select first available date
        const today = new Date();
        const formattedToday = `${today.getDate().toString().padStart(2, '0')} Nov ${today.getFullYear()}`;
        setSelectedDate(formattedToday);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate time slots when date changes
  useEffect(() => {
    if (selectedDate && bookingData) {
      const times = [];
      for (let h = 9; h < 17; h++) {
        for (let m = 0; m < 60; m += 15) {
          times.push({ time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` });
        }
      }
      setBookingData(prev => ({ ...prev, available_times: times }));
      
      if (times.length > 0) {
        setSelectedTime(times[0].time);
      }
    }
  }, [selectedDate]);

  const handleScheduleAppointment = async () => {
    setIsBooking(true);
    
    // Mock API call
    setTimeout(() => {
      alert(`Appointment Scheduled!\n\nService: ${bookingData.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nName: ${formData.name}\nEmail: ${formData.email}`);
      setIsBooking(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading booking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-purple-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {bookingData?.provider_name || 'Frist Space'}
              </h1>
              <p className="text-gray-600 mt-1">Book your appointment in a few simple steps</p>
            </div>
          </div>
        </div>

        {/* Main Booking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Service</p>
                <h3 className="font-bold text-gray-800">{bookingData?.service_name}</h3>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
              Duration: {bookingData?.duration}
            </div>
          </div>

          {/* Date Selection */}
          <button
            onClick={() => setShowCalendarModal(true)}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Date</p>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedDate || 'Select date'}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-purple-400" />
            </div>
          </button>

          {/* Time Selection */}
          <button
            onClick={() => setShowTimeModal(true)}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Time</p>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedTime || 'Select time'}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-purple-400" />
            </div>
          </button>
        </div>

        {/* User Info Form */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Your Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+20 123 456 7890"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Timezone
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 outline-none transition-all appearance-none bg-white"
                >
                  <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                  <option value="America/New_York">America/New York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleScheduleAppointment}
            disabled={isBooking || !formData.name || !formData.email || !selectedDate || !selectedTime}
            className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
          >
            {isBooking ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Scheduling...</span>
              </div>
            ) : (
              'Schedule Appointment'
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      <ModernCalendarModal
        show={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        availableDates={bookingData?.available_dates || []}
        unavailableDates={bookingData?.unavailable_dates || []}
        disabledTimes={bookingData?.disabled_times || []}
        availableTimesFromAPI={bookingData?.raw_available_times || []}
        unavailableTimes={bookingData?.unavailable_times || []}
      />

      <ModernTimeModal
        show={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        availableTimes={bookingData?.available_times || []}
        selectedDate={selectedDate}
        disabledTimes={bookingData?.disabled_times || []}
        unavailableTimes={bookingData?.unavailable_times || []}
        unavailableDates={bookingData?.unavailable_dates || []}
      />

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Powered by Modern Booking System</p>
      </div>
    </div>
  );
};

export default ModernBookingApp;