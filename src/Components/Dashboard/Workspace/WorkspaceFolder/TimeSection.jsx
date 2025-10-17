import { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { editWorkspaceById } from '../../../../redux/apiCalls/workspaceCallApi';import toast from "react-hot-toast";

const TimeSection = ({ 
  timeZone, 
  weekDays: initialWeekDays, 
  selectedTimeDropdown,
  handleTimeDropdownToggle,
  handleSave,
  onUpdateWeekDays,
  onCancel,
  availabilityMode = 'available',
  isTimeSectionDisabled,
}) => {
  const [weekDays, setWeekDays] = useState(initialWeekDays);
  const [isEditMode, setIsEditMode] = useState(true);
  const [displayWeekDays, setDisplayWeekDays] = useState([]);
  
  const { workspace } = useSelector(state => state.workspace);
   const id = workspace ? workspace.id : 0;
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(editWorkspaceById(id));
    }
  }, [id, dispatch]);

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
    if (workspace) {
      const timeSource = availabilityMode === 'available' 
        ? workspace.available_times 
        : workspace.un_available_times;
  
      if (timeSource && timeSource.length > 0) {
        const groupedByDay = timeSource.reduce((acc, item) => {
          if (!acc[item.day_id]) {
            acc[item.day_id] = [];
          }
          acc[item.day_id].push({
            from: item.from.substring(0, 5),
            to: item.to.substring(0, 5)
          });
          return acc;
        }, {});
  
        const convertedWeekDays = [1, 2, 3, 4, 5, 6, 7].map(dayId => {
          const dayTimeSlots = groupedByDay[dayId];
          
          if (dayTimeSlots && dayTimeSlots.length > 0) {
            return {
              day_id: dayId,
              day_name: dayIdToName[dayId],
              timeSlots: dayTimeSlots,
              isChecked: true
            };
          } else {
            return {
              day_id: dayId,
              day_name: dayIdToName[dayId],
              timeSlots: [],
              isChecked: false
            };
          }
        });
  
        setDisplayWeekDays(convertedWeekDays);
        setWeekDays(convertedWeekDays);
      } else {
        const defaultWeekDays = [1, 2, 3, 4, 5, 6, 7].map(dayId => ({
          day_id: dayId,
          day_name: dayIdToName[dayId],
          timeSlots: [],
          isChecked: false
        }));
        
        setDisplayWeekDays(defaultWeekDays);
        setWeekDays(defaultWeekDays);
      }
    }
  }, [workspace, availabilityMode]);

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
      
      if (handleSave) {
        const result = await handleSave({ 
          [availabilityMode === 'available' ? 'available_times' : 'un_available_times']: available_times 
        });
        
        if (result && result.success) {
          setDisplayWeekDays([...weekDays]);
          await dispatch(editWorkspaceById(id));
        } else {
          throw new Error('Save operation did not return success');
        }
      }
    } catch (error) {
      toast.error(`Error saving times: ${error.message || 'An unexpected error occurred'}`);
      console.log();
      
    }
  };

  const generateTimeOptions = (isToField = false, fromTime = null) => {
    const options = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        if (isToField && fromTime) {
          const [fromHour, fromMinute] = fromTime.split(':').map(Number);
          const [currentHour, currentMinute] = [hour, minute];
          
          if (currentHour > fromHour || (currentHour === fromHour && currentMinute > fromMinute)) {
            options.push(timeString);
          }
        } else if (!isToField) {
          options.push(timeString);
        }
      }
    }
    
    return options;
  };

  const addTimeSlot = (dayId) => {
    if (isTimeSectionDisabled) return;
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
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

  const removeTimeSlot = (dayId, slotIndex) => {
    if (isTimeSectionDisabled) return;
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

  const applyToAll = () => {
    if (isTimeSectionDisabled) return;
    const firstDay = weekDays[0];
    if (!firstDay) return;
    
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === firstDay.day_id) return day;
      return {
        ...day,
        timeSlots: JSON.parse(JSON.stringify(firstDay.timeSlots)),
        isChecked: firstDay.isChecked
      };
    });
    setWeekDays(updatedWeekDays);
  };

  const handleTimeChange = (dayId, slotIndex, field, newValue) => {
    if (isTimeSectionDisabled) return;
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
        const newTimeSlots = [...day.timeSlots];
        const currentSlot = { ...newTimeSlots[slotIndex] };
        
        if (field === 'from') {
          currentSlot.from = newValue;
          
          const [fromHour, fromMinute] = newValue.split(':').map(Number);
          const [toHour, toMinute] = currentSlot.to.split(':').map(Number);
          
          if (toHour < fromHour || (toHour === fromHour && toMinute <= fromMinute)) {
            const newToHour = fromMinute === 30 ? fromHour + 1 : fromHour;
            const newToMinute = fromMinute === 30 ? 0 : fromMinute + 30;
            
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

  const handleDayToggle = (dayId) => {
    if (isTimeSectionDisabled) return;
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
        const updatedDay = { ...day, isChecked: !day.isChecked };
        
        if (updatedDay.isChecked && updatedDay.timeSlots.length === 0) {
          updatedDay.timeSlots = [{ from: "09:00", to: "17:00" }];
        }
        
        return updatedDay;
      }
      return day;
    });
    setWeekDays(updatedWeekDays);
  };

  const handleCancelClick = () => {
    if (isTimeSectionDisabled) return;
    if (onCancel) {
      onCancel();
    }
  };

  const TimeDropdown = ({ value, dayId, slotIndex, field }) => {
    const dropdownId = `${field}-${dayId}-${slotIndex}`;
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    
    const currentDay = weekDays.find(day => day.day_id === dayId);
    const currentSlot = currentDay?.timeSlots[slotIndex];
    
    const timeOptions = field === 'to' 
      ? generateTimeOptions(true, currentSlot?.from)
      : generateTimeOptions(false);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          handleTimeDropdownToggle(null);
        }
      };

      if (selectedTimeDropdown === dropdownId) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [selectedTimeDropdown, dropdownId]);

    const handleToggle = () => {
      if (isTimeSectionDisabled) return;
      handleTimeDropdownToggle(selectedTimeDropdown === dropdownId ? null : dropdownId);
    };

    const menuPositionClass = [6, 7].includes(dayId) 
      ? 'bottom-full mb-1' 
      : 'top-full mt-1';

    return (
      <div ref={containerRef} className="relative w-20">
        <button 
          ref={buttonRef}
          onClick={handleToggle}
          className={`flex items-center justify-between w-full px-3 py-2 text-left border rounded-md bg-white transition-colors duration-200 ${
            isTimeSectionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          disabled={isTimeSectionDisabled}
        >
          <span className="text-sm">{value}</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${selectedTimeDropdown === dropdownId ? 'transform rotate-180' : ''}`} />
        </button>
        
        {selectedTimeDropdown === dropdownId && !isTimeSectionDisabled && (
          <div 
            className={`absolute z-30 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${menuPositionClass}`}
            style={{ minWidth: '80px' }}
          >
            {timeOptions.length > 0 ? (
              timeOptions.map((option, idx) => (
                <div 
                  key={idx} 
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors duration-150"
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div>
            {/* <h3 className="font-medium">
              {availabilityMode === 'available' ? 'Working Hours' : 'Unavailable Hours'}
            </h3>
            <p className="text-sm text-gray-500">
              {availabilityMode === 'available' ? 
                'Set weekly available days and hours.' : 
                'Set weekly unavailable days and hours.'
              }
            </p> */}
          </div>
        </div>
        {isEditMode && (
          <div className="flex space-x-2">
            <button 
              onClick={handleCancelClick}
              className={`px-4 py-1 border border-gray-300 rounded-md text-gray-700 transition-colors duration-200 ${
                isTimeSectionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              disabled={isTimeSectionDisabled}
            >
              <span className='text-sm'>Cancel</span>
            </button>
            <button 
              onClick={handleSaveAndSubmit}
              className={`px-4 py-1 text-white rounded-md shadow-sm flex items-center transition-colors duration-200 ${
                availabilityMode === 'available' ? 
                'bg-blue-600 hover:bg-blue-700' : 
                'bg-red-600 hover:bg-red-700'
              } ${isTimeSectionDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isTimeSectionDisabled}
            >
              <Send size={16} className="mr-2" />
              <span className='text-sm'>Save</span>
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          {weekDays.map((day) => (
            <div key={day.day_id} className="flex">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={day.isChecked} 
                  onChange={() => handleDayToggle(day.day_id)} 
                  className={`w-3 h-3 rounded border-gray-300 cursor-pointer ${
                    isTimeSectionDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isTimeSectionDisabled}
                />
                <span className="w-24 text-sm">{dayIdToName[day.day_id]}</span>
              </div>
              <div className='flex flex-col gap-1'>
                {day.isChecked && day.timeSlots.map((slot, slotIndex) => (
                  <div key={`${day.day_id}-${slotIndex}`} className="flex items-center gap-2 ml-8 text-xs">
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

                    {day.day_id === 1 && slotIndex === 0 && (
                      <>
                        <button 
                          onClick={() => addTimeSlot(day.day_id)}
                          className={`border rounded-md w-8 h-8 flex items-center justify-center text-indigo-600 transition-colors duration-200 ${
                            isTimeSectionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                          }`}
                          disabled={isTimeSectionDisabled}
                        >
                          +
                        </button>
                        <span 
                          className={`text-indigo-600 cursor-pointer ml-1 hover:underline ${
                            isTimeSectionDisabled ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          onClick={applyToAll}
                        >
                          Apply to all
                        </span>
                      </>
                    )}

                    {day.timeSlots.length > 1 && (
                      <button 
                        onClick={() => removeTimeSlot(day.day_id, slotIndex)}
                        className={`border rounded-md w-8 h-8 flex items-center justify-center text-red-600 transition-colors duration-200 ${
                          isTimeSectionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                        disabled={isTimeSectionDisabled}
                      >
                        <X size={16} />
                      </button>
                    )}

                    {slotIndex === day.timeSlots.length - 1 && (
                      <button 
                        onClick={() => addTimeSlot(day.day_id)}
                        className={`border rounded-md w-8 h-8 flex items-center justify-center text-indigo-600 transition-colors duration-200 ${
                          isTimeSectionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                        disabled={isTimeSectionDisabled}
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-gray-600 text-sm">
        Configure {availabilityMode} working hours
      </div>
    </div>
  );
};

export default TimeSection;