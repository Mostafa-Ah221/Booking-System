import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function ExportData() {
  const [fileName, setFileName] = useState('ZohoBookings - 17 Mar 2025');
  const [dateRange, setDateRange] = useState('17-Mar-2025 to 17-Mar-2025');
  const [fileFormat, setFileFormat] = useState('CSV');
  const [includeCustomColumns, setIncludeCustomColumns] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl">
      {/* Form Title */}
      <div className="border-l-4 border-indigo-600 pl-4 mb-8">
        <h2 className="text-xl font-medium text-gray-800">Export Data</h2>
      </div>
      
      {/* First Row of Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Module */}
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
            Module <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="module"
              className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue="Appointments"
            >
              <option value="Appointments">Appointments</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* File Name */}
        <div>
          <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
            File Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fileName"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
      </div>
      
      {/* Second Row of Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Date Range */}
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="dateRange"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-2">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Export Format
          </label>
          <div className="flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="xlsx"
                name="fileFormat"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                checked={fileFormat === 'XLSX'}
                onChange={() => setFileFormat('XLSX')}
              />
              <label htmlFor="xlsx" className="text-gray-700">XLSX</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="csv"
                name="fileFormat"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                checked={fileFormat === 'CSV'}
                onChange={() => setFileFormat('CSV')}
              />
              <label htmlFor="csv" className="text-gray-700">CSV</label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Third Row of Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Fields */}
        <div>
          <label htmlFor="fields" className="block text-sm font-medium text-gray-700 mb-1">
            Fields <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="fields"
              className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue="selected"
            >
              <option value="selected">7 Fields Selected</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Include Custom Fields */}
        <div className="flex items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="customColumns"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={includeCustomColumns}
              onChange={(e) => setIncludeCustomColumns(e.target.checked)}
            />
            <label htmlFor="customColumns" className="ml-2 block text-sm text-gray-700">
              Include Custom Fields
            </label>
          </div>
        </div>
      </div>
      
      {/* Export Button */}
      <div>
        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Export
        </button>
      </div>
    </div>
  );
}