import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, X, ChevronLeft, ChevronRight } from 'lucide-react';

const TimezoneModal = ({ show, onClose, selectedTimezone, onTimezoneSelect }) => {
    const timezones = [
      'Africa/Abidjan - GMT (+00:00)',
      'Africa/Accra - GMT (+00:00)',
      'Africa/Addis_Ababa - EAT (+03:00)',
      'Africa/Algiers - CET (+01:00)',
      'Africa/Asmara - EAT (+03:00)',
      'Africa/Bamako - GMT (+00:00)',
      'Africa/Cairo - EEST (+03:00)'
    ];
  
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Select Timezone</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
  
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {timezones.map((timezone, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    selectedTimezone === timezone ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'
                  }`}
                  onClick={() => {
                    onTimezoneSelect(timezone);
                    onClose();
                  }}
                >
                  <div className="text-sm text-gray-800">{timezone}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default TimezoneModal