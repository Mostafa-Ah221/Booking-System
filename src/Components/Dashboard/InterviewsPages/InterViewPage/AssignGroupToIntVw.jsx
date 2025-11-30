import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, AlertTriangle, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import profileImg from '../../../../assets/image/profile.png';
import AssignGroupsModal from './AssignGroupsModal';
import { deleteGroup, editInterviewById, unAssignStaffFromInterview } from '../../../../redux/apiCalls/interviewCallApi';

// Delete Confirmation Modal Component
function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, isDeleting, itemType }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="ltr">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Delete {itemType === 'resource' ? 'Resource' : 'Group'}
            </h2>
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
            Are you sure you want to delete the {itemType === 'resource' ? 'resource' : 'group'}{' '}
            <span className="font-semibold">"{itemName}"</span>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Warning:</span> All data associated with this {itemType === 'resource' ? 'resource' : 'group'} will be permanently deleted and cannot be restored.
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

export default function AssignGroupToIntVw() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const dispatch = useDispatch();
  const { interview, loading } = useSelector(state => state.interview);
  const interviewType = interview?.type;
  
  const prevInterviewIdRef = useRef(null);
  
  const groups = interview?.groups || [];
  const resources = interview?.resources || [];
  

  const displayData = interviewType === 'resource' 
    ? resources.map(r => ({ ...r, name: r.name, id: r.id }))
    : groups.map(g => ({ 
        ...g, 
        name: g.name, 
        id: g.group_id,
        description: g.group_description 
      }));
  
  console.log('Display Data:', displayData);
  
  const filteredData = displayData?.filter(item => {
    if (!item || !item.name) return false;
    
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];
  
  useEffect(() => {
    if (interview?.id && interview.id !== prevInterviewIdRef.current) {
      prevInterviewIdRef.current = interview.id;
      dispatch(editInterviewById(interview.id));
    }
  }, [interview?.id, dispatch]);

  const handleItemCreated = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    
    try {
      if (interviewType === 'resource') {
        const formData = new FormData();
        formData.append('resource_id', itemToDelete.id);
        await dispatch(unAssignStaffFromInterview(interview?.id, formData));
      } else {
        // ✅ استخدم group_id الأصلي من الـ item
        const originalGroupId = groups.find(g => g.group_id === itemToDelete.id)?.group_id || itemToDelete.id;
        await dispatch(deleteGroup(originalGroupId, interview?.id));
      }
      
      // Close modal after successful delete
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* right Side - Search and Actions */}
          <div className="flex items-center gap-3">
            {/* Add Button */}
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">
                {interviewType === 'resource' ? 'Add Resources' : 'Add Groups'}
              </span>
            </button>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                dir='ltr'
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          {/* left Side - Counter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">
                {interviewType === 'resource' ? 'Assigned Resources' : 'Favorite Groups'}
              </span>
              <span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-gray-700 bg-gray-100 rounded">
                {displayData.length}
              </span>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`flex cursor-pointer relative items-center justify-between px-6 py-4 bg-white rounded-xl border transition-all duration-200 ${
                hoveredItem === item.id
                  ? 'border-gray-300 shadow-md'
                  : 'border-gray-200'
              }`}
            >
              {/* Icon and Actions */}
              <div className="flex items-center gap-3">
                {/* Action Buttons - Show on Hover */}
                {hoveredItem === item.id && (
                  <div className="flex items-center gap-2">
                    {interviewType !== 'resource' && (
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
              {interviewType === "collective-booking" && (
                <div className="flex items-center justify-center absolute left-1/3 w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full">
                  <img src={profileImg} alt="profile" />
                </div>
              )}
              
              {/* Item Info */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-800 truncate  max-w-[150px]">
                  {item.name || 'Unnamed'}
                </span>
                <div className='w-8 h-8 flex justify-center items-center rounded-full bg-red-300'>
                  <span>{item.name ? item.name.slice(0, 1).toUpperCase() : '?'}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              {interviewType === 'resource' 
                ? 'No resources match your search' 
                : 'No groups match your search'}
            </div>
          )}
        </div>
        
        {/* Modals */}
        <AssignGroupsModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onComplete={handleItemCreated}
          workspaceId={interview?.workspace_id}
          interviewId={interview?.id}
          groups={groups}
          editingGroup={editingItem}
          interviewType={interviewType}
          resources={resources}
        />

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={itemToDelete?.name || ''}
          isDeleting={isDeleting}
          itemType={interviewType}
        />
      </div>
    </div>
  );
}