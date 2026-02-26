import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {satff_FetchAppointments, staff_FetchInterviews, staff_GetAppointmentById,staff_UpdateAppointmentStatus,staff_RescheduleAppointment,staff_GetWorkspaces,staff_DeleteAppointment } from '../../redux/apiCalls/StaffapiCalls/StaffapiCalls';
import { useOutletContext } from 'react-router-dom';

import { CalendarDays, Clock, ChevronDown } from 'lucide-react';
import { BsFilterRight } from "react-icons/bs";
import FilterSidebar from '../Dashboard/Appointments/FilterSidebar';
import AppointmentDetailsSidebar from '../Dashboard/Appointments/AppointmentDetailsSidebar';
import RescheduleSidebar from '../Dashboard/Appointments/RescheduleSidebar';
import toast from "react-hot-toast";
import { FiLayout } from "react-icons/fi";
import ColumnManagerSidebar from '../Dashboard/Appointments/ColumnManagerSidebar';
import { useConfirmationToast } from '../Dashboard/Appointments/useConfirmationToast';
import Loader from '../Loader';


const StaffAppointments = () => {
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
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 11;
  const { selectWorkspace, setSelectWorkspace } = useOutletContext();

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('userAppointmentColumns');
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
    const saved = localStorage.getItem('userAppointmentColumns');
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
  const {staff_interviews = [], staff_appointments = [],staff_workspaces = [],staff_pagination, loading = false, error, } = useSelector(state => state.staffApis || {});

console.log(staff_appointments);


useEffect(() => {
    const fetchData = async () => {
      await dispatch(staff_GetWorkspaces());
      await dispatch(staff_FetchInterviews());
    };
    
    fetchData();
  }, [dispatch]);

  // useEffect(() => {
  //   const queryParams = {};
 
  //   if (hasActiveFilters(currentFilters)) {
  //     Object.assign(queryParams, buildQueryParams(currentFilters));
  //   }
  //   dispatch(satff_FetchAppointments(queryParams));
  // }, [dispatch, currentFilters]);

  useEffect(() => {
    const queryParams = { page: currentPage };
    
    if (hasActiveFilters(currentFilters)) {
      Object.assign(queryParams, buildQueryParams(currentFilters));
    }
    
    dispatch(satff_FetchAppointments(queryParams));
  }, [dispatch, currentFilters, currentPage]);

 useEffect(() => {
    if (staff_workspaces && staff_workspaces.length > 0) {
      const queryParams = { page: currentPage };
      
      if (hasActiveFilters(currentFilters)) {
        Object.assign(queryParams, buildQueryParams(currentFilters));
      }
      
      if (selectWorkspace !== null && selectWorkspace !== undefined && selectWorkspace !== 0) {
        queryParams.work_space_id = selectWorkspace;
      }
      
      dispatch(satff_FetchAppointments(queryParams));
      
      if (selectWorkspace !== null && selectWorkspace !== undefined) {
        setCurrentFilters(prev => ({
          ...prev,
          workspaces: selectWorkspace !== 0 ? [selectWorkspace] : []
        }));
      }
    }
  }, [selectWorkspace, dispatch, currentPage, staff_workspaces.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
// const handleDeleteAppointment = async (appointment) => {
//   const confirmMessage = `Are you sure you want to delete the appointment for ${appointment.name}`;
//   showConfirmationToast(
//     confirmMessage,
//     async () => {
//       try {
//         setCancelingAppointment(true);
//         const result = await dispatch(staff_DeleteAppointment(appointment.id));
//         if (!result || !result.success) {
//           throw new Error(result?.message || 'Failed to delete appointment');
//         }
//         if (hasActiveFilters(currentFilters)) {
//           const queryParams = buildQueryParams(currentFilters);
//           await dispatch(satff_FetchAppointments(queryParams));
//         } else {
//           await dispatch(satff_FetchAppointments());

//         }
//         if (selectedAppointment && selectedAppointment.id === appointment.id) {
//           setIsDetailsOpen(false);
//           setSelectedAppointment(null);
//         }
//         setOpenDropdown(null);
//       } catch (error) {
//         const errorMessage = error.message || 'An error occurred while deleting the appointment. Please try again.';
//         toast.error(errorMessage);
//       } finally {
//         setCancelingAppointment(false);
//       }
//     }
//   );
// };
  const handleRescheduleFromSidebar = (appointment) => {
    setAppointmentToReschedule(appointment);
    setIsRescheduleOpen(true);
    setIsDetailsOpen(false);
    setSelectedAppointment(null);
  };

  const handleRescheduleSuccess = () => {
    if (Object.keys(currentFilters).length > 0 && hasActiveFilters(currentFilters)) {
      const queryParams = buildQueryParams(currentFilters);
      dispatch(satff_FetchAppointments(queryParams));
    } else {
      dispatch(satff_FetchAppointments());
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

   const appointmentsArray = Array.isArray(staff_appointments) ? staff_appointments : [];
  
  const filteredAppointments = appointmentsArray.filter(app => {
    if (currentFilters.clients && currentFilters.clients.length > 0) {
      const appointmentClientId = app.client_id || app.customer_id || app.clientId;
      return currentFilters.clients.includes(appointmentClientId);
    }
    return true;
  });
  // Pagination Logic
  const totalPages = staff_pagination?.last_page || 1;
  const totalAppointments = staff_pagination?.total || 0;
  const fromAppointment = staff_pagination?.from || 0;
  const toAppointment = staff_pagination?.to || 0;

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
      const response = await dispatch(staff_GetAppointmentById(appointment?.id));
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
          const result = await dispatch(staff_UpdateAppointmentStatus(appointment.id, { status: "cancelled" }));
          if (!result || !result.success) {
            throw new Error(result?.message || 'Failed to cancel appointment');
          }
          if (hasActiveFilters(currentFilters)) {
            const queryParams = buildQueryParams(currentFilters);
            await dispatch(satff_FetchAppointments(queryParams));
          } else {
            await dispatch(satff_FetchAppointments());
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
    setCurrentPage(1);
    const queryParams = { page: 1 }; 
    if (hasActiveFilters(filters)) {
      Object.assign(queryParams, buildQueryParams(filters));
    }
    dispatch(satff_FetchAppointments(queryParams));
    setIsFilterOpen(false);
  };

  const handleCancelFilters = () => {
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
    setCurrentPage(1);
    dispatch(satff_FetchAppointments({ page: 1 }));
  };


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
      localStorage.setItem('userAppointmentColumns', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving columns to localStorage:', error);
    }
    setIsColumnManagerOpen(false);
  };

  const renderAppointments = () => {
    if (filteredAppointments.length > 0) {
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

          {filteredAppointments.map((item, index) => (
            <div key={item.id} className="border-b last:border-b-0">
              <div className="bg-gray-50 px-6 py-3 border-b" style={{ minWidth: minWidth }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-gray-600" />
                    <span className="text-xs font-medium">{formatDate(item.date)}</span>
                  </div>
               <span className="text-xs text-gray-500">
                {fromAppointment + index} appointment 
              </span>          
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
                              index === filteredAppointments.length - 1 ? 'bottom-full mb-1' : 'top-full'
                            }`}>
                              <div className="py-1">
                               
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
                                  {/* <button
                                    className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center justify-end gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteAppointment(item);
                                    }}
                                  >
                                    <span className="text-xs">Delete</span>
                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                  </button> */}
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
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {fromAppointment} to {toAppointment} of {totalAppointments} appointments
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
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => paginate(1)}
                className="px-3 py-1 text-sm rounded-md bg-white text-gray-600 hover:bg-gray-100"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}
          
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
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => paginate(totalPages)}
                className="px-3 py-1 text-sm rounded-md bg-white text-gray-600 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}
          
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
  if (loading && (staff_appointments?.length === 0)) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">All Interviews</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader
           />
        </div>
      </div>
    );
  }
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
          <h1 className="font-semibold">My Appointments</h1>
        </div>

        <div className="border-b border-gray-200 mb-6 flex justify-between items-center">
          <nav className="flex gap-6">
            {[
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
                  No appointments found
                </h3>
                <p className="text-gray-500 mb-6">You don't have any appointments yet.</p>
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
        // getCustomers={getCustomers}
        interviews={staff_interviews}
        workspaces={staff_workspaces}
        // customers={customers}
      />
      
      
      <AppointmentDetailsSidebar 
        appointment={selectedAppointment}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAppointment(null);
          setDetailsError(null);
        }}
        onCancel={handleCancelAppointment}  
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
        fetchInterviews={staff_FetchInterviews}
        rescheduleAppointment={staff_RescheduleAppointment}
        fetchAppointments={satff_FetchAppointments}
        interviews={staff_interviews}
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

export default StaffAppointments;