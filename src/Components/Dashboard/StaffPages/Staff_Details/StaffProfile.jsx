import React, { useState, useRef } from 'react';
import { Edit, User, Save, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStaff } from '../../../../redux/apiCalls/StaffCallApi';
import { useParams } from 'react-router-dom';

export default function StaffProfile({ staff: staffResponse }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.staff);
  const { id } = useParams();
  
  // Extract actual staff data from response
  const staff = staffResponse?.staff || staffResponse;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    phone_code: staff?.phone_code || '+20',
    phone: staff?.phone || '',
    status: staff?.status || 1,
    photo: staff?.photo || null,
    password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type - same as AddStaff
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          photo: "Please select a valid image file (JPEG, PNG, GIF, WebP)",
        }));
        return;
      }

      // Validate file size (max 5MB) - same as AddStaff
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          photo: "Image size should be less than 5MB",
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        photo: file // Store the file object
      }));
      
      // Clear error
      setErrors(prev => ({
        ...prev,
        photo: ''
      }));
      
      console.log('Selected file:', file.name, file);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      name: staff?.name || '',
      email: staff?.email || '',
      phone_code: staff?.phone_code || '+20',
      phone: staff?.phone || '',
      status: staff?.status || 1,
      photo: staff?.photo || null,
      password: '',
      new_password: '',
      new_password_confirmation: ''
    });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setErrors({});
    // Reset photo to original
    setFormData(prev => ({
      ...prev,
      photo: staff?.photo || null
    }));
  };

  const handleSaveClick = async () => {
    setErrors({});

    // Validate new password confirmation
    if (formData.new_password && formData.new_password !== formData.new_password_confirmation) {
      setErrors({ new_password_confirmation: 'كلمات المرور غير متطابقة' });
      return;
    }

    // Create FormData for file upload - same as AddStaff approach
    const submissionData = new FormData();
    
    // Add all non-empty fields to FormData
    if (formData.name) submissionData.append('name', formData.name);
    if (formData.email) submissionData.append('email', formData.email);
    if (formData.phone_code) submissionData.append('phone_code', formData.phone_code);
    if (formData.phone) submissionData.append('phone', formData.phone);
    submissionData.append('status', formData.status);
    
    // Handle photo upload - only if it's a new File object
    if (formData.photo instanceof File) {
      submissionData.append('photo', formData.photo);
    }
    
    if (formData.password) submissionData.append('password', formData.password);
    if (formData.new_password) {
      submissionData.append('new_password', formData.new_password);
      submissionData.append('new_password_confirmation', formData.new_password_confirmation);
    }

    // Debug: Print FormData contents
    console.log("FormData contents:");
    for (let [key, value] of submissionData.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log("Original form data:", formData);

    const result = await dispatch(updateStaff(id, submissionData));

    if (result.success) {
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        password: '',
        new_password: '',
        new_password_confirmation: ''
      }));
    } else {
      if (result.errors) {
        setErrors(result.errors);
      }
    }
  };

  const getErrorMessage = (field) => {
    return errors[field] || '';
  };

  // If no staff data after extraction
  if (!staff) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-gray-500 text-center">No staff data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staff Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className={`w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center ${
                isEditing ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              onClick={handleAvatarClick}
            >
              {formData.photo && (typeof formData.photo === 'string' || formData.photo instanceof File) ? (
                <img
                  src={formData.photo instanceof File ? URL.createObjectURL(formData.photo) : formData.photo}
                  alt={staff.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
            </div>

            {/* Name, Email, Role */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-semibold text-gray-900">{staff?.name}</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {staff?.role || 'Staff'}
                </span>
              </div>
              <p className="text-gray-600">{staff?.email}</p>
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveClick}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelClick}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
        {getErrorMessage('photo') && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage('photo')}</p>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Name</label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getErrorMessage('name') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {getErrorMessage('name') && (
                  <p className="text-red-500 text-sm mt-1">{getErrorMessage('name')}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 font-medium">{staff?.name || '-'}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
            {isEditing ? (
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getErrorMessage('email') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {getErrorMessage('email') && (
                  <p className="text-red-500 text-sm mt-1">{getErrorMessage('email')}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 font-medium">{staff?.email || '-'}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Phone Number</label>
            {isEditing ? (
              <div>
                <div className="flex">
                  <select
                    name="phone_code"
                    value={formData.phone_code}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  >
                    <option value="+20">+20</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+966">+966</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getErrorMessage('phone') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {getErrorMessage('phone') && (
                  <p className="text-red-500 text-sm mt-1">{getErrorMessage('phone')}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 font-medium">
                {staff?.phone_code || '+20'} {staff?.phone || staff?.phoneNumber || '-'}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Status</label>
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            ) : (
              <p className="text-gray-900 font-medium">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  staff?.status == 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {staff?.status == 1 ? 'Active' : 'Inactive'}
                </span>
              </p>
            )}
          </div>

          {/* Password Fields - Only show when editing */}
          {isEditing && (
            <>
              {/* Current Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Current Password <span className="text-xs text-gray-400">(Required only when changing password)</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getErrorMessage('password') ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {getErrorMessage('password') && (
                  <p className="text-red-500 text-sm mt-1">{getErrorMessage('password')}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getErrorMessage('new_password') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {getErrorMessage('new_password') && (
                  <p className="text-red-500 text-sm mt-1">{getErrorMessage('new_password')}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="new_password_confirmation"
                  value={formData.new_password_confirmation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getErrorMessage('new_password_confirmation') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {getErrorMessage('new_password_confirmation') && (
                  <p className="text-red-500 text-sm mt-1">{getErrorMessage('new_password_confirmation')}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}