import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

export default function CalendarAndTimePicker({
  selectedStaff,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const parseTimeToMinutes = (timeStr) => {
    const parts = timeStr.includes(':') ? timeStr.split(':') : [];
    if (parts.length < 2) return 0;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return h * 60 + m;
  };

  const formatTimeToHIS = (minutes) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}:00`; 
  };

  const generateTimeOptions = (start, end, step = 60, disabledTimes = [], type = 'from') => {
    const startMin = parseTimeToMinutes(start);
    const endMin = parseTimeToMinutes(end);
    let options = [];

    for (let min = startMin; min <= endMin; min += step) {
      const time = formatTimeToHIS(min);
      const isDisabled = disabledTimes.some((disabled) => {
        const disabledFromMin = parseTimeToMinutes(disabled.from);
        const disabledToMin = parseTimeToMinutes(disabled.to);
        
        // For 'from' select: disable the exact 'from' time and anything between from-to
        if (type === 'from') {
          return min >= disabledFromMin && min < disabledToMin;
        }
        // For 'to' select: disable the exact 'to' time and anything between from-to
        if (type === 'to') {
          return min > disabledFromMin && min <= disabledToMin;
        }
        return false;
      });

      options.push({ time, disabled: isDisabled });
    }
    return options;
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateAvailable = (date) => {
    if (!selectedStaff || !selectedStaff.available_dates?.length) return false;

    // Normalize date to midnight for comparison
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (
      selectedStaff.un_available_dates?.some((range) => {
        if (!range?.from || !range?.to || typeof range.from !== 'string' || typeof range.to !== 'string') return false;
        const fromParts = range.from.split(" ")[0].split("-");
        const toParts = range.to.split(" ")[0].split("-");
        const from = new Date(fromParts[0], fromParts[1] - 1, fromParts[2]);
        const to = new Date(toParts[0], toParts[1] - 1, toParts[2]);
        if (isNaN(from.getTime()) || isNaN(to.getTime())) return false;
        return normalizedDate >= from && normalizedDate <= to;
      })
    )
      return false;

    const isAvailable = selectedStaff.available_dates.some((range) => {
      if (!range?.from || !range?.to || typeof range.from !== 'string' || typeof range.to !== 'string') return false;
      const fromParts = range.from.split(" ")[0].split("-");
      const toParts = range.to.split(" ")[0].split("-");
      const from = new Date(fromParts[0], fromParts[1] - 1, fromParts[2]);
      const to = new Date(toParts[0], toParts[1] - 1, toParts[2]);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return false;
      return normalizedDate >= from && normalizedDate <= to;
    });

    return isAvailable;
  };

  const isDateUnavailable = (date) => {
    if (!selectedStaff?.un_available_dates) return false;
    
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return selectedStaff.un_available_dates.some((range) => {
      if (!range?.from || !range?.to) return false;
      const fromParts = range.from.split(" ")[0].split("-");
      const toParts = range.to.split(" ")[0].split("-");
      const from = new Date(fromParts[0], fromParts[1] - 1, fromParts[2]);
      const to = new Date(toParts[0], toParts[1] - 1, toParts[2]);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return false;
      return normalizedDate >= from && normalizedDate <= to;
    });
  };

  const isDateDisabled = (date) => {
    if (!selectedStaff?.disabled_dates) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    return selectedStaff.disabled_dates.some((disabled) => disabled.date === dateStr);
  };

  const isDateOutsideAvailable = (date) => {
    if (!selectedStaff?.available_dates?.length) return true;
    
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return !selectedStaff.available_dates.some((range) => {
      if (!range?.from || !range?.to) return false;
      const fromParts = range.from.split(" ")[0].split("-");
      const toParts = range.to.split(" ")[0].split("-");
      const from = new Date(fromParts[0], fromParts[1] - 1, fromParts[2]);
      const to = new Date(toParts[0], toParts[1] - 1, toParts[2]);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return false;
      return normalizedDate >= from && normalizedDate <= to;
    });
  };

  const getAvailableTimesForDate = () => {
    if (!selectedDate || !selectedStaff || !selectedStaff.available_times?.length)
      return [];

    const dateStr = selectedDate.toISOString().split("T")[0];
    const dayId = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();

    let dayTimes = selectedStaff.available_times.filter(
      (time) => {
        if (!time?.day_id || isNaN(parseInt(time.day_id))) return false;
        return parseInt(time.day_id) === dayId;
      }
    );

    const unavailableTimes = selectedStaff.un_available_times?.filter(
      (unavailable) => unavailable?.date === dateStr
    ) || [];

    if (unavailableTimes.length > 0) {
      dayTimes = dayTimes.filter((timeSlot) => {
        if (!timeSlot?.from || !timeSlot?.to) return false;
        const slotFromMin = parseTimeToMinutes(timeSlot.from);
        const slotToMin = parseTimeToMinutes(timeSlot.to);
        return !unavailableTimes.some((unavailable) => {
          if (!unavailable?.from || !unavailable?.to) return false;
          const unFromMin = parseTimeToMinutes(unavailable.from);
          const unToMin = parseTimeToMinutes(unavailable.to);
          return !(slotToMin <= unFromMin || slotFromMin >= unToMin);
        });
      });
    }

    // Filter out disabled times for the selected date
    const disabledTimes = selectedStaff.disabled_dates?.filter(
      (disabled) => disabled.date === dateStr
    ) || [];

    return dayTimes.map(timeSlot => ({
      ...timeSlot,
      from: timeSlot.from.includes(':') && timeSlot.from.split(':').length === 3 
        ? timeSlot.from 
        : `${timeSlot.from}:00`,
      to: timeSlot.to.includes(':') && timeSlot.to.split(':').length === 3 
        ? timeSlot.to 
        : `${timeSlot.to}:00`,
      disabledTimes 
    }));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const availableTimes = getAvailableTimesForDate();

  return (
    <>
      {/* Calendar */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-sm font-medium text-gray-800">{monthName}</h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const available = isDateAvailable(date);
            const unavailable = isDateUnavailable(date);
            const disabled = isDateDisabled(date);
            const outsideAvailable = isDateOutsideAvailable(date);
            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
            
            return (
              <button
                key={day}
                onClick={() => available && setSelectedDate(date)}
                disabled={!available}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg transition-colors relative
                  ${unavailable ? 'bg-red-50 text-red-400 cursor-not-allowed line-through' : ''}
                  ${disabled ? 'bg-orange-50 text-orange-400 cursor-not-allowed' : ''}
                  ${outsideAvailable && !unavailable && !disabled ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : ''}
                  ${available && !isSelected && !unavailable && !disabled ? 'hover:bg-purple-50 cursor-pointer text-gray-700 bg-green-50 text-green-700' : ''}
                  ${isSelected ? 'bg-purple-500 text-white hover:bg-purple-600 ring-2 ring-purple-600' : ''}
                `}
                title={
                  unavailable ? 'Unavailable date' :
                  disabled ? 'Disabled date' :
                  outsideAvailable ? 'Outside available range' :
                  available ? 'Available date' :
                  'Not available'
                }
              >
                {day}
                {disabled && !unavailable && (
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded"></div>
            <span className="text-gray-600">Disabled</span>
          </div>
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Select Time
          </h3>
          
          {availableTimes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No available times for this date
            </p>
          ) : (
            <div className="space-y-3">
              {availableTimes.map((timeSlot, index) => {
                const slotFrom = timeSlot.from.includes(':') && timeSlot.from.split(':').length === 3 
                  ? timeSlot.from 
                  : `${timeSlot.from}:00`;
                const slotTo = timeSlot.to.includes(':') && timeSlot.to.split(':').length === 3 
                  ? timeSlot.to 
                  : `${timeSlot.to}:00`;

                // Get disabled times for the selected date
                const disabledTimes = selectedStaff.disabled_dates?.filter(
                  (disabled) => disabled.date === selectedDate.toISOString().split('T')[0]
                ) || [];

                const fromOptions = generateTimeOptions(slotFrom, slotTo, 60, disabledTimes, 'from');
                const hasDisabledTimes = disabledTimes.length > 0;

                return (
                  <div key={index} className="space-y-2">
                    <p className="text-xs text-gray-600">{timeSlot.day_name}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">From</label>
                        <select
                          value={selectedTimeSlot.from}
                          onChange={(e) => {
                            const newFrom = e.target.value;
                            setSelectedTimeSlot({ 
                              ...selectedTimeSlot, 
                              from: newFrom, 
                              to: ""
                            });
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select from time</option>
                          {fromOptions.map(({ time, disabled }) => (
                            <option 
                              key={time} 
                              value={time}
                              disabled={disabled}
                              className={disabled ? 'text-gray-400 bg-gray-100' : ''}
                            >
                              {time.slice(0, 5)} {disabled ? '(Disabled)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">To</label>
                        <select
                          disabled={!selectedTimeSlot.from}
                          value={selectedTimeSlot.to}
                          onChange={(e) => setSelectedTimeSlot({ ...selectedTimeSlot, to: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select to time</option>
                          {selectedTimeSlot.from && (
                            (() => {
                              const fromMin = parseTimeToMinutes(selectedTimeSlot.from);
                              const nextHourMin = fromMin + 60; 
                              const toOptions = generateTimeOptions(
                                formatTimeToHIS(nextHourMin),
                                slotTo,
                                60,
                                disabledTimes,
                                'to'
                              );
                              return toOptions.map(({ time, disabled }) => (
                                <option 
                                  key={time} 
                                  value={time}
                                  disabled={disabled}
                                  className={disabled ? 'text-gray-400 bg-gray-100' : ''}
                                >
                                  {time.slice(0, 5)} {disabled ? '(Disabled)' : ''}
                                </option>
                              ));
                            })()
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Available: {slotFrom.slice(0, 5)} - {slotTo.slice(0, 5)}
                      </span>
                      {hasDisabledTimes && (
                        <span className="text-orange-600 flex items-center gap-1">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Has disabled slots
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}