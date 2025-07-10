import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronDown, Search } from 'lucide-react';

const FilterSidebar = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [workspaceSearchKeyword, setWorkspaceSearchKeyword] = useState('');
  
  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    interviews: false,
    workspaces: false,
    appointmentStatus: false
  });

  const dispatch = useDispatch();
  const { appointments = [] } = useSelector(state => state.appointments || {});

  // Extract unique interviews and workspaces from appointments data
  const appointmentsArray = Array.isArray(appointments.appointments) ? appointments.appointments : 
                            Array.isArray(appointments) ? appointments : [];

  // Get unique interviews
  const uniqueInterviews = appointmentsArray.reduce((acc, appointment) => {
    const existingInterview = acc.find(item => item.id === appointment.interview_id);
    if (!existingInterview) {
      acc.push({
        id: appointment.interview_id,
        name: appointment.interview_name,
        initial: appointment.interview_name.substring(0, 2).toUpperCase()
      });
    }
    return acc;
  }, []);

  // Get unique workspaces
  const uniqueWorkspaces = appointmentsArray.reduce((acc, appointment) => {
    const existingWorkspace = acc.find(item => item.id === appointment.work_space_id);
    if (!existingWorkspace) {
      acc.push({
        id: appointment.work_space_id,
        name: appointment.work_space_name,
        initial: appointment.work_space_name.substring(0, 1).toUpperCase()
      });
    }
    return acc;
  }, []);

  // Appointment statuses
  const appointmentStatuses = [
    { id: 'upcoming', name: 'Upcoming', color: 'bg-green-500' },
    { id: 'past', name: 'Past', color: 'bg-gray-500' },
    { id: 'ongoing', name: 'Ongoing', color: 'bg-blue-500' }, 
    { id: 'rescheduled', name: 'Rescheduled', color: 'bg-yellow-500' },
    { id: 'completed', name: 'Completed', color: 'bg-teal-500' },
    { id: 'cancelled', name: 'Cancelled', color: 'bg-red-500' }
  ];

  // Initialize filters from props
  useEffect(() => {
    if (currentFilters) {
      setSelectedInterviews(currentFilters.interviews || []);
      setSelectedWorkspaces(currentFilters.workspaces || []);
      setSelectedAppointmentStatus(currentFilters.appointmentStatus || '');
    }
  }, [currentFilters]);

  // Filter interviews based on search
  const filteredInterviews = uniqueInterviews.filter(interview =>
    interview.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Filter workspaces based on search
  const filteredWorkspaces = uniqueWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(workspaceSearchKeyword.toLowerCase())
  );

  const handleInterviewToggle = (interviewId) => {
    setSelectedInterviews(prev => 
      prev.includes(interviewId) 
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    );
  };

  const handleWorkspaceToggle = (workspaceId) => {
    setSelectedWorkspaces(prev => 
      prev.includes(workspaceId) 
        ? prev.filter(id => id !== workspaceId)
        : [...prev, workspaceId]
    );
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApply = () => {
    const filters = {
      interviews: selectedInterviews,
      workspaces: selectedWorkspaces,
      appointmentStatus: selectedAppointmentStatus
    };
    
    onApply(filters);
  };

  const handleCancel = () => {
    // Reset to current filters or empty
    setSelectedInterviews(currentFilters?.interviews || []);
    setSelectedWorkspaces(currentFilters?.workspaces || []);
    setSelectedAppointmentStatus(currentFilters?.appointmentStatus || '');
    setSearchKeyword('');
    setWorkspaceSearchKeyword('');
    onClose();
  };

  // Clear all filters
  const handleClearAll = () => {
    setSelectedInterviews([]);
    setSelectedWorkspaces([]);
    setSelectedAppointmentStatus('');
    setSearchKeyword('');
    setWorkspaceSearchKeyword('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-[87vh] w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Advanced Filters</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleClearAll}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Interviews Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interviews
              </label>
              <div className="border border-gray-300 rounded-lg">
                <div 
                  className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection('interviews')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {selectedInterviews.length} interview{selectedInterviews.length !== 1 ? 's' : ''} selected
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-500 transition-transform duration-200 ${
                        openSections.interviews ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </div>
                
                {openSections.interviews && (
                  <>
                    {/* Search */}
                    <div className="p-3 border-t border-gray-200">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search interviews"
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Interview List */}
                    <div className="max-h-48 overflow-y-auto border-t border-gray-200">
                      {filteredInterviews.length > 0 ? (
                        filteredInterviews.map(interview => (
                          <div key={interview.id} className="flex items-center p-3 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              id={`interview-${interview.id}`}
                              checked={selectedInterviews.includes(interview.id)}
                              onChange={() => handleInterviewToggle(interview.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex items-center ml-3">
                              <div className="w-6 h-6 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-medium mr-2">
                                {interview.initial}
                              </div>
                              <label htmlFor={`interview-${interview.id}`} className="text-sm text-gray-700 cursor-pointer">
                                {interview.name}
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500 text-center">
                          No interviews found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Workspaces Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Workspaces
              </label>
              <div className="border border-gray-300 rounded-lg">
                <div 
                  className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection('workspaces')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {selectedWorkspaces.length} workspace{selectedWorkspaces.length !== 1 ? 's' : ''} selected
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-500 transition-transform duration-200 ${
                        openSections.workspaces ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </div>
                
                {openSections.workspaces && (
                  <>
                    {/* Search */}
                    <div className="p-3 border-t border-gray-200">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search workspaces"
                          value={workspaceSearchKeyword}
                          onChange={(e) => setWorkspaceSearchKeyword(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Workspace List */}
                    <div className="max-h-48 overflow-y-auto border-t border-gray-200">
                      {filteredWorkspaces.length > 0 ? (
                        filteredWorkspaces.map(workspace => (
                          <div key={workspace.id} className="flex items-center p-3 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              id={`workspace-${workspace.id}`}
                              checked={selectedWorkspaces.includes(workspace.id)}
                              onChange={() => handleWorkspaceToggle(workspace.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex items-center ml-3">
                              <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-medium mr-2">
                                {workspace.initial}
                              </div>
                              <label htmlFor={`workspace-${workspace.id}`} className="text-sm text-gray-700 cursor-pointer">
                                {workspace.name}
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500 text-center">
                          No workspaces found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Appointment Status Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Appointment Status
              </label>
              <div className="border border-gray-300 rounded-lg">
                <div 
                  className="p-3 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection('appointmentStatus')}
                >
                  <span className="text-sm text-gray-600">
                    {selectedAppointmentStatus ? 
                      appointmentStatuses.find(s => s.id === selectedAppointmentStatus)?.name || 'Select status' : 
                      'Select appointment status'
                    }
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform duration-200 ${
                      openSections.appointmentStatus ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                {openSections.appointmentStatus && (
                  <div className="p-3 border-t border-gray-200">
                    {/* Add "All" option */}
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                      <label className="text-sm text-gray-700 cursor-pointer flex-1">
                        <input
                          type="radio"
                          name="appointmentStatus"
                          value=""
                          checked={selectedAppointmentStatus === ''}
                          onChange={(e) => setSelectedAppointmentStatus(e.target.value)}
                          className="mr-2"
                        />
                        All Statuses
                      </label>
                    </div>
                    {appointmentStatuses.map(status => (
                      <div key={status.id} className="flex items-center mb-2 last:mb-0">
                        <div className={`w-3 h-3 ${status.color} rounded-full mr-3`}></div>
                        <label className="text-sm text-gray-700 cursor-pointer flex-1">
                          <input
                            type="radio"
                            name="appointmentStatus"
                            value={status.id}
                            checked={selectedAppointmentStatus === status.id}
                            onChange={(e) => setSelectedAppointmentStatus(e.target.value)}
                            className="mr-2"
                          />
                          {status.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;