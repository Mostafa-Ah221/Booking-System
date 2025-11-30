import { useDispatch, useSelector } from "react-redux";
import { staff_FetchInterviews } from "../../../redux/apiCalls/StaffapiCalls/StaffapiCalls";
import { useState, useRef, useEffect } from "react";
import { Wifi, WifiOff, Share2, MoreVertical, ExternalLink, Copy, Trash2 } from "lucide-react";
import Staff_ShareBookingModal from "../Staff_ShareBookingModal";
import Loader from "../../Loader";
import { Link, useOutletContext } from "react-router-dom";

export default function Staff_Interview() {
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  
  const { 
    staff_interviews = [], 
    loading = false, 
    error 
  } = useSelector(state => state.staffApis || {});

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const { selectWorkspace } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = {};
      
      if (selectWorkspace !== null && selectWorkspace !== undefined && selectWorkspace !== 0) {
        queryParams.work_space_id = selectWorkspace;
      }
      
      await dispatch(staff_FetchInterviews(queryParams));
    };
    
    fetchData();
  }, [selectWorkspace, dispatch]); 

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleShareClick = (interview, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedInterview(interview);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInterview(null);
  };

  const handleBookingPageClick = (interview, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Open booking page:", interview);
    setActiveMenuId(null);
  };
  
 

  if (loading && (staff_interviews?.length === 0)) {
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Staff Interviews</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staff_interviews.map((interview) => (
            <div key={interview.id} className="relative group">
              <Link
                 to={`/interview-layout/${interview.id}`}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full min-h-[200px] border border-transparent hover:border-purple-500 cursor-pointer transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-semibold mr-3 flex-shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold truncate  max-w-[150px]" title={interview.name}>
                      {interview.name}
                    </h2>
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
                </div>
              )}
            </div>
          ))}
        </div>
        
        {staff_interviews.length === 0 && !loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg text-gray-500">No interviews available</div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <Staff_ShareBookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        shareLink={`service/${selectedInterview?.share_link}`}
        profile={selectedInterview}
      />
    </div>
  );
}