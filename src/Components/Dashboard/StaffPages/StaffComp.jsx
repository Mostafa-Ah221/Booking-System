import { useEffect, useState } from 'react';
import { Search, Plus, Share, ChevronDown, User, Ellipsis } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStaff, deleteStaff } from '../../../redux/apiCalls/StaffCallApi';
import { useDispatch, useSelector } from 'react-redux';
import ShareModalProfile from '../Profile_Page/ShareModalPrpfile';
import AddStaff from '../AddMenus/ModelsForAdd/AddStaff';

export default function StaffComp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  
  const { staffs, staff, loading, error } = useSelector(state => state.staff);
  const dispatch = useDispatch();
  console.log(staffs);

  useEffect(() => {
    dispatch(getStaff());
  }, [dispatch]);

  const handleShareClick = (e, staffMember) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStaff(staffMember);
    setIsShareModalOpen(true);
  };

  const handleDeleteClick = async (e, staffId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = window.confirm('Are you sure you want to delete this staff member?');
    
    if (confirmed) {
      const result = await dispatch(deleteStaff(staffId));
      
      if (result.success) {
        setOpenMenuId(null);
        setHoveredCard(null);
      }
    }
  };

  const staffsArray = Array.isArray(staffs) ? staffs : 
                      (staffs?.data && Array.isArray(staffs.data)) ? staffs.data : 
                      [];
                      
  const filteredTutors = staffsArray.filter(tutor =>
    tutor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="ltr">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        {/* Active Tutors Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Active Staff</h1>
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
                    Total active staff: {filteredTutors.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search and New Tutor Button */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
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

          {/* New Staff Button - ✅ تم إضافة onClick */}
          <button 
            onClick={() => setIsAddStaffOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Staff
          </button>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
            <Link 
              to={`/layoutDashboard/staff/${tutor.id}`} 
              key={tutor.id} 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
              onMouseEnter={() => setHoveredCard(tutor.id)}
              onMouseLeave={() => {
                setHoveredCard(null);
                setOpenMenuId(null);
              }}
            >
              <div className="space-y-4 relative">
                {/* Avatar and Info */}
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    {tutor?.photo && typeof tutor.photo === 'string' && tutor.photo.trim() !== '' ? (
                      <img
                        src={tutor.photo}
                        alt={tutor.name || 'Staff'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Name and Email */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{tutor.name || 'Unnamed'}</h3>
                    <p className="text-sm text-gray-500 truncate">{tutor.email || 'No email'}</p>
                  </div>
                  
                  {/* Menu Button - Appears on hover */}
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
                      
                      {/* Dropdown Menu */}
                      {openMenuId === tutor.id && (
                        <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                          <Link 
                            to={`/layoutDashboard/staff/${tutor.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={(e) => handleDeleteClick(e, tutor.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Section with Status and Share Button */}
                <div className="flex items-center justify-between">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tutor.status == 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-700">
                      {tutor.status == 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Share Button */}
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
              {searchTerm ? 'Try adjusting your search terms' : 'No staff members found'}
            </p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModalProfile
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        shareLink={selectedStaff?.share_link}
        profile={selectedStaff}
      />
      
      {/* Add Staff Modal */}
      <AddStaff
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
      />
    </div>
  );
}