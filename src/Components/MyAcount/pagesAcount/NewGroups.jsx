import React, { useState } from 'react';
import { Plus, Star, MoreVertical, X } from 'lucide-react';
import GroupDetail from './GroupDetail';

const NewGroups = () => {
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now(),
        name: newGroupName,
        description: newGroupDescription,
        members: newGroupMembers.split(',').filter(email => email.trim()),
        pendingInvitations: [],
        starred: false
      };
      
      setGroups([...groups, newGroup]);
      setShowCreateModal(false);
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupMembers('');
    }
  };

  const toggleStar = (id) => {
    setGroups(groups.map(group => 
      group.id === id ? {...group, starred: !group.starred} : group
    ));
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleCloseDetail = () => {
    setSelectedGroup(null);
  };

  const handleDeleteGroup = (id) => {
    setGroups(groups.filter(group => group.id !== id));
  };

  const handleUpdateGroup = (id, updatedData) => {
    setGroups(groups.map(group => 
      group.id === id ? {...group, ...updatedData} : group
    ));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Groups</h1>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Group Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
              <div className="text-gray-300">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 text-white">
              <Plus size={16} />
            </div>
          </div>
          <h2 className="text-lg font-medium mb-4">Create New Group</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
          >
            Create
          </button>
        </div>

        {/* Group Cards */}
        {groups.map(group => (
          <div 
            key={group.id} 
            className="bg-white rounded-lg shadow p-6 cursor-pointer"
            onClick={() => handleGroupClick(group)}
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(group.id);
                }}
              >
                <Star 
                  size={20} 
                  fill={group.starred ? "#FFD700" : "none"} 
                  color={group.starred ? "#FFD700" : "#E2E8F0"} 
                />
              </div>
              <div className="cursor-pointer">
                <MoreVertical size={20} color="#718096" />
              </div>
            </div>
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-lg font-medium">{group.name}</h3>
              <p className="text-sm text-gray-500">{group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}</p>
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs">
                P
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {groups.length === 0 && (
        <div className="mt-16 flex flex-col items-center">
          <div className="mb-8">
            <div className="flex justify-center space-x-2">
              <div className="w-16 h-20 bg-white rounded-lg shadow-md transform -rotate-6 relative">
                <div className="absolute top-3 left-3 w-6 h-6 bg-green-200 rounded-full"></div>
                <div className="absolute top-12 left-3 w-10 h-1 bg-gray-200 rounded"></div>
                <div className="absolute top-14 left-3 w-8 h-1 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-20 bg-white rounded-lg shadow-md z-10 relative">
                <Star size={16} fill="#FFD700" color="#FFD700" className="absolute top-2 right-2" />
                <div className="absolute top-3 left-3 w-6 h-6 bg-red-200 rounded-full"></div>
                <div className="absolute top-12 left-3 w-10 h-1 bg-gray-200 rounded"></div>
                <div className="absolute top-14 left-3 w-8 h-1 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-20 bg-white rounded-lg shadow-md transform rotate-6 relative">
                <div className="absolute top-3 left-3 w-6 h-6 bg-yellow-200 rounded-full"></div>
                <div className="absolute top-12 left-3 w-10 h-1 bg-gray-200 rounded"></div>
                <div className="absolute top-14 left-3 w-8 h-1 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-700 mb-6">
            Add a group of people and simplify email communication with them.
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
          >
            Create New Group
          </button>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Create Group</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Group Name</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Initial Members</label>
              <input
                type="text"
                value={newGroupMembers}
                onChange={(e) => setNewGroupMembers(e.target.value)}
                placeholder="Enter the email address of your members. Separate multiple emails with a comma."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreateGroup}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Detail Modal */}
      {selectedGroup && (
        <GroupDetail
          group={selectedGroup}
          onClose={handleCloseDetail}
          onDelete={handleDeleteGroup}
          onUpdate={handleUpdateGroup}
          onStarToggle={toggleStar}
        />
      )}
    </div>
  );
};

export default NewGroups;

NewGroups