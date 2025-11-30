import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const TimeSelectionSection2 = ({
  selectedTime,
  onTimeSelect,
  availableTimes = [],
  selectedDate,
  disabledTimes = [],
  unavailableTimes = [],
  unavailableDates = [],
  requireEndTime = false,
  selectedEndTime = '',
  setSelectedEndTime,
  themeColor
}) => {
  const [activeSelection, setActiveSelection] = useState('start'); // 'start' or 'end'

  // Theme
  const colors = themeColor ? JSON.parse(themeColor) : {};
  const primary = colors?.primary || "bg-teal-600";
  const [firstColor, secondColor] = primary.split("-");
  const textColor = colors?.text_color || "#ffffff";

  const timeToMinutes = (t) => (t ? +t.split(':')[0] * 60 + +t.split(':')[1] : 0);

  const convertDateFormat = (d) => {
    const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
    const [day, mon, year] = d.split(' ');
    return `${year}-${months[mon]}-${day.padStart(2, '0')}`;
  };

  const isTimeBooked = (date, time) => {
    if (!date || !time) return false;
    const formatted = convertDateFormat(date);
    const clean = time.slice(0, 5);
    return disabledTimes.some(t => t.date === formatted && t.time.startsWith(clean));
  };

  const getFilteredTimes = () => availableTimes
    .map(t => typeof t === 'string' ? t : t?.time)
    .filter(t => t && !isTimeBooked(selectedDate, t));

  const generateEndOptions = () => {
    if (!selectedTime) return [];
    return getFilteredTimes().filter(t => timeToMinutes(t) > timeToMinutes(selectedTime));
  };

  const filteredTimes = getFilteredTimes();
  const endTimeOptions = generateEndOptions();

  // Group times
  const groups = { morning: [], afternoon: [], evening: [] };
  filteredTimes.forEach(t => {
    const h = +t.split(':')[0];
    if (h < 12) groups.morning.push(t);
    else if (h < 17) groups.afternoon.push(t);
    else groups.evening.push(t);
  });

  if (!selectedDate) {
    return <div className="text-center py-12 text-gray-500">Please select a date first</div>;
  }

  return (
    <div className="mt-8">

      {/* Start & End Time Display (قابل للنقر) */}
      {requireEndTime && (
        <div className="mb-8">
          <div 
            className="grid grid-cols-2 border  overflow-hidden w-10/12"
            style={{ 
              borderColor: textColor ,
              backgroundColor: 'transparent'
            }}
          >
            {/* Start Time - Clickable */}
            <div 
              onClick={() => setActiveSelection('start')}
              className="px-3 border-r flex items-center justify-between cursor-pointer transition-all hover:bg-white/5"
              style={{ 
                borderColor: textColor ,
                backgroundColor: activeSelection === 'start' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              <span className="font-semibold opacity-90" style={{ color: textColor }}>Start Time</span>
              <span 
                className="font-bold px-4 py-1 rounded-lg"
                style={{ 
                  color: selectedTime ? firstColor : '#ffffff80'
                }}
              >
                {selectedTime || '--:--'}
              </span>
            </div>

            {/* End Time - Clickable */}
            <div 
              onClick={() => selectedTime && setActiveSelection('end')}
              className={`px-6 py-5 flex items-center justify-between transition-all ${selectedTime ? 'cursor-pointer hover:bg-white/5' : 'cursor-not-allowed opacity-50'}`}
              style={{ 
                backgroundColor: activeSelection === 'end' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              <span className="font-semibold  opacity-90" style={{ color: textColor }}>End Time</span>
              <span 
                className="font-bold t px-4 py-1 rounded-lg"
                style={{ 
                  color: selectedEndTime ? firstColor : '#ffffff80'
                }}
              >
                {selectedEndTime || '--:--'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* الأوقات في grid (Morning / Afternoon / Evening) */}
      <div className="space-y-10">
        {['morning', 'afternoon', 'evening'].map(period => {
          const times = groups[period];
          if (times.length === 0) return null;

          const titles = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

          let displayTimes = times;
          if (requireEndTime && activeSelection === 'end' && selectedTime) {
            displayTimes = times.filter(t => timeToMinutes(t) > timeToMinutes(selectedTime));
          }

          if (displayTimes.length === 0) return null;

          return (
            <div key={period}>
              <h3 className="text-center  font-semibold mb-6" style={{ color: textColor }}>
                {titles[period]}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {displayTimes.map(time => {
                  const booked = isTimeBooked(selectedDate, time);
                  
                  let isSelected = false;
                  if (activeSelection === 'start') {
                    isSelected = time === selectedTime;
                  } else if (activeSelection === 'end') {
                    isSelected = time === selectedEndTime;
                  }

                  return (
                    <button
                      key={time}
                      disabled={booked}
                      onClick={() => {
                        if (booked) return;
                        
                        if (requireEndTime) {
                          if (activeSelection === 'start') {
                            onTimeSelect(time);
                            setSelectedEndTime(''); 
                            setActiveSelection('end');
                          } else if (activeSelection === 'end') {
                            setSelectedEndTime(time);
                          }
                        } else {
                          onTimeSelect(time);
                        }
                      }}
                      className={`py-3 px-4 text-sm transition-all border
                        ${booked ? 'bg-gray-700/30 text-gray-500 line-through border-gray-600/20 cursor-not-allowed' : 'hover:scale-105'}
                        ${isSelected ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md'}
                      `}
                      style={{
                        backgroundColor: isSelected ? (firstColor) : '',
                        color: isSelected ? textColor : booked ? '#9ca3af' : firstColor,
                        borderColor: isSelected ? (firstColor) : firstColor,
                      }}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTimes.length === 0 && (
        <div className="text-center py-16" style={{color: textColor || '#ffffff'}}>
          <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl font-medium">No Available Times</p>
        </div>
      )}
    </div>
  );
};

export default TimeSelectionSection2;