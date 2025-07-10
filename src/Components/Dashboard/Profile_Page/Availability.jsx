import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Pencil, Plus } from 'lucide-react';
import UnavailabilityForm from '../AddMenus/UnavailabilityForm';
import SpecialWorking from '../AddMenus/SpecialWorking';

const Availability = () => {
  const [isWorkingHoursOpen, setIsWorkingHoursOpen] = useState(false);
  const [openForm, setOpenForm] = useState(null); // 'special' or 'unavailability'

  const handleClose = () => {
    setOpenForm(null);
  };

  const workingHours = [
    { day: 'Monday', time: '09:00 am — 06:00 pm' },
    { day: 'Tuesday', time: '09:00 am — 06:00 pm' },
    { day: 'Wednesday', time: '09:00 am — 06:00 pm' },
    { day: 'Thursday', time: '09:00 am — 06:00 pm' },
    { day: 'Friday', time: '09:00 am — 06:00 pm' },
    { day: 'Saturday', time: 'Not Available', isUnavailable: true },
    { day: 'Sunday', time: 'Not Available', isUnavailable: true }
  ];

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-4">
      {/* Working Hours Section */}
      <div className="border rounded-lg shadow-sm">
        <div 
          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 cursor-pointer"
          onClick={() => setIsWorkingHoursOpen(!isWorkingHoursOpen)}
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            {isWorkingHoursOpen ? <ChevronUp size={20} className="flex-shrink-0" /> : <ChevronDown size={20} className="flex-shrink-0" />}
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Working Hours</h2>
              <p className="text-xs sm:text-sm text-gray-600">Set weekly available days and hours.</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-1 sm:gap-2 text-indigo-600 px-3 py-1 sm:px-4 sm:py-2 rounded-lg border border-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm w-full sm:w-auto">
            <Pencil size={16} className="flex-shrink-0" />
            <span>Customize working hours</span>
          </button>
        </div>

        {isWorkingHoursOpen && (
          <div className="px-3 sm:px-4 pb-4">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 flex items-start gap-2">
              <Info size={18} className="text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Mostafa Ahmed</span> follows usual working hours.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-4 border rounded-lg p-3 sm:p-4">
              {workingHours.map((schedule, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-b-0 text-xs sm:text-sm"
                >
                  <span className="text-gray-700 font-medium">{schedule.day}</span>
                  <span className={schedule.isUnavailable ? 'text-red-500' : 'text-gray-600'}>
                    {schedule.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Special Working Hours Section */}
      <div className="border rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <ChevronDown size={20} className="flex-shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Special Working Hours</h2>
              <p className="text-xs sm:text-sm text-gray-600">Add extra available days or hours.</p>
            </div>
          </div>
          <button 
            onClick={() => setOpenForm("special")}
            className="flex items-center justify-center gap-1 sm:gap-2 text-indigo-600 px-3 py-1 sm:px-4 sm:py-2 rounded-lg border border-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus size={16} className="flex-shrink-0" />
            <span>Add</span>
          </button>
        </div>
        {openForm === "special" && <SpecialWorking isOpen={true} onClose={handleClose} />}
      </div>

      {/* Unavailability Section */}
      <div className="border rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <ChevronDown size={20} className="flex-shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Unavailability</h2>
              <p className="text-xs sm:text-sm text-gray-600">Add extra unavailable days or hours.</p>
            </div>
          </div>
          <button
            onClick={() => setOpenForm("unavailability")}
            className="flex items-center justify-center gap-1 sm:gap-2 text-indigo-600 px-3 py-1 sm:px-4 sm:py-2 rounded-lg border border-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus size={16} className="flex-shrink-0" />
            <span>Add</span>
          </button>
        </div>
        {openForm === "unavailability" && <UnavailabilityForm isOpen={true} onClose={handleClose} />}
      </div>
    </div>
  );
};

export default Availability;