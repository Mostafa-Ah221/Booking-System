import { useEffect, useState, useRef } from 'react';
import { Share2, MoreVertical, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInterviews, deleteInterview } from '../../../../redux/apiCalls/interviewCallApi';
import ShareModal from './ShareModal'; 
import Loader from '../../../Loader';

const Interviews = () => {
  const dispatch = useDispatch();
  const { interviews, loading = false } = useSelector(state => state.interview);
  const { workspace } = useSelector(state => state.workspace);
  const workspaceId = workspace ? workspace.id : 0;
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchInterviews(workspaceId));
  }, [workspaceId]);

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

  // Function to generate initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleMenu = (interviewId, e) => {
    e.preventDefault();
    setActiveMenuId(activeMenuId === interviewId ? null : interviewId);
  };
  
  // Open share modal
  const handleShareClick = (interview, e) => {
    e.preventDefault(); 
    setSelectedInterview(interview);
    setIsShareModalOpen(true);
  };

  // Handle booking page click
  const handleBookingPageClick = (interview, e) => {
    e.preventDefault();
    const bookingLink = `${window.location.origin}/share/${interview?.share_link}`;
    window.open(bookingLink, '_blank');
    setActiveMenuId(null); 
  };

  // Show loader when loading
  if (loading) {
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
      </div>

      {/* Show message if no interviews */}
      {interviews?.length === 0 ? (
       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
               <div className="text-lg"><Loader/></div>
             </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interviews?.map((interview) => (
            <div key={interview.id} className="relative group">
              <Link to={`/interview-layout/${interview.id}`} 
                className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full min-h-[200px] border border-transparent hover:border-purple-500"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-3">
                    <img src={interview.photo} alt="photo profile" className='w-full object-fill h-full rounded-full' />
                  </div>
                  <div>
                    <h2 className="font-semibold">{interview.name}</h2>
                    <p className="text-gray-500 text-sm">
                      {interview.type} | {interview.duration_cycle} {interview.duration_period}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <div className="text-gray-600">
                    {interview.mode}
                  </div>
                  <button 
                    onClick={(e) => handleShareClick(interview, e)}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </Link>
              
              {/* Three dots menu button (only visible on hover) */}
              <button 
                onClick={(e) => toggleMenu(interview.id, e)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={18} className="text-gray-600" />
              </button>
              
              {/* Dropdown menu */}
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
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Copy size={16} className="mr-2" />
                    Make a copy
                  </button>
                  <button
                    onClick={() => {
                      dispatch(deleteInterview(interview.id));
                      setActiveMenuId(null); 
                    }}
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
      )}
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        interview={selectedInterview}
      />
    </div>
  );
};

export default Interviews;