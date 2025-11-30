import { X, UserCheck, Send, Edit, Upload, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { addStaff, inviteStaff, getStaff } from "../../../../../redux/apiCalls/StaffCallApi";
import { ToggleSwitch, InviteStaffForm, AddStaffForm } from "./StaffForm";
import ImageUploadCrop from "../../../InterviewsPages/InterViewPage/ImageUploadCrop";

const StaffModal = ({ isOpen, onClose }) => {
  /* ======================  STATE  ====================== */
  const [activeTab, setActiveTab] = useState("add");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    code_phone: "",
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
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false); // جديد

  /* ======================  REF  ====================== */
  const statusDropdownRef = useRef(null);
  const overtimeDropdownRef = useRef(null);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.staff?.loading || false);

  /* ======================  HELPERS  ====================== */
  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      code_phone: "",
      phone: "",
      status: 1,
      over_time: 1,
      photo: null,
    });
    setPhoneValue("");
    setImagePreview(null);
    setErrors({});
    setIsStatusDropdownOpen(false);
    setIsOvertimeDropdownOpen(false);
    setIsPhoneDropdownOpen(false);
    setIsImageUploadOpen(false);
  };

  const handleClose = () => {
    clearForm();
    setActiveTab("add");
    onClose();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearForm();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);
    setFormData((prev) => ({
      ...prev,
      phone: value.replace(`+${country.dialCode}`, ""),
      code_phone: `+${country.dialCode}`,
    }));

    if (!value || value.length <= country.dialCode.length + 1) {
      setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number" }));
      return;
    }
    const phoneNumber = parsePhoneNumberFromString(value, country.countryCode?.toUpperCase());
    if (!phoneNumber || !phoneNumber.isValid()) {
      setErrors((prev) => ({ ...prev, phone: "The phone number is invalid for this country" }));
    } else {
      if (errors?.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleImageUpdate = (imageFile) => {
    setFormData((prev) => ({ ...prev, photo: imageFile }));
    setImagePreview(URL.createObjectURL(imageFile));
    setIsImageUploadOpen(false);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setImagePreview(null);
  };

  /* ======================  API CALLS  ====================== */
  const handleInviteStaff = async () => {
    try {
      const inviteData = {
        email: formData.email,
        code_phone: formData.code_phone,
        phone: formData.phone,
      };
      const result = await dispatch(inviteStaff(inviteData));
      if (result.success) {
        clearForm();
        onClose();
      } else if (result.error?.response?.data?.errors) {
        setErrors(result.error.response.data.errors);
      }
    } catch (e) {
      if (e?.response?.data?.errors) setErrors(e.response.data.errors);
    }
  };

  const handleAddStaff = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });
      const result = await dispatch(addStaff(formDataToSend));
      if (result.success) {
        dispatch(getStaff());
        clearForm();
        onClose();
      } else if (result.error?.response?.data?.errors) {
        setErrors(result.error.response.data.errors);
      }
    } catch (e) {
      if (e?.response?.data?.errors) setErrors(e.response.data.errors);
    }
  };

  const handleSubmit = () => (activeTab === "invite" ? handleInviteStaff() : handleAddStaff());

  /* ======================  OUTSIDE CLICK  ====================== */
useEffect(() => {
  const handler = (e) => {
    // لو الضغطة خارج المودال الأب وخارج مودال الصورة → اقفل
    const imageModal = document.querySelector('#image-upload-crop-modal');
    if (
      modalRef.current && 
      !modalRef.current.contains(e.target) && 
      (!imageModal || !imageModal.contains(e.target))
    ) {
      handleClose();
    }
  };

  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

  if (!isOpen) return null;

  return (
    <>
      {/* ==== MODAL ==== */}
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
                  <h2 className="text-2xl font-bold">Recruiter Management</h2>
                  <p className="text-blue-100 text-sm">
                    {activeTab === "add"
                      ? "Add a new recruiter member to your team"
                      : "Send an invitation to join your team"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <ToggleSwitch activeTab={activeTab} onChange={handleTabChange} />
          </div>

          {/* Body */}
          <div className="px-8 py-6 overflow-y-auto flex-1" ref={contentRef}>
            {activeTab === "invite" ? (
              <InviteStaffForm
                formData={formData}
                errors={errors}
                phoneValue={phoneValue}
                onInputChange={handleInputChange}
                onPhoneChange={handlePhoneChange}
                setIsPhoneDropdownOpen={setIsPhoneDropdownOpen}
              />
            ) : (
              <AddStaffForm
                formData={formData}
                errors={errors}
                phoneValue={phoneValue}
                imagePreview={imagePreview}
                isStatusDropdownOpen={isStatusDropdownOpen}
                isOvertimeDropdownOpen={isOvertimeDropdownOpen}
                statusDropdownRef={statusDropdownRef}
                overtimeDropdownRef={overtimeDropdownRef}
                onInputChange={handleInputChange}
                onPhoneChange={handlePhoneChange}
                setIsStatusDropdownOpen={setIsStatusDropdownOpen}
                setIsOvertimeDropdownOpen={setIsOvertimeDropdownOpen}
                setIsPhoneDropdownOpen={setIsPhoneDropdownOpen}
                setIsImageUploadOpen={setIsImageUploadOpen}
                removeImage={removeImage}
              />
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex-shrink-0">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {activeTab === "invite" ? "Sending…" : "Creating…"}
                  </>
                ) : (
                  <>
                    {activeTab === "invite" ? <Send className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                    {activeTab === "invite" ? "Send Invitation" : "Add Recruiter"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==== IMAGE CROP MODAL ==== */}
      <ImageUploadCrop
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onImageUpdate={handleImageUpdate}
        currentImage={imagePreview}
      />
    </>
  );
};

export default StaffModal;