import { useState, useEffect } from 'react';
import { Camera, ChevronDown, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createInterview, fetchAllInterviews, fetchInterviews } from '../../../redux/apiCalls/interviewCallApi';
import { getAllWorkspaces } from '../../../redux/apiCalls/workspaceCallApi';
import ImageUploadCrop from '../InterviewsPages/InterViewPage/ImageUploadCrop';
import Select from "react-select";
import currencies from "world-currencies";

const InterviewFormOne = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [interviewType, setInterviewType] = useState(location.state?.interviewType);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: interviewType,
    work_space_id: '',
    photo: null,
    duration_cycle: "",
    duration_period: 'minutes',
    rest_cycle: "",
    status: 'free',
    price: "",
    payment_details: '',
    currency: '',
    mode: '',
    offline_mode: '',
    location: '',
    double_book: false,
    approve_appointment: false, 
    max_clients: '',
    meeting_link: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { allWorkspaces } = useSelector(state => state.workspace);


  const currencyOptions = Object.keys(currencies).map(code => ({
    value: code,
    label: `${currencies[code].name} (${currencies[code].symbol || code})`
  }));

  useEffect(() => {
    dispatch(getAllWorkspaces());
  }, [dispatch]);

const handleSubmit = async() => {
  if (!validateForm()) {
    return;
  }
  
  setIsLoading(true);
  
  const dataToSend = {
    ...formData,
    photo: tempImage || formData.photo,
    double_book: formData.double_book ? 1 : 0,
    approve_appointment: formData.approve_appointment ? 1 : 0,
    work_space_id: formData.work_space_id ? parseInt(formData.work_space_id) : null,
    duration_cycle: formData.duration_cycle ? parseInt(formData.duration_cycle) : null,
    rest_cycle: formData.rest_cycle ? parseInt(formData.rest_cycle) : null,
    price: formData.price ? parseFloat(formData.price) : null,
    max_clients: formData.max_clients ? parseInt(formData.max_clients) : null,
  };

  // Remove unnecessary fields
  if (dataToSend.mode !== 'online') {
    delete dataToSend.meeting_link;
  }
  if (dataToSend.mode !== 'in-person') {
    delete dataToSend.offline_mode;
    delete dataToSend.location;
  }
  if (dataToSend.offline_mode !== 'inhouse ') {
    delete dataToSend.location;
  }

  console.log('Data to send:', dataToSend);
  
  try {
    const result = await dispatch(createInterview(dataToSend)); 
    
    console.log('Result:', result);
    
   if (result && result.success) {
    dispatch(fetchAllInterviews());
    navigate('/layoutDashboard/interviews');
  } else {
    
    setIsLoading(false);
  }
  } catch (error) {
    console.error('Submit error:', error);
    setIsLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let newValue = value;
    if (type === 'checkbox') {
      newValue = checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === 'mode' && newValue === 'online' ? { offline_mode: '', location: '' } : {}),
      ...(name === 'offline_mode' && newValue !== 'inhouse ' ? { location: '' } : {})
    }));

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
      [name]: value
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

  const handleCameraClick = () => {
    setIsImageUploadOpen(true);
  };

  const getDisplayImage = () => {
    if (tempImage) {
      return URL.createObjectURL(tempImage);
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Interview name is required';
    if (!formData.work_space_id) newErrors.work_space_id = 'Work space is required';
    if (!formData.mode) newErrors.mode = 'Mode is required';
    if (!formData.duration_cycle) newErrors.duration_cycle = 'Duration is required';
    
    // Status validation
    if (formData.status === 'paid') {
      if (!formData.price) newErrors.price = 'Price is required for paid interviews';
      if (!formData.currency) newErrors.currency = 'Currency is required for paid interviews';
      if (!formData.payment_details) newErrors.payment_details = 'Payment details are required for paid interviews';
    }
    
    // Mode validation
    if (formData.mode === 'in-person') {
      if (!formData.offline_mode) newErrors.offline_mode = 'in-person mode is required';
      if (formData.offline_mode === 'inhouse ' && !formData.location) {
        newErrors.location = 'Location is required for in-home interviews';
      }
    }

    // Meeting link validation
    // if (formData.mode === 'online' && !formData.meeting_link) {
    //   newErrors.meeting_link = 'Meeting link is required for online interviews';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const displayImage = getDisplayImage();

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg my-5 text-sm">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8 pb-4 border-b">
        <div 
          className="bg-purple-300 w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer hover:bg-purple-400 duration-200 relative overflow-hidden"
          onClick={handleCameraClick}
        >
          {displayImage ? (
            <>
              <img className='w-full h-full rounded object-cover' src={displayImage} alt="Selected" />
              <span className='w-full h-full absolute top-0 left-0 flex justify-center items-center group'>
                <span className='group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800'></span>
                <Camera className="absolute text-white w-4 h-4 opacity-0 group-hover:opacity-100" />
              </span>
            </>
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-medium">Interview title</h2>
          <p className="text-gray-600">{interviewType}</p>
        </div>
        <Link to="/create_interview" className="ml-auto">
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </Link>
      </div>

      {/* Form Section */}
      <div className="space-y-6">
        <div className="border-l-2 border-purple-600 pl-4">
          <h3 className="text-sm font-medium text-gray-900">INTERVIEW DETAILS</h3>
        </div>
        <div className='flex gap-4 items-center'>
          {/* Interview Name */}
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Interview Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Work Space */}
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Work Space <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <select
                name="work_space_id"
                value={formData.work_space_id}
                onChange={handleInputChange}
                className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.work_space_id ? 'border-red-500' : ''
                } ${!formData.work_space_id ? 'text-gray-800' : 'text-black'}`}
              >
                <option value="" disabled>Select Work Space</option>
                {allWorkspaces?.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.work_space_id && <p className="text-red-500 text-sm mt-1">{errors.work_space_id}</p>}
          </div>
        </div>

        {/* Duration */}
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
              className={`w-full outline-none border rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.duration_cycle ? 'border-red-500' : ''
              }`}
            />
            {errors.duration_cycle && <p className="text-red-500 text-sm mt-1">{errors.duration_cycle}</p>}
          </div>
          {/* Rest Cycle */}
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

        {/* Status */}
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

        {/* Payment Fields - Only show if status is 'paid' */}
        {formData.status === 'paid' && (
          <>
            {/* Price & Currency */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Select
                    className='rounded-lg'
                    options={currencyOptions}
                    isSearchable
                    value={currencyOptions.find(opt => opt.value === formData.currency) || null}
                    onChange={(selected) =>
                      handleInputChange({
                        target: { name: "currency", value: selected.value },
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
                    className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
              </div>
            </div>

            {/* Payment Details */}
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
                className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.payment_details ? 'border-red-500' : ''
                }`}
              />
              {errors.payment_details && <p className="text-red-500 text-sm mt-1">{errors.payment_details}</p>}
            </div>
          </>
        )}

        <div className='flex gap-4 items-center'>
          {/* Mode */}
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Mode <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <select
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.mode ? 'border-red-500' : ''
                } ${!formData.mode ? 'text-gray-800' : 'text-black'}`}
              >
                <option value="" disabled>Select Mode</option>
                <option value="online">Online</option>
                <option value="in-person">In Persone</option>
                <option value="phone">Phone</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
          </div>

          {/* in-person Mode or Meeting Link */}
          {formData.mode === 'in-person' ? (
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium text-gray-700">
                in-person Mode <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <select
                  name="offline_mode"
                  value={formData.offline_mode}
                  onChange={handleInputChange}
                  className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.offline_mode ? 'border-red-500' : ''
                  } ${!formData.offline_mode ? 'text-gray-400' : 'text-black'}`}
                >
                  <option value="" disabled>Select in-person Mode</option>
                  <option value="inhouse">In House</option>
                  <option value="athome">At Home</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.offline_mode && <p className="text-red-500 text-sm mt-1">{errors.offline_mode}</p>}
            </div>
          ) : formData.mode === 'online' ? (
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
                className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.meeting_link ? 'border-red-500' : ''
                }`}
              />
              {errors.meeting_link && <p className="text-red-500 text-sm mt-1">{errors.meeting_link}</p>}
            </div>
          ) : null}
        </div>

        {/* Location - Only show if offline_mode is 'inhouse ' */}
        {formData.offline_mode === 'inhouse ' && (
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
              className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : ''
              }`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        )}

        {/* Additional Settings */}
        <div className="border-l-2 border-purple-600 pl-4 mt-8">
          <h3 className="text-sm font-medium text-gray-900">BOOKING SETTINGS</h3>
        </div>
        
        <div className='flex gap-4 items-center'>
          {/* Allow Double Booking */}
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">Allow Double Booking</label>
            <div className="relative w-full">
              <select
                name="double_book"
                value={formData.double_book}
                onChange={(e) => handleSelectChange("double_book", e.target.value === 'true')}
                className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Approve Appointment */}
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">Require Appointment Approval</label>
            <div className="relative w-full">
              <select
                name="approve_appointment"
                value={formData.approve_appointment}
                onChange={(e) => handleSelectChange("approve_appointment", e.target.value === 'true')}
                className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Max Clients - Show only if interviewType is not one-to-one */}
        {interviewType !== 'one-to-one' && (
          <div className="space-y-2">
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button onClick={() => navigate(-1)} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
            Back
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {/* ImageUploadCrop Component */}
      <ImageUploadCrop 
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onImageUpdate={handleImageUpdate}
        currentImage={null}
      />
    </div>
  );
};

export default InterviewFormOne;