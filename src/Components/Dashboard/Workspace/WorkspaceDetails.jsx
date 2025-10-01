import { useEffect, useState } from 'react';
import WorkspaceAvailability from './WorkspaceFolder/WorkspaceAvailability';
import AssignWorkSpToStaff from './AssignWorkSpToStaff';



export default function WorkspaceDetails() {
  const [activeTab, setActiveTab] = useState('availability');

  
  return (
    <div className="w-full mt-7">
      <div className="border-b border-gray-200">
        <div className="flex gap-8 ml-7">
          <button
            onClick={() => setActiveTab('availability')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'availability'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Availability
          </button>
          <button
            onClick={() => setActiveTab('assignStaff')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'assignStaff'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Assign Staff
          </button>
        </div>
      </div>
      <div className="mt-6">
        {activeTab === 'availability' && (
          <div className="text-gray-700">
           <WorkspaceAvailability />
          </div>
        )}
        
        {activeTab === 'assignStaff' && (
          <div className="text-gray-700">
           <AssignWorkSpToStaff />
          </div>
        )}
      </div>
    </div>
  );
}