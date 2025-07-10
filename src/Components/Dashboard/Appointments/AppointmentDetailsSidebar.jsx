import { useState } from 'react';
import { X, User, Clock, Trash2 } from 'lucide-react';

const AppointmentDetailsSidebar = ({ appointment, isOpen, onClose, onCancel, onDelete, isCancelling }) => {
  const [activeTab, setActiveTab] = useState('Appointment Details');

  // Handle delete appointment
  const handleDeleteClick = () => {
    if (onDelete && appointment) {
      onDelete(appointment);
    }
  };

  // Handle cancel appointment
  const handleCancelClick = () => {
    if (onCancel && appointment) {
      onCancel(appointment);
    }
  };

  if (!isOpen || !appointment) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  };

  // Format time function
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format created_at date
  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate end time (assuming 2 hours 15 minutes duration as default)
  const getEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0);
    
    // Add 2 hours 15 minutes
    startDate.setHours(startDate.getHours() + 2);
    startDate.setMinutes(startDate.getMinutes() + 15);
    
    const endHours = startDate.getHours().toString().padStart(2, '0');
    const endMinutes = startDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}:00`;
  };

  const endTime = appointment.end_time || getEndTime(appointment.time);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Appointment Summary</h2>
          <div className='flex gap-7 items-center'>
            <button
              onClick={handleDeleteClick}
              disabled={isCancelling}
              className={`cursor-pointer w-9 h-9 rounded-full flex justify-center items-center duration-300 hover:bg-red-200 ${
                isCancelling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Delete Appointment"
            >
              <Trash2 size={19} className='text-red-600' />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          {/* Appointment Time Card */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-800">
                {formatDate(appointment.date)}, {formatTime(appointment.time)} - {formatTime(endTime)}
              </div>
              <div className="flex gap-2 mt-3">
                <button 
                  className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1"
                  disabled={isCancelling}
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Reschedule
                </button>
                <button 
                  className={`text-red-600 text-sm hover:text-red-700 flex items-center gap-1 ${
                    isCancelling ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleCancelClick}
                  disabled={isCancelling}
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  {isCancelling ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} />
              <span>{appointment.name}, {appointment.email}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setActiveTab('Appointment Details')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'Appointment Details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Appointment Details
            </button>
            <button
              onClick={() => setActiveTab('Client Details')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'Client Details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Client Details
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'Appointment Details' && (
            <div className="space-y-4">
              {/* Interview */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Interview</span>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {appointment.interview_name?.substring(0, 2).toUpperCase() || 'IN'}
                  </span>
                  <span className="text-sm text-gray-800">{appointment.interview_name || 'N/A'}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'past' ? 'bg-gray-100 text-gray-800' :
                  appointment.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {appointment.status === 'upcoming' ? 'Scheduled' :
                   appointment.status === 'past' ? 'Completed' : 
                   appointment.status === 'rescheduled' ? 'Rescheduled' : 
                   appointment.status === 'cancelled' ? 'Cancelled' :
                   appointment.status}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Time</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-800">
                    {formatTime(appointment.time)} - {formatTime(endTime)} (2 hrs 15 mins)
                  </span>
                </div>
              </div>

              {/* Time Zone */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Time Zone</span>
                <span className="text-sm text-gray-800">{appointment.time_zone || 'N/A'}</span>
              </div>

              {/* Workspace */}
              <div className="flex items-center justify-between py-2 pt-4 border-t">
                <span className="text-sm text-gray-600">Workspace</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-600 font-medium">
                      {appointment.work_space_name?.substring(0, 1).toUpperCase() || 'W'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-800">{appointment.work_space_name || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Client Details' && (
            <div className="space-y-4">
              {/* Client Name */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium text-gray-800">{appointment.name}</span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-800">{appointment.email}</span>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Phone Number</span>
                <span className="text-sm font-medium text-gray-800">{appointment.phone}</span>
              </div>

              {/* Customer ID */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Customer ID</span>
                <span className="text-sm font-medium text-gray-800">{appointment.customer_id}</span>
              </div>

              <div className="border-t pt-4 mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-4">Booking Information</h4>
                
                {/* Appointment ID */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Appointment ID</span>
                  <span className="text-sm font-medium text-gray-800">#{appointment.id}</span>
                </div>

                {/* Interview ID */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Interview ID</span>
                  <span className="text-sm font-medium text-gray-800">#{appointment.interview_id}</span>
                </div>

                {/* Workspace ID */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Workspace ID</span>
                  <span className="text-sm font-medium text-gray-800">#{appointment.work_space_id}</span>
                </div>

                {/* Created At */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Created At</span>
                  <span className="text-sm font-medium text-gray-800">
                    {appointment.created_at ? formatCreatedAt(appointment.created_at) : 'N/A'}
                  </span>
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium text-gray-800">
                    {appointment.updated_at ? formatCreatedAt(appointment.updated_at) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentDetailsSidebar;