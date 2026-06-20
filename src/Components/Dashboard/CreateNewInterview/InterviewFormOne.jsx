import { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createInterview, fetchInterviews } from '../../../redux/apiCalls/interviewCallApi';
import { getAllWorkspaces, getAvailableStaffForWorkspace } from '../../../redux/apiCalls/workspaceCallApi';
import ImageUploadCrop from '../InterviewsPages/InterViewPage/ImageUploadCrop';
import currencies from "world-currencies";
import GroupManagement from './GroupManagement';
import { getResources } from '../../../redux/apiCalls/ResourceCallApi';
import InterviewFormFields from './InterviewFormFields';

const InterviewFormOne = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [interviewType] = useState(location.state?.interviewType || '');
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [showRecruitersSection, setShowRecruitersSection] = useState(false);
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    type: location.state?.interviewType || '',
    work_space_id: '',
    photo: null,
    duration_cycle: '',
    duration_period: 'minutes',
    rest_cycle: '',
    status: 'free',
    price: '',
    travel_time: '',
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
    meeting_link: '',
    resource_id: '',
    extra_modes: [],        // ← new field for online/inperson checkboxes
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { allWorkspaces, availableStForWorkS } = useSelector(state => state.workspace);
  const { resources } = useSelector(state => state.resources);

  const currencyOptions = Object.keys(currencies).map(code => ({
    value: code,
    label: `${currencies[code].name} (${currencies[code].symbol || code})`,
  }));

  useEffect(() => {
    dispatch(getAllWorkspaces());
    dispatch(getResources());
  }, [dispatch]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

 const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  let newValue = type === 'checkbox' ? checked : value;

  if (['duration_cycle', 'rest_cycle', 'price', 'max_clients', 'travel_time'].includes(name)) {
    if (value === '') {
      newValue = '';
    } else if (value.startsWith('-')) {
      return;
    } else if (['duration_cycle', 'rest_cycle', 'max_clients', 'travel_time'].includes(name) && !Number.isInteger(Number(value))) {
      return;
    }
  }

  setFormData(prev => ({
    ...prev,
    [name]: newValue,
    // Reset sub-fields when mode changes
    ...(name === 'mode' && ['online', 'online/inperson', 'phone'].includes(value)
      ? { inperson_mode: '', location: '' }
      : {}),
    ...(name === 'mode' && ['inperson', 'online/inperson', 'phone'].includes(value)
      ? { meeting_link: '' }
      : {}),
    // Reset extra_modes + travel_time when leaving online/inperson
    ...(name === 'mode' && value !== 'online/inperson'
      ? { extra_modes: [], travel_time: '' }
      : {}),
    // Reset location when inperson_mode leaves inhouse
    ...(name === 'inperson_mode' && value !== 'inhouse' ? { location: '' } : {}),
    // Reset travel_time when inperson_mode leaves athome
    ...(name === 'inperson_mode' && value !== 'athome' ? { travel_time: '' } : {}),
  }));

  if (name === 'work_space_id' && value) {
    dispatch(getAvailableStaffForWorkspace(value));
  }

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }
};

  // Toggle a value inside the extra_modes array
  const handleExtraModeChange = (value) => {
    setFormData(prev => {
      const current = prev.extra_modes || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, extra_modes: updated };
    });
    if (errors.extra_modes) {
      setErrors(prev => ({ ...prev, extra_modes: undefined }));
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

  const getDisplayImage = () => {
    if (tempImage) return URL.createObjectURL(tempImage);
    return null;
  };

  // ─── Validation ───────────────────────────────────────────────────────────────

  const validateRequiredFields = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Interview Name is required';
    if (!formData.work_space_id) newErrors.work_space_id = 'Work Space is required';
    if (!formData.duration_cycle || formData.duration_cycle <= 0)
      newErrors.duration_cycle = 'Duration must be greater than 0';
    if (!formData.mode) newErrors.mode = 'Mode is required';

    if (formData.status === 'paid') {
      if (!formData.currency) newErrors.currency = 'Currency is required';
      if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
      if (!formData.payment_details) newErrors.payment_details = 'Payment Details is required';
    }

    if (formData.mode === 'inperson' && !formData.inperson_mode)
      newErrors.inperson_mode = 'In-person Mode is required';

    if (interviewType === 'resource' && !formData.resource_id)
      newErrors.resource_id = 'Resource is required';

    if (
      (formData.inperson_mode === 'inhouse' ||
        (formData.mode === 'online/inperson' && formData.extra_modes?.includes('inhouse'))) &&
      !formData.location
    )
      newErrors.location = 'Location is required';

    // extra_modes must have at least one option when mode is online/inperson
    if (formData.mode === 'online/inperson' && (!formData.extra_modes || formData.extra_modes.length === 0))
      newErrors.extra_modes = 'Please select at least one sub-mode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const isCollective = interviewType === 'collective-booking';

    if (isCollective && !showRecruitersSection) {
      if (!validateRequiredFields()) return;
      setShowRecruitersSection(true);
      return;
    }
    if (!isCollective) {
      await handleFinalSubmit([]);
    }
  };

  const handleFinalSubmit = async (createdGroups) => {
    if (!validateRequiredFields()) return;

    setIsLoading(true);
    setErrors({});

    const isCollective = interviewType === 'collective-booking';

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
      // Send extra_modes only when relevant, otherwise omit
      extra_modes: formData.mode === 'online/inperson' ? formData.extra_modes : undefined,
    };

    if (isCollective && createdGroups?.length > 0) {
      const validGroups = createdGroups
        .filter(g => g.name && g.staff_ids?.length > 0)
        .map(g => ({
          name: String(g.name).trim(),
          staff_ids: g.staff_ids.map(id => Number(id)),
        }));
      if (validGroups.length > 0) dataToSend.groups = validGroups;
    }

    if (formData.status !== 'paid') {
      delete dataToSend.price;
      delete dataToSend.currency;
      delete dataToSend.payment_details;
    }


    try {
      const result = await dispatch(createInterview(dataToSend));
      if (result?.success) {
        await dispatch(fetchInterviews({ work_space_id: formData.work_space_id }));
        navigate('/layoutDashboard/interviews');
      } else if (result?.errors) {
        setErrors(result.errors);
        setShowRecruitersSection(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Derived ──────────────────────────────────────────────────────────────────

  const isCollective = interviewType === 'collective-booking';
  const isResource = interviewType === 'resource';
  const displayImage = getDisplayImage();

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg my-5 text-sm">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8 pb-4 border-b">
        <div
          className="bg-purple-300 w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer hover:bg-purple-400 duration-200 relative overflow-hidden"
          onClick={() => setIsImageUploadOpen(true)}
        >
          {displayImage ? (
            <>
              <img className="w-full h-full rounded object-cover" src={displayImage} alt="Selected" />
              <span className="w-full h-full absolute top-0 left-0 flex justify-center items-center group">
                <span className="group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800" />
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

      {/* Form Body */}
      {!showRecruitersSection ? (
        <InterviewFormFields
          formData={formData}
          errors={errors}
          interviewType={interviewType}
          isCollective={isCollective}
          isResource={isResource}
          allWorkspaces={allWorkspaces}
          resources={resources}
          currencyOptions={currencyOptions}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleExtraModeChange={handleExtraModeChange}
          navigate={navigate}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
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