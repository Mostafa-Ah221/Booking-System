import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editInterviewById, updateInterview } from '../../../../../redux/apiCalls/interviewCallApi';
import { IoIosCamera } from "react-icons/io";
import { ChevronDown } from 'lucide-react';
import toast from "react-hot-toast";
import Select from "react-select";
import currencies from "world-currencies";
import ImageUploadCrop from '../ImageUploadCrop';

const InterviewDetailsEdit = ({ interview, workspaces, loading, id, onCancel }) => {
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
    inperson_mode: "",
    location: "",
    double_book: "0",
     reminder_note: "",
    approve_appointment: "0",
    require_staff_select: "0",
    max_clients: null,
    meeting_link: "",
    require_end_time: "0",
    photo: null
  });

  const dispatch = useDispatch();
  const isResourceType = interview?.type === "resource";
  const isCollectiveType = interview?.type === "collective-booking";

  const currencyOptions = Object.keys(currencies).map(code => ({
    value: code,
    label: `${currencies[code].name} (${currencies[code].symbol || code})`
  }));

useEffect(() => {
  if (interview) {
    const isFree = interview.status_of_pay === "free";
    setFormData({
      name: interview.name || "",
      type: interview.type || "",
      workspace_id: interview.workspace_id || "",
      duration_cycle: interview.duration_cycle || "",
      duration_period: interview.duration_period || "minutes",
      rest_cycle: interview.rest_cycle || "",
      status: interview.status_of_pay || "",
      price: isFree ? "" : (interview.price || ""),
      currency: isFree ? "" : (interview.currency || ""),
      payment_details: isFree ? "" : (interview.payment_details || ""),
      mode: interview.mode || "",
      inperson_mode: interview.inperson_mode || "",
      location: interview.location || "",
      double_book: interview.double_book ? "1" : "0",
      reminder_note: interview.reminder_note || "",
      approve_appointment: interview.approve_appointment ? "1" : "0",
      require_staff_select: interview.require_staff_select ? "1" : "0",
      max_clients: interview.max_clients || null,
      meeting_link: interview.meeting_link || "",
      require_end_time: (interview.require_end_time === 1 || interview.require_end_time === "1" || interview.require_end_time === true) ? "1" : "0",
      photo: interview.photo || null
    });
    setTempImage(null);
  }
}, [interview]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    let newValue = value;

    if ((name === "duration_cycle" || name === "rest_cycle" || name === "price" || name === "max_clients") && value !== "") {
      const numValue = parseFloat(value);
      if (numValue < 0) {
        return;
      }
    }

    if (name === "photo" && files[0]) {
      setTempImage(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        ...(name === 'mode' && (value === 'online' || value === 'online/inperson' || value === 'phone') 
          ? { inperson_mode: '', location: '' } 
          : {}),
        ...(name === 'mode' && (value === 'inperson' || value === 'online/inperson' || value === 'phone') 
          ? { meeting_link: '' } 
          : {}),
        ...(name === 'inperson_mode' && value !== 'inhouse' ? { location: '' } : {}),
        ...(name === 'status' && value === 'free' 
  ? { price: '', currency: '', payment_details: '' } 
  : {})
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
      ...(name === "type" && value === "one-to-one" ? { max_clients: null } : {})
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleImageUpdate = (imageFile) => {
    setTempImage(imageFile);
    setIsImageUploadOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Interview name is required";
    if (!formData.mode) newErrors.mode = "Mode is required";
    if (!formData.duration_cycle) newErrors.duration_cycle = "Duration is required";

    if (formData.status === "paid") {
      if (!formData.price) newErrors.price = "Price is required for paid interviews";
      if (!formData.currency) newErrors.currency = "Currency is required for paid interviews";
      if (!formData.payment_details) newErrors.payment_details = "Payment details are required for paid interviews";
    }

    if (formData.mode === "inperson") {
      if (!formData.inperson_mode) newErrors.inperson_mode = "In-person mode is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handelUpdateInterview = async () => {
    if (!validateForm()) return;

    let dataToSend = {};

    if (isResourceType) {
      dataToSend = {
        name: formData.name,
        work_space_id: formData.workspace_id,
        duration_cycle: parseInt(formData.duration_cycle),
        duration_period: formData.duration_period,
        rest_cycle: formData.rest_cycle ? parseInt(formData.rest_cycle) : null,
        status: formData.status,
        mode: formData.mode,
        double_book: formData.double_book === "1",                    
        approve_appointment: formData.approve_appointment === "1",    
        require_staff_select: formData.require_staff_select === "1", 
        require_end_time: formData.require_end_time === "1", 
         reminder_note: formData.reminder_note || null,         
      };
    } else {
      dataToSend = {
        name: formData.name,
        work_space_id: formData.workspace_id,
        duration_cycle: parseInt(formData.duration_cycle),
        duration_period: formData.duration_period,
        rest_cycle: formData.rest_cycle ? parseInt(formData.rest_cycle) : null,
        status: formData.status,
        mode: formData.mode,
         reminder_note: formData.reminder_note || null,
        double_book: formData.double_book === "1",
        approve_appointment: formData.approve_appointment === "1",
        require_staff_select: formData.require_staff_select === "1",
        require_end_time: formData.require_end_time === "1",
        max_clients: formData.max_clients && parseInt(formData.max_clients) > 0
          ? parseInt(formData.max_clients)
          : null,
      };
    }

    if (formData.mode === "online" || formData.mode === "online/inperson") {
      dataToSend.meeting_link = formData.meeting_link;
    }

    if (formData.mode === "inperson") {
      dataToSend.inperson_mode = formData.inperson_mode;
      if (formData.inperson_mode === "inhouse" && formData.location) {
        dataToSend.location = formData.location;
      }
    }

    if (formData.mode === "online/inperson" && formData.location) {
      dataToSend.location = formData.location;
    }

    if (formData.status === "paid") {
  dataToSend.price = parseFloat(formData.price);
  dataToSend.currency = formData.currency;
  dataToSend.payment_details = formData.payment_details;
} 

    if (tempImage) {
      dataToSend.photo = tempImage;
    }

    try {
      console.log("Sending data:", dataToSend);

      const result = await dispatch(updateInterview(id, dataToSend));

      if (result?.success) {
        toast.success(result.message);
        onCancel();
        dispatch(editInterviewById(id));
      } else if (result?.errors) {
        Object.keys(result.errors).forEach((field) => {
          result.errors[field].forEach((msg) => toast.error(msg));
        });
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.errors
          ? JSON.stringify(error.response.data.errors)
          : error?.response?.data?.message || "حدث خطأ غير متوقع";

      toast.error(errorMsg);
    }
  };

  const handleImageClick = () => {
    setIsImageUploadOpen(true);
  };

  const getDisplayImage = () => {
    if (tempImage) {
      return URL.createObjectURL(tempImage);
    }
    return interview?.photo;
  };

  const displayImage = getDisplayImage();

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

        <div className="space-y-2">
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
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
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
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className='space-y-2 flex-1'>
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
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-.ConcurrentModificationException5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className='space-y-2 flex-1'>
            {isResourceType && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Require End Time</label>
                <div className="relative w-full">
                  <select
                    name="require_end_time"
                    value={formData.require_end_time}
                    onChange={(e) => handleSelectChange("require_end_time", e.target.value)}
                    className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
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
                    min="0"
                    step="0.01"
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
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
                <option value="inperson">In Person</option>
                <option value="phone">Phone</option>
                <option value="online/inperson">Online/Inperson</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
          </div>

          {formData.mode === "inperson" && (
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">
                In-Person Mode <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <select
                  name="inperson_mode"
                  value={formData.inperson_mode}
                  onChange={handleInputChange}
                  className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.inperson_mode ? 'border-red-500' : ''} ${!formData.inperson_mode ? 'text-gray-800' : 'text-black'}`}
                >
                  <option value="" disabled>Select In-Person Mode</option>
                  <option value="inhouse">In House</option>
                  <option value="athome">At Home</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.inperson_mode && <p className="text-red-500 text-sm mt-1">{errors.inperson_mode}</p>}
            </div>
          )}

          {(formData.mode === "online" || formData.mode === "online/inperson") && (
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
          )}
        </div>

        {formData.mode === "inperson" && formData.inperson_mode === "inhouse" && (
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

        {formData.mode === "online/inperson" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location 
            </label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter full address for in-person part (e.g., 123 Main St, City)"
              rows="2"
              className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.location ? 'border-red-500' : ''}`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        )}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Reminder Note
          </label>
          <textarea
            name="reminder_note"
            value={formData.reminder_note}
            onChange={handleInputChange}
            placeholder="Enter reminder note for clients (e.g., Please bring ID, Arrive 10 minutes early)"
            rows="3"
            className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
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
        
        {!isResourceType && !isCollectiveType && (
          
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">Require Staff Selection</label>
            <div className="relative w-full">
              <select
                name="require_staff_select"
                value={formData.require_staff_select}
                onChange={(e) => handleSelectChange("require_staff_select", e.target.value)}
                className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
        </div>

        {formData.type === "group-booking" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Maximum Clients</label>
            <input
              type="number"
              name="max_clients"
              value={formData.max_clients}
              onChange={handleInputChange}
              placeholder="Maximum Clients per Time Slot (optional)"
              min="1"
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <button
            onClick={onCancel}
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
};

export default InterviewDetailsEdit;