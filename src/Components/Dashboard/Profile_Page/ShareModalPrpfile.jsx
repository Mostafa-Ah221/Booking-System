import { useState, useEffect } from 'react';
import { X, RefreshCw, Copy } from 'lucide-react';
import { fetchProfileData, StaffFetchProfileData } from '../../../redux/apiCalls/ProfileCallApi';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit2 } from "react-icons/fi";

const ShareBookingModal = ({ 
  isOpen, 
  onClose, 
  shareLink, 
  profile,
  onUpdateLink,
  loading = false,
  canShowEdit = true 
}) => {
  const [activeTab, setActiveTab] = useState('shareLink');
  const [editMode, setEditMode] = useState(false);
  const [newShareLink, setNewShareLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [orgBase, setOrgBase] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const userType = localStorage.getItem("userType");
  const dispatch = useDispatch();
  const { profile: profileData, staffProfile } = useSelector(state => state.profileData);
console.log(profile);

  // === Extract orgBase safely (string only) ===
  useEffect(() => {
    let base = '';
    if (profileData?.user?.share_link) {
      const link = profileData.user.share_link;
      base = typeof link === 'string' ? link : (link?.slug || link?.share_link || '');
    } else if (staffProfile?.user?.customer_share_link) {
      const link = staffProfile.user.customer_share_link;
      base = typeof link === 'string' ? link : (link?.slug || link?.customer_share_link || '');
    }

    setOrgBase(base);
  }, [profileData, staffProfile]);
  
  // Reset edit mode when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEditMode(false);
      setNewShareLink('');
      setCopiedLink(false);
      setCopiedEmbed(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  // === Safely extract shareLink as string ===
  const shareLinkString = shareLink 
    ? (typeof shareLink === 'string' ? shareLink : (shareLink?.slug || shareLink?.id || ''))
    : '';

  const orgBaseString = orgBase 
    ? (typeof orgBase === 'string' ? orgBase : (orgBase?.slug || ''))
    : '';

  // === Final URLs ===
  const bookingLink = shareLinkString
    ? `${window.location.origin}/${orgBaseString}/${shareLinkString}`
    : orgBaseString
      ? `${window.location.origin}/${orgBaseString}`
      : '';

  const embedCode = shareLinkString
    ? `<embed src="${window.location.origin}/${orgBaseString}/${shareLinkString}" width="100%" height="600px" />`
    : orgBaseString
      ? `<embed src="${window.location.origin}/${orgBaseString}" width="100%" height="600px" />`
      : '';

  // === Copy Handlers ===
  const handleCopyLink = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  // === Generate Random Link ===
  const handleGenerateRandom = async () => {
    if (onUpdateLink) {
      await onUpdateLink(null, profile?.id);
      setNewShareLink('');
    }
  };

  // === Fetch Profile on Mount ===
  useEffect(() => {
    if (userType === 'staff') {
      dispatch(StaffFetchProfileData());
    } else {
      dispatch(fetchProfileData());
    }
  }, [dispatch, userType]);

  // === Save New Link ===
  const handleSave = async () => {
    if (newShareLink.trim() && onUpdateLink) {
      setIsSaving(true);
      try {
        await onUpdateLink(newShareLink.trim(), profile?.id);
        setEditMode(false);
        setNewShareLink('');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setNewShareLink('');
    setIsSaving(false);
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
              {profile?.photo && typeof profile.photo === 'string' && profile.photo.trim() ? (
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
              <div className="font-medium text-gray-900 truncate  max-w-[150px]">
                {profile?.name || 'User Name'}
              </div>

              {/* Show duration/type only if at least one exists */}
              {profile?.duration || profile?.type ? (
                <div className="text-gray-500 text-sm">
                  {[
                    profile?.duration ? `${profile.duration} mins` : null,
                    profile?.type ? profile.type : null
                  ].filter(Boolean).join(' | ')}
                </div>
              ) : null}
            </div>
          </div>

          {/* Link Section */}
          <div className="mb-6">
            {editMode ? (
              // Edit Mode
              <div className="space-y-3">
                <div className="relative">
                  {!(shareLinkString?.includes('service') || shareLinkString?.includes('w')) && (
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium pointer-events-none">
                      @
                    </span>
                  )}

                  <input
                    type="text"
                    value={newShareLink}
                    onChange={(e) => setNewShareLink(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter share link"
                    disabled={isSaving || loading}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateRandom}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                    disabled={isSaving || loading}
                  >
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    disabled={isSaving || loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!newShareLink.trim() || isSaving || loading}
                    className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving || loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {bookingLink || 'No booking link available'}
                </div>
                
                {(shareLinkString || orgBaseString) && canShowEdit && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                    title="Edit link"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleCopyLink(bookingLink)}
                  disabled={!bookingLink}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    !bookingLink
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : copiedLink
                        ? 'bg-green-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
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

          {/* Embed Tab Content */}
          {activeTab === 'embedWidget' && (
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 max-h-48 overflow-auto">
                <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap break-all">
                  {embedCode || 'Share link not available for embedding'}
                </pre>
              </div>
              <button
                onClick={() => handleCopyEmbed(embedCode)}
                disabled={!embedCode}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ml-auto ${
                  !embedCode
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

          {/* Warning if no link */}
          {!(orgBaseString || shareLinkString) && (
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

export default ShareBookingModal;