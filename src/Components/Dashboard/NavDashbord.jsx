import { useState, useEffect, useRef } from 'react';
import { Bell, Settings, Plus, Menu } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import AddNewMenu from './AddMenus/AddNewMenu';
import Notifictions from './Notifictions';
import ProfilePanel from './ProfilePanel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileData } from '../../redux/apiCalls/ProfileCallApi';
import { getUnreadCount,getNotifications } from '../../redux/apiCalls/NotificationsCallApi';

export default function NavDashbord({ isSidebarOpen, setIsSidebarOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { profile, loading = false } = useSelector(state => state.profileData);
  const { unreadCount, error } = useSelector((state) => state.notifications);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const notificationsRef = useRef(null);
  const bellButtonRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profile && !loading && !profileLoaded) {
      dispatch(fetchProfileData());
      setProfileLoaded(true);
    }
  }, [dispatch, profile, loading, profileLoaded]);

  useEffect(() => {
    dispatch(getUnreadCount());
  }, [dispatch]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex items-center relative ">
      {/* Mobile Menu Button */}
      <div className="flex w-full items-center bg-white px-4 py-2 lg:hidden">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-gray-600 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      <header className="w-full bg-white border-b border-gray-200 px-6 pt-3 pb-[10px] flex items-center justify-between">
        <div className="text-sm text-gray-500">
         
        </div>
        <div className="flex items-center gap-4">
          {/* Add Button */}
          <button 
            ref={buttonRef} 
            onClick={toggleMenu} 
            className="p-2 text-purple-600 bg-purple-600 bg-opacity-10 rounded-full hover:bg-opacity-20 transition-colors"
          >
            <Plus size={18} />
          </button>

          {/* Notifications Button */}
          <button 
            ref={bellButtonRef} 
            onClick={toggleNotifications} 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount?.unread_count > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">{unreadCount?.unread_count}</span>
            )}
            
          </button>

          {/* Settings Button */}
          <Link 
            to='/layoutDashboard/setting' 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings size={18} />
          </Link>

          {/* Profile Button - تحسين التعامل مع الصورة */}
          <button
            onClick={toggleProfile}
            className="w-7 h-7 xs:w-7 xs:h-7 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center overflow-hidden"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : profile?.user?.photo ? (
              <img
                src={profile.user.photo}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border border-gray-200"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <CgProfile className="w-5 h-5 text-gray-400" />
            )}
            
            {/* Fallback icon (مخفي افتراضياً) */}
            {profile?.user?.photo && (
              <CgProfile 
                className="w-5 h-5 text-gray-400" 
                style={{ display: 'none' }}
              />
            )}
          </button>
        </div>
      </header>

      {/* AddNewMenu */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-14 right-3 z-20">
          <AddNewMenu />
        </div>
      )}

      {/* Notifications Panel */}
      {isNotificationsOpen && (
        <div ref={notificationsRef} className="absolute top-14 right-0 z-20">
          <Notifictions 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>
      )}

      {/* Profile Panel - Rendered at root level */}
      <ProfilePanel 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}