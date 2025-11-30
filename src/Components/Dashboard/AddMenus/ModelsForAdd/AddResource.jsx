import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addResource } from "../../../../redux/apiCalls/ResourceCallApi";
import { getAllWorkspaces } from "../../../../redux/apiCalls/workspaceCallApi";

const AddResourceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.resources);
  const { allWorkspaces, loading: loadingWorkspaces } = useSelector(state => state.workspace);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
    work_space_id: ""
  });

  const [errors, setErrors] = useState({});
const truncateText = (text, max = 30) => {
  return text.length > max ? text.substring(0, max) + "..." : text;
};

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllWorkspaces());
    }
  }, [dispatch, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // مسح الـ error عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.work_space_id) {
      newErrors.work_space_id = "Workspace is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      name: formData.name,
      description: formData.description || "",
      status: formData.status,
      work_space_id: parseInt(formData.work_space_id)
    };

    console.log("Data to send:", dataToSend);

    const result = await dispatch(addResource(dataToSend));
    
    if (result?.success) {
      // Reset form
      setFormData({
        name: "",
        description: "",
        status: true,
        work_space_id: ""
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      status: true,
      work_space_id: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Add Resource</h2>
          <button 
            onClick={handleClose} 
            className="p-1 hover:bg-gray-200 rounded-full"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="E.g: conference rooms, laptops, equipment, etc" 
              className={`w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300 ${
                errors.name ? 'border-red-500' : ''
              }`}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Workspaces <span className="text-red-500">*</span>
            </label>
            <select 
              name="work_space_id"
              value={formData.work_space_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg ${
                errors.work_space_id ? 'border-red-500' : ''
              }`}
              disabled={loading || loadingWorkspaces}
            >
              <option value="">
                {loadingWorkspaces ? "Loading..." : "Select"}
              </option>
              {allWorkspaces && Array.isArray(allWorkspaces) && allWorkspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {truncateText(workspace.name, 25)}
                </option>

              ))}
            </select>
            {errors.work_space_id && (
              <p className="text-red-500 text-xs mt-1">{errors.work_space_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description" 
              className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))}
              className="mr-2"
              disabled={loading}
            />
            <label className="text-sm font-medium">Active</label>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button 
              type="button"
              onClick={handleClose} 
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;