import { useState, useRef, useEffect } from 'react';
import { Share2, MoreVertical, X, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewStaffById } from '../../../redux/apiCalls/StaffapiCalls/StaffapiCalls';
import Staff_ShareBookingModal from '../Staff_ShareBookingModal';

export default function NavInterview_Staff() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); 
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const menuModalRef = useRef(null);
  const menuButtonRef = useRef(null);
  const dispatch = useDispatch();
  const { profile: profileData } = useSelector(state => state.profileData);
  const org_share_link = profileData?.user.share_link;
const { staff_interview, loading } = useSelector(state => state.staffApis);
  useEffect(() => {
    if (id) {
      dispatch(editInterviewStaffById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showMenuModal &&
        menuModalRef.current &&
        !menuModalRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMenuModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenuModal]);

 
  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  // Handle booking page click
  const handleBookingPageClick = (e) => {
    e.preventDefault();
    const bookingLink = `${window.location.origin}/${org_share_link}/service/${staff_interview?.share_link}`;
    window.open(bookingLink, '_blank');
    setShowMenuModal(false); 
  };

  // Handle copy functionality
  const handleCopyClick = (e) => {
    e.preventDefault();
    // Add your copy logic here
    setShowMenuModal(false);
  };

  const handleUpdateShareLink = async (newShareLink, id) => {
    try {
      await dispatch(updateShareLinkIntreview(newShareLink, id));
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error updating share link:', error);
    }
  };

  // Handle delete functionality
  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteModal(true);
    setShowMenuModal(false);
  };


  return (
    <div className="relative">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-3">
                      {staff_interview?.photo ? (
                        <img
                          src={staff_interview?.photo}
                          alt="photo profile"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span>{staff_interview?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
              <div>
                <h1 className="text-[11px] md:text-lg font-semibold truncate block max-w-[150px]">
                  {staff_interview?.name || "Recruitment Strategy Meeting"}
                </h1>
                <p className="text-sm text-gray-500 ">
                  {staff_interview?.type}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
             
              <button 
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={handleShareClick}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              <Link to='/staff_dashboard_layout/Staff_Interviews' className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>


      <Staff_ShareBookingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={`service/${staff_interview?.share_link}`}
        profile={staff_interview}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 mx-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Interview</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "<span className="font-semibold truncate  max-w-[150px]">{staff_interview?.name}</span>"? 
              This will permanently remove the interview and all its data.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                // onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Interview</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}