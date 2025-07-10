import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, X, Edit, Send } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewById } from '../../../../../redux/apiCalls/interviewCallApi';

const TimeSection = ({ 
  timeZone, 
  weekDays: initialWeekDays, 
  selectedTimeDropdown,
  handleTimeDropdownToggle,
  handleSave,
  onUpdateWeekDays,
  onCancel,
  availabilityMode = 'available'
}) => {
  const [isWorkingHoursEnabled, setIsWorkingHoursEnabled] = useState(true);
  const [weekDays, setWeekDays] = useState(initialWeekDays);
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayWeekDays, setDisplayWeekDays] = useState([]);
  
  const { interview, loading } = useSelector(state => state.interview);
  const { id } = useOutletContext();
  const dispatch = useDispatch();
console.log(displayWeekDays);

  useEffect(() => {
    if (id) {
      dispatch(editInterviewById(id));
    }
  }, [id, dispatch]);

  // Day ID to name mapping
  const dayIdToName = {
    1: 'Sunday',
    2: 'Monday', 
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday',
  };

  useEffect(() => {
    if (interview) {
      const timeSource = availabilityMode === 'available' 
        ? interview.available_times 
        : interview.un_available_times;
  
      if (timeSource && timeSource.length > 0) {
        // Group time slots by day_id
        const groupedByDay = timeSource.reduce((acc, item) => {
          if (!acc[item.day_id]) {
            acc[item.day_id] = [];
          }
          acc[item.day_id].push({
            from: item.from.substring(0, 5), // Remove seconds (09:00:00 -> 09:00)
            to: item.to.substring(0, 5)     // Remove seconds (17:00:00 -> 17:00)
          });
          return acc;
        }, {});
  
        const convertedWeekDays = [1, 2, 3, 4, 5, 6, 7].map(dayId => {
          const dayTimeSlots = groupedByDay[dayId];
          
          if (dayTimeSlots && dayTimeSlots.length > 0) {
            return {
              day_id: dayId,
              day_name: dayIdToName[dayId],
              timeSlots: dayTimeSlots, // Use actual data from API
              isChecked: true
            };
          } else {
            return {
              day_id: dayId,
              day_name: dayIdToName[dayId],
              timeSlots: [{ from: "09:00", to: "17:00" }], // Default only for unchecked days
              isChecked: false
            };
          }
        });
  
        setDisplayWeekDays(convertedWeekDays);
        
        if (!isEditMode) {
          setWeekDays(convertedWeekDays);
        }
      } else {
        // No data from API - set all days as unchecked with default times
        const defaultWeekDays = [1, 2, 3, 4, 5, 6, 7].map(dayId => ({
          day_id: dayId,
          day_name: dayIdToName[dayId],
          timeSlots: [{ from: "09:00", to: "17:00" }],
          isChecked: false
        }));
        
        setDisplayWeekDays(defaultWeekDays);
        if (!isEditMode) {
          setWeekDays(defaultWeekDays);
        }
      }
    }
  }, [interview, availabilityMode, isEditMode]);
  useEffect(() => {
    if (onUpdateWeekDays) {
      onUpdateWeekDays(weekDays);
    }
  }, [weekDays, onUpdateWeekDays]);

  const handleSaveAndSubmit = async () => {
    try {
      const available_times = weekDays
        .filter(day => day.isChecked)
        .map(day => ({
          day_id: day.day_id,
          times: day.timeSlots.map(slot => ({
            from: slot.from,
            to: slot.to,
          }))
        }));
      
      console.log("Time data to be saved:", available_times);
      
      if (handleSave) {
        const result = await handleSave({ available_times });
        
        if (result && result.success) {
          setDisplayWeekDays([...weekDays]);
          
          await dispatch(editInterviewById(id));
          
          setIsEditMode(false);
        }
      }
    } catch (error) {
      console.error("Error saving time data:", error);
      alert(`خطأ في حفظ الأوقات: ${error.message || 'حدث خطأ غير متوقع'}`);
    }
  };

  // Generate time options in 24-hour format (HH:mm)
  const generateTimeOptions = (isToField = false, fromTime = null) => {
    const options = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // 30-minute intervals
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // If this is a "to" field and we have a "from" time, filter options
        if (isToField && fromTime) {
          const [fromHour, fromMinute] = fromTime.split(':').map(Number);
          const [currentHour, currentMinute] = [hour, minute];
          
          // Only show times after the "from" time
          if (currentHour > fromHour || (currentHour === fromHour && currentMinute > fromMinute)) {
            options.push(timeString);
          }
        } else if (!isToField) {
          // For "from" field, show all options
          options.push(timeString);
        }
      }
    }
    
    return options;
  };
  const timeOptions = generateTimeOptions();

  // Handle adding a new time slot to a specific day
  const addTimeSlot = (dayId) => {
    if (!isEditMode) return;
    
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
        // استخدام آخر time slot في نفس اليوم كـ template بدلاً من القيم الافتراضية
        const lastTimeSlot = day.timeSlots[day.timeSlots.length - 1];
        const newTimeSlot = { 
          from: lastTimeSlot ? lastTimeSlot.from : "09:00", 
          to: lastTimeSlot ? lastTimeSlot.to : "17:00" 
        };
        const newTimeSlots = [...day.timeSlots, newTimeSlot];
        return { ...day, timeSlots: newTimeSlots };
      }
      return day;
    });
    setWeekDays(updatedWeekDays);
  };

  // Handle removing a time slot from a specific day
  const removeTimeSlot = (dayId, slotIndex) => {
    if (!isEditMode) return;
    if (weekDays.find(d => d.day_id === dayId)?.timeSlots.length <= 1) return;
    
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
        const newTimeSlots = [...day.timeSlots];
        newTimeSlots.splice(slotIndex, 1);
        return { ...day, timeSlots: newTimeSlots };
      }
      return day;
    });
    setWeekDays(updatedWeekDays);
  };

  // تحديث دالة applyToAll لتطبيق القيم الفعلية من اليوم الأول
  const applyToAll = () => {
    if (!isEditMode) return;
    
    const firstDay = weekDays[0];
    if (!firstDay) return;
    
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === firstDay.day_id) return day;
      return {
        ...day,
        // نسخ القيم الفعلية من اليوم الأول بدلاً من القيم الافتراضية
        timeSlots: JSON.parse(JSON.stringify(firstDay.timeSlots)),
        // إذا كان اليوم الأول محدد، نحدد باقي الأيام أيضاً
        isChecked: firstDay.isChecked
      };
    });
    setWeekDays(updatedWeekDays);
  };

  const handleTimeChange = (dayId, slotIndex, field, newValue) => {
    if (!isEditMode) return;
    
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
        const newTimeSlots = [...day.timeSlots];
        const currentSlot = { ...newTimeSlots[slotIndex] };
        
        if (field === 'from') {
          currentSlot.from = newValue;
          
          // Check if current "to" time is now invalid (before or equal to new "from" time)
          const [fromHour, fromMinute] = newValue.split(':').map(Number);
          const [toHour, toMinute] = currentSlot.to.split(':').map(Number);
          
          if (toHour < fromHour || (toHour === fromHour && toMinute <= fromMinute)) {
            // Reset "to" time to 30 minutes after "from" time
            const newToHour = fromMinute === 30 ? fromHour + 1 : fromHour;
            const newToMinute = fromMinute === 30 ? 0 : fromMinute + 30;
            
            // Make sure we don't exceed 23:59
            if (newToHour < 24) {
              currentSlot.to = `${newToHour.toString().padStart(2, '0')}:${newToMinute.toString().padStart(2, '0')}`;
            } else {
              currentSlot.to = "23:59";
            }
          }
        } else {
          currentSlot.to = newValue;
        }
        
        newTimeSlots[slotIndex] = currentSlot;
        return { ...day, timeSlots: newTimeSlots };
      }
      return day;
    });
    
    setWeekDays(updatedWeekDays);
  };

  // Handle day checkbox toggle
  const handleDayToggle = (dayId) => {
    if (!isEditMode) return;
    
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
        // عند تحديد يوم جديد، نحتفظ بآخر قيم تم تعديلها في ذلك اليوم
        // أو نستخدم القيم الحالية الموجودة
        return { ...day, isChecked: !day.isChecked };
      }
      return day;
    });
    setWeekDays(updatedWeekDays);
  };

  // Handle edit mode toggle
  const handleEditClick = () => {
    setIsEditMode(true);
    if (displayWeekDays.length > 0) {
      setWeekDays([...displayWeekDays]);
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    if (displayWeekDays.length > 0) {
      // استرجاع القيم المحفوظة الأصلية عند الإلغاء
      setWeekDays([...displayWeekDays]);
    }
    if (onCancel) {
      onCancel();
    }
  };

  const currentWeekDays = isEditMode ? weekDays : displayWeekDays;
  const TimeDropdown = ({ value, dayId, slotIndex, field }) => {
    const dropdownId = `${field}-${dayId}-${slotIndex}`;
    
    // Get the current time slot to determine filtering
    const currentDay = weekDays.find(day => day.day_id === dayId);
    const currentSlot = currentDay?.timeSlots[slotIndex];
    
    // Generate appropriate options based on field type
    const timeOptions = field === 'to' 
      ? generateTimeOptions(true, currentSlot?.from)
      : generateTimeOptions(false);
    
    return (
      <div className="relative">
        <button 
          onClick={() => isEditMode && handleTimeDropdownToggle(dropdownId)}
          className={`flex items-center justify-between w-full px-3 py-2 text-left border rounded-md bg-white ${
            !isEditMode ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!isEditMode}
        >
          <span>{value}</span>
          <ChevronDown size={16} className={`transition-transform ${selectedTimeDropdown === dropdownId ? 'transform rotate-180' : ''}`} />
        </button>
        
        {selectedTimeDropdown === dropdownId && isEditMode && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 border-b">
              <div className="flex items-center px-2 py-1 border rounded-md bg-white">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full outline-none text-sm"
                  autoFocus
                />
              </div>
            </div>
            {timeOptions.length > 0 ? (
              timeOptions.map((option, idx) => (
                <div 
                  key={idx} 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleTimeChange(dayId, slotIndex, field, option);
                    handleTimeDropdownToggle(null);
                  }}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No available times
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {!isEditMode && (
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {availabilityMode === 'available' ? 'Available Times' : 'Unavailable Times'}
            </h2>
            <p className="text-gray-500">
              {availabilityMode === 'available' ? 
                'Set weekly available days and hours' : 
                'Set weekly unavailable days and hours'
              }
            </p>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={handleEditClick}
              className={`px-4 py-2 text-white rounded-md shadow-sm flex items-center ${
                availabilityMode === 'available' ? 
                'bg-blue-600 hover:bg-blue-700' : 
                'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Show action buttons only when in edit mode */}
      {isEditMode && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={isWorkingHoursEnabled} 
              onChange={() => setIsWorkingHoursEnabled(!isWorkingHoursEnabled)} 
              className="w-4 h-4 rounded border-gray-300" 
            />
            <div>
              <h3 className="font-medium">
                {availabilityMode === 'available' ? 'Working Hours' : 'Unavailable Hours'}
              </h3>
              <p className="text-sm text-gray-500">
                {availabilityMode === 'available' ? 
                  'Set weekly available days and hours.' : 
                  'Set weekly unavailable days and hours.'
                }
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleCancelClick}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveAndSubmit}
              className={`px-4 py-2 text-white rounded-md shadow-sm flex items-center ${
                availabilityMode === 'available' ? 
                'bg-blue-600 hover:bg-blue-700' : 
                'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Send size={16} className="mr-2" />
              Save
            </button>
          </div>
        </div>
      )}

      <div className="border rounded-lg p-4">
        <div className="mb-4">
          <div className="relative">
            <button className="flex items-center justify-between w-full px-3 py-2 text-left border rounded-md bg-white">
              <span>{timeZone}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {currentWeekDays.map((day) => (
            <div key={day.day_id} className="space-y-2">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={day.isChecked} 
                  onChange={() => handleDayToggle(day.day_id)} 
                  className="w-4 h-4 rounded border-gray-300"
                  disabled={!isEditMode}
                />
                <span className="w-24">{dayIdToName[day.day_id]}</span>
              </div>
              
              {day.isChecked && day.timeSlots.map((slot, slotIndex) => (
                <div key={`${day.day_id}-${slotIndex}`} className="flex items-center gap-2 ml-8">
                  <TimeDropdown 
                    value={slot.from}
                    dayId={day.day_id}
                    slotIndex={slotIndex}
                    field="from"
                  />
                  
                  <span>—</span>
                  
                  <TimeDropdown 
                    value={slot.to}
                    dayId={day.day_id}
                    slotIndex={slotIndex}
                    field="to"
                  />

                  {isEditMode && day.day_id === 1 && slotIndex === 0 && (
                    <>
                      <button 
                        onClick={() => addTimeSlot(day.day_id)}
                        className="border rounded-md w-8 h-8 flex items-center justify-center text-indigo-600"
                      >
                        +
                      </button>
                      <span 
                        className="text-indigo-600 cursor-pointer ml-1"
                        onClick={applyToAll}
                      >
                        Apply to all
                      </span>
                    </>
                  )}

                  {isEditMode && day.timeSlots.length > 1 && (
                    <button 
                      onClick={() => removeTimeSlot(day.day_id, slotIndex)}
                      className="border rounded-md w-8 h-8 flex items-center justify-center text-red-600"
                    >
                      <X size={16} />
                    </button>
                  )}

                  {isEditMode && slotIndex === day.timeSlots.length - 1 && (
                    <button 
                      onClick={() => addTimeSlot(day.day_id)}
                      className="border rounded-md w-8 h-8 flex items-center justify-center text-indigo-600"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-gray-600 text-sm">
        {isEditMode ? (
          `Configure ${availabilityMode} working hours`
        ) : (
          `${availabilityMode === 'available' ? 'Available' : 'Unavailable'} working hours configured`
        )}
      </div>
    </div>
  );
};

export default TimeSection;