import { Calendar, Clock, MapPin, User, ChevronRight, UserRound, Package, Check, ChevronDown } from 'lucide-react';
import logo_icon from '../../../assets/image/logo_icon.png';
import { useState, useEffect, useRef, useMemo } from 'react';
import Loader from '../../Loader';
import { useNavigate, useParams } from 'react-router-dom';
import TimezoneSelect from 'react-timezone-select';
import useBookingLogic from '../useBookingLogic';
import { PiBaseballCap, PiUsersThreeLight } from 'react-icons/pi';
import BookingSummarySidebar2 from './BookingSummarySidebar2';
import CalendarSection2 from './calender2';
import TimeSelectionSection2 from './time2';

import BookingFooter from '../BookingFooter';

const AppointmentBooking2 = () => {
  const { id, idAdmin, idCustomer, idSpace } = useParams();
  const navigate = useNavigate();
  const isInterviewMode = !!idCustomer || !!idSpace || !!idAdmin;

  // ── States ─────────────────────────────────────────────────────────────────────
  const [workspaces, setWorkspaces] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [interviews, setInterviews] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [nameProvider, setNameProvider] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingDataLoading, setBookingDataLoading] = useState(false);
   const [theme, setTheme] = useState(null);
  // ── Refs (dropdowns) ───────────────────────────────────────────────────────
  const staffDropdownRef = useRef(null);
  const staffGroupDropdownRef = useRef(null);
  const resourceDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);
// colors theme
 const colors = theme?.colors ? JSON.parse(theme.colors) : {};
  const primary = colors?.primary || "";
  const [firstColor, secondColor] = primary.split("-");
  const textColor = colors?.text_color;

  // ── Click-outside for dropdowns ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (staffDropdownRef.current && !staffDropdownRef.current.contains(e.target)) setShowStaffDropdown?.(false);
      if (staffGroupDropdownRef.current && !staffGroupDropdownRef.current.contains(e.target)) setShowStaffGroupDropdown?.(false);
      if (resourceDropdownRef.current && !resourceDropdownRef.current.contains(e.target)) setShowResourceDropdown?.(false);
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) setShowTypeDropdown?.(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Dynamic bookingId ───────────────────────────────────────────────────────
  const bookingId = useMemo(() => {
    if (selectedInterview) return selectedInterview.share_link;
    return idCustomer || idSpace || idAdmin || id;
  }, [selectedInterview, idCustomer, idSpace, idAdmin, id]);
console.log(theme);

  // ── useBookingLogic ────────────────────────────────────────────────────────
  const {
    availableResources,
    selectedResource,
    setSelectedResource,
    availableStaffGroups,
    selectedStaffGroup,
    setSelectedStaffGroup,
    availableStaff,
    selectedStaff,
    setSelectedStaff,
    bookingData,
    selectedDate,
    selectedTime,
    selectedTimezone,
    formData,
    isBooking,
    setSelectedDate,
    setSelectedTime,
    setSelectedTimezone,
    setFormData,
    handleScheduleAppointment,
    isTimeDisabled,
    selectedType,
    setSelectedType,
    totalPrice,
    numberOfSlots,
    selectedEndTime,
    setSelectedEndTime
  } = useBookingLogic(
    bookingId,
    navigate,
    isInterviewMode,
    selectedInterview?.id,
    idCustomer || idSpace || idAdmin,
    !!idCustomer,
    setTheme,theme
  );

  // ── Build steps dynamically (with unique key) ───────────────────────────────
  const steps = useMemo(() => {
    const list = [];
    let counter = 1;

    if (isInterviewMode) {
      list.push({
        step: counter++,
        label: 'Interview',
        icon: PiBaseballCap,
        value: selectedInterview?.name,
        key: 'interview',
      });
    }

    const hasStaff = availableStaff?.length > 0 || availableStaffGroups?.length > 0;
    if (hasStaff) {
      list.push({
        step: counter++,
        label: availableStaffGroups?.length > 0 ? 'Staff Group' : 'Staff',
        icon: availableStaffGroups?.length > 0 ? PiUsersThreeLight : UserRound,
        value: selectedStaffGroup?.group_name || selectedStaff?.name,
        key: 'staff',
      });
    }

    if (availableResources?.length > 0) {
      list.push({
        step: counter++,
        label: 'Resource',
        icon: Package,
        value: selectedResource?.name,
        key: 'resource',
      });
    }

    if (bookingData?.mode === 'online/inperson') {
      list.push({
        step: counter++,
        label: 'Type',
        icon: MapPin,
        value: selectedType
          ? selectedType === 'online'
            ? 'Online'
            : selectedType === 'inhouse'
            ? 'In House'
            : 'At Home'
          : null,
        key: 'type',
      });
    }

    const dateTimeValue = selectedDate && selectedTime ? `${selectedDate}, ${selectedTime}` : null;
    list.push({
      step: counter++,
      label: 'Date, Time & Recruiter',
      icon: Calendar,
      value: dateTimeValue,
      key: 'datetime',
    });

    list.push({
      step: counter++,
      label: 'Your Info',
      icon: User,
      value: null,
      key: 'info',
    });

    return list;
  }, [
    isInterviewMode,
    selectedInterview,
    availableStaff,
    availableStaffGroups,
    selectedStaff,
    selectedStaffGroup,
    availableResources,
    selectedResource,
    bookingData?.mode,
    selectedType,
    selectedDate,
    selectedTime,
  ]);
const hasAnySocial = 
    (theme?.show_email === "1" && theme?.footer_email) ||
    (theme?.show_phone === "1" && theme?.footer_phone) ||
    (theme?.show_facebook === "1" && theme?.footer_facebook) ||
    (theme?.show_x === "1" && theme?.footer_x) ||
    (theme?.show_instagram === "1" && theme?.footer_instagram) ||
    (theme?.show_linkedin === "1" && theme?.footer_linkedin) ||
    (theme?.show_tiktok === "1" && theme?.footer_tiktok) ||
    (theme?.show_snapchat === "1" && theme?.footer_snapchat) 
  // ── Auto-select single items ───────────────────────────────────────────────
  useEffect(() => {
    if (availableStaff?.length === 1 && !selectedStaff) {
      setSelectedStaff(availableStaff[0]);
      setSelectedDate(null);
      setSelectedTime(null);
    }
    if (availableStaffGroups?.length === 1 && !selectedStaffGroup) {
      setSelectedStaffGroup(availableStaffGroups[0]);
      setSelectedDate(null);
      setSelectedTime(null);
    }
    if (availableResources?.length === 1 && !selectedResource) {
      setSelectedResource(availableResources[0]);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [availableStaff, availableStaffGroups, availableResources]);

  // ── Load workspaces / interviews ───────────────────────────────────────────
  useEffect(() => {
    if (idAdmin) fetchWorkspaces();
    else if (idSpace) fetchInterviews(idSpace, 'workspace');
    else if (idCustomer) fetchInterviews(idCustomer, 'customer');
  }, [idAdmin, idSpace, idCustomer]);

  useEffect(() => {
    if (idAdmin && selectedWorkspace?.share_link) fetchInterviews(selectedWorkspace.share_link, 'workspace');
  }, [selectedWorkspace, idAdmin]);

  const fetchWorkspaces = async () => {
    setWorkspacesLoading(true);
    try {
      const res = await fetch(`https://backend-booking.appointroll.com/api/public/book/resource?customer_share_link=${idAdmin}`);
      const data = await res.json();
      if (data.data?.workspaces) {
        if (data.data?.theme && !theme) {  
            setTheme(data.data.theme);
          }
        setWorkspaces(data.data.workspaces);
        setNameProvider(data.data.workspaces[0]?.customer_name);
      }
    } catch (e) {
      console.error(e);
      setWorkspaces([]);
    } finally {
      setWorkspacesLoading(false);
    }
  };

  const fetchInterviews = async (resourceId, mode) => {
    setInterviewsLoading(true);
    try {
      const url = mode === 'customer'
        ? `https://backend-booking.appointroll.com/api/public/book/resource?staff_share_link=${resourceId}`
        : `https://backend-booking.appointroll.com/api/public/book/resource?workspace_share_link=${resourceId}`;
      const res = await fetch(url);
      const data = await res.json();

      let interviewsData = [];
      if (idSpace || (idAdmin && selectedWorkspace)) {
        interviewsData = data?.data?.workspace_interviews || [];
        if (data.data?.theme && !theme) {  
            setTheme(data.data.theme);
          }
        setNameProvider(data?.data?.workspace_interviews?.[0]?.customer_name);
      } else if (idCustomer) {
        interviewsData = data?.data?.staff_interviews || [];
        setNameProvider(data?.data?.staff_interviews?.[0]?.customer_name);
      }
      setInterviews(interviewsData);
    } catch (e) {
      console.error(e);
      setInterviews([]);
    } finally {
      setInterviewsLoading(false);
    }
  };

  // ── Interview selection → reload bookingData → move to next step ─────────────
  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingDataLoading(true);

    setTimeout(() => {
      setBookingDataLoading(false);
      const next = steps.find((s) => s.step > 1);
      // if (next) setCurrentStep(next.step);
    }, 250);
  };

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const goToNextStep = () => {
    const next = steps.find((s) => s.step > currentStep);
    if (next && canGoToStep(next.step)) {
      setCurrentStep(next.step);
    }
  };

  const canGoToStep = (targetStep) => {
    if (targetStep === currentStep) return true;

    const targetIdx = steps.findIndex((s) => s.step === targetStep);
    if (targetIdx === -1) return false;

    const previousSteps = steps.slice(0, targetIdx);
    return previousSteps.every((s) => s.value !== null && s.value !== undefined);
  };

  const handleStepClick = (step) => {
    if (canGoToStep(step)) {
      setCurrentStep(step);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen "style={{ background: firstColor }}>
      <div className="max-w-7xl mx-auto p-6 py-8" >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-start gap-3 mb-4">
            {theme?.show_photo === '1' && theme?.photo && (
              <img src={theme?.photo} className="h-12 w-12 object-cover rounded-lg" alt="Logo" />
            )}
             {theme?.show_nickname === '1' && theme?.nickname && (
            <h1 className="text-xl font-bold " style={{ color: textColor }}>
              {theme?.nickname }
            </h1>
             )}
          </div>
          {theme?.show_page_title === '1' && theme?.page_title && (
            <h2 className="text-2xl font-bold  mb-3" style={{ color: textColor }} >{theme?.page_title } </h2>
          )}
           {theme?.show_page_description === '1' && (() => {
              const interviewStep = steps.find((s) => s.key === 'interview')?.step;
              const showInterviewDesc = interviewStep && currentStep >= interviewStep && selectedInterview?.page_description;
              const description = showInterviewDesc ? selectedInterview.page_description : theme?.page_description;
              
              return description && (
                <p className="text-sm mb-4 text-center" style={{color:textColor}}>
                  {description}
                </p>
              );
            })()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Sidebar – Steps ── */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {steps.map((s) => {
                const isCompleted = s.value !== null && s.value !== undefined;
                const isActive = currentStep === s.step;
                const isClickable = canGoToStep(s.step);

                return (
                  <div
                      key={s.key}
                      className={`p-5 transition-all shadow-sm ${
                        isActive ? '' : 'border-transparent'
                      } ${!isClickable ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
                      style={isActive ? { background: secondColor } : {}}
                      onClick={() => isClickable && handleStepClick(s.step)}
                    >

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <s.icon className={`w-5 h-5 ${s.label === 'Staff Group' ? 'w-6 h-6' : ''}`} style={{color:textColor}} />
                        <div>
                          <h3 className="font-medium text-sm truncate block max-w-[150px]" style={{color:textColor}}>
                            {s.label}
                          </h3>
                          {s.value && (
                            <p className="text-xs  mt-1" style={{color:textColor}}>{s.value}</p>
                          )}
                        </div>
                      </div>
                      {s.key !== 'datetime' && <ChevronDown className="w-5 h-5" style={{color:textColor}}/>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-2">
            {/* Step 1 – Interview */}
            {currentStep === steps.find((s) => s.key === 'interview')?.step && isInterviewMode && (
              <div className="space-y-4">
                {interviewsLoading ? (
                  <div className="text-center py-12"><Loader /></div>
                ) : interviews?.length > 0 ? (
                  interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className={`group   p-5 cursor-pointer transition-all hover:shadow-sm ${
                        selectedInterview?.id === interview.id
                          ? `'hover:shadow-sm `
                          : 'border-gray-400 border-opacity-40 border'
                      }`}
                      style={{
                          // borderColor: selectedInterview?.id === interview.id ? textColor : undefined,
                          hoverBorderColor: selectedInterview?.id === interview.id ? textColor : undefined,
                          background: selectedInterview?.id === interview.id ? secondColor : undefined,
                        }}
                      onClick={() => handleInterviewSelect(interview)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-sm flex border items-center justify-center font-semibold  `}
                             style={{
                          background: selectedInterview?.id === interview.id ? secondColor : 'rgba(0, 0, 0, 0.15)',
                          borderColor: selectedInterview?.id === interview.id ? textColor : 'transparent',
                          color: selectedInterview?.id === interview.id ? textColor : textColor,
                        }}
                          >
                            {interview.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold truncate  max-w-[150px]" style={{color:textColor}}>{interview.name}</h3>
                            <p className="text-sm text-gray-500" style={{color:textColor}}>
                              {interview.duration_cycle} {interview.duration_period}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedInterview?.id === interview.id && <Check className="w-5 h-5 " style={{color:textColor}}/>}
                          <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">No interviews available</div>
                )}
              </div>
            )}

            {/* Step 2 – Staff / StaffGroup */}
           {currentStep === steps.find((s) => s.key === 'staff')?.step && (
  <div className="space-y-4">

    {availableStaffGroups?.length > 0 && (
      <div className="space-y-4">
        <h3 className="font-semibold " style={{ color: textColor }}>Staff Groups</h3>

        {availableStaffGroups.map((group) => (
          <div
            key={group.group_id}
            className={`group p-5 cursor-pointer transition-all hover:shadow-sm ${
              selectedStaffGroup?.group_id === group.group_id
                ? ""
                : "border border-gray-400 border-opacity-40"
            }`}
            style={{
              background:
                selectedStaffGroup?.group_id === group.group_id
                  ? secondColor
                  : undefined,
              borderColor:
                selectedStaffGroup?.group_id === group.group_id
                  ? textColor
                  : undefined,
            }}
            onClick={() => {
              setSelectedStaffGroup(group);
              // goToNextStep();
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center font-semibold border"
                  style={{
                    background:
                      selectedStaffGroup?.group_id === group.group_id
                        ? secondColor
                        : "rgba(0,0,0,0.15)",
                    borderColor:
                      selectedStaffGroup?.group_id === group.group_id
                        ? textColor
                        : "transparent",
                    color: textColor,
                  }}
                >
                  {group.group_name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold" style={{ color: textColor }}>
                    {group.group_name}
                  </h3>
                  {group.group_description && (
                    <p className="text-sm opacity-80" style={{ color: textColor }}>
                      {group.group_description}
                    </p>
                  )}
                  <p className="text-xs opacity-70" style={{ color: textColor }}>
                    {group.staff.length} staff member
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedStaffGroup?.group_id === group.group_id && (
                  <Check className="w-5 h-5" style={{ color: textColor }} />
                )}
                <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Staff Members */}
    {!availableStaffGroups?.length && availableStaff?.length > 0 && (
      <div className="space-y-4">
        <h3 className="font-semibold" style={{ color: textColor }}>Staff Members</h3>

        {availableStaff.map((staff) => (
          <div
            key={staff.id}
            className={`group p-5 cursor-pointer transition-all hover:shadow-sm ${
              selectedStaff?.id === staff.id
                ? ""
                : "border border-gray-400 border-opacity-40"
            }`}
            style={{
              background:
                selectedStaff?.id === staff.id
                  ? secondColor
                  : undefined,
              borderColor:
                selectedStaff?.id === staff.id
                  ? textColor
                  : undefined,
            }}
            onClick={() => {
              setSelectedStaff(staff);
              // goToNextStep();
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {staff?.photo ? (
                  <img
                    src={staff.photo}
                    className="w-12 h-12 rounded-full object-cover border"
                    style={{
                      borderColor:
                        selectedStaff?.id === staff.id ? textColor : "transparent",
                    }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-sm flex items-center justify-center font-semibold border"
                    style={{
                      background:
                        selectedStaff?.id === staff.id
                          ? secondColor
                          : "rgba(0,0,0,0.15)",
                      borderColor:
                        selectedStaff?.id === staff.id ? textColor : "transparent",
                      color: textColor,
                    }}
                  >
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <h3 className="font-semibold truncate  max-w-[150px]" style={{ color: textColor }}>
                  {staff.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {selectedStaff?.id === staff.id && (
                  <Check className="w-5 h-5" style={{ color: textColor }} />
                )}
                <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
      </div>
    )}


            {/* Step 3 – Resource */}
           {currentStep === steps.find((s) => s.key === "resource")?.step &&
              availableResources?.length > 0 && (
                <div className="space-y-4">
                  {availableResources.map((resource) => (
                    <div
                      key={resource.id}
                      className={`group p-5 cursor-pointer transition-all hover:shadow-sm ${
                        selectedResource?.id === resource.id
                          ? ""
                          : "border border-gray-400 border-opacity-40"
                      }`}
                      style={{
                        background:
                          selectedResource?.id === resource.id
                            ? secondColor
                            : undefined,
                        borderColor:
                          selectedResource?.id === resource.id ? textColor : undefined,
                      }}
                      onClick={() => {
                        setSelectedResource(resource);
                        // goToNextStep();
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-sm flex items-center justify-center font-semibold border"
                            style={{
                              background:
                                selectedResource?.id === resource.id
                                  ? secondColor
                                  : "rgba(0,0,0,0.15)",
                              borderColor:
                                selectedResource?.id === resource.id
                                  ? textColor
                                  : "transparent",
                              color: textColor,
                            }}
                          >
                            <Package className="w-6 h-6" />
                          </div>

                          <div>
                            <h3 className="font-semibold truncate  max-w-[150px]" style={{ color: textColor }}>
                              {resource.name}
                            </h3>

                            {resource.description && (
                              <p
                                className="text-sm opacity-80"
                                style={{ color: textColor }}
                              >
                                {resource.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {selectedResource?.id === resource.id && (
                            <Check className="w-5 h-5" style={{ color: textColor }} />
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}


            {/* Step 4 – Type */}
           {currentStep === steps.find((s) => s.key === "type")?.step &&
  bookingData?.mode === "online/inperson" && (
    <div className="space-y-4">
      {[
        { value: "online", label: "Online" },
        { value: "inhouse", label: "In House" },
        { value: "athome", label: "At Home" },
      ].map((type) => (
        <div
          key={type.value}
          className={`group p-5 cursor-pointer transition-all hover:shadow-sm ${
            selectedType === type.value
              ? ""
              : "border border-gray-400 border-opacity-40"
          }`}
          style={{
            background:
              selectedType === type.value
                ? secondColor
                : undefined,
            borderColor:
              selectedType === type.value ? textColor : undefined,
          }}
          onClick={() => {
            setSelectedType(type.value);
            // goToNextStep();
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center font-semibold text-lg border"
                style={{
                  background:
                    selectedType === type.value
                      ? secondColor
                      : "rgba(0,0,0,0.15)",
                  borderColor:
                    selectedType === type.value
                      ? textColor
                      : "transparent",
                  color: textColor,
                }}
              >
                {type.value === "online"
                  ? "O"
                  : type.value === "inhouse"
                  ? "IH"
                  : "AT"}
              </div>

              <h3 className="font-semibold" style={{ color: textColor }}>
                {type.label}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {selectedType === type.value && (
                <Check className="w-5 h-5" style={{ color: textColor }} />
              )}
              <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )}


            {/* Step 5 – Date & Time */}
            {currentStep === steps.find((s) => s.key === 'datetime')?.step && (
              <div className="space-y-6">
                {bookingDataLoading ? (
                  <div className="text-center py-16">
                    <Loader />
                    <p className="text-sm text-gray-500 mt-4">Loading available times...</p>
                  </div>
                ) : (
                  <>
                    {/* <p className="text-sm text-gray-600 mb-4">
                      Your appointment will be booked with {nameProvider || bookingData?.provider_name}
                    </p> */}

                    

                     <CalendarSection2
                        selectedDate={selectedDate}
                        onDateSelect={(date) => {
                          setSelectedDate(date);
                        }}
                        availableDates={bookingData?.available_dates || []}
                        availableTimes={bookingData?.available_times || []}
                        availableTimesFromAPI={bookingData?.raw_available_times || []}
                        unavailableDates={bookingData?.unavailable_dates || []}
                        unavailableTimes={bookingData?.unavailable_times || []}
                        disabledTimes={bookingData?.converted_disabled_times || bookingData?.disabled_times || []}
                        durationCycle={parseInt(bookingData?.duration_cycle) || 15}
                        durationPeriod={bookingData?.duration_period || "minutes"}
                        restCycle={parseInt(bookingData?.rest_cycle) || 0}
                        setSelectedTimezone={setSelectedTimezone}
                        selectedTimeZone={selectedTimezone}
                        themeColor={theme?.colors}
                        workspaceTimezone={bookingData?.workspace_timezone || 'Africa/Cairo'}
                      />

        {/*  */}
        <TimeSelectionSection2
          selectedTime={selectedTime}
          onTimeSelect={(time) => {
            setSelectedTime(time);
            // if (selectedDate) goToNextStep();
          }}
          availableTimes={bookingData?.available_times || []}
          availableTimesFromAPI={bookingData?.raw_available_times || []}
          selectedDate={selectedDate}
          disabledTimes={bookingData?.converted_disabled_times || bookingData?.disabled_times || []}
          unavailableTimes={bookingData?.unavailable_times || []}
          unavailableDates={bookingData?.unavailable_dates || []}
          requireEndTime={bookingData?.require_end_time}
          selectedEndTime={selectedEndTime}
          durationCycle={parseInt(bookingData?.duration_cycle) || 0}
          durationPeriod={bookingData?.duration_period || 'minutes'}
          restCycle={parseInt(bookingData?.rest_cycle) || 0}
          setSelectedEndTime={setSelectedEndTime}
          themeColor={theme?.colors}
        />
                  </>
                )}
              </div>
            )}

            {/* Step 6 – Your Info */}
            {currentStep === steps.find((s) => s.key === 'info')?.step && (
              <div className="space-y-6">
                {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h2> */}
                <BookingSummarySidebar2
                  bookingData={isInterviewMode ? { ...bookingData, selectedInterview } : bookingData}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  selectedTimezone={selectedTimezone}
                  formData={formData}
                  onFormChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
                  onPhoneCodeChange={(code) => setFormData((prev) => ({ ...prev, code_phone: code }))}
                  onScheduleAppointment={handleScheduleAppointment}
                  isBooking={isBooking}
                  selectedType={selectedType}
                  totalPrice={totalPrice}
                  numberOfSlots={numberOfSlots}
                  themeColor={theme?.colors}
                />
              </div>
            )}
          </div>
         

        </div>
         {/* footer */}
{/* footer */}
<BookingFooter theme={theme} textColor={textColor} />
      </div>
    </div>
  );
};

export default AppointmentBooking2;