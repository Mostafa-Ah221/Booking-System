import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Share, Layout, ExternalLink, RefreshCw, Settings, Trash2, Share2 } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { usePermission } from "../../hooks/usePermission";
import { fetchInterviews, deleteInterview } from '../../../redux/apiCalls/interviewCallApi';
import ShareModal from '../InterviewsPages/InterViewPage/ShareModal'; 
import { getRecruiters } from '../../../redux/apiCalls/RecruiterCallApi';

const BookPage = () => {
  const [activeTab, setActiveTab] = useState('interviews');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isCompactView, setIsCompactView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recruiterSearchTerm, setRecruiterSearchTerm] = useState('');
  const [workspaceSearchTerm, setWorkspaceSearchTerm] = useState('');
  
  const dispatch = useDispatch();
  const { interviews, loading = false } = useSelector(state => state.interview);
  const { recruiters, recruiter } = useSelector(state => state.recruiters);
  const { profile } = useSelector(state => state.profileData);
  const { workspace, workspaces } = useSelector(state => state.workspace);
  
  const workspaceId = workspace ? workspace.id : 0;
  const profileData = profile?.user;
  const recruitersList = recruiters?.customers || [];

 const canViewInterviews = usePermission('view interview');
const canViewRecruiters = usePermission('view staff');

const tabs = [
  ...(canViewInterviews ? [{ id: 'interviews', label: 'Interviews' }] : []),
  ...(canViewRecruiters ? [{ id: 'recruiters', label: 'Recruiters' }] : []),
  { id: 'workspace', label: 'Workspace' },
];


  // Fetch recruiters on component mount
  useEffect(() => {
    dispatch(getRecruiters());
  }, [dispatch]);

  // Fetch interviews on component mount
  useEffect(() => {
    dispatch(fetchInterviews(workspaceId));
  }, [dispatch, workspaceId]);

  // Check screen size for compact view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsCompactView(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleShareClick = useCallback((interview, e) => {
    e?.preventDefault();
    setSelectedInterview(interview);
    setIsShareModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const handleDeleteInterview = useCallback(async (interviewId) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      await dispatch(deleteInterview(interviewId));
      dispatch(fetchInterviews(workspaceId));
    }
  }, [dispatch, workspaceId]);

  // Filter interviews based on search term
  const filteredInterviews = interviews?.filter(interview =>
    interview.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.mode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter recruiters based on search term
  const filteredRecruiters = recruitersList.filter(recruiter =>
    recruiter.name?.toLowerCase().includes(recruiterSearchTerm.toLowerCase()) ||
    recruiter.email?.toLowerCase().includes(recruiterSearchTerm.toLowerCase())
  );

  // Filter workspaces based on search term
  const filteredWorkspaces = workspaces?.filter(ws =>
    ws.name?.toLowerCase().includes(workspaceSearchTerm.toLowerCase())
  ) || [];

  // Generate initials from name
  const getInitials = useCallback((name) => {
    if (!name) return 'IN';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  }, []);

  // Generate random color for avatar
  const getAvatarColor = useCallback((index) => {
    const colors = [
      'bg-green-100 text-green-600',
      'bg-blue-100 text-blue-600',
      'bg-purple-100 text-purple-600',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600'
    ];
    return colors[index % colors.length];
  }, []);

  // Improved image rendering function with error handling
  const renderProfileImage = useCallback((imageUrl, name, size = 'w-10 h-10 lg:w-12 lg:h-12') => {
    const [imageError, setImageError] = useState(false);

    if (imageUrl && !imageError) {
      return (
        <img
          src={imageUrl}
          alt={name || 'Profile'}
          className={`${size} rounded-full object-cover`}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      );
    }

    // Fallback to icon
    return (
      <div className={`${size} bg-gray-200 rounded-full flex items-center justify-center`}>
        <CgProfile className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
      </div>
    );
  }, []);

  // Enhanced avatar component for interviews
  const InterviewAvatar = useCallback(({ interview, index, size = 'w-10 h-10 lg:w-12 lg:h-12' }) => {
    const [imageError, setImageError] = useState(false);

    if (interview.photo && !imageError) {
      return (
        <img
          src={interview.photo}
          alt="Interview"
          className={`${size} rounded-lg object-cover`}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      );
    }

    // Fallback to colored initial avatar
    return (
      <div className={`${size} rounded-lg flex items-center justify-center ${getAvatarColor(index)}`}>
        <span className="font-medium text-sm lg:text-base">
          {getInitials(interview.name)}
        </span>
      </div>
    );
  }, [getAvatarColor, getInitials]);

  // Enhanced recruiter avatar
  const RecruiterAvatar = useCallback(({ user, size = 'w-10 h-10' }) => {
    const [imageError, setImageError] = useState(false);

    if (user.photo && !imageError) {
      return (
        <img
          src={user.photo}
          alt={user.name}
          className={`${size} rounded-full object-cover`}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      );
    }

    // Fallback to initial avatar
    return (
      <div className={`${size} bg-gray-300 rounded-full flex items-center justify-center`}>
        <span className="text-gray-600 font-medium">
          {user.name?.charAt(0)?.toUpperCase() || 'R'}
        </span>
      </div>
    );
  }, []);

  // Render the appropriate content based on the active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'workspace':
        return (
          <div className="p-4 lg:p-6">
            {/* Search bar for workspace */}
            <div className="relative mb-4 lg:mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search workspaces"
                value={workspaceSearchTerm}
                onChange={(e) => setWorkspaceSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            
            {/* Workspace items */}
            <div className="space-y-3">
              {filteredWorkspaces.length > 0 ? (
                filteredWorkspaces.map((ws) => (
                  <Link
                    to="/bookPage/workspace-themes"
                    key={ws.id}
                    className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-white shadow-sm border hover:shadow-md hover:border-gray-300 transition duration-200"
                  >
                    {/* Left side - Icon + Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-md">
                        <span className="text-sm">{ws?.name?.charAt(0)?.toUpperCase() || 'W'}</span>
                      </div>
                      <span className="font-medium text-sm text-gray-800">
                        {ws?.name}
                      </span>
                    </div>

                    {/* Right side - Action buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
                        onClick={(e) => e.preventDefault()}
                      >
                        <RefreshCw size={isCompactView ? 14 : 16} />
                      </button>
                      <button 
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Share size={isCompactView ? 14 : 16} />
                      </button>
                      <button 
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Settings size={isCompactView ? 14 : 16} />
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm py-6">
                  {workspaceSearchTerm ? 'No workspaces match your search' : 'No workspaces available'}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'interviews':
        return (
          <>
            {/* Search Section */}
            <div className="p-4 lg:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search interviews"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Interviews List */}
            <div className="px-4 lg:px-6 pb-4 lg:pb-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Loading interviews...</p>
                </div>
              ) : filteredInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? 'No interviews match your search' : 'No interviews found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInterviews.map((interview, index) => (
                    <div 
                      key={interview.id} 
                      className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                    >
                      <InterviewAvatar interview={interview} index={index} />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm lg:text-base truncate">
                          {interview.name || 'Untitled Interview'}
                        </h3>
                        <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                          <span>{interview.duration_cycle || '30'} {interview.duration_period || 'mins'}</span>
                          <span>•</span>
                          <span>{interview.type || 'One-on-One'}</span>
                          {interview.mode && (
                            <>
                              <span>•</span>
                              <span className="truncate">{interview.mode}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action buttons - shown on hover */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/interview-layout/${interview.id}`}
                          className="p-1 lg:p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Settings size={isCompactView ? 16 : 18} />
                        </Link>
                        <button
                          onClick={(e) => handleShareClick(interview, e)}
                          className="p-1 lg:p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                        >
                          <Share2 size={isCompactView ? 16 : 18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInterview(interview.id);
                          }}
                          className="p-1 lg:p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={isCompactView ? 16 : 18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      
      case 'recruiters':
        return (
          <div className="p-4 lg:p-6">
            {/* Search bar */}
            <div className="relative mb-4 lg:mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search recruiters"
                value={recruiterSearchTerm}
                onChange={(e) => setRecruiterSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>

            {/* Recruiters list */}
            {filteredRecruiters.length > 0 ? (
              <div className="space-y-2">
                {filteredRecruiters.map((user) => (
                  <div key={user.id} className="flex items-center border-b py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                    <RecruiterAvatar user={user} />
                    <div className="flex-1 ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                {recruiterSearchTerm ? 'No recruiters match your search' : 'No recruiters found'}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="p-4 lg:p-6">
          <h1 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">Booking Pages</h1>
          
          {/* Profile Section */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div>
                    {renderProfileImage(profileData?.photo, profileData?.name)}
                  </div>
                </div>

                <div>
                  <h2 className="text-base lg:text-lg font-medium">
                    {profileData?.name || 'Loading...'}
                  </h2>
                  <p className="text-gray-600 text-xs lg:text-sm">
                    {profileData?.email || 'Loading...'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {/* <button className="flex items-center gap-2 px-3 lg:px-4 py-2 border rounded-md hover:bg-gray-50 flex-1 sm:flex-none justify-center text-sm lg:text-base transition-colors">
                  <ExternalLink size={isCompactView ? 16 : 18} />
                  <span>Open Page</span>
                </button> */}
                {/* <button 
                  onClick={() => handleShareClick()}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 border rounded-md hover:bg-gray-50 flex-1 sm:flex-none justify-center text-sm lg:text-base transition-colors"
                >
                  <Share size={isCompactView ? 16 : 18} />
                  <span>Share</span>
                </button> */}
                <Link 
                  to="/bookPage/themes-and-layout" 
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex-1 sm:flex-none justify-center text-sm lg:text-base transition-colors"
                >
                  <Layout size={isCompactView ? 16 : 18} />
                  <span>Themes and Layouts</span>
                </Link>
              </div>
            </div>
            <p className="text-gray-600 text-sm lg:text-base mt-3 lg:mt-4 pb-5 lg:pb-7">
              This is your unique booking page. It lists all the interviews you offer.
            </p>
            <hr />
          </div>

          {/* Share Modal */}
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={handleCloseModal}
            interview={selectedInterview}
          />
        </div>

        {/* Navigation Tabs - Scrollable on mobile */}
        <div className="border-b overflow-x-auto">
          <nav className="flex gap-4 lg:gap-8 px-4 lg:px-6 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`py-3 lg:py-4 px-1 border-b-2 transition-colors text-sm lg:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default BookPage;