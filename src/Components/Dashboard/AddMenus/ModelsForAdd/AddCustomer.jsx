import React from "react";
import { X } from "lucide-react";

const AddCustomerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Add Customer</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Customer Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter customer name" className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300" />
          </div>

          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input type="email" placeholder="Enter email address" className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300" />
          </div>

          <div>
            <label className="block text-sm font-medium">Contact Number</label>
            <div className="flex border rounded-lg p-2">
              <span className="mr-2">🇪🇬 +20</span>
              <input type="text" className="w-full focus:ring focus:ring-indigo-300" placeholder="Enter contact number" />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
