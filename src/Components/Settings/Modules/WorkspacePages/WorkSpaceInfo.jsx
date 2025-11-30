import React, { useState } from 'react';

const WorkSpaceInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    prefix: 'AH',
    maxDigits: '5',
    isRegistered: true,
    fields: [
      { id: 1, name: 'Name', required: true },
      { id: 2, name: 'Email', required: true },
      { id: 3, name: 'Contact Number', required: true }
    ]
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const DisplayView = () => (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Auto-generate Booking ID</h3>
          <button 
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 text-sm border rounded-md flex items-center gap-2 hover:bg-gray-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
            </svg>
            Edit
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-600">Set Prefix</p>
              <p className="mt-1">{formData.prefix}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Maximum Digits Allowed</p>
              <p className="mt-1">{formData.maxDigits}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Registered User</h3>
          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-not-allowed">
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.isRegistered}
                disabled
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                formData.isRegistered ? 'bg-indigo-600' : 'bg-gray-200'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                  formData.isRegistered ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
            </label>
            <button className="px-3 py-1.5 text-sm border rounded-md text-indigo-600 border-indigo-600 hover:bg-indigo-50">
              + Add Field
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium mb-4">Fields</p>
          <div className="space-y-4">
            {formData.fields.map(field => (
              <div key={field.id} className="flex items-center gap-2">
                <span className="w-4 h-4 text-gray-400">::</span>
                <span className="text-blue-600 truncate  max-w-[150px]">{field.name}</span>
                {field.required && <span className="text-red-500">*</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const EditView = () => (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Auto-generate Booking ID</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">
                Set Prefix
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.prefix}
                onChange={(e) => setFormData({...formData, prefix: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">
                Maximum Digits Allowed
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.maxDigits}
                onChange={(e) => setFormData({...formData, maxDigits: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full  mx-auto">
      {isEditing ? <EditView /> : <DisplayView />}
    </div>
  );
};

export default WorkSpaceInfo;