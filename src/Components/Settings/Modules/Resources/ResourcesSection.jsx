import React, { useState, useEffect, useRef } from 'react';
import ResourceDetails from './ResourceDetails';
import { PiShareFatBold } from "react-icons/pi";
import { IoIosSearch } from 'react-icons/io';
import { HiDotsVertical } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";
import { AlertTriangle, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getResources, getResourceById, deleteResource } from '../../../../redux/apiCalls/ResourceCallApi';

// Delete Confirmation Modal Component
function DeleteConfirmModal({ isOpen, onClose, onConfirm, resourceName, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Delete Resource</h2>
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
            Are you sure you want to delete the resource <span className="font-semibold">"{resourceName}"</span>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Warning:</span> All data associated with this resource will be permanently deleted and cannot be restored.
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

const ResourcesSection = () => {
  const dispatch = useDispatch();
  const { resources, loading, deleteLoading } = useSelector((state) => state.resources);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch(getResources());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getResourcesList = () => {
    if (!resources) return [];
    
    if (resources.resources && Array.isArray(resources.resources)) {
      return resources.resources;
    }
    if (resources.data && Array.isArray(resources.data)) {
      return resources.data;
    }
    if (Array.isArray(resources)) {
      return resources;
    }
    
    return [];
  };

  const resourcesList = getResourcesList();

  const filteredResources = resourcesList.filter(resource =>
    resource.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResourceClick = async (resource) => {
    setIsLoadingDetails(true);
    try {
      await dispatch(getResourceById(resource.id));
      setSelectedResource(resource);
    } catch (error) {
      console.error('Error loading resource details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleEdit = (e, resource) => {
    e.stopPropagation();
    setOpenMenuId(null);
    handleResourceClick(resource);
  };

  const handleDelete = (e, resource) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setResourceToDelete(resource);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (resourceToDelete) {
      await dispatch(deleteResource(resourceToDelete.id));
      setDeleteModalOpen(false);
      setResourceToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  const toggleMenu = (e, resourceId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === resourceId ? null : resourceId);
  };

  if (loading && resourcesList.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading resources...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* Loading Overlay */}
      {isLoadingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-xl">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Loading resource details...</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        resourceName={resourceToDelete?.name}
        isDeleting={deleteLoading}
      />
      
      {!selectedResource ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="text-lg font-medium">Resources</div>
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {resourcesList.length}
              </span>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoIosSearch className='text-gray-400' />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search Resource"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? 'No resources found matching your search' : 'No resources available'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredResources.map(resource => (
                <div 
                  key={resource.id}
                  className="relative p-3 sm:p-4 bg-gradient-to-b from-blue-50 via-white to-white border rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                  onClick={() => handleResourceClick(resource)}
                >
                  {/* Three Dots Menu */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => toggleMenu(e, resource.id)}
                      className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <HiDotsVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openMenuId === resource.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-1 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50 py-1"
                      >
                        <button
                          onClick={(e) => handleEdit(e, resource)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <MdEdit className="w-4 h-4 text-blue-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, resource)}
                          disabled={deleteLoading}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <MdDelete className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start justify-between h-24">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-violet-400 rounded-xl flex items-center justify-center">
                        <span className="text-black font-medium text-sm sm:text-base">
                          {resource.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm sm:text-base truncate  max-w-[150px]">
                        {resource.name}
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        resource.status == 1 || resource.status === true
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {resource.status == 1 || resource.status === true ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <ResourceDetails 
          resource={selectedResource} 
          onBack={() => setSelectedResource(null)} 
        />
      )}
    </div>
  );
};

export default ResourcesSection;