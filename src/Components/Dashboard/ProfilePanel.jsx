import { 
  X, 
  User, 
  LogOut, 
  Video, 
  HelpCircle,
  Users,
  Book,
  MapPin,
  Crown,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback } from 'react';
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';

const ProfilePanel = ({ isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFormData, setDeleteFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
    const userType = localStorage.getItem("userType");

  const dispatch = useDispatch();
  const { profile,staffProfile, loading = false } = useSelector(state => state.profileData);

 
  const profileData = userType === 'staff' ? staffProfile?.user : profile?.user;

  // Handle logout
 const handleLogout = useCallback(async () => {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("userType");

  const logoutUrl =
    userType === "staff"
      ? "https://backend-booking.appointroll.com/api/staff/logout"
      : "https://backend-booking.appointroll.com/api/customer/logout";

  try {
    if (token) {
      const response = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });

      if (response.ok) {
        toast.success("Logged out successfully");
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data?.message || "Logout failed on server");
      }
    } else {
      toast("No active session found", { icon: "⚠️" });
    }
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Network error while logging out");
  } finally {
  
    localStorage.removeItem("access_token");
    localStorage.removeItem("userType");

    setTimeout(() => {
      window.location.href = "/login";
    }, 800);
  }
}, []);



  // Handle delete account API call
  const handleDeleteAccount = useCallback(async (e) => {
  e.preventDefault();

  if (!deleteFormData.email || !deleteFormData.password) {
    toast.error('Please fill in all fields');
    return;
  }

  setDeleteLoading(true);
  setDeleteError('');

  try {
    const Token = localStorage.getItem("access_token");

    const response = await fetch('https://backend-booking.appointroll.com/api/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Token,
      },
      body: JSON.stringify(deleteFormData),
    });

    const data = await response.json();
    const isError =
      !response.ok ||
      data.message === 400 || 
      data.data?.message?.toLowerCase().includes("credentials") ||
      data.data?.message?.toLowerCase().includes("do not match");

    if (isError) {
      const errorMessage = data.data?.message || 'Invalid email or password';
      setDeleteError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    toast.success('Account deleted successfully');
    localStorage.removeItem('access_token');
    setShowDeleteModal(false);

    setTimeout(() => {
      window.location.href = '/';
    }, 1500);

  } catch (error) {
    const errorMessage = 'Network error. Please try again.';
    setDeleteError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setDeleteLoading(false);
  }
}, [deleteFormData]);


  // Handle opening delete modal
  const handleDeleteClick = useCallback(() => {
    setShowDeleteModal(true);
    setDeleteError('');
    setDeleteFormData({ email: profileData?.email || '', password: '' });
  }, [profileData?.email]);

  // Handle closing delete modal
  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteError('');
    setDeleteFormData({ email: '', password: '' });
    setShowPassword(false);
  }, []);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle image load success
  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  // Render profile image with error handling
  const renderProfileImage = () => {
    if (loading) {
      return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      );
    }

    if (profileData?.photo && !imageError) {
      return (
        <img 
          src={profileData.photo} 
          alt="Profile" 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 object-cover shadow-sm" 
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      );
    }

    // Fallback to icon when no image or image failed to load
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
        <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
      </div>
    );
  };

  // Navigation items configuration
  const helpItems = [
    { icon: Video, label: 'Webinars', action: () => toast('Webinars feature coming soon!', { icon: '📹' }) },
    { icon: Book, label: "What's New?", action: () => toast('Check out our latest updates!', { icon: '📖' }) },
    { icon: HelpCircle, label: 'Help Guide', action: () => toast('Help guide opened!', { icon: '❓' }) },
    { icon: Users, label: 'Community', action: () => toast('Join our community!', { icon: '👥' }) },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Panel */}
      <div 
        className={`
          fixed right-0 top-0 h-full bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          w-full sm:w-80 md:w-96
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-panel-title"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
          aria-label="Close profile panel"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Section */}
          <div className="p-4 sm:p-6 text-center">
            {renderProfileImage()}
            
            <h2 
              id="profile-panel-title"
              className="text-lg sm:text-xl font-semibold mb-1 truncate px-4" 
              title={profileData?.name || 'Loading...'}
            >
              {profileData?.name || 'User Name'}
            </h2>
            <p 
              className="text-gray-600 text-xs sm:text-sm mb-2 truncate px-4" 
              title={profileData?.email || 'Loading...'}
            >
              {profileData?.email || 'Loading...'}
            </p>
            
            {/* Status indicator */}
            {profileData?.status && (
              <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Active
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Account Actions */}
          <div className="p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <Link to={`${userType === 'staff' ? 'Staff_Profilepage' : 'profilepage'}`} 
                className="flex items-center text-gray-700 hover:text-gray-900 text-sm sm:text-base transition-colors duration-200"
              onClick={onClose}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                My Account
              </Link>
              
              <button 
                className="flex items-center text-red-500 hover:text-red-600 text-sm sm:text-base transition-colors duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Sign Out
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

   

          {/* Help Section */}
          <div className="p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Need Help?</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {helpItems.map((item, index) => (
                <button 
                  key={index}
                  className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm sm:text-base p-2 rounded-lg transition-all duration-200"
                  onClick={item.action}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section - Delete Account */}
          {userType !== 'staff' ? (<div className="p-4 border-t border-gray-200 bg-gray-50">
          <button 
            className="flex items-center justify-center w-full text-red-500 hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
            onClick={handleDeleteClick}
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Delete My Account
          </button>
        </div>) : null}
        
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
              <p className="text-gray-600 text-sm">
                This action cannot be undone. Please confirm your email and password to proceed.
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleDeleteAccount} className="p-6 pt-2">
              {/* Error Message */}
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {deleteError}
                  </p>
                </div>
              )}

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={deleteFormData.email}
                  onChange={(e) => setDeleteFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your email"
                  disabled={deleteLoading}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={deleteFormData.password}
                    onChange={(e) => setDeleteFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Enter your password"
                    disabled={deleteLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={deleteLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePanel;