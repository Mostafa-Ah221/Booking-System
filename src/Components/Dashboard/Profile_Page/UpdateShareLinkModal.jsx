import { useState } from 'react';
import { X, RefreshCw} from 'lucide-react';

const UpdateShareLinkModal = ({ isOpen, onClose, onUpdateLink, currentShareLink, loading = false }) => {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Reset form when modal opens
  useState(() => {
    if (isOpen) {
      setShareLink('');
      setCopied(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shareLink.trim()) {
      await onUpdateLink(shareLink.trim());
      
      setShareLink('');
    }
  };

  const handleGenerateRandom = () => {
    const randomString = Math.random().toString(36).substring(2, 12);
    const timestamp = Date.now().toString().slice(-4);
    setShareLink(`${randomString}-${timestamp}`);
  };



  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Update Share Link</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={loading}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Link *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={shareLink}
                  onChange={(e) => setShareLink(e.target.value)}
                  className="w-full px-3 py-2.5 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Enter share link"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleGenerateRandom}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Generate random link"
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!shareLink.trim() || loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateShareLinkModal;