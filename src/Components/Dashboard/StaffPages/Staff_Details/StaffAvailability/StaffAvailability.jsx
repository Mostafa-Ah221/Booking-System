import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";
import ReadOnlyView from './ReadOnlyView';
import { getStaffById, updateAvailabilStaff, updateUnAvailabilStaff} from '../../../../../redux/apiCalls/StaffCallApi';
import { useParams } from 'react-router-dom';
import { staffAction } from '../../../../../redux/slices/staffSlice';

const StaffAvailability = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('available-times');
  const [availabilityMode, setAvailabilityMode] = useState('available');
  const [activeSection, setActiveSection] = useState(null);
  const [timeZone] = useState('Africa/Cairo - EET (+02:00)');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isTimeSectionDisabled, setIsTimeSectionDisabled] = useState(true);
  
  const [selectedAvailableDates, setSelectedAvailableDates] = useState([]);
  const [selectedUnAvailableDates, setSelectedUnAvailableDates] = useState([]);
  
  const [selectedTimeDropdown, setSelectedTimeDropdown] = useState(null);
 
  const dispatch = useDispatch();
  const { id } = useParams();
    const { staff, loading, error } = useSelector(state => state.staff);
  console.log(staff?.staff);
  
  const [weekDays, setWeekDays] = useState([]);

  const formatDate = useCallback((date) => date.toISOString().split('T')[0], []);

  const isConsecutiveDate = useCallback((date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setDate(d1.getDate() + 1);
    return d1.toISOString().split('T')[0] === date2;
  }, []);

  const formatDateRanges = useCallback((dates) => {
    if (!dates.length) return [];
    
    const sortedDates = [...dates].sort((a, b) => new Date(a.date) - new Date(b.date));
    const ranges = [];
    let currentRange = null;

    sortedDates.forEach(date => {
      const formattedDate = date.date;
      
      if (!currentRange) {
        currentRange = { from: formattedDate, to: formattedDate };
      } else if (isConsecutiveDate(currentRange.to, formattedDate)) {
        currentRange.to = formattedDate;
      } else {
        ranges.push(currentRange);
        currentRange = { from: formattedDate, to: formattedDate };
      }
    });

    if (currentRange) ranges.push(currentRange);
    return ranges;
  }, [isConsecutiveDate]);

  const getSelectedDates = useCallback(() => {
    return availabilityMode === 'available' ? selectedAvailableDates : selectedUnAvailableDates;
  }, [availabilityMode, selectedAvailableDates, selectedUnAvailableDates]);

  const handleDateClick = useCallback((dates) => {
    if (availabilityMode === 'available') {
      setSelectedAvailableDates(dates);
    } else {
      setSelectedUnAvailableDates(dates);
    }
  }, [availabilityMode]);

  const handleSaveAvailableTimes = useCallback(async (formData) => {
    try {
      const availableTimesData = formData?.available_times;
      
      if (!availableTimesData || !Array.isArray(availableTimesData) || availableTimesData.length === 0) {
        throw new Error('No available times provided');
      }
      
      const payload = { available_times: availableTimesData };
      const result = await dispatch(updateAvailabilStaff(id, payload));
      
      if (result?.success || result?.message === "Updated Successfully" || (result?.message && !result?.error)) {
        toast.success('Available times saved successfully!');
        setIsTimeSectionDisabled(true);
        setIsEditing(false);
        await dispatch(getStaffById(id));
        return { success: true };
      } else {
        throw new Error(result?.message || result?.error || 'Save failed');
      }
    } catch (error) {
      toast.error(`Error saving available times: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, [dispatch, id]);

 const handleSaveUnAvailableTimes = useCallback(async (formData) => {
  try {
    const unAvailableTimes = formData?.un_available_times || formData?.available_times || [];
    
    const payload = {};
    if (unAvailableTimes.length > 0) {
      payload.un_available_times = unAvailableTimes;
    }



    const result = await dispatch(updateUnAvailabilStaff(id, payload));
    
    if (result?.success || result?.message === "Updated Successfully" || (result?.message && !result?.error)) {
      toast.success('Unavailable times saved successfully!');
      setIsTimeSectionDisabled(true);
      setIsEditing(false);
      await dispatch(getStaffById(id));
      return { success: true };
    }
  } catch (error) {
    console.error('Full error object:', error); 
    console.error('Error response:', error.response?.data?.message?.error?.[0]); 
    
    toast.error(`Error saving unavailable times: ${error.message}`);
    return { success: false, error: error.message };
  }
}, [dispatch, id]);

  const handleSaveAvailableDates = useCallback(async (formData) => {
    try {
    
      
      const payload = { available_dates: formData.available_dates };
      const result = await dispatch(updateAvailabilStaff(id, payload));
      
      if (result?.success || result?.message === "Updated Successfully") {
        toast.success('Available dates saved successfully!');
        
        const newSelectedDates = [];
        formData.available_dates.forEach(range => {
          const start = new Date(range.from);
          const end = new Date(range.to);
          for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            newSelectedDates.push({ date: d.toISOString().split('T')[0] });
          }
        });
        setSelectedAvailableDates(newSelectedDates);
        setIsEditing(false);
        return { success: true };
      } else {
        
        throw new Error(result?.message || "Save failed");
      }
    } catch (error) {
      
      toast.error(`Error saving available dates: ${error.message}`);
      return { success: false };
    }
  }, [dispatch, id]);

  const handleSaveUnAvailableDates = useCallback(async (formData) => {
    try {
      const unAvailableDates = formData.un_available_dates || formData.available_dates || [];
      
      
      
      const validDates = unAvailableDates.every(dateRange => dateRange.from && dateRange.to);
      if (!validDates) {
        throw new Error("Invalid date range format");
      }
      
      const payload = { 
      un_available_dates: unAvailableDates.length > 0 ? unAvailableDates : {} 
    };
      
      const result = await dispatch(updateUnAvailabilStaff(id, payload));
      
      if (result?.success || result?.message === "Updated Successfully" || (result?.message && !result?.error)) {
        toast.success('Unavailable dates saved successfully!');
        
        const newSelectedDates = [];
        unAvailableDates.forEach(range => {
          const start = new Date(range.from);
          const end = new Date(range.to);
          for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            newSelectedDates.push({ date: d.toISOString().split('T')[0] });
          }
        });
        setSelectedUnAvailableDates(newSelectedDates);
        setIsEditing(false);
        return { success: true };
      } else {
        throw new Error(result?.message || result?.error || "Save failed");
      }
    } catch (error) {
      toast.error(`Error saving unavailable dates: ${error.message}`);
      console.log(error);
      
      return { success: false, error: error.message };
    }
  }, [dispatch, id]);

  const handleSaveTimes = useCallback((formData) => {
    const currentMode = activeTab.includes('unavailable') ? 'unavailable' : 'available';
    
    // const timesData = formData.available_times || formData.un_available_times;
    // if (!timesData || timesData.length === 0) {
    //   toast.error('Please select at least one day and time slot');
    //   return Promise.resolve({ success: false, error: 'No times data' });
    // }
    
    if (currentMode === 'available') {
      return handleSaveAvailableTimes(formData);
    } else {
      const transformedData = {
        un_available_times: formData.available_times || formData.un_available_times || []
      };
      return handleSaveUnAvailableTimes(transformedData);
    }
  }, [activeTab, handleSaveAvailableTimes, handleSaveUnAvailableTimes]);

  const handleSaveDates = useCallback((formData) => {
    const currentMode = activeTab.includes('unavailable') ? 'unavailable' : 'available';
    
    if (currentMode === 'available') {
      return handleSaveAvailableDates(formData);
    } else {
      const transformedData = {
        un_available_dates: formData.available_dates || formData.un_available_dates || []
      };
      return handleSaveUnAvailableDates(transformedData);
    }
  }, [activeTab, handleSaveAvailableDates, handleSaveUnAvailableDates]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    
    let newMode = 'available';
    if (tab.includes('unavailable')) {
      newMode = 'unavailable';
    } else if (tab.includes('available')) {
      newMode = 'available';
    }
    
    setAvailabilityMode(newMode);
  }, []);

  useEffect(() => {
    // Effect to handle availability mode changes
  }, [availabilityMode, activeTab]);

  const getCurrentAvailabilityMode = useCallback(() => {
    if (activeTab.includes('unavailable')) {
      return 'unavailable';
    }
    if (activeTab.includes('available')) {
      return 'available';
    }
    return availabilityMode;
  }, [activeTab, availabilityMode]);

  const handleMonthChange = useCallback((direction) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + (direction === 'prev' ? -1 : 1), 1));
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setIsTimeSectionDisabled(true);
    setActiveSection(null);
    setActiveTab('available-times');
    setAvailabilityMode('available');
  }, []);

  const handleEdit = useCallback(() => {
    setActiveSection('working-hours');
    setIsEditing(true);
    setIsTimeSectionDisabled(false);
    setActiveTab('available-times');
    setAvailabilityMode('available');
  }, []);

  const handleSpecialHoursAdd = useCallback(() => {
    setActiveSection('special-hours');
    setIsEditing(true);
    setActiveTab('available-dates');
    setAvailabilityMode('available');
  }, []);

  const handleUnavailabilityAdd = useCallback(() => {
    setActiveSection('unavailability');
    setIsEditing(true);
    setIsTimeSectionDisabled(false); 
    setActiveTab('unavailable-times');
    setAvailabilityMode('unavailable');
  }, []);

  return (
    <ReadOnlyView
      sections={[
        { id: 'working-hours', title: 'Working Hours', description: 'Set weekly available days and hours.', expandable: true },
        { id: 'unavailability', title: 'Unavailability', description: 'Add extra unavailable days or hours.', expandable: true }
      ]}
      onEdit={handleEdit}
      handleSpecialHoursAdd={handleSpecialHoursAdd}
      handleUnavailabilityAdd={handleUnavailabilityAdd}
      handleTabChange={handleTabChange}
      activeTab={activeTab}
      availabilityMode={availabilityMode}
      isEditing={isEditing}
      activeSection={activeSection}
      timeZone={timeZone}
      weekDays={weekDays}
      selectedTimeDropdown={selectedTimeDropdown}
      handleTimeDropdownToggle={setSelectedTimeDropdown}
      handleSaveTimes={handleSaveTimes}
      onUpdateWeekDays={setWeekDays}
      onCancel={handleCancel}
      currentMonth={currentMonth}
      selectedDates={getSelectedDates()} 
      goToPreviousMonth={() => handleMonthChange('prev')}
      goToNextMonth={() => handleMonthChange('next')}
      handleDateClick={handleDateClick} 
      handleSaveDates={handleSaveDates}
      getInterviewData={staff?.staff}
      isTimeSectionDisabled={isTimeSectionDisabled}
    />
  );
};

export default StaffAvailability;