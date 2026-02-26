import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, User, ChevronDown, ChevronUp } from 'lucide-react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getRecruiterById, updateRecruiter } from '../../../redux/apiCalls/RecruiterCallApi';
import { recruiterAction } from '../../../redux/slices/recruitersSlice';
import { getRoles, getPermissions } from "../../../redux/apiCalls/RolesCallApli";

export default function EditRecruiters({ isOpen, onCancel, recruiterId }) {
    const dispatch = useDispatch();
    const { recruiter, loading, error } = useSelector(state => state.recruiters);
    const { roles, permissions } = useSelector(state => state.roles);

    // Refs for dropdown containers
    const roleDropdownRef = useRef(null);
    const permissionDropdownRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        code_phone: '',
        phone: '',
        password: '',
        new_password: '',
        new_password_confirmation: '',
        status: 1,
        role_id: [],
        permissions: [],
    });
    const [phoneValue, setPhoneValue] = useState("");
    const [errors, setErrors] = useState({});
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false);


    // Handle click outside for dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside role dropdown
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
                setIsRoleDropdownOpen(false);
            }
            
            // Check if click is outside permission dropdown
            if (permissionDropdownRef.current && !permissionDropdownRef.current.contains(event.target)) {
                setIsPermissionDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        dispatch(getRoles());
        dispatch(getPermissions()); 
    }, [dispatch]);

    useEffect(() => {
        if (isOpen && recruiterId) {
            dispatch(getRecruiterById(recruiterId));
        }
    }, [dispatch, isOpen, recruiterId]);

 useEffect(() => {
    if (recruiter && recruiter.customer && isOpen) {
        const c = recruiter.customer;
        
        let fullPhone = "";
        if (c.code_phone && c.phone) {
            const cleanCode = c.code_phone.replace('+', '');
            fullPhone = `${cleanCode}${c.phone}`;
        }

        
        setFormData({
            name: c.name || '',
            email: c.email || '',
            code_phone: c.code_phone || '',
            phone: c.phone || '',
            password: '',
            new_password: '',
            new_password_confirmation: '',
            status: c.status !== undefined ? c.status : 1,
            role_id: recruiter?.rolePermissions?.map(rp => rp.id) || [],
            permissions: recruiter?.customerPermissions?.map(p => p.id) || [], 
        });
        
        setPhoneValue(fullPhone);
    }
}, [recruiter, isOpen]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (['status'].includes(name)) {
            processedValue = value === '' ? '' : Number(value);
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

   const handlePhoneChange = (value, country) => {
    setPhoneValue(value);

    // Extract phone number without country code
    const dialCode = country.dialCode;
    let phoneWithoutCode = value;
    
    // Remove + if exists at the start
    if (phoneWithoutCode.startsWith('+')) {
        phoneWithoutCode = phoneWithoutCode.substring(1);
    }
    
    // Remove dial code from the start
    if (phoneWithoutCode.startsWith(dialCode)) {
        phoneWithoutCode = phoneWithoutCode.substring(dialCode.length);
    }

    setFormData((prev) => ({
        ...prev,
        phone: phoneWithoutCode,
        code_phone: `+${dialCode}`,
    }));

    if (!value || value.length <= dialCode.length + 1) {
        setErrors(prev => ({
            ...prev,
            phone: "Please enter a valid phone number"
        }));
        return;
    }

    const phoneNumber = parsePhoneNumberFromString(value, country.countryCode?.toUpperCase());
    
    if (!phoneNumber || !phoneNumber.isValid()) {
        setErrors(prev => ({
            ...prev,
            phone: "The phone number is invalid for this country"
        }));
    } else {
        if (errors?.phone) {
            setErrors(prev => ({ ...prev, phone: undefined }));
        }
    }
};

    const handleRoleChange = (roleId) => {
        setFormData(prev => {
            const currentRoles = prev.role_id || [];
            const updatedRoles = currentRoles.includes(roleId)
                ? currentRoles.filter(id => id !== roleId)
                : [...currentRoles, roleId];
            return { ...prev, role_id: updatedRoles };
        });

        if (errors.role_id) setErrors(prev => ({ ...prev, role_id: '' }));
    };

    const handlePermissionChange = (permissionId) => {
        setFormData(prev => {
            const currentPermissions = prev.permissions || [];
            const updatedPermissions = currentPermissions.includes(permissionId)
                ? currentPermissions.filter(id => id !== permissionId)
                : [...currentPermissions, permissionId];
            return { ...prev, permissions: updatedPermissions };
        });

        if (errors.permissions) setErrors(prev => ({ ...prev, permissions: '' }));
    };

    // Prevent dropdown from closing when scrolling inside it
    const handleDropdownScroll = (e) => {
        e.stopPropagation();
    };

  const handleSave = async () => {
    if (!recruiterId) return;

    dispatch(recruiterAction.setError({}));

    // Prepare basic data
    const dataToSend = {
        name: formData.name,
        email: formData.email,
        code_phone: formData.code_phone || '',
        phone: formData.phone || '',
        status: Number(formData.status),
        role_id: formData.role_id,
        permissions: formData.permissions,
    };
    if (formData.password?.trim() && !formData.new_password?.trim()) {
        dataToSend.password = formData.password;
    }

    if (formData.password?.trim() && formData.new_password?.trim()) {
        dataToSend.password = formData.password;
        dataToSend.new_password = formData.new_password;
        dataToSend.new_password_confirmation = formData.new_password_confirmation;
    }

    if (!formData.password?.trim() && (formData.new_password?.trim() || formData.new_password_confirmation?.trim())) {
        dataToSend.password = "";
        dataToSend.new_password = formData.new_password || "";
        dataToSend.new_password_confirmation = formData.new_password_confirmation || "";
    }

    try {
        console.log('Data to send:', dataToSend);
        
        const result = await dispatch(updateRecruiter(recruiterId, dataToSend));
        if (result && result.success) {
            dispatch(recruiterAction.setError({}));
            onCancel();
        } else if (result && result.errors) {
            const formattedErrors = Object.keys(result.errors).reduce((acc, field) => {
                acc[field] = Array.isArray(result.errors[field])
                    ? result.errors[field].join(', ')
                    : result.errors[field];
                return acc;
            }, {});
            dispatch(recruiterAction.setError(formattedErrors));
        }
    } catch (err) {
        console.error('Update error:', err);
    }
};

    const handleCancel = () => {
        setFormData({
            name: '',
            email: '',
            code_phone: '',
            phone: '',
            password: '',
            new_password: '',
            new_password_confirmation: '',
            status: 1,
            role_id: [],
            permissions: [],
        });
        setPhoneValue("");
        dispatch(recruiterAction.setError({}));
        onCancel();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-[100vh] w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Edit User
                        {loading && <span className="text-sm text-blue-500 ml-2">(Loading...)</span>}
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Profile */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={32} className="text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600">
                            {formData.email || recruiter?.customer?.email || 'No email'}
                        </div>
                    </div>

                    {/* Basic Fields */}
                    {[
                        { label: 'Name', name: 'name', type: 'text' },
                        { label: 'Email', name: 'email', type: 'email' },
                    ].map(field => (
                        <div key={field.name} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                placeholder={field.placeholder || ''}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                            />
                            {error?.[field.name] && <p className="text-red-500 text-xs">{error[field.name]}</p>}
                        </div>
                    ))}

                    {/* Phone Number with PhoneInput */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <PhoneInput
                            country="eg"
                            value={phoneValue}
                            onChange={handlePhoneChange}
                            enableSearch={true}
                            searchPlaceholder="Search country"
                            disabled={loading}
                            disableCountryCode={false}
                             countryCodeEditable={false}
                            inputProps={{
                                name: "phone",
                                className: "!pl-16 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50",
                                placeholder: "Enter mobile number"
                            }}
                            containerClass="w-full"
                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            buttonClass="!border-r !bg-gray-50 !px-3 !border-gray-300"
                            dropdownClass="!bg-white !border !shadow-lg"
                            searchClass="!p-2 !border-b"
                        />
                        {(errors?.phone || error?.phone) && (
                            <p className="text-red-500 text-xs">{errors.phone || error.phone}</p>
                        )}
                    </div>

                    {/* Password Fields */}
                    {[
                        { label: 'Current Password', name: 'password', type: 'password' },
                        { label: 'New Password', name: 'new_password', type: 'password' },
                        { label: 'Confirm New Password', name: 'new_password_confirmation', type: 'password' }
                    ].map(field => (
                        <div key={field.name} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                            />
                            {error?.[field.name] && <p className="text-red-500 text-xs">{error[field.name]}</p>}
                        </div>
                    ))}

                    {/* Roles */}
                    <div className="relative" ref={roleDropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Roles <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                            disabled={loading}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-left flex items-center justify-between disabled:opacity-50 transition-all duration-200 ${
                                errors.role_id ? 'border-red-500' : 'border-gray-300'
                            } ${isRoleDropdownOpen ? 'ring-2 ring-purple-500 border-purple-500' : ''}`}
                        >
                            <span className={`${formData.role_id.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                {formData.role_id.length > 0 
                                    ? `${formData.role_id.length} role(s) selected`
                                    : 'Select roles...'}
                            </span>
                            <div className={`transform transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                        </button>

                        {/* Selected roles tags */}
                        {formData.role_id && formData.role_id.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {formData.role_id.map((roleId) => {
                                    const role = roles?.find(r => r.id === roleId);
                                    return role ? (
                                        <span 
                                            key={roleId}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200"
                                        >
                                            {role.name}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRoleChange(roleId);
                                                }}
                                                disabled={loading}
                                                className="ml-1 text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full p-0.5 transition-colors disabled:opacity-50"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Dropdown */}
                        {isRoleDropdownOpen && (
                            <div 
                                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden"
                                onScroll={handleDropdownScroll}
                            >
                                <div className="p-2 border-b border-gray-100">
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Select Roles</div>
                                </div>
                                {roles && roles.length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto" onScroll={handleDropdownScroll}>
                                        {roles.map(role => (
                                            <div 
                                                key={role.id} 
                                                className="flex items-center py-2 px-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                                                onClick={() => handleRoleChange(role.id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`role-${role.id}`}
                                                    checked={formData.role_id.includes(role.id)}
                                                    onChange={() => handleRoleChange(role.id)}
                                                    disabled={loading}
                                                    className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <label 
                                                    htmlFor={`role-${role.id}`}
                                                    className="text-sm text-gray-700 cursor-pointer capitalize flex-1 font-medium"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {role.name}
                                                </label>
                                                {formData.role_id.includes(role.id) && (
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full ml-2"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-sm text-gray-500 text-center">
                                        <div className="mb-2">📋</div>
                                        No roles available
                                    </div>
                                )}
                            </div>
                        )}
                        {errors.role_id && <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>}
                    </div>

                    {/* Permissions */}
                    <div className="relative" ref={permissionDropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Permissions
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsPermissionDropdownOpen(!isPermissionDropdownOpen)}
                            disabled={loading}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-left flex items-center justify-between disabled:opacity-50 transition-all duration-200 ${
                                errors.permissions ? 'border-red-500' : 'border-gray-300'
                            } ${isPermissionDropdownOpen ? 'ring-2 ring-purple-500 border-purple-500' : ''}`}
                        >
                            <span className={`${formData.permissions.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                {formData.permissions.length > 0 
                                    ? `${formData.permissions.length} permission(s) selected`
                                    : 'Select permissions...'}
                            </span>
                            <div className={`transform transition-transform duration-200 ${isPermissionDropdownOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                        </button>

                        {/* Selected permissions tags */}
                        {formData.permissions && formData.permissions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {formData.permissions.map((permissionId) => {
                                    const permission = permissions?.permissions?.find(p => p.id === permissionId);
                                    return permission ? (
                                        <span 
                                            key={permissionId}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200"
                                        >
                                            {permission.tag_description}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePermissionChange(permissionId);
                                                }}
                                                disabled={loading}
                                                className="ml-1 text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full p-0.5 transition-colors disabled:opacity-50"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Dropdown */}
                        {isPermissionDropdownOpen && (
                            <div 
                                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden"
                                onScroll={handleDropdownScroll}
                            >
                                <div className="p-2 border-b border-gray-100">
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Select Permissions</div>
                                </div>
                                {permissions?.permissions && permissions.permissions.length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto" onScroll={handleDropdownScroll}>
                                        {permissions.permissions.map(permission => (
                                            <div 
                                                key={permission.id} 
                                                className="flex items-center py-2 px-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                                                onClick={() => handlePermissionChange(permission.id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`permission-${permission.id}`}
                                                    checked={formData.permissions.includes(permission.id)}
                                                    onChange={() => handlePermissionChange(permission.id)}
                                                    disabled={loading}
                                                    className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <label 
                                                    htmlFor={`permission-${permission.id}`}
                                                    className="text-sm text-gray-700 cursor-pointer capitalize flex-1 font-medium"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {permission.tag_description}
                                                </label>
                                                {formData.permissions.includes(permission.id) && (
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full ml-2"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-sm text-gray-500 text-center">
                                        <div className="mb-2">🔐</div>
                                        No permissions available
                                    </div>
                                )}
                            </div>
                        )}
                        {errors.permissions && <p className="text-red-500 text-xs mt-1">{errors.permissions}</p>}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                        >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-3">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}