import { useEffect, useState } from "react";
import { User, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { assignWorkSpToStaff } from "../../../redux/apiCalls/workspaceCallApi";
import { getStaff , getStaffByFilter } from "../../../redux/apiCalls/StaffCallApi";

export default function AssignWorkspaceModal({ isOpen, onClose, workspaceId }) {
  const dispatch = useDispatch();
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { staffs,filteredStaffs, loading, error } = useSelector(state => state.staff);
console.log(staffs);

  useEffect(() => {
    if (isOpen) {
      dispatch(getStaff());
    }
  }, [dispatch, isOpen]);
  useEffect(() => {
    
      dispatch(getStaffByFilter({ work_space_id: workspaceId }));
    
  }, [dispatch, isOpen,workspaceId]);


   useEffect(() => {
    if (Array.isArray(filteredStaffs) && filteredStaffs.length > 0) {
     const assignedStaffIds = filteredStaffs
      .filter(staff => staff.status !== "0") 
      .map(staff => staff.id);

      setSelectedStaff(assignedStaffIds);
    }
  }, [filteredStaffs]);
 const filteredStaff = Array.isArray(staffs)
  ? staffs.filter(staff => {
      if (!staff || typeof staff.name !== 'string' || staff.status === "0") {
        return false;
      }

      if (!searchQuery.trim()) {
        return true;
      }

      return staff.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
  : [];


  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(filteredStaff.map(s => s.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectStaff = (id) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(selectedStaff.filter(s => s !== id));
      setSelectAll(false);
    } else {
      setSelectedStaff([...selectedStaff, id]);
    }
  };

  const handleAssign = async () => {
    if (selectedStaff.length === 0) {
      return;
    }

    setIsLoading(true);
    
    const formData = {
      staff_ids: selectedStaff
    };

    const result = await dispatch(assignWorkSpToStaff(workspaceId, formData));
    
    setIsLoading(false);

    if (result.success) {
          await dispatch(getStaffByFilter({ work_space_id: workspaceId }));

      setSelectedStaff([]);
      setSelectAll(false);
      setSearchQuery("");
      dispatch(getStaff());
      onClose();
    }
  };

 
  useEffect(() => {
    if (!isOpen) {
      setSelectedStaff([]);
      setSelectAll(false);
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
          <h2 className="text-lg font-semibold text-gray-800">Assign Staff</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Select All */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <p className="text-sm text-gray-600">
            {filteredStaff.length} staff available
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">Select All</span>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              disabled={filteredStaff.length === 0}
              className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
        </div>

        {/* Staff List */}
        <div className="flex-1 overflow-y-auto px-3">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-500 text-sm">
                {searchQuery ? "No staff found matching your search" : "No staff available"}
              </p>
            </div>
          ) : (
            filteredStaff.map((staff) => (
              <div 
                key={staff.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded-lg"
                onClick={() => handleSelectStaff(staff.id)}
              >
                <div className="flex items-center gap-3">
                  {typeof staff?.photo === "string" && staff.photo.trim() !== "" ? (
                    <img
                      src={staff.photo}
                      className="w-7 h-7 rounded-full bg-blue-200 object-cover"
                      alt={staff.name || "Staff"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) :  (
                          <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold uppercase">
                            {staff?.name ? staff.name.charAt(0) : "?"}
                          </div>
                        )}
                  <div 
                    className={`w-7 h-7 rounded-full bg-blue-200 items-center justify-center text-blue-700 ${
                      staff?.photo ? 'hidden' : 'flex'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {staff.name || "Unknown Staff"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {staff.email || "No email"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStaff.includes(staff.id)}
                  onChange={() => handleSelectStaff(staff.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {selectedStaff.length} selected
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              onClick={handleAssign}
              disabled={selectedStaff.length === 0 || isLoading}
              className="px-4 py-2 text-sm text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Assigning..." : "Assign Staff"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}