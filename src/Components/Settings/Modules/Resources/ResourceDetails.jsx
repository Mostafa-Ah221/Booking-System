import React, { useState } from 'react';
import ResourceAvailability from './ResourceAvailability';
import AssignedResource from './AssignedResource';

const ResourceDetails = ({ resource, onBack }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    resourceName: resource?.title || 'test',
    status: 'Active',
    userInCharge: '',
    workspace: '1 workspace selected',
    description: 'hhh'
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const Header = () => (
    <div className="border-b">
      <div className="flex items-center justify-between p-3 sm:p-4">
        {/* زر الرجوع للخلف على الموبايل */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack} 
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-medium">{formData.resourceName}</span>
        </div>
      </div>
      
      <div className="flex overflow-x-auto whitespace-nowrap px-3 sm:px-4 gap-4 sm:gap-6">
        <button 
          onClick={() => setActiveTab('basic')} 
          className={`pb-2 text-sm sm:text-base ${activeTab === 'basic' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Basic Information
        </button>
        <button 
          onClick={() => setActiveTab('assigned')} 
          className={`pb-2 text-sm sm:text-base ${activeTab === 'assigned' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Assigned Interviews
        </button>
        <button 
          onClick={() => setActiveTab('availability')} 
          className={`pb-2 text-sm sm:text-base ${activeTab === 'availability' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Availability
        </button>
      </div>
    </div>
  );

  const DisplayView = () => (
    <div className="mt-4 px-3 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="w-full sm:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Resource Name</p>
              <p className="text-sm sm:text-base">{formData.resourceName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm bg-green-100 text-green-800">
                {formData.status}
              </span>
            </div>
            
            <div className="col-span-1 sm:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-sm sm:text-base">{formData.description}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="px-3 py-1.5 text-sm border rounded-md flex items-center gap-2 hover:bg-gray-50 self-start"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
          </svg>
          Edit
        </button>
      </div>
    </div>
  );

  const EditView = () => (
    <div className="p-3 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Resource Name *</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
            value={formData.resourceName}
            onChange={(e) => setFormData({...formData, resourceName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <div className="flex gap-2 sm:gap-4 mt-1">
            <button 
              className={`px-2 sm:px-4 py-2 border rounded-md text-sm ${formData.status === 'Active' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`} 
              onClick={() => setFormData({...formData, status: 'Active'})}
            >
              Active
            </button>
            <button 
              className={`px-2 sm:px-4 py-2 border rounded-md text-sm ${formData.status === 'Inactive' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`} 
              onClick={() => setFormData({...formData, status: 'Inactive'})}
            >
              Inactive
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">User in Charge</label>
          <select
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
            value={formData.userInCharge}
            onChange={(e) => setFormData({...formData, userInCharge: e.target.value})}
          >
            <option value="">Select</option>
            <option value="Ahmed">Ahmed</option>
            <option value="Sara">Sara</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Workspace</label>
          <p className="mt-1 text-sm">{formData.workspace}</p>
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 sm:gap-4 mt-6">
        <button 
          onClick={() => setIsEditing(false)} 
          className="px-3 sm:px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          className="px-3 sm:px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto border rounded-lg bg-white">
      <Header />
      {activeTab === 'basic' && (isEditing ? <EditView /> : <DisplayView />)}
      {activeTab === 'assigned' && <AssignedResource />}
      {activeTab === 'availability' && <ResourceAvailability />}
    </div>
  );
};

export default ResourceDetails;