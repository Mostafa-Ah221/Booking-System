import React, { useState, useEffect } from 'react';
import { Search, X, MoreVertical, Edit, Trash2, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWorkspaces, deleteWorkspace } from '../../../../redux/apiCalls/workspaceCallApi';
import WorkspaceModal from '../../../Dashboard/AddMenus/ModelsForAdd/NewWorkspace';
import DeleteWorkspaceModal from '../../../Dashboard/DeleteWorkspaceModal';
import { workspaceAction } from '../../../../redux/slices/workspaceSlice';
import toast from 'react-hot-toast';
import Loader from '../../../Loader';

const DropdownMenu = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg py-1 min-w-[180px] z-10 border">
      {children}
    </div>
  );
};

const WorkspaceManag = () => {
  const dispatch = useDispatch();
  const { allWorkspaces, workspace } = useSelector(state => state.workspace);

  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [workspaceToEdit, setWorkspaceToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    dispatch(getAllWorkspaces({ force: true }));
  }, [dispatch]);

  useEffect(() => {
    if (!isNewWorkspaceModalOpen && !isEditModalOpen) {
      dispatch(getAllWorkspaces({ force: true }));
    }
  }, [isNewWorkspaceModalOpen, isEditModalOpen, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleEdit = (workspaceItem) => {
    setWorkspaceToEdit(workspaceItem);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (workspaceItem, e) => {
    e.stopPropagation();
    setWorkspaceToDelete(workspaceItem);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!workspaceToDelete) return;
    setIsDeletingWorkspace(true);
    try {
      const response = await dispatch(deleteWorkspace(workspaceToDelete.id));
      if (response?.success || response?.payload?.success) {
        if (workspace && workspace.id === workspaceToDelete.id) {
          dispatch(workspaceAction.setWorkspace({ id: 0, name: "My Space" }));
        }
        dispatch(getAllWorkspaces({ force: true }));
      } else {
        toast.error('Error deleting workspace');
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast.error('Error deleting workspace');
    } finally {
      setIsDeletingWorkspace(false);
      setIsDeleteModalOpen(false);
      setWorkspaceToDelete(null);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => document.getElementById('mobile-search-input')?.focus(), 100);
    }
  };

  const filteredWorkspaces = allWorkspaces?.filter(workspaceItem =>
    workspaceItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!allWorkspaces) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500"><Loader /></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="py-4 text-sm">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-semibold">Workspaces</h1>
              <span className="bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                {allWorkspaces?.length || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:hidden">
              <button onClick={toggleSearch} className="p-2 rounded-full hover:bg-gray-100">
                <Search className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={() => setIsNewWorkspaceModalOpen(true)}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>

          {isSearchVisible && (
            <div className="sm:hidden relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search Workspace"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={toggleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}

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
              onClick={() => setIsNewWorkspaceModalOpen(true)}
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
            filteredWorkspaces.map(workspaceItem => {
              const isLocked = workspaceItem.is_locked === true;
              return (
                <div
                  key={workspaceItem.id}
                  className={`p-4 bg-white rounded-lg shadow-sm border transition-shadow relative
                    ${isLocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-md cursor-pointer"}
                  `}
                >
                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 rounded-lg bg-gray-100 bg-opacity-40 flex items-start justify-end p-2 pointer-events-none z-10">
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-500 shadow-sm">
                        <Lock size={11} />
                        <span>Locked</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium
                        ${isLocked ? "bg-gray-200 text-gray-400" : "bg-red-200 text-gray-700"}
                      `}>
                        {getInitials(workspaceItem.name)}
                      </div>
                      <span className={`font-medium text-sm truncate block max-w-[150px] ${isLocked ? "text-gray-400" : "text-gray-800"}`}>
                        {workspaceItem.name}
                      </span>
                    </div>

                    {/* Actions — hidden if locked */}
                    {!isLocked && (
                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === workspaceItem.id ? null : workspaceItem.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        <DropdownMenu
                          isOpen={openMenuId === workspaceItem.id}
                          onClose={() => setOpenMenuId(null)}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(workspaceItem); }}
                            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(workspaceItem, e)}
                            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              No workspaces found matching your search.
            </div>
          )}
        </div>
      </div>

      <WorkspaceModal isOpen={isNewWorkspaceModalOpen} onClose={() => setIsNewWorkspaceModalOpen(false)} />
      <WorkspaceModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setWorkspaceToEdit(null); }} editWorkspace={workspaceToEdit} />
      <DeleteWorkspaceModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setWorkspaceToDelete(null); }}
        onConfirm={handleConfirmDelete}
        workspaceName={workspaceToDelete?.name}
        isDeleting={isDeletingWorkspace}
      />
    </div>
  );
};

export default WorkspaceManag;