import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, getAppointmentById, deleteAppointment, statusAppointment } from '../../../redux/apiCalls/AppointmentCallApi';
import { CalendarDays, Clock, Plus, ChevronDown } from 'lucide-react';
import { BsFilterRight } from "react-icons/bs";
import FilterSidebar from './FilterSidebar';
import AppointmentDetailsSidebar from './AppointmentDetailsSidebar';
import RescheduleSidebar from './RescheduleSidebar';
import { fetchInterviews } from '../../../redux/apiCalls/interviewCallApi';
import Loader from '../../Loader';


const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loadingAppointmentDetails, setLoadingAppointmentDetails] = useState(false);
  const [cancelingAppointment, setCancelingAppointment] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  
  const { appointments = [], loading = false, error } = useSelector(state => state.appointments || {});
  const { interviews } = useSelector(state => state.interview);
  const { workspace } = useSelector(state => state.workspace);
  const workspaceId = workspace ? workspace.id : 0;
  
  useEffect(() => {
    // Load all appointments without any filters on initial load
    dispatch(fetchAppointments());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchInterviews(workspaceId));
  }, [workspaceId]);
  
  console.log(interviews);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!isRescheduleOpen) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRescheduleOpen]);

  const handleRescheduleSuccess = () => {
    console.log('🔄 Refreshing appointments after reschedule...');
    
    // Check if there are active filters, if yes apply them, otherwise fetch all
    if (Object.keys(currentFilters).length > 0 && hasActiveFilters(currentFilters)) {
      const queryParams = buildQueryParams(currentFilters);
      dispatch(fetchAppointments(queryParams));
    } else {
      dispatch(fetchAppointments());
    }
  };
  
  // Helper function to check if there are any active filters
  const hasActiveFilters = (filters) => {
    return (
      (filters.appointmentStatus && filters.appointmentStatus !== '') ||
      (filters.interviews && filters.interviews.length > 0) ||
      (filters.workspaces && filters.workspaces.length > 0)
    );
  };

  // Helper function to build query parameters
  const buildQueryParams = (filters) => {
    const queryParams = {};
    
    if (filters.appointmentStatus && filters.appointmentStatus !== '') {
      queryParams.status = filters.appointmentStatus;
    }
    
    if (filters.interviews && filters.interviews.length > 0) {
      queryParams.interview_id = filters.interviews[0];
    }
    
    if (filters.workspaces && filters.workspaces.length > 0) {
      queryParams.work_space_id = filters.workspaces[0];
    }
    
    return queryParams;
  };
  
  const appointmentsArray = appointments
                          
  const filteredAppointments = appointmentsArray.filter(app => {
    if (!hasActiveFilters(currentFilters)) {
      if (activeTab === 'Upcoming') {
        return app.status === 'upcoming' || app.status === 'rescheduled';
      }
      if (activeTab === 'Past') {
        return app.status === 'past' || app.status === 'completed';
      }
    }
    
    // If backend filters are active, show all results from backend
    return true;
  });

   const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Handle appointment click - Updated to fetch appointment details
  const handleAppointmentClick = async (appointment) => {
    try {
      setLoadingAppointmentDetails(true);
      
      // Fetch appointment details by ID
      const response = await dispatch(getAppointmentById(appointment.id));
      
      // Check if the response has the expected structure
      if (response && response.data && response.data.appointment) {
        setSelectedAppointment(response.data.appointment);
        setIsDetailsOpen(true);
      } else {
        // Fallback to the original appointment data if API call fails
        console.warn('Failed to fetch appointment details, using original data');
        setSelectedAppointment(appointment);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      // Fallback to the original appointment data
      setSelectedAppointment(appointment);
      setIsDetailsOpen(true);
    } finally {
      setLoadingAppointmentDetails(false);
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = (appointmentId) => {
    setOpenDropdown(openDropdown === appointmentId ? null : appointmentId);
  };

  // Handle appointment cancellation - Updated to use statusAppointment instead of deleteAppointment
  const handleCancelAppointment = async (appointment) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to cancel the appointment for ${appointment.name}?\n` +
      `Date: ${formatDate(appointment.date)}\n` +
      `Time: ${formatTime(appointment.time)}\n\n` +
      `This action will change the appointment status to cancelled.`
    );
    
    if (isConfirmed) {
      try {
        setCancelingAppointment(true);
        
        const result = await dispatch(statusAppointment(appointment.id, { status: "cancelled" }));
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        // Refresh appointments list
        if (hasActiveFilters(currentFilters)) {
          const queryParams = buildQueryParams(currentFilters);
          await dispatch(fetchAppointments(queryParams));
        } else {
          await dispatch(fetchAppointments());
        }
        
        // Close details sidebar if the cancelled appointment was selected
        if (selectedAppointment && selectedAppointment.id === appointment.id) {
          setIsDetailsOpen(false);
          setSelectedAppointment(null);
        }
        
        setOpenDropdown(null);
        
        console.log('✅ Appointment cancelled successfully');
        
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        
        const errorMessage = error.message || 'An error occurred while cancelling the appointment. Please try again.';
        alert(errorMessage);
        
      } finally {
        setCancelingAppointment(false);
      }
    }
  };
  const handleDeleteAppointment = async (appointment) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the appointment for ${appointment.name}?\n` +
      `Date: ${formatDate(appointment.date)}\n` +
      `Time: ${formatTime(appointment.time)}\n\n` +
      `This action will permanently delete the appointment and cannot be undone.`
    );
    
    if (isConfirmed) {
      try {
        setCancelingAppointment(true);
        
        const result = await dispatch(deleteAppointment(appointment.id));
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        // Refresh appointments list
        if (hasActiveFilters(currentFilters)) {
          const queryParams = buildQueryParams(currentFilters);
          await dispatch(fetchAppointments(queryParams));
        } else {
          await dispatch(fetchAppointments());
        }
        
        // Close details sidebar if the deleted appointment was selected
        if (selectedAppointment && selectedAppointment.id === appointment.id) {
          setIsDetailsOpen(false);
          setSelectedAppointment(null);
        }
        
        setOpenDropdown(null);
        
        console.log('✅ Appointment deleted successfully');
        
      } catch (error) {
        console.error('Error deleting appointment:', error);
        
        const errorMessage = error.message || 'An error occurred while deleting the appointment. Please try again.';
        alert(errorMessage);
        
      } finally {
        setCancelingAppointment(false);
      }
    }
  };
  
  const handleDropdownOption = async (option, appointment) => {
    console.log(`Selected ${option} for appointment:`, appointment);
    
    setOpenDropdown(null);
    
    if (option === 'reschedule') {
      try {
        const response = await dispatch(getAppointmentById(appointment.id));
        const appointmentDetails = response?.data?.appointment || appointment;
        
        setAppointmentToReschedule(appointmentDetails);
        setIsRescheduleOpen(true);
        
      } catch (error) {
        console.error('Error fetching appointment for reschedule:', error);
      }
    } else if (option === 'cancel') {
      await handleCancelAppointment(appointment);
    }
  };

  // Handle filter application - Updated logic
  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
    
    // Check if there are any active filters
    if (hasActiveFilters(filters)) {
      const queryParams = buildQueryParams(filters);
      dispatch(fetchAppointments(queryParams));
    } else {
      // If no filters are active, fetch all appointments
      dispatch(fetchAppointments());
    }
    
    // Close filter sidebar
    setIsFilterOpen(false);
  };

  // Handle filter cancellation
  const handleCancelFilters = () => {
    setIsFilterOpen(false);
  };

  // Clear all filters - Updated
  const handleClearFilters = () => {
    setCurrentFilters({});
    dispatch(fetchAppointments()); // Fetch all appointments without any filters
  };

  const renderAppointments = () => {
    if (loading) {
      return (
        <div className="p-6 bg-gray-50 flex items-center justify-center">
          <p className=""><Loader/></p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <p className="text-red-500">Error: {error}</p>
        </div>
      );
    }

    if (filteredAppointments.length > 0) {
      return (
        <div className="bg-white border rounded-lg ">
          {/* Header row */}
          <div className="grid grid-cols-7 text-sm font-medium bg-gray-50 border-b px-6 py-4">
            <span className="text-gray-600">APPOINTMENT</span>
            <span className="text-gray-600">INTERVIEW</span>
            <span className="text-gray-600">WORKSPACE</span>
            <span className="text-gray-600">CLIENT</span>
            <span className="text-gray-600">PHONE</span>
            <span className="text-gray-600">STATUS</span>
            <span className="text-gray-600">ACTION</span>
          </div>
          
          {/* Data rows */}
          {filteredAppointments.map((item, index) => (
            <div key={item.id} className="border-b last:border-b-0">
              {/* Date header */}
              <div className="bg-gray-50 px-6 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-gray-600" />
                    <span className="text-sm font-medium">{formatDate(item.date)}</span>
                  </div>
                  <span className="text-sm text-gray-500">{index + 1} appointment</span>
                </div>
              </div>
              
              {/* Appointment row - Made clickable with loading state */}
              <div 
                className={`grid grid-cols-7 items-center px-6 py-4 text-sm hover:bg-gray-50 cursor-pointer transition-colors ${
                  loadingAppointmentDetails ? 'opacity-50 pointer-events-none' : ''
                }`}
                onClick={() => handleAppointmentClick(item)}
              >
                {/* Time */}
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-600" />
                  <span className="font-medium">{formatTime(item.time)}</span>
                </div>
                
                {/* Interview */}
                <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {item.interview_name.substring(0, 2).toUpperCase()}
                  </span>
                  <span>{item.interview_name}</span>
                </div>
                
                {/* Workspace */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-600 font-medium">
                      {item.work_space_name.substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <span>{item.work_space_name}</span>
                </div>
                
                {/* Client */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-medium">
                      {item.name.substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.email}</div>
                  </div>
                </div>
                
                {/* Phone */}
                <span className="text-gray-600">{item.phone}</span>
                
                {/* Status */}
                <span className={`w-fit px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                  item.status === 'past' ? 'bg-gray-100 text-gray-800' :
                  item.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'cancel' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {item.status === 'upcoming' ? 'Scheduled' :
                   item.status === 'past' ? 'Completed' : 
                   item.status === 'rescheduled' ? 'Rescheduled' : 
                   item.status === 'cancel' ? 'Cancelled' : item.status}
                </span>
                
                {/* Actions with Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="border border-gray-300 px-3 py-1 rounded flex items-center gap-1 text-sm hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(item.id);
                    }}
                  >
                    <span>Review</span>
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${
                        openDropdown === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {openDropdown === item.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownOption('reschedule', item);
                          }}
                        >
                          <span>Reschedule</span>
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </button>
                        <button
                          className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownOption('cancel', item);
                          }}
                        >
                          <span>Cancel</span>
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading overlay for appointment details or cancellation */}
      {(loadingAppointmentDetails || cancelingAppointment) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">
              {loadingAppointmentDetails ? 'Loading appointment details...' : 'Cancelling appointment...'}
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} />
            New Appointment
          </button>
          <h1 className="text-xl font-semibold">Appointments</h1>
        </div>

        {/* Sub tabs */}
        <div className="border-b border-gray-200 mb-6 flex justify-between items-center">
          <nav className="flex gap-6">
            {[
              { key: 'Upcoming', label: 'Upcoming' },
              // { key: 'Past', label: 'Past' },
              // { key: 'Custom Date', label: 'Custom Date' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`py-2 px-1 -mb-px transition-all ${
                  activeTab === tab.key 
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            {/* Clear filters button - show only when filters are applied */}
            {hasActiveFilters(currentFilters) && (
              <button 
                onClick={handleClearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
            
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={`w-9 h-9 flex justify-center items-center hover:border border-slate-400 duration-200 ${
                hasActiveFilters(currentFilters) ? 'bg-blue-50 border-blue-300' : ''
              }`}
            >
              <BsFilterRight className='text-2xl'/>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'Custom Date' ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Custom date content here</p>
          </div>
        ) : (
          <>
            {renderAppointments()}
            {!loading && filteredAppointments.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block mb-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarDays size={48} className="text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No {activeTab === 'Upcoming' ? 'upcoming' : 'past'} appointments
                </h3>
                <p className="text-gray-500 mb-6">Organize your schedule by adding appointments here.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
                  <Plus size={18} />
                  New Appointment
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar 
        isOpen={isFilterOpen} 
        onClose={handleCancelFilters}
        onApply={handleApplyFilters}
        currentFilters={currentFilters}
      />

      {/* Appointment Details Sidebar */}
      <AppointmentDetailsSidebar 
  appointment={selectedAppointment}
  isOpen={isDetailsOpen}
  onClose={() => {
    setIsDetailsOpen(false);
    setSelectedAppointment(null);
  }}
  onCancel={handleCancelAppointment}  
  onDelete={handleDeleteAppointment} 
  isCancelling={cancelingAppointment}
/>

      {/* Reschedule Sidebar */}
      <RescheduleSidebar 
        appointment={appointmentToReschedule}
        onRescheduleSuccess={handleRescheduleSuccess} 
        isOpen={isRescheduleOpen}
        onClose={() => {
          setIsRescheduleOpen(false);
          setAppointmentToReschedule(null);
        }}
        onSuccess={() => {
          // Refresh appointments after successful reschedule
          if (hasActiveFilters(currentFilters)) {
            const queryParams = buildQueryParams(currentFilters);
            dispatch(fetchAppointments(queryParams));
          } else {
            dispatch(fetchAppointments());
          }
          setIsRescheduleOpen(false);
          setAppointmentToReschedule(null);
        }}
      />
    </div>
  );
};

export default UserDashboard;