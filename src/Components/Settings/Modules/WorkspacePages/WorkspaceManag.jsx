import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Share, MoreVertical, Edit, Clock, Trash2, ChevronLeft } from 'lucide-react';
import WorkspaceDetails from './WorkspaceDetails';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 relative animate-fadeIn">
        {children}
      </div>
    </div>
  );
};

const DropdownMenu = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg py-1 min-w-[180px] z-10 border">
      {children}
    </div>
  );
};

const WorkspaceManag = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: 'Ahmed', initials: 'AH', isActive: true }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreateWorkspace = () => {
    if (workspaceName.trim()) {
      const initials = workspaceName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      setWorkspaces([
        ...workspaces,
        {
          id: workspaces.length + 1,
          name: workspaceName,
          initials,
          isActive: true
        }
      ]);
      setWorkspaceName('');
      setIsModalOpen(false);
    }
  };

  const handleEdit = (id) => {
    setOpenMenuId(null);
    // Add edit logic here
  };

  const handleMarkInactive = (id) => {
    setWorkspaces(workspaces.map(workspace => 
      workspace.id === id 
        ? { ...workspace, isActive: !workspace.isActive }
        : workspace
    ));
    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    setWorkspaces(workspaces.filter(workspace => workspace.id !== id));
    setOpenMenuId(null);
  };

  const handleWorkspaceClick = (workspace) => {
    setSelectedWorkspace(workspace);
  };

  const handleBackToList = () => {
    setSelectedWorkspace(null);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => document.getElementById('mobile-search-input')?.focus(), 100);
    }
  };

  const filteredWorkspaces = workspaces.filter(workspace => 
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      {/* Header - Workspace List View */}
      <div className={`py-4 ${selectedWorkspace ? 'hidden' : ''}`}>
        <div className="flex flex-col gap-4 mb-6">
          {/* Title and count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-semibold">Workspaces</h1>
              <span className="bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                {workspaces.length}
              </span>
            </div>
            
            {/* Mobile search toggle */}
            <div className="flex items-center gap-2 sm:hidden">
              <button 
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Search className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>
          
          {/* Mobile search input */}
          {isSearchVisible && (
            <div className="sm:hidden relative animate-fadeIn">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search Workspace"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={toggleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
          
          {/* Desktop search and add button */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Workspace"
                className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <span>+</span>
              <span>New Workspace</span>
            </button>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkspaces.length > 0 ? (
            filteredWorkspaces.map(workspace => (
              <div
                key={workspace.id}
                className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleWorkspaceClick(workspace)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center font-medium">
                      {workspace.initials}
                    </div>
                    <span className="font-medium">{workspace.name}</span>
                  </div>
                  <div className="relative dropdown-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === workspace.id ? null : workspace.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    <DropdownMenu
                      isOpen={openMenuId === workspace.id}
                      onClose={() => setOpenMenuId(null)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(workspace.id);
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkInactive(workspace.id);
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Mark as {workspace.isActive ? 'Inactive' : 'Active'}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(workspace.id);
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add share functionality
                    }}
                    className="flex items-center gap-2 text-purple-600 px-3 py-1 rounded-md hover:bg-purple-50 transition-colors"
                  >
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              No workspaces found matching your search.
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">New Workspace</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-4">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Workspace Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>

            <div className="flex justify-start gap-3">
              <button
                onClick={handleCreateWorkspace}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                disabled={!workspaceName.trim()}
              >
                Add
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Workspace Details View */}
      {selectedWorkspace && (
        <div className="animate-fadeIn">
          <div className="py-4 mb-4">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Workspaces</span>
            </button>
          </div>
          <WorkspaceDetails workspace={selectedWorkspace} />
        </div>
      )}
    </div>
  );
};

export default WorkspaceManag;