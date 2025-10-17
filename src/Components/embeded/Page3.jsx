import { Calendar, Clock, MapPin, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import CalendarModal from './calender';
import TimeSelectionModal from './teime';
import BookingSummarySidebar from './BookingSummarySidebar';
import Loader from '../Loader';
import { useNavigate, useParams } from 'react-router-dom';
import TimezoneSelect from 'react-timezone-select';

import useBookingLogic from './useBookingLogic';
import { PiBaseballCap } from 'react-icons/pi';

const Page3 = () => {
  const { id, idAdmin, idCustomer, idSpace } = useParams();
  const navigate = useNavigate();
  const isInterviewMode = !!idCustomer || !!idSpace || !!idAdmin;

  // State for workspaces (only used in idAdmin mode)
  const [workspaces, setWorkspaces] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  const [interviews, setInterviews] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [showInterviewDropdown, setShowInterviewDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [nameProvider, setNameProvider] = useState();
  const isStaff=!!idCustomer


  const getBookingId = () => {
    if (idCustomer && selectedInterview) return selectedInterview.share_link;
    if (idSpace && selectedInterview) return selectedInterview.share_link;
    if (idAdmin && selectedInterview) return selectedInterview.share_link;
    return idCustomer || idSpace || idAdmin || id;
  };
  
  const bookingId = getBookingId();

  const {
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
    isTimeDisabled
  } = useBookingLogic(bookingId, navigate, isInterviewMode, selectedInterview?.id, idCustomer || idSpace || idAdmin,isStaff);

  // Fetch data based on mode
useEffect(() => {
  if (idAdmin) {
    fetchWorkspaces();
  } else if (idSpace) {
    fetchInterviews(idSpace, 'workspace'); 
  } else if (idCustomer) {
    fetchInterviews(idCustomer, 'customer');
  }
}, [idAdmin, idSpace, idCustomer]);

useEffect(() => {
  if (idAdmin && selectedWorkspace && selectedWorkspace.share_link) {
    fetchInterviews(selectedWorkspace.share_link, 'workspace');
  }
}, [selectedWorkspace, idAdmin]);
  // Fetch workspaces for idAdmin mode
  const fetchWorkspaces = async () => {
    setWorkspacesLoading(true);
    try {
      const response = await fetch(`https://backend-booking.appointroll.com/api/public/book/resource?customer_share_link=${idAdmin}`);
      const data = await response.json();
      
      console.log('Workspaces API Response:', data);
      
      if (data.data && data?.data?.workspaces) {
        setWorkspaces(data?.data?.workspaces);
        setNameProvider(data?.data?.workspaces[0]?.customer_name)
      } else {
        console.log('No workspaces found in response');
        setWorkspaces([]);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      setWorkspaces([]);
    } finally {
      setWorkspacesLoading(false);
    }
  };
console.log(nameProvider);

  // Fetch interviews
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
    const data = await response.json();
    
    console.log('Interviews API Response:', data);
    
    let interviewsData = [];
    
    if (idSpace) {
      interviewsData = data?.data?.workspace_interviews || [];
       setNameProvider(data?.data?.workspace_interviews[0]?.customer_name)
    } else if (idAdmin && selectedWorkspace) {
      interviewsData = data?.data?.workspace_interviews || [];
      setNameProvider(data?.data?.workspace_interviews[0]?.customer_name)
    } else if (idCustomer) {
      interviewsData = data?.data?.staff_interviews || [];
      setNameProvider(data?.data?.staff_interviews[0]?.customer_name)
    }
   
    setInterviews(interviewsData);
    console.log('Interviews set:', interviewsData);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    setInterviews([]);
  } finally {
    setInterviewsLoading(false);
  }
};

  const handlePhoneCodeChange = (code) => {
    setFormData({ ...formData, code_phone: code });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowWorkspaceDropdown(false);
    // Reset interview selection when workspace changes
    setSelectedInterview(null);
    setInterviews(null);
  };

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setShowInterviewDropdown(false);
  };

  // if (loading || (isInterviewMode && (interviewsLoading || workspacesLoading))) {
  //   return (
  //     <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
  //       <div className="text-lg"><Loader /></div>
  //     </div>
  //   );
  // }

const isBookButtonDisabled = () => {
  if (idAdmin && !selectedWorkspace) return true;
  if (idAdmin && !selectedInterview) return true;
  if ((idSpace || idCustomer) && !selectedInterview) return true;
  if (availableStaff && availableStaff.length > 0 && !selectedStaff) return true;
  if (!selectedDate || !selectedTime) return true;
  if (isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)) return true;
  
  return false;
};

const getBookButtonText = () => {
  
  if (idAdmin && !selectedWorkspace) return 'Select Workspace';
  
  if (idAdmin && !selectedInterview) return 'Select Interview';
  if ((idSpace || idCustomer) && !selectedInterview) return 'Select Interview';
  
  if (availableStaff && availableStaff.length > 0 && !selectedStaff) return 'Select Staff';
  
  if (!selectedDate || !selectedTime) return 'Select Date & Time';
  if (isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)) return 'Time Not Available';
  
  return 'Book Appointment';
};
  return (
    <div className="min-h-screen bg-gray-100 !text-sm">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              xmlSpace="preserve"
              width={37}
            >
              <path
                fill="#226DB4"
                d="M995.8,249.6c-16.5-39.1-40.2-74.3-70.4-104.5S860,91.3,820.9,74.7c-13-5.5-26.3-10.1-39.8-13.9V32.9  c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9v17.2c-9.4-0.8-18.9-1.2-28.4-1.2h-301c-16.5,0-29.9,13.4-29.9,29.9  c0,16.5,13.4,29.9,29.9,29.9H693c9.6,0,19,0.5,28.4,1.5v15.3c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9v-2  c37.9,13.1,72.7,34.8,102,64c50.8,50.8,78.8,118.3,78.8,190.1v315.4c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8  h-73c-16.5,0-29.9,13.4-29.9,29.9s13.4,29.9,29.9,29.9h73c44.4,0,87.4-8.7,127.9-25.8c39.1-16.5,74.3-40.2,104.5-70.4  s53.9-65.3,70.4-104.5c17.2-40.5,25.8-83.6,25.8-127.9V377.5C1021.6,333.2,1012.9,290.1,995.8,249.6z"
              />
              <path
                fill="#226DB4"
                d="M659.6,692.6c0-44.4-8.7-87.4-25.8-127.9c-11.1-26.2-25.4-50.7-42.7-73l-43.9,40.9c34.2,46,52.7,101.6,52.7,160  c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8s-139.3-28-190.1-78.8c-50.8-50.8-78.8-118.3-78.8-190.1  s28-139.3,78.8-190.1c50.8-50.8,118.3-78.8,190.1-78.8c65.1,0,126.7,23,175.4,65.1l43.9-40.9c-27.1-24.4-57.8-43.9-91.4-58.1  c-40.5-17.2-83.6-25.8-127.9-25.8s-87.4,8.7-127.9,25.8c-39.1,16.5-74.3,40.2-104.5,70.4c-13.5,13.5-25.7,28-36.5,43.3v-126  c0-62.6,22-123.5,61.8-171.6c31.4-37.9,72.7-66.4,118.6-82.4v1.2c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9V84.9  c0-0.1,0-0.3,0-0.4V32.3c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9V61c-64,17.9-121.8,55.2-164.6,106.8  c-23.9,28.9-42.6,61.3-55.5,96.3C9.1,300.4,2.4,338.5,2.4,377.5v315.4c0,44.4,8.7,87.4,25.8,127.9c16.5,39.1,40.2,74.3,70.4,104.5  c30.2,30.2,65.3,53.9,104.5,70.4c40.5,17.2,83.6,25.8,127.9,25.8c1.6,0,3.2-0.1,4.8-0.4c42.6-0.6,84-9.2,123.1-25.8  c39.1-16.5,74.3-40.2,104.5-70.4s53.9-65.3,70.4-104.5C651,780,659.6,736.9,659.6,692.6z"
              />
              <path
                fill="#089949"
                d="M332.4,650.7l-76.3-81.4c-11.3-12-30.2-12.7-42.2-1.4c-12,11.3-12.6,30.2-1.4,42.2l96.6,103.1  c5.9,6.3,13.8,9.5,21.8,9.5c7.3,0,14.6-2.7,20.3-8l195.8-182.3l43.9-40.9l56.8-52.9c12.1-11.2,12.8-30.2,1.5-42.2  c-11.2-12.1-30.1-12.8-42.2-1.5l-56.8,52.9l-43.9,40.9L332.4,650.7z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">
              Book Your Appointment
            </h1>
          </div>
          <p className="text-gray-600 text-[16px]">
            Book your appointment in a few simple steps: Choose {isInterviewMode ? 'an interview' : 'a service'}, pick your date and time, and fill in your details. See you soon!
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Booking: {bookingData?.name || 'Loading...'}
          </div>
        </div>

        {/* Booking Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center h-full">
              <div className="w-full flex justify-between items-center">
                <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-800 ">
                  {nameProvider || bookingData?.provider_name ||  'Provider'}
                </h3>
                <span></span>
              </div>
            </div>
          </div>

          {/* Workspace Card (only for idAdmin mode) */}
          {idAdmin && (
            <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}>
                <div className="flex items-center">
                  <PiBaseballCap className="w-5 h-5 mr-3 text-gray-600" />
                  <h3 className="font-semibold text-gray-800 max-w-[135px] truncate" title={selectedWorkspace ? selectedWorkspace.name : 'Select Workspace...'}>
                    {selectedWorkspace ? selectedWorkspace.name : 'Select Workspace...'}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${
                    showWorkspaceDropdown ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {showWorkspaceDropdown && (
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
                          <span className="text-gray-800">{workspace.name}</span>
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
            <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => {
                // Don't allow opening if in idAdmin mode and no workspace selected
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
                      (
                      {bookingData?.duration}
                      {bookingData?.price && bookingData?.price > 0
                        ? ` | ${bookingData.price} ${bookingData.currency}`
                        : ""}
                      )
                    </p>
                  )}

                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${
                    showInterviewDropdown ? 'rotate-180' : ''
                  } ${idAdmin && !selectedWorkspace ? 'opacity-50' : ''}`}
                />
              </div>
              {showInterviewDropdown && !(idAdmin && !selectedWorkspace) && (
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
                          <span className="text-gray-800">{interview.name}</span>
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
                  <h3 className="font-semibold text-gray-800 ">
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
          {availableStaff && availableStaff.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between h-full" onClick={() => setShowStaffDropdown(!showStaffDropdown)}>
                <div className="flex items-center">
                  {typeof selectedStaff?.photo === 'string' && selectedStaff.photo.trim() !== '' ? (
                    <img
                      src={selectedStaff.photo}
                      alt="Staff"
                      className="w-11 h-11 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <User className="w-5 h-5 mr-3 text-gray-600" />
                  )}
                  <h3 className="font-semibold text-gray-800 max-w-[135px] truncate">
                    {selectedStaff ? selectedStaff.name : 'Select Staff...'}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${
                    showStaffDropdown ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {showStaffDropdown && (
                <div className="relative">
                  <div className="absolute top-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    {availableStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setSelectedStaff(staff);
                          setShowStaffDropdown(false);
                        }}
                      >
                        <div className="flex items-center">
                          {typeof staff?.photo === 'string' && staff?.photo.trim() !== ''? (
                            <img
                              src={staff.photo}
                              alt={staff.name}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <User className="w-4 h-4 text-gray-600 mr-3" />
                          )}
                          <span className="text-gray-800">{staff.name}</span>
                        </div>
                      </div>
                    ))}
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
              <MapPin className="h-5 text-gray-600 mr-14  text-left" />
              <div className="flex-1 min-w-0">
                <TimezoneSelect
                  value={selectedTimezone}
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
            className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center ${
              selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                ? 'border-2 border-red-300 bg-red-50'
                : ''
            }`}
            onClick={() => setShowTimeModal(true)}
          >
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Time</h3>
            </div>
            <div
              className={`text-[15px] font-semibold ${
                selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                  ? 'text-red-600 line-through'
                  : 'text-gray-800'
              }`}
            >
              {selectedTime || 'Select Time'}
              {selectedTime &&
                isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) && (
                  <span className="text-xs text-red-500 ml-2 font-normal">(Booked)</span>
                )}
            </div>
            <span></span>
          </div>

          {/* Book Button */}
          <div className="bg-white rounded-lg shadow-sm p flex items-center justify-center ">
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
      />
    </div>
  );
};

export default Page3;