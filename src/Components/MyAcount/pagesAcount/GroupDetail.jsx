import React, { useState } from 'react';
import { Edit, Star, Trash, X, Camera, Search } from 'lucide-react';

const GroupDetail = ({ group, onClose, onDelete, onUpdate, onStarToggle }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [editName, setEditName] = useState(group?.name || '');
  const [editDescription, setEditDescription] = useState(group?.description || '');
  
  if (!group) return null;

  const handleInvite = () => {
    // Handle invite logic here
    setShowInviteForm(false);
    setInviteEmail('');
  };

  const handleUpdate = () => {
    onUpdate(group.id, {
      name: editName,
      description: editDescription
    });
    setShowEditForm(false);
  };

  const handleDelete = () => {
    onDelete(group.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            {!showEditForm && !showDeleteConfirm && (
              <>
                {group.avatar ? (
                  <img src={group.avatar} alt={group.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {group.hasPhoto ? (
                      <Camera size={24} className="text-gray-600" />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                )}
                <h2 className="text-xl font-semibold">{group.name}</h2>
              </>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="p-6 bg-gray-50">
            <p className="text-lg mb-6">Delete the group {group.name} from your Appoint Roll account?</p>
            <div className="flex space-x-2">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={handleDelete}
              >
                Continue
              </button>
              <button 
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Invite Form */}
        {showInviteForm && (
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Members to be invited</h3>
            <input
              type="text"
              className="w-full border border-green-500 rounded-md p-3 mb-4 focus:outline-none"
              placeholder="Enter the email address of your members(Separate multiple emails with a comma.)"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <div className="flex space-x-2">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={handleInvite}
              >
                Invite
              </button>
              <button 
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={() => setShowInviteForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && (
          <div className="p-6 bg-gray-50">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Group Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500"
                rows="4"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex space-x-2">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button 
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!showEditForm && !showDeleteConfirm && !showInviteForm && (
          <div className="flex justify-center space-x-2 p-4 border-b">
            <button 
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
              onClick={() => setShowEditForm(true)}
            >
              <Edit size={20} />
            </button>
            <button 
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
              onClick={() => onStarToggle(group.id)}
            >
              <Star size={20} fill={group.starred ? "#FFFFFF" : "none"} />
            </button>
            <button 
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash size={20} />
            </button>
          </div>
        )}

        {/* Tabs and Content */}
        {!showEditForm && !showDeleteConfirm && !showInviteForm && (
          <>
            <div className="flex border-b">
              <button
                className={`px-4 py-3 font-medium ${
                  activeTab === 'members' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('members')}
              >
                Members ({group.members?.length || 1})
              </button>
              <button
                className={`px-4 py-3 font-medium ${
                  activeTab === 'pending' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Invitations ({group.pendingInvitations?.length || 1})
              </button>
              <div className="ml-auto px-4 py-2 flex items-center">
                <Search size={18} className="text-gray-500" />
                <span className="ml-1 text-gray-500">Search</span>
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 mb-2">ADMIN</div>
              <div className="flex items-center space-x-3 p-2">
                <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white">
                  P
                </div>
                <div>
                  <div className="font-medium">مصطفى احمد</div>
                  <div className="text-sm text-gray-500">mostafahmed1101997@gmail.com</div>
                </div>
              </div>
            </div>

            {/* Add Member Button */}
            <div className="p-4 border-t">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => setShowInviteForm(true)}>
                Add Members
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;