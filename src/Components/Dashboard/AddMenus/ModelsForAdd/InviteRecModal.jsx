import { X, ChevronDown, ChevronUp, User, Mail, Lock, Phone, Shield, UserCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { addrecruiter, getRecruiters } from "../../../../redux/apiCalls/RecruiterCallApi";
import { getPermissions, getRoles } from "../../../../redux/apiCalls/RolesCallApli";

const InviteRecModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_code: "",
    phone: "",
    role_id: [],
    permissions: [],
    status: 1,
  });

  const [phoneValue, setPhoneValue] = useState("");
  const [errors, setErrors] = useState({});
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Refs for dropdown containers and modal
  const roleDropdownRef = useRef(null);
  const permissionDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const modalRef = useRef(null);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.recruiters.loading);
  const { roles, permissions } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(getRoles());
    dispatch(getPermissions());
  }, [dispatch]);


  // Handle clicks outside dropdowns
 useEffect(() => {
  const handleClickOutside = (event) => {
  if (modalRef.current && modalRef.current.contains(event.target)) {
    return;
  }

  if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
    setIsRoleDropdownOpen(false);
  }
  if (permissionDropdownRef.current && !permissionDropdownRef.current.contains(event.target)) {
    setIsPermissionDropdownOpen(false);
  }
  if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
    setIsStatusDropdownOpen(false);
  }
};


  if (isRoleDropdownOpen || isPermissionDropdownOpen || isStatusDropdownOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isRoleDropdownOpen, isPermissionDropdownOpen, isStatusDropdownOpen]);

  if (!isOpen) return null;

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_code: "",
      phone: "",
      role_id: [],
      permissions: [],
      status: 1,
    });
    setPhoneValue("");
    setErrors({});
    setIsRoleDropdownOpen(false);
    setIsPermissionDropdownOpen(false);
    setIsStatusDropdownOpen(false);
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);

    setFormData((prev) => ({
      ...prev,
      phone: value.replace(`+${country.dialCode}`, ""),
      phone_code: `+${country.dialCode}`,
    }));

    if (!value || value.length <= country.dialCode.length + 1) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number",
      }));
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(value, country.countryCode?.toUpperCase());

    if (!phoneNumber || !phoneNumber.isValid()) {
      setErrors((prev) => ({
        ...prev,
        phone: "The phone number is invalid for this country",
      }));
    } else {
      if (errors?.phone) {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
    }
  };

  const handleRoleChange = (roleId) => {
    setFormData((prev) => {
      const currentRoles = prev.role_id || [];
      const isSelected = currentRoles.includes(roleId);
      let updatedRoles;
      if (isSelected) {
        updatedRoles = currentRoles.filter((id) => id !== roleId);
      } else {
        updatedRoles = [...currentRoles, roleId];
      }
      return {
        ...prev,
        role_id: updatedRoles,
      };
    });

    if (errors.role_id) {
      setErrors((prev) => ({
        ...prev,
        role_id: "",
      }));
    }
  };

  const handlePermissionChange = (permissionId) => {
    setFormData((prev) => {
      const currentPermissions = prev.permissions || [];
      const isSelected = currentPermissions.includes(permissionId);
      let updatedPermissions;
      if (isSelected) {
        updatedPermissions = currentPermissions.filter((id) => id !== permissionId);
      } else {
        updatedPermissions = [...currentPermissions, permissionId];
      }
      return {
        ...prev,
        permissions: updatedPermissions,
      };
    });

    if (errors.permissions) {
      setErrors((prev) => ({
        ...prev,
        permissions: "",
      }));
    }
  };

  const handleInvite = async () => {
    try {
      const result = await dispatch(addrecruiter(formData));

      if (result.success) {
        dispatch(getRecruiters());
        clearForm();
        onClose();
      } else {
        if (result.error?.response?.data?.errors) {
          setErrors(result.error.response.data.errors);
        }
      }
    } catch (error) {
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col" ref={modalRef}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Invite New Users</h2>
                <p className="text-purple-100 text-sm">Add a new team member to your organization</p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="px-8 py-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Personal Information
              </h3>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-1 text-gray-500" />
                  Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter User's full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.name}
                </p>}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-1 text-gray-500" />
                  Email Address <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Users@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 ${
                    errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.email}
                </p>}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-1 text-gray-500" />
                  Contact Number <span className="text-red-500 ml-1">*</span>
                </label>
                <PhoneInput
                  country="eg"
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  inputProps={{
                    name: "phone",
                    required: true,
                    className: "!pl-16 w-full p-3 border rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-300 focus:border-purple-400",
                    placeholder: "Enter mobile number",
                  }}
                  containerClass="w-full"
                  inputClass="w-full p-3 border rounded-xl"
                  buttonClass="!border-r !bg-gray-50 !px-3 !rounded-l-xl"
                  dropdownClass="!bg-white !border !shadow-xl !rounded-xl"
                  searchClass="!p-3 !border-b"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.phone}
                </p>}
              </div>
            </div>

            {/* Security & Access Section */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-purple-600" />
                Security & Access
              </h3>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-1 text-gray-500" />
                  Password <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Create secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 ${
                    errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.password}
                </p>}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-1 text-gray-500" />
                  Confirm Password <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.password_confirmation}
                  onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 ${
                    errors.password_confirmation ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Account Status Dropdown */}
              <div className="relative" ref={statusDropdownRef}>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <UserCheck className="w-4 h-4 mr-1 text-gray-500" />
                  Account Status
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                    setIsRoleDropdownOpen(false);
                    setIsPermissionDropdownOpen(false);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 text-left flex items-center justify-between hover:border-purple-400"
                >
                  <span className="text-gray-700 flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {formData.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                  {isStatusDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
                    <div className="p-2">
                      <div
                        className="flex items-center py-3 px-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors duration-200"
                        onClick={() => {
                          handleInputChange("status", 1);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700 font-medium">Active</span>
                        {formData.status === 1 && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div
                        className="flex items-center py-3 px-3 hover:bg-red-50 rounded-lg cursor-pointer transition-colors duration-200"
                        onClick={() => {
                          handleInputChange("status", 0);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700 font-medium">Inactive</span>
                        {formData.status === 0 && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Roles & Permissions Section */}
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Roles & Permissions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Roles Dropdown */}
              <div className="relative" ref={roleDropdownRef}>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 mr-1 text-gray-500" />
                  Roles <span className="text-red-500 ml-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsRoleDropdownOpen(!isRoleDropdownOpen);
                    setIsPermissionDropdownOpen(false);
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-300 text-left flex items-center justify-between transition-all duration-200 ${
                    errors.role_id ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-purple-400"
                  }`}
                >
                  <span className="text-gray-700">
                    {formData.role_id && formData.role_id.length > 0
                      ? `${formData.role_id.length} role(s) selected`
                      : "Select roles..."}
                  </span>
                  {isRoleDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {formData.role_id && formData.role_id.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.role_id.map((roleId) => {
                      const role = roles?.find((r) => r.id === roleId);
                      return role ? (
                        <span
                          key={roleId}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200"
                        >
                          {role.name}
                          <button
                            type="button"
                            onClick={() => handleRoleChange(roleId)}
                            className="ml-2 text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {isRoleDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {roles && roles.length > 0 ? (
                      <div className="p-2">
                        {roles.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-center py-3 px-3 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors duration-200"
                            onClick={() => handleRoleChange(role.id)}
                          >
                            <input
                              type="checkbox"
                              id={`role-${role.id}`}
                              checked={formData.role_id?.includes(role.id) || false}
                              onChange={() => handleRoleChange(role.id)}
                              className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <label
                              htmlFor={`role-${role.id}`}
                              className="text-sm text-gray-700 cursor-pointer capitalize flex-1 font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {role.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        <Shield className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                        No roles available
                      </div>
                    )}
                  </div>
                )}

                {errors.role_id && <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.role_id}
                </p>}
              </div>

              {/* Permissions Dropdown */}
              <div className="relative" ref={permissionDropdownRef}>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 mr-1 text-gray-500" />
                  Permissions <span className="text-red-500 ml-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsPermissionDropdownOpen(!isPermissionDropdownOpen);
                    setIsRoleDropdownOpen(false);
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-300 text-left flex items-center justify-between transition-all duration-200 ${
                    errors.permissions ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-purple-400"
                  }`}
                >
                  <span className="text-gray-700">
                    {formData.permissions && formData.permissions.length > 0
                      ? `${formData.permissions.length} permission(s) selected`
                      : "Select permissions..."}
                  </span>
                  {isPermissionDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {formData.permissions && formData.permissions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.permissions.map((permissionId) => {
                      const permission = permissions?.permissions?.find((p) => p.id === permissionId);
                      return permission ? (
                        <span
                          key={permissionId}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border border-indigo-200"
                        >
                          {permission.tag_description}
                          <button
                            type="button"
                            onClick={() => handlePermissionChange(permissionId)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {isPermissionDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {permissions?.permissions && permissions.permissions.length > 0 ? (
                      <div className="p-2">
                        {permissions.permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center py-3 px-3 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors duration-200"
                            onClick={() => handlePermissionChange(permission.id)}
                          >
                            <input
                              type="checkbox"
                              id={`permission-${permission.id}`}
                              checked={formData.permissions?.includes(permission.id) || false}
                              onChange={() => handlePermissionChange(permission.id)}
                              className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <label
                              htmlFor={`permission-${permission.id}`}
                              className="text-sm text-gray-700 cursor-pointer capitalize flex-1 font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {permission.tag_description}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        <Shield className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                        No permissions available
                      </div>
                    )}
                  </div>
                )}

                {errors.permissions && <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.permissions}
                </p>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Fixed at bottom */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Create
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteRecModal;