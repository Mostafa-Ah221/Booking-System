import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

const DeleteWorkspaceModal = ({ isOpen, onClose, onConfirm, workspaceName, isDeleting = false }) => {
  if (!isOpen) return null;

  // Create the modal content
  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Delete Workspace</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
            disabled={isDeleting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            Are you sure you want to delete the workspace <strong>"{workspaceName}"</strong>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">
              <strong>Warning:</strong> All interviews and data inside this workspace will be permanently deleted and cannot be restored.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isDeleting}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              isDeleting
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          
          <button 
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDeleting 
                ? 'bg-red-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal at the document body level
  return createPortal(modalContent, document.body);
};

export default DeleteWorkspaceModal;