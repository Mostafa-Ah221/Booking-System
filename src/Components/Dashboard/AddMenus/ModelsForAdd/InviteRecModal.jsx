import React from "react";
import { X } from "lucide-react";

const InviteRecModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Invite Recruiters</h2>
      <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Emails <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter email addresses separated by a space or comma" className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300" />
          </div>

          <div>
            <label className="block text-sm font-medium">Workspaces <span className="text-red-500">*</span></label>
            <select className="w-full p-2 border rounded-lg">
              <option>Select</option>
              {/* Add workspace options here */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Role <span className="text-red-500">*</span></label>
            <select className="w-full p-2 border rounded-lg">
              <option>Staff</option>
              {/* Add other roles here */}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Invite</button>
        </div>
      </div>
    </div>
  );
};

export default InviteRecModal;
