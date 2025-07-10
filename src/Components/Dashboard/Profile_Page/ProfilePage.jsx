import React, { useState } from 'react';
import { Share, Edit, Save, X } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import Availability from './Availability';
import ShareModal from './ShareModal'; // Import the new ShareModal component

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // New state for the share modal
  
  const [profileData, setProfileData] = useState({
    name: 'مصطفي احمد',
    email: 'mostafaahmed110197@gmail.com',
    role: 'Super Admin',
    phone: '+20',
    designation: '',
    dateOfBirth: '',
    gender: '',
    status: 'Active',
    workspace: 'Ahmed',
    additionalInfo: ''
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the changes
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset any changes
    setIsEditing(false);
  };

  // Toggle share modal open/closed
  const toggleShareModal = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center">
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-xl font-semibold">Profile</h1>
            <button 
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 text-indigo-600"
              onClick={toggleShareModal} // Add onClick handler here
            >
              <Share size={18} />
              <span>Share</span>
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-6 mt-4 border-b">
            {['Details', 'Availability'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-1 border-b-2 transition-colors text-sm sm:text-base ${
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
        </div>

        {/* Profile Info */}
        {activeTab === "details" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center">
                  <CgProfile className="w-6 h-6 rounded-full text-gray-400"/>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium">{profileData.name}</h2>
                    <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {profileData.role}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{profileData.email}</p>
                </div>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Save size={18} />
                    <span>Save</span>
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Personal Information */}
             <div className="space-y-6 h-72 overflow-auto">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-sm">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-sm">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-sm">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <p className="text-sm">{profileData.role}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      placeholder="Enter designation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-sm">{profileData.designation || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  ) : (
                    <p className="text-sm">{profileData.gender || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-sm">{profileData.dateOfBirth || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-sm">{profileData.status}</p>
                  </div>
                </div>
              </div>

              {/* Workspace */}
              <div className="pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Workspace</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                    <span className="text-red-600 text-sm">AH</span>
                  </div>
                  <span className="text-sm">{profileData.workspace}</span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                {isEditing ? (
                  <textarea
                    value={profileData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="Enter additional information"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                  />
                ) : (
                  <p className="text-sm">{profileData.additionalInfo || '-'}</p>
                )}
              </div>
              </div>
          </div>
        )}

        {activeTab === "availability" && (
          <div>
            <Availability />
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />
    </div>
  );
};

export default ProfilePage;