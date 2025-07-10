import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AssignedResource = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const [interviews] = useState([
    {
      id: 1,
      initials: 'RS',
      name: 'Recruitment Strategy Meeting',
      type: 'One-on-One',
      duration: '20 mins',
      price: '£0',
      path:"/interview-layout"
    }
  ]);

  // إغلاق القائمة المنسدلة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setActiveDropdownId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id) => {
    setActiveDropdownId(activeDropdownId === id ? null : id);
    setShowDropdown(activeDropdownId !== id);
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // عرض جدول للشاشات الكبيرة
  const TableView = () => (
    <div className="hidden md:block border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              EVENT TYPE/NAME
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              TYPE
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DURATION
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              PRICE
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredInterviews.map(interview => (
            <tr key={interview.id} className="hover:bg-gray-50">
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <Link to={interview.path} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {interview.initials}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {interview.name}
                  </span>
                </Link>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {interview.type}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {interview.duration}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-900">{interview.price}</span>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700">
                    Customize price
                  </button>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative" ref={activeDropdownId === interview.id ? dropdownRef : null}>
                  <button 
                    onClick={() => toggleDropdown(interview.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14a2 2 0 100-4 2 2 0 000 4zM19 14a2 2 0 100-4 2 2 0 000 4zM5 14a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                  
                  {activeDropdownId === interview.id && showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border divide-y z-10">
                      <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // عرض بطاقات للموبايل
  const CardView = () => (
    <div className="md:hidden space-y-4">
      {filteredInterviews.map(interview => (
        <div key={interview.id} className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-start mb-3">
            <Link to={interview.path} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-medium text-sm">
                  {interview.initials}
                </span>
              </div>
              <span className="font-medium text-gray-900">
                {interview.name}
              </span>
            </Link>
            
            <div className="relative" ref={activeDropdownId === interview.id ? dropdownRef : null}>
              <button 
                onClick={() => toggleDropdown(interview.id)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14a2 2 0 100-4 2 2 0 000 4zM19 14a2 2 0 100-4 2 2 0 000 4zM5 14a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
              
              {activeDropdownId === interview.id && showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border divide-y z-10">
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <span className="text-gray-500">Type:</span> {interview.type}
            </div>
            <div>
              <span className="text-gray-500">Duration:</span> {interview.duration}
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between mt-1">
                <div>
                  <span className="text-gray-500">Price:</span> {interview.price}
                </div>
                <button className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700">
                  Customize price
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full mx-auto p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-medium flex items-center gap-2">
          Assigned Interviews
        </h2>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
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
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Assign Button */}
          <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center sm:justify-start gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Assign
          </button>
        </div>
      </div>

      {/* محتوى متغير: جدول للشاشات الكبيرة وبطاقات للموبايل */}
      <TableView />
      <CardView />
    </div>
  );
};

export default AssignedResource;