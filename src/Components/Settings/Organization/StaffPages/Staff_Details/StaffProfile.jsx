import React, { useState, useRef } from 'react';
import { Edit, User, Save, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStaff } from '../../../../../redux/apiCalls/StaffCallApi';
import { useParams } from 'react-router-dom';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { IoIosCamera } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { usePermission } from '../../../../hooks/usePermission';
import ImageUploadCrop from '../../../../Dashboard/InterviewsPages/InterViewPage/ImageUploadCrop';

export default function StaffProfile({ staff: staffResponse }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.staff);
  const { id } = useParams();
  const canEditStaff = usePermission("edit staff");
  
  // Extract actual staff data from response
  const staff = staffResponse?.staff || staffResponse;

  const [isEditing, setIsEditing] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [displayImage, setDisplayImage] = useState(staff?.photo || null);
  const [phoneError, setPhoneError] = useState("");

  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    code_phone: staff?.code_phone || '+20',
    phone: staff?.phone || '',
    status: staff?.status || 1,
    over_time: staff?.over_time !== undefined ? staff?.over_time : 1,
    photo: null,
    password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [errors, setErrors] = useState({});

  // Function to get phone value for PhoneInput
  const getPhoneValue = () => {
    if (formData.code_phone && formData.phone) {
      return formData.code_phone.replace('+', '') + formData.phone;
    }
    return '';
  };

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

  const handlePhoneChange = (value, country) => {
    const dialCode = country.dialCode;
    const phoneOnly = value.substring(dialCode.length);

    setFormData(prev => ({
      ...prev,
      phone: phoneOnly,
      code_phone: `+${dialCode}`,
    }));

    // Validate phone number
    if (!phoneOnly || phoneOnly.trim().length === 0) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    const fullNumber = `+${value}`;
    const phoneNumber = parsePhoneNumberFromString(fullNumber, country.countryCode?.toUpperCase());
    
    if (!phoneNumber || !phoneNumber.isValid()) {
      setPhoneError("The phone number is invalid for this country");
    } else {
      setPhoneError("");
    }
  };

  const handleImageUpdate = (imageFile) => {
    setFormData(prev => ({
      ...prev,
      photo: imageFile
    }));
    setDisplayImage(URL.createObjectURL(imageFile));
    setIsImageUploadOpen(false);
  };

  const handleImageClick = () => {
    if (isEditing) {
      setIsImageUploadOpen(true);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      name: staff?.name || '',
      email: staff?.email || '',
      code_phone: staff?.code_phone || '+20',
      phone: staff?.phone || '',
      status: staff?.status || 1,
      over_time: staff?.over_time !== undefined ? staff?.over_time : 1,
      photo: null,
      password: '',
      new_password: '',
      new_password_confirmation: ''
    });
    setDisplayImage(staff?.photo || null);
    setPhoneError("");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setErrors({});
    setPhoneError("");
    // Reset to original values
    setFormData({
      name: staff?.name || '',
      email: staff?.email || '',
      code_phone: staff?.code_phone || '+20',
      phone: staff?.phone || '',
      status: staff?.status || 1,
      over_time: staff?.over_time !== undefined ? staff?.over_time : 1,
      photo: null,
      password: '',
      new_password: '',
      new_password_confirmation: ''
    });
    setDisplayImage(staff?.photo || null);
  };

  const handleSaveClick = async () => {
    setErrors({});

    // Validate phone
    if (phoneError) {
      return;
    }

    // Validate new password confirmation
    if (formData.new_password && formData.new_password !== formData.new_password_confirmation) {
      setErrors({ new_password_confirmation: 'Passwords do not match' });
      return;
    }

    // Create FormData for file upload
    const submissionData = new FormData();
    
    // Add all non-empty fields to FormData
    if (formData.name) submissionData.append('name', formData.name);
    if (formData.email) submissionData.append('email', formData.email);
    if (formData.code_phone) submissionData.append('code_phone', formData.code_phone);
    if (formData.phone) submissionData.append('phone', formData.phone);
    submissionData.append('status', formData.status);
    submissionData.append('over_time', formData.over_time);
    
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

  const renderProfileImage = () => {
    if (loading && !displayImage) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (displayImage) {
      return (
        <>
          <img 
            className='w-full h-full rounded-full object-cover' 
            src={displayImage} 
            alt="Profile"
            onError={(e) => {
              setDisplayImage(null);
            }}
          />
          {isEditing && (
            <span className='w-full h-full absolute top-0 left-0 flex justify-center items-center group'>
              <span className='group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800 rounded-full'></span>
              <IoIosCamera className='absolute text-white text-2xl opacity-0 group-hover:opacity-100'/>
            </span>
          )}
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        {isEditing ? (
          <>
            <IoIosCamera className="text-3xl mb-1 text-blue-600" />
            <div className="text-xs text-center text-blue-600 font-medium">Add Photo</div>
          </>
        ) : (
          <User className="w-8 h-8 text-gray-400" />
        )}
      </div>
    );
  };

  // If no staff data after extraction
  if (!staff) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-gray-500 text-center">No recruiter data available</p>
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
              className={`relative w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden ${
                isEditing ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              onClick={handleImageClick}
            >
              {renderProfileImage()}
            </div>

            {/* Name, Email, Role */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-semibold text-gray-900 truncate block max-w-[150px]">{staff?.name}</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {staff?.role || 'Recruiter'}
                </span>
              </div>
              <p className="text-gray-600">{staff?.email}</p>
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          {!isEditing ? (
            canEditStaff && (<button
              onClick={handleEditClick}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>) 
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
              <p className="text-gray-900 font-medium truncate block max-w-[150px]">{staff?.name || '-'}</p>
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

          {/* Phone Number with PhoneInput */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Phone Number</label>
            {isEditing ? (
              <div>
                <PhoneInput
                  country="eg"
                  value={getPhoneValue()}
                  onChange={handlePhoneChange}
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  inputProps={{
                    name: "phone",
                    className: "!pl-16 w-full py-2 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    placeholder: "Enter phone number"
                  }}
                  containerClass="w-full"
                  buttonClass="!border-r !bg-gray-50 !px-3 !py-2 !rounded-l-lg !border-gray-300"
                  dropdownClass="!bg-white !border !shadow-lg !rounded-lg !mt-1"
                  searchClass="!p-3 !border-b !border-gray-200"
                />
                {(phoneError || getErrorMessage('phone')) && (
                  <p className="text-red-500 text-sm mt-1">
                    {phoneError || getErrorMessage('phone')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-900 font-medium">
                {staff?.phone ? `${staff?.code_phone}${staff?.phone}` : '-'}
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

          {/* Over Time */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Over Time</label>
            {isEditing ? (
              <select
                name="over_time"
                value={formData.over_time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            ) : (
              <p className="text-gray-900 font-medium">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  staff?.over_time == 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {staff?.over_time == 1 ? 'Active' : 'Inactive'}
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
                  autoComplete="new-password"
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

      {/* ImageUploadCrop Component */}
      <ImageUploadCrop
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onImageUpdate={handleImageUpdate}
        currentImage={displayImage}
      />
    </div>
  );
}