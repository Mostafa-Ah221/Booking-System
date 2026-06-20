import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, ChevronDown, Search, Calendar } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

const FilterSidebar = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  getCustomers,
  workspaces,
  interviews,
  customers,
}) => {
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [workspaceSearchKeyword, setWorkspaceSearchKeyword] = useState('');
  const [clientSearchKeyword, setClientSearchKeyword] = useState('');

  const [dateMode, setDateMode]   = useState('');
  const [singleValue, setSingleValue] = useState({ date: '' });
  const [rangeValue, setRangeValue]   = useState({ from: '', to: '' });

  const [openSections, setOpenSections] = useState({
    interviews: false,
    workspaces: false,
    clients: false,
    appointmentStatus: false,
    date: true,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (getCustomers && typeof getCustomers === 'function') {
      dispatch(getCustomers());
    }
  }, [dispatch, getCustomers]);

  useEffect(() => {
    if (currentFilters) {
      setSelectedInterviews(currentFilters.interviews || []);
      setSelectedWorkspaces(currentFilters.workspaces || []);
      setSelectedClients(currentFilters.clients || []);
      setSelectedAppointmentStatus(currentFilters.appointmentStatus || '');
      setDateMode(currentFilters.dateFilterType || '');
      setSingleValue({ date: currentFilters.selectedDate || '' });
      setRangeValue({ from: currentFilters.dateFrom || '', to: currentFilters.dateTo || '' });
    }
  }, [currentFilters]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key !== 'Enter') return;

      const tag = document.activeElement?.tagName;
      const type = document.activeElement?.type;
      if (tag === 'INPUT' && type === 'text') return;

      handleApply();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    selectedInterviews,
    selectedWorkspaces,
    selectedClients,
    selectedAppointmentStatus,
    dateMode,
    singleValue,
    rangeValue,
  ]);

  // ── Formatted lists ─────────────────────────────────────────────────────────
  const formattedInterviews = Array.isArray(interviews)
  ? interviews.map(i => ({
      id: i.id,
      name: i.name || i.title || 'Untitled Interview',
      initial: (i.name || i.title || 'UI').substring(0, 2).toUpperCase(),
      workspace: i.workspace || i.workspace_name || null, // ← هنا
    }))
  : [];

  const formattedWorkspaces = Array.isArray(workspaces)
    ? workspaces.map(w => ({
        id: w.id,
        name: w.name || w.title || 'Untitled Workspace',
        initial: (w.name || w.title || 'UW').substring(0, 1).toUpperCase(),
      }))
    : [];

  const formattedClients = Array.isArray(customers?.clients)
    ? customers.clients.map(c => ({
        id: c.id,
        name: c.name || c.title || 'Untitled Client',
        initial: (c.name || c.title || 'UC').substring(0, 1).toUpperCase(),
      }))
    : [];

  const appointmentStatuses = [
    { id: 'upcoming',    name: 'Upcoming',    color: 'bg-green-500'  },
    { id: 'rescheduled', name: 'Rescheduled', color: 'bg-yellow-500' },
    { id: 'ongoing',     name: 'Ongoing',     color: 'bg-blue-500'   },
    { id: 'completed',   name: 'Completed',   color: 'bg-teal-500'   },
    { id: 'passed',      name: 'Passed',      color: 'bg-gray-500'   },
    { id: 'cancelled',   name: 'Cancelled',   color: 'bg-red-500'    },
  ];

  const filteredInterviews = formattedInterviews.filter(i =>
    i.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const filteredWorkspaces = formattedWorkspaces.filter(w =>
    w.name.toLowerCase().includes(workspaceSearchKeyword.toLowerCase())
  );
  const filteredClients = formattedClients.filter(c =>
    c.name.toLowerCase().includes(clientSearchKeyword.toLowerCase())
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleSection = (section) =>
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

  const handleInterviewToggle = (id) =>
    setSelectedInterviews(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  const handleWorkspaceToggle = (id) =>
    setSelectedWorkspaces(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  const handleClientToggle = (id) =>
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleApply = () => {
    onApply({
      interviews: selectedInterviews,
      workspaces: selectedWorkspaces,
      clients: selectedClients,
      appointmentStatus: selectedAppointmentStatus,
      dateFilterType: dateMode,
      selectedDate: singleValue.date,
      dateFrom: rangeValue.from,
      dateTo: rangeValue.to,
    });
  };

  const handleCancel = () => {
    setSelectedInterviews(currentFilters?.interviews || []);
    setSelectedWorkspaces(currentFilters?.workspaces || []);
    setSelectedClients(currentFilters?.clients || []);
    setSelectedAppointmentStatus(currentFilters?.appointmentStatus || '');
    setDateMode(currentFilters?.dateFilterType || '');
    setSingleValue({ date: currentFilters?.selectedDate || '' });
    setRangeValue({ from: currentFilters?.dateFrom || '', to: currentFilters?.dateTo || '' });
    setSearchKeyword('');
    setWorkspaceSearchKeyword('');
    setClientSearchKeyword('');
    onClose();
  };

  const handleClearAll = () => {
    setSelectedInterviews([]);
    setSelectedWorkspaces([]);
    setSelectedClients([]);
    setSelectedAppointmentStatus('');
    setDateMode('');
    setSingleValue({ date: '' });
    setRangeValue({ from: '', to: '' });
    setSearchKeyword('');
    setWorkspaceSearchKeyword('');
    setClientSearchKeyword('');
  };

  const clearDateFilter = () => {
    setDateMode('');
    setSingleValue({ date: '' });
    setRangeValue({ from: '', to: '' });
  };

  const dateSummaryLabel = () => {
    if (dateMode === 'single' && singleValue.date) {
      const d = new Date(singleValue.date + 'T00:00:00');
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (dateMode === 'range') {
      const fmt = (str) => {
        if (!str) return '';
        const d = new Date(str + 'T00:00:00');
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      };
      if (rangeValue.from && rangeValue.to) return `${fmt(rangeValue.from)} → ${fmt(rangeValue.to)}`;
      if (rangeValue.from) return `From ${fmt(rangeValue.from)}`;
      if (rangeValue.to) return `Until ${fmt(rangeValue.to)}`;
    }
    return 'Select date';
  };

  const hasDateFilter =
    (dateMode === 'single' && !!singleValue.date) ||
    (dateMode === 'range' && (!!rangeValue.from || !!rangeValue.to));

  if (!isOpen) return null;
  const showClientsSection = getCustomers && formattedClients.length >= 0;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-[87vh] w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Top Bar */}
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

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Date Filter */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-3">
                <Calendar size={14} className="text-indigo-500" />
                Date Filter
              </label>

              <div className="flex gap-2 mb-3">
                {[
                  { id: 'single', label: 'Specific Day' },
                  { id: 'range',  label: 'Date Range'   },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (dateMode === tab.id) { clearDateFilter(); return; }
                      setDateMode(tab.id);
                      setSingleValue({ date: '' });
                      setRangeValue({ from: '', to: '' });
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-600 border transition-all ${
                      dateMode === tab.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {dateMode === 'single' && (
                <DateRangePicker
                  mode="single"
                  value={singleValue}
                  onChange={setSingleValue}
                  onClear={() => setSingleValue({ date: '' })}
                  placeholder="Pick a day"
                />
              )}

              {dateMode === 'range' && (
                <DateRangePicker
                  mode="range"
                  value={rangeValue}
                  onChange={setRangeValue}
                  onClear={() => setRangeValue({ from: '', to: '' })}
                  placeholder="Pick start → end"
                />
              )}

              {hasDateFilter && (
                <button
                  onClick={clearDateFilter}
                  className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Clear date filter
                </button>
              )}
            </div>

            {/* Interviews Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interviews ({formattedInterviews.length})
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
                      className={`text-gray-500 transition-transform duration-200 ${openSections.interviews ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
                {openSections.interviews && (
                  <>
                    <div className="p-3 border-t border-gray-200">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search interviews"
                          value={searchKeyword}
                          onChange={e => setSearchKeyword(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto border-t border-gray-200">
                      {filteredInterviews.length > 0 ? filteredInterviews.map(interview => (
                        <div key={interview.id} className="flex items-center px-3 py-1.5 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            id={`interview-${interview.id}`}
                            checked={selectedInterviews.includes(interview.id)}
                            onChange={() => handleInterviewToggle(interview.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <div className="flex items-center ml-3">
                            <div className="w-6 h-6 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-medium mr-2">
                              {interview.initial}
                            </div>
                            <label htmlFor={`interview-${interview.id}`} className="text-sm text-gray-700 cursor-pointer truncate max-w-[150px]">
                              {interview.name}
                              {interview.workspace && (
                                <span className="block text-[11px] text-gray-400 font-normal">{interview.workspace}</span>
                              )}
                            </label>
                          </div>
                        </div>
                      )) : (
                        <div className="p-3 text-sm text-gray-500 text-center">
                          {formattedInterviews.length === 0 ? 'No interviews available' : 'No interviews found'}
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
                Workspaces ({formattedWorkspaces.length})
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
                      className={`text-gray-500 transition-transform duration-200 ${openSections.workspaces ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
                {openSections.workspaces && (
                  <>
                    <div className="p-3 border-t border-gray-200">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search workspaces"
                          value={workspaceSearchKeyword}
                          onChange={e => setWorkspaceSearchKeyword(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto border-t border-gray-200">
                      {filteredWorkspaces.length > 0 ? filteredWorkspaces.map(workspace => (
                        <div key={workspace.id} className="flex items-center p-3 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            id={`workspace-${workspace.id}`}
                            checked={selectedWorkspaces.includes(workspace.id)}
                            onChange={() => handleWorkspaceToggle(workspace.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <div className="flex items-center ml-3">
                            <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-medium mr-2">
                              {workspace.initial}
                            </div>
                            <label htmlFor={`workspace-${workspace.id}`} className="text-sm text-gray-700 cursor-pointer truncate max-w-[150px]">
                              {workspace.name}
                            </label>
                          </div>
                        </div>
                      )) : (
                        <div className="p-3 text-sm text-gray-500 text-center">
                          {formattedWorkspaces.length === 0 ? 'No workspaces available' : 'No workspaces found'}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Clients Section */}
            {showClientsSection && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Clients ({formattedClients.length})
                </label>
                <div className="border border-gray-300 rounded-lg">
                  <div
                    className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSection('clients')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {selectedClients.length} client{selectedClients.length !== 1 ? 's' : ''} selected
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform duration-200 ${openSections.clients ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                  {openSections.clients && (
                    <>
                      <div className="p-3 border-t border-gray-200">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search clients"
                            value={clientSearchKeyword}
                            onChange={e => setClientSearchKeyword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto border-t border-gray-200">
                        {filteredClients.length > 0 ? filteredClients.map(client => (
                          <div key={client.id} className="flex items-center p-3 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              id={`client-${client.id}`}
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleClientToggle(client.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                            />
                            <div className="flex items-center ml-3">
                              <div className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-medium mr-2">
                                {client.initial}
                              </div>
                              <label htmlFor={`client-${client.id}`} className="text-sm text-gray-700 cursor-pointer truncate max-w-[150px]">
                                {client.name}
                              </label>
                            </div>
                          </div>
                        )) : (
                          <div className="p-3 text-sm text-gray-500 text-center">
                            {formattedClients.length === 0 ? 'No clients available' : 'No clients found'}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Appointment Status */}
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
                    {selectedAppointmentStatus
                      ? appointmentStatuses.find(s => s.id === selectedAppointmentStatus)?.name || 'Select status'
                      : 'Select appointment status'}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${openSections.appointmentStatus ? 'rotate-180' : ''}`}
                  />
                </div>
                {openSections.appointmentStatus && (
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-3" />
                      <label className="text-sm text-gray-700 cursor-pointer flex-1">
                        <input
                          type="radio" name="appointmentStatus" value=""
                          checked={selectedAppointmentStatus === ''}
                          onChange={e => setSelectedAppointmentStatus(e.target.value)}
                          className="mr-2"
                        />
                        All Statuses
                      </label>
                    </div>
                    {appointmentStatuses.map(status => (
                      <div key={status.id} className="flex items-center mb-2 last:mb-0">
                        <div className={`w-3 h-3 ${status.color} rounded-full mr-3`} />
                        <label className="text-sm text-gray-700 cursor-pointer flex-1">
                          <input
                            type="radio" name="appointmentStatus" value={status.id}
                            checked={selectedAppointmentStatus === status.id}
                            onChange={e => setSelectedAppointmentStatus(e.target.value)}
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

          {/* Footer */}
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