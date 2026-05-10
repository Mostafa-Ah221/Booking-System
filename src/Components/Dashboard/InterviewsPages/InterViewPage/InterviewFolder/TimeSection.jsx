import { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Send } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewById } from '../../../../../redux/apiCalls/interviewCallApi';
import TimezoneSelect from 'react-timezone-select';
import toast from "react-hot-toast";

const TimeSection = ({ 
  timeZone, 
  onTimeZoneChange,
  weekDays: initialWeekDays, 
  selectedTimeDropdown,
  handleTimeDropdownToggle,
  handleSave,
  onUpdateWeekDays,
  onCancel,
  availabilityMode = 'available',
  isTimeSectionDisabled,
  getWorkspaceData,
}) => {
  const [weekDays, setWeekDays] = useState(initialWeekDays);
  const [isEditMode, setIsEditMode] = useState(true);
  const [displayWeekDays, setDisplayWeekDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [localWorkspaceData, setLocalWorkspaceData] = useState(null);
  const timezoneRef = useRef(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const { interview, loading } = useSelector(state => state.interview);
  const { id } = useOutletContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(editInterviewById(id));
    }
  }, [id]);

  useEffect(() => {
    if (!interview?.workspace_id) return;

    const token = localStorage.getItem("access_token");

    fetch(`https://backend-booking.appointroll.com/api/workspace/edit/${interview.workspace_id}`, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
      .then(data => {
        const workspaceResult = data?.data?.workspace || data?.workspace || data?.data || data;
        setLocalWorkspaceData(workspaceResult);
      })
      .catch(err => {
        console.error("Failed to fetch workspace data:", err);
      });
  }, [interview?.workspace_id]);

  const activeWorkspaceData = localWorkspaceData || getWorkspaceData;

  // ✅ workspace timezone
  const workspaceTimezone = activeWorkspaceData?.available_times_time_zone;

  const dayIdToName = {
    1: 'Sunday',
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday',
  };

  const getWorkspaceAllowedDayIds = () => {
    const source = activeWorkspaceData?.available_times || [];
    return source.map(item => Number(item.day_id));
  };

  const getWorkspaceDefaultSlot = (dayId) => {
    const source = activeWorkspaceData?.available_times || [];
    const workspaceDay = source.find(item => Number(item.day_id) === dayId);
    if (!workspaceDay) return { from: '09:00', to: '17:00' };
    return {
      from: workspaceDay.from.substring(0, 5),
      to: workspaceDay.to.substring(0, 5),
    };
  };

  useEffect(() => {
    if (!interview || hasLoadedOnce) return;
    if (!activeWorkspaceData) return;

    // ✅ workspace timezone له الأولوية دايماً
    const wsTimezone = activeWorkspaceData?.available_times_time_zone;
    const interviewTimezone = availabilityMode === 'available'
      ? interview.available_times_time_zone
      : interview.un_available_times_time_zone;

    const timezoneValue = wsTimezone || interviewTimezone;
    if (timezoneValue && onTimeZoneChange) {
      onTimeZoneChange(timezoneValue);
    }

    const timeSource = availabilityMode === 'available'
      ? interview.available_times
      : interview.un_available_times;

    const source = activeWorkspaceData?.available_times || [];

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.substring(0, 5).split(':').map(Number);
      return h * 60 + m;
    };

    let convertedWeekDays;

    if (timeSource && timeSource.length > 0) {
      const groupedByDay = timeSource.reduce((acc, item) => {
        if (!acc[item.day_id]) acc[item.day_id] = [];
        acc[item.day_id].push({
          from: item.from.substring(0, 5),
          to: item.to.substring(0, 5)
        });
        return acc;
      }, {});

      convertedWeekDays = [1, 2, 3, 4, 5, 6, 7].map(dayId => {
        const dayTimeSlots = groupedByDay[dayId];
        if (dayTimeSlots && dayTimeSlots.length > 0) {
          return {
            day_id: dayId,
            day_name: dayIdToName[dayId],
            timeSlots: dayTimeSlots,
            isChecked: true
          };
        }
        return {
          day_id: dayId,
          day_name: dayIdToName[dayId],
          timeSlots: [],
          isChecked: false
        };
      });
    } else {
      convertedWeekDays = [1, 2, 3, 4, 5, 6, 7].map(dayId => ({
        day_id: dayId,
        day_name: dayIdToName[dayId],
        timeSlots: [],
        isChecked: false
      }));
    }

    const correctedWeekDays = convertedWeekDays.map(day => {
      const workspaceDay = source.find(item => Number(item.day_id) === day.day_id);
      if (!workspaceDay || !day.isChecked) return day;

      const wsFrom = toMinutes(workspaceDay.from);
      const wsTo = toMinutes(workspaceDay.to);

      const correctedSlots = day.timeSlots.map(slot => {
        let newFrom = slot.from;
        let newTo = slot.to;

        if (wsTo > wsFrom) {
          if (toMinutes(slot.from) < wsFrom || toMinutes(slot.from) > wsTo) {
            newFrom = workspaceDay.from.substring(0, 5);
          }
          if (toMinutes(slot.to) > wsTo || toMinutes(slot.to) <= toMinutes(newFrom)) {
            newTo = workspaceDay.to.substring(0, 5);
          }
        }

        return { from: newFrom, to: newTo };
      });

      return { ...day, timeSlots: correctedSlots };
    });

    setDisplayWeekDays(correctedWeekDays);
    setWeekDays(correctedWeekDays);
    setHasLoadedOnce(true);
  }, [interview, activeWorkspaceData, availabilityMode, hasLoadedOnce]);

  useEffect(() => {
    if (onUpdateWeekDays) {
      onUpdateWeekDays(weekDays);
    }
  }, [weekDays, onUpdateWeekDays]);

  const handleSaveAndSubmit = async () => {
    try {
      setIsSaving(true);

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
        const formData = {
          // ✅ استخدم workspace timezone لو موجود
          time_zone: workspaceTimezone || (typeof timeZone === 'object' ? timeZone.value : timeZone)
        };

        if (availabilityMode === 'available') {
          formData.available_times = available_times;
        } else {
          formData.un_available_times = available_times;
        }

        const result = await handleSave(formData);

        if (result && result.success) {
          setDisplayWeekDays([...weekDays]);
          await dispatch(editInterviewById(id));
        }
      }
    } catch (error) {
      toast.error(`Error saving times: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const generateTimeOptions = (isToField = false, fromTime = null, dayId = null) => {
    const options = [];
    const source = activeWorkspaceData?.available_times || [];
    const workspaceDay = dayId ? source.find(item => Number(item.day_id) === dayId) : null;

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.substring(0, 5).split(':').map(Number);
      return h * 60 + m;
    };

    const wsFrom = workspaceDay ? toMinutes(workspaceDay.from) : 0;
    const wsTo = workspaceDay ? toMinutes(workspaceDay.to) : 23 * 60 + 30;

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const currentMinutes = hour * 60 + minute;

        if (workspaceDay) {
          if (wsTo > wsFrom) {
            if (currentMinutes < wsFrom || currentMinutes > wsTo) continue;
          } else if (wsTo < wsFrom) {
            if (currentMinutes < wsFrom && currentMinutes > wsTo) continue;
          }
        }

        if (isToField && fromTime) {
          const fromMinutes = toMinutes(fromTime);
          if (currentMinutes <= fromMinutes) continue;
        }

        options.push(timeString);
      }
    }

    return options;
  };

  const addTimeSlot = (dayId) => {
    if (isTimeSectionDisabled || isSaving) return;
    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
        const lastTimeSlot = day.timeSlots[day.timeSlots.length - 1];
        const defaultSlot = getWorkspaceDefaultSlot(dayId);
        const newTimeSlot = {
          from: lastTimeSlot ? lastTimeSlot.from : defaultSlot.from,
          to: lastTimeSlot ? lastTimeSlot.to : defaultSlot.to
        };
        return { ...day, timeSlots: [...day.timeSlots, newTimeSlot] };
      }
      return day;
    });
    setWeekDays(updatedWeekDays);
  };

  const removeTimeSlot = (dayId, slotIndex) => {
    if (isTimeSectionDisabled || isSaving) return;
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
    if (isTimeSectionDisabled || isSaving) return;
    const firstDay = weekDays[0];
    if (!firstDay) return;

    const allowedDayIds = getWorkspaceAllowedDayIds();

    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === firstDay.day_id) return day;
      if (availabilityMode === 'available' && !allowedDayIds.includes(day.day_id)) return day;
      return {
        ...day,
        timeSlots: JSON.parse(JSON.stringify(firstDay.timeSlots)),
        isChecked: firstDay.isChecked
      };
    });
    setWeekDays(updatedWeekDays);
  };

  const handleTimeChange = (dayId, slotIndex, field, newValue) => {
    if (isTimeSectionDisabled || isSaving) return;
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
            currentSlot.to = newToHour < 24
              ? `${newToHour.toString().padStart(2, '0')}:${newToMinute.toString().padStart(2, '0')}`
              : '24:00';
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
    if (isTimeSectionDisabled || isSaving) return;

    if (availabilityMode === 'available') {
      const allowedDayIds = getWorkspaceAllowedDayIds();
      if (!allowedDayIds.includes(dayId)) return;
    }

    const updatedWeekDays = weekDays.map(day => {
      if (day.day_id === dayId) {
        const updatedDay = { ...day, isChecked: !day.isChecked };
        if (updatedDay.isChecked && updatedDay.timeSlots.length === 0) {
          const defaultSlot = getWorkspaceDefaultSlot(dayId);
          updatedDay.timeSlots = [defaultSlot];
        }
        return updatedDay;
      }
      return day;
    });
    setWeekDays(updatedWeekDays);
  };

  const handleCancelClick = () => {
    if (isTimeSectionDisabled || isSaving) return;
    if (onCancel) onCancel();
  };

  const isDayDisabledByWorkspace = (dayId) => {
    if (availabilityMode !== 'available') return false;
    const allowedDayIds = getWorkspaceAllowedDayIds();
    return !allowedDayIds.includes(dayId);
  };

  const TimeDropdown = ({ value, dayId, slotIndex, field }) => {
    const dropdownId = `${field}-${dayId}-${slotIndex}`;
    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    const currentDay = weekDays.find(day => day.day_id === dayId);
    const currentSlot = currentDay?.timeSlots[slotIndex];

    const timeOptions = field === 'to'
      ? generateTimeOptions(true, currentSlot?.from, dayId)
      : generateTimeOptions(false, null, dayId);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          handleTimeDropdownToggle(null);
        }
      };
      if (selectedTimeDropdown === dropdownId) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [selectedTimeDropdown, dropdownId]);

    const handleToggle = () => {
      if (isTimeSectionDisabled || isSaving) return;
      handleTimeDropdownToggle(selectedTimeDropdown === dropdownId ? null : dropdownId);
    };

    const menuPositionClass = [6, 7].includes(dayId) ? 'bottom-full mb-1' : 'top-full mt-1';

    return (
      <div ref={containerRef} className="relative w-full sm:w-20">
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className={`flex items-center justify-between w-full px-2 sm:px-3 py-2 text-left border rounded-md bg-white transition-colors duration-200 ${
            isTimeSectionDisabled || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          disabled={isTimeSectionDisabled || isSaving}
        >
          <span className="text-xs sm:text-sm">{value}</span>
          <ChevronDown size={14} className={`transition-transform duration-200 sm:w-4 sm:h-4 ${selectedTimeDropdown === dropdownId ? 'transform rotate-180' : ''}`} />
        </button>

        {selectedTimeDropdown === dropdownId && !isTimeSectionDisabled && !isSaving && (
          <div
            className={`absolute z-30 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${menuPositionClass}`}
            style={{ minWidth: '80px' }}
          >
            {timeOptions.length > 0 ? (
              timeOptions.map((option, idx) => (
                <div
                  key={idx}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                  onClick={() => {
                    handleTimeChange(dayId, slotIndex, field, option);
                    handleTimeDropdownToggle(null);
                  }}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-2 sm:px-3 py-2 text-gray-500 text-xs sm:text-sm">No available times</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <div>
            <h3 className="font-medium text-sm sm:text-base">
              {availabilityMode === 'available' ? 'Working Hours' : 'Unavailable Hours'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {availabilityMode === 'available'
                ? 'Set weekly available days and hours.'
                : 'Set weekly unavailable days and hours.'}
            </p>
          </div>
        </div>
        {isEditMode && (
          <div className="flex space-x-2 justify-end">
            <button
              onClick={handleCancelClick}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-gray-700 transition-colors duration-200 ${
                isTimeSectionDisabled || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              disabled={isTimeSectionDisabled || isSaving}
            >
              <span className='text-xs sm:text-sm'>Cancel</span>
            </button>
            <button
              onClick={handleSaveAndSubmit}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-white rounded-md shadow-sm flex items-center transition-colors duration-200 ${
                availabilityMode === 'available' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
              } ${isTimeSectionDisabled || isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isTimeSectionDisabled || isSaving}
            >
              <Send size={14} className="mr-1.5 sm:mr-2 sm:w-4 sm:h-4" />
              <span className='text-xs sm:text-sm'>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ✅ Timezone — fixed لو workspace عنده timezone، dropdown لو مفيش */}
      <div
        ref={timezoneRef}
        className="mb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full sm:w-64">
          {workspaceTimezone ? (
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50 text-sm text-gray-600">
              <span>🌍</span>
              <span>{workspaceTimezone}</span>
              <span className="text-xs text-gray-400 ml-auto">(Fixed)</span>
            </div>
          ) : (
            <TimezoneSelect
              value={timeZone}
              onChange={onTimeZoneChange}
              className="text-xs sm:text-sm"
              isDisabled={isTimeSectionDisabled || isSaving}
            />
          )}
        </div>
      </div>

      <div className="border rounded-lg p-2 sm:p-3 md:p-4">
        <div className="space-y-3 sm:space-y-4">
          {weekDays.map((day) => {
            const dayDisabled = isDayDisabledByWorkspace(day.day_id);
            return (
              <div
                key={day.day_id}
                className={`flex flex-col sm:flex-row gap-2 sm:gap-0 ${dayDisabled ? 'opacity-40' : ''}`}
                title={dayDisabled ? 'This day is not available in the workspace' : ''}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={day.isChecked}
                    onChange={() => handleDayToggle(day.day_id)}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded border-gray-300 ${
                      isTimeSectionDisabled || isSaving || dayDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    disabled={isTimeSectionDisabled || isSaving || dayDisabled}
                  />
                  <span className="w-20 sm:w-24 text-xs sm:text-sm font-medium">{dayIdToName[day.day_id]}</span>
                </div>
                <div className='flex flex-col gap-2 w-full sm:ml-8'>
                  {day.isChecked && day.timeSlots.map((slot, slotIndex) => (
                    <div key={`${day.day_id}-${slotIndex}`} className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-1 md:flex-none min-w-0">
                        <TimeDropdown
                          value={slot.from}
                          dayId={day.day_id}
                          slotIndex={slotIndex}
                          field="from"
                        />
                        <span className="flex-shrink-0">—</span>
                        <TimeDropdown
                          value={slot.to}
                          dayId={day.day_id}
                          slotIndex={slotIndex}
                          field="to"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {day.timeSlots.length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(day.day_id, slotIndex)}
                            className={`border rounded-md w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-red-600 transition-colors duration-200 ${
                              isTimeSectionDisabled || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                            disabled={loading || isTimeSectionDisabled || isSaving}
                          >
                            <X size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        )}
                        {slotIndex === day.timeSlots.length - 1 && (
                          <button
                            onClick={() => addTimeSlot(day.day_id)}
                            className={`border rounded-md w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-indigo-600 transition-colors duration-200 ${
                              isTimeSectionDisabled || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                            disabled={isTimeSectionDisabled || isSaving}
                          >
                            <span className="text-base sm:text-lg">+</span>
                          </button>
                        )}
                        {day.day_id === 1 && slotIndex === 0 && (
                          <span
                            className={`text-indigo-600 cursor-pointer text-xs sm:text-sm hover:underline whitespace-nowrap ${
                              isTimeSectionDisabled || isSaving ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={applyToAll}
                          >
                            Apply to all
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm">
        Configure {availabilityMode} working hours
      </div>
    </div>
  );
};

export default TimeSection;