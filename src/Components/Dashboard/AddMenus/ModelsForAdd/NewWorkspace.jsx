import { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDispatch } from 'react-redux';
import { getWorkspace, createWorkSpace, updataWorkspace } from '../../../../redux/apiCalls/workspaceCallApi';

const WorkspaceModal = ({ isOpen, onClose, editWorkspace = null }) => {
  if (!isOpen) return null;
  
  const [workspace, setWorkspace] = useState({
    name: "",
    id: null
  });
  const [isEditMode, setIsEditMode] = useState(false);
  
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
  }, [editWorkspace, isOpen]);
  
  const handleSubmit = async () => {
    if (!workspace.name) {
      alert("Workspace name is required!");
      return;
    }

    try {
      let response;
      
      if (isEditMode) {
        response = await dispatch(updataWorkspace(workspace.id, workspace.name));
      } else {
        response = await dispatch(createWorkSpace(workspace.name));
      }

      if (response?.success) {
        dispatch(getWorkspace());
        setWorkspace({ name: "", id: null });
        onClose();
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred while " + (isEditMode ? "updating" : "creating") + " the workspace.");
    }
  };
  // Using React Portal to render modal at the root level
  return (
    
    <div className="fixed inset-0 flex items-start justify-center bg-black/40 z-50 p-5 w-[100vw]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mt-10 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Edit Workspace" : "New Workspace"}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-200 rounded-full"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter workspace name"
              value={workspace.name}
              onChange={(e) => setWorkspace({...workspace, name: e.target.value})}
              className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ml-2 transition-colors"
            >
              {isEditMode ? "Update" : "Create"}
            </button>

            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2 bg-gray-100 text-gray-700 border rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceModal;