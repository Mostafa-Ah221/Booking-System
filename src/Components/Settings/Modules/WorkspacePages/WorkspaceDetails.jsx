import React, { useState } from 'react';
import { ArrowLeft, Share, Trash2, Edit } from 'lucide-react';
import WorkSpaceInfo from './WorkSpaceInfo'; // تأكد من استيراد المكون الصحيح

const WorkspaceDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [workspaceData, setWorkspaceData] = useState({
    name: 'Ahmed',
    email: '',
    description: '',
    status: 'active'
  });
  const [tempData, setTempData] = useState(workspaceData);
  const [activeTab, setActiveTab] = useState('basic'); // حالة لتتبع التبويب النشط

  const handleBack = () => {
    // Add navigation logic here
  };

  const handleEdit = () => {
    setTempData(workspaceData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempData(workspaceData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setWorkspaceData(tempData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-medium">Ahmed</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50">
            <Share className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="text-red-500 hover:bg-red-50 p-2 rounded-md">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-1 py-4 ${
              activeTab === 'basic'
                ? 'text-purple-600 border-b-2 border-purple-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            Basic Information
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-1 py-4 ${
              activeTab === 'preferences'
                ? 'text-purple-600 border-b-2 border-purple-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'basic' ? (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center font-medium">
                AH
              </div>
              <span className="text-lg font-medium">Ahmed</span>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">
                    Workspace Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={tempData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={tempData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={tempData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block mb-2">Status</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTempData(prev => ({ ...prev, status: 'active' }))}
                    className={`px-4 py-2 rounded-md ${
                      tempData.status === 'active'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setTempData(prev => ({ ...prev, status: 'inactive' }))}
                    className={`px-4 py-2 rounded-md ${
                      tempData.status === 'inactive'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Workspace Name
                  </label>
                  <p>{workspaceData.name}</p>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Email
                  </label>
                  <p>{workspaceData.email || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  Description
                </label>
                <p>{workspaceData.description || '-'}</p>
              </div>

              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  Status
                </label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  workspaceData.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {workspaceData.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <WorkSpaceInfo /> 
      )}
    </div>
  );
};

export default WorkspaceDetails;