import { Plus, Mail, Phone, MoreVertical, X, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import AssignWorkspaceModal from "./AssignWorkspaceModal";
import ShareBookingModal from "../Profile_Page/ShareModalPrpfile";
import { getStaffByFilter, updateShareLinkStaff } from "../../../redux/apiCalls/StaffCallApi";
import { useDispatch, useSelector } from "react-redux";
import { usePermission } from "../../hooks/usePermission";

export default function AssignWorkSpToStaff() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUpdatingShareLink, setIsUpdatingShareLink] = useState(false);

  const dispatch = useDispatch();
  const { workspace } = useSelector(state => state.workspace);
  const workspaceId = workspace ? workspace.id : 0;
  
  const { filteredStaffs, filteredStaffsLoading, error } = useSelector(state => state.staff);
  const canEditStaff = usePermission("edit staff");

  useEffect(() => {
    dispatch(getStaffByFilter({ work_space_id: workspaceId }));
  }, [dispatch, workspaceId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId && !event.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const handleShareClick = (staff) => {
    setSelectedStaff(staff);
    setIsShareModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleUpdateShareLink = async (newShareLink, id) => {
    try {
      setIsUpdatingShareLink(true);
      await dispatch(updateShareLinkStaff(newShareLink, id));
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error updating share link:', error);
    } finally {
      setIsUpdatingShareLink(false);
    }
  };

  const searchResults = Array.isArray(filteredStaffs) 
    ? filteredStaffs.filter(staff => 
        staff?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff?.phone?.includes(searchTerm)
      )
    : [];

  return (
    <div className="p-3 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-xl font-semibold text-gray-800">Assigned Recruiter</h1>
          <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {searchResults.length}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recruiter..."
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
            <span>Assign Recruiter</span>
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
              {searchTerm ? "No recruiter found matching your search" : "No recruiter assignments found"}
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
                    Recruiter Member
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
                  <tr 
                    key={staff.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Staff Member Column */}
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
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=3b82f6&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                              {staff.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate block max-w-[150px]">
                            {staff.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Column */}
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

                    {/* Status Column */}
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

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative dropdown-container">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === staff.id ? null : staff.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="More options"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openDropdownId === staff.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleShareClick(staff)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Workspace Modal */}
      <AssignWorkspaceModal
        workspaceId={workspaceId}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Share Modal */}
      <ShareBookingModal
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        shareLink={`s/${selectedStaff?.share_link}`}
        profile={selectedStaff}
        onUpdateLink={handleUpdateShareLink}
        canShowEdit={canEditStaff}
      />
    </div>
  );
}