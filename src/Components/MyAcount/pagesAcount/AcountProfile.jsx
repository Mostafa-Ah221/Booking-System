import React, { useState } from 'react';

const AcountProfile = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [showAddMobileModal, setShowAddMobileModal] = useState(false);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    firstName: 'مصطفى',
    lastName: 'احمد',
    displayName: 'مصطفى احمد',
    gender: "I'd prefer not to say",
    country: 'Egypt',
    language: 'English',
    timezone: '(GMT +02:00) Eastern European Standard Time (Africa/Cairo)',
    email: 'mostafaahmed1101997@gmail.com'
  });

  // Handle closing all modals
  const closeAllModals = () => {
    setShowEditForm(false);
    setShowAddEmailModal(false);
    setShowAddMobileModal(false);
  };
  
  // Main Profile View
  const ProfileView = () => (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl mr-4">
            <span>م</span>
          </div>
          <div>
            <h2 className="text-lg font-medium">{profileData.displayName}</h2>
            <p className="text-gray-600 text-sm">{profileData.email}</p>
          </div>
        </div>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
          onClick={() => setShowEditForm(true)}
        >
          Edit
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm text-gray-600 mb-1">Full Name</h3>
          <p className="text-gray-800">{profileData.displayName}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-600 mb-1">Display Name</h3>
          <p className="text-gray-800">{profileData.displayName}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-600 mb-1">Gender</h3>
          <p className="text-gray-800">{profileData.gender}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-600 mb-1">Country/Region</h3>
          <div className="flex items-center">
            <div className="mr-2 flex items-center">
              <div className="w-6 h-4 bg-red-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-1/3 bg-white"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-800">{profileData.country}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-600 mb-1">Language</h3>
          <p className="text-gray-800">{profileData.language}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-600 mb-1">Time zone</h3>
          <p className="text-gray-800 truncate">{profileData.timezone}</p>
        </div>
      </div>
    </div>
  );

  // Edit Profile Form Modal
  const EditProfileForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Profile</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowEditForm(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl mr-4">
            <span>م</span>
          </div>
          <div>
            <h2 className="text-lg font-medium">{profileData.displayName}</h2>
            <p className="text-gray-600 text-sm">{profileData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              dir="rtl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              dir="rtl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={profileData.displayName}
              onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none bg-white"
              value={profileData.gender}
              onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
            >
              <option value="I'd prefer not to say">I'd prefer not to say</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country/Region
            </label>
            <div className="relative">
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none bg-white pl-12"
                value={profileData.country}
                onChange={(e) => setProfileData({...profileData, country: e.target.value})}
              >
                <option value="Egypt">Egypt</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
              <div className="absolute left-3 top-2.5">
                <div className="w-6 h-4 bg-red-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1/3 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none bg-white"
              value={profileData.language}
              onChange={(e) => setProfileData({...profileData, language: e.target.value})}
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="French">French</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time zone
            </label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none bg-white"
              value={profileData.timezone}
              onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
            >
              <option value="(GMT +02:00) Eastern European Standard Time (Africa/Cairo)">
                (GMT +02:00) Eastern European Standard Time (Africa/Cairo)
              </option>
              <option value="(GMT +00:00) Greenwich Mean Time (GMT)">
                (GMT +00:00) Greenwich Mean Time (GMT)
              </option>
            </select>
          </div>
        </div>
        
        <div className="flex mt-6">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md mr-3"
            onClick={() => setShowEditForm(false)}
          >
            Save
          </button>
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
            onClick={() => setShowEditForm(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Add Email Modal
  const AddEmailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Email Address</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowAddEmailModal(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          A one-time password (OTP) will be sent to your email address.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter your email address
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder=""
          />
        </div>
        
        <button 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
          onClick={() => setShowAddEmailModal(false)}
        >
          Add
        </button>
      </div>
    </div>
  );

  // Add Mobile Number Modal
  const AddMobileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Mobile Number</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowAddMobileModal(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          A one-time password (OTP) will be sent to your mobile number via SMS.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <div className="flex">
            <div className="relative">
              <select className="h-full py-2 pl-10 pr-2 border border-r-0 border-gray-300 rounded-l-md bg-white appearance-none w-24">
                <option value="+20">+20</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <div className="absolute left-2 top-2.5">
                <div className="w-6 h-4 bg-red-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1/3 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-r-md px-3 py-2"
              placeholder="123 456 7890"
            />
          </div>
        </div>
        
        <button 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
          onClick={() => setShowAddMobileModal(false)}
        >
          Add
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        
        {/* Main Profile View or Edit Form */}
        {showEditForm ? <EditProfileForm /> : <ProfileView />}
        
        {/* Email Addresses Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h2 className="text-xl font-bold mb-2">My Email Addresses</h2>
          <p className="text-gray-600 mb-6 text-sm">
            You can use the following email addresses to sign in to your account and also to reset your 
            password if you ever forget it.
          </p>
          
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800">{profileData.email}</p>
                  <p className="text-gray-500 text-sm">1 month ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 font-bold text-xl">G</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            className="text-blue-500 flex items-center"
            onClick={() => setShowAddEmailModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Email Address
          </button>
        </div>
        
        {/* Mobile Numbers Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-2">My Mobile Numbers</h2>
          <p className="text-gray-600 mb-6 text-sm">
            View and manage all of the mobile numbers associated with your account.
          </p>
          
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-24 h-24 mb-4">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="#f0f0f0" />
                <rect x="40" y="30" width="40" height="10" rx="2" fill="#e0e0e0" />
                <rect x="40" y="45" width="40" height="10" rx="2" fill="#d0d0d0" />
                <rect x="40" y="60" width="40" height="10" rx="2" fill="#e0e0e0" />
                <circle cx="30" cy="35" r="3" fill="#ff6b6b" />
                <circle cx="30" cy="50" r="3" fill="#51cf66" />
                <circle cx="30" cy="65" r="3" fill="#fcc419" />
              </svg>
            </div>
            
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md mt-4"
              onClick={() => setShowAddMobileModal(true)}
            >
              Add Mobile Number
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddEmailModal && <AddEmailModal />}
      {showAddMobileModal && <AddMobileModal />}
    </div>
  );
};

export default AcountProfile;