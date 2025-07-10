import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const SpecialWorking = ({ isOpen, onClose }) => {
  const [type, setType] = useState('Business');
  const [isAllDay, setIsAllDay] = useState(false);
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState('13-Feb-2025');
  const [toDate, setToDate] = useState('13-Feb-2025');

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  // إغلاق النافذة عند الضغط على الخلفية
  const handleOverlayClick = (e) => {
    if (e.target.id === 'overlay') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="overlay"
      className="fixed inset-0 bg-black/30 flex items-center justify-end z-50"
      onClick={handleOverlayClick} // إغلاق عند الضغط على الخلفية
    >
      <div
        className={`bg-white h-full w-96 max-w-full shadow-lg p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold">Add Special Working Hours</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Unavailability Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Add Special Time For
            </label>
            <div className="flex space-x-4">
              {['Business', 'Recruiter', 'Resource'].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    value={option}
                    checked={type === option}
                    onChange={(e) => setType(e.target.value)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* All Day Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="allDay" className="text-sm text-gray-700">
              All day
            </label>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                From
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border rounded-lg p-3 pr-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {/* <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" /> */}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                To
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border rounded-lg p-3 pr-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {/* <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" /> */}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={50}
                rows={4}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter reason..."
              />
              <div className="text-xs text-gray-500 mt-1">
                (50 characters max)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white text-gray-700 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialWorking;
