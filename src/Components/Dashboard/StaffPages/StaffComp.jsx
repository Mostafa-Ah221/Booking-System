import { useEffect, useState } from 'react';
import { Search, Plus, Share, ChevronDown, User, Ellipsis, AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStaff, deleteStaff, updateShareLinkStaff } from '../../../redux/apiCalls/StaffCallApi';
import { useDispatch, useSelector } from 'react-redux';
import AddStaff from '../AddMenus/ModelsForAdd/AddStaff';
import ShareBookingModal from '../Profile_Page/ShareModalPrpfile';
import { usePermission } from '../../hooks/usePermission';

// Delete Confirmation Modal Component
function DeleteConfirmModal({ isOpen, onClose, onConfirm, staffName, isDeleting }) {

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Delete Recruiter</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the recruiter member <span className="font-semibold">"{staffName}"</span>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Warning:</span> All data associated with this recruiter member will be permanently deleted and cannot be restored.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaffComp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isUpdatingShareLink, setIsUpdatingShareLink] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { staffs, staff, loading, error } = useSelector(state => state.staff);
  const dispatch = useDispatch();
  const canCreateStaff = usePermission("create staff");
  const canEditStaff = usePermission("edit staff");
  const canDeleteStaff = usePermission("destroy staff");
  useEffect(() => {
    dispatch(getStaff());
  }, [dispatch]);

  const handleShareClick = (e, staffMember) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStaff(staffMember);
    setIsShareModalOpen(true);
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

  const handleDeleteClick = (e, staffMember) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm(staffMember);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      setIsDeleting(true);
      const result = await dispatch(deleteStaff(deleteConfirm.id));
      
      if (result.success) {
        setDeleteConfirm(null);
        setHoveredCard(null);
      }
    } catch (error) {
      console.error('Error deleting recruiter:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const staffsArray = Array.isArray(staffs) ? staffs : 
                      (staffs?.data && Array.isArray(staffs.data)) ? staffs.data : 
                      [];
                      
  const filteredTutors = staffsArray.filter(tutor =>
    tutor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isInitialLoading = loading && staffsArray.length === 0;
  
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recruiter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="ltr">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">All Recruiter</h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                {filteredTutors.length}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <div className="text-sm text-gray-600 px-3 py-2">
                    Total recruiter: {filteredTutors.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {canCreateStaff && <button 
            onClick={() => setIsAddStaffOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Recruiter
          </button>}
         
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
            <Link 
              to={`/layoutDashboard/recruiter/${tutor.id}`} 
              key={tutor.id} 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
              onMouseEnter={() => setHoveredCard(tutor.id)}
              onMouseLeave={() => {
                setHoveredCard(null);
                setOpenMenuId(null);
              }}
            >
              <div className="space-y-4 relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    {tutor?.photo && typeof tutor.photo === 'string' && tutor.photo.trim() !== '' ? (
                      <img
                        src={tutor.photo}
                        alt={tutor.name || 'Recruiter'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{tutor.name || 'Unnamed'}</h3>
                    <p className="text-sm text-gray-500 truncate">{tutor.email || 'No email'}</p>
                  </div>
                  
                  {hoveredCard === tutor.id && (
                    <div className="absolute -top-2 -right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === tutor.id ? null : tutor.id);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full duration-200"
                      >
                        <Ellipsis className="w-5 h-5" />
                      </button>
                      
                      {openMenuId === tutor.id && (
                        <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                          {canEditStaff && (
                               <Link 
                            to={`/layoutDashboard/recruiter/${tutor.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                          >
                            Edit
                          </Link>
                          )}
                          {canDeleteStaff && (<button
                            onClick={(e) => handleDeleteClick(e, tutor)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                          >
                            Delete
                          </button>)}
                          
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tutor.status == 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-700">
                      {tutor.status == 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <button 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-3 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    onClick={(e) => handleShareClick(e, tutor)}
                  >
                    <Share className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full bg-white border border-gray-200 rounded-xl p-12 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No recruiter members found'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        staffName={deleteConfirm?.name || ''}
        isDeleting={isDeleting}
      />

      {/* Share Modal */}
      <ShareBookingModal
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        shareLink={`Staff/${selectedStaff?.share_link}`}
        profile={selectedStaff}
        onUpdateLink={handleUpdateShareLink}
        canShowEdit={canEditStaff}
      />
      
      {/* Add Staff Modal */}
      <AddStaff
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
      />
    </div>
  );
}