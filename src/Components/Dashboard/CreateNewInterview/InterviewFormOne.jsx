import { useState, useEffect } from 'react';
import { Camera, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createInterview, fetchAllInterviews, fetchInterviews } from '../../../redux/apiCalls/interviewCallApi';
import { getAllWorkspaces,getAvailableStaffForWorkspace } from '../../../redux/apiCalls/workspaceCallApi';
import ImageUploadCrop from '../InterviewsPages/InterViewPage/ImageUploadCrop';
import Select from "react-select";
import currencies from "world-currencies";
import GroupManagement from './GroupManagement';
import { getResources } from '../../../redux/apiCalls/ResourceCallApi';

const InterviewFormOne = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [interviewType, setInterviewType] = useState(location.state?.interviewType || '');
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [showRecruitersSection, setShowRecruitersSection] = useState(false);
  const [groups, setGroups] = useState([]);

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
    inperson_mode: '',
    location: '',
    reminder_note: '',
    double_book: true,
    approve_appointment: false,
    require_staff_select: true,
    max_clients: '',
    meeting_link: "",
    resource_id: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { allWorkspaces ,availableStForWorkS} = useSelector(state => state.workspace);
  const { resources } = useSelector((state) => state.resources);

  const currencyOptions = Object.keys(currencies).map(code => ({
    value: code,
    label: `${currencies[code].name} (${currencies[code].symbol || code})`
  }));

  useEffect(() => {
    dispatch(getAllWorkspaces());
    dispatch(getResources());
  }, [dispatch]);

const handleSubmit = async () => {
  if (isCollective && !showRecruitersSection) {
    if (!validateRequiredFields()) {
      return; 
    }
    setShowRecruitersSection(true);
    return;
  }
  if (!isCollective) {
    await handleFinalSubmit([]);
  }
};

const handleFinalSubmit = async (createdGroups) => {
  setIsLoading(true);
  setErrors({});

  const dataToSend = {
    ...formData,
    photo: tempImage || formData.photo,
    double_book: formData.double_book ? 1 : 0,
    approve_appointment: isCollective ? 0 : (formData.approve_appointment ? 1 : 0),
    require_staff_select: isCollective ? 0 : (formData.require_staff_select ? 1 : 0),
    work_space_id: formData.work_space_id ? parseInt(formData.work_space_id) : null,
    duration_cycle: formData.duration_cycle ? parseInt(formData.duration_cycle) : null,
    rest_cycle: formData.rest_cycle ? parseInt(formData.rest_cycle) : null,
    price: formData.price ? parseFloat(formData.price) : null,
    max_clients: formData.max_clients ? parseInt(formData.max_clients) : null,
    resource_id: formData.resource_id ? parseInt(formData.resource_id) : null,
  };

  if (isCollective && createdGroups && createdGroups.length > 0) {
    const validGroups = createdGroups
      .filter(g => g.name && g.staff_ids && g.staff_ids.length > 0)
      .map(g => ({
        name: String(g.name).trim(),
        staff_ids: g.staff_ids.map(id => Number(id))
      }));
    
    if (validGroups.length > 0) {
      dataToSend.groups = validGroups;
    }
  }
  
  if (formData.status !== 'paid') {
    delete dataToSend.price;
    delete dataToSend.currency;
    delete dataToSend.payment_details;
  } else {
    dataToSend.price = formData.price ? parseFloat(formData.price) : null;
  }
  
  console.log('Data to send:', dataToSend); 

  try {
    const result = await dispatch(createInterview(dataToSend));
    if (result && result.success) {
      await dispatch(fetchInterviews({ work_space_id: formData.work_space_id }));
      
      navigate('/layoutDashboard/interviews');
    } else if (result.errors) {
      setErrors(result.errors);
      setShowRecruitersSection(false);
    }
  } catch (error) {
    console.error('Submit error:', error);
  } finally {
    setIsLoading(false);
  }
};

const validateRequiredFields = () => {
  const newErrors = {};
  if (!formData.name) newErrors.name = 'Interview Name is required';
  if (!formData.work_space_id) newErrors.work_space_id = 'Work Space is required';
  if (!formData.duration_cycle || formData.duration_cycle <= 0) newErrors.duration_cycle = 'Duration must be greater than 0';
  if (!formData.mode) newErrors.mode = 'Mode is required';

  if (formData.status === 'paid') {
    if (!formData.currency) newErrors.currency = 'Currency is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.payment_details) newErrors.payment_details = 'Payment Details is required';
  }

  if (formData.mode === 'inperson' && !formData.inperson_mode) {
    newErrors.inperson_mode = 'In-person Mode is required';
  }

if (interviewType === 'resource' && !formData.resource_id) {
  newErrors.resource_id = 'Resource is required';
}
  if (formData.inperson_mode === 'inhouse' && !formData.location) {
    newErrors.location = 'Location is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  let newValue = type === 'checkbox' ? checked : value;
  if (["duration_cycle", "rest_cycle", "price", "max_clients"].includes(name)) {
    if (value === "") {
      newValue = "";
    } else {
      if (value.startsWith('-')) {
        return; 
      }
      
      newValue = value; 
    }
  }
  setFormData(prev => ({
    ...prev,
    [name]: newValue,
    ...(name === 'mode' && (value === 'online' || value === 'online/inperson' || value === 'phone') 
      ? { inperson_mode: '', location: '' } 
      : {}),
    ...(name === 'mode' && (value === 'inperson' || value === 'online/inperson' || value === 'phone') 
      ? { meeting_link: '' } 
      : {}),
    ...(name === 'inperson_mode' && value !== 'inhouse' ? { location: '' } : {})
  }));

  if (name === 'work_space_id' && value) {
    dispatch(getAvailableStaffForWorkspace(value));
  }
  
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }
};

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
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
    if (tempImage) return URL.createObjectURL(tempImage);
    return null;
  };

  const displayImage = getDisplayImage();

  const isCollective = interviewType === 'collective-booking';
  const isResource = interviewType === 'resource';

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
{!showRecruitersSection ? (
  <div className="space-y-6">
    <div className="border-l-2 border-purple-600 pl-4">
      <h3 className="text-sm font-medium text-gray-900">INTERVIEW DETAILS</h3>
    </div>

    {/* Interview Name & Work Space */}
    <div className='flex gap-4 items-center'>
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
    name="work_space_id"
    value={formData.work_space_id}
    onChange={handleInputChange}
    className={`w-full outline-none p-2.5 border rounded-lg appearance-none pr-10 
      focus:ring-2 focus:ring-purple-500 focus:border-transparent
      ${errors.work_space_id ? 'border-red-500' : ''} 
      ${!formData.work_space_id ? 'text-gray-800' : 'text-black'}
    `}
  >
    <option value="" disabled>
      Select Work Space
    </option>

    {allWorkspaces?.map((workspace) => (
      <option
        key={workspace.id}
        value={workspace.id}
        className="whitespace-normal"
      >
        {workspace.name.length > 40
          ? workspace.name.slice(0, 40) + "…"
          : workspace.name}
      </option>
    ))}
  </select>

  {/* Icon */}
  <ChevronDown
    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
  />
</div>

        {errors.work_space_id && <p className="text-red-500 text-sm mt-1">{errors.work_space_id}</p>}
      </div>
      {interviewType === 'resource' && (
  <div className="space-y-2 flex-1">
    <label className="block text-sm font-medium text-gray-700">
      Resource <span className="text-red-500">*</span>
    </label>
    <div className="relative w-full">
      <select
        name="resource_id"
        value={formData.resource_id}
        onChange={handleInputChange}
        className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.resource_id ? 'border-red-500' : ''} ${!formData.resource_id ? 'text-gray-800' : 'text-black'}`}
      >
        <option value="" disabled>Select Resource</option>
        {resources?.map((resource) => (
          <option key={resource.id} value={resource.id}>
            {resource.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
    {errors.resource_id && <p className="text-red-500 text-sm mt-1">{errors.resource_id}</p>}
  </div>
)}
    </div>

    {/* Duration & Rest */}
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
          placeholder="Enter rest time"
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

    {/* Payment Fields */}
    {formData.status === 'paid' && (
      <>
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
                onChange={(selected) => handleInputChange({ target: { name: "currency", value: selected.value } })}
                placeholder="Select Currency"
                classNamePrefix="react-select"
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
            placeholder="Enter payment instructions"
            rows="3"
            className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.payment_details ? 'border-red-500' : ''}`}
          />
          {errors.payment_details && <p className="text-red-500 text-sm mt-1">{errors.payment_details}</p>}
        </div>
      </>
    )}

    {/* Mode & in-person / online */}
<div className='flex gap-4 items-center'>
  <div className="space-y-2 flex-1">
    <label className="block text-sm font-medium text-gray-700">
      Mode <span className="text-red-500">*</span>
    </label>
    <div className="relative w-full">
      <select
        name="mode"
        value={formData.mode}
        onChange={handleInputChange}
        className={`w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.mode ? 'border-red-500' : ''} ${!formData.mode ? 'text-gray-800' : 'text-black'}`}
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

  {formData.mode === 'inperson' && (
    <div className="space-y-2 flex-1">
      <label className="block text-sm font-medium text-gray-700">
        In-person Mode <span className="text-red-500">*</span>
      </label>
      <div className="relative w-full">
        <select
          name="inperson_mode"
          value={formData.inperson_mode}
          onChange={handleInputChange}
          className={`w-full outline-none p-2.5 border text-black rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.inperson_mode ? 'border-red-500' : ''}`}
        >
          <option value="" disabled>Select in-person Mode</option>
          <option value="inhouse">In House</option>
          <option value="athome">At Home</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {errors.inperson_mode && <p className="text-red-500 text-sm mt-1">{errors.inperson_mode}</p>}
    </div>
  )}

  {formData.mode === 'online' && (
    <div className="space-y-2 flex-1">
      <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
      <input
        type="text"
        name="meeting_link"
        value={formData.meeting_link}
        onChange={handleInputChange}
        placeholder="Enter meeting link"
        className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.meeting_link ? 'border-red-500' : ''}`}
      />
      {errors.meeting_link && <p className="text-red-500 text-sm mt-1">{errors.meeting_link}</p>}
    </div>
  )}
</div>

{(formData.inperson_mode === 'inhouse' || formData.mode === 'online/inperson') &&  (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Location {formData.inperson_mode === 'inhouse' && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name="location"
      value={formData.location}
      onChange={handleInputChange}
      placeholder="Enter full address"
      rows="2"
      className={`w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.location ? 'border-red-500' : ''}`}
    />
    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
  </div>
)}


    {/* Booking Settings */}
    <div className="border-l-2 border-purple-600 pl-4 mt-8">
      <h3 className="text-sm font-medium text-gray-900">BOOKING SETTINGS</h3>
    </div>

    <div className='flex gap-4 items-center'>
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

      {!isCollective && (
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
      )}
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Reminder Note</label>
      <textarea
        name="reminder_note"
        value={formData.reminder_note}
        onChange={handleInputChange}
        placeholder="Enter reminder note for clients"
        rows="3"
        className="w-full outline-none p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>

    {!isCollective && !isResource && (
      <div className='flex gap-4 items-center'>
        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-gray-700">Require Staff Selection</label>
          <div className="relative w-full">
            <select
              name="require_staff_select"
              value={formData.require_staff_select}
              onChange={(e) => handleSelectChange("require_staff_select", e.target.value === 'true')}
              className="w-full outline-none p-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    )}

    {interviewType === 'group-booking' && (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Maximum Clients</label>
        <input
          type="number"
          name="max_clients"
          value={formData.max_clients}
          onChange={handleInputChange}
          placeholder="Maximum Clients per Time Slot"
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
        {isLoading ? 'Creating...' : (isCollective ? 'Next' : 'Create')}
      </button>
    </div>
  </div>
) : (
  <GroupManagement
    availableStaff={availableStForWorkS || []}
    onComplete={(createdGroups) => {
      setGroups(createdGroups);
      handleFinalSubmit(createdGroups);
    }}
    onBack={() => setShowRecruitersSection(false)}
  />
)}
      

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