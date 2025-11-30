import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { getStaffByFilter } from "../../../../redux/apiCalls/StaffCallApi";
import { assignInterViewToStaff } from "../../../../redux/apiCalls/interviewCallApi";
import { getAvailableStaffForWorkspace } from "../../../../redux/apiCalls/workspaceCallApi";

export default function AssignInterviewModal({ isOpen, onClose, filteredStaffs, interview }) {
  const dispatch = useDispatch();
  const { id } = useOutletContext();
  const [selectedStaffIds, setSelectedStaffIds] = useState([]); // Changed to array
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { availableStForWorkS, loading } = useSelector(state => state.workspace);

  useEffect(() => {
    if (isOpen && id) {
      dispatch(getAvailableStaffForWorkspace(interview?.workspace_id));
    }
  }, [dispatch, isOpen, id]);

  // Get IDs of already assigned staff
  const assignedStaffIds = Array.isArray(filteredStaffs) 
    ? filteredStaffs.map(staff => staff.id)
    : [];

  // Filter out already assigned staff
  const availableStaff = Array.isArray(availableStForWorkS)
    ? availableStForWorkS.filter(staff => !assignedStaffIds.includes(staff.id))
    : [];

  const filteredStaff = availableStaff.filter(staff => {
    if (!staff || typeof staff.name !== 'string') return false;
    if (!searchQuery.trim()) return true;
    return staff.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectStaff = (staffId) => {
    setSelectedStaffIds(prev => {
      // إذا كان الموظف محدد، نشيله من القائمة
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId);
      }
      // إذا لم يكن محدد، نضيفه للقائمة
      return [...prev, staffId];
    });
  };

  const handleAssign = async () => {
    if (selectedStaffIds.length === 0 || !id) {
      return;
    }

    setIsLoading(true);

    const formData = {
      staff_ids: selectedStaffIds
    };

    const result = await dispatch(assignInterViewToStaff(id, formData));
    
    setIsLoading(false);

    if (result.success) {
      await dispatch(getStaffByFilter({ interview_id: id }));
      setSelectedStaffIds([]);
      setSearchQuery("");
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedStaffIds([]);
      setSearchQuery("");
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
          <h2 className="text-lg font-semibold text-gray-800">Assign Recruiters to Interview</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Recruiter Members ({selectedStaffIds.length} selected)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Recruiter..."
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

          {/* Staff List with Checkboxes */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                {availableStaff.length === 0 
                  ? "No recruiter found"
                  : "No recruiter found"}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredStaff.map((staff) => {
                  const isSelected = selectedStaffIds.includes(staff.id);
                  
                  return (
                    <label
                      key={staff.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-purple-50 ${
                        isSelected ? 'bg-purple-50' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectStaff(staff.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      
                      {typeof staff.photo === 'string' && staff.photo.trim() !== '' ? (
                        <img
                          src={staff.photo}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={staff.name}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-sm">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate block max-w-[150px]">{staff.name}</p>
                        <p className="text-xs text-gray-500 truncate block max-w-[150px]">{staff.email}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Staff Info */}
          {selectedStaffIds.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-700 font-medium mb-2">
                Selected Recruiters ({selectedStaffIds.length}):
              </p>
              <div className="space-y-1">
                {selectedStaffIds.map(staffId => {
                  const staff = filteredStaff.find(s => s.id === staffId) || 
                                availableStaff.find(s => s.id === staffId);
                  return (
                    <div key={staffId} className="flex items-center justify-between text-xs text-purple-600">
                      <span className="truncate block max-w-[150px]">• {staff?.name}</span>
                      <button
                        onClick={() => handleSelectStaff(staffId)}
                        className="text-purple-400 hover:text-purple-600"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
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
            disabled={selectedStaffIds.length === 0 || isLoading}
            className="px-4 py-2 text-sm text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Assigning..." : `Assign ${selectedStaffIds.length} Recruiter${selectedStaffIds.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </>
  );
}