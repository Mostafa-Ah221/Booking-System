import React, { useState, useCallback } from 'react';
import CalendarSection from './CalendarSection';
import TimeSection from './TimeSection';
import ReadOnlyView from './ReadOnlyView';
import { useOutletContext } from 'react-router-dom';
import { updateAvailability, updateUnAvailability } from '../../../../../redux/apiCalls/interviewCallApi';
import { useDispatch, useSelector } from 'react-redux';

const InterviewAvailability = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('available-times');
  const [availabilityMode, setAvailabilityMode] = useState('available'); // 'available' or 'unavailable'
  const [showTabs, setShowTabs] = useState(false); // Control tabs visibility
  const [timeZone] = useState('Africa/Cairo - EET (+02:00)');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([
    { date: "2025-03-25" },
    { date: "2025-03-26" },
    { date: "2025-04-01" },
    { date: "2025-04-02" }
  ]);
  const [selectedTimeDropdown, setSelectedTimeDropdown] = useState(null);
  const { id } = useOutletContext();
  const dispatch = useDispatch();
  const { interview, loading } = useSelector(state => state.interview);
  
  const [weekDays, setWeekDays] = useState([
    { day_id: 1, day_name: 'Monday', timeSlots: [{ from: "09:00", to: "18:00" }], isChecked: false },
    { day_id: 2, day_name: 'Tuesday', timeSlots: [{ from: "09:00", to: "18:00" }], isChecked: false },
    { day_id: 3, day_name: 'Wednesday', timeSlots: [{ from: "09:00", to: "17:00" }], isChecked: true },
    { day_id: 4, day_name: 'Thursday', timeSlots: [{ from: "09:00", to: "18:00" }], isChecked: false },
    { day_id: 5, day_name: 'Friday', timeSlots: [
      { from: "04:00", to: "02:00" },
      { from: "10:00", to: "12:00" }
    ], isChecked: true },
    { day_id: 6, day_name: 'Saturday', timeSlots: [{ from: "09:00", to: "18:00" }], isChecked: false },
    { day_id: 7, day_name: 'Sunday', timeSlots: [{ from: "09:00", to: "18:00" }], isChecked: false }
  ]);

  const formatDate = useCallback((date) => date.toISOString().split('T')[0], []);

  const isConsecutiveDate = useCallback((date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setDate(d1.getDate() + 1);
    return d1.toISOString().split('T')[0] === date2;
  }, []);

  const formatDateRanges = useCallback((dates) => {
    if (!dates.length) return [];
    
    const sortedDates = [...dates].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

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

  // دالة حفظ الأوقات المتاحة
  const handleSaveAvailableTimes = useCallback(async (formData) => {
    try {
      console.log('Saving available times:', formData);
      
      const payload = {
        available_times: formData.available_times
      };

      const result = await dispatch(updateAvailability(id, payload));
      
      if (result?.success || (result?.message && !result?.error)) {
        alert('تم حفظ الأوقات المتاحة بنجاح!');
        console.log(result);
        
        setIsEditing(false);
        return { success: true, message: result.message };
      } else {
        throw new Error(result?.message || "فشل في حفظ الأوقات");
      }
    } catch (error) {
      console.error("خطأ في حفظ الأوقات:", error);
      alert(`خطأ في حفظ الأوقات: ${error.message}`);
      return {      
        success: false, 
        message: error.message || "فشل في حفظ الأوقات" 
      };            
    }
  }, [dispatch, id]);

  // دالة حفظ الأوقات غير المتاحة
  const handleSaveUnAvailableTimes = useCallback(async (formData) => {
    try {
      console.log('Saving unavailable times:', formData);
      
      const payload = {
        un_available_times: formData.available_times // نفس الهيكل بس اسم مختلف
      };

      const result = await dispatch(updateUnAvailability(id, payload));
      
      if (result?.success || (result?.message && !result?.error)) {
        alert('تم حفظ الأوقات غير المتاحة بنجاح!');
        setIsEditing(false);
        return { success: true, message: result.message };
      } else {
        throw new Error(result?.message || "فشل في حفظ الأوقات غير المتاحة");
      }
    } catch (error) {
      console.error("خطأ في حفظ الأوقات غير المتاحة:", error);
      alert(`خطأ في حفظ الأوقات غير المتاحة: ${error.message}`);
      return {      
        success: false, 
        message: error.message || "فشل في حفظ الأوقات غير المتاحة" 
      };            
    }
  }, [dispatch, id]);

  // دالة حفظ التواريخ المتاحة
  const handleSaveAvailableDates = useCallback(async (formData) => {
    try {
      console.log('Saving available dates:', formData);
      
      if (!formData.available_dates || formData.available_dates.length === 0) {
        throw new Error("لا توجد تواريخ محددة للحفظ");
      }
  
      const payload = {
        available_dates: formData.available_dates
      };
  
      const result = await dispatch(updateAvailability(id, payload));
      console.log('API Result:', result);
      
      if (result?.success || result?.message === "Updated Successfully") {
        alert('تم حفظ التواريخ المتاحة بنجاح!');
        
        const newSelectedDates = [];
        formData.available_dates.forEach(range => {
          const startDate = new Date(range.from);
          const endDate = new Date(range.to);
          const currentDate = new Date(startDate);
          
          while (currentDate <= endDate) {
            newSelectedDates.push({ 
              date: currentDate.toISOString().split('T')[0] 
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        
        setSelectedDates(newSelectedDates);
        return { success: true, message: result.message };
      } else {
        throw new Error(result?.message || "فشل في حفظ التواريخ");
      }
    } catch (error) {
      console.error("خطأ في حفظ التواريخ:", error);
      throw error;
    }
  }, [dispatch, id]);

  // دالة حفظ التواريخ غير المتاحة
  const handleSaveUnAvailableDates = useCallback(async (formData) => {
    try {
      console.log('Saving unavailable dates:', formData);
      
      if (!formData.available_dates || formData.available_dates.length === 0) {
        throw new Error("لا توجد تواريخ محددة للحفظ");
      }
  
      const payload = {
        un_available_dates: formData.available_dates // نفس الهيكل بس اسم مختلف
      };
  
      const result = await dispatch(updateUnAvailability(id, payload));
      console.log('API Result:', result);
      
      if (result?.success || result?.message === "Updated Successfully") {
        alert('تم حفظ التواريخ غير المتاحة بنجاح!');
        
        const newSelectedDates = [];
        formData.available_dates.forEach(range => {
          const startDate = new Date(range.from);
          const endDate = new Date(range.to);
          const currentDate = new Date(startDate);
          
          while (currentDate <= endDate) {
            newSelectedDates.push({ 
              date: currentDate.toISOString().split('T')[0] 
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        
        setSelectedDates(newSelectedDates);
        return { success: true, message: result.message };
      } else {
        throw new Error(result?.message || "فشل في حفظ التواريخ غير المتاحة");
      }
    } catch (error) {
      console.error("خطأ في حفظ التواريخ غير المتاحة:", error);
      throw error;
    }
  }, [dispatch, id]);

  // دالة موحدة لحفظ الأوقات حسب النوع
  const handleSaveTimes = useCallback((formData) => {
    if (availabilityMode === 'available') {
      return handleSaveAvailableTimes(formData);
    } else {
      return handleSaveUnAvailableTimes(formData);
    }
  }, [availabilityMode, handleSaveAvailableTimes, handleSaveUnAvailableTimes]);

  // دالة موحدة لحفظ التواريخ حسب النوع
  const handleSaveDates = useCallback((formData) => {
    if (availabilityMode === 'available') {
      return handleSaveAvailableDates(formData);
    } else {
      return handleSaveUnAvailableDates(formData);
    }
  }, [availabilityMode, handleSaveAvailableDates, handleSaveUnAvailableDates]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setShowTabs(true); // Show tabs when any tab is clicked
    
    // تحديد نوع الـ availability حسب التاب
    if (tab === 'available-times' || tab === 'available-dates') {
      setAvailabilityMode('available');
    } else if (tab === 'unavailable-times' || tab === 'unavailable-dates') {
      setAvailabilityMode('unavailable');
    }
    
    // Automatically enter edit mode if switching to dates or unavailable modes
    if ((tab === 'available-dates' || tab === 'unavailable-dates' || tab === 'unavailable-times') && !isEditing) {
      setIsEditing(true);
    }
    
    setSelectedTimeDropdown(null);
  }, [isEditing]);

  const handleMonthChange = useCallback((direction) => {
    setCurrentMonth(prev => new Date(
      prev.getFullYear(), 
      prev.getMonth() + (direction === 'prev' ? -1 : 1), 
      1
    ));
  }, []);

  // Handle cancel and return to read-only view
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setAvailabilityMode('available');
    setActiveTab('available-times');
    setShowTabs(false); // Hide tabs when canceling
  }, []);

  // Handle edit button click
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setShowTabs(true); // Show tabs when editing
  }, []);

  // Render the appropriate view based on state
  if (isEditing || activeTab === 'available-dates' || activeTab === 'unavailable-dates') {
    return (
      <div className="max-w-4xl mx-auto border rounded-md overflow-hidden">
        {/* التابات المحدثة */}
        <div className="border-b flex">
          {availabilityMode === 'available' ? (
            <>
              <button 
                onClick={() => handleTabChange('available-times')} 
                className={`px-4 py-2 ${activeTab === 'available-times' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
              >
                Available Times
              </button>
              <button 
                onClick={() => handleTabChange('available-dates')} 
                className={`px-4 py-2 ${activeTab === 'available-dates' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
              >
                Available Dates
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleTabChange('unavailable-times')} 
                className={`px-4 py-2 ${activeTab === 'unavailable-times' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
              >
                Unavailable Times
              </button>
              <button 
                onClick={() => handleTabChange('unavailable-dates')} 
                className={`px-4 py-2 ${activeTab === 'unavailable-dates' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
              >
                Unavailable Dates
              </button>
            </>
          )}
        </div>
       
        {/* عرض TimeSection للأوقات */}
        {(activeTab === 'available-times' || activeTab === 'unavailable-times') ? (
          <TimeSection 
            timeZone={timeZone} 
            weekDays={weekDays} 
            selectedTimeDropdown={selectedTimeDropdown}
            handleTimeDropdownToggle={setSelectedTimeDropdown}
            handleSave={handleSaveTimes} // الدالة الموحدة
            onUpdateWeekDays={setWeekDays}
            onCancel={handleCancel} // Updated cancel handler
            getInterviewData={interview}
            availabilityMode={availabilityMode}
          />
        ) : (
          /* عرض CalendarSection للتواريخ */
          <CalendarSection 
            timeZone={timeZone}
            currentMonth={currentMonth}
            selectedDates={selectedDates}
            goToPreviousMonth={() => handleMonthChange('prev')}
            goToNextMonth={() => handleMonthChange('next')}
            handleDateClick={setSelectedDates}
            handleSave={handleSaveDates}
            getInterviewData={interview}
            availabilityMode={availabilityMode} 
            onCancel={handleCancel}
          />
        )}
      </div>
    );
  } else {
    return (
      <ReadOnlyView 
        sections={[
          { id: 'working-hours', title: 'Working Hours', description: 'Set weekly available days and hours.', expandable: true },
          { id: 'special-hours', title: 'Special Working Hours', description: 'Add extra available days or hours.', expandable: true },
          { id: 'unavailability', title: 'Unavailability', description: 'Add extra unavailable days or hours.', expandable: false }
        ]}
        activeTab={activeTab}
        handleTabChange={handleTabChange} 
        onEdit={handleEdit} 
        availabilityMode={availabilityMode}
        showTabs={showTabs} 
      />
    );
  }
};

export default InterviewAvailability;