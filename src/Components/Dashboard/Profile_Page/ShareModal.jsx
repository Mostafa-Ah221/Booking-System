import React, { useState } from 'react';
import { X, Copy, Link as LinkIcon } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';

const ShareModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('shareLink');
  const [useOneTimeLink, setUseOneTimeLink] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const bookingLink = "https://ahmed.zohobookings.com/p/4758869000000044014";
  const embedCode = "<iframe width='50%' height='50%' src='https://ahmed.zohobookings.com/portal-embed#/4758869000000044014' frameborder='0' allowfullscreen=''></iframe>";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50 p-6">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Share Booking Link</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <CgProfile className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <div className="font-medium">مصطفي احمد <span className="text-xs text-gray-500 font-normal ml-2">Super Admin</span></div>
            <div className="text-gray-600 text-sm">mostafaahmed1101997@gmail.com</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex">
            <button
              className={`px-4 py-2 ${activeTab === 'shareLink' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('shareLink')}
            >
              Share Link
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'embedWidget' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('embedWidget')}
            >
              Embed as Widget
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'shareLink' ? (
          <>
            {/* One-time booking link toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-700">One-time booking link</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={useOneTimeLink}
                  onChange={() => setUseOneTimeLink(!useOneTimeLink)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${useOneTimeLink ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                  <div className={`dot absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${useOneTimeLink ? 'transform translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>

            {/* Link display and copy button */}
            <div className="flex items-center mb-4">
              <div className="flex-grow bg-gray-50 border rounded-l-md p-3 text-sm text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {bookingLink}
              </div>
              <button 
                onClick={() => handleCopy(bookingLink)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-r-md flex items-center transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Embed code display */}
            <div className="bg-gray-50 border rounded-md p-4 mb-4 overflow-auto max-h-48">
              <pre className="text-sm text-gray-600 font-mono whitespace-pre-wrap">
                {embedCode}
              </pre>
            </div>
            
            {/* Copy code button */}
            <button 
              onClick={() => handleCopy(embedCode)}
              className="border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Code
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ShareModal;