import React, { useState } from 'react';
import ResourceDetails from './ResourceDetails';

const ResourcesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources] = useState([
    { id: 1, title: 'test', initials: 'TE' }
  ]);
  const [selectedResource, setSelectedResource] = useState(null);

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header - أكثر مرونة للموبايل */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="text-lg font-medium">Resources</div>
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            {resources.length}
          </span>
        </div>
        
        {/* Search Input - عرض كامل على الموبايل */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="w-4 h-4 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search Resource"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Resources Grid - تحسين للموبايل */}
      {!selectedResource ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredResources.map(resource => (
            <div 
              key={resource.id}
              className="p-3 sm:p-4 bg-white border rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleResourceClick(resource)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm sm:text-base">
                      {resource.initials}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {resource.title}
                  </span>
                </div>
                <button 
                  className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 text-xs sm:text-sm rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span className="hidden xs:inline">Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ResourceDetails 
          resource={selectedResource} 
          onBack={() => setSelectedResource(null)} 
        />
      )}
    </div>
  );
};

export default ResourcesSection;