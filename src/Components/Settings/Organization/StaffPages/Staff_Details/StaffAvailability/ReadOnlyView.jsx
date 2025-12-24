import React, { useRef, useEffect } from 'react';
import { Pencil, Plus, ChevronRight, ChevronDown } from 'lucide-react';
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
  onTimeZoneChange, 
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
  isTimeSectionDisabled,
}) => {
  const sectionRef = useRef(null);

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
          onCancel();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeSection, onCancel]);

  // Debug: اطبع القيم
  useEffect(() => {
    console.log('🔍 ReadOnlyView State:', {
      activeSection,
      activeTab,
      isEditing,
      availabilityMode
    });
  }, [activeSection, activeTab, isEditing, availabilityMode]);

  const getCurrentAvailabilityMode = () => {
    if (activeTab === 'unavailable-times' || activeTab === 'unavailable-dates') {
      return 'unavailable';
    }
    if (activeTab === 'available-times' || activeTab === 'available-dates') {
      return 'available';
    }
    return availabilityMode || 'available';
  };

  const isShowingTabs = (sectionId) => {
    return activeSection === sectionId;
  };

  const isShowingContent = (sectionId) => {
    return activeSection === sectionId;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 mt-11" style={{ minHeight: '100vh' }}>
      <h2 className='text-xl'>Availability</h2>
      {sections.map((section) => {
        const showTabs = isShowingTabs(section.id);
        const showContent = isShowingContent(section.id);
        
        return (
          <div key={section.id} className="border rounded-lg">
            {/* Tabs للـ Working Hours */}
            {section.id === 'working-hours' && showTabs && (
              <div className="border-b flex">
                <button
                  onClick={() => handleTabChange('available-times')}
                  className={`px-4 py-2 text-sm transition-colors ${
                    activeTab === 'available-times'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Available Times
                </button>
                <button
                  onClick={() => handleTabChange('available-dates')}
                  className={`px-4 py-2 text-sm transition-colors ${
                    activeTab === 'available-dates'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Available Dates
                </button>
              </div>
            )}
            
            {/* Tabs للـ Unavailability */}
            {section.id === 'unavailability' && showTabs && (
              <div className="border-b flex">
                <button
                  onClick={() => handleTabChange('unavailable-times')}
                  className={`px-4 py-2 text-sm transition-colors ${
                    activeTab === 'unavailable-times'
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Unavailable Times
                </button>
                <button
                  onClick={() => handleTabChange('unavailable-dates')}
                  className={`px-4 py-2 text-sm transition-colors ${
                    activeTab === 'unavailable-dates'
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Unavailable Dates
                </button>
              </div>
            )}

            {/* Header */}
            <div className={`flex items-center justify-between ${!isEditing ? 'p-4' : 'p-0'}`}>
             {!isEditing &&( <div className="flex items-center gap-2">
                {showContent ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>)}
             
              
              {/* Buttons */}
              {section.id === 'working-hours' && !isEditing && (
                <button
                  onClick={onEdit}
                  className="px-3 py-1 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 flex items-center text-sm"
                >
                  <Pencil size={14} className="mr-1" />
                  Edit
                </button>
              )}
              
              {section.id === 'unavailability' && (
                !isEditing ? ( <button
                  onClick={handleUnavailabilityAdd}
                  className="px-3 py-1 border border-red-600 text-red-600 rounded-md hover:bg-red-50 flex items-center text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  Add
                </button>) : null
                
              )}
            </div>

            {/* Content Area */}
            {showContent && (
              <div ref={sectionRef} className="p-4">
                {/* Time Sections */}
                {(activeTab === 'available-times' || activeTab === 'unavailable-times') && (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      Mode: {getCurrentAvailabilityMode()} | Tab: {activeTab}
                    </p>
                    <TimeSection
                      timeZone={timeZone}
                      onTimeZoneChange={onTimeZoneChange}
                      weekDays={weekDays}
                      selectedTimeDropdown={selectedTimeDropdown}
                      handleTimeDropdownToggle={handleTimeDropdownToggle}
                      handleSave={handleSaveTimes}
                      onUpdateWeekDays={onUpdateWeekDays}
                      onCancel={onCancel}
                      getInterviewData={getInterviewData}
                      availabilityMode={getCurrentAvailabilityMode()}
                      isTimeSectionDisabled={isTimeSectionDisabled}
                    />
                  </div>
                )}
                
                {/* Calendar Sections */}
                {(activeTab === 'available-dates' || activeTab === 'unavailable-dates') && (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      Mode: {getCurrentAvailabilityMode()} | Tab: {activeTab}
                    </p>
                    <CalendarSection
                      timeZone={timeZone}
                      currentMonth={currentMonth}
                      selectedDates={selectedDates}
                      goToPreviousMonth={goToPreviousMonth}
                      goToNextMonth={goToNextMonth}
                      handleDateClick={handleDateClick}
                      handleSave={handleSaveDates}
                      getInterviewData={getInterviewData}
                      availabilityMode={getCurrentAvailabilityMode()} 
                      onCancel={onCancel}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReadOnlyView;