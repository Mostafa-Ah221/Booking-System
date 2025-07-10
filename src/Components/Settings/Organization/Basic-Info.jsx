import React, { useState } from 'react';
import { Edit, Building2 } from 'lucide-react';

const BasicInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: 'Ahmed',
    email: '',
    contactNumber: '',
    timeZone: 'Africa/Cairo - EET (+02:00)',
    currency: 'EGP',
    startOfWeek: 'Monday',
    timeFormat: '12 Hours',
    branding: 'Enabled'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  if (isEditing) {
    return (
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-lg font-medium">Ahmed</span>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Contact Number</label>
              <div className="flex">
                <select className="px-2 py-2 border rounded-l-md border-r-0 bg-gray-50 focus:outline-none">
                  <option value="+20">🇪🇬 +20</option>
                </select>
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Time Zone</label>
              <select
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Africa/Cairo - EET (+02:00)">Africa/Cairo - EET (+02:00)</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="EGP">EGP</option>
              </select>
            </div>

            {/* Start of the Week */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Start of the Week</label>
              <select
                name="startOfWeek"
                value={formData.startOfWeek}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Monday">Monday</option>
              </select>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Time Format</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="timeFormat"
                    value="12 Hours"
                    checked={formData.timeFormat === '12 Hours'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  12 Hours
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="timeFormat"
                    value="24 Hours"
                    checked={formData.timeFormat === '24 Hours'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  24 Hours
                </label>
              </div>
            </div>

            {/* Zoho Bookings Branding */}
            <div>
              <div className="flex items-center gap-2">
                <label className="block text-sm text-gray-500">Zoho Bookings Branding</label>
                <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">?</span>
              </div>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  className={`px-4 py-1 rounded-md ${formData.branding === 'Enabled' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-500'}`}
                  onClick={() => setFormData(prev => ({ ...prev, branding: 'Enabled' }))}
                >
                  Enabled
                </button>
                <button
                  type="button"
                  className={`px-4 py-1 rounded-md ${formData.branding === 'Disabled' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-500'}`}
                  onClick={() => setFormData(prev => ({ ...prev, branding: 'Disabled' }))}
                >
                  Disabled
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  // View Mode
  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
      </div>

      {/* Profile Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-500" />
          </div>
          <span className="text-lg font-medium">Ahmed</span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-indigo-600 px-3 py-1 rounded-md border border-indigo-600"
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm">Edit</span>
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Business Name</label>
          <p className="text-gray-700">{formData.businessName}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <p className="text-gray-700">{formData.email || '-'}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Contact Number</label>
          <p className="text-gray-700">{formData.contactNumber || '-'}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Time Zone</label>
          <p className="text-gray-700">{formData.timeZone}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Currency</label>
          <p className="text-gray-700">{formData.currency}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Start of the Week</label>
          <p className="text-gray-700">{formData.startOfWeek}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Time Format</label>
          <p className="text-gray-700">{formData.timeFormat}</p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <label className="block text-sm text-gray-500">Zoho Bookings Branding</label>
            <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">?</span>
          </div>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm mt-1">
            {formData.branding}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;