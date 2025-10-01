import { useState } from 'react';
import { X, Copy } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, interview }) => {
  const [activeTab, setActiveTab] = useState('share'); 
  const [oneTimeLink, setOneTimeLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;
  
  const bookingLink = `${window.location.origin}/share/${interview?.share_link}`;
  const embedCode = `<iframe width="100%" height="750px" src="${window.location.origin}/share/${interview?.share_link}" frameborder="0" allowfullscreen></iframe>`;
  
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Share Booking Link</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Interview Info */}
        <div className="p-4 flex items-center">
          <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-lg font-semibold mr-3">
            {interview?.name?.substring(0, 2).toUpperCase() || "RS"}
          </div>
          <div>
            <h3 className="font-semibold">{interview?.name || "Recruitment Strategy Meeting Copy"}</h3>
            <p className="text-gray-500 text-sm">{interview?.duration_cycle } {interview.duration_period} | {interview?.mode || "One-on-One"}</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'share' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('share')}
          >
            Share Link
          </button>
          <button
            className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'embed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('embed')}
          >
            Embed as Widget
          </button>
        </div>
        
        {/* Content based on active tab */}
        <div className="p-6">
          {activeTab === 'share' ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">One-time booking link</span>
                {/* <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={oneTimeLink}
                    onChange={() => setOneTimeLink(!oneTimeLink)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label> */}
              </div>
              <div className="flex">
                <div className="flex-1 bg-gray-100 p-3 rounded-l-md overflow-hidden">
                  <p className="text-gray-700 truncate">
                    {bookingLink}
                  </p>
                </div>
                <button 
                  onClick={() => copyToClipboard(bookingLink, 'link')}
                  className={`px-4 rounded-r-md flex items-center justify-center transition-colors ${
                    copiedLink ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-100 p-4 rounded-md mb-4 font-mono text-sm overflow-x-auto">
                {embedCode}
              </div>
              <button 
                onClick={() => copyToClipboard(embedCode, 'embed')}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                  copiedEmbed 
                    ? 'bg-green-100 border-green-300 text-green-700' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {copiedEmbed ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Code
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;