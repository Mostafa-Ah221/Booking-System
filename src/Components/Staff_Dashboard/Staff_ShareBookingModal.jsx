import { useState, useEffect } from 'react';
import { X, Copy } from 'lucide-react';

const Staff_ShareBookingModal = ({ 
  isOpen, 
  onClose, 
  shareLink, 
  profile
}) => {
  const [activeTab, setActiveTab] = useState('shareLink');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Reset copied states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCopiedLink(false);
      setCopiedEmbed(false);
    }
  }, [isOpen]);

  const bookingLink = shareLink 
    ? `${window.location.origin}/${shareLink}` 
    : '';
  
  const embedCode = shareLink 
    ? `<iframe width="100%" height="750px" src="${window.location.origin}/${shareLink}" frameborder="0" allowfullscreen></iframe>` 
    : '';

  const handleCopyLink = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Share Booking Link</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center overflow-hidden">
              {profile?.photo && typeof profile.photo === 'string' && profile.photo.trim() !== '' ? (
                <img 
                  src={profile.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-purple-700 font-semibold text-lg">
                  {profile?.name?.substring(0, 2).toUpperCase() || 'TE'}
                </span>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {profile?.name || 'User Name'}
              </div>
              <div className="text-gray-500 text-sm">
                {profile?.duration || '30 mins'} | {profile?.type || 'One-on-One'}
              </div>
            </div>
          </div>

          {/* Link Section - View Only */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {shareLink ? bookingLink : 'No share link available'}
              </div>
              <button
                onClick={() => handleCopyLink(bookingLink)}
                disabled={!shareLink}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  !shareLink 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : copiedLink
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-4">
            <button
              className={`px-4 py-2 text-sm ${
                activeTab === 'shareLink' 
                  ? 'border-b-2 border-purple-600 text-gray-900 font-medium' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('shareLink')}
            >
              Share Link
            </button>
            <button
              className={`px-4 py-2 text-sm ml-4 ${
                activeTab === 'embedWidget' 
                  ? 'border-b-2 border-purple-600 text-gray-900 font-medium' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('embedWidget')}
            >
              Embed as Widget
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'embedWidget' && (
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 max-h-48 overflow-auto">
                <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap break-all">
                  {shareLink ? embedCode : 'Share link not available for embedding'}
                </pre>
              </div>
              <button
                onClick={() => handleCopyEmbed(embedCode)}
                disabled={!shareLink}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ml-auto ${
                  !shareLink 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : copiedEmbed
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copiedEmbed ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          )}

          {/* Warning message */}
          {!shareLink && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Share link is not available. Please create a share link first.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Staff_ShareBookingModal;