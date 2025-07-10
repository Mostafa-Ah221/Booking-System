import { useState,useEffect } from 'react';
import { Camera, ChevronDown, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import {createInterview} from '../../../redux/apiCalls/interviewCallApi'
import { getWorkspace } from '../../../redux/apiCalls/workspaceCallApi';

const InterviewFormOne = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [interviewType, setInterviewType] = useState(
    location.state?.interviewType 
  );

  const [formData, setFormData] = useState({
    name: '',
    type: interviewType, 
    work_space_id: '',
    hours: '0',
    duration_cycle: '',
    duration_period: '',
    price: '',
    currency: '',
    mode: '',
    photo:null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const { workspaces  } = useSelector(state => state.workspace);

     useEffect(() => {
         dispatch(getWorkspace());
    }, [dispatch]);
    

const handleSubmit = () => {
  if (!validateForm()) {
    return; 
  }
  
  setIsLoading(true);
  
  dispatch(createInterview(formData, navigate))
    .then((result) => {
      if (!result || !result.success) {
        setIsLoading(false);
      }
    });
};

 const handleInputChange = (e) => {
  const { name, value, files } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: name === "photo" ? files[0] : value
  }));

  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  }
};


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Interview name is required';
    if (!formData.work_space_id) newErrors.work_space_id = 'Work space is required';
    if (!formData.mode) newErrors.mode = 'Mode is required';
    if (!formData.duration_period) newErrors.duration_period = 'Duration period is required';
    
    // Price validation if needed
    if (formData.price && !formData.currency) {
      newErrors.currency = 'Currency is required when price is set';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg my-5">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8 pb-4 border-b">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Camera className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-medium">Interview title</h2>
          <p className="text-gray-600">One-to-One</p>
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

        {/* Interview Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Interview Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Work Space ID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Work Space <span className="text-red-500">*</span>
          </label>
          <select
            name="work_space_id"
            value={formData.work_space_id}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.work_space_id ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select Work Space</option>
            {workspaces.map((workspace) =>
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            )}
          </select>
          {errors.work_space_id && <p className="text-red-500 text-sm mt-1">{errors.work_space_id}</p>}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Duration</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <select
                name="duration_cycle"
                value={formData.duration_cycle}
                onChange={handleInputChange}
                className="w-full appearance-none border rounded-lg p-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="relative flex-1">
              <select
                name="duration_period"
                value={formData.duration_period}
                onChange={handleInputChange}
                className={`w-full appearance-none border rounded-lg p-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.duration_period ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select Period</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {errors.duration_period && <p className="text-red-500 text-sm mt-1">{errors.duration_period}</p>}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className={`w-full appearance-none border rounded-lg p-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.currency ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select Currency</option>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
            </div>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter Price"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mode</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.mode ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select Mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
        </div>
        {/* photo */}
        <div className="space-y-1">
          <label htmlFor="photo" className="block text-sm font-medium">Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
           onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Link to="/create_interview" className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
            Back
          </Link>
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
           {isLoading ? 'Creating...' : 'Create'}

          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFormOne;