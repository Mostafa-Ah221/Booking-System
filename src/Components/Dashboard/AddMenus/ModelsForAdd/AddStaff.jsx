import { X, User, Mail, Lock, Phone, UserCheck, Upload, Camera } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { addStaff, getStaff } from "../../../../redux/apiCalls/StaffCallApi";

const AddStaff = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_code: "",
    phone: "",
    status: 1,
    photo: null, // تغيير من image إلى photo
  });

  const [phoneValue, setPhoneValue] = useState("");
  const [errors, setErrors] = useState({});
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Refs for dropdown containers and modal
  const statusDropdownRef = useRef(null);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.staff?.loading || false);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && modalRef.current.contains(event.target)) {
        return;
      }

      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    };

    if (isStatusDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

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
      photo: null, // تغيير من image إلى photo
    });
    setPhoneValue("");
    setErrors({});
    setIsStatusDropdownOpen(false);
    setImagePreview(null);
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

  const handleImageChange = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: "Please select a valid image file (JPEG, PNG, GIF, WebP)", // تغيير من image إلى photo
        }));
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          photo: "Image size should be less than 5MB", // تغيير من image إلى photo
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        photo: file, // تغيير من image إلى photo
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any existing error
      if (errors.photo) { // تغيير من image إلى photo
        setErrors((prev) => ({
          ...prev,
          photo: "", // تغيير من image إلى photo
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
      photo: null, // تغيير من image إلى photo
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddStaff = async () => {
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // إضافة البيانات للـ FormData مع التحقق
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // طباعة البيانات للتتبع
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      console.log("Original form data:", formData);

      // Call API
      const result = await dispatch(addStaff(formDataToSend));
      
      // Handle response
      if (result.success) {
        dispatch(getStaff()); // تحديث قائمة الموظفين
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
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 text-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Staff Member</h2>
                <p className="text-blue-100 text-sm">Add a new staff member to your team</p>
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
          {/* Profile Image Section */}
          <div className="mb-8">
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
                    onClick={removeImage}
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
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
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
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {errors.photo && ( // تغيير من image إلى photo
                <p className="text-red-500 text-xs flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.photo} {/* تغيير من image إلى photo */}
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
                  placeholder="Enter staff member's full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 ${
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
                  placeholder="staff@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 ${
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
                    className: "!pl-16 w-full p-3 border rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400",
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
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 ${
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
              onClick={handleAddStaff}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
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
                  Add Staff
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;