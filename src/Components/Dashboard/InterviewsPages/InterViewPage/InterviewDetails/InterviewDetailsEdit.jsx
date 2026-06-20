import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editInterviewById, updateInterview } from '../../../../../redux/apiCalls/interviewCallApi';
import { IoIosCamera } from 'react-icons/io';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import currencies from 'world-currencies';
import ImageUploadCrop from '../ImageUploadCrop';
import InterviewDetailsEditFields from './InterviewDetailsEditFields';

const InterviewDetailsEdit = ({ interview, workspaces, loading, id, onCancel }) => {
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false); // ✅ NEW
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    workspace_id: '',
    duration_cycle: '',
    duration_period: 'minutes',
    rest_cycle: '',
    status: '',
    price: '',
    travel_time: '',
    currency: '',
    payment_details: '',
    mode: '',
    inperson_mode: '',
    location: '',
    double_book: '0',
    reminder_note: '',
    approve_appointment: '0',
    require_staff_select: '0',
    max_clients: null,
    meeting_link: '',
    require_end_time: '0',
    photo: null,
    extra_modes: [],
  });

  const dispatch = useDispatch();
  const isResourceType  = interview?.type === 'resource';
  const isCollectiveType = interview?.type === 'collective-booking';

  const currencyOptions = Object.keys(currencies).map(code => ({
    value: code,
    label: `${currencies[code].name} (${currencies[code].symbol || code})`,
  }));

  // ─── Populate form from interview prop ───────────────────────────────────────
  useEffect(() => {
    if (interview) {
      const isFree = interview.status_of_pay === 'free';
      setFormData({
        name:                interview.name || '',
        type:                interview.type || '',
        workspace_id:        interview.workspace_id || '',
        duration_cycle:      interview.duration_cycle || '',
        duration_period:     interview.duration_period || 'minutes',
        rest_cycle:          interview.rest_cycle || '',
        status:              interview.status_of_pay || '',
        price:               isFree ? '' : (interview.price || ''),
        currency:            isFree ? '' : (interview.currency || ''),
        payment_details:     isFree ? '' : (interview.payment_details || ''),
        mode:                interview.mode || '',
        inperson_mode:       interview.inperson_mode || '',
        location:            interview.location || '',
        double_book:         interview.double_book ? '1' : '0',
        reminder_note:       interview.reminder_note || '',
        approve_appointment: interview.approve_appointment ? '1' : '0',
        require_staff_select:interview.require_staff_select ? '1' : '0',
        max_clients:         interview.max_clients || null,
        meeting_link:        interview.meeting_link || '',
        require_end_time:    (interview.require_end_time === 1 || interview.require_end_time === '1' || interview.require_end_time === true) ? '1' : '0',
        photo:               interview.photo || null,
        extra_modes:         Array.isArray(interview.extra_modes) ? interview.extra_modes : [],
        travel_time: interview.travel_time || '',

      });
      setTempImage(null);
      setRemovePhoto(false); // ✅ reset on interview load
    }
  }, [interview]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

 const handleInputChange = (e) => {
  const { name, value, files } = e.target;

  if (['duration_cycle', 'rest_cycle', 'price', 'max_clients', 'travel_time'].includes(name) && value !== '') {
    if (parseFloat(value) < 0) return;
    if (['duration_cycle', 'rest_cycle', 'max_clients', 'travel_time'].includes(name) && !Number.isInteger(Number(value))) return;
  }

  if (name === 'photo' && files?.[0]) {
    setTempImage(files[0]);
    return;
  }

  setFormData(prev => ({
    ...prev,
    [name]: value,
    ...(name === 'mode' && ['online', 'online/inperson', 'phone'].includes(value)
      ? { inperson_mode: '', location: '' }
      : {}),
    ...(name === 'mode' && ['inperson', 'online/inperson', 'phone'].includes(value)
      ? { meeting_link: '' }
      : {}),
    ...(name === 'mode' && value !== 'online/inperson'
      ? { extra_modes: [], travel_time: '' }
      : {}),
    ...(name === 'inperson_mode' && value !== 'inhouse' ? { location: '' } : {}),
    ...(name === 'inperson_mode' && value !== 'athome' ? { travel_time: '' } : {}),
    ...(name === 'status' && value === 'free'
      ? { price: '', currency: '', payment_details: '' }
      : {}),
  }));

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }
};

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value === 'one-to-one' ? { max_clients: null } : {}),
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpdate = (imageFile) => {
    setTempImage(imageFile);
    setRemovePhoto(false); // ✅ if user picks new photo, cancel remove
    setIsImageUploadOpen(false);
  };

  // ✅ NEW: handle remove photo
  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setTempImage(null);
    setRemovePhoto(true);
  };

  // ─── Validation ───────────────────────────────────────────────────────────────

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name)           newErrors.name = 'Interview name is required';
    if (!formData.mode)           newErrors.mode = 'Mode is required';
    if (!formData.duration_cycle) newErrors.duration_cycle = 'Duration is required';

    if (formData.status === 'paid') {
      if (!formData.price)           newErrors.price = 'Price is required for paid interviews';
      if (!formData.currency)        newErrors.currency = 'Currency is required for paid interviews';
      if (!formData.payment_details) newErrors.payment_details = 'Payment details are required for paid interviews';
    }

    if (formData.mode === 'inperson' && !formData.inperson_mode)
      newErrors.inperson_mode = 'In-person mode is required';

    if (
      (formData.mode === 'inperson' && formData.inperson_mode === 'inhouse' ||
        formData.mode === 'online/inperson' && formData.extra_modes?.includes('inhouse')) &&
      !formData.location
    )
      newErrors.location = 'Location is required';

    if (formData.mode === 'online/inperson' && (!formData.extra_modes || formData.extra_modes.length === 0))
      newErrors.extra_modes = 'Please select at least one sub-mode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────

 const handelUpdateInterview = async () => {
  if (!validateForm()) return;

  let dataToSend = {};

  const commonFields = {
    name:                 formData.name,
    work_space_id:        formData.workspace_id,
    duration_cycle:       parseInt(formData.duration_cycle),
    duration_period:      formData.duration_period,
    rest_cycle:           formData.rest_cycle ? parseInt(formData.rest_cycle) : null,
    status:               formData.status,
    mode:                 formData.mode,
    reminder_note:        formData.reminder_note || null,
    double_book:          formData.double_book === '1',
    approve_appointment:  formData.approve_appointment === '1',
    require_staff_select: formData.require_staff_select === '1',
    require_end_time:     formData.require_end_time === '1',
  };

  if (isResourceType) {
    dataToSend = { ...commonFields };
  } else {
    dataToSend = {
      ...commonFields,
      max_clients: formData.max_clients && parseInt(formData.max_clients) > 0
        ? parseInt(formData.max_clients)
        : null,
    };
  }

  if (formData.mode === 'online') {
    dataToSend.meeting_link = formData.meeting_link;
  }

  if (formData.mode === 'inperson') {
    dataToSend.inperson_mode = formData.inperson_mode;
    if (formData.inperson_mode === 'inhouse' && formData.location) {
      dataToSend.location = formData.location;
    }
    if (formData.inperson_mode === 'athome' && formData.travel_time) {
      dataToSend.travel_time = parseInt(formData.travel_time);
    }
  }

  if (formData.mode === 'online/inperson') {
    dataToSend.extra_modes = formData.extra_modes;
    if (formData.location) dataToSend.location = formData.location;
    if (formData.extra_modes.includes('online')) {
      dataToSend.meeting_link = formData.meeting_link;
    }
    if (formData.extra_modes.includes('athome') && formData.travel_time) {
      dataToSend.travel_time = parseInt(formData.travel_time);
    }
  }

  if (formData.status === 'paid') {
    dataToSend.price           = parseFloat(formData.price);
    dataToSend.currency        = formData.currency;
    dataToSend.payment_details = formData.payment_details;
  }

  // ✅ Always use FormData to support remove_photo
  const fd = new FormData();
  Object.keys(dataToSend).forEach(key => {
    const val = dataToSend[key];
    if (val !== null && val !== undefined) {
      if (Array.isArray(val)) {
        val.forEach(v => fd.append(`${key}[]`, v));
      } else if (typeof val === 'boolean') {
        fd.append(key, val ? 1 : 0);
      } else {
        fd.append(key, val);
      }
    }
  });

  if (tempImage) {
    fd.append('photo', tempImage);
  }

  // ✅ append remove_photo if user clicked Remove
  if (removePhoto) {
    fd.append('remove_photo', 1);
  }

  try {
    console.log('Sending data:', fd);
    const result = await dispatch(updateInterview(id, fd));

    if (result?.success) {
      toast.success(result.message);
      setRemovePhoto(false); // ✅ reset after save
      onCancel();
      dispatch(editInterviewById(id));
    } else if (result?.errors) {
      Object.keys(result.errors).forEach(field => {
        result.errors[field].forEach(msg => toast.error(msg));
      });
    }
  } catch (error) {
    const errorMsg = error?.response?.data?.errors
      ? JSON.stringify(error.response.data.errors)
      : error?.response?.data?.message || 'حدث خطأ غير متوقع';
    toast.error(errorMsg);
  }
};

  // ─── Image helpers ────────────────────────────────────────────────────────────

  const getDisplayImage = () => {
    if (removePhoto) return null; // ✅ if removed, show nothing
    if (tempImage) return URL.createObjectURL(tempImage);
    return interview?.photo || null;
  };

  const displayImage = getDisplayImage();

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="w-full bg-white px-6 rounded-lg mx-5 text-sm">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8 pb-4 border-b">

        {/* ✅ Image container with Remove button */}
        <div className="relative">
          <div
            className="bg-purple-300 w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer hover:bg-purple-400 duration-200 relative overflow-hidden"
            onClick={() => setIsImageUploadOpen(true)}
          >
            {displayImage ? (
              <>
                <img className="w-full h-full rounded object-cover" src={displayImage} alt="Event" />
                <span className="w-full h-full absolute top-0 left-0 flex justify-center items-center group">
                  <span className="group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800" />
                  <IoIosCamera className="absolute text-white text-2xl opacity-0 group-hover:opacity-100" />
                </span>
              </>
            ) : (
              <IoIosCamera className="w-6 h-6 text-white" />
            )}
          </div>

          {/* ✅ Remove button - only show when there's a photo */}
          {displayImage && (
            <button
              onClick={handleRemovePhoto}
              type="button"
              className="absolute -top-3 -right-3 flex items-center gap-1 bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 rounded-full px-2 py-1 shadow-sm transition-all duration-200 z-10 group"
              title="Remove photo"
            >
              <Trash2 size={10} className="text-red-400 group-hover:text-red-500 transition-colors duration-200" />
              <span className="text-xs text-red-400 group-hover:text-red-500 font-medium transition-colors duration-200 leading-none">Remove</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="text-lg font-medium">Edit Interview Details</h2>
          <p className="text-gray-600">{formData.type}</p>
        </div>
      </div>

      {/* Form Fields */}
      <InterviewDetailsEditFields
        formData={formData}
        errors={errors}
        loading={loading}
        isResourceType={isResourceType}
        isCollectiveType={isCollectiveType}
        currencyOptions={currencyOptions}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleExtraModeChange={handleExtraModeChange}
        handelUpdateInterview={handelUpdateInterview}
        onCancel={onCancel}
      />

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