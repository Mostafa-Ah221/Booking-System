import React, { useState } from 'react';
import { Pencil } from 'lucide-react';

const CustomLabels = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    eventType: { one: 'Interview', many: 'Interviews' },
    user: { one: 'Recruiter', many: 'Recruiters' },
    resource: { one: 'Resource', many: 'Resources' }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    setIsEditing(false);
  };

  const sections = [
    {
      id: 'eventType',
      title: 'Event Type',
      one: formData.eventType.one,
      many: formData.eventType.many
    },
    {
      id: 'user',
      title: 'User',
      one: formData.user.one,
      many: formData.user.many
    },
    {
      id: 'resource',
      title: 'Resource',
      one: formData.resource.one,
      many: formData.resource.many
    }
  ];

  return (
    <div className="w-full max-w-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Custom Labels</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {!isEditing ? (
          <>
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-1">
                    {section.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">One</div>
                      <div className="text-sm text-gray-900">{section.one}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Many</div>
                      <div className="text-sm text-gray-900">{section.many}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-end gap-2 mb-6">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-1">
                    {section.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500">
                        One <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData[section.id].one}
                        onChange={(e) => handleInputChange(section.id, 'one', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500">
                        Many <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData[section.id].many}
                        onChange={(e) => handleInputChange(section.id, 'many', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomLabels;