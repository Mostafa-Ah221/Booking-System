import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewById, updateInterview, updateInterviewType } from '../../../../redux/apiCalls/interviewCallApi';
import { getWorkspace } from '../../../../redux/apiCalls/workspaceCallApi';
import { IoIosCamera } from "react-icons/io";
import { ChevronDown } from 'lucide-react';
import ImageUploadCrop from './ImageUploadCrop';
import { usePermission } from "../../../hooks/usePermission";
import toast from "react-hot-toast";
import Select from "react-select";
import currencies from "world-currencies";

const InterviewDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    workspace_id: "",
    duration_cycle: "",
    duration_period: "minutes",
    rest_cycle: "",
    status: "",
    price: "",
    currency: "",
    payment_details: "",
    mode: "",
    offline_mode: "",
    location: "",
    double_book: "0",
    approve_appointment: "0",
    max_clients: "",
    meeting_link: "",
    photo: null
  });

  const currencyOptions = Object.keys(currencies).map(code => ({
    value: code,
    label: `${currencies[code].name} (${currencies[code].symbol || code})`
  }));

  const typeOptions = [
    { value: "one-to-one", label: "One-to-One" },
    { value: "group-booking", label: "Group Booking" }
  ];

  const { id } = useOutletContext();
  const dispatch = useDispatch();
  const { interview, loading } = useSelector(state => state.interview);
  const { workspaces } = useSelector(state => state.workspace);



  useEffect(() => {
    if (id) {
      dispatch(getWorkspace());
      dispatch(editInterviewById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (interview) {
      setFormData({
        name: interview.name || "",
        type: interview.type || "",
        workspace_id: interview.workspace_id || "",
        duration_cycle: interview.duration_cycle || "",
        duration_period: interview.duration_period || "minutes",
        rest_cycle: interview.rest_cycle || "",
        status: interview.status_of_pay || "",
        price: interview.price || "",
        currency: interview.currency || "",
        payment_details: interview.payment_details || "",
        mode: interview.mode || "",
        offline_mode: interview.offline_mode || "",
        location: interview.location || "",
        double_book: interview.double_book || 0,
        approve_appointment: interview.approve_appointment || 0,
        max_clients: interview.max_clients || "",
        meeting_link: interview.meeting_link || "",
        photo: interview.photo || null
      });
      setTempImage(null);
    }
  }, [interview]);

  const canEdit = usePermission("edit interview");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    let newValue = value;
    if (name === "photo" && files[0]) {
      setTempImage(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        // Reset offline_mode, location, and meeting_link when mode changes
        ...(name === "mode" && newValue === "online" ? { offline_mode: "", location: "" } : {}),
        ...(name === "mode" && newValue === "offline" ? { meeting_link: "" } : {}),
        // Reset location when offline_mode changes from inhome
        ...(name === "offline_mode" && newValue !== "inhome" ? { location: "" } : {})
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (name, value) => {
  setFormData(prev => ({
    ...prev,
    [name]: value,
    ...(name === "type" && value === "one-to-one" ? { max_clients: "" } : {})
  }));

  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  }

  if (name === "type" && id) {
    dispatch(updateInterviewType(id, value));
  }
};


  const handleImageUpdate = (imageFile) => {
    setTempImage(imageFile);
    setIsImageUploadOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Interview name is required";
    if (!formData.workspace_id) newErrors.workspace_id = "Work space is required";
    if (!formData.mode) newErrors.mode = "Mode is required";
    if (!formData.duration_cycle) newErrors.duration_cycle = "Duration is required";
    if (!formData.type) newErrors.type = "Type is required";

    if (formData.status === "paid") {
      if (!formData.price) newErrors.price = "Price is required for paid interviews";
      if (!formData.currency) newErrors.currency = "Currency is required for paid interviews";
      if (!formData.payment_details) newErrors.payment_details = "Payment details are required for paid interviews";
    }

    if (formData.mode === "offline") {
      if (!formData.offline_mode) newErrors.offline_mode = "Offline mode is required";
      if (formData.offline_mode === "inhome" && !formData.location) {
        newErrors.location = "Location is required for in-home interviews";
      }
    }

    // if (formData.mode === "online" && !formData.meeting_link) {
    //   newErrors.meeting_link = "Meeting link is required for online interviews";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handelUpdateInterview = async () => {
    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      name: formData.name,
      type: formData.type,
      work_space_id: formData.workspace_id,
      duration_cycle: parseInt(formData.duration_cycle),
      duration_period: formData.duration_period,
      rest_cycle: formData.rest_cycle ? parseInt(formData.rest_cycle) : null,
      status: formData.status,
      mode: formData.mode,
      double_book: parseInt(formData.double_book),
      approve_appointment: parseInt(formData.approve_appointment),
    };

    if (formData.max_clients && formData.max_clients !== "") {
    dataToSend.max_clients = parseInt(formData.max_clients);
  }
    // Only include meeting_link if mode is online
    if (formData.mode === "online") {
      dataToSend.meeting_link = formData.meeting_link;
    }

    // Only include offline_mode and location if mode is offline
    if (formData.mode === "offline") {
      dataToSend.offline_mode = formData.offline_mode;
      // Send location only for inhome
      if (formData.offline_mode === "inhome" && formData.location) {
        dataToSend.location = formData.location;
      }
    }

    if (formData.status === "paid") {
      dataToSend.price = parseFloat(formData.price);
      dataToSend.currency = formData.currency;
      dataToSend.payment_details = formData.payment_details;
    } else {
      dataToSend.price = "0.00";
    }

    if (tempImage) {
      dataToSend.photo = tempImage;
    }

    try {
      console.log(dataToSend);
      
      const result = await dispatch(updateInterview(id, dataToSend));

      if (result?.success) {
        toast.success(result.message);
        handleCancelClick();
        dispatch(editInterviewById(id));
      } else if (result) {
        toast.error(result.message);
      }
    } catch (error) {
      if (error?.response?.data?.errors) {
        toast.error("error: " + JSON.stringify(error.response.data.errors));
      } else {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTempImage(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempImage(null);
    setErrors({});
  };

  const handleImageClick = () => {
    if (isEditing) {
      setIsImageUploadOpen(true);
    }
  };

  const getDisplayImage = () => {
    if (tempImage) {
      return URL.createObjectURL(tempImage);
    }
    return interview?.photo;
  };

  const displayImage = getDisplayImage();

  if (isEditing) {
    return (
      <div className="w-full bg-white px-6 rounded-lg mx-5 text-sm">
        <div className="flex items-start gap-4 mb-8 pb-4 border-b">
          <div
            className="bg-purple-300 w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer hover:bg-purple-400 duration-200 relative overflow-hidden"
            onClick={handleImageClick}
          >
            {displayImage ? (
              <>
                <img className="w-full h-full rounded object-cover" src={displayImage} alt="Event" />
                <span className="w-full h-full absolute top-0 left-0 flex justify-center items-center group">
                  <span className="group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800"></span>
                  <IoIosCamera className="absolute text-white text-2xl opacity-0 group-hover:opacity-100"/>
                </span>
              </>
            ) : (
              <IoIosCamera className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium">Edit Interview Details</h2>
            <p className="text-gray-600">{formData.type}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-l-2 border-purple-600 pl-4">
            <h3 className="text-sm font-medium text-gray-900">INTERVIEW DETAILS</h3>
          </div>

          <div className="flex gap-4 items-center">
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Interview Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Work Space <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <select
                  name="workspace_id"
                  value={formData.workspace_id}
                  onChange={handleInputChange}
                  className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.workspace_id ? 'border-red-500' : ''} ${!formData.workspace_id ? 'text-gray-400' : 'text-black'}`}
                >
                  <option value="" disabled>Select Work Space</option>
                  {workspaces?.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.workspace_id && <p className="text-red-500 text-sm mt-1">{errors.workspace_id}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type <span className="text-red-500">*</span>
            </label>
            <Select
              name="type"
              options={typeOptions}
              value={typeOptions.find(opt => opt.value === formData.type) || null}
              onChange={(selected) => handleSelectChange("type", selected?.value || "")}
              classNamePrefix="react-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  width: "100%",
                  borderRadius: "0.5rem",
                  border: state.isFocused ? "0px solid #9333ea" : "1px solid #d1d5db",
                  padding: "2px 8px",
                  boxShadow: state.isFocused ? "0 0 0 2px rgba(147, 51, 234, 0.5)" : "none",
                  backgroundColor: "white",
                  minHeight: "40px",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  padding: 0,
                }),
                input: (provided) => ({
                  ...provided,
                  margin: 0,
                  padding: 0,
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#111827",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#9ca3af",
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  color: "#6b7280",
                  "&:hover": { color: "#9333ea" },
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#9333ea"
                    : state.isFocused
                    ? "#f3e8ff"
                    : "white",
                  color: state.isSelected ? "white" : "#111827",
                  padding: "8px 12px",
                  cursor: "pointer",
                }),
                menu: (provided) => ({
                  ...provided,
                  borderRadius: "0.5rem",
                  marginTop: "4px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }),
              }}
            />
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Duration (Minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration_cycle"
                value={formData.duration_cycle}
                onChange={handleInputChange}
                placeholder="Enter duration"
                min="0"
                className={`w-full outline-none border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.duration_cycle ? 'border-red-500' : ''}`}
              />
              {errors.duration_cycle && <p className="text-red-500 text-sm mt-1">{errors.duration_cycle}</p>}
            </div>

            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">Rest Cycle (Minutes)</label>
              <input
                type="number"
                name="rest_cycle"
                value={formData.rest_cycle}
                onChange={handleInputChange}
                placeholder="Enter rest time between interviews"
                min="0"
                className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="relative w-full">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {formData.status === "paid" && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Select
                      className="rounded-lg"
                      options={currencyOptions}
                      isSearchable
                      value={currencyOptions.find(opt => opt.value === formData.currency) || null}
                      onChange={(selected) =>
                        handleInputChange({
                          target: { name: "currency", value: selected?.value || "" },
                        })
                      }
                      placeholder="Select Currency"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          width: "100%",
                          borderRadius: "0.5rem",
                          border: state.isFocused ? "0px solid #9333ea" : "1px solid #d1d5db",
                          padding: "2px 8px",
                          boxShadow: state.isFocused ? "0 0 0 2px rgba(147, 51, 234, 0.5)" : "none",
                          backgroundColor: "white",
                          minHeight: "40px",
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          padding: 0,
                        }),
                        input: (provided) => ({
                          ...provided,
                          margin: 0,
                          padding: 0,
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "#111827",
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: "#9ca3af",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          color: "#6b7280",
                          "&:hover": { color: "#9333ea" },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? "#9333ea"
                            : state.isFocused
                            ? "#f3e8ff"
                            : "white",
                          color: state.isSelected ? "white" : "#111827",
                          padding: "8px 12px",
                          cursor: "pointer",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          borderRadius: "0.5rem",
                          marginTop: "4px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }),
                      }}
                    />
                    {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter Price"
                      className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.price ? 'border-red-500' : ''}`}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="payment_details"
                  value={formData.payment_details}
                  onChange={handleInputChange}
                  placeholder="Enter payment instructions (e.g., Bank transfer required, PayPal accepted, etc.)"
                  rows="3"
                  className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.payment_details ? 'border-red-500' : ''}`}
                />
                {errors.payment_details && <p className="text-red-500 text-sm mt-1">{errors.payment_details}</p>}
              </div>
            </>
          )}

          <div className="flex gap-4 items-center">
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Mode <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.mode ? 'border-red-500' : ''} ${!formData.mode ? 'text-gray-400' : 'text-black'}`}
                >
                  <option value="" disabled>Select Mode</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
            </div>

            {formData.mode === "offline" ? (
              <div className="space-y-2 flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Offline Mode <span className="text-red-500">*</span>
                </label>
                <div className="relative w-full">
                  <select
                    name="offline_mode"
                    value={formData.offline_mode}
                    onChange={handleInputChange}
                    className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.offline_mode ? 'border-red-500' : ''} ${!formData.offline_mode ? 'text-gray-400' : 'text-black'}`}
                  >
                    <option value="" disabled>Select Offline Mode</option>
                    <option value="inhome">In Home</option>
                    <option value="homedelivery">Home Delivery</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.offline_mode && <p className="text-red-500 text-sm mt-1">{errors.offline_mode}</p>}
              </div>
            ) : formData.mode === "online" ? (
              <div className="space-y-2 flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Meeting Link 
                </label>
                <input
                  type="text"
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleInputChange}
                  placeholder="Enter meeting link (e.g., Zoom, Google Meet)"
                  className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.meeting_link ? 'border-red-500' : ''}`}
                />
                {errors.meeting_link && <p className="text-red-500 text-sm mt-1">{errors.meeting_link}</p>}
              </div>
            ) : null}
          </div>

          {formData.mode === "offline" && formData.offline_mode === "inhome" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter full address (e.g., 123 Main St, City, State, ZIP)"
                rows="2"
                className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.location ? 'border-red-500' : ''}`}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          )}

          <div className="border-l-2 border-purple-600 pl-4 mt-8">
            <h3 className="text-sm font-medium text-gray-900">BOOKING SETTINGS</h3>
          </div>

          <div className="flex gap-4 items-center">
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">Allow Double Booking</label>
              <div className="relative w-full">
                <select
                  name="double_book"
                  value={formData.double_book}
                  onChange={(e) => handleSelectChange("double_book", e.target.value)}
                  className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {formData.type !== "one-to-one" && (
              <div className="space-y-2 flex-1">
                <label className="block text-sm font-medium text-gray-700">Maximum Clients</label>
                <input
                  type="number"
                  name="max_clients"
                  value={formData.max_clients}
                  onChange={handleInputChange}
                  placeholder="Maximum Clients per Time Slot (optional)"
                  min="1"
                  className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">Require Appointment Approval</label>
              <div className="relative w-full">
                <select
                  name="approve_appointment"
                  value={formData.approve_appointment}
                  onChange={(e) => handleSelectChange("approve_appointment", e.target.value)}
                  className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={handleCancelClick}
              className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handelUpdateInterview}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Save'}
            </button>
          </div>
        </div>

        <ImageUploadCrop
          isOpen={isImageUploadOpen}
          onClose={() => setIsImageUploadOpen(false)}
          onImageUpdate={handleImageUpdate}
          currentImage={interview?.photo}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white mt-2 px-6 rounded-lg mx-5 text-sm">
      <div className="flex items-start gap-4 mb-8 pb-4 border-b">
        <div
          className="bg-purple-300 w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer hover:bg-purple-400 duration-200 relative overflow-hidden"
          onClick={handleImageClick}
        >
          {interview?.photo ? (
            <>
              <img className="w-full h-full rounded object-cover" src={interview.photo} alt="profile" />
              <span className="w-full h-full absolute top-0 left-0 flex justify-center items-center group">
                <span className="group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800"></span>
                <IoIosCamera className="absolute text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              </span>
            </>
          ) : (
            <span>{interview?.name ? interview.name.charAt(0).toUpperCase() : '?'}</span>
          )}
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-800">{interview?.name}</h2>
          <p className="text-gray-600">{interview?.type}</p>
        </div>
        {canEdit && (
          <button
            onClick={handleEditClick}
            className="ml-auto px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Event Type Name</h4>
            <p className="text-gray-800 font-medium">{interview?.name || "Not specified"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Type</h4>
            <p className="text-gray-800 font-medium">{interview?.type || "Not specified"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Duration</h4>
            <p className="text-gray-800 font-medium">
              {interview?.duration_cycle ? `${interview.duration_cycle} ${interview.duration_period}` : "Not specified"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Rest Cycle</h4>
            <p className="text-gray-800 font-medium">
              {interview?.rest_cycle ? `${interview.rest_cycle} minutes` : "Not specified"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
            <p className="text-gray-800 font-medium">{interview?.status_of_pay || "Not specified"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Price</h4>
            <p className="text-gray-800 font-medium">
              {interview?.price && interview?.currency
                ? `${interview.price} ${interview.currency}`
                : "Not specified"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Meeting Mode</h4>
            <p className="text-gray-800 font-medium flex items-center">
              {interview?.mode === "online" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              {interview?.mode === "offline" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {interview?.mode || "Not specified"}
            </p>
          </div>

          {interview?.mode === "online" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Meeting Link</h4>
              <p className="text-gray-800 font-medium">{interview?.meeting_link || "Not specified"}</p>
            </div>
          )}

          {interview?.mode === "offline" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Offline Mode</h4>
              <p className="text-gray-800 font-medium">{interview?.offline_mode || "Not specified"}</p>
            </div>
          )}

          {interview?.offline_mode === "inhome" && interview?.location && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
              <p className="text-gray-800 font-medium">{interview.location}</p>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Allow Double Booking</h4>
            <p className="text-gray-800 font-medium">{interview?.double_book === "1" ? "Yes" : "No"}</p>
          </div>

          {interview?.type !== "one-to-one" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Maximum Clients</h4>
              <p className="text-gray-800 font-medium">{interview?.max_clients || "Not specified"}</p>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Require Appointment Approval</h4>
            <p className="text-gray-800 font-medium">{interview?.approve_appointment === "1" ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;