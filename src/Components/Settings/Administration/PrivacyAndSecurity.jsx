import React, { useState } from "react";
import { Trash2, Shield } from "lucide-react";

const Switch = ({ enabled, onChange }) => (
  <div 
    className={`w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
    onClick={onChange}
  >
    <div 
      className={`w-5 h-5 bg-white rounded-full transform transition-transform duration-200 mt-0.5 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </div>
);

const PrivacyAndSecurity = () => {
  const [antiSpamEnabled, setAntiSpamEnabled] = useState(true);
  const [hipaaEnabled, setHipaaEnabled] = useState(true);
  const [emailInput, setEmailInput] = useState("");

  const handleDelete = () => {
    if (emailInput) {
      console.log("Deleting:", emailInput);
      setEmailInput("");
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Privacy and Security
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Compliance</h3>
        
        <div className="space-y-6">
          {/* Anti-Spam Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Anti-Spam Disclaimer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Enabled</span>
                <Switch 
                  enabled={antiSpamEnabled}
                  onChange={() => setAntiSpamEnabled(!antiSpamEnabled)}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              When enabled, email notifications will include anti-spam text in the footer. 
              Disabling it will remove the anti-spam text from the notifications.
            </p>
          </div>

          {/* HIPAA Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium">HIPAA Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Enabled</span>
                <Switch 
                  enabled={hipaaEnabled}
                  onChange={() => setHipaaEnabled(!hipaaEnabled)}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Enabling this option lets you protect your customer's ePHI/PII. 
              You can mark sensitive form fields as ePHI/PII and handle data as mandated by HIPAA.
            </p>
          </div>

          {/* Data Deletion Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Trash2 className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Data Deletion</span>
            </div>
            <div className="space-y-3">
              <p className="font-medium">Delete guest information</p>
              <p className="text-sm text-gray-600">
                Enter guest email(s) to delete them from Zoho Bookings. 
                You can delete up to 10 guest emails at a time.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email addresses"
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAndSecurity;