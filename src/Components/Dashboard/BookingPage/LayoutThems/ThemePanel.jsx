import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Upload } from 'lucide-react';

const ThemePanel = ({ onLayoutChange, onColorChange, onHeaderChange, onPagePropertiesChange }) => {
  const [openSection, setOpenSection] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState('default');
  const [selectedColor, setSelectedColor] = useState('bg-indigo-600');
  const [header, setHeader] = useState({ title: 'Ahmed', logo: null });
  const [pageProperties, setPageProperties] = useState({
    title: 'Welcome!',
    description: 'Book your appointment in a few simple steps...',
    language: 'Based on customer location',
  });

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const colorOptions = [
    'bg-indigo-600', 'bg-red-500', 'bg-purple-500', 'bg-blue-400', 
    'bg-emerald-500', 'bg-purple-700', 'bg-pink-700', 'bg-blue-700',
    'bg-green-600', 'bg-orange-600', 'bg-orange-500'
  ];

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    onLayoutChange(layout);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handleHeaderChange = (field, value) => {
    const updatedHeader = { ...header, [field]: value };
    setHeader(updatedHeader);
    onHeaderChange(updatedHeader);
  };

  const handlePagePropertiesChange = (field, value) => {
    const updatedPageProperties = { ...pageProperties, [field]: value };
    setPageProperties(updatedPageProperties);
    onPagePropertiesChange(updatedPageProperties);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleHeaderChange('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full max-w-md bg-white rounded-lg shadow">
      {/* Theme Section */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('theme')}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <span className="font-medium">Theme</span>
          {openSection === 'theme' ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {openSection === 'theme' && (
          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Layouts</h3>
              <div className="flex gap-4">
                <div 
                  onClick={() => handleLayoutChange('sleek')}
                  className={`border-2 rounded-lg p-2 bg-white cursor-pointer ${
                    selectedLayout === 'sleek' ? 'border-indigo-600' : 'border-gray-200'
                  }`}
                >
                  <div className="w-24 h-24 bg-gray-100 rounded relative">
                    {selectedLayout === 'sleek' && (
                      <div className="absolute bottom-2 right-2">
                        <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-center">Sleek</p>
                </div>

                <div 
                  onClick={() => handleLayoutChange('default')}
                  className={`border-2 rounded-lg p-2 bg-white cursor-pointer ${
                    selectedLayout === 'default' ? 'border-indigo-600' : 'border-gray-200'
                  }`}
                >
                  <div className="w-24 h-24 bg-gray-100 rounded relative">
                    {selectedLayout === 'default' && (
                      <div className="absolute bottom-2 right-2">
                        <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-center">Default</p>
                </div>
              </div>
            </div>
            
            {selectedLayout === 'sleek' && (
              <div>
                <h3 className="text-sm font-medium mb-2">Color Options</h3>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-full ${color} ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-indigo-600' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
              Save
            </button>
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('header')}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <span className="font-medium">Header</span>
          {openSection === 'header' ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {openSection === 'header' && (
          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <div className="relative">
                <input
                  type="text"
                  value={header.title}
                  onChange={(e) => handleHeaderChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <Eye className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Logo</label>
              <div className="border rounded-md px-3 py-2 flex justify-between items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <span className="text-gray-500">Upload Logo</span>
                </label>
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
              Save
            </button>
          </div>
        )}
      </div>

      {/* Page Properties Section */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('properties')}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <span className="font-medium">Page Properties</span>
          {openSection === 'properties' ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {openSection === 'properties' && (
          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <div className="relative">
                <input
                  type="text"
                  value={pageProperties.title}
                  onChange={(e) => handlePagePropertiesChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <Eye className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <div className="relative">
                <input
                  type="text"
                  value={pageProperties.description}
                  onChange={(e) => handlePagePropertiesChange('description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <Eye className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Language</label>
              <select 
                value={pageProperties.language}
                onChange={(e) => handlePagePropertiesChange('language', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option>Based on customer location</option>
              </select>
            </div>
            
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemePanel;