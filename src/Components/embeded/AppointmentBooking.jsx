
import { Calendar, Clock, MapPin , ChevronDown, UserRound, Package } from 'lucide-react';
import logo_icon from '../../assets/image/logo_icon.png';
import { useState, useEffect, useRef } from 'react';
import CalendarModal from './calender';
import TimeSelectionModal from './teime';
import BookingSummarySidebar from './BookingSummarySidebar';
import Loader from '../Loader';
import { useNavigate, useParams } from 'react-router-dom';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';
import useBookingLogic from './useBookingLogic';
import { PiBaseballCap, PiUsersThreeLight } from 'react-icons/pi';
import NotFound from '../ProtectedRoute/NotFound';

const AppointmentBooking = () => {
  const { id, idAdmin, idCustomer, idSpace } = useParams();
  const navigate = useNavigate();
  const isInterviewMode = !!idCustomer || !!idSpace || !!idAdmin;

  const [dataNotFound, setDataNotFound] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // State for workspaces
  const [workspaces, setWorkspaces] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [interviews, setInterviews] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [showInterviewDropdown, setShowInterviewDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showStaffGroupDropdown, setShowStaffGroupDropdown] = useState(false);
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const [nameProvider, setNameProvider] = useState();
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [theme, setTheme] = useState(null);
  const isStaff = !!idCustomer;
  
  // Refs for dropdowns
  const workspaceDropdownRef = useRef(null);
  const interviewDropdownRef = useRef(null);
  const staffDropdownRef = useRef(null);
  const staffGroupDropdownRef = useRef(null);
  const resourceDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  const manualSelections = useRef({
    resource: null,
    staff: null,
    staffGroup: null,
    workspace: null,
    interview: null
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setShowWorkspaceDropdown(false);
      }
      if (interviewDropdownRef.current && !interviewDropdownRef.current.contains(event.target)) {
        setShowInterviewDropdown(false);
      }
      if (staffDropdownRef.current && !staffDropdownRef.current.contains(event.target)) {
        setShowStaffDropdown(false);
      }
      if (staffGroupDropdownRef.current && !staffGroupDropdownRef.current.contains(event.target)) {
        setShowStaffGroupDropdown(false);
      }
      if (resourceDropdownRef.current && !resourceDropdownRef.current.contains(event.target)) {
        setShowResourceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getBookingId = () => {
    if (idCustomer && selectedInterview) return selectedInterview.share_link;
    if (idSpace && selectedInterview) return selectedInterview.share_link;
    if (idAdmin && selectedInterview) return selectedInterview.share_link;
    return idCustomer || idSpace || idAdmin || id;
  };
  
  const bookingId = getBookingId();

  const {
    availableResources,
    selectedResource,
    setSelectedResource,
    requireEndTime,
    selectedEndTime,
    setSelectedEndTime,
    calculateEndTime,
    availableStaffGroups,
    selectedStaffGroup,
    setSelectedStaffGroup,
    availableStaff,
    selectedStaff,
    setSelectedStaff,
    bookingData,
    loading,
    error,
    selectedDate,
    selectedTime,
    selectedTimezone,
    formData,
    showBookingSummary,
    showTimeModal,
    showCalendarModal,
    isBooking,
    setSelectedDate,
    setSelectedTime,
    setSelectedTimezone,
    setFormData,
    setShowBookingSummary,
    setShowTimeModal,
    setShowCalendarModal,
    handleBookAppointment,
    handleScheduleAppointment,
    isTimeDisabled,
    selectedType,  
    setSelectedType,
    totalPrice,
    numberOfSlots,
  } = useBookingLogic(bookingId, navigate, isInterviewMode, selectedInterview?.id, idCustomer || idSpace || idAdmin, isStaff);
 
  
  useEffect(() => {
    if (availableResources && availableResources.length === 1 && !manualSelections.current.resource) {
      console.log('✅ Auto-selecting single resource');
      setSelectedResource(availableResources[0]);
    }
  }, [availableResources]);

  useEffect(() => {
    if (availableStaff && availableStaff.length === 1 && !manualSelections.current.staff) {
      console.log('✅ Auto-selecting single staff');
      setSelectedStaff(availableStaff[0]);
    }
  }, [availableStaff]);

  useEffect(() => {
    if (workspaces && workspaces.length === 1 && !manualSelections.current.workspace) {
      console.log('✅ Auto-selecting single workspace');
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces]);

  useEffect(() => {
    if (availableStaffGroups && availableStaffGroups.length === 1 && !manualSelections.current.staffGroup) {
      console.log('✅ Auto-selecting single staff group');
      setSelectedStaffGroup(availableStaffGroups[0]);
    }
  }, [availableStaffGroups]);

  useEffect(() => {
    if (interviews && interviews.length === 1 && !manualSelections.current.interview) {
      console.log('✅ Auto-selecting single interview');
      setSelectedInterview(interviews[0]);
    }
  }, [interviews]);

  // ✅ Fetch data based on mode مع إضافة تتبع حالة Not Found
  useEffect(() => {
    const fetchData = async () => {
      setIsInitialLoading(true);
      
      try {
        if (idAdmin) {
          await fetchWorkspaces();
        } else if (idSpace) {
          await fetchInterviews(idSpace, 'workspace'); 
        } else if (idCustomer) {
          await fetchInterviews(idCustomer, 'customer');
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setDataNotFound(true);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [idAdmin, idSpace, idCustomer]);

  useEffect(() => {
    if (idAdmin && selectedWorkspace && selectedWorkspace.share_link) {
      fetchInterviews(selectedWorkspace.share_link, 'workspace');
    }
  }, [selectedWorkspace, idAdmin]);

  // ✅ تحديث fetchWorkspaces لتتبع Not Found
  const fetchWorkspaces = async () => {
    setWorkspacesLoading(true);
    try {
      const response = await fetch(`https://backend-booking.appointroll.com/api/public/book/resource?customer_share_link=${idAdmin}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404 || response.status === 400) {
          setDataNotFound(true);
        }
        
        if (errorData?.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          errorMessages.forEach(msg => console.error(msg));
        } else {
          const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
          console.error(errorMessage);
        }
        
        setWorkspaces([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.error || data.status === 'error') {
        console.error(data.message || 'Failed to fetch workspaces');
        setDataNotFound(true);
        setWorkspaces([]);
        return;
      }
      
      if (data.data && data?.data?.workspaces) {
        if (data.data.workspaces.length === 0) {
          setDataNotFound(true);
        }
        setWorkspaces(data?.data?.workspaces);
        setNameProvider(data?.data?.workspaces[0]?.customer_name);
      } else {
        setDataNotFound(true);
        setWorkspaces([]);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      setDataNotFound(true);
      setWorkspaces([]);
    } finally {
      setWorkspacesLoading(false);
    }
  };

  // ✅ تحديث fetchInterviews لتتبع Not Found
  const fetchInterviews = async (resourceId, mode) => {
    setInterviewsLoading(true);
    try {
      let apiUrl;
      
      if (mode === 'customer') {
        apiUrl = `https://backend-booking.appointroll.com/api/public/book/resource?staff_share_link=${resourceId}`;
      } else {
        apiUrl = `https://backend-booking.appointroll.com/api/public/book/resource?workspace_share_link=${resourceId}`;
      }
      
      const response = await fetch(apiUrl);
      
      // ✅ فحص حالة الـ response
      if (!response.ok) {
        if (response.status === 404 || response.status === 400) {
          setDataNotFound(true);
        }
        setInterviews([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.error || data.status === 'error') {
        setDataNotFound(true);
        setInterviews([]);
        return;
      }
      
      let interviewsData = [];
      
      if (idSpace) {
        interviewsData = data?.data?.workspace_interviews || [];
        setTheme(data?.data?.theme);
        
        setNameProvider(data?.data?.workspace_interviews[0]?.customer_name);
      } else if (idAdmin && selectedWorkspace) {
        interviewsData = data?.data?.workspace_interviews || [];
        setNameProvider(data?.data?.workspace_interviews[0]?.customer_name);
      } else if (idCustomer) {
        interviewsData = data?.data?.staff_interviews || [];
        setNameProvider(data?.data?.staff_interviews[0]?.customer_name);
      }
      
     
      if (interviewsData.length === 0) {
        setDataNotFound(true);
      }
     
      setInterviews(interviewsData);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setDataNotFound(true);
      setInterviews([]);
    } finally {
      setInterviewsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !bookingData && !isInterviewMode && bookingId) {
      setDataNotFound(true);
    }
  }, [loading, bookingData, isInterviewMode, bookingId]);

  const handlePhoneCodeChange = (code) => {
    setFormData({ ...formData, code_phone: code });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkspaceSelect = (workspace) => {
    console.log('👤 Manually selected workspace:', workspace.name);
    setSelectedWorkspace(workspace);
    setShowWorkspaceDropdown(false);
    manualSelections.current.workspace = workspace;
    setSelectedInterview(null);
    setInterviews(null);
    manualSelections.current.interview = null;
  };

  const handleInterviewSelect = (interview) => {
    console.log('👤 Manually selected interview:', interview.name);
    setSelectedInterview(interview);
    setShowInterviewDropdown(false);
    manualSelections.current.interview = interview;
  };

  const handleResourceSelect = (resource) => {
    console.log('📦 Manually selected resource:', resource.name);
    setSelectedResource(resource);
    setShowResourceDropdown(false);
    manualSelections.current.resource = resource;
  };

  const handleStaffSelect = (staff) => {
    console.log('👤 Manually selected staff:', staff.name);
    setSelectedStaff(staff);
    setShowStaffDropdown(false);
    manualSelections.current.staff = staff;
  };

  const handleStaffGroupSelect = (group) => {
    console.log('👥 Manually selected staff group:', group.group_name);
    setSelectedStaffGroup(group);
    setShowStaffGroupDropdown(false);
    manualSelections.current.staffGroup = group;
  };

  const isBookButtonDisabled = () => {
    if (idAdmin && !selectedWorkspace) return true;
    if (idAdmin && !selectedInterview) return true;
    if ((idSpace || idCustomer) && !selectedInterview) return true;
    
    if (availableStaffGroups && availableStaffGroups.length > 0 && !selectedStaffGroup) return true;
    if (!availableStaffGroups?.length && availableStaff && availableStaff.length > 0 && !selectedStaff) return true;
    
    if (availableResources && availableResources.length > 0 && !selectedResource) return true;
    
    if (!selectedDate || !selectedTime) return true;
    if (isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)) return true;
    if (bookingData?.mode === 'online/inperson' && !selectedType) return true;

    return false;
  };

  const getBookButtonText = () => {
    if (idAdmin && !selectedWorkspace) return 'Select Workspace';
    if (idAdmin && !selectedInterview) return 'Select Interview';
    if ((idSpace || idCustomer) && !selectedInterview) return 'Select Interview';
    
    if (availableStaffGroups && availableStaffGroups.length > 0 && !selectedStaffGroup) return 'Select Staff Group';
    if (!availableStaffGroups?.length && availableStaff && availableStaff.length > 0 && !selectedStaff) return 'Select Staff';
    
    if (availableResources && availableResources.length > 0 && !selectedResource) return 'Select Resource';
    
    if (!selectedDate || !selectedTime) return 'Select Date & Time';
    if (isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)) return 'Time Not Available';
    if (bookingData?.mode === 'online/inperson' && !selectedType) return 'Select Type';

    return 'Book Appointment';
  };

if (isInitialLoading) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
}

  if (dataNotFound) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-100 !text-sm">
      <div className="max-w-7xl mx-auto p-6 py-8 pt-20 ">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo_icon} className='h-14 w-14 object-cover' alt="" />
            <h1 className="text-2xl font-bold text-gray-800">
              Book Your Appointment
            </h1>
          </div>
          <p className="text-gray-600 text-[16px]">
            Book your appointment in a few simple steps: Choose {isInterviewMode ? 'an interview' : 'a service'}, pick your date and time, and fill in your details. See you soon!
          </p>
        </div>

        {/* Booking Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Provider Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center h-full">
              <div className="w-full flex justify-between items-center">
                <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserRound className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-800">
                  {nameProvider || bookingData?.provider_name || 'Provider'}
                </h3>
                <span></span>
              </div>
            </div>
          </div>

          {/* Workspace Card */}
          {idAdmin && (
            <div ref={workspaceDropdownRef} className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}>
                <div className="flex items-center">
                  <PiBaseballCap className="w-5 h-5 mr-3 text-gray-600" />
                  <h3 className="font-semibold text-gray-800 max-w-[135px] truncate" title={selectedWorkspace ? selectedWorkspace.name : 'Select Workspace...'}>
                    {selectedWorkspace ? selectedWorkspace.name : 'Select Workspace...'}
                  </h3>
                </div>
                {workspaces && workspaces.length > 1 && (
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transform transition-transform ${
                      showWorkspaceDropdown ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              {showWorkspaceDropdown && workspaces && workspaces.length > 1 && (
                <div className="relative">
                  <div className="absolute top-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    {workspaces?.map((workspace) => (
                      <div
                        key={workspace.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleWorkspaceSelect(workspace)}
                      >
                        <div className="flex items-center">
                          <PiBaseballCap className="w-4 h-4 text-gray-600 mr-3" />
                          <span className="text-gray-800 truncate block max-w-[150px]">{workspace.name}</span>
                        </div>
                      </div>
                    ))}
                    {(!workspaces || workspaces.length === 0) && (
                      <div className="p-3 text-gray-500 text-center">
                        No workspaces available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interview/Service Card */}
          {isInterviewMode ? (
            <div ref={interviewDropdownRef} className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => {
                if (idAdmin && !selectedWorkspace) return;
                setShowInterviewDropdown(!showInterviewDropdown);
              }}>
                <div className="flex items-center">
                  {bookingData?.photo ? (
                    <img
                      src={bookingData.photo}
                      alt="Provider"
                      className="w-11 h-11 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <PiBaseballCap className="w-5 h-5 mr-3 text-gray-600" />
                  )}
                  <h3 className={`font-semibold text-gray-800 max-w-[135px] truncate ${idAdmin && !selectedWorkspace ? 'opacity-50' : ''}`} title={selectedInterview ? selectedInterview.name : 'Select Interview...'}>
                    {selectedInterview ? selectedInterview.name : 'Select Interview...'}
                  </h3>
                </div>
                
                {(bookingData?.duration || (bookingData?.price && bookingData?.price > 0)) && (
                  <p className="text-sm text-gray-500">
                    ({bookingData?.duration}
                    {bookingData?.price && bookingData?.price > 0 ? ` | ${bookingData.price} ${bookingData.currency}` : ""})
                  </p>
                )}

                {interviews && interviews.length > 1 && !(idAdmin && !selectedWorkspace) && (
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transform transition-transform ${
                      showInterviewDropdown ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              {showInterviewDropdown && !(idAdmin && !selectedWorkspace) && interviews && interviews.length > 1 && (
                <div className="relative">
                  <div className="absolute top-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    {interviews?.map((interview) => (
                      <div
                        key={interview.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleInterviewSelect(interview)}
                      >
                        <div className="flex items-center">
                          <PiBaseballCap className="w-4 h-4 text-gray-600 mr-3" />
                          <span className="text-gray-800 truncate block max-w-[150px]">{interview.name}</span>
                        </div>
                      </div>
                    ))}
                    {(!interviews || interviews.length === 0) && (
                      <div className="p-3 text-gray-500 text-center">
                        No interviews available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between h-full">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <PiBaseballCap className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 truncate block max-w-[150px]">
                    {bookingData?.service_name || 'Service'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ({bookingData?.duration}
                    {bookingData?.price && bookingData?.price > 0 ? ` | ${bookingData.price} ${bookingData.currency}` : ""})
                  </p>
                </div>
                <span></span>
              </div>
            </div>
          )}

          {/* Staff Dropdown */}
          {availableStaff && availableStaff.length > 0 && (
            <div ref={staffDropdownRef} className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => availableStaff.length > 1 && setShowStaffDropdown(!showStaffDropdown)}>
                <div className="flex items-center">
                  {typeof selectedStaff?.photo === 'string' && selectedStaff.photo.trim() !== '' ? (
                    <img
                      src={selectedStaff.photo}
                      alt="Staff"
                      className="w-11 h-11 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <UserRound className="w-5 h-5 mr-3 text-gray-600" />
                  )}
                  <h3 className="font-semibold text-gray-800 max-w-[135px] truncate">
                    {selectedStaff ? selectedStaff.name : 'Select Staff...'}
                  </h3>
                </div>
                {availableStaff.length > 1 && (
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transform transition-transform ${
                      showStaffDropdown ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              {showStaffDropdown && availableStaff.length > 1 && (
                <div className="relative">
                  <div className="absolute top-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    {availableStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleStaffSelect(staff)}
                      >
                        <div className="flex items-center">
                          {typeof staff?.photo === 'string' && staff?.photo.trim() !== '' ? (
                            <img
                              src={staff.photo}
                              alt={staff.name}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <UserRound className="w-4 h-4 text-gray-600 mr-3" />
                          )}
                          <span className="text-gray-800 truncate  max-w-[150px]">{staff.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Staff Group Dropdown */}
          {availableStaffGroups && availableStaffGroups.length > 0 && (
            <div ref={staffGroupDropdownRef} className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => availableStaffGroups.length > 1 && setShowStaffGroupDropdown(!showStaffGroupDropdown)}>
                <div className="flex items-center">
                  <PiUsersThreeLight className="w-6 h-6 mr-3 text-gray-600" />
                  <h3 className="font-semibold text-gray-800 max-w-[135px] truncate">
                    {selectedStaffGroup ? selectedStaffGroup.group_name : 'Select Staff Group...'}
                  </h3>
                </div>
                {availableStaffGroups.length > 1 && (
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transform transition-transform ${
                      showStaffGroupDropdown ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              {showStaffGroupDropdown && availableStaffGroups.length > 1 && (
                <div className="relative">
                  <div className="absolute top-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    {availableStaffGroups.map((group) => (
                      <div
                        key={group.group_id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleStaffGroupSelect(group)}
                      >
                        <div className="flex items-center">
                          <UserRound className="w-4 h-4 text-gray-600 mr-3" />
                          <div>
                            <span className="text-gray-800 font-medium">{group.group_name}</span>
                            {group.group_description && (
                              <p className="text-xs text-gray-500">{group.group_description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {group.staff.length} staff member{group.staff.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resource Dropdown - ✅ الحل الأساسي هنا */}
          {availableResources && availableResources.length > 0 && (
            <div ref={resourceDropdownRef} className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => availableResources.length > 1 && setShowResourceDropdown(!showResourceDropdown)}>
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-3 text-gray-600" />
                  <h3 className="font-semibold text-gray-800 max-w-[135px] truncate">
                    {selectedResource ? selectedResource.name : 'Select Resource...'}
                  </h3>
                </div>
                {availableResources.length > 1 && (
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transform transition-transform ${
                      showResourceDropdown ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              {showResourceDropdown && availableResources.length > 1 && (
                <div className="relative">
                  <div className="absolute top-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    {availableResources.map((resource) => (
                      <div
                        key={resource.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleResourceSelect(resource)}
                      >
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-600 mr-3" />
                          <div>
                            <span className="text-gray-800 font-medium truncate  max-w-[150px]">{resource.name}</span>
                            {resource.description && (
                              <p className="text-xs text-gray-500">{resource.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Type Dropdown */}
          {bookingData?.mode === 'online/inperson' && (
            <div ref={typeDropdownRef} className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => setShowTypeDropdown(!showTypeDropdown)}>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                  <h3 className="font-semibold text-gray-800 max-w-[135px] truncate">
                    {selectedType ? (
                      selectedType === 'online' ? 'Online' :
                      selectedType === 'inhouse' ? 'In House' :
                      'At Home'
                    ) : 'Select Type...'}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${
                    showTypeDropdown ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {showTypeDropdown && (
                <div className="relative">
                  <div className="absolute top-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                    <div
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      onClick={() => {
                        setSelectedType('online');
                        setShowTypeDropdown(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="text-gray-800">Online</span>
                      </div>
                    </div>
                    <div
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      onClick={() => {
                        setSelectedType('inhouse');
                        setShowTypeDropdown(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="text-gray-800">In House</span>
                      </div>
                    </div>
                    <div
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedType('athome');
                        setShowTypeDropdown(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="text-gray-800">At Home</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Date Card */}
          <div
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowCalendarModal(true)}
          >
            <div className="flex items-center justify-between h-full">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">{selectedDate || 'Select Date'}</h3>
              <span></span>
            </div>
          </div>

          {/* Timezone Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col w-full overflow-visible">
            <div className="flex items-center justify-start mb-2 w-full relative">
              <MapPin className="h-5 text-gray-600 mr-3 text-left" />
              <div className="flex-1 min-w-0">
                <TimezoneSelect
                  value={selectedTimezone}
                   timezones={allTimezones}
                  onChange={(timezone) => setSelectedTimezone(timezone.value)}
                  className="react-timezone-select w-full"
                  classNamePrefix="select"
                  styles={{
                    container: (base) => ({
                      ...base,
                      width: '100%',
                    }),
                    control: (base) => ({
                      ...base,
                      border: 'none',
                      boxShadow: 'none',
                      width: '100%',
                      '&:hover': {
                        border: 'none',
                      },
                    }),
                    menu: (base, state) => {
                      const containerWidth = state.selectProps.container?.offsetWidth || 320;
                      return {
                        ...base,
                        width: `${containerWidth}px`,
                        minWidth: `${containerWidth}px`,
                        right: '0',
                        zIndex: 9999,
                      };
                    },
                    menuList: (base) => ({
                      ...base,
                      width: '100%',
                    }),
                    option: (base) => ({
                      ...base,
                      width: '100%',
                    }),
                  }}
                  menuPlacement="auto"
                  menuPosition="fixed"
                />
              </div>
            </div>
          </div>

          {/* Time Card */}
          <div
            className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow ${
              selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                ? 'border-2 border-red-300 bg-red-50'
                : ''
            }`}
            onClick={() => setShowTimeModal(true)}
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Time</h3>
              </div>
              
              <div className="flex items-center gap-2">
                {requireEndTime ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-[15px] font-semibold ${
                        selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                          ? 'text-red-600 line-through'
                          : 'text-gray-800'
                      }`}
                    >
                      {selectedTime || '--:--'}
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="text-[15px] font-semibold text-gray-800">
                      {selectedEndTime || '--:--'}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`text-[15px] font-semibold ${
                      selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                        ? 'text-red-600 line-through'
                        : 'text-gray-800'
                    }`}
                  >
                    {selectedTime || 'Select Time'}
                  </div>
                )}
                
                {selectedTime &&
                  isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) && (
                    <span className="text-xs text-red-500 ml-2 font-normal">(Booked)</span>
                  )}
              </div>
              <span></span>
            </div>
          </div>

          {/* Book Button */}
          <div className="bg-white rounded-lg shadow-sm p flex items-center justify-center">
            <button
              onClick={handleBookAppointment}
              disabled={isBookButtonDisabled()}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 rounded-lg font-semibold text-[16px] transition-colors shadow-lg w-full h-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {getBookButtonText()}
            </button>
          </div>
        </div>
      </div>
         
      {/* Modals */}
     <CalendarModal
  show={showCalendarModal}
  onClose={() => setShowCalendarModal(false)}
  selectedDate={selectedDate}
  onDateSelect={setSelectedDate}
  availableDates={bookingData?.available_dates || []}
  unavailableDates={bookingData?.unavailable_dates || []}
  disabledTimes={bookingData?.disabled_times || []}
  availableTimes={bookingData?.available_times || []}
  availableTimesFromAPI={bookingData?.raw_available_times || []}
  unavailableTimes={bookingData?.unavailable_times || []}
  
  // ← أضف دول كلهم
  selectedTimeZone={selectedTimezone}
  setSelectedTimezone={setSelectedTimezone}        // مهم جدًا
  workspaceTimezone={bookingData?.workspace_timezone || 'Africa/Cairo'}
  durationCycle={parseInt(bookingData?.duration_cycle) || 15}
  durationPeriod={bookingData?.duration_period || 'minutes'}
  restCycle={parseInt(bookingData?.rest_cycle || 0)}
/>
      <TimeSelectionModal
        show={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        availableTimes={bookingData?.available_times || []}
        unavailableTimes={bookingData?.unavailable_times || []}
        selectedDate={selectedDate}
        disabledTimes={bookingData?.disabled_times || []}
        unavailableDates={bookingData?.unavailable_dates || []}
        requireEndTime={requireEndTime}
        selectedEndTime={selectedEndTime}
        durationCycle={bookingData?.duration_cycle}
        durationPeriod={bookingData?.duration_period}
        setSelectedEndTime={setSelectedEndTime}
      />

      <BookingSummarySidebar
        show={showBookingSummary}
        onClose={() => setShowBookingSummary(false)}
        bookingData={isInterviewMode ? { ...bookingData, selectedInterview } : bookingData}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedTimezone={selectedTimezone}
        formData={formData}
        onFormChange={handleFormChange}
        onPhoneCodeChange={handlePhoneCodeChange}
        onScheduleAppointment={handleScheduleAppointment}
        isBooking={isBooking}
        selectedType={selectedType}
        totalPrice={totalPrice}
        numberOfSlots={numberOfSlots}
      />
    </div>
  );
};

export default AppointmentBooking;