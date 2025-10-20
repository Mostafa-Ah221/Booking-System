import { useEffect, useState, useRef } from 'react';
import { Share2, MoreVertical, Trash2, Copy, ExternalLink, Plus, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInterviews, deleteInterview,updateShareLinkIntreview } from '../../../../redux/apiCalls/interviewCallApi';

import Loader from '../../../Loader';
import { interviewAction } from '../../../../redux/slices/interviewsSlice';
import ShareBookingModal from '../../Profile_Page/ShareModalPrpfile';
import { usePermission } from '../../../hooks/usePermission';

const Interviews = () => {
  const dispatch = useDispatch();
  const { interviews, loading = false, currentWorkspaceId } = useSelector(state => state.interview);
  const { profile: profileData } = useSelector(state => state.profileData);
  const { workspace } = useSelector(state => state.workspace);
  const workspaceId = workspace ? workspace.id : 0;
  const canEditInterviewf = usePermission("edit interview");

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const interviewsPerPage = 9;
  const org_share_link = profileData?.user.share_link;
  const menuRef = useRef(null);

  useEffect(() => {
    if (currentWorkspaceId !== null && currentWorkspaceId !== workspaceId) {
      dispatch(interviewAction.clearInterviews());
    }
    
    if (workspaceId !== null && workspaceId !== undefined) {
      dispatch(fetchInterviews({ work_space_id: workspaceId }));
    }
  }, [workspaceId, dispatch, currentWorkspaceId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
const handleUpdateShareLink = async (newShareLink,id) => {
    try {
      await dispatch(updateShareLinkIntreview(newShareLink,id));
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error updating share link:', error);
    }
  };

  const toggleMenu = (interviewId, e) => {
    e.preventDefault();
    setActiveMenuId(activeMenuId === interviewId ? null : interviewId);
  };

  const handleShareClick = (interview, e) => {
    e.preventDefault();
    setSelectedInterview(interview);
    setIsShareModalOpen(true);
  };

  const handleBookingPageClick = (interview, e) => {
    e.preventDefault();
    const bookingLink = `${window.location.origin}/${org_share_link}/service/${interview?.share_link}`;
    window.open(bookingLink, '_blank');
    setActiveMenuId(null);
  };

  const handleDeleteClick = (interview, e) => {
    e.preventDefault();
    setInterviewToDelete(interview);
    setShowDeleteModal(true);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (interviewToDelete) {
      dispatch(deleteInterview(interviewToDelete.id));
      setCurrentPage(1); // Reset to first page after deletion
      setShowDeleteModal(false);
      setInterviewToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setInterviewToDelete(null);
  };

  const handleCopyClick = (interview, e) => {
    e.preventDefault();
    // Add your copy logic here
    setActiveMenuId(null);
  };

  // Pagination Logic
  const indexOfLastInterview = currentPage * interviewsPerPage;
  const indexOfFirstInterview = indexOfLastInterview - interviewsPerPage;
  const currentInterviews = interviews?.slice(indexOfFirstInterview, indexOfLastInterview) || [];
  const totalPages = Math.ceil((interviews?.length || 0) / interviewsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if ((interviews?.length || 0) <= interviewsPerPage) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-between items-center mt-6 px-4 py-3 bg-white border-t rounded-lg shadow-sm">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstInterview + 1} to {Math.min(indexOfLastInterview, interviews?.length || 0)} of {interviews?.length || 0} interviews
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Previous
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === number
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading && (interviews?.length === 0 || currentWorkspaceId !== workspaceId)) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">All Interviews</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">
          All Interviews 
          <span className="bg-gray-200 px-2 py-1 rounded-md text-sm ml-2">
            {interviews?.length || 0}
          </span>
        </h1>
         <Link to={"/create_interview"} className='text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2'>
          <Plus size={18} />
            <span>Create Interview</span>
          </Link>
      </div>

      {!loading && interviews?.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-500 text-lg mb-4">No interviews found</div>
          <p className="text-gray-400">Create your first interview to get started</p>
         
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentInterviews.map((interview) => (
              <div key={interview.id} className="relative group">
                <Link
                  to={`/interview-layout/${interview.id}`}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full min-h-[200px] border border-transparent hover:border-purple-500"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-3">
                      {interview.photo ? (
                        <img
                          src={interview.photo}
                          alt="photo profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span>{interview.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold max-w-[150px] truncate tooltip whitespace-nowrap" title={interview.name}>{interview.name}</h2>
                      <p className="text-gray-500 text-sm">
                        {interview.type} | {interview.duration_cycle} {interview.duration_period}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-auto">
                    <div className={`flex items-center gap-2 ${
                    interview.mode === 'online' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {interview.mode === 'online' ? (
                      <Wifi size={16} />
                    ) : (
                      <WifiOff size={16} />
                    )}
                    <span className="capitalize">{interview.mode}</span>
                  </div>
                    <button
                      onClick={(e) => handleShareClick(interview, e)}
                      className="flex text-sm items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </Link>
                <button
                  onClick={(e) => toggleMenu(interview.id, e)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical size={18} className="text-gray-600" />
                </button>
                {activeMenuId === interview.id && (
                  <div
                    ref={menuRef}
                    className="absolute top-12 right-2 bg-white shadow-lg rounded-lg z-10 py-2 w-40"
                  >
                    <button
                      onClick={(e) => handleBookingPageClick(interview, e)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Booking Page
                    </button>
                    <button
                      onClick={(e) => handleCopyClick(interview, e)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy size={16} className="mr-2" />
                      Make a copy
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(interview, e)}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}
      {/* <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        interview={selectedInterview}
      /> */}
       <ShareBookingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={`service/${selectedInterview?.share_link}`}
        profile={selectedInterview}
        onUpdateLink={handleUpdateShareLink}
        loading={loading}
        canShowEdit={canEditInterviewf}
       />

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 mx-4 transform transition-all duration-200 scale-100">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Interview</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  {interviewToDelete?.photo ? (
                    <img
                      src={interviewToDelete.photo}
                      alt="interview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{interviewToDelete?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{interviewToDelete?.name}</p>
                  <p className="text-sm text-gray-500">{interviewToDelete?.type} • {interviewToDelete?.mode}</p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this interview? This will permanently remove all interview data, responses, and settings.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 font-medium"
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
};

export default Interviews;