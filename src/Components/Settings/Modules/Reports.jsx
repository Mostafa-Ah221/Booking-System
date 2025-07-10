import React, { useState } from 'react';
import { Search, FileBarChart, X, ChevronDown } from 'lucide-react';

const Reports = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600"></div>
          <h1 className="text-xl font-semibold">Reports</h1>
        </div>
        
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] gap-6">
        {/* Icon Container */}
        <div className="relative">
          <div className="bg-purple-100 rounded-lg p-6">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <FileBarChart className="w-6 h-6 text-purple-600" />
              </div>
              {/* X Badge */}
              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                <X className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          {/* Sparkles */}
          <div className="absolute -top-4 -right-4 text-purple-200 text-2xl">✨</div>
          <div className="absolute -bottom-2 -left-4 text-purple-200 text-2xl">✨</div>
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No reports added</h2>
          <p className="text-gray-600 max-w-md">
            Add reports to view statistics and about your bookings and overall revenue.
          </p>
        </div>

        {/* Button */}
        <button 
          onClick={() => setIsDrawerOpen(true)} 
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <span>+</span>
          <span>New Report</span>
        </button>
      </div>

      {/* Sliding Drawer */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          {/* Drawer Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add Report</h2>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Report Name"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Report Type Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">Select Report Type</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Select Report based on"
                className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Workspaces Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workspaces <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">Select Workspace</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Date Range Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">Select Date Range</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reports;