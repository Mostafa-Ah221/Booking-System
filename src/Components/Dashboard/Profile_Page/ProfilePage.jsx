import { useEffect, useState } from 'react';
import { Share, Edit, Save, X, Share2 } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import Availability from './Availability';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileData, updateProfileData, updateShareLink } from '../../../redux/apiCalls/ProfileCallApi';
import { IoIosCamera } from 'react-icons/io';
import ImageUploadCrop from '../InterviewsPages/InterViewPage/ImageUploadCrop';
import ShareModalProfile from './ShareModalPrpfile';
import UpdateShareLinkModal from './UpdateShareLinkModal';


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUpdateShareModalOpen, setIsUpdateShareModalOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);
  
  const dispatch = useDispatch();
  const { profile, loading = false } = useSelector(state => state.profileData);
console.log(profile?.user.share_link);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone_code: '',
    phone: '',
    password: '',
    new_password: '',
    confirm_password: '',
    photo: null
  });

  // تحسين useEffect لتجنب infinite loop
  useEffect(() => {
    if (!profile && !loading && !profileLoaded) {
      dispatch(fetchProfileData());
      setProfileLoaded(true);
    }
  }, [dispatch, profile, loading, profileLoaded]);

  // Update local state when profile data is loaded
  useEffect(() => {
    if (profile?.user) {
      const userData = profile.user;
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone_code: userData.phone_code || '',
        phone: userData.phone || '',
        password: '',
        new_password: '',
        confirm_password: '',
        photo: null
      });
      
      // Set phone value for PhoneInput component
      if (userData.phone_code && userData.phone) {
        setPhoneValue(`${userData.phone_code}${userData.phone}`);
      }
      
      // Set display image if exists
      setDisplayImage(userData.photo || null);
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
console.log(profile?.user?.status);

  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);

    setProfileData(prev => ({
      ...prev,
      phone: value.replace(`+${country.dialCode}`, ""),
      phone_code: `+${country.dialCode}`,
    }));

    // Validate phone number
    if (!value || value.length <= country.dialCode.length + 1) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(value, country.countryCode?.toUpperCase());
    
    if (!phoneNumber || !phoneNumber.isValid()) {
      setPhoneError("The phone number is invalid for this country");
    } else {
      setPhoneError("");
    }
  };

  const handleImageUpdate = (imageFile) => {
    setProfileData(prev => ({
      ...prev,
      photo: imageFile
    }));
    setDisplayImage(URL.createObjectURL(imageFile));
    setIsImageUploadOpen(false);
  };

  // دالة لفتح نافذة ImageUploadCrop
  const handleImageClick = () => {
    if (isEditing) {
      setIsImageUploadOpen(true);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== '' && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });

    try {
      await dispatch(updateProfileData(formData));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    // Reset changes back to original profile data
    if (profile?.user) {
      const userData = profile.user;
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone_code: userData.phone_code || '',
        phone: userData.phone || '',
        password: '',
        new_password: '',
        confirm_password: '',
        photo: null
      });
      
      // Reset phone value
      if (userData.phone_code && userData.phone) {
        setPhoneValue(`${userData.phone_code}${userData.phone}`);
      } else {
        setPhoneValue("");
      }
      
      // Reset display image to original
      setDisplayImage(userData.photo || null);
      setPhoneError("");
    }
    setIsEditing(false);
  };

  // Handle update share link - إضافة إعادة تحميل البيانات
  const handleUpdateShareLink = async (newShareLink) => {
    try {
      await dispatch(updateShareLink(newShareLink));
      // إعادة تحميل البيانات بعد تحديث الـ share link
      await dispatch(fetchProfileData());
      setIsUpdateShareModalOpen(false);
    } catch (error) {
      console.error('Error updating share link:', error);
    }
  };

  const renderProfileImage = () => {
    if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (displayImage) {
      return (
        <>
          <img 
            className='w-full h-full rounded-xl object-cover' 
            src={displayImage} 
            alt="Profile"
            onError={(e) => {
              setDisplayImage(null); // إزالة الصورة المكسورة وإظهار الأيقونة
            }}
          />
          {isEditing && (
            <span className='w-full h-full absolute top-0 left-0 flex justify-center items-center group'>
              <span className='group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800'></span>
              <IoIosCamera className='absolute text-white text-2xl opacity-0 group-hover:opacity-100'/>
            </span>
          )}
        </>
      );
    }

    // عرض الأيقونة عند عدم وجود صورة
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        {isEditing ? (
          <>
            <IoIosCamera className="text-3xl mb-1 text-indigo-600" />
            <div className="text-xs text-center text-indigo-600 font-medium">Add Photo</div>
          </>
        ) : (
          <CgProfile className="w-12 h-12 text-indigo-400" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full bg-white rounded-lg py-2 px-6">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          {/* Tabs */}
          <div className="flex gap-6 mt-4 border-b justify-between">
            <div className='flex gap-6'>

            {['Details', 'Availability'].map((tab) => (
              <button
                key={tab}
                className={`py-1  border-b-2 transition-colors text-sm sm:text-base ${
                  activeTab === tab.toLowerCase()
                    ? 'border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
            </div>
            <div className='flex gap-2'>

              <button 
                  className="flex items-center gap-1 text-sm mb-2 px-2 lg:px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors" 
                  title='Update Share Link'
                  onClick={() => setIsUpdateShareModalOpen(true)}
                >
                  <Share2 className="w-3 h-3" />
                   <span>Update Link</span> 
                </button>
              <button 
                  className="flex items-center gap-1 text-sm mb-2  px-4 py-1 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsShareModalOpen(true)}
                title='Share Link'>
                  <Share2 className="w-3 h-3" />
                  <span >Share</span>
                </button>
            </div>
          </div>
          
        </div>

        {/* Profile Info */}
        {activeTab === "details" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 text-sm">
              <div className="flex items-center gap-4">
                <div 
                  className={`relative w-24 h-24 bg-indigo-100 rounded-xl flex items-center justify-center mr-2 text-indigo-700 font-bold shadow-sm overflow-hidden transition-all duration-200 ${isEditing ? 'cursor-pointer hover:bg-indigo-200' : ''}`}
                  onClick={handleImageClick}
                >
                  {renderProfileImage()}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium max-w-[250px] truncate tooltip whitespace-nowrap" title={profile?.user?.name}>
                      {profile?.user?.name || 'Loading...'}
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm max-w-[300px] truncate tooltip whitespace-nowrap" title={profile?.user?.email}>
                    {profile?.user?.email || 'Loading...'}
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
                  disabled={loading}
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex gap-2 justify-end w-full">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
                    disabled={loading}
                  >
                    <Save size={18} />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors duration-200"
                    disabled={loading}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Form */}
            <div className="space-y-8 max-h-96 overflow-y-auto pr-2">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                  {/* Name Field */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    ) : (
                      <div className="py-1 rounded-lg">
                        <p className="text-gray-900">{profile?.user?.name || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter your email address"
                      />
                    ) : (
                      <div className="py-1 rounded-lg">
                        <p className="text-gray-900">{profile?.user?.email || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Contact Number
                    </label>
                    {isEditing ? (
                      <div>
                        <PhoneInput
                          country="eg"
                          value={phoneValue}
                          onChange={handlePhoneChange}
                          enableSearch={true}
                          searchPlaceholder="Search country"
                          inputProps={{
                            name: "phone",
                            className: "!pl-16 w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200",
                            placeholder: "Enter your mobile number"
                          }}
                          containerClass="w-full"
                          buttonClass="!border-r !bg-gray-50 !px-3 !py-3 !rounded-l-lg !border-gray-300"
                          dropdownClass="!bg-white !border !shadow-lg !rounded-lg !mt-1"
                          searchClass="!p-3 !border-b !border-gray-200"
                        />
                        {phoneError && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {phoneError}
                        </p>}
                      </div>
                    ) : (
                      <div className="py-1 rounded-lg">
                        <p className="text-gray-900">
                          {profile?.user?.phone_code && profile?.user?.phone 
                            ? `${profile?.user.phone_code} ${profile?.user.phone}`
                            : 'Not provided'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="block text-sm font-medium text-gray-500 mb-2">Status</h2>
                    <div
                      className={`py-1 rounded-lg w-fit ${
                        profile?.user?.status == 1 ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <p
                        className={`px-2 py-1 ${
                          profile?.user?.status == 1 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {profile?.user?.status == 1 ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>


                  {/* Current Password Field - Only show when editing */}
                  {isEditing && (
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={profileData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter current password"
                      />
                      <p className="text-xs text-gray-500 mt-1">Required only when changing password</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Section - Only show when editing */}
              {isEditing && (
                <div className="bg-red-50 p-6 rounded-lg border border-red-100 mb-2">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Enter your current password and new password if you want to change it.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={profileData.new_password}
                        onChange={(e) => handleInputChange('new_password', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="Enter new password"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={profileData.confirm_password}
                        onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "availability" && (
          <div>
            <Availability />
          </div>
        )}

        {/* ImageUploadCrop Component */}
        <ImageUploadCrop 
          isOpen={isImageUploadOpen}
          onClose={() => setIsImageUploadOpen(false)}
          onImageUpdate={handleImageUpdate}
          currentImage={displayImage}
        />
      </div>

      {/* Share Modal */}
      <ShareModalProfile
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        shareLink={profile?.user?.share_link}
        profile={profile}
      />

      {/* Update Share Link Modal */}
      <UpdateShareLinkModal
        isOpen={isUpdateShareModalOpen}
        onClose={() => setIsUpdateShareModalOpen(false)}
        onUpdateLink={handleUpdateShareLink}
        currentShareLink={profile?.user?.share_link}
        loading={loading}
      />
    </div>
  );
};

export default ProfilePage;