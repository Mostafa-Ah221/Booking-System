import { useEffect, useState } from "react";
import { User, X, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getStaffByFilter } from "../../../../redux/apiCalls/StaffCallApi";
import { assignInterViewToStaff, getAvailableStaffForInterview } from "../../../../redux/apiCalls/interviewCallApi";
import CalendarAndTimePicker from "./CalendarAndTimePicker";

export default function AssignInterviewModal({ isOpen, onClose, interviewId }) {
  const dispatch = useDispatch();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({ from: "", to: "" });
  const [savedDates, setSavedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { availableStForIntV, loading, error } = useSelector(state => state.interview);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAvailableStaffForInterview(interviewId));
    }
  }, [dispatch, isOpen, interviewId]);

  const filteredStaff = Array.isArray(availableStForIntV)
    ? availableStForIntV.filter(staff => {
        if (!staff || typeof staff.name !== 'string') return false;
        if (!searchQuery.trim()) return true;
        return staff.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];

  const handleSelectStaff = (staff) => {
    setSelectedStaff(staff);
    setIsDropdownOpen(false);
    setSelectedDate(null);
    setSelectedTimeSlot({ from: "", to: "" });
    setSavedDates([]);
  };

  const handleAddDateTime = () => {
    if (!selectedDate || !selectedTimeSlot.from || !selectedTimeSlot.to) {
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const newDateEntry = {
      date: dateStr,
      from: selectedTimeSlot.from,
      to: selectedTimeSlot.to,
      displayDate: selectedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };

    setSavedDates([...savedDates, newDateEntry]);
    setSelectedDate(null);
    setSelectedTimeSlot({ from: "", to: "" });
  };

  const handleRemoveSavedDate = (index) => {
    setSavedDates(savedDates.filter((_, i) => i !== index));
  };

  const handleAssign = async () => {
    if (!selectedStaff || savedDates.length === 0) {
      return;
    }

    setIsLoading(true);

    const formData = {
      staff_id: selectedStaff.id,
      dates: savedDates.map(d => ({
        date: d.date,
        from: d.from,
        to: d.to
      }))
    };

    const result = await dispatch(assignInterViewToStaff(interviewId, formData));
    
    setIsLoading(false);

    if (result.success) {
      await dispatch(getStaffByFilter({ interview_id: interviewId }));
      setSelectedStaff(null);
      setSelectedDate(null);
      setSelectedTimeSlot({ from: "", to: "" });
      setSavedDates([]);
      setSearchQuery("");
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedStaff(null);
      setSelectedDate(null);
      setSelectedTimeSlot({ from: "", to: "" });
      setSavedDates([]);
      setSearchQuery("");
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Assign Staff to Interview</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Staff Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Staff
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                {selectedStaff ? (
                  <div className="flex items-center gap-3">
                    {selectedStaff.photo ? (
                      <img
                        src={selectedStaff.photo}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={selectedStaff.name}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                        {selectedStaff.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-gray-800">{selectedStaff.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">
                    {loading ? "Loading..." : "Select a staff member"}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-hidden">
                  {/* Search */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search staff..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Staff List */}
                  <div className="overflow-y-auto max-h-48">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                      </div>
                    ) : filteredStaff.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-500">
                        No staff available
                      </div>
                    ) : (
                      filteredStaff.map((staff) => (
                        <button
                          key={staff.id}
                          onClick={() => handleSelectStaff(staff)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          {staff.photo ? (
                            <img
                              src={staff.photo}
                              className="w-8 h-8 rounded-full object-cover"
                              alt={staff.name}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-sm">
                              {staff.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-800">{staff.name}</p>
                            <p className="text-xs text-gray-500">{staff.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Saved Dates List */}
          {selectedStaff && savedDates.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Dates & Times ({savedDates.length})</h3>
              <div className="space-y-2">
                {savedDates.map((dateEntry, index) => (
                  <div key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        {dateEntry.displayDate}
                      </span>
                      <span className="text-xs text-gray-500">
                        {dateEntry.from.slice(0, 5)} - {dateEntry.to.slice(0, 5)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSavedDate(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar and Time Picker */}
          {selectedStaff && (
            <>
              <CalendarAndTimePicker
                selectedStaff={selectedStaff}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
              />

              {/* Add Date/Time Button */}
              {selectedDate && selectedTimeSlot.from && selectedTimeSlot.to && (
                <button
                  onClick={handleAddDateTime}
                  className="w-full px-4 py-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 font-medium"
                >
                  + Add This Date & Time
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleAssign}
            disabled={!selectedStaff || savedDates.length === 0 || isLoading}
            className="px-4 py-2 text-sm text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Assigning..." : `Assign Staff (${savedDates.length})`}
          </button>
        </div>
      </div>
    </>
  );
}