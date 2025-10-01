import React from 'react';
import { useSelector } from 'react-redux';

const PermissionsLoader = ({ children }) => {
  const { loading } = useSelector((state) => state.permissions);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل الصلاحيات...</p>
          <p className="text-gray-400 text-sm mt-2">يرجى الانتظار قليلاً</p>
        </div>
      </div>
    );
  }
    
  return children;
};

export default PermissionsLoader;