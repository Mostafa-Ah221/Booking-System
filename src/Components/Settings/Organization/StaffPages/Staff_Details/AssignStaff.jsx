import { useEffect, useState } from 'react';
import { Search, MoreVertical, Share2, Trash2, Plus, X, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInterviews, updateShareLinkIntreview } from '../../../../../redux/apiCalls/interviewCallApi';
import { getAllWorkspaces, getWorkspace, updateShareLinkWorkspace } from '../../../../../redux/apiCalls/workspaceCallApi';
import AssignModal from './AssignModal';
import { useParams } from 'react-router-dom';
import Staff_ShareBookingModal from '../../../../Staff_Dashboard/Staff_ShareBookingModal';
import ShareBookingModal from '../../../../Dashboard/Profile_Page/ShareModalPrpfile';

const AssignStaff = ({ staff }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('workspace');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dispatch = useDispatch();
  const { interviews, loading: interviewsLoading } = useSelector(state => state.interview);
  const { workspaces, loading: workspacesLoading } = useSelector(state => state.workspace);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getWorkspace({ staff_id: id }));
      dispatch(fetchInterviews({ staff_id: id }));
    }
  }, [dispatch, id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMenuButton = event.target.closest('.menu-button');
      const isDropdown = event.target.closest('.dropdown-menu');
      
      if (!isMenuButton && !isDropdown) {
        setOpenMenu(null);
      }
    };

    if (openMenu !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const tabs = [
    { key: 'workspace', label: 'Assign Workspace' },
    { key: 'interview', label: 'Assign Interview' }
  ];

  const getFilteredData = () => {
    let data = [];
    if (activeTab === 'workspace') {
      data = Array.isArray(workspaces) ? workspaces : [];
    } else {
      data = Array.isArray(interviews) ? interviews : [];
    }

    if (searchTerm.trim()) {
      return data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return data;
  };

  const filteredData = getFilteredData();
  const isLoading = activeTab === 'workspace' ? workspacesLoading : interviewsLoading;

  const handleShareClick = (item, e) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsShareModalOpen(true);
    setOpenMenu(null);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedItem(null);
  };

  const handleUpdateShareLink = async (newShareLink, id) => {
    try {
      await dispatch(updateShareLinkWorkspace(newShareLink, id));
      await dispatch(getAllWorkspaces({ force: true }));
      setIsShareModalOpen(false);  
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating share link:', error);
    }
  };

  const handleUpdateShareLink_int = async (newShareLink, id) => {
    try {
      await dispatch(updateShareLinkIntreview(newShareLink, id));
      setIsShareModalOpen(false);  
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating share link:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">

          {/* Tabs - Responsive */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm border-b-2 transition-colors relative whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
           
            {activeTab === 'interview' && (
              <button 
                className='flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto'
                onClick={() => setIsAssignModalOpen(true)}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Assign Interview</span>
              </button>
            )}
          </div>

          {/* Header - Responsive */}
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 gap-3">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <h1 className="text-base sm:text-lg font-normal text-gray-900">
                {activeTab === 'workspace' ? 'Assigned Workspace' : 'Assigned Interview'}
              </h1>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded">
                {filteredData.length}
              </span>
            </div>

            {/* Search - Desktop */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'workspace' ? 'workspaces' : 'interviews'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>

            {/* Search - Mobile Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg absolute left-60 bottom-1.5"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="sm:hidden mb-4 relative animate-fadeIn">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'workspace' ? 'workspaces' : 'interviews'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  setShowMobileSearch(false);
                  setSearchTerm('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="content">
            {/* Loading state */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-3 text-sm text-gray-500">Loading...</p>
              </div>
            ) : activeTab === 'workspace' ? (
              // Card View for Workspaces - Fully Responsive
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredData.length > 0 ? (
                  filteredData.map((workspaceItem) => {
                    const initials = workspaceItem.name
                      .split(' ')
                      .map(word => word[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div
                        key={workspaceItem.id}
                        className="p-3 sm:p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-start"
                      >
                        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                              {workspaceItem.name}
                            </span>
                            {workspaceItem.description && (
                              <span className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                                {workspaceItem.description}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="relative flex-shrink-0 ml-2">
                          <button
                            onClick={() =>
                              setOpenMenu(openMenu === workspaceItem.id ? null : workspaceItem.id)
                            }
                            className="p-1 hover:bg-gray-100 rounded menu-button"
                          >
                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          </button>

                          {openMenu === workspaceItem.id && (
                            <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 dropdown-menu">
                              <button 
                                onClick={(e) => handleShareClick(workspaceItem, e)}
                                className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                Share
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500 col-span-full">
                    <p className="text-xs sm:text-sm">
                      {searchTerm ? 'No workspaces found matching your search' : 'No workspace assignments found'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Interview View - Responsive (Cards on mobile, Table on desktop)
              <>
                {/* Desktop Table Header - Hidden on Mobile */}
                <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-lg mb-2">
                  <div className="col-span-4">Event Type Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Duration</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2"></div>
                </div>

                {filteredData.length > 0 ? (
                  <div className="space-y-3">
                    {filteredData.map((session) => {
                      const initials = session.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <div key={session.id}>
                          {/* Desktop Table Row - Hidden on Mobile */}
                          <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="col-span-4 flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-200 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                {initials}
                              </div>
                              <span className="text-sm font-normal text-gray-900 truncate whitespace-nowrap">{session.name}</span>
                            </div>

                            <div className="col-span-2">
                              <span className="text-sm text-gray-600">{session.type}</span>
                            </div>

                            <div className="col-span-2">
                              <span className="text-sm text-gray-600">
                                {session.duration_cycle} {session.duration_period}
                              </span>
                            </div>

                            <div className="col-span-2">
                              <span className="text-sm text-gray-600">
                                {session.price == null ? 0 : session.price} {session.currency}
                              </span>
                            </div>

                            <div className="col-span-2 flex items-center justify-end gap-2">
                              <div className="relative">
                                <button
                                  onClick={() => setOpenMenu(openMenu === session.id ? null : session.id)}
                                  className="p-1 hover:bg-gray-100 rounded menu-button"
                                >
                                  <MoreVertical className="w-5 h-5 text-gray-400" />
                                </button>

                                {openMenu === session.id && (
                                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 dropdown-menu">
                                    <button 
                                      onClick={(e) => handleShareClick(session, e)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Share2 className="w-4 h-4" />
                                      Share
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Mobile Card - Visible only on Mobile */}
                          <div className="lg:hidden p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-12 h-12 bg-purple-200 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                  {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{session.name}</h3>
                                  <p className="text-xs text-gray-500 mt-0.5">{session.type}</p>
                                </div>
                              </div>
                              
                              <div className="relative flex-shrink-0 ml-2">
                                <button
                                  onClick={() => setOpenMenu(openMenu === session.id ? null : session.id)}
                                  className="p-1.5 hover:bg-gray-100 rounded-lg menu-button"
                                >
                                  <MoreVertical className="w-5 h-5 text-gray-500" />
                                </button>

                                {openMenu === session.id && (
                                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 dropdown-menu">
                                    <button 
                                      onClick={(e) => handleShareClick(session, e)}
                                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Share2 className="w-4 h-4" />
                                      Share
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Duration</span>
                                <span className="text-sm text-gray-900 font-semibold">
                                  {session.duration_cycle} {session.duration_period}
                                </span>
                              </div>
                              <div className="h-px bg-gray-200"></div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Price</span>
                                <span className="text-sm text-gray-900 font-semibold">
                                  {session.price == null ? 0 : session.price} {session.currency}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">
                      {searchTerm ? 'No interviews found matching your search' : 'No interview assignments found'}
                    </p>
                    {!searchTerm && (
                      <p className="text-xs text-gray-400 mt-1">
                        Click "Assign Interview" to get started
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        activeTab={activeTab}
        staffId={id}
        interviewsAssigned={interviews}
      />

      {/* Share Modal */}
      <ShareBookingModal
        isOpen={isShareModalOpen} 
        onClose={handleCloseShareModal} 
        shareLink={activeTab === 'workspace' ? `w/${selectedItem?.share_link}` : `service/${selectedItem?.share_link.share_link}`}
        profile={selectedItem}
        onUpdateLink={activeTab === 'workspace' ? handleUpdateShareLink : handleUpdateShareLink_int}
      />
    </>
  );
};

export default AssignStaff;