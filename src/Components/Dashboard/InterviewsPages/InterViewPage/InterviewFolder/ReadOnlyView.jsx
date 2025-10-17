import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Plus, ChevronRight, ChevronDown, Info } from 'lucide-react';
import TimeSection from './TimeSection';
import CalendarSection from './CalendarSection';

const ReadOnlyView = ({
  sections,
  onEdit,
  handleUnavailabilityAdd,
  handleTabChange,
  activeTab,
  availabilityMode = 'available',
  isEditing,
  activeSection,
  timeZone,
  weekDays,
  selectedTimeDropdown,
  handleTimeDropdownToggle,
  handleSaveTimes,
  onUpdateWeekDays,
  onCancel,
  currentMonth,
  selectedDates,
  goToPreviousMonth,
  goToNextMonth,
  handleDateClick,
  handleSaveDates,
  getInterviewData,
  getWorkspaceData,
  isTimeSectionDisabled,
}) => {
  const sectionRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);


  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'overlay';
    
    if (document.body.style.overflow !== 'overlay') {
      document.body.style.overflow = 'scroll';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeSection &&
        sectionRef.current &&
        !sectionRef.current.contains(event.target)
      ) {
        const scrollbarWidth = 20;
        const windowWidth = window.innerWidth;
        const isClickOnScrollbar = event.clientX > windowWidth - scrollbarWidth;
        const isClickOnTab = event.target.closest('button');

        if (!isClickOnScrollbar && !isClickOnTab) {
          onCancel(); // استدعاء onCancel لإغلاق القسم
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeSection, onCancel]);

  useEffect(() => {
    if (activeSection && sectionRef.current) {
      const currentScrollY = window.scrollY;
      
      const timer = setTimeout(() => {
        const height = sectionRef.current.scrollHeight;
        setContentHeight(height);
        
        setTimeout(() => {
          window.scrollTo(0, currentScrollY);
        }, 50);
      }, 10);
      
      return () => clearTimeout(timer);
    } else {
      setContentHeight(0);
    }
  }, [activeSection]);

  const getCurrentAvailabilityMode = () => {
    if (activeTab === 'unavailable-times' || activeTab === 'unavailable-dates') {
      return 'unavailable';
    }
    
    if (activeTab === 'available-times' || activeTab === 'available-dates') {
      return 'available';
    }
    
    return availabilityMode || 'available';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4" style={{ minHeight: '100vh' }}>
      {sections.map((section) => (
        <div key={section.id} className="border rounded-lg">
          {/* إظهار التبويبات بس لما القسم يكون مفتوح */}
          {section.id === 'working-hours' && activeSection === section.id && (
            <div className="border-b flex transition-all duration-300 ease-in-out opacity-100 max-h-16">
              <button
                onClick={() => handleTabChange('available-times')}
                className={`px-4 py-2 text-sm transition-colors duration-200 ${
                  activeTab === 'available-times' && activeSection === section.id
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Available Times
              </button>
              <button
                onClick={() => handleTabChange('available-dates')}
                className={`px-4 py-2 text-sm transition-colors duration-200 ${
                  activeTab === 'available-dates' && activeSection === section.id
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Available Dates
              </button>
            </div>
          )}
          {section.id === 'unavailability' && activeSection === section.id && (
            <div
              className="border-b flex transition-all duration-300 ease-in-out opacity-100 max-h-16"
            >
              <button
                onClick={() => handleTabChange('unavailable-times')}
                className={`px-4 py-2 text-sm transition-colors duration-200 ${
                  activeTab === 'unavailable-times' && activeSection === section.id
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Unavailable Times
              </button>
              <button
                onClick={() => handleTabChange('unavailable-dates')}
                className={`px-4 py-2 text-sm transition-colors duration-200 ${
                  activeTab === 'unavailable-dates' && activeSection === section.id
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Unavailable Dates
              </button>
            </div>
          )}

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              {activeSection === section.id ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
              <div>
                <h3 className="font-medium">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
            {section.id === 'working-hours' ? (
              !isEditing ? (
                <button
                  onClick={onEdit}
                  className="px-3 py-1 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 flex items-center text-sm transition-colors duration-200"
                >
                  <Pencil size={14} className="mr-1" />
                  Edit
                </button>
              ) : null
            ) : section.id === 'unavailability' ? (
              <button
                onClick={handleUnavailabilityAdd}
                className="px-3 py-1 border border-red-600 text-red-600 rounded-md hover:bg-red-50 flex items-center text-sm transition-colors duration-200"
              >
                <Plus size={14} className="mr-1" />
                Add
              </button>
            ) : section.id === 'special-hours' ? (
              <button
                className="px-3 py-1 border border-gray-300 text-gray-500 rounded-md flex items-center text-sm opacity-50 cursor-not-allowed"
                disabled
              >
                <Plus size={14} className="mr-1" />
                Add
              </button>
            ) : null}
          </div>

          <div
            style={{ 
              height: activeSection === section.id ? `${contentHeight}px` : '0px',
              willChange: activeSection === section.id ? 'height' : 'auto'
            }}
            className="transition-all duration-300 ease-in-out overflow-hidden"
          >
            {activeSection === section.id && (
              <div ref={sectionRef} className="p-4 border-t">
                {(activeTab === 'available-times' || activeTab === 'unavailable-times') && (
                  <TimeSection
                    timeZone={timeZone}
                    weekDays={weekDays}
                    selectedTimeDropdown={selectedTimeDropdown}
                    handleTimeDropdownToggle={handleTimeDropdownToggle}
                    handleSave={handleSaveTimes}
                    onUpdateWeekDays={onUpdateWeekDays}
                    onCancel={onCancel}
                    getInterviewData={getInterviewData}
                    availabilityMode={getCurrentAvailabilityMode()}
                    isTimeSectionDisabled={isTimeSectionDisabled}
                    getWorkspaceData={getWorkspaceData}
                  />
                )}
                {(activeTab === 'available-dates' || activeTab === 'unavailable-dates') && (
                  <CalendarSection
                    timeZone={timeZone}
                    currentMonth={currentMonth}
                    selectedDates={selectedDates}
                    goToPreviousMonth={goToPreviousMonth}
                    goToNextMonth={goToNextMonth}
                    handleDateClick={handleDateClick}
                    handleSave={handleSaveDates}
                    getInterviewData={getInterviewData}
                    getWorkspaceData={getWorkspaceData}
                    availabilityMode={getCurrentAvailabilityMode()} 
                    onCancel={onCancel}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadOnlyView;