import React from 'react';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePanel = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      )}
      
      <div className={`
        fixed right-0 top-0 h-full bg-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        w-full sm:w-80 md:w-96
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Profile Section */}
        <div className="p-4 sm:p-6 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4">
            <User className="w-full h-full p-4 sm:p-6 text-gray-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-1">مصطفي احمد</h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-2">mostafaahmed1101997@gmail.com</p>
          <div className="flex items-center justify-center text-gray-600 text-xs sm:text-sm mb-4">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Africa/Cairo
          </div>
          <button className="text-indigo-600 hover:underline text-xs sm:text-sm">
            View Org Details
          </button>
        </div>

        <hr />

        {/* Account Actions */}
        <div className="p-3 sm:p-4">
          <div className="flex justify-between mb-4">
            <Link to='/layoutAcount' className="flex items-center text-gray-700 text-sm sm:text-base">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              My Account
            </Link>
            <button 
  className="flex items-center text-red-500 text-sm sm:text-base"
  onClick={() => {
    localStorage.removeItem("access_token");
    window.location.href = "/"; // أو "/login" حسب ما يناسبك
  }}
>
  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
  Sign Out
</button>
          </div>
        </div>

        <hr />

        {/* Subscription Section */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center mb-2">
            <h3 className="text-base sm:text-lg font-medium">Subscription</h3>
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              Premium Trial
            </span>
          </div>
          <button className="text-indigo-600 hover:underline text-xs sm:text-sm">
            Manage Subscription
          </button>
        </div>

        <hr />

        {/* Help Section */}
        <div className="p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Need Help?</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <button className="flex items-center text-gray-700 text-sm sm:text-base">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Webinars
            </button>
            <button className="flex items-center text-gray-700 text-sm sm:text-base">
              <Book className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              What's New?
            </button>
            <button className="flex items-center text-gray-700 text-sm sm:text-base">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Help Guide
            </button>
            <button className="flex items-center text-gray-700 text-sm sm:text-base">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Community
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button className="flex items-center justify-center w-full text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base">
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Delete My Account
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;