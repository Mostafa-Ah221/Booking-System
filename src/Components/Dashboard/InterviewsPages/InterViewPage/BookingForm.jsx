import React, { useState } from 'react';
import { GripVertical, Plus, Edit2 } from 'lucide-react';

const BookingForm = () => {
  const [termsEnabled, setTermsEnabled] = useState(false);
  
  const formFields = [
    { id: 'name', label: 'Name', required: true },
    { id: 'email', label: 'Email', required: true },
    { id: 'invite', label: 'Invite Guest(s)', required: false },
    { id: 'contact', label: 'Contact Number', required: true },
    { id: 'test', label: 'test', required: false },
  ];

  const FormField = ({ field }) => (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg group">
      <GripVertical className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 cursor-move" />
      <div className="flex-1 ml-2">
        <div className="flex items-center">
          <span className="text-gray-700">{field.label}</span>
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className=" mx-auto bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
          <h2 className="text-lg font-medium">Booking Form</h2>
        </div>
        <button className="flex items-center px-3 py-1.5 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50">
          <Plus className="w-4 h-4 mr-1" />
          Add Field
        </button>
      </div>

      {/* Form Fields */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Fields</h3>
        <div className="space-y-1">
          {formFields.map((field) => (
            <FormField key={field.id} field={field} />
          ))}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-700">Terms and Conditions</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={termsEnabled}
              onChange={() => setTermsEnabled(!termsEnabled)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Booking Confirmation Button */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Free Appointment</h3>
              <p className="text-sm text-gray-500">Schedule Appointment</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Paid Appointment</h3>
              <p className="text-sm text-gray-500">Pay and Schedule Appointment</p>
            </div>
          </div>
          <button className="flex items-center px-3 py-1.5 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50">
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;