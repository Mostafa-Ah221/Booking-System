import React, { useState } from 'react';
import { X, Copy, Link as LinkIcon } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';

const ShareModalProfile = ({ isOpen, onClose, shareLink, profile }) => {
  const [activeTab, setActiveTab] = useState('shareLink');
  const [useOneTimeLink, setUseOneTimeLink] = useState(false);
  const [copied, setCopied] = useState(false);
  console.log(profile);
  
  const bookingLink = `${window.location.origin}/share/@/${shareLink || ''}`;
  const embedCode = `<iframe width="100%" height="750px" src="${window.location.origin}/share/@/${shareLink || ''}" frameborder="0" allowfullscreen></iframe>`;

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

        {/* User Info - استخدام بيانات من profile */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {profile?.photo ? (
              <img 
                src={profile?.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <CgProfile className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-medium">
              {profile?.name || 'User Name'} 
              <span className="text-xs text-gray-500 font-normal ml-2">
                {profile.status == 1 ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              {profile?.email || 'user@example.com'}
            </div>
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
             
            </div>

            {/* Link display and copy button */}
            <div className="flex items-center mb-4">
              <div className="flex-grow bg-gray-50 border rounded-l-md p-3 text-sm text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {shareLink ? bookingLink : 'Share link not available'}
              </div>
              <button 
  onClick={() => handleCopy(bookingLink)}
  disabled={!shareLink}
  className={`px-4 py-3 rounded-r-md flex items-center transition-colors 
    ${!shareLink 
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
      : copied 
        ? 'bg-green-500 text-white hover:bg-green-600' 
        : 'bg-indigo-600 text-white hover:bg-indigo-700'
    }`}
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
                {shareLink ? embedCode : 'Share link not available for embedding'}
              </pre>
            </div>
            
            {/* Copy code button */}
       <button 
  onClick={() => handleCopy(embedCode)}
  disabled={!shareLink}
  className={`px-4 py-2 ml-auto rounded-md flex items-center gap-2 transition-colors 
    ${!shareLink 
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
      : copied 
        ? 'bg-green-500 text-white hover:bg-green-600' 
        : 'bg-indigo-600 text-white hover:bg-indigo-700'
    }`}
>
  <Copy className="w-4 h-4" />
  {copied ? 'Copied!' : 'Copy Code'}
</button>


          </>
        )}

        {/* Warning message if share_link is not available */}
        {!shareLink && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Share link is not available. Please contact support if you need a share link.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ShareModalProfile;