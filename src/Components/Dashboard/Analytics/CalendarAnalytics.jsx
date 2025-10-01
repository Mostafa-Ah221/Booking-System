import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const CalendarAnalytics = ({data}) => {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(null);

  const appointments=data?.data?.recent_appointments

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  // Function to count appointments by date
  const getAppointmentsCountByDate = (date) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dayStr = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    return appointments.filter(app => app.date === dayStr).length;
  };

  const appointmentsOnSelectedDay = (date) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dayStr = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    return appointments.filter(app => app.date === dayStr);
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

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true
    });
  }
  
  // Current month days
  for (let date = 1; date <= daysInMonth; date++) {
    calendarDays.push({
      date: date,
      isCurrentMonth: true,
      isPrevMonth: false
    });
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let date = 1; date <= remainingDays; date++) {
    calendarDays.push({
      date: date,
      isCurrentMonth: false,
      isPrevMonth: false
    });
  }

  return (
    <div className=" bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-gray-600 font-medium">Calendar</span>
        {/* <MoreHorizontal className="w-5 h-5 text-gray-400" /> */}
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between px-4 py-4">
        <button 
          onClick={() => navigateMonth(-1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-900">
            {monthNames[currentDate.getMonth()]}
          </span>
          <span className="text-lg font-medium text-gray-900">
            {currentDate.getFullYear()}
          </span>
        </div>
        
        <button 
          onClick={() => navigateMonth(1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center">
            <span className="text-sm text-gray-500 font-medium">{day}</span>
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
                relative p-2 h-12 flex items-center justify-center cursor-pointer
                hover:bg-gray-50 transition-colors
                ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                ${isToday ? 'bg-blue-500 text-white font-semibold rounded-lg mx-1 my-1' : ''}
                ${selectedDate === day.date && day.isCurrentMonth && !isToday ? 'bg-blue-50 text-blue-600 rounded-lg mx-1 my-1' : ''}
              `}
              onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
            >
              <span className="text-sm">{day.date}</span>
              
              {/* Appointment indicator */}
              {hasAppointments && day.isCurrentMonth && !isToday && (
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Popup Modal for Selected Date */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full mx-4 transform transition-all">
            {/* Popup Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Popup Content */}
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <h4 className="text-md font-medium text-gray-800">Scheduled Appointments</h4>
              </div>

              {appointmentsOnSelectedDay(selectedDate).length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {appointmentsOnSelectedDay(selectedDate).map((app) => (
                    <div key={app.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Appointment #{app.id}
                        </span>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${app.status === 'upcoming' ? 'bg-green-100 text-green-800' : ''}
                          ${app.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          ${app.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' : ''}
                        `}>
                          {app.status === 'upcoming' ? 'Upcoming' : ''}
                          {app.status === 'cancelled' ? 'Cancelled' : ''}
                          {app.status === 'rescheduled' ? 'Rescheduled' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {app.status === 'upcoming' ? '⏰ Upcoming appointment' : ''}
                        {app.status === 'cancelled' ? '❌ Cancelled' : ''}
                        {app.status === 'rescheduled' ? '📅 Rescheduled' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">No scheduled appointments</p>
                  <p className="text-xs text-gray-400 mt-1">for this day</p>
                </div>
              )}
            </div>

            {/* Popup Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setSelectedDate(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
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