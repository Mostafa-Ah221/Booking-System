import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Plus, MoreVertical, User } from 'lucide-react';

const GroupManagement = ({ 
  availableStaff = [], 
  onComplete, 
  onBack 
}) => {
  const [groups, setGroups] = useState([]);
  const [currentStep, setCurrentStep] = useState('list'); 
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  // Check for duplicate groups
  const isDuplicateGroup = (staffIds) => {
    const sortedNew = [...staffIds].sort().join(',');
    return groups.some(group => {
      const sortedExisting = [...group.staff_ids].sort().join(',');
      return sortedExisting === sortedNew;
    });
  };

  // Navigate to staff selection
  const handleCreateGroup = () => {
    setGroupName('');
    setSelectedStaff([]);
    setCurrentStep('select');
  };

  // Toggle staff selection
  const toggleStaff = (staff) => {
    setSelectedStaff(prev => {
      const exists = prev.find(s => s.id === staff.id);
      if (exists) {
        return prev.filter(s => s.id !== staff.id);
      }
      return [...prev, staff];
    });
  };

  // Select/Deselect all
  const toggleSelectAll = () => {
    if (selectedStaff.length === filteredStaff.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(filteredStaff);
    }
  };

  // Save group
  const handleSaveGroup = () => {
    if (selectedStaff.length === 0) {
      setError('Please select at least one recruiter');
      return;
    }

    if (!groupName.trim()) {
      setError('Please enter group name');
      return;
    }

    const staffIds = selectedStaff.map(s => s.id);
    
    if (isDuplicateGroup(staffIds)) {
      setError('This group already exists with the same members');
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: groupName,
      staff: selectedStaff,
      staff_ids: staffIds
    };

    setGroups(prev => [...prev, newGroup]);
    setCurrentStep('list');
    setGroupName('');
    setSelectedStaff([]);
    setError('');
  };

  // Delete group
  const handleDeleteGroup = (groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  // Filter staff by search
  const filteredStaff = availableStaff.filter(staff =>
    staff.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Groups list page
  if (currentStep === 'list') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg my-5">
        <div className="border-l-2 border-purple-600 pl-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900">Create and Define Groups</h3>
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-semibold text-purple-600">
                      {group.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 truncate  max-w-[150px]">{group.name}</h4>
                    <p className="text-sm text-gray-500 ">Organizer</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Group Members</span>
                <div className="flex -space-x-2">
                  {group.staff.slice(0, 3).map((staff) => (
                    <div
                      key={staff.id}
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                      title={staff.name}
                    >
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  ))}
                  {group.staff.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-600">
                        +{group.staff.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleCreateGroup}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-purple-600 hover:border-purple-400 hover:bg-purple-50 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Group +
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => groups.length > 0 ? onComplete(groups) : setError('Please create at least one group')}
            disabled={groups.length === 0}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Interview
          </button>
        </div>
      </div>
    );
  }

  // Staff selection page
  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg my-5">
      <div className="border-l-2 border-purple-600 pl-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900">Create and Configure Group</h3>
      </div>

      <div className="space-y-4">
        {/* Search and Select All */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Recruiters"
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2.5 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={selectedStaff.length === filteredStaff.length && filteredStaff.length > 0}
              readOnly
              className="w-4 h-4 text-purple-600 rounded pointer-events-none"
            />
            Select All
          </button>
        </div>

        {/* Staff List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleStaff(staff)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900 truncate  max-w-[150px]">{staff.name}</span>
              </div>
              <input
                type="checkbox"
                checked={selectedStaff.some(s => s.id === staff.id)}
                readOnly
                className="w-5 h-5 text-purple-600 rounded pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Group Name Input - Shows only when staff selected */}
        {selectedStaff.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                Configure Group
              </span>
            </div>
            
            <input
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError('');
              }}
              placeholder="Group Name"
              className="w-full outline-none p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Selected Count */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
          <span>{selectedStaff.length} Recruiter(s) assigned</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={() => {
              setCurrentStep('list');
              setSelectedStaff([]);
              setGroupName('');
              setError('');
            }}
            className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveGroup}
            disabled={selectedStaff.length === 0}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;