import { Calendar, Clock, MapPin, User, ChevronRight, UserRound, Package, Check, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import Loader from '../../Loader';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import useBookingLogic from '../useBookingLogic';
import { PiBaseballCap, PiUsersThreeLight } from 'react-icons/pi';
import TimeSelectionSection2 from '../Theme-2/time2';
import { Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import BookingSummarySidebar2 from '../Theme-2/BookingSummarySidebar2';
import CalendarSection4 from './CalendarSection4';
import { FaXTwitter } from 'react-icons/fa6';
import NoAppointments from '../NoAppointments';

const AppointmentBooking_4 = () => {
  const { id, idAdmin, idCustomer, idSpace } = useParams();
  const navigate = useNavigate();
  const isInterviewMode = !!idCustomer || !!idSpace || !!idAdmin;

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
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [firstAvailableDate, setFirstAvailableDate] = useState(null);

  const staffDropdownRef = useRef(null);
  const staffGroupDropdownRef = useRef(null);
  const resourceDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  // ── Color parsing ──────────────────────────────────────────────────────────
  const colors = theme?.colors ? JSON.parse(theme.colors) : {};
  const primary = colors?.primary || "#3B817B-#F6CB45";
  const [bgColor, accentColor] = primary.split("-");
  const textColor = colors?.text_color || "#FFFFFF";

  const accentWithOpacity = (opacity) => {
    const hex = (accentColor || '#F6CB45').replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const bgWithOpacity = (opacity) => {
    const hex = (bgColor || '#3B817B').replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

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

  const bookingId = useMemo(() => {
    if (selectedInterview) return selectedInterview.share_link;
    return idCustomer || idSpace || idAdmin || id;
  }, [selectedInterview, idCustomer, idSpace, idAdmin, id]);

  const {
    availableResources, selectedResource, setSelectedResource,
    availableStaffGroups, selectedStaffGroup, setSelectedStaffGroup,
    availableStaff, selectedStaff, setSelectedStaff,
    bookingData, selectedDate, selectedTime, selectedTimezone,
    formData, isBooking,
    setSelectedDate, setSelectedTime, setSelectedTimezone, setFormData,
    handleScheduleAppointment, isTimeDisabled,
    selectedType, setSelectedType,
    totalPrice, numberOfSlots, selectedEndTime, setSelectedEndTime,noAvailability,
    loading
  } = useBookingLogic(
    bookingId, navigate, isInterviewMode,
    selectedInterview?.id, idCustomer || idSpace || idAdmin,
    !!idCustomer, setTheme, theme,
    selectedInterview,
    
  );

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
      if (detected) setSelectedTimezone(detected);
    } catch (e) {
      console.log('Timezone auto-detection failed');
    }
  }, []);

  // ── Track first available date ─────────────────────────────────────────────
  useEffect(() => {
    if (selectedDate && !firstAvailableDate) {
      setFirstAvailableDate(selectedDate);
    }
  }, [selectedDate]);

  // ── Build steps ────────────────────────────────────────────────────────────
  const steps = useMemo(() => {
    const list = [];
    let counter = 1;

    // Workspace step لو idAdmin وعنده workspaces
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
      list.push({ step: counter++, label: 'Interview', icon: PiBaseballCap, value: selectedInterview?.name, key: 'interview' });
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
    if (bookingData?.require_staff_select && availableStaff?.length === 0 && !availableStaffGroups?.length) {
      list.push({
        step: counter++,
        label: 'Staff',
        icon: UserRound,
        value: '__unavailable__',
        key: 'staff_unavailable',
        disabled: true,
      });
    }
    if (
  bookingData?.interview_type === 'collective-booking' &&
  (availableStaffGroups?.length ?? 0) === 0 &&
  !selectedStaffGroup
) {
  list.push({
    step: counter++,
    label: 'Staff Group',
    icon: PiUsersThreeLight,
    value: '__unavailable__',
    key: 'staff_group_unavailable',
    disabled: true,
  });
}
    if (availableResources?.length > 0) {
      list.push({ step: counter++, label: 'Resource', icon: Package, value: selectedResource?.name, key: 'resource' });
    }

    // extra_modes check زي AppointmentBooking_3
    if (bookingData?.mode === 'online/inperson' && bookingData?.extra_modes?.length > 0) {
      list.push({
        step: counter++, label: 'Type', icon: MapPin,
        value: selectedType ? (selectedType === 'online' ? 'Online' : selectedType === 'inhouse' ? 'In House' : 'At Home') : null,
        key: 'type',
      });
    }

    const dateTimeValue = selectedDate && selectedTime ? `${selectedDate} at ${selectedTime}` : null;
    list.push({ step: counter++, label: 'Date & Time', icon: Calendar, value: dateTimeValue, key: 'datetime' });
    list.push({ step: counter++, label: 'Your Info', icon: User, value: null, key: 'info' });

    return list;
  }, [
    idAdmin, workspaces, selectedWorkspace,
    isInterviewMode, selectedInterview,
    availableStaff, availableStaffGroups, selectedStaff, selectedStaffGroup,
    availableResources, selectedResource,
    bookingData?.mode, bookingData?.extra_modes,
    selectedType, selectedDate, selectedTime,bookingData?.interview_type,
  ]);

const hasUnavailableStaff = bookingData?.require_staff_select && 
  availableStaff?.length === 0 && 
  !availableStaffGroups?.length;
  const hasUnavailableStaffGroup = 
  bookingData?.interview_type === 'collective-booking' &&
  (availableStaffGroups?.length ?? 0) === 0;
  const hasAnySocial =
    (theme?.show_email === "1" && theme?.footer_email) ||
    (theme?.show_phone === "1" && theme?.footer_phone) ||
    (theme?.show_facebook === "1" && theme?.footer_facebook) ||
    (theme?.show_x === "1" && theme?.footer_x) ||
    (theme?.show_instagram === "1" && theme?.footer_instagram) ||
    (theme?.show_linkedin === "1" && theme?.footer_linkedin);

  // ── Auto-select single items + auto-advance (زي AppointmentBooking_3) ──────
  useEffect(() => {
    if (workspaces?.length === 1 && !selectedWorkspace) {
      handleWorkspaceSelect(workspaces[0]);
    }
  }, [workspaces]);

  useEffect(() => {
    if (interviews?.length === 1 && !selectedInterview) {
      handleInterviewSelect(interviews[0]);
    }
  }, [interviews]);

  useEffect(() => {
    if (availableStaff?.length === 1 && !selectedStaff) { setSelectedStaff(availableStaff[0]); setSelectedDate(null); setSelectedTime(null); }
    if (availableStaffGroups?.length === 1 && !selectedStaffGroup) { setSelectedStaffGroup(availableStaffGroups[0]); setSelectedDate(null); setSelectedTime(null); }
    if (availableResources?.length === 1 && !selectedResource) { setSelectedResource(availableResources[0]); setSelectedDate(null); setSelectedTime(null); }
  }, [availableStaff, availableStaffGroups, availableResources]);
useEffect(() => {
  if (!selectedType && bookingData) {
    if (bookingData.extra_modes && bookingData.extra_modes.length === 1) {
      setSelectedType(bookingData.extra_modes[0]);
    } else if (!bookingData.extra_modes?.length && bookingData.inperson_mode) {
      setSelectedType(bookingData.inperson_mode);
    }
  }
}, [bookingData?.extra_modes, bookingData?.inperson_mode]);
  useEffect(() => {
    if (bookingData?.mode === 'online/inperson' && bookingData?.extra_modes?.length === 1 && !selectedType) {
      setSelectedType(bookingData.extra_modes[0]);
    }
  }, [bookingData?.extra_modes]);

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
      const res = await fetch(`https://api.appointroll.com/api/public/book/resource?customer_share_link=${idAdmin}`);
      const data = await res.json();
      if (data.data?.workspaces) {
        if (data.data?.theme && !theme) setTheme(data.data.theme);
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
        ? `https://api.appointroll.com/api/public/book/resource?staff_share_link=${resourceId}`
        : `https://api.appointroll.com/api/public/book/resource?workspace_share_link=${resourceId}`;
      const res = await fetch(url);
      const data = await res.json();
      let interviewsData = [];
      if (idSpace || (idAdmin && selectedWorkspace)) {
        interviewsData = data?.data?.workspace_interviews || [];
        if (data.data?.theme && !theme) setTheme(data.data.theme);
        setNameProvider(data?.data?.workspace_interviews?.[0]?.customer_name);
      } else if (idCustomer) {
        interviewsData = data?.data?.staff_interviews || [];
        if (data.data?.theme && !theme) setTheme(data.data.theme);
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

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setSelectedInterview(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setExpandedDropdown(null);
  };

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingDataLoading(true);
    setExpandedDropdown(null);
    setTimeout(() => setBookingDataLoading(false), 250);
  };

  const goToNextStep = () => {
    const next = steps.find((s) => s.step > currentStep);
    if (next && canGoToStep(next.step)) setCurrentStep(next.step);
  };

    const canGoToStep = (targetStep) => {
      if (targetStep === currentStep) return true;
      const targetIdx = steps.findIndex((s) => s.step === targetStep);
      if (targetIdx === -1) return false;
      const hasDisabledBefore = steps.slice(0, targetIdx).some((s) => s.disabled);
      if (hasDisabledBefore) return false;
      return steps.slice(0, targetIdx).every((s) => s.value !== null && s.value !== undefined);
    };

  const handleStepClick = (step) => {
    if (canGoToStep(step)) setCurrentStep(step);
  };

  const toggleDropdown = (key) => {
    setExpandedDropdown(expandedDropdown === key ? null : key);
  };

  // ── Avatar placeholder ─────────────────────────────────────────────────────
  const AvatarPlaceholder = ({ letter }) => (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: accentColor, color: bgColor }}
    >
      {letter}
    </div>
  );

  // ── Dropdown Box ───────────────────────────────────────────────────────────
 const renderDropdownBox = (step) => {
  const isExpanded = expandedDropdown === step.key;
  const Icon = step.icon;
  const hasValue = !!step.value;
  const isDisabled = step.disabled;
if (!loading && noAvailability && bookingData) {
  return <NoAppointments themeColor={theme} />;
}
  return (
    <div
      key={step.key}
      className="overflow-hidden transition-all duration-200"
      style={{
        border: `1.5px solid ${isDisabled ? 'rgba(255,0,0,0.4)' : hasValue ? accentColor : accentWithOpacity(0.35)}`,
        borderRadius: '10px',
        backgroundColor: isDisabled ? 'rgba(255,0,0,0.06)' : hasValue ? accentWithOpacity(0.12) : accentWithOpacity(0.04),
      }}
    >
      <div
        className={`flex items-center justify-between p-4 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} select-none`}
        onClick={() => !isDisabled && toggleDropdown(step.key)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: isDisabled ? 'rgba(255,0,0,0.15)' : hasValue ? accentColor : accentWithOpacity(0.2) }}
          >
            <Icon className="w-4 h-4" style={{ color: isDisabled ? '#ef4444' : hasValue ? bgColor : textColor }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: textColor, opacity: 0.6 }}>
              {step.label}
            </p>
            <p className="font-semibold truncate" style={{ 
              color: isDisabled ? '#ef4444' : textColor, 
              maxWidth: '260px', 
              opacity: isDisabled ? 1 : hasValue ? 1 : 0.5 
            }}>
              {isDisabled 
              ? (step.key === 'staff_group_unavailable' 
                  ? 'No staff group available — contact provider'
                  : 'No staff available — contact provider')
              : step.value || `Select ${step.label}`}
            </p>
          </div>
        </div>
        {!isDisabled && (
          isExpanded
            ? <ChevronUp className="w-4 h-4 flex-shrink-0 ml-2" style={{ color: textColor, opacity: 0.7 }} />
            : <ChevronDown className="w-4 h-4 flex-shrink-0 ml-2" style={{ color: textColor, opacity: 0.7 }} />
        )}
      </div>

      {isExpanded && !isDisabled && (
        <div className="max-h-72 overflow-y-auto" style={{ borderTop: `1px solid ${accentWithOpacity(0.2)}` }}>
          {step.key === 'workspace' && renderWorkspaceOptions()}
          {step.key === 'interview' && renderInterviewOptions()}
          {step.key === 'staff' && renderStaffOptions()}
          {step.key === 'resource' && renderResourceOptions()}
          {step.key === 'type' && renderTypeOptions()}
        </div>
      )}
    </div>
  );
};

  // ── Option Row ─────────────────────────────────────────────────────────────
  const OptionRow = ({ isSelected, onClick, children }) => (
    <div
      className="flex items-center justify-between p-3 cursor-pointer transition-all duration-150"
      style={{
        backgroundColor: isSelected ? accentWithOpacity(0.18) : 'transparent',
        borderBottom: `1px solid ${accentWithOpacity(0.12)}`,
      }}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = accentWithOpacity(0.08); }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
      onClick={onClick}
    >
      {children}
      {isSelected && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor }}>
          <Check className="w-3 h-3" style={{ color: bgColor }} />
        </div>
      )}
    </div>
  );

  // ── Workspace Options ──────────────────────────────────────────────────────
  const renderWorkspaceOptions = () => {
    if (workspacesLoading) return <div className="p-8 text-center"><Loader /></div>;
    if (!workspaces || workspaces.length === 0)
      return <div className="p-8 text-center text-sm" style={{ color: textColor, opacity: 0.5 }}>No workspaces available</div>;

    return workspaces.map((workspace) => (
      <OptionRow key={workspace.id} isSelected={selectedWorkspace?.id === workspace.id} onClick={() => handleWorkspaceSelect(workspace)}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentWithOpacity(0.2) }}>
            <Building2 className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate" style={{ color: textColor, maxWidth: '220px' }}>{workspace.name}</p>
            {workspace.description && <p className="text-xs" style={{ color: textColor, opacity: 0.55 }}>{workspace.description}</p>}
          </div>
        </div>
      </OptionRow>
    ));
  };

  // ── Interview Options ──────────────────────────────────────────────────────
  const renderInterviewOptions = () => {
    if (interviewsLoading) return <div className="p-8 text-center"><Loader /></div>;
    if (!interviews || interviews.length === 0)
      return <div className="p-8 text-center text-sm" style={{ color: textColor, opacity: 0.5 }}>No interviews available</div>;

    return interviews.map((interview) => (
      <OptionRow key={interview.id} isSelected={selectedInterview?.id === interview.id} onClick={() => handleInterviewSelect(interview)}>
        <div className="flex items-center gap-3 min-w-0">
          <AvatarPlaceholder letter={interview.name.charAt(0).toUpperCase()} />
          <div className="min-w-0">
            <p className="font-medium truncate" style={{ color: textColor, maxWidth: '220px' }}>{interview.name}</p>
            <p className="text-xs" style={{ color: textColor, opacity: 0.55 }}>{interview.duration_cycle} {interview.duration_period}</p>
          </div>
        </div>
      </OptionRow>
    ));
  };

  // ── Staff Options ──────────────────────────────────────────────────────────
  const renderStaffOptions = () => {
    if (availableStaffGroups?.length > 0) {
      return availableStaffGroups.map((group) => (
        <OptionRow key={group.group_id} isSelected={selectedStaffGroup?.group_id === group.group_id} onClick={() => { setSelectedStaffGroup(group); setExpandedDropdown(null); }}>
          <div className="flex items-center gap-3 min-w-0">
            <AvatarPlaceholder letter={group.group_name.charAt(0).toUpperCase()} />
            <div className="min-w-0">
              <p className="font-medium truncate" style={{ color: textColor, maxWidth: '220px' }}>{group.group_name}</p>
              {group.group_description && <p className="text-xs" style={{ color: textColor, opacity: 0.55 }}>{group.group_description}</p>}
            </div>
          </div>
        </OptionRow>
      ));
    }
    if (availableStaff?.length > 0) {
      return availableStaff.map((staff) => (
        <OptionRow key={staff.id} isSelected={selectedStaff?.id === staff.id} onClick={() => { setSelectedStaff(staff); setExpandedDropdown(null); }}>
          <div className="flex items-center gap-3 min-w-0">
            {staff?.photo
              ? <img src={staff.photo} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt={staff.name} />
              : <AvatarPlaceholder letter={staff.name.charAt(0).toUpperCase()} />
            }
            <p className="font-medium truncate" style={{ color: textColor, maxWidth: '220px' }}>{staff.name}</p>
          </div>
        </OptionRow>
      ));
    }
    return null;
  };

  // ── Resource Options ───────────────────────────────────────────────────────
  const renderResourceOptions = () => {
    if (!availableResources || availableResources.length === 0) return null;
    return availableResources.map((resource) => (
      <OptionRow key={resource.id} isSelected={selectedResource?.id === resource.id} onClick={() => { setSelectedResource(resource); setExpandedDropdown(null); }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentWithOpacity(0.2) }}>
            <Package className="w-4 h-4" style={{ color: textColor }} />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate" style={{ color: textColor, maxWidth: '220px' }}>{resource.name}</p>
            {resource.description && <p className="text-xs" style={{ color: textColor, opacity: 0.55 }}>{resource.description}</p>}
          </div>
        </div>
      </OptionRow>
    ));
  };

  // ── Type Options ───────────────────────────────────────────────────────────
  const renderTypeOptions = () => {
    const modes = bookingData?.extra_modes || [];
    const typeMap = {
      online:  { label: 'Online',   emoji: '🌐' },
      inhouse: { label: 'In House', emoji: '🏢' },
      athome:  { label: 'At Home',  emoji: '🏠' },
    };
    return modes.map((modeVal) => {
      const { label, emoji } = typeMap[modeVal] || { label: modeVal, emoji: '📍' };
      return (
        <OptionRow key={modeVal} isSelected={selectedType === modeVal} onClick={() => { setSelectedType(modeVal); setExpandedDropdown(null); }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: accentWithOpacity(0.2) }}>
              {emoji}
            </div>
            <p className="font-medium" style={{ color: textColor }}>{label}</p>
          </div>
        </OptionRow>
      );
    });
  };

  const dateTimeStep = steps.find((s) => s.key === 'datetime');
  const infoStep = steps.find((s) => s.key === 'info');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: bgColor }}>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-start gap-3 mb-3">
            {theme?.show_photo === '1' && theme?.photo && (
              <img src={theme?.photo} className="h-12 w-12 object-cover rounded-xl shadow-md" alt="Logo" />
            )}
            {theme?.show_nickname === '1' && theme?.nickname && (
              <h1 className="text-xl font-bold" style={{ color: textColor }}>{theme?.nickname}</h1>
            )}
          </div>
          {theme?.show_page_title === '1' && theme?.page_title && (
            <h2 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>{theme?.page_title}</h2>
          )}
          {theme?.show_page_description === '1' && theme?.page_description && (
            <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: textColor, opacity: 0.75 }}>
              {theme?.page_description}
            </p>
          )}
        </div>

        {/* Dropdown Steps */}
        <div className="flex flex-col gap-3 mb-6">
          {steps
            .filter((s) => s.key !== 'datetime' && s.key !== 'info')
            .map((step) => renderDropdownBox(step))}
        </div>

        {/* Date & Time */}
          {dateTimeStep && !hasUnavailableStaff && !hasUnavailableStaffGroup && (

            <div
              className="mb-6 rounded-xl overflow-hidden"
              style={{
                border: `1.5px solid ${selectedDate && selectedTime ? accentColor : accentWithOpacity(0.35)}`,
                backgroundColor: selectedDate && selectedTime ? accentWithOpacity(0.12) : accentWithOpacity(0.04),
              }}
            >
              <div className="flex items-center gap-3 p-4" style={{ borderBottom: `1px solid ${accentWithOpacity(0.2)}` }}>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: selectedDate && selectedTime ? accentColor : accentWithOpacity(0.2) }}
                >
                  <Clock className="w-4 h-4" style={{ color: selectedDate && selectedTime ? bgColor : textColor }} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: textColor, opacity: 0.6 }}>Date & Time</p>
                  <p className="font-semibold" style={{ color: textColor, opacity: selectedDate && selectedTime ? 1 : 0.5 }}>
                    {selectedDate && selectedTime ? `${selectedDate} | ${selectedTime}` : 'Select Date & Time'}
                  </p>
                </div>
                {selectedDate && selectedTime && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                    <Check className="w-3 h-3" style={{ color: bgColor }} />
                  </div>
                )}
              </div>

              <div className="p-4">
                {bookingDataLoading ? (
                  <div className="text-center py-16">
                    <Loader />
                    <p className="text-sm mt-4" style={{ color: textColor, opacity: 0.6 }}>Loading available times...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CalendarSection4
                      selectedDate={selectedDate}
                      onDateSelect={(date) => setSelectedDate(date)}
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
                      initialDate={firstAvailableDate}
                    />
                    <TimeSelectionSection2
                      selectedTime={selectedTime}
                      onTimeSelect={(time) => setSelectedTime(time)}
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

        {/* Your Info */}
        {selectedDate && selectedTime && infoStep && !hasUnavailableStaff && !hasUnavailableStaffGroup && (


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

      {/* Footer */}
      <div className="flex flex-col items-center pb-8 w-full" style={{ color: textColor }}>
        {hasAnySocial && (
          <div className="mb-4">
            <div className="flex gap-2 items-center justify-center flex-wrap">
              {theme?.show_facebook === "1" && theme?.footer_facebook && (
                <><a href={theme.footer_facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: textColor }}>
                  <Facebook className="w-4 h-4" /></a><span style={{ opacity: 0.3 }}>|</span></>
              )}
              {theme?.show_email === "1" && theme?.footer_email && (
                <><a href={`mailto:${theme.footer_email}`}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: textColor }}>
                  <Mail className="w-4 h-4" /></a><span style={{ opacity: 0.3 }}>|</span></>
              )}
              {theme?.show_phone === "1" && theme?.footer_phone && (
                <><a href={`tel:${theme.footer_phone}`}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: textColor }}>
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{theme.footer_phone}</span></a><span style={{ opacity: 0.3 }}>|</span></>
              )}
              {theme?.show_x === "1" && theme?.footer_x && (
                <><a href={theme.footer_x} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: textColor }}>
                  <FaXTwitter className="w-4 h-4" /></a><span style={{ opacity: 0.3 }}>|</span></>
              )}
              {theme?.show_instagram === "1" && theme?.footer_instagram && (
                <><a href={theme.footer_instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: textColor }}>
                  <Instagram className="w-4 h-4" /></a><span style={{ opacity: 0.3 }}>|</span></>
              )}
              {theme?.show_linkedin === "1" && theme?.footer_linkedin && (
                <a href={theme.footer_linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: textColor }}>
                  <Linkedin className="w-4 h-4" /></a>
              )}
            </div>
          </div>
        )}
        {theme?.remove_brand !== "1" && (
  <p className="text-xs" style={{ opacity: 0.5 }}>
    Powered by Appoint Roll
  </p>
)}
        
      </div>
    </div>
  );
};

export default AppointmentBooking_4;