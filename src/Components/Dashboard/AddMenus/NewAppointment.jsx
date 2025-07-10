import React, { useState } from 'react';
import { X, Building2, UserRound, Users, Calendar, User } from 'lucide-react';

const NewAppointment = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40  z-20"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">New Appointment</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 space-y-4">
          {/* Workspace */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Workspace
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-lg p-3 cursor-pointer hover:border-gray-400">
                <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-500">Select Workspace</span>
              </div>
            </div>
          </div>

          {/* Interviews */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Interviews
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-lg p-3 cursor-pointer hover:border-gray-400">
                <UserRound className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-500">Select Interview</span>
              </div>
            </div>
          </div>

          {/* Recruiter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Recruiter
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-lg p-3 cursor-pointer hover:border-gray-400">
                <Users className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-500">Random Recruiter</span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-lg p-3 cursor-pointer hover:border-gray-400">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-500">Select Date & Time</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-lg p-3 cursor-pointer hover:border-gray-400">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-500">Select Customer</span>
              </div>
            </div>
          </div>

          {/* Notifications Checkbox */}
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="notifications"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <label 
              htmlFor="notifications" 
              className="text-sm text-gray-700"
            >
              Send notifications for customer
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button 
            className="w-full bg-indigo-400 hover:bg-indigo-500 text-white py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Add Appointment
          </button>
        </div>
      </div>
    </>
  );
};

export default NewAppointment;