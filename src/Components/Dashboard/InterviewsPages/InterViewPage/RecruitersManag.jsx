import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer - Full height on mobile, fixed width on larger screens */}
      <div className="fixed inset-y-0 right-0 flex max-w-full sm:pl-16">
        <div className="w-screen max-w-full sm:max-w-md transform transition-transform duration-300 ease-in-out">
          <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex flex-col h-full p-4 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruitersManag = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recruiters, setRecruiters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <div className="w-16 h-16 mb-4">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="8" width="40" height="48" rx="4" stroke="#6B7280" strokeWidth="2"/>
          <path d="M24 24H40" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          <path d="M24 32H40" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          <path d="M24 40H32" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 text-center">Uh-oh! No Recruiters yet.</h3>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto h-full bg-white rounded-lg shadow-sm border">
      {/* Main List View */}
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium">Assigned Recruiters</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">
              {recruiters.length}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 text-sm text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-1" />
              Assign Recruiters
            </button>
          </div>
        </div>

        {/* Recruiters List */}
        <div className="space-y-2">
          {recruiters.length > 0 ? (
            recruiters.map((recruiter) => (
              <div
                key={recruiter.id}
                className="flex items-center p-3 sm:p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {recruiter.avatar ? (
                    <img
                      src={recruiter.avatar}
                      alt={recruiter.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">{recruiter.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium truncate">{recruiter.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{recruiter.email}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Side Drawer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Assign Recruiters</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <EmptyState />
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-8 flex justify-start items-center space-x-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Assign
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button> 
        </div>
      </Modal>
    </div>
  );
};

export default RecruitersManag;