import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getPermissions, 
  createRole, 
  updateRole, 
  getRoleById ,
  getRoles
} from "../../../../redux/apiCalls/RolesCallApli";

const RoleModal = ({ isOpen, onClose, editRole = null }) => {
  const dispatch = useDispatch();
  const { permissions, role: roleData, loading, error } = useSelector((state) => state.roles);
  
  // Extract the actual role from the nested structure
  const role = roleData?.role;
  const rolePermissions = roleData?.rolePermissions || [];
  

  
  const [formData, setFormData] = useState({ name: "", permissions: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUpdateMode = Boolean(editRole);

  // Load permissions when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(getPermissions());
    }
  }, [isOpen, dispatch]);

  // Fetch role if update mode
  useEffect(() => {
    if (isOpen && isUpdateMode && editRole?.id) {
      dispatch(getRoleById(editRole.id));
    }
  }, [isOpen, isUpdateMode, editRole?.id, dispatch]);

  // Sync formData with role - FIXED VERSION WITHOUT LOOP
  useEffect(() => {
    if (!isOpen) return;

    if (isUpdateMode && role && editRole?.id && role.id === editRole.id) {
      // console.log("Setting form data with role:", role);
      // console.log("Using rolePermissions:", rolePermissions);
      
      setFormData({
        name: role.name || "",
        permissions: Array.isArray(rolePermissions) 
          ? rolePermissions.map(p => ({ id: p.id })) 
          : []
      });
    } else if (!isUpdateMode) {
      // console.log("Resetting form for create mode");
      setFormData({ name: "", permissions: [] });
    }
  }, [isOpen, isUpdateMode, role?.id, editRole?.id]);

  // Clear form data when modal closes - REMOVED TO PREVENT LOOP
  // useEffect(() => {
  //   if (!isOpen) {
  //     setFormData({ name: "", permissions: [] });
  //   }
  // }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => {
      const exists = prev.permissions.some(p => p.id === permissionId);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter(p => p.id !== permissionId)
          : [...prev.permissions, { id: permissionId }]
      };
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || formData.permissions.length === 0) return;

    setIsSubmitting(true);
    try {
      if (isUpdateMode) {
        await dispatch(updateRole(editRole.id, formData));
      } else {
        await dispatch(createRole(formData));
      }
      dispatch(getRoles());
      onClose();
      setFormData({ name: "", permissions: [] });
    } catch (err) {
      console.error("Error submitting role:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form data when closing manually
    setFormData({ name: "", permissions: [] });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/40 z-50 p-5">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mt-10 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">
            {isUpdateMode ? "Edit Role" : "Add Role"}
          </h2>
          <button 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        
        {/* {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )} */}

        {/* Form */}
        <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-purple-500"
              placeholder="Enter role name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions <span className="text-red-500">*</span>
            </label>
            {loading ? (
              <p className="text-gray-500 text-sm">Loading permissions...</p>
            ) : (
              <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                {permissions?.permissions?.map(p => (
                  <label key={p.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.permissions.some(sel => sel.id === p.id)}
                      onChange={() => handlePermissionToggle(p.id)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm">{p.tag_description}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
             <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name.trim() || formData.permissions.length === 0}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : isUpdateMode ? "Update" : "Create"}
            </button>
           
          </div>
        </form>

      </div>
    </div>
  );
};

export default RoleModal;