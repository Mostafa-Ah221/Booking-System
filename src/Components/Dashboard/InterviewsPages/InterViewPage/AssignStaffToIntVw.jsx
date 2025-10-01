import { Plus, Mail, Phone, MoreVertical, X, Share2, UserMinus } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";
import AssignInterviewModal from "./AssignInterviewModal";
import { useDispatch, useSelector } from "react-redux";
import { getStaffByFilter } from "../../../../redux/apiCalls/StaffCallApi";
import { unAssignStaffFromInterview } from "../../../../redux/apiCalls/interviewCallApi";

export default function AssignStaffToIntVw() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const { id } = useOutletContext();
  const dispatch = useDispatch();
  const { filteredStaffs, filteredStaffsLoading, error } = useSelector(
    (state) => state.staff
  );

  useEffect(() => {
    if (id) {
      dispatch(getStaffByFilter({ interview_id: id }));
    }
  }, [dispatch, id]);

  // إغلاق الـ dropdown لما تضغط براها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".portal-dropdown")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropdown = (e, staffId) => {
    if (openDropdownId === staffId) {
      setOpenDropdownId(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 150 + rect.width, 
    });
    setOpenDropdownId(staffId);
  };

  const handleUnassign = async (staffId) => {
    if (!window.confirm("Are you sure you want to unassign this staff member?")) {
      return;
    }

    const result = await dispatch(
      unAssignStaffFromInterview(id, { staff_id: staffId })
    );

    if (result?.success) {
      dispatch(getStaffByFilter({ interview_id: id }));
      setOpenDropdownId(null);
    }
  };

  const handleShare = (staff) => {
    console.log("Share staff:", staff);
    setOpenDropdownId(null);
  };

  const searchResults = Array.isArray(filteredStaffs)
    ? filteredStaffs.filter(
        (staff) =>
          staff?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff?.phone?.includes(searchTerm)
      )
    : [];

  return (
    <div className="p-3 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-xl font-semibold text-gray-800">Assigned Staff</h1>
          <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {searchResults.length}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-sm"
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
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Staff</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {filteredStaffsLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !filteredStaffsLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!filteredStaffsLoading && !error && searchResults.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-500 mb-2">
              {searchTerm
                ? "No staff found matching your search"
                : "No staff assignments found"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Staff Table */}
      {!filteredStaffsLoading && !error && searchResults.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searchResults.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {staff.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={staff.photo}
                              alt={staff.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  staff.name
                                )}&background=3b82f6&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                              {staff.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {staff.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {staff.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {staff.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.status === "1" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-600"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-gray-600"></span>
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => handleToggleDropdown(e, staff.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="More options"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ✅ Dropdown باستخدام Portal */}
      {openDropdownId &&
        createPortal(
          <div
            className="portal-dropdown fixed z-[9999] bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            <button
              onClick={() =>
                handleShare(
                  searchResults.find((s) => s.id === openDropdownId)
                )
              }
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => handleUnassign(openDropdownId)}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <UserMinus className="w-4 h-4" />
              Unassign
            </button>
          </div>,
          document.body
        )}

      <AssignInterviewModal
        interviewId={id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
