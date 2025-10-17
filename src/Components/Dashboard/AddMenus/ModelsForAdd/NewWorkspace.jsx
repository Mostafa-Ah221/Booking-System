import { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDispatch } from 'react-redux';
import { getWorkspace, createWorkSpace, updataWorkspace } from '../../../../redux/apiCalls/workspaceCallApi';
import toast from "react-hot-toast";

const WorkspaceModal = ({ isOpen, onClose, editWorkspace = null }) => {
  if (!isOpen) return null;
  
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
    setIsLoading(false); // إعادة تعيين حالة التحميل عند فتح المودال
  }, [editWorkspace, isOpen]);
  
  const handleSubmit = async () => {
    if (!workspace.name) {
      toast.error("Workspace name is required!");
      return;
    }

    setIsLoading(true); // تشغيل حالة التحميل

    try {
      let response;
      
      if (isEditMode) {
        response = await dispatch(updataWorkspace(workspace.id, workspace.name));
      } else {
        response = await dispatch(createWorkSpace(workspace.name));
      }

      if (response?.success) {
        onClose();
        dispatch(getWorkspace());
        setWorkspace({ name: "", id: null });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("An error occurred while " + (isEditMode ? "updating" : "creating") + " the workspace.");
    } finally {
      setIsLoading(false); // إيقاف حالة التحميل
    }
  };
  
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
            disabled={isLoading} // تعطيل زر الإغلاق أثناء التحميل
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
              disabled={isLoading} // تعطيل الإدخال أثناء التحميل
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isLoading} // تعطيل الزر أثناء التحميل
              className={`px-5 py-2 text-white rounded-lg ml-2 transition-colors ${
                isLoading 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoading ? "Processing..." : (isEditMode ? "Update" : "Create")}
            </button>

            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading} // تعطيل زر الإلغاء أثناء التحميل
              className={`px-5 py-2 border rounded-lg transition-colors ${
                isLoading
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
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