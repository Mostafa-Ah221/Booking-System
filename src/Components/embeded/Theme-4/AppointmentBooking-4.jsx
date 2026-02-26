import { Calendar, Clock, MapPin, User, ChevronRight, UserRound, Package, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import Loader from '../../Loader';
import { useNavigate, useParams } from 'react-router-dom';
import useBookingLogic from '../useBookingLogic';
import { PiBaseballCap, PiUsersThreeLight } from 'react-icons/pi';
import TimeSelectionSection2 from '../Theme-2/time2';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import BookingSummarySidebar2 from '../Theme-2/BookingSummarySidebar2';
import CalendarSection4 from './CalendarSection4';
import { FaXTwitter } from 'react-icons/fa6';

const AppointmentBooking_4 = () => {
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
  
  // ── NEW: Dropdown expansion states ─────────────────────────────────────────
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  
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
    setTheme,
    theme
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

    const dateTimeValue = selectedDate && selectedTime ? `${selectedDate} at ${selectedTime}` : null;
    list.push({
      step: counter++,
      label: 'Date & Time',
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
    (theme?.show_linkedin === "1" && theme?.footer_linkedin);

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
    setExpandedDropdown(null);

    setTimeout(() => {
      setBookingDataLoading(false);
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

  // ── Toggle dropdown ────────────────────────────────────────────────────────
  const toggleDropdown = (key) => {
    setExpandedDropdown(expandedDropdown === key ? null : key);
  };

  // ── Render dropdown box ────────────────────────────────────────────────────
  const renderDropdownBox = (step) => {
    const isExpanded = expandedDropdown === step.key;
    const Icon = step.icon;

    return (
      <div 
        key={step.key}
        className="border overflow-hidden transition-all"
        style={{ 
          borderColor:textColor
          // backgroundColor: 'rgba(0,0,0,0.2)'
        }}
      >
        {/* Dropdown Header */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleDropdown(step.key)}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" style={{ color: textColor }} />
            <div>
              <p className="text-xs opacity-70" style={{ color: textColor }}>
                {step.label}
              </p>
              <p className="font-semibold" style={{ color: textColor }}>
                {step.value || `Select ${step.label}`}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: textColor }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: textColor }} />
          )}
        </div>

        {/* Dropdown Content */}
        {isExpanded && (
          <div className="border-t-2 max-h-80 overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            {step.key === 'interview' && renderInterviewOptions()}
            {step.key === 'staff' && renderStaffOptions()}
            {step.key === 'resource' && renderResourceOptions()}
            {step.key === 'type' && renderTypeOptions()}
          </div>
        )}
      </div>
    );
  };

  // ── Render Interview Options ───────────────────────────────────────────────
  const renderInterviewOptions = () => {
    if (interviewsLoading) {
      return (
        <div className="p-8 text-center">
          <Loader />
        </div>
      );
    }

    if (!interviews || interviews.length === 0) {
      return (
        <div className="p-8 text-center" style={{ color: textColor }}>
          No interviews available
        </div>
      );
    }

    return interviews.map((interview) => (
      <div
        key={interview.id}
        className="p-4 cursor-pointer transition-all hover:bg-black hover:bg-opacity-10 border-b"
        style={{ 
          borderColor: 'rgba(255,255,255,0.1)',
          backgroundColor: selectedInterview?.id === interview.id ? 'rgba(0,0,0,0.2)' : 'transparent'
        }}
        onClick={() => handleInterviewSelect(interview)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center font-semibold"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: textColor
              }}
            >
              {interview.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium truncate max-w-[100px] block" style={{ color: textColor }}>
                {interview.name}
              </p>
              <p className="text-xs opacity-70" style={{ color: textColor }}>
                {interview.duration_cycle} {interview.duration_period}
              </p>
            </div>
          </div>
          {selectedInterview?.id === interview.id && (
            <Check className="w-5 h-5" style={{ color: firstColor }} />
          )}
        </div>
      </div>
    ));
  };

  // ── Render Staff Options ───────────────────────────────────────────────────
  const renderStaffOptions = () => {
    // Staff Groups
    if (availableStaffGroups?.length > 0) {
      return availableStaffGroups.map((group) => (
        <div
          key={group.group_id}
          className="p-4 cursor-pointer transition-all hover:bg-black hover:bg-opacity-10 border-b"
          style={{ 
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: selectedStaffGroup?.group_id === group.group_id ? 'rgba(0,0,0,0.2)' : 'transparent'
          }}
          onClick={() => {
            setSelectedStaffGroup(group);
            setExpandedDropdown(null);
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center font-semibold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: textColor
                }}
              >
                {group.group_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium truncate max-w-[100px] block" style={{ color: textColor }}>
                  {group.group_name}
                </p>
                {group.group_description && (
                  <p className="text-xs opacity-70" style={{ color: textColor }}>
                    {group.group_description}
                  </p>
                )}
              </div>
            </div>
            {selectedStaffGroup?.group_id === group.group_id && (
              <Check className="w-5 h-5" style={{ color: firstColor }} />
            )}
          </div>
        </div>
      ));
    }

    // Individual Staff
    if (availableStaff?.length > 0) {
      return availableStaff.map((staff) => (
        <div
          key={staff.id}
          className="p-4 cursor-pointer transition-all hover:bg-black hover:bg-opacity-10 border-b"
          style={{ 
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: selectedStaff?.id === staff.id ? 'rgba(0,0,0,0.2)' : 'transparent'
          }}
          onClick={() => {
            setSelectedStaff(staff);
            setExpandedDropdown(null);
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {staff?.photo ? (
                <img
                  src={staff.photo}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: textColor
                  }}
                >
                  {staff.name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="font-medium truncate max-w-[100px] block" style={{ color: textColor }}>
                {staff.name}
              </p>
            </div>
            {selectedStaff?.id === staff.id && (
              <Check className="w-5 h-5" style={{ color: firstColor }} />
            )}
          </div>
        </div>
      ));
    }

    return null;
  };

  // ── Render Resource Options ────────────────────────────────────────────────
  const renderResourceOptions = () => {
    if (!availableResources || availableResources.length === 0) return null;

    return availableResources.map((resource) => (
      <div
        key={resource.id}
        className="p-4 cursor-pointer transition-all hover:bg-black hover:bg-opacity-10 border-b"
        style={{ 
          borderColor: 'rgba(255,255,255,0.1)',
          backgroundColor: selectedResource?.id === resource.id ? 'rgba(0,0,0,0.2)' : 'transparent'
        }}
        onClick={() => {
          setSelectedResource(resource);
          setExpandedDropdown(null);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: textColor
              }}
            >
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium truncate max-w-[100px] block" style={{ color: textColor }}>
                {resource.name}
              </p>
              {resource.description && (
                <p className="text-xs opacity-70" style={{ color: textColor }}>
                  {resource.description}
                </p>
              )}
            </div>
          </div>
          {selectedResource?.id === resource.id && (
            <Check className="w-5 h-5" style={{ color: firstColor }} />
          )}
        </div>
      </div>
    ));
  };

  // ── Render Type Options ────────────────────────────────────────────────────
  const renderTypeOptions = () => {
    const types = [
      { value: 'online', label: 'Online' },
      { value: 'inhouse', label: 'In House' },
      { value: 'athome', label: 'At Home' },
    ];

    return types.map((type) => (
      <div
        key={type.value}
        className="p-4 cursor-pointer transition-all hover:bg-black hover:bg-opacity-10 border-b"
        style={{ 
          borderColor: 'rgba(255,255,255,0.1)',
          backgroundColor: selectedType === type.value ? 'rgba(0,0,0,0.2)' : 'transparent'
        }}
        onClick={() => {
          setSelectedType(type.value);
          setExpandedDropdown(null);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center font-semibold"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: textColor
              }}
            >
              {type.value === 'online' ? 'O' : type.value === 'inhouse' ? 'IH' : 'AT'}
            </div>
            <p className="font-medium truncate max-w-[150px] block" style={{ color: textColor }}>
              {type.label}
            </p>
          </div>
          {selectedType === type.value && (
            <Check className="w-5 h-5" style={{ color: firstColor }} />
          )}
        </div>
      </div>
    ));
  };

  // ── Get Date & Time Step ───────────────────────────────────────────────────
  const dateTimeStep = steps.find((s) => s.key === 'datetime');
  const infoStep = steps.find((s) => s.key === 'info');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: secondColor }}>
      <div className="max-w-7xl mx-auto p-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {theme?.show_photo === '1' && theme?.photo && (
              <img src={theme?.photo} className="h-12 w-12 object-cover rounded-lg" alt="Logo" />
            )}
            {theme?.show_nickname === '1' && theme?.nickname && (
              <h1 className="text-xl font-bold" style={{ color: textColor }}>
                {theme?.nickname}
              </h1>
            )}
          </div>
          {theme?.show_page_title === '1' && theme?.page_title && (
            <h2 className="text-2xl font-bold mb-3" style={{ color: textColor }}>
              {theme?.page_title}
            </h2>
          )}
          {theme?.show_page_description === '1' && theme?.page_description && (
            <p className="max-w-2xl mx-auto text-sm" style={{ color: textColor }}>
              {theme?.page_description}
            </p>
          )}
        </div>

        {/* Dropdown Boxes for steps before datetime */}
        <div className=" mb-6">
          {steps
            .filter((s) => s.key !== 'datetime' && s.key !== 'info')
            .map((step) => renderDropdownBox(step))}
        </div>

        {/* Date & Time Step - Always visible */}
        {dateTimeStep && (
          <div className="mb-6">
            <div 
              className=" rounded-lg p-4"
              style={{ 
                // borderColor: selectedDate && selectedTime ? firstColor : 'rgba(255,255,255,0.3)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5" style={{ color: textColor }} />
                <div>
                  <p className="text-xs opacity-70" style={{ color: textColor }}>
                    Date & Time
                  </p>
                  {selectedDate && selectedTime ? (
                    <p className="font-semibold" style={{ color: textColor }}>
                      {selectedDate} | {selectedTime}
                    </p>
                  ) : (
                    <p className="font-semibold" style={{ color: textColor }}>
                      Select Date & Time
                    </p>
                  )}
                </div>
              </div>

              {bookingDataLoading ? (
                <div className="text-center py-16">
                  <Loader />
                  <p className="text-sm mt-4" style={{ color: textColor, opacity: 0.7 }}>
                    Loading available times...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <CalendarSection4
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

                  {/* Time Selection */}
                  <TimeSelectionSection2
                    selectedTime={selectedTime}
                    onTimeSelect={(time) => {
                      setSelectedTime(time);
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* Your Info Step - Show when date & time are selected */}
        {selectedDate && selectedTime && infoStep && (
          <div className="mb-6">
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
         {/* footer */}

         <div className='flex flex-col items-center mt-20 w-full' style={{color: textColor}}>
      {hasAnySocial && (
        <div className='mb-6'>
          <div className='flex gap-1 items-center justify-center flex-wrap'>
             {/* Facebook */}
            {theme?.show_facebook === "1" && theme?.footer_facebook && (
              <>
              <a 
                href={theme.footer_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className='flex items-center gap-2 hover:opacity-70 transition-opacity'
                style={{color: textColor}}
              >
                <Facebook className='w-4 h-4' />
              </a>
              <span>|</span>
              </>
            )}

            {/* Email */}
            {theme?.show_email === "1" && theme?.footer_email && (
              <>
              <a 
                href={`mailto:${theme.footer_email}`}
                className='flex items-center gap-2 hover:opacity-70 transition-opacity'
                style={{color: textColor}}
              >
                <Mail className='w-4 h-4' />
              </a>
              <span>|</span>
              </>
            )}

            {/* Phone */}
            {theme?.show_phone === "1" && theme?.footer_phone && (
              <>
              <a 
                href={`tel:${theme.footer_phone}`}
                className='flex items-center gap-2 hover:opacity-70 transition-opacity'
                style={{color: textColor}}
              >
                <Phone className='w-4 h-4' />
                <span className='text-sm'>{theme.footer_phone}</span>
              </a>
              <span>|</span>
              </>
            )}

           
            {/* X (Twitter) */}
            {theme?.show_x === "1" && theme?.footer_x && (
              <>
              <a 
                href={theme.footer_x}
                target="_blank"
                rel="noopener noreferrer"
                className='flex items-center gap-2 hover:opacity-70 transition-opacity'
                style={{color: textColor}}
              >
                <FaXTwitter className='w-4 h-4' />
              </a>
                 <span>|</span>
              </>
            )}

            {/* Instagram */}
            {theme?.show_instagram === "1" && theme?.footer_instagram && (
              <>
               <a 
                href={theme.footer_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className='flex items-center gap-2 hover:opacity-70 transition-opacity'
                style={{color: textColor}}
              >
                <Instagram className='w-4 h-4' />
              </a>
              <span>|</span>
              </>
             
            )}

            {/* LinkedIn */}
            {theme?.show_linkedin === "1" && theme?.footer_linkedin && (
              <a 
                href={theme.footer_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className='flex items-center gap-2 hover:opacity-70 transition-opacity'
                style={{color: textColor}}
              >
                <Linkedin className='w-4 h-4' />
              </a>
            )}

          </div>
        </div>
      )}
      <div>
          <h2 className='text-sm'>Powered by Appoint Roll</h2>
      </div>
    </div>
      </div>
    
  );
};

export default AppointmentBooking_4;