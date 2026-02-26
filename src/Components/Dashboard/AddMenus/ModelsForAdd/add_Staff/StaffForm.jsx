import {
  X,
  User,
  Mail,
  Phone,
  UserCheck,
  Upload,
  Camera,
  Clock,
  Lock,
  UserPlus,
  Send,
  Edit,
} from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/* ==================== ToggleSwitch ==================== */
export const ToggleSwitch = ({ activeTab, onChange }) => (
  <div className="bg-gray-100 rounded-xl p-1.5 inline-flex mb-6">
    <button
      onClick={() => onChange("add")}
      className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
        activeTab === "add"
          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <UserPlus className="w-4 h-4" />
      <span>Add Recruiter</span>
    </button>
    <button
      onClick={() => onChange("invite")}
      className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
        activeTab === "invite"
          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <Send className="w-4 h-4" />
      <span>Invite Recruiter</span>
    </button>
  </div>
);

/* ==================== InviteStaffForm ==================== */
export const InviteStaffForm = ({
  formData,
  errors,
  phoneValue,
  onInputChange,
  onPhoneChange,
  setIsPhoneDropdownOpen,
}) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <Send className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Send Recruiter Invitation</h3>
      <p className="text-sm text-gray-600">
        Enter email and phone number to send an invitation to join your team
      </p>
    </div>

    {/* Email */}
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
        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all ${
          errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
      {errors.email && (
        <p className="text-red-500 text-xs mt-2 flex items-center">
          <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
          {errors.email}
        </p>
      )}
    </div>

    {/* Phone */}
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Phone className="w-4 h-4 mr-1 text-gray-500" />
        Contact Number
      </label>
      <PhoneInput
      country="eg"
        value={phoneValue}
        onChange={onPhoneChange}
        enableSearch
        searchPlaceholder="Search country"
        disableCountryCode={false}
        countryCodeEditable={false}
        inputProps={{
          name: "phone",
          required: true,
          className:
            "!pl-16 w-full p-3 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-300 focus:border-blue-400",
          placeholder: "Enter mobile number",
          onFocus: () => setIsPhoneDropdownOpen(true),
          onBlur: () => setTimeout(() => setIsPhoneDropdownOpen(false), 200),
        }}
        containerClass="!w-full"
        buttonClass="!border-r !bg-gray-50 !px-3 !rounded-l-xl !h-[50px]"
        dropdownClass="!bg-white !border !shadow-xl !rounded-xl !top-[50px] !left-0 !w-[17.5rem]"
      />
      {errors.phone && (
        <p className="text-red-500 text-xs mt-2 flex items-center">
          <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
          {errors.phone}
        </p>
      )}
    </div>
  </div>
);

/* ==================== AddStaffForm ==================== */
export const AddStaffForm = ({
  formData,
  errors,
  phoneValue,
  imagePreview,
  isStatusDropdownOpen,
  isOvertimeDropdownOpen,
  statusDropdownRef,
  overtimeDropdownRef,
  onInputChange,
  onPhoneChange,
  setIsStatusDropdownOpen,
  setIsOvertimeDropdownOpen,
  setIsPhoneDropdownOpen,
  setIsImageUploadOpen,
  removeImage,
}) => (
  <div className="space-y-6">
    {/* ---------- Profile Image ---------- */}
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
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
            />
            <div className="absolute -top-2 -right-2 flex gap-1">
              <button
                onClick={() => setIsImageUploadOpen(true)}
                className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={removeImage}
                className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsImageUploadOpen(true)}
            className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload</p>
            </div>
          </button>
        )}

        <button
          onClick={() => setIsImageUploadOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
        >
          {imagePreview ? "Change Image" : "Upload Image"}
        </button>

        {errors.photo && (
          <p className="text-red-500 text-xs flex items-center">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
            {errors.photo}
          </p>
        )}
      </div>
    </div>

    {/* ---------- Form Grid ---------- */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ==== Personal Info ==== */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Information
        </h3>

        {/* Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 mr-1 text-gray-500" />
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter recruiter member's full name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all ${
              errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-2 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
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
            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all ${
              errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-2 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 mr-1 text-gray-500" />
            Contact Number
          </label>
          <PhoneInput
            country="eg"
            value={phoneValue}
            onChange={onPhoneChange}
            enableSearch
            searchPlaceholder="Search country"
            disableCountryCode={false}
           countryCodeEditable={false}
            inputProps={{
              name: "phone",
              required: true,
              className:
                "!pl-16 w-full p-3 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-300 focus:border-blue-400",
              placeholder: "Enter mobile number",
              onFocus: () => setIsPhoneDropdownOpen(true),
              onBlur: () => setTimeout(() => setIsPhoneDropdownOpen(false), 200),
            }}
            containerClass="!w-full"
            buttonClass="!border-r !bg-gray-50 !px-3 !rounded-l-xl !h-[50px]"
            dropdownClass="!bg-white !border !shadow-xl !rounded-xl !top-[50px] !left-0 !w-[17.5rem]"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-2 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* ==== Security & Settings ==== */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-blue-600" />
          Security & Settings
        </h3>

        {/* Password */}
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
            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all ${
              errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-2 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
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
            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all ${
              errors.password_confirmation ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-xs mt-2 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
              {errors.password_confirmation}
            </p>
          )}
        </div>

        {/* Account Status */}
        <div className="relative" ref={statusDropdownRef}>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <UserCheck className="w-4 h-4 mr-1 text-gray-500" />
            Account Status
          </label>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-left flex items-center justify-between hover:border-blue-400"
          >
            <span className="text-gray-700 flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${formData.status === 1 ? "bg-green-500" : "bg-red-500"}`}
              />
              {formData.status === 1 ? "Active" : "Inactive"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
              <div className="p-2">
                <div
                  className="flex items-center py-3 px-3 hover:bg-green-50 rounded-lg cursor-pointer"
                  onClick={() => {
                    onInputChange("status", 1);
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <span className="text-sm text-gray-700 font-medium">Active</span>
                </div>
                <div
                  className="flex items-center py-3 px-3 hover:bg-red-50 rounded-lg cursor-pointer"
                  onClick={() => {
                    onInputChange("status", 0);
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                  <span className="text-sm text-gray-700 font-medium">Inactive</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Over Time */}
        <div className="relative" ref={overtimeDropdownRef}>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            Over Time
          </label>
          <button
            type="button"
            onClick={() => setIsOvertimeDropdownOpen(!isOvertimeDropdownOpen)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all text-left flex items-center justify-between hover:border-blue-400"
          >
            <span className="text-gray-700 flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${formData.over_time === 1 ? "bg-green-500" : "bg-red-500"}`}
              />
              {formData.over_time === 1 ? "Active" : "Inactive"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isOvertimeDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOvertimeDropdownOpen && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
              <div className="p-2">
                <div
                  className="flex items-center py-3 px-3 hover:bg-green-50 rounded-lg cursor-pointer"
                  onClick={() => {
                    onInputChange("over_time", 1);
                    setIsOvertimeDropdownOpen(false);
                  }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <span className="text-sm text-gray-700 font-medium">Active</span>
                </div>
                <div
                  className="flex items-center py-3 px-3 hover:bg-red-50 rounded-lg cursor-pointer"
                  onClick={() => {
                    onInputChange("over_time", 0);
                    setIsOvertimeDropdownOpen(false);
                  }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                  <span className="text-sm text-gray-700 font-medium">Inactive</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);