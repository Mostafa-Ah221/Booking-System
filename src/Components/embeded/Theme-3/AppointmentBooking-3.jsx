import { Calendar, Clock, MapPin, User, ChevronRight, UserRound, Package, Check, Building2 } from 'lucide-react';
import logo_icon from '../../../assets/image/logo_icon.png';
import { useState, useEffect, useRef, useMemo } from 'react';
import Loader from '../../Loader';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import useBookingLogic from '../useBookingLogic';
import { PiBaseballCap, PiUsersThreeLight } from 'react-icons/pi';
import BookingSummarySidebar2 from '../Theme-2/BookingSummarySidebar2';
import CalendarSection2 from '../Theme-2/calender2';
import TimeSelectionSection2 from '../Theme-2/time2';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { FaUserTie } from 'react-icons/fa';

const AppointmentBooking_3 = () => {
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
  console.log(theme);
  
  const textColor = colors?.text_color;
useEffect(() => {
  if (selectedTimezone) return;

  let detected = null;

  try {
    detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected && detected.includes('/')) {
      setSelectedTimezone(detected);
      return;
    }
  } catch (e) {}

  try {
    detected = moment.tz.guess();
    if (detected) {
      setSelectedTimezone(detected);
    }
  } catch (e) {
    console.log('Timezone auto-detection failed');
  }
}, []); 


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
    !!idCustomer
  );

  // ── Build steps dynamically (with unique key) ───────────────────────────────
  const steps = useMemo(() => {
    const list = [];
    let counter = 1;

    // Add Workspace step if idAdmin and workspaces exist
    if (idAdmin && workspaces?.length > 0) {
      list.push({
        step: counter++,
        label: 'Workspace',
        icon: Building2,
        value: selectedWorkspace?.name,
        key: 'workspace',
      });
    }

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
    idAdmin,
    workspaces,
    selectedWorkspace,
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
    if (availableStaff?.length === 1 && !selectedStaff) setSelectedStaff(availableStaff[0]);
    if (availableStaffGroups?.length === 1 && !selectedStaffGroup) setSelectedStaffGroup(availableStaffGroups[0]);
    if (availableResources?.length === 1 && !selectedResource) setSelectedResource(availableResources[0]);
  }, [availableStaff, availableStaffGroups, availableResources, selectedStaff, selectedStaffGroup, selectedResource]);

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
        setWorkspaces(data.data.workspaces);
        setNameProvider(data.data.workspaces[0]?.customer_name);
        // Set theme from workspaces data
        if (data.data?.theme && !theme) {  
            setTheme(data.data.theme);
          }
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
         if (data.data?.theme && !theme) {  
            setTheme(data.data.theme);
          }
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

  // ── Workspace selection → load interviews → move to next step ─────────────
  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setSelectedInterview(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // ── Interview selection → reload bookingData → move to next step ─────────────
  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingDataLoading(true);

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

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" >
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* LEFT SIDEBAR */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-1/3 flex flex-col border-r border-gray-100 border-opacity-10" style={{ background: secondColor, color: "white" }}>
        {/* Logo and Name */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            {theme?.show_photo === '1' && theme?.photo && (
              <img src={theme?.photo} className="h-10 w-10 object-cover rounded" alt="Logo" />
            )}
            {theme?.show_nickname === '1' && theme?.nickname && (
              <h1 className="text-lg font-bold" style={{color:textColor}}>{theme?.nickname}</h1>
            )}
          </div>
          {theme?.show_page_description === '1' && theme?.page_description && (
            <p className="text-sm" style={{color:textColor}}>{theme?.page_description}</p>
          )}
          {/* Staff Profile (Show selected staff or first available) */}
           <div className="flex flex-col items-center">
                      <div className="w-20 mt-24 h-20 md:w-32 md:h-32 bg-white  rounded-full mb-4 flex items-center justify-center">      
                        <FaUserTie className="w-10 h-10 md:w-16 md:h-16 text-gray-400" />
                      </div>
                      <h2 className="text-lg md:text-xl" style={{color:textColor}}>{theme?.customer_name}</h2>
                    </div>
        </div>

        {/* Footer - Spacer to push to bottom */}
        <div className="mt-auto p-6">
          <div className="text-center space-y-4">
            {hasAnySocial && (
              <div className="flex gap-3 items-center justify-center flex-wrap">
                {theme?.show_facebook === "1" && theme?.footer_facebook && (
                  <>
                    <a 
                      href={theme.footer_facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:opacity-70 transition-opacity"
                      style={{color:textColor}}
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <span className="text-xs">|</span>
                  </>
                )}
                
                {theme?.show_email === "1" && theme?.footer_email && (
                    <>
                        <a 
                            href={`mailto:${theme.footer_email}`} 
                            className="hover:opacity-70 transition-opacity"
                             style={{color:textColor}}
                        >
                            <Mail className="w-4 h-4" />
                        </a>
                        <span className="text-xs">|</span>
                    </>
                )}
                
                {theme?.show_phone === "1" && theme?.footer_phone && (
                    <>
                        <a 
                            href={`tel:${theme.footer_phone}`} 
                            className="hover:opacity-70 transition-opacity"
                            style={{color:textColor}}
                        >
                            <Phone className="w-4 h-4" />
                        </a>
                        <span className="text-xs">|</span>
                    </>
                )}
                
                {theme?.show_x === "1" && theme?.footer_x && (
                    <>
                        <a 
                            href={theme.footer_x} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:opacity-70 transition-opacity"
                            style={{color:textColor}}
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                        <span className="text-xs">|</span>
                    </>
                )}
                
                {theme?.show_instagram === "1" && theme?.footer_instagram && (
                    <>
                        <a 
                            href={theme.footer_instagram} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:opacity-70 transition-opacity"
                            style={{color:textColor}}
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                        <span className="text-xs">|</span>
                    </>
                )}
                
                {theme?.show_linkedin === "1" && theme?.footer_linkedin && (
                    <>
                        <a 
                            href={theme.footer_linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:opacity-70 transition-opacity"
                            style={{color:textColor}}
                        >
                            <Linkedin className="w-4 h-4" />
                        </a>
                        <span className="text-xs">|</span>
                    </>
                )}
              </div>
            )}
            <div className="text-xs opacity-80" style={{color:textColor}}>Powered by Appoint Roll</div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 p-8 overflow-y-auto" style={{background:`${secondColor}E6`}}>
        <div className="max-w-5xl mx-auto">

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Step 0: Workspace Selection (if idAdmin) */}
          {/* ────────────────────────────────────────────────────────────────── */}
          {currentStep === steps.find((s) => s.key === 'workspace')?.step && idAdmin && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: textColor }}>
                Select Workspace
              </h2>
              
              {workspacesLoading ? (
                <div className="text-center py-12"></div>
              ) : workspaces?.length > 0 ? (
                <div className="space-y-4">
                  {workspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`mx-2  p-4 cursor-pointer transition-all hover:shadow-md   `}
                      style={{
                        ringColor: selectedWorkspace?.id === workspace.id ? firstColor : undefined,
                        background: selectedWorkspace?.id === workspace.id ? firstColor + "20" : "transparent", 
                      }}
                      onClick={() => handleWorkspaceSelect(workspace)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 border rounded-lg flex items-center justify-center font-semibold"
                          style={{
                            background:  'transparent',
                            color: selectedWorkspace?.id === workspace.id ? firstColor : textColor,
                            border:  '1px solid ' + textColor
                          }}
                        >
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div className={`flex-1 flex justify-between border-b border-gray-50 ${
                        selectedWorkspace?.id === workspace.id ? ' border-opacity-30' : ' border-opacity-10'
                      }`}>
                          <h3 className=" mb-7 truncate block max-w-[150px]" style={{ color: selectedWorkspace?.id === workspace.id ? firstColor : textColor,}}>{workspace.name}</h3>
                          {workspace.description && (
                            <p className="text-sm text-gray-600">{workspace.description}</p>
                          )}
                        {selectedWorkspace?.id === workspace.id && (
                          <Check className="w-5 h-5" style={{ color: firstColor }} />
                        )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No workspaces available</div>
              )}
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Step 1: Interview Selection */}
          {/* ────────────────────────────────────────────────────────────────── */}
          {currentStep === steps.find((s) => s.key === 'interview')?.step && isInterviewMode && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: textColor }}>
                Pick an Interview
                </h2>

                {interviewsLoading ? (
                <div className="text-center py-12"><Loader /></div>
                ) : interviews?.length > 0 ? (
                <div className="space-y-4">
                    {interviews.map((interview) => (
                    <div
                        key={interview.id}
                        className="mx-2 p-6 cursor-pointer transition-all hover:shadow-md"
                        style={{
                        background: selectedInterview?.id === interview.id ? firstColor + "20" : "transparent", 
                        borderRadius: '0.5rem',
                        }}
                        onClick={() => handleInterviewSelect(interview)}
                    >
                        <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 border rounded-lg flex items-center justify-center font-semibold"
                            style={{
                            background: 'transparent',
                            color: selectedInterview?.id === interview.id ? firstColor : textColor,
                            border: '1px solid ' + textColor,
                            }}
                        >
                            <User className="w-6 h-6" style={{ color: selectedInterview?.id === interview.id ? firstColor : textColor }} />
                        </div>
                        <div className="flex-1 flex justify-between border-b border-gray-50" style={{
                            borderOpacity: selectedInterview?.id === interview.id ? 0.3 : 0.1
                        }}>
                            <div className="mb-7">
                            <h3 className='truncate  max-w-[150px]' style={{ color: selectedInterview?.id === interview.id ? firstColor : textColor }}>
                            {interview.name}
                            </h3>
                            {interview.duration_cycle && (
                            <p className="text-sm " style={{ color: selectedInterview?.id === interview.id ? firstColor : textColor }}>{interview.duration_cycle} {interview.duration_period}</p>
                            )}
                            </div>
                            {selectedInterview?.id === interview.id && (
                            <Check className="w-5 h-5" style={{ color: firstColor }} />
                            )}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center py-12 text-gray-500">No interviews available</div>
                )}
            </div>
            )}


          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Step 2: Staff/Staff Group Selection */}
          {/* ────────────────────────────────────────────────────────────────── */}
          {currentStep === steps.find((s) => s.key === 'staff')?.step && (
            <div className="space-y-6">
                {availableStaffGroups?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold" style={{ color: firstColor }}>
                    Select Staff Group
                    </h3>
                    {availableStaffGroups.map((group) => (
                    <div
                        key={group.group_id}
                        className="mx-2 p-5 cursor-pointer transition-all hover:shadow-md"
                        style={{
                        background: selectedStaffGroup?.group_id === group.group_id ? firstColor + "20" : "transparent", // شفافية بسيطة
                        
                        }}
                        onClick={() => setSelectedStaffGroup(group)}
                    >
                        <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 border rounded-lg flex items-center justify-center font-semibold"
                            style={{
                            background: 'transparent',
                            color: selectedStaffGroup?.group_id === group.group_id ? firstColor : textColor,
                          
                            }}
                        >
                            {group.group_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 flex flex-col justify-between border-b border-gray-50" style={{
                            borderOpacity: selectedStaffGroup?.group_id === group.group_id ? 0.3 : 0.1
                        }}>
                            <h3 className="mb-2" style={{ color: selectedStaffGroup?.group_id === group.group_id ? firstColor : textColor }}>
                            {group.group_name}
                            </h3>
                            {group.group_description && (
                            <p className="text-sm text-gray-600">{group.group_description}</p>
                            )}
                            {/* <p className="text-xs text-gray-500">{group.staff.length} staff member(s)</p> */}
                        </div>
                        {selectedStaffGroup?.group_id === group.group_id && (
                        <Check className="w-5 h-5 mt-2" style={{ color: firstColor }} />
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                )}

                {!availableStaffGroups?.length && availableStaff?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold" style={{ color: textColor }}>
                    Select Staff Member
                    </h3>
                    {availableStaff.map((staff) => (
                    <div
                        key={staff.id}
                        className="mx-2 p-5 cursor-pointer transition-all hover:shadow-md"
                        style={{
                        background: selectedStaff?.id === staff.id ? firstColor + "20" : "transparent",
                        borderRadius: '0.5rem',
                        }}
                        onClick={() => setSelectedStaff(staff)}
                    >
                        <div className="flex items-center gap-4">
                        {staff?.photo ? (
                            <img
                            src={staff.photo}
                            className="w-12 h-12 rounded-lg object-cover "
                            style={{ borderColor: selectedStaff?.id === staff.id ? firstColor : textColor }}
                            />
                        ) : (
                            <div
                            className="w-12 h-12 border rounded-lg flex items-center justify-center font-semibold"
                            style={{
                                background: 'transparent',
                                color: selectedStaff?.id === staff.id ? firstColor : textColor,
                                border: '1px solid ' + textColor,
                            }}
                            >
                            {staff.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1 flex justify-between border-b">
                            <h3 className="w-full font-semibold  pb-5 truncate  max-w-[150px]" style={{ color: selectedStaff?.id === staff.id ? firstColor : textColor }}>
                            {staff.name}
                            </h3>
                                {selectedStaff?.id === staff.id && (
                                    <Check className="w-5 h-5" style={{ color: firstColor }} />
                                )}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        )}


          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Step 3: Resource Selection */}
          {/* ────────────────────────────────────────────────────────────────── */}
          {/* ────────────── Resources ────────────── */}
            {currentStep === steps.find((s) => s.key === 'resource')?.step && availableResources?.length > 0 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: firstColor }}>
                Select Resource
                </h2>

                <div className="space-y-4">
                {availableResources.map((resource) => (
                    <div
                    key={resource.id}
                    className="mx-2 p-6 cursor-pointer transition-all hover:shadow-md"
                    style={{
                        background: selectedResource?.id === resource.id ? firstColor + "20" : "transparent",
                        borderRadius: '0.5rem',
                    }}
                    onClick={() => setSelectedResource(resource)}
                    >
                    <div className="flex items-center gap-4">
                        <div
                        className="w-12 h-12 border rounded-lg flex items-center justify-center font-semibold"
                        style={{
                            background: 'transparent',
                            color: selectedResource?.id === resource.id ? firstColor : textColor,
                            border: '1px solid ' + textColor,
                        }}
                        >
                        <Package className="w-6 h-6" style={{ color: selectedResource?.id === resource.id ? firstColor : textColor }} />
                        </div>
                        <div className="flex-1 flex justify-between border-b border-gray-50" style={{ borderOpacity: selectedResource?.id === resource.id ? 0.3 : 0.1 }}>
                        <div className="mb-7">
                            <h3 className='truncate  max-w-[150px]' style={{ color: selectedResource?.id === resource.id ? firstColor : textColor }}>
                            {resource.name}
                            </h3>
                            {resource.description && (
                            <p className="text-sm" style={{ color: selectedResource?.id === resource.id ? firstColor : textColor }}>
                                {resource.description}
                            </p>
                            )}
                        </div>
                        {selectedResource?.id === resource.id && (
                            <Check className="w-5 h-5" style={{ color: firstColor }} />
                        )}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* ────────────── Type Selection ────────────── */}
            {currentStep === steps.find((s) => s.key === 'type')?.step && bookingData?.mode === 'online/inperson' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: firstColor }}>
                Select Type
                </h2>

                <div className="space-y-4">
                {[
                    { value: 'online', label: 'Online' },
                    { value: 'inhouse', label: 'In House' },
                    { value: 'athome', label: 'At Home' },
                ].map((type) => (
                    <div
                    key={type.value}
                    className="mx-2 p-6 cursor-pointer transition-all hover:shadow-md"
                    style={{
                        background: selectedType === type.value ? firstColor + "20" : "transparent",
                        borderRadius: '0.5rem',
                    }}
                    onClick={() => setSelectedType(type.value)}
                    >
                    <div className="flex items-center gap-4">
                        <div
                        className="w-12 h-12 border rounded-lg flex items-center justify-center font-semibold text-lg"
                        style={{
                            background: 'transparent',
                            color: selectedType === type.value ? firstColor : textColor,
                            border: '1px solid ' + textColor,
                        }}
                        >
                        {type.value === 'online' ? 'O' : type.value === 'inhouse' ? 'IH' : 'AH'}
                        </div>
                        <div className="flex-1 flex justify-between border-b border-gray-50" style={{ borderOpacity: selectedType === type.value ? 0.3 : 0.1 }}>
                        <h3 style={{ color: selectedType === type.value ? firstColor : textColor }}>
                            {type.label}
                        </h3>
                        {selectedType === type.value && (
                            <Check className="w-5 h-5" style={{ color: firstColor }} />
                        )}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}


          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Step 5: Date & Time Selection */}
          {/* ────────────────────────────────────────────────────────────────── */}
          {currentStep === steps.find((s) => s.key === 'datetime')?.step && (
            <div className="space-y-6">
              {bookingDataLoading ? (
                <div className="text-center py-16">
                  <Loader />
                  <p className="text-sm text-gray-500 mt-4">Loading available times...</p>
                </div>
              ) : (
                <>
                  <div className=" rounded-lg shadow-sm  overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                      <Calendar className="w-5 h-5" style={{ color: firstColor }} />
                      <h3 className="font-semibold text-lg" style={{ color: textColor }}>
                        Select Date & Time
                      </h3>
                    </div>

                    <div className="p-6">
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
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Step 6: Your Info */}
          {/* ────────────────────────────────────────────────────────────────── */}
          {currentStep === steps.find((s) => s.key === 'info')?.step && (
            <div className="space-y-6">
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

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Navigation Buttons */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <div className="mt-8 flex justify-between items-center">
            {currentStep > 1 && (
              <button
                onClick={() => {
                  const prevStep = steps.find((s) => s.step === currentStep - 1);
                  if (prevStep) setCurrentStep(prevStep.step);
                }}
                className="px-6 py-2 rounded-lg border transition-all hover:shadow-md"
                style={{
                  borderColor: firstColor,
                  color: firstColor,
                }}
              >
                Previous
              </button>
            )}
            
            {currentStep < steps.length && (
              <button
                onClick={goToNextStep}
                disabled={!canGoToStep(currentStep + 1)}
                className="px-6 py-2 rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                style={{
                  background: firstColor,
                  color: textColor,
                }}
              >
                Next
              </button>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* Progress Indicator */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {steps.map((step) => (
              <div
                key={step.key}
                className={`h-2 rounded-full transition-all ${
                  step.step === currentStep ? 'w-8' : 'w-2'
                }`}
                style={{
                  background: step.step <= currentStep ? firstColor : '#e5e7eb',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking_3;