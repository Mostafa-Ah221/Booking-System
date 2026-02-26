import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import { X, User, Clock, Trash2, ChevronDown } from 'lucide-react';
import { usePermission } from '../../hooks/usePermission';
import { approveAppointment } from '../../../redux/apiCalls/AppointmentCallApi';
import { staff_ApproveAppointment } from '../../../redux/apiCalls/StaffapiCalls/StaffapiCalls';

const AppointmentDetailsSidebar = ({ 
  appointment, 
  isOpen, 
  onClose, 
  onCancel, 
  onDelete, 
  isCancelling, 
  onReschedule,
  onAppointmentUpdate
}) => {
  const [activeTab, setActiveTab] = useState('Appointment Details');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [approveStatus, setApproveStatus] = useState('pending');
  const dropdownRef = useRef(null);
  const actionsDropdownRef = useRef(null); 
  const dispatch = useDispatch(); 
  const userType = localStorage.getItem("userType");
console.log(appointment);

  useEffect(() => {
    if (appointment?.approve_status !== undefined) {
      const status = appointment.approve_status;
      if (status === "1" || status === 1) {
        setApproveStatus('approved');
      } else if (status === "0" || status === 0) {
        setApproveStatus('rejected');
      } else {
        setApproveStatus('pending');
      }
    } else {
      setApproveStatus('pending');
    }
  }, [appointment]);

  const canEditAppointment = userType === 'staff' ? true : usePermission("edit appointment");
  const canControlAppointment = userType === 'staff' ? true : usePermission("control appointment");
  const canDeleteAppointment = userType === 'staff' ? true : usePermission("delete appointment");

  // 🔹 Close dropdowns when clicking outside - معدل
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check approval dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (openDropdown === 'approval') {
          setOpenDropdown(null);
        }
      }
      
      // Check actions dropdown
      if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target)) {
        if (openDropdown === appointment?.id) {
          setOpenDropdown(null);
        }
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, appointment?.id]);

  const handleApproveReject = async (approved) => {
    if (!appointment?.id) return;
    
    const previousStatus = approveStatus;
    const newStatus = approved ? 'approved' : 'rejected';
    setApproveStatus(newStatus);
    setIsProcessing(true);

    try {
      const result = await dispatch(
        userType === 'staff'
          ? staff_ApproveAppointment(appointment.id, { approved: approved ? "1" : "0" })
          : approveAppointment(appointment.id, { approved: approved ? "1" : "0" })
      );

      if (result.success) {
        if (onAppointmentUpdate) {
          const updatedAppointment = {
            ...appointment,
            approve_appointment: approved ? "1" : "0"
          };
          onAppointmentUpdate(updatedAppointment);
        }
      } else {
        setApproveStatus(previousStatus);
      }
    } catch (error) {
      setApproveStatus(previousStatus);
    } finally {
      setIsProcessing(false);
      setOpenDropdown(null);
    }
  };

  const handleDropdownOption = async (option, appointment) => {
    setOpenDropdown(null);

    if (option === 'reschedule') {
      if (onReschedule && appointment) {
        onReschedule(appointment);
        onClose();
      }
    } else if (option === 'cancel') {
      await handleCancelClick();
    } else if (option === 'delete') {
      await handleDeleteClick();
    }
  };

  const toggleDropdown = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const handleDeleteClick = () => {
    if (onDelete && appointment) {
      onDelete(appointment);
    }
  };

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

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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

  const getEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0);
    
    startDate.setHours(startDate.getHours() + 2);
    startDate.setMinutes(startDate.getMinutes() + 15);
    
    const endHours = startDate.getHours().toString().padStart(2, '0');
    const endMinutes = startDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}:00`;
  };

  const endTime = appointment.end_time || getEndTime(appointment.time);

  return (
    <>
      {/* Overlay - 🔹 زودنا الـ z-index */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
        onClick={onClose}
      />
      
      {/* Sidebar - 🔹 زودنا الـ z-index */}
      <div className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Appointment Summary</h2>
          <div className='flex gap-7 items-center'>
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
          <div className="rounded-md p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-800">
                {formatDate(appointment.date)}, {formatTime(appointment.time)} 
              </div>
              <div className="flex gap-2">
                {/* Approval Section */}
                {appointment?.approve_status === "0" && appointment?.approve_interview_status === true && canControlAppointment && appointment?.status !== 'passed' &&  appointment?.status !== 'cancelled' && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="border border-gray-300 px-3 py-1 rounded flex items-center gap-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown('approval');
                      }}
                      disabled={isProcessing}
                    >
                      <span className="text-xs">
                        {isProcessing ? 'Processing...' : 'Approve'}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openDropdown === 'approval' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {openDropdown === 'approval' && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-[80]">
                        <div className="py-2 px-3">
                          <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
                            <input
                              type="radio"
                              name="approval"
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                              checked={approveStatus === 'approved'}
                              onChange={() => handleApproveReject(true)}
                              disabled={isProcessing}
                            />
                            <span className="text-xs text-green-600 font-medium">Accept</span>
                          </label>

                          <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-2">
                            <input
                              type="radio"
                              name="approval"
                              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                              checked={approveStatus === 'rejected'}
                              onChange={() => handleApproveReject(false)}
                              disabled={isProcessing}
                            />
                            <span className="text-xs text-red-600 font-medium">Reject</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Section */}
                {userType !== 'staff' && (canEditAppointment || canControlAppointment || canDeleteAppointment) && (
                  <div className="relative" ref={actionsDropdownRef}>
                    <button
                      className="border border-gray-300 px-3 py-1 rounded flex items-center gap-1 text-sm hover:bg-gray-50"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDropdown(appointment.id);
                      }}
                      disabled={isCancelling}
                    >
                      <span className="text-xs">Actions</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openDropdown === appointment.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {openDropdown === appointment.id && (
                      <div
                        className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-[80]"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="py-1">
                          {canControlAppointment && (
                            <button
                              className="w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDropdownOption('reschedule', appointment);
                              }}
                              disabled={isCancelling}
                            >
                              <span className="text-xs">Reschedule</span>
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </button>
                          )}

                          {canEditAppointment &&  appointment?.status !== 'cancelled' && appointment?.status !== 'passed' && (
                            <button
                              className="w-full text-right px-4 py-2 text-sm text-yellow-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDropdownOption('cancel', appointment);
                              }}
                              disabled={isCancelling}
                            >
                              <span className="text-xs">Cancel</span>
                              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                            </button>
                          )}

                          {canDeleteAppointment && (
                            <button
                              className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDropdownOption('delete', appointment);
                              }}
                              disabled={isCancelling}
                            >
                              <span className="text-xs">Delete</span>
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} />
              <div><span className='truncate max-w-[150px]'>{appointment.name}</span>, <span>{appointment.email}</span></div>
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
            <div className="space-y-4 mb-40">
              {/* Interview */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Interview</span>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {appointment.interview_name?.substring(0, 2).toUpperCase() || 'IN'}
                  </span>
                  <span className="text-sm text-gray-800 truncate block max-w-[100px]">{appointment.interview_name || 'N/A'}</span>
                </div>
              </div>
              {appointment?.resource && (
                <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Resource</span>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {appointment?.resource.name?.substring(0, 2).toUpperCase() || 'IN'}
                  </span>
                  <span className="text-sm text-gray-800 truncate max-w-[150px]">{appointment?.resource.name || 'N/A'}</span>
                </div>
              </div>
              )}
              

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

              {/* Approval Status */}
              {appointment?.approve_status == "1" && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Approval Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    approveStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    approveStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    approveStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {approveStatus === 'approved' ? 'Approved' :
                     approveStatus === 'rejected' ? 'Rejected' :
                     approveStatus === 'pending' ? 'Pending' :
                     approveStatus || ''}
                  </span>
                </div>
              )}

              {/* Time */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Time</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-800">
                    {formatTime(appointment.time)} 
                  </span>
                </div>
              </div>
              {appointment?.end_time && (
                <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">End-Time</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-800">
                    {formatTime(appointment.end_time)} 
                  </span>
                </div>
              </div>
              )}
              

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
            <div className="space-y-4 mb-32">
              {/* Client Name */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{appointment.name}</span>
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

          {/* My Appointments Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              My Appointments
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentDetailsSidebar;