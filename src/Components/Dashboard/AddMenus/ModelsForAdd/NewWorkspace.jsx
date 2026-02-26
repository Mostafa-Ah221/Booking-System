import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDispatch } from 'react-redux';
import { getWorkspace, createWorkSpace, updataWorkspace } from '../../../../redux/apiCalls/workspaceCallApi';
import toast from "react-hot-toast";

const WorkspaceModal = ({ isOpen, onClose, editWorkspace = null }) => {
  const [workspace, setWorkspace] = useState({
    name: "",
    id: null
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (editWorkspace) {
      setWorkspace({
        name: editWorkspace.name,
        id: editWorkspace.id
      });
      setIsEditMode(true);
    } else {
      setWorkspace({ name: "", id: null });
      setIsEditMode(false);
    }
    setIsLoading(false); 
  }, [editWorkspace, isOpen]);
  
  const handleSubmit = async () => {
    if (!workspace.name) {
      toast.error("Workspace name is required!");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      
      if (isEditMode) {
        response = await dispatch(updataWorkspace(workspace.id, workspace.name));
      } else {
        response = await dispatch(createWorkSpace(workspace.name));
      }

      if (response?.success) {
        dispatch(getWorkspace());
        onClose();
        setWorkspace({ name: "", id: null });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("An error occurred while " + (isEditMode ? "updating" : "creating") + " the workspace.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  // Modal content
  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Workspace" : "New Workspace"}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter workspace name"
              value={workspace.name}
              onChange={(e) => setWorkspace({...workspace, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className={`px-5 py-2 border rounded-lg transition-colors ${
                isLoading
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>

            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-5 py-2 text-white rounded-lg transition-colors ${
                isLoading 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoading ? "Processing..." : (isEditMode ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Use createPortal to render at document.body level
  return createPortal(modalContent, document.body);
};

export default WorkspaceModal;