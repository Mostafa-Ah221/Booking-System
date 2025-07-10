import React, { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import InviteRecModal from '../../Dashboard/AddMenus/ModelsForAdd/InviteRecModal';

const Customers = () => {
  const [openForm, setOpenForm] = useState(null);

  const handleOpen = () => setOpenForm('Invite_rec_modal');
  const handleClose = () => setOpenForm(null);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600"></div>
          <h1 className="text-xl font-semibold">Customers</h1>
        </div>
        
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] gap-6">
        {/* Icon Container */}
        <div className="relative">
          <div className="bg-purple-100 rounded-lg p-6">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              {/* X Badge */}
              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                <X className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          {/* Sparkles */}
          <div className="absolute -top-4 -right-4 text-purple-200 text-2xl">✨</div>
          <div className="absolute -bottom-2 -left-4 text-purple-200 text-2xl">✨</div>
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No customers added</h2>
          <p className="text-gray-600 max-w-md">
            Add customers to book appointments with them. When customers book using your booking page, they'll be added here automatically.
          </p>
        </div>

        {/* Button to Open Modal */}
        <button
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          onClick={handleOpen}
        >
          <span>+</span>
          New Customer
        </button>

        {/* InviteRecModal Component */}
        {openForm === 'Invite_rec_modal' && (
          <InviteRecModal isOpen={true} onClose={handleClose} />
        )}
      </div>
    </div>
  );
};

export default Customers;
