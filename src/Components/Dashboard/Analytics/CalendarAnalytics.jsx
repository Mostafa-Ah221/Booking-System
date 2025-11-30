import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalendarAnalytics = ({data}) => {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate(); 
  
  const appointments = data?.data?.recent_appointments || [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const getAppointmentsCountByDate = (date) => {
    if (!appointments || !Array.isArray(appointments)) return 0;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dayStr = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    return appointments.filter(app => app.date === dayStr).length;
  };

  const appointmentsOnSelectedDay = (date) => {
    if (!appointments || !Array.isArray(appointments)) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dayStr = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    return appointments.filter(app => app.date === dayStr);
  };

  const handleAppointmentClick = (appointmentId) => {
    navigate(`/layoutDashboard/userDashboard?appointmentId=${appointmentId}`);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const calendarDays = [];
  
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true
    });
  }
  
  for (let date = 1; date <= daysInMonth; date++) {
    calendarDays.push({
      date: date,
      isCurrentMonth: true,
      isPrevMonth: false
    });
  }
  
  const remainingDays = 42 - calendarDays.length;
  for (let date = 1; date <= remainingDays; date++) {
    calendarDays.push({
      date: date,
      isCurrentMonth: false,
      isPrevMonth: false
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
        <span className="text-sm sm:text-base text-gray-600 font-medium">Calendar</span>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
        <button 
          onClick={() => navigateMonth(-1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-base sm:text-lg font-medium text-gray-900">
            {monthNames[currentDate.getMonth()]}
          </span>
          <span className="text-base sm:text-lg font-medium text-gray-900">
            {currentDate.getFullYear()}
          </span>
        </div>
        
        <button 
          onClick={() => navigateMonth(1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of Week - Desktop */}
      <div className="hidden sm:grid grid-cols-7 border-b border-gray-100">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center">
            <span className="text-sm text-gray-500 font-medium">{day}</span>
          </div>
        ))}
      </div>

      {/* Days of Week - Mobile */}
      <div className="grid sm:hidden grid-cols-7 border-b border-gray-100">
        {dayNamesShort.map((day, idx) => (
          <div key={idx} className="p-1 text-center">
            <span className="text-xs text-gray-500 font-medium">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const today = new Date();
          const isToday = day.isCurrentMonth && 
                         day.date === today.getDate() && 
                         currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();
          
          const appointmentCount = day.isCurrentMonth ? getAppointmentsCountByDate(day.date) : 0;
          const hasAppointments = appointmentCount > 0;
          
          return (
            <div
              key={index}
              className={`
                relative p-1 sm:p-2 h-10 sm:h-12 flex items-center justify-center cursor-pointer
                hover:bg-gray-50 transition-colors
                ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                ${isToday ? 'bg-blue-500 text-white font-semibold rounded-lg mx-0.5 sm:mx-1 my-0.5 sm:my-1' : ''}
                ${selectedDate === day.date && day.isCurrentMonth && !isToday ? 'bg-blue-50 text-blue-600 rounded-lg mx-0.5 sm:mx-1 my-0.5 sm:my-1' : ''}
              `}
              onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
            >
              <span className="text-xs sm:text-sm">{day.date}</span>
              
              {/* Appointment indicator */}
              {hasAppointments && day.isCurrentMonth && !isToday && (
                <div className="absolute bottom-0.5 sm:bottom-1 right-0.5 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Popup Modal for Selected Date */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full transform transition-all">
            {/* Popup Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Popup Content */}
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                <h4 className="text-sm sm:text-md font-medium text-gray-800">Scheduled Appointments</h4>
              </div>

              {appointmentsOnSelectedDay(selectedDate).length > 0 ? (
                <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto">
                  {appointmentsOnSelectedDay(selectedDate).map((app) => (
                    <div 
                      key={app.id} 
                      className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border-l-4 border-blue-400 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleAppointmentClick(app.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className='flex flex-col gap-1'>
                      
                        {app.name && (
                          <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                           Name: {app?.name}
                          </span>
                        )}
                          <span className="text-xs sm:text-sm font-medium text-gray-800">
                          <Clock3 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 mb-0.5 sm:mb-1" />: {app.time}
                        </span>
                        <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">
                        {app.status === 'upcoming' ? '⏰ Upcoming appointment' : ''}
                        {app.status === 'cancelled' ? '❌ Cancelled' : ''}
                        {app.status === 'rescheduled' ? '📅 Rescheduled' : ''}
                      </p>
                        </div>
                        
                        <span className={`
                          px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0
                          ${app.status === 'upcoming' ? 'bg-green-100 text-green-800' : ''}
                          ${app.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          ${app.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' : ''}
                        `}>
                          {app.status === 'upcoming' ? 'Upcoming' : ''}
                          {app.status === 'cancelled' ? 'Cancelled' : ''}
                          {app.status === 'rescheduled' ? 'Rescheduled' : ''}
                        </span>
                      </div>
                      
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">No scheduled appointments</p>
                  <p className="text-xs text-gray-400 mt-1">for this day</p>
                </div>
              )}
            </div>

            {/* Popup Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setSelectedDate(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarAnalytics;