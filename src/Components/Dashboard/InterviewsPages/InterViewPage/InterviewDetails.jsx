import React, { useState, useEffect } from 'react'; 
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewById, updateInterview } from '../../../../redux/apiCalls/interviewCallApi';
import { getWorkspace } from '../../../../redux/apiCalls/workspaceCallApi';
import { IoIosCamera } from "react-icons/io";
import ImageUploadCrop from './ImageUploadCrop';

const InterviewDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null); // الصورة الجديدة
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    work_space_id: 1,
    duration_cycle: "",
    duration_period: "",
    price: 0,
    currency: "",
    mode: "",
    photo: null
  });
  
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
        work_space_id: interview.work_space_id || 1,
        duration_cycle: interview.duration_cycle || "",
        duration_period: interview.duration_period || "",
        price: interview.price || 0,
        currency: interview.currency || "",
        mode: interview.mode || "",
        photo: interview.photo || null
      });
      setTempImage(null); // مهم: reset tempImage لما نجيب بيانات جديدة
    }
  }, [interview]);

  // ✅ تحديث handleInputChange ليتعامل مع الصورة صح
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "photo" && files[0]) {
      // لو اختار صورة من file input، حطها في tempImage
      setTempImage(files[0]);
      console.log("تم اختيار صورة جديدة من file input:", files[0]);
    } else {
      // باقي الحقول العادية
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ✅ استقبال الصورة من ImageUploadCrop
  const handleImageUpdate = (imageFile) => {
    setTempImage(imageFile);
    setIsImageUploadOpen(false);
    console.log("تم تحديث الصورة من ImageUploadCrop:", imageFile);
  };

  const validateForm = () => {
    if (!formData.name) {
      alert("Event Type Name is required");
      return false;
    }
    return true;
  };

  const handelUpdateInterview = async () => {
    if (!validateForm()) {
      return;
    }
  
    // ✅ تحضير البيانات كـ object عادي
    const dataToSend = {
      name: formData.name,
      type: formData.type,
      work_space_id: formData.work_space_id,
      duration_cycle: formData.duration_cycle,
      duration_period: formData.duration_period,
      price: formData.price,
      currency: formData.currency,
      mode: formData.mode,
    };
  
    // ✅ إضافة الصورة إذا كانت موجودة
    if (tempImage) {
      dataToSend.photo = tempImage;
      console.log("تم إضافة الصورة الجديدة للإرسال:", tempImage);
    }
    
    console.log("البيانات اللي هتتبعت:", dataToSend);
  
    try {
      const result = await dispatch(updateInterview(id, dataToSend));
  
      if (result?.success) {
        alert(result.message);
        handleCancelClick();
        dispatch(editInterviewById(id));
      } else if (result) {
        alert(result.message);
      }
    } catch (error) {
      console.error("فشل في إرسال البيانات:", error);
      if (error?.response?.data?.errors) {
        console.error(error.response.data.errors);
        alert("الأخطاء: " + JSON.stringify(error.response.data.errors));
      } else {
        alert(error?.response?.data?.message || "حدث خطأ أثناء حفظ التعديلات");
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTempImage(null); // reset الصورة المؤقتة
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setTempImage(null); // reset الصورة المؤقتة
  };

  const handleImageClick = () => {
    if (isEditing) {
      setIsImageUploadOpen(true);
    }
  };

  // ✅ عرض الصورة المناسبة
  const getDisplayImage = () => {
    if (tempImage) {
      // لو في صورة جديدة، اعرضها
      return URL.createObjectURL(tempImage);
    }
    // لو مافيش صورة جديدة، اعرض الصورة الأصلية
    return interview?.photo;
  };

  const displayImage = getDisplayImage();

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Interview Details</h2>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {/* Event Image */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Event Image</label>
              <div 
                className="cursor-pointer relative w-24 h-24 bg-indigo-100 rounded-xl flex items-center justify-center mr-2 text-indigo-700 font-bold shadow-sm overflow-hidden"
                onClick={handleImageClick}
              >
                {displayImage ? (
                  <>
                    <img className='w-full h-full rounded-xl object-cover' src={displayImage} alt="Event" />
                    <span className='w-full h-full absolute top-0 left-0 flex justify-between items-center group'>
                      <span className='group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800'></span>
                      <IoIosCamera className='absolute text-white text-2xl w-full opacity-0 group-hover:opacity-100'/>
                    </span>
                  </>
                ) : (
                  <div className="text-sm">No Image</div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Click to change image</p>
              
            </div>

         

            {/* Event Type Name and Workspace */}
            <div className='flex space-x-2'>
              <div className="relative flex-1"> 
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Event Type Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="relative flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Work Space</label>
                <select 
                  name="work_space_id"
                  value={formData.work_space_id || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none"
                >
                  <option value="">Select Work Space</option>
                  {workspaces?.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <select 
                    name="duration_cycle"
                    value={formData.duration_cycle}
                    onChange={handleInputChange}
                    className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>{i} Hours</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <select 
                    name="duration_period"
                    value={formData.duration_period}
                    onChange={handleInputChange}
                    className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <select 
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Currency</option>
                    <option value="$">$</option>
                    <option value="€">€</option>
                  </select>
                </div>
                <div className="flex-1">
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter Price" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
              </div>
            </div>
            
            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mode</label>
              <select 
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none"
              >
                <option value="">Select Mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={handelUpdateInterview}
                disabled={loading}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Updating...' : 'Save'}
              </button>
              <button 
                onClick={handleCancelClick}
                className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Interview Details</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div 
              className="cursor-pointer relative w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-2 text-indigo-700 font-bold shadow-sm overflow-hidden"
              onClick={handleImageClick}
            >
              {interview?.photo ? (
                <>
                  <img className='w-full h-full rounded-xl object-cover' src={interview.photo} alt="" />
                  <span className='w-full h-full absolute top-0 left-0 flex justify-between items-center group'>
                    <span className='group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800 '></span>
                    <IoIosCamera className='absolute text-white text-2xl w-full opacity-0 group-hover:opacity-100'/>
                  </span>
                </>
              ) : (
                <div className="text-sm">No Image</div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">{interview?.name}</h3>
              <p className="text-sm text-gray-500">{interview?.type}</p>
            </div>
          </div>
          <button 
            onClick={handleEditClick}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-indigo-600 rounded-md flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Event Type Name</h4>
            <p className="text-gray-800 font-medium">{interview?.name || "Not specified"}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Duration</h4>
            <p className="text-gray-800 font-medium">
              {interview?.duration_cycle ? `${interview.duration_cycle} ${interview.duration_period}` : "Not specified"}
            </p>
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
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;