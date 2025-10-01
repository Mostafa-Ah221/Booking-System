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
import { getWorkspace } from '../../../redux/apiCalls/workspaceCallApi';
import TestRoles from '../../testApis';
import { usePermission } from '../../hooks/usePermission';
import AddAppointment from './AddAppointment';
import toast from "react-hot-toast";
import { FiLayout } from "react-icons/fi";
import ColumnManagerSidebar from './ColumnManagerSidebar';
import { useConfirmationToast } from './useConfirmationToast'; 

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
  const [detailsError, setDetailsError] = useState(null);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 11;

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('appointmentColumns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.visibleColumns || [
          'Time', 'Interview', 'Workspace', 'Client', 'Phone', 'Status', 'Action'
        ];
      } catch (error) {
        console.error('Error parsing saved columns:', error);
      }
    }
    return ['Time', 'Interview', 'Workspace', 'Client', 'Phone', 'Status', 'Action'];
  });

  const [columnOrder, setColumnOrder] = useState(() => {
    const saved = localStorage.getItem('appointmentColumns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.columnOrder || [
          { name: 'Time', selected: true, id: 'time' },
          { name: 'Interview', selected: true, id: 'interview' },
          { name: 'Workspace', selected: true, id: 'workspace' },
          { name: 'Client', selected: true, id: 'client' },
          { name: 'Phone', selected: true, id: 'phone' },
          { name: 'Status', selected: true, id: 'status' },
          { name: 'Action', selected: true, id: 'action' },
          { name: 'Created at', selected: false, id: 'created' },
          { name: 'Time Zone', selected: false, id: 'timezone' },
          { name: 'Email', selected: false, id: 'email' }
        ];
      } catch (error) {
        console.error('Error parsing saved columns:', error);
      }
    }
    return [
      { name: 'Time', selected: true, id: 'time' },
      { name: 'Interview', selected: true, id: 'interview' },
      { name: 'Workspace', selected: true, id: 'workspace' },
      { name: 'Client', selected: true, id: 'client' },
      { name: 'Phone', selected: true, id: 'phone' },
      { name: 'Status', selected: true, id: 'status' },
      { name: 'Action', selected: true, id: 'action' },
      { name: 'Created at', selected: false, id: 'created' },
      { name: 'Time Zone', selected: false, id: 'timezone' },
      { name: 'Email', selected: false, id: 'email' }
    ];
  });

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { showConfirmationToast } = useConfirmationToast();
  const { appointments = [], loading = false, error } = useSelector(state => state.appointments || {});
  const { interviews } = useSelector(state => state.interview);
  const { workspace, workspaces } = useSelector(state => state.workspace);
  const workspaceId = workspace ? workspace.id : 0;
  console.log(appointments);

  useEffect(() => {
    const queryParams = {};
    if (workspaceId !== 0) {
      queryParams.work_space_id = workspaceId;
    }
    if (hasActiveFilters(currentFilters)) {
      Object.assign(queryParams, buildQueryParams(currentFilters));
    }
    dispatch(fetchAppointments(queryParams));
  }, [dispatch, workspaceId, currentFilters]);

  useEffect(() => {
    dispatch(fetchInterviews(workspaceId));
  }, [workspaceId]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    // تأكد أن النقرة مش داخل أي dropdown مفتوح
    const clickedInsideDropdown = event.target.closest('.dropdown-container');
    if (!clickedInsideDropdown && openDropdown !== null) {
      setOpenDropdown(null);
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [openDropdown]);

  const handleRescheduleFromSidebar = (appointment) => {
    setAppointmentToReschedule(appointment);
    setIsRescheduleOpen(true);
    setIsDetailsOpen(false);
    setSelectedAppointment(null);
  };

  const handleOpenAddAppointment = () => {
    setIsAddAppointmentOpen(true);
  };

  const handleCloseAddAppointment = () => {
    setIsAddAppointmentOpen(false);
  };

  const handleRescheduleSuccess = () => {
    if (Object.keys(currentFilters).length > 0 && hasActiveFilters(currentFilters)) {
      const queryParams = buildQueryParams(currentFilters);
      dispatch(fetchAppointments(queryParams));
    } else {
      dispatch(fetchAppointments());
    }
  };

  const hasActiveFilters = (filters) => {
    return (
      (filters.appointmentStatus && filters.appointmentStatus !== '') ||
      (filters.interviews && filters.interviews.length > 0) ||
      (filters.workspaces && filters.workspaces.length > 0) ||
      (filters.clients && filters.clients.length > 0)
    );
  };

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
    if (filters.clients && filters.clients.length > 0) {
      queryParams.client_id = filters.clients[0];
    }
    return queryParams;
  };

  const appointmentsArray = Array.isArray(appointments) ? appointments : [];
  const filteredAppointments = appointmentsArray.filter(app => {
    if (!hasActiveFilters(currentFilters)) {
      if (activeTab === 'Upcoming') {
        return app.status === 'upcoming' || app.status === 'rescheduled';
      }
      if (activeTab === 'Past') {
        return app.status === 'past' || app.status === 'completed';
      }
      return true;
    }
    let matches = true;
    if (currentFilters.clients && currentFilters.clients.length > 0) {
      const appointmentClientId = app.client_id || app.customer_id || app.clientId;
      matches = matches && currentFilters.clients.includes(appointmentClientId);
    }
    return matches;
  });

  // Pagination Logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string') {
      return 'N/A';
    }
    const cleanedTime = timeString.split(':').slice(0, 2).join(':');
    const [hours, minutes] = cleanedTime.split(':');
    const hour = parseInt(hours);
    if (isNaN(hour) || !minutes) {
      return 'N/A';
    }
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleAppointmentClick = async (appointment) => {
    try {
      setLoadingAppointmentDetails(true);
      setDetailsError(null);
      if (appointment.detailsLoaded) {
        setSelectedAppointment(appointment);
        setIsDetailsOpen(true);
        setLoadingAppointmentDetails(false);
        return;
      }
      const response = await dispatch(getAppointmentById(appointment?.id));
      if (response && response.success && response.data && response.data.appointment) {
        const appointmentWithDetails = { ...response.data.appointment, detailsLoaded: true };
        setSelectedAppointment(appointmentWithDetails);
        setIsDetailsOpen(true);
      } else if (response && !response.success) {
        setDetailsError(response.message);
        setSelectedAppointment(appointment);
        setIsDetailsOpen(true);
      } else {
        setSelectedAppointment(appointment);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      setDetailsError(error.message);
      setSelectedAppointment(appointment);
      setIsDetailsOpen(true);
    } finally {
      setLoadingAppointmentDetails(false);
    }
  };

  const toggleDropdown = (appointmentId) => {
    setOpenDropdown(openDropdown === appointmentId ? null : appointmentId);
  };

  const handleCancelAppointment = async (appointment) => {
    const confirmMessage = `Are you sure you want to cancel the appointment for ${appointment.name}`;
    showConfirmationToast(
      confirmMessage,
      async () => {
        try {
          setCancelingAppointment(true);
          const result = await dispatch(statusAppointment(appointment.id, { status: "cancelled" }));
          if (!result || !result.success) {
            throw new Error(result?.message || 'Failed to cancel appointment');
          }
          if (hasActiveFilters(currentFilters)) {
            const queryParams = buildQueryParams(currentFilters);
            await dispatch(fetchAppointments(queryParams));
          } else {
            await dispatch(fetchAppointments());
          }
          if (selectedAppointment && selectedAppointment.id === appointment.id) {
            setIsDetailsOpen(false);
            setSelectedAppointment(null);
          }
          setOpenDropdown(null);
        } catch (error) {
          const errorMessage = error.message || 'An error occurred while cancelling the appointment. Please try again.';
          toast.error(errorMessage);
        } finally {
          setCancelingAppointment(false);
        }
      }
    );
  };

  const handleDeleteAppointment = async (appointment) => {
    const confirmMessage = `Are you sure you want to delete the appointment for ${appointment.name}`;
    showConfirmationToast(
      confirmMessage,
      async () => {
        try {
          setCancelingAppointment(true);
          const result = await dispatch(deleteAppointment(appointment.id));
          if (!result || !result.success) {
            throw new Error(result?.message || 'Failed to delete appointment');
          }
          if (hasActiveFilters(currentFilters)) {
            const queryParams = buildQueryParams(currentFilters);
            await dispatch(fetchAppointments(queryParams));
          } else {
            await dispatch(fetchAppointments());
          }
          if (selectedAppointment && selectedAppointment.id === appointment.id) {
            setIsDetailsOpen(false);
            setSelectedAppointment(null);
          }
          setOpenDropdown(null);
        } catch (error) {
          const errorMessage = error.message || 'An error occurred while deleting the appointment. Please try again.';
          toast.error(errorMessage);
        } finally {
          setCancelingAppointment(false);
        }
      }
    );
  };

  const handleDropdownOption = async (option, appointment) => {
    setOpenDropdown(null);
    if (option === 'reschedule') {
      setAppointmentToReschedule(appointment);
      setIsRescheduleOpen(true);
    } else if (option === 'cancel') {
      await handleCancelAppointment(appointment);
    }
  };

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
    if (hasActiveFilters(filters)) {
      const queryParams = buildQueryParams(filters);
      dispatch(fetchAppointments(queryParams));
    } else {
      dispatch(fetchAppointments());
    }
    setIsFilterOpen(false);
  };

  const handleCancelFilters = () => {
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
    setCurrentPage(1); // Reset to first page when clearing filters
    dispatch(fetchAppointments());
  };

  const canAddAppointment = usePermission("add appointment");
  const canEditAppointment = usePermission("edit appointment");
  const canControlAppointment = usePermission("control appointment");

  const handleOpenColumnManager = () => {
    setIsColumnManagerOpen(true);
  };

  const handleApplyColumns = (selectedColumns, fullColumnOrder) => {
    if (selectedColumns.length < 2) {
      toast.error('Please select at least two fields.');
      return;
    }
    setVisibleColumns(selectedColumns);
    if (fullColumnOrder) {
      setColumnOrder(fullColumnOrder);
    }
    try {
      const dataToSave = {
        visibleColumns: selectedColumns,
        columnOrder: fullColumnOrder || columnOrder,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('appointmentColumns', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving columns to localStorage:', error);
    }
    setIsColumnManagerOpen(false);
  };

  const renderAppointments = () => {
    if (currentAppointments.length > 0) {
      if (!columnOrder || !Array.isArray(columnOrder) || columnOrder.length === 0) {
        return <div className="p-4 text-center">Loading columns...</div>;
      }

      const orderedVisibleColumns = columnOrder
        .filter(col => col && col.selected)
        .map(col => col.name)
        .filter(name => name);

      if (orderedVisibleColumns.length === 0) {
        return <div className="p-4 text-center text-gray-500">No columns selected</div>;
      }

      const needsHorizontalScroll = orderedVisibleColumns.length > 7;
      const minWidth = needsHorizontalScroll ? `${orderedVisibleColumns.length * 150}px` : '800px';

      return (
        <div className="bg-white border rounded-lg overflow-x-auto">
          <div 
            className="text-xs font-medium bg-gray-50 border-b px-6 py-4 gap-4 relative"
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${orderedVisibleColumns.length}, 1fr) auto`,
              alignItems: 'center',
              minWidth: minWidth
            }}
          >
            {orderedVisibleColumns.map(columnName => (
              <div key={columnName} className="text-gray-600 capitalize w-full">
                {columnName}
              </div>
            ))}
          </div>

          {currentAppointments.map((item, index) => (
            <div key={item.id} className="border-b last:border-b-0">
              <div className="bg-gray-50 px-6 py-3 border-b" style={{ minWidth: minWidth }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-gray-600" />
                    <span className="text-xs font-medium">{formatDate(item.date)}</span>
                  </div>
                  <span className="text-xs text-gray-500">{indexOfFirstAppointment + index + 1} appointment</span>
                </div>
              </div>

              <div
                className={`items-center px-6 py-4 text-sm hover:bg-gray-50 cursor-pointer transition-colors gap-4 ${
                  loadingAppointmentDetails ? 'opacity-50 pointer-events-none' : ''
                }`}
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: `repeat(${orderedVisibleColumns.length}, 1fr) auto`,
                  alignItems: 'center',
                  minWidth: minWidth
                }}
                onClick={() => handleAppointmentClick(item)}
              >
                {orderedVisibleColumns.map(columnName => {
                  switch(columnName) {
                    case 'Time':
                      return (
                        <div key={columnName} className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-600" />
                          <span className="text-xs">{formatTime(item.time)}</span>
                        </div>
                      );
                    case 'Interview':
                      return (
                        <div key={columnName} className="flex items-center gap-2">
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                            {item.interview_name ? item.interview_name.substring(0, 2).toUpperCase() : 'N/A'}
                          </span>
                          <span className="text-xs truncate max-w-[80px] tooltip whitespace-nowrap" title={item.interview_name}>
                            {item.interview_name || 'N/A'}
                          </span>
                        </div>
                      );
                    case 'Workspace':
                      return (
                        <div key={columnName} className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs text-blue-600">
                              {item.work_space_name ? item.work_space_name.substring(0, 1).toUpperCase() : 'N/A'}
                            </span>
                          </div>
                          <span className="text-xs truncate max-w-[150px] tooltip whitespace-nowrap" title={item.work_space_name}>
                            {item.work_space_name || 'N/A'}
                          </span>
                        </div>
                      );
                    case 'Client':
                      return (
                        <div key={columnName} className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-medium">
                              {item.name ? item.name.substring(0, 1).toUpperCase() : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium max-w-[100px] text-xs truncate tooltip whitespace-nowrap" title={item.name}>
                              {item.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      );
                    case 'Phone':
                      return (
                        <span key={columnName} className="text-gray-600 text-xs truncate max-w-[150px] tooltip whitespace-nowrap" title={item.phone}>
                          {item.phone || 'N/A'}
                        </span>
                      );
                    case 'Status':
                      return (
                        <span
                          key={columnName}
                          className={`w-fit px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'upcoming'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'past'
                              ? 'bg-gray-200 text-gray-800'
                              : item.status === 'rescheduled'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'cancel'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.status === 'upcoming'
                            ? 'Scheduled'
                            : item.status === 'past'
                            ? 'Completed'
                            : item.status === 'rescheduled'
                            ? 'Rescheduled'
                            : item.status === 'cancel'
                            ? 'Cancelled'
                            : item.status || 'N/A'}
                        </span>
                      );
                    case 'Action':
                      return (
                        <div key={columnName} className="relative dropdown-container" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="border border-gray-300 px-3 py-1 rounded flex items-center gap-1 text-sm hover:bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(item.id);
                            }}
                          >
                            <span className="text-xs">Review</span>
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {openDropdown === item.id && (
                            <div className={`absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10 ${
                              index === currentAppointments.length - 1 ? 'bottom-full mb-1' : 'top-full'
                            }`}>
                              <div className="py-1">
                               


                                {canControlAppointment && (
                                  <button
                                    className="w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDropdownOption('reschedule', item);
                                    }}
                                  >
                                    <span className="text-xs">Reschedule</span>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  </button>
                                )}
                                {canEditAppointment && (
                                  <button
                                    className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDropdownOption('cancel', item);
                                    }}
                                  >
                                    <span className="text-xs">Cancel</span>
                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    case 'Created at':
                      return (
                        <span key={columnName} className="text-gray-600 text-xs truncate max-w-[150px] tooltip whitespace-nowrap" title={item.created_at}>
                          {item.created_at || 'N/A'}
                        </span>
                      );
                    case 'Time Zone':
                      return (
                        <span key={columnName} className="text-gray-600 text-xs truncate max-w-[150px] tooltip whitespace-nowrap" title={item.time_zone}>
                          {item.time_zone || 'N/A'}
                        </span>
                      );
                    case 'Email':
                      return (
                        <span key={columnName} className="text-gray-600 text-xs truncate max-w-[150px] tooltip whitespace-nowrap" title={item.email}>
                          {item.email || 'N/A'}
                        </span>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderPagination = () => {
    if (filteredAppointments.length <= appointmentsPerPage) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, filteredAppointments.length)} of {filteredAppointments.length} appointments
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          {canAddAppointment && (
            <button
              onClick={handleOpenAddAppointment}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} />
              New Appointment
            </button>
          )}
          <h1 className="font-semibold">Appointments</h1>
        </div>

        <div className="border-b border-gray-200 mb-6 flex justify-between items-center">
          <nav className="flex gap-6">
            {[
              // { key: 'Upcoming', label: 'Upcoming' },
              // { key: 'Past', label: 'Past' },
              // { key: 'Custom Date', label: 'Custom Date' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`py-2 px-1 -mb-px transition-all text-sm ${
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
            {hasActiveFilters(currentFilters) && (
              <button 
                onClick={handleClearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
            <span className="text-gray-600 capitalize">
              <FiLayout
                strokeWidth={1.5}
                className="p-[0.30rem] rounded-md h-7 w-7 hover:bg-slate-200 duration-300 cursor-pointer text-black border"
                onClick={handleOpenColumnManager}
              />
            </span>
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

        {activeTab === 'Custom Date' ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Custom date content here</p>
          </div>
        ) : (
          <>
            {renderAppointments()}
            {renderPagination()}
            {!loading && filteredAppointments.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block mb-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarDays size={48} className="text-gray-400" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-sm">
                  No {activeTab === 'Upcoming' ? 'upcoming' : 'past'} appointments
                </h3>
                <p className="text-gray-500 mb-6">Organize your schedule by adding appointments here.</p>
                {canAddAppointment && (
                  <button
                    onClick={handleOpenAddAppointment}
                    className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={18} />
                    New Appointment
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <FilterSidebar 
        isOpen={isFilterOpen} 
        onClose={handleCancelFilters}
        onApply={handleApplyFilters}
        currentFilters={currentFilters}
      />
      
      <AddAppointment
        isOpen={isAddAppointmentOpen}
        onClose={handleCloseAddAppointment}
      />
      
      <TestRoles/>
      
      <AppointmentDetailsSidebar 
        appointment={selectedAppointment}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAppointment(null);
          setDetailsError(null);
        }}
        onCancel={handleCancelAppointment}  
        onDelete={handleDeleteAppointment} 
        onReschedule={handleRescheduleFromSidebar}
        isCancelling={cancelingAppointment}
        error={detailsError}
      />

      <RescheduleSidebar 
        mode="reschedule"
        appointment={appointmentToReschedule}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onRescheduleSuccess={handleRescheduleSuccess}
      />

      <ColumnManagerSidebar
        isOpen={isColumnManagerOpen}
        onClose={() => setIsColumnManagerOpen(false)}
        onApply={handleApplyColumns}
        initialColumns={columnOrder} 
      />
    </div>
  );
};

export default UserDashboard;