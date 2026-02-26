import { Calendar, Clock, MapPin , ChevronDown, UserRound, Package, ChevronsUpDown } from 'lucide-react';
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
import BookingFooter from './BookingFooter';

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

   const DEFAULT_COLORS = {
  primary: "#ffffff-rgb(241 82 179)",
  text_color: "#111827",
};

let apiColors = {};

try {
  apiColors = theme?.colors ? JSON.parse(theme.colors) : {};
} catch {
  apiColors = {};
}

const colors =
  theme?.theme === "theme2"
    ? { ...DEFAULT_COLORS, ...apiColors }
    : DEFAULT_COLORS;

const primary = colors.primary ?? DEFAULT_COLORS.primary;

const [firstColor, secondColor] =
  primary?.includes("-")
    ? primary.split("-")
    : [primary, primary];


const textColor = colors.text_color;

console.log(theme);

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
     modalDisplayedTimes,    
  refreshTimesForModal,
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
  } = useBookingLogic(bookingId, navigate, isInterviewMode, selectedInterview?.id, idCustomer || idSpace || idAdmin, isStaff, setTheme,theme);
 
  
  useEffect(() => {
    if (availableResources && availableResources.length === 1 && !manualSelections.current.resource) {
      
      setSelectedResource(availableResources[0]);
    }
  }, [availableResources]);

  useEffect(() => {
  if (
    availableStaff && 
    availableStaff.length === 1 && 
    !manualSelections.current.staff &&
    bookingData?.duration_cycle  
  ) {
    console.log('✅ Auto-selecting single staff');
    setSelectedStaff(availableStaff[0]);
  }
}, [availableStaff, bookingData?.duration_cycle]); 

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
         if (data.data?.theme && !theme) {  
            setTheme(data.data.theme);
          }
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
        setTheme(data?.data?.theme);
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
    setSelectedStaff(staff);
    setShowStaffDropdown(false);
    manualSelections.current.staff = staff;
  };

  const handleStaffGroupSelect = (group) => {
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

  return theme?.book_button || 'Book Appointment';
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
  <div className="min-h-screen !text-sm" style={{ background: firstColor }}>
    <div className="max-w-6xl mx-auto p-8 pt-20">
      {/* Fixed Header */}
      <div className="flex items-center gap-2 mb-4 fixed top-4 left-4">
        {theme?.photo && (
          <img
            src={theme.photo}
            className="h-14 w-14 object-cover rounded-xl"
            alt=""
          />
        )}
        <h1 className="text-lg font-bold" style={{ color: textColor }}>
          {theme?.nickname}
        </h1>
      </div>

      {/* Page Title Section */}
      <div className="my-11">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-center m-auto" style={{ color: textColor }}>
            {theme?.page_title}
          </h1>
        </div>
        <p className="text-lg text-center m-auto" style={{ color: textColor }}>
          {(isInterviewMode && selectedInterview?.page_description) 
            ? selectedInterview.page_description 
            : theme?.page_description}
        </p>
      </div>

      {/* Main Booking Grid - All Controls in One Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        
        {/* Provider Card */}
        <div className="flex overflow-hidden" style={{ background: `${textColor}30` }}>
          <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
            <UserRound style={{ color: secondColor }} className="w-6 h-6" />
          </div>
          <div className="flex-1 p-4 flex justify-between items-center">
            <div className="font-medium" style={{ color: textColor }}>
              {nameProvider || bookingData?.provider_name || 'Provider'}
            </div>
          </div>
        </div>

        {/* Workspace Card */}
        {idAdmin && (
          <div ref={workspaceDropdownRef} className="relative">
            <div 
              className="flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full" 
              style={{ background: `${textColor}30` }}
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            >
              <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
                <PiBaseballCap style={{ color: secondColor }} className="w-6 h-6" />
              </div>
              <div className="flex-1 p-4 flex justify-between items-center">
                <h3 className="font-medium line-clamp-1" style={{ color: textColor }}>
                  {selectedWorkspace ? selectedWorkspace.name : 'Select Workspace...'}
                </h3>
                {workspaces && workspaces.length > 1 && (
                  <ChevronsUpDown className="w-5 h-5 flex-shrink-0 ml-2" style={{ color: secondColor }} />
                )}
              </div>
            </div>
            {showWorkspaceDropdown && workspaces && workspaces.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <div className="shadow-lg max-h-60 overflow-y-auto" style={{ background: firstColor }}>
                  {workspaces?.map((workspace) => (
                    <div
                      key={workspace.id}
                      className="p-3 hover:bg-black/10 cursor-pointer border-b last:border-b-0"
                      style={{ borderColor: `${textColor}20` }}
                      onClick={() => handleWorkspaceSelect(workspace)}
                    >
                      <div className="flex items-center">
                        <PiBaseballCap style={{ color: secondColor }} className="w-4 h-4 mr-3" />
                        <span style={{ color: textColor }}>{workspace.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interview/Service Card */}
        {isInterviewMode ? (
          <div ref={interviewDropdownRef} className="relative">
            <div 
              className="flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
              style={{ background: `${textColor}30` }}
              onClick={() => {
                if (idAdmin && !selectedWorkspace) return;
                setShowInterviewDropdown(!showInterviewDropdown);
              }}
            >
              <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
                {bookingData?.photo ? (
                  <img src={bookingData.photo} alt="Interview" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <PiBaseballCap style={{ color: secondColor }} className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 p-4 flex justify-between items-center">
                <div>
                  <h3 
                    className={`font-medium text-sm line-clamp-1 ${idAdmin && !selectedWorkspace ? 'opacity-50' : ''}`} 
                    style={{ color: textColor }}
                  >
                    {selectedInterview ? selectedInterview.name : 'Select Interview...'}
                  </h3>
                  {(bookingData?.duration || (bookingData?.price && bookingData?.price > 0)) && (
                    <p className="text-xs mt-1" style={{ color: `${textColor}80` }}>
                      ({bookingData?.duration}
                      {bookingData?.price && bookingData?.price > 0 ? ` | ${bookingData.price} ${bookingData.currency}` : ""})
                    </p>
                  )}
                </div>
                {interviews && interviews.length > 1 && !(idAdmin && !selectedWorkspace) && (
                  <ChevronsUpDown className="w-5 h-5 flex-shrink-0 ml-2" style={{ color: secondColor }} />
                )}
              </div>
            </div>
            {showInterviewDropdown && !(idAdmin && !selectedWorkspace) && interviews && interviews.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <div className="shadow-lg max-h-60 overflow-y-auto" style={{ background: firstColor, borderColor: `${firstColor}40` }}>
                  {interviews?.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-3 hover:bg-black/10 cursor-pointer border-b last:border-b-0"
                      style={{ borderColor: `${textColor}20` }}
                      onClick={() => handleInterviewSelect(interview)}
                    >
                      <div className="flex items-center">
                        <PiBaseballCap style={{ color: secondColor }} className="w-4 h-4 mr-3" />
                        <span style={{ color: textColor }}>{interview.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex overflow-hidden" style={{ background: `${textColor}30` }}>
            <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
              <PiBaseballCap style={{ color: secondColor }} className="w-6 h-6" />
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-sm" style={{ color: textColor }}>
                  {bookingData?.service_name || 'Service'}
                </h3>
                <p className="text-xs mt-1" style={{ color: `${textColor}80` }}>
                  ({bookingData?.duration}
                  {bookingData?.price && bookingData?.price > 0 ? ` | ${bookingData.price} ${bookingData.currency}` : ""})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Staff Dropdown */}
        {availableStaff && availableStaff.length > 0 && (
          <div ref={staffDropdownRef} className="relative">
            <div 
              className="flex overflow-hidden cursor-pointer h-full" 
              style={{ background: `${textColor}30` }}
              onClick={() => availableStaff.length > 1 && setShowStaffDropdown(!showStaffDropdown)}
            >
              <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
                {typeof selectedStaff?.photo === 'string' && selectedStaff.photo.trim() !== '' ? (
                  <img src={selectedStaff.photo} alt="Staff" className="w-10 h-10 rounded object-cover" />
                ) : (
                  <UserRound style={{ color: secondColor }} className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 p-4 flex justify-between items-center">
                <h3 className="font-medium line-clamp-1" style={{ color: textColor }}>
                  {selectedStaff ? selectedStaff.name : 'Select Staff...'}
                </h3>
                {availableStaff.length > 1 && (
                  <ChevronsUpDown className="w-5 h-5 flex-shrink-0 ml-2" style={{ color: secondColor }} />
                )}
              </div>
            </div>
            {showStaffDropdown && availableStaff.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <div className="shadow-lg max-h-60 overflow-y-auto border" style={{ background: firstColor, borderColor: `${firstColor}40` }}>
                  {availableStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className="p-3 hover:bg-black/10 cursor-pointer border-b last:border-b-0"
                      style={{ borderColor: `${textColor}20` }}
                      onClick={() => handleStaffSelect(staff)}
                    >
                      <div className="flex items-center">
                        {typeof staff?.photo === 'string' && staff?.photo.trim() !== '' ? (
                          <img src={staff.photo} alt={staff.name} className="w-8 h-8 rounded-full object-cover mr-3" />
                        ) : (
                          <UserRound style={{ color: secondColor }} className="w-5 h-5 mr-3" />
                        )}
                        <span style={{ color: textColor }}>{staff.name}</span>
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
          <div ref={staffGroupDropdownRef} className="relative">
            <div 
              className="flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full" 
              style={{ background: `${textColor}30` }}
              onClick={() => availableStaffGroups.length > 1 && setShowStaffGroupDropdown(!showStaffGroupDropdown)}
            >
              <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
                <PiUsersThreeLight style={{ color: secondColor }} className="w-6 h-6" />
              </div>
              <div className="flex-1 p-4 flex justify-between items-center">
                <h3 className="font-medium line-clamp-1" style={{ color: textColor }}>
                  {selectedStaffGroup ? selectedStaffGroup.group_name : 'Select Staff Group...'}
                </h3>
                {availableStaffGroups.length > 1 && (
                  <ChevronsUpDown className="w-5 h-5 flex-shrink-0 ml-2" style={{ color: secondColor }} />
                )}
              </div>
            </div>
            {showStaffGroupDropdown && availableStaffGroups.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <div className="shadow-lg max-h-60 overflow-y-auto border" style={{ background: firstColor, borderColor: `${firstColor}40` }}>
                  {availableStaffGroups.map((group) => (
                    <div
                      key={group.group_id}
                      className="p-3 hover:bg-black/10 cursor-pointer border-b last:border-b-0"
                      style={{ borderColor: `${textColor}20` }}
                      onClick={() => handleStaffGroupSelect(group)}
                    >
                      <div className="flex items-center">
                        <UserRound style={{ color: secondColor }} className="w-4 h-4 mr-3" />
                        <div>
                          <span className="font-medium" style={{ color: textColor }}>{group.group_name}</span>
                          {group.group_description && (
                            <p className="text-xs mt-1" style={{ color: `${textColor}80` }}>{group.group_description}</p>
                          )}
                          <p className="text-xs mt-1" style={{ color: `${textColor}80` }}>
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

        {/* Resource Dropdown */}
        {availableResources && availableResources.length > 0 && (
          <div ref={resourceDropdownRef} className="relative">
            <div 
              className="flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full" 
              style={{ background: `${textColor}30` }}
              onClick={() => availableResources.length > 1 && setShowResourceDropdown(!showResourceDropdown)}
            >
              <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
                <Package style={{ color: secondColor }} className="w-6 h-6" />
              </div>
              <div className="flex-1 p-4 flex justify-between items-center">
                <h3 className="font-medium line-clamp-1" style={{ color: textColor }}>
                  {selectedResource ? selectedResource.name : 'Select Resource...'}
                </h3>
                {availableResources.length > 1 && (
                  <ChevronsUpDown className="w-5 h-5 flex-shrink-0 ml-2" style={{ color: secondColor }} />
                )}
              </div>
            </div>
            {showResourceDropdown && availableResources.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <div className="shadow-lg max-h-60 overflow-y-auto border" style={{ background: firstColor, borderColor: `${firstColor}40` }}>
                  {availableResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="p-3 hover:bg-black/10 cursor-pointer border-b last:border-b-0"
                      style={{ borderColor: `${textColor}20` }}
                      onClick={() => handleResourceSelect(resource)}
                    >
                      <div className="flex items-center">
                        <Package style={{ color: secondColor }} className="w-4 h-4 mr-3" />
                        <div>
                          <span className="font-medium" style={{ color: textColor }}>{resource.name}</span>
                          {resource.description && (
                            <p className="text-xs mt-1" style={{ color: `${textColor}80` }}>{resource.description}</p>
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
          <div ref={typeDropdownRef} className="relative">
            <div 
              className="flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full" 
              style={{ background: `${textColor}30` }}
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
                <MapPin style={{ color: secondColor }} className="w-6 h-6" />
              </div>
              <div className="flex-1 p-4 flex justify-between items-center">
                <h3 className="font-medium" style={{ color: textColor }}>
                  {selectedType ? (
                    selectedType === 'online' ? 'Online' :
                    selectedType === 'inhouse' ? 'In House' :
                    'At Home'
                  ) : 'Select Type...'}
                </h3>
                <ChevronsUpDown className="w-5 h-5 flex-shrink-0 ml-2" style={{ color: secondColor }} />
              </div>
            </div>
            {showTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <div className="shadow-lg border" style={{ background: firstColor, borderColor: `${firstColor}40` }}>
                  <div
                    className="p-3 hover:bg-black/10 cursor-pointer border-b"
                    style={{ borderColor: `${textColor}20` }}
                    onClick={() => { setSelectedType('online'); setShowTypeDropdown(false); }}
                  >
                    <span style={{ color: textColor }}>Online</span>
                  </div>
                  <div
                    className="p-3 hover:bg-black/10 cursor-pointer border-b"
                    style={{ borderColor: `${textColor}20` }}
                    onClick={() => { setSelectedType('inhouse'); setShowTypeDropdown(false); }}
                  >
                    <span style={{ color: textColor }}>In House</span>
                  </div>
                  <div
                    className="p-3 hover:bg-black/10 cursor-pointer"
                    onClick={() => { setSelectedType('athome'); setShowTypeDropdown(false); }}
                  >
                    <span style={{ color: textColor }}>At Home</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Date Card */}
        <div
          className="flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          style={{ background: `${textColor}30` }}
          onClick={() => setShowCalendarModal(true)}
        >
          <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
            <Calendar style={{ color: secondColor }} className="w-6 h-6" />
          </div>
          <div className="flex-1 p-4 flex justify-between items-center">
            <h3 className="font-medium" style={{ color: textColor }}>
              {selectedDate || 'Select Date'}
            </h3>
            <ChevronsUpDown className="w-5 h-5" style={{ color: secondColor }} />
          </div>
        </div>

        {/* Timezone Card */}
        <div className="flex" style={{ background: `${textColor}30` }}>
          <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
            <MapPin style={{ color: secondColor }} className="w-6 h-6" />
          </div>
          <div className="flex-1 p-4 flex items-center">
            <TimezoneSelect
              value={selectedTimezone}
              timezones={allTimezones}
              onChange={(timezone) => setSelectedTimezone(timezone.value)}
              className="w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  border: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                  minHeight: 'auto',
                  color: textColor,
                }),
                singleValue: (base) => ({
                  ...base,
                  color: textColor,
                  fontWeight: 500,
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                  background: firstColor,
                }),
                option: (base, state) => ({
                  ...base,
                  background: state.isFocused ? 'rgba(0,0,0,0.1)' : 'transparent',
                  color: textColor,
                }),
                indicatorSeparator: () => ({ display: 'none' }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: secondColor,
                  padding: '4px',
                }),
              }}
            />
          </div>
        </div>

        {/* Time Card */}
        <div
          className={`flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
            selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
              ? 'border-2 border-red-400'
              : ''
          }`}
          style={{ background: `${textColor}30` }}
          onClick={() => {
            refreshTimesForModal(selectedDate);
            setShowTimeModal(true);
          }}
        >
          <div className="w-16 p-4 flex items-center justify-center" style={{ background: `${textColor}50` }}>
            <Clock style={{ color: secondColor }} className="w-6 h-6" />
          </div>
          <div className="flex-1 p-4 flex justify-between items-center">
            <div>
              {requireEndTime ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                        ? 'text-red-600 line-through'
                        : ''
                    }`}
                    style={{ color: selectedTime && !isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) ? textColor : undefined }}
                  >
                    {selectedTime || '--:--'}
                  </span>
                  <span style={{ color: `${textColor}80` }}>to</span>
                  <span className="font-medium" style={{ color: textColor }}>
                    {selectedEndTime || '--:--'}
                  </span>
                </div>
              ) : (
                <span
                  className={`font-medium ${
                    selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                      ? 'text-red-600 line-through'
                      : ''
                  }`}
                  style={{ color: selectedTime && !isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) ? textColor : undefined }}
                >
                  {selectedTime || 'Select Time'}
                </span>
              )}
              {selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) && (
                <span className="text-xs ml-2 text-red-600">(Booked)</span>
              )}
            </div>
            <ChevronsUpDown className="w-5 h-5" style={{ color: secondColor }} />
          </div>
        </div>

        {/* Book Button */}
        <button
          className={`flex overflow-hidden text-white font-medium shadow-lg transition-opacity ${
            isBookButtonDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'
          }`}
          style={{ background: secondColor }}
          onClick={handleBookAppointment}
          disabled={isBookButtonDisabled()}
        >
          <div className="flex-1 p-4 flex justify-center items-center">
            {getBookButtonText()}
          </div>
        </button>

      </div>
    </div>

    {/* Modals */}
    <CalendarModal
      show={showCalendarModal}
      onClose={() => setShowCalendarModal(false)}
      selectedDate={selectedDate}
      onDateSelect={(date) => {
        setSelectedDate(date);
        setShowCalendarModal(false);
      }}
      availableDates={bookingData?.available_dates || []}
      unavailableDates={bookingData?.unavailable_dates || []}
      disabledTimes={bookingData?.converted_disabled_times || bookingData?.disabled_times || []}
      availableTimes={bookingData?.available_times || []}
      availableTimesFromAPI={bookingData?.raw_available_times || []}
      unavailableTimes={bookingData?.unavailable_times || []}
      selectedTimeZone={selectedTimezone}
      setSelectedTimezone={setSelectedTimezone}
      workspaceTimezone={bookingData?.workspace_timezone || 'Africa/Cairo'}
      durationCycle={parseInt(bookingData?.duration_cycle) || 15}
      durationPeriod={bookingData?.duration_period || 'minutes'}
      restCycle={parseInt(bookingData?.rest_cycle || 0)}
      themeColor={theme}
    />
    <TimeSelectionModal
      show={showTimeModal}
      onClose={() => setShowTimeModal(false)}
      selectedTime={selectedTime}
      onTimeSelect={setSelectedTime}
      availableTimes={modalDisplayedTimes.length > 0 ? modalDisplayedTimes.map(t => ({ time: t })) : bookingData?.available_times || []}
      unavailableTimes={bookingData?.unavailable_times || []}
      selectedDate={selectedDate}
      disabledTimes={bookingData?.converted_disabled_times || bookingData?.disabled_times || []}
      unavailableDates={bookingData?.unavailable_dates || []}
      requireEndTime={requireEndTime}
      selectedEndTime={selectedEndTime}
      durationCycle={bookingData?.duration_cycle}
      durationPeriod={bookingData?.duration_period}
      setSelectedEndTime={setSelectedEndTime}
      themeColor={theme}
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
      themeColor={theme}
    />
    <BookingFooter theme={theme} textColor={textColor} />
  </div>
);
};

export default AppointmentBooking;