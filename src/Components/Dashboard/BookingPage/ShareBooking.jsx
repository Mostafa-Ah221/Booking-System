import React, { useState } from 'react';
import { X, Link2, Copy, User } from 'lucide-react';

const ShareBooking = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('share-link');
  const [isOneTime, setIsOneTime] = useState(true);
  const bookingLink = 'https://ahmed.zohobookings.com/#/4758869000000044014';

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingLink);
    // You could add a toast notification here
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 top-16 z-50 animate-slide-down">
        <div className="bg-white max-w-2xl mx-auto rounded-b-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Share Booking Link</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">مصطفى احمد</div>
                <div className="text-sm text-gray-500">Super Admin</div>
                <div className="text-sm text-gray-500">mostafaahmed1101997@gmail.com</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'share-link' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('share-link')}
            >
              Share Link
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'embed' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('embed')}
            >
              Embed as Widget
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'share-link' && (
              <>
                {/* One-time booking toggle */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">One-time booking link</span>
                  <button
                    onClick={() => setIsOneTime(!isOneTime)}
                    className={`w-11 h-6 rounded-full transition-colors ${
                      isOneTime ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                      isOneTime ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Link */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg text-sm break-all">
                    {bookingLink}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </>
            )}

            {activeTab === 'embed' && (
              <div className="text-sm text-gray-500">
                Embed options would go here...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ShareBooking;