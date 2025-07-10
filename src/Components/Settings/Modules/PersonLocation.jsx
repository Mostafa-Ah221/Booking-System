import React, { useState } from 'react';

const PersonLocation = () => {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [formData, setFormData] = useState({
    workspace: '',
    name: '',
    details: ''
  });
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFormData({
      workspace: 'Ahmed',
      name: '',
      details: ''
    });
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddLocation = () => {
    const newLocation = {
      id: Date.now(),
      workspace: formData.workspace,
      name: formData.name,
      details: formData.details
    };
    
    setLocations(prev => [...prev, newLocation]);
    setIsModalOpen(false);
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      {/* Trial notification */}
      <div className="bg-red-100 py-2 px-4 mb-4 text-right text-sm">
        Your trial ends in 1 days. 
        <a href="#" className="text-blue-600 mx-2">Extend your Trial</a>
        <a href="#" className="text-blue-600 underline">Upgrade now</a>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-medium">In-person Locations</h1>
        <div className="relative">
          <select 
            className="border rounded-md px-4 py-2 w-48 bg-white"
            value={selectedWorkspace || ''}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
          >
            <option value="">Select Workspace</option>
            <option value="ahmed">Ahmed</option>
          </select>
        </div>
      </div>
      
      {/* Content */}
      {locations.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-600" viewBox="0 0 24 24" fill="none">
                  <path d="M12 11.5L12 11.51M12 21.25L17.75 15.5C21.5 11.75 21.5 5.5 17.75 2.75C14 0 7.75 0 4 3.75C0.25 7.5 0.25 13.75 4 16.5L9.75 22.25C10.75 23.25 13.25 23.25 14.25 22.25" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="11.5" r="2.5" fill="#EC4899"/>
                </svg>
              </div>
              <span className="absolute top-0 right-0 text-pink-500 text-lg">+</span>
              <span className="absolute top-1/4 right-1/4 text-pink-500 text-lg">+</span>
              <span className="absolute bottom-1/4 left-1/4 text-pink-500 text-lg">+</span>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No in-person locations added.</h3>
          <p className="text-gray-600 mb-6">
            Add in-person locations to specify a meeting location for your appointments.
          </p>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md inline-flex items-center"
            onClick={handleOpenModal}
          >
            <span className="mr-2">+</span>
            New In-person Location
          </button>
        </div>
      ) : (
        <div>
          {/* List of locations would go here */}
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md inline-flex items-center mt-4"
            onClick={handleOpenModal}
          >
            <span className="mr-2">+</span>
            New In-person Location
          </button>
        </div>
      )}
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Edit In-person Location</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <span className="text-xl">×</span>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm">
                Workspace <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  name="workspace"
                  value={formData.workspace}
                  onChange={handleInputChange}
                >
                  <option value="Ahmed">
                    <span className="bg-red-100 text-xs px-2 py-1 rounded mr-2">All</span>
                    Ahmed
                  </option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm">
                In-person Location Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                className="w-full border rounded-md px-3 py-2"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="mb-2">
              <label className="block mb-1 text-sm">
                In-person Location Details
              </label>
              <textarea 
                className="w-full border rounded-md px-3 py-2 min-h-24"
                placeholder="Provide details on how to reach this location."
                name="details"
                value={formData.details}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum of 500 characters</p>
            </div>
            
            <div className="flex mt-6">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-md mr-2"
                onClick={handleAddLocation}
              >
                Add
              </button>
              <button
                className="border px-4 py-2 rounded-md"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonLocation;