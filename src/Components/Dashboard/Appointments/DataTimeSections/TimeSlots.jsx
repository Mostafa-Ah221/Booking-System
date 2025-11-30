import { useState } from 'react';

const TimeSlots = ({ 
  selectedDate,
  selectedTime,
  selectedEndTime,
  onTimeSelect,
  onEndTimeSelect,
  availableTimeSlots,
  getDayId,
  availableTimes,
  isDateInUnavailableDatesRange,
  isResourceMode,
  requireEndTime = false
}) => {
  const [activeTab, setActiveTab] = useState('start'); 
console.log(isResourceMode);
console.log(requireEndTime);

  const normalizeTimeFormat = (timeStr) => {
    if (!timeStr) return null;
    return timeStr.split(':').slice(0, 2).join(':');
  };

  const getFormattedTimeSlots = () => {
    if (!availableTimeSlots || availableTimeSlots.length === 0) return [];
    
    return availableTimeSlots.map(timeStr => {
      const normalizedTime = normalizeTimeFormat(timeStr);
      const [hour, min] = normalizedTime.split(':').map(Number);
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'pm' : 'am';
      const displayTime = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
      
      return { value: `${normalizedTime}:00`, display: displayTime };
    });
  };

  const getEndTimeSlots = () => {
    if (!selectedTime || !availableTimeSlots || availableTimeSlots.length === 0) return [];
    
    const selectedTimeNormalized = normalizeTimeFormat(selectedTime);
    const [selectedHour, selectedMin] = selectedTimeNormalized.split(':').map(Number);
    const selectedTimeMinutes = selectedHour * 60 + selectedMin;
    
    return availableTimeSlots
      .filter(timeStr => {
        const normalizedTime = normalizeTimeFormat(timeStr);
        const [hour, min] = normalizedTime.split(':').map(Number);
        const timeMinutes = hour * 60 + min;
        return timeMinutes > selectedTimeMinutes;
      })
      .map(timeStr => {
        const normalizedTime = normalizeTimeFormat(timeStr);
        const [hour, min] = normalizedTime.split(':').map(Number);
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayTime = `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
        
        return { value: `${normalizedTime}:00`, display: displayTime };
      });
  };

  const getNoSlotsMessage = () => {
    if (!selectedDate) return "Please select a date";
    
    const dayId = getDayId(selectedDate);
    const hasTimes = availableTimes.some(time => time.day_id.toString() === dayId.toString());
    
    if (!hasTimes) {
      return "This day is not available in working hours";
    } else if (isDateInUnavailableDatesRange(selectedDate)) {
      return "This date is in an unavailable range";
    } else {
      return "All time slots are either booked or in unavailable periods";
    }
  };

  const timeSlots = getFormattedTimeSlots();
  const endTimeSlots = getEndTimeSlots();

  const groupSlotsByPeriod = (slots) => {
    const morning = [];
    const afternoon = [];
    const evening = [];
    
    slots.forEach(slot => {
      const normalizedTime = normalizeTimeFormat(slot.value);
      const [hour] = normalizedTime.split(':').map(Number);
      
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });
    
    return { morning, afternoon, evening };
  };

  const handleStartTimeSelect = (value) => {
    onTimeSelect(value);
    if (onEndTimeSelect) onEndTimeSelect(null);
    setActiveTab('end'); // Switch to end time tab automatically
  };

  // Resource Mode UI (with Start Time & End Time tabs)
  if (isResourceMode && requireEndTime) {
    const startTimeGroups = groupSlotsByPeriod(timeSlots);
    const endTimeGroups = groupSlotsByPeriod(endTimeSlots);
    
    return (
      <div className="w-full">
        <h4 className="text-base font-semibold mb-4">Slot Availability</h4>
        
        {selectedDate && timeSlots.length > 0 ? (
          <div className="space-y-4">
            {/* Tab Buttons */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('start')}
                disabled={!selectedTime}
                className={`flex-1 py-3 px-4 font-medium text-sm transition-all relative ${
                  activeTab === 'start'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Start Time
                {selectedTime && (
                  <span className="block text-xs font-normal text-gray-500 mt-0.5">
                    {timeSlots.find(s => s.value === selectedTime)?.display}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('end')}
                disabled={!selectedTime}
                className={`flex-1 py-3 px-4 font-medium text-sm transition-all relative ${
                  !selectedTime
                    ? 'text-gray-300 cursor-not-allowed'
                    : activeTab === 'end'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                End Time
                {selectedEndTime ? (
                  <span className="block text-xs font-normal text-gray-500 mt-0.5">
                    {endTimeSlots.find(s => s.value === selectedEndTime)?.display}
                  </span>
                ) : !selectedTime ? (
                  <span className="block text-xs font-normal text-gray-400 mt-0.5">
                    Select start time first
                  </span>
                ) : null}
              </button>
            </div>

            {/* Time Slots Content */}
            <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
              {activeTab === 'start' ? (
                // Start Time Slots
                <>
                  {/* Morning */}
                  {startTimeGroups.morning.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 mb-3">Morning</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {startTimeGroups.morning.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleStartTimeSelect(slot.value)}
                            className={`px-3 py-2 text-sm border rounded-md transition-all ${
                              selectedTime === slot.value
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                          >
                            {slot.display}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Afternoon */}
                  {startTimeGroups.afternoon.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 mb-3">Afternoon</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {startTimeGroups.afternoon.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleStartTimeSelect(slot.value)}
                            className={`px-3 py-2 text-sm border rounded-md transition-all ${
                              selectedTime === slot.value
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                          >
                            {slot.display}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evening */}
                  {startTimeGroups.evening.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 mb-3">Evening</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {startTimeGroups.evening.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleStartTimeSelect(slot.value)}
                            className={`px-3 py-2 text-sm border rounded-md transition-all ${
                              selectedTime === slot.value
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                          >
                            {slot.display}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // End Time Slots
                <>
                  {!selectedTime ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-400">Please select a start time first</p>
                    </div>
                  ) : endTimeSlots.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No available end time slots after the selected start time</p>
                    </div>
                  ) : (
                    <>
                      {/* Morning */}
                      {endTimeGroups.morning.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-600 mb-3">Morning</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {endTimeGroups.morning.map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => onEndTimeSelect && onEndTimeSelect(slot.value)}
                                className={`px-3 py-2 text-sm border rounded-md transition-all ${
                                  selectedEndTime === slot.value
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                                }`}
                              >
                                {slot.display}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Afternoon */}
                      {endTimeGroups.afternoon.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-600 mb-3">Afternoon</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {endTimeGroups.afternoon.map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => onEndTimeSelect && onEndTimeSelect(slot.value)}
                                className={`px-3 py-2 text-sm border rounded-md transition-all ${
                                  selectedEndTime === slot.value
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                                }`}
                              >
                                {slot.display}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evening */}
                      {endTimeGroups.evening.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-600 mb-3">Evening</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {endTimeGroups.evening.map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => onEndTimeSelect && onEndTimeSelect(slot.value)}
                                className={`px-3 py-2 text-sm border rounded-md transition-all ${
                                  selectedEndTime === slot.value
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                                }`}
                              >
                                {slot.display}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ) : selectedDate && timeSlots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 mb-2">No available slots for this date</p>
            <p className="text-xs text-gray-400">{getNoSlotsMessage()}</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">Select a date to view available time slots</p>
          </div>
        )}
      </div>
    );
  }

  // Normal Mode UI (original single column)
  return (
    <div className="w-full">
      {selectedDate && timeSlots.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Available Slots</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => onTimeSelect(slot.value)}
                className={`w-full p-2 text-sm border rounded-lg text-center transition-colors ${
                  selectedTime === slot.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {slot.display}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && timeSlots.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-2">No available slots for this date</p>
          <p className="text-xs text-gray-400">{getNoSlotsMessage()}</p>
        </div>
      )}

      {!selectedDate && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">Select a date to view available time slots</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;