import { X, User, Mail, Phone, UserCheck, Upload, Camera, Clock, Lock, UserPlus, Send } from "lucide-react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { addStaff, inviteStaff, getStaff } from "../../../../redux/apiCalls/StaffCallApi";

// ============================================
// 1. Toggle Switch Component
// ============================================
const ToggleSwitch = ({ activeTab, onChange }) => {
  return (
    <div className="bg-gray-100 rounded-xl p-1.5 inline-flex mb-6">
      <button
        onClick={() => onChange('add')}
        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
          activeTab === 'add'
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <UserPlus className="w-4 h-4" />
        <span>Add Staff</span>
      </button>
      <button
        onClick={() => onChange('invite')}
        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
          activeTab === 'invite'
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Send className="w-4 h-4" />
        <span>Invite Staff</span>
      </button>
    </div>
  );
};

// ============================================
// 2. Invite Staff Form Component
// ============================================
const InviteStaffForm = ({ formData, errors, phoneValue, onInputChange, onPhoneChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Send className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Send Staff Invitation</h3>
        <p className="text-sm text-gray-600">
          Enter email and phone number to send an invitation to join your team
        </p>
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 mr-1 text-gray-500" />
          Email Address <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="email"
          placeholder="recruiter@company.com"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 ${
            errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-2 flex items-center">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 mr-1 text-gray-500" />
          Contact Number <span className="text-red-500 ml-1">*</span>
        </label>
        <PhoneInput
          country="eg"
          value={phoneValue}
          onChange={onPhoneChange}
          enableSearch={true}
          searchPlaceholder="Search country"
          inputProps={{
            name: "phone",
            required: true,
            className: "!pl-16 w-full p-3 border rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400",
            placeholder: "Enter mobile number",
          }}
          containerClass="w-full"
          inputClass="w-full p-3 border rounded-xl"
          buttonClass="!border-r !bg-gray-50 !px-3 !rounded-l-xl"
          dropdownClass="!bg-white !border !shadow-xl !rounded-xl"
          searchClass="!p-3 !border-b"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-2 flex items-center">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {errors.phone}
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================
// 3. Add Staff Form Component
// ============================================
const AddStaffForm = ({ 
  formData, 
  errors, 
  phoneValue, 
  imagePreview,
  dragActive,
  isStatusDropdownOpen,
  isOvertimeDropdownOpen,
  statusDropdownRef,
  overtimeDropdownRef,
  fileInputRef,
  onInputChange, 
  onPhoneChange,
  onImageChange,
  onFileInputChange,
  onDrag,
  onDrop,
  onRemoveImage,
  setIsStatusDropdownOpen,
  setIsOvertimeDropdownOpen
}) => {
  return (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center mb-6">
          <Camera className="w-5 h-5 mr-2 text-blue-600" />
          Profile Image
        </h3>
        
        <div className="flex flex-col items-center space-y-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className={`w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 ${
                dragActive ? "border-blue-500 bg-blue-100" : ""
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={onDrag}
              onDragLeave={onDrag}
              onDragOver={onDrag}
              onDrop={onDrop}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click or drag</p>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              {imagePreview ? "Change Image" : "Upload Image"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={onFileInputChange}
            className="hidden"
          />
          
          {errors.photo && (
            <p className="text-red-500 text-xs flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.photo}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Personal Information
          </h3>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-1 text-gray-500" />
              Full Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter recruiter member's full name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-1 text-gray-500" />
              Email Address <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              placeholder="recruiter@company.com"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 mr-1 text-gray-500" />
              Contact Number 
            </label>
            <PhoneInput
              country="eg"
              value={phoneValue}
              onChange={onPhoneChange}
              enableSearch={true}
              searchPlaceholder="Search country"
              inputProps={{
                name: "phone",
                required: true,
                className: "!pl-16 w-full p-3 border rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400",
                placeholder: "Enter mobile number",
              }}
              containerClass="w-full"
              inputClass="w-full p-3 border rounded-xl"
              buttonClass="!border-r !bg-gray-50 !px-3 !rounded-l-xl"
              dropdownClass="!bg-white !border !shadow-xl !rounded-xl"
              searchClass="!p-3 !border-b"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Security & Settings Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-blue-600" />
            Security & Settings
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
              onChange={(e) => onInputChange("password", e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.password}
              </p>
            )}
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
              onChange={(e) => onInputChange("password_confirmation", e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 ${
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
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 text-left flex items-center justify-between hover:border-blue-400"
            >
              <span className="text-gray-700 flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${formData.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {formData.status === 1 ? 'Active' : 'Inactive'}
              </span>
              <div className={`transform transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
                <div className="p-2">
                  <div
                    className="flex items-center py-3 px-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      onInputChange("status", 1);
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
                      onInputChange("status", 0);
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

          {/* Over Time Dropdown */}
          <div className="relative" ref={overtimeDropdownRef}>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 mr-1 text-gray-500" />
              Over Time
            </label>
            <button
              type="button"
              onClick={() => setIsOvertimeDropdownOpen(!isOvertimeDropdownOpen)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 text-left flex items-center justify-between hover:border-blue-400"
            >
              <span className="text-gray-700 flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${formData.over_time === 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {formData.over_time === 1 ? 'Active' : 'Inactive'}
              </span>
              <div className={`transform transition-transform duration-200 ${isOvertimeDropdownOpen ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isOvertimeDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
                <div className="p-2">
                  <div
                    className="flex items-center py-3 px-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      onInputChange("over_time", 1);
                      setIsOvertimeDropdownOpen(false);
                    }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 font-medium">Active</span>
                    {formData.over_time === 1 && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex items-center py-3 px-3 hover:bg-red-50 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      onInputChange("over_time", 0);
                      setIsOvertimeDropdownOpen(false);
                    }}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 font-medium">Inactive</span>
                    {formData.over_time === 0 && (
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
    </div>
  );
};

// ============================================
// 4. Main Modal Component
// ============================================
const StaffModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_code: "",
    phone: "",
    status: 1,
    over_time: 1,
    photo: null,
  });

  const [phoneValue, setPhoneValue] = useState("");
  const [errors, setErrors] = useState({});
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isOvertimeDropdownOpen, setIsOvertimeDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const statusDropdownRef = useRef(null);
  const overtimeDropdownRef = useRef(null);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.staff?.loading || false);

  if (!isOpen) return null;

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_code: "",
      phone: "",
      status: 1,
      over_time: 1,
      photo: null,
    });
    setPhoneValue("");
    setErrors({});
    setIsStatusDropdownOpen(false);
    setIsOvertimeDropdownOpen(false);
    setImagePreview(null);
  };

  const handleClose = () => {
    clearForm();
    setActiveTab('add');
    onClose();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearForm();
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

  const handleImageChange = (file) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: "Please select a valid image file (JPEG, PNG, GIF, WebP)",
        }));
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          photo: "Image size should be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      if (errors.photo) {
        setErrors((prev) => ({
          ...prev,
          photo: "",
        }));
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInviteStaff = async () => {
  try {
    const inviteData = {
      email: formData.email,
      phone_code: formData.phone_code,
      phone: formData.phone,
    };

    console.log("Sending invite data:", inviteData);
    
    const result = await dispatch(inviteStaff(inviteData));

    if (result.success) {
      clearForm();
      onClose();
    } else {
      if (result.error?.response?.data?.errors) {
        setErrors(result.error.response.data.errors);
      }
    }
  } catch (error) {
    console.error('Invite error:', error);
    if (error?.response?.data?.errors) {
      setErrors(error.response.data.errors);
    }
  }
};

  const handleAddStaff = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const result = await dispatch(addStaff(formDataToSend));
      
      if (result.success) {
        dispatch(getStaff()); 
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

  const handleSubmit = () => {
    if (activeTab === 'invite') {
      handleInviteStaff();
    } else {
      handleAddStaff();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col" ref={modalRef}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 text-white flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Staff Management</h2>
                <p className="text-blue-100 text-sm">
                  {activeTab === 'add' ? 'Add a new staff member to your team' : 'Send an invitation to join your team'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Toggle Switch */}
          <ToggleSwitch activeTab={activeTab} onChange={handleTabChange} />
        </div>

        {/* Form Content - Scrollable */}
        <div className="px-8 py-6 overflow-y-auto flex-1">
          {activeTab === 'invite' ? (
            <InviteStaffForm
              formData={formData}
              errors={errors}
              phoneValue={phoneValue}
              onInputChange={handleInputChange}
              onPhoneChange={handlePhoneChange}
            />
          ) : (
            <AddStaffForm
              formData={formData}
              errors={errors}
              phoneValue={phoneValue}
              imagePreview={imagePreview}
              dragActive={dragActive}
              isStatusDropdownOpen={isStatusDropdownOpen}
              isOvertimeDropdownOpen={isOvertimeDropdownOpen}
              statusDropdownRef={statusDropdownRef}
              overtimeDropdownRef={overtimeDropdownRef}
              fileInputRef={fileInputRef}
              onInputChange={handleInputChange}
              onPhoneChange={handlePhoneChange}
              onImageChange={handleImageChange}
              onFileInputChange={handleFileInputChange}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onRemoveImage={removeImage}
              setIsStatusDropdownOpen={setIsStatusDropdownOpen}
              setIsOvertimeDropdownOpen={setIsOvertimeDropdownOpen}
            />
          )}
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
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {activeTab === 'invite' ? 'Sending...' : 'Creating...'}
                </div>
              ) : (
                <div className="flex items-center">
                  {activeTab === 'invite' ? (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Add Staff
                    </>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;