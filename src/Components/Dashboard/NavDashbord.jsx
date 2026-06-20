import { useState, useEffect, useRef } from 'react';
import { Bell, Settings, Plus, Menu } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import AddNewMenu from './AddMenus/AddNewMenu';
import Notifictions from './Notifictions';
import ProfilePanel from './ProfilePanel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileData } from '../../redux/apiCalls/ProfileCallApi';
import { getUnreadCount } from '../../redux/apiCalls/NotificationsCallApi';

import AddAppointment from './Appointments/AddAppointment';
import UnavailabilityForm from './AddMenus/UnavailabilityForm';
import SpecialWorking from './AddMenus/SpecialWorking';
import WorkspaceModal from './AddMenus/ModelsForAdd/NewWorkspace';
import InviteRecModal from './AddMenus/ModelsForAdd/InviteRecModal';
import AddCustomerModal from './AddMenus/ModelsForAdd/AddCustomer';
import AddResourceModal from './AddMenus/ModelsForAdd/AddResource';
import RoleModal from './AddMenus/ModelsForAdd/NewRoleModal';
import AddStaff from './AddMenus/ModelsForAdd/add_Staff/AddStaff';
import UpgradeRequiredModal from '../Pricing/Upgraderequiredmodal';

export default function NavDashbord({ isSidebarOpen, setIsSidebarOpen }) {
  const [isMenuOpen, setIsMenuOpen]               = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen]         = useState(false);
  const [profileLoaded, setProfileLoaded]         = useState(false);
  const [openForm, setOpenForm]                   = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradePlanKey, setUpgradePlanKey]       = useState("free");

  const { profile, loading = false } = useSelector(state => state.profileData);
  const { unreadCount }              = useSelector((state) => state.notifications);

  const menuRef          = useRef(null);
  const buttonRef        = useRef(null);
  const notificationsRef = useRef(null);
  const bellButtonRef    = useRef(null);
  const dispatch         = useDispatch();
const plan        = useSelector((state) => state.subscription?.plan);
const planKey     = plan?.[0]?.name?.toLowerCase() ?? "free";
const expired     = plan?.[0]?.expire_date ? new Date(plan[0].expire_date) < new Date() : true;
const isPremium   = planKey === "premium" && !expired;
  useEffect(() => {
    if (!profile && !loading && !profileLoaded) {
      dispatch(fetchProfileData());
      setProfileLoaded(true);
    }
  }, [dispatch, profile, loading, profileLoaded]);

  useEffect(() => {
    dispatch(getUnreadCount());
  }, [dispatch]);

  const toggleMenu          = () => setIsMenuOpen((prev) => !prev);
  const toggleNotifications = () => setIsNotificationsOpen((prev) => !prev);
  const toggleProfile       = () => setIsProfileOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (
        menuRef.current?.contains(target)          ||
        buttonRef.current?.contains(target)        ||
        notificationsRef.current?.contains(target) ||
        bellButtonRef.current?.contains(target)    ||
        target.closest('[data-modal]')
      ) return;
      setIsMenuOpen(false);
      setIsNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ AddNewMenu بيبعت اسم الـ form — نفتحه هنا في الـ parent
  const handleOpenForm = (formName) => {
    setIsMenuOpen(false);
    setOpenForm(formName);
  };

  const handleCloseForm = () => setOpenForm(null);

  // ✅ لما يجي locked click من AddNewMenu
  const handleUpgradeRequired = (planKey) => {
    setUpgradePlanKey(planKey || "free");
    setIsUpgradeModalOpen(true);
  };

  return (
    <div className="w-full flex items-center relative">
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
        <div className="text-sm text-gray-500" />

        <div className="flex items-center gap-4">
         {!loading && (
            isPremium ? (
              <Link to='/upgrade' className="p-2 text-xs text-yellow-600 font-semibold flex items-center gap-1">
                ⭐ Premium
              </Link>
            ) : (
              <Link to='/upgrade' className="p-2 text-xs text-blue-800 underline">
                Upgrade now
              </Link>
            )
          )}
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="p-2 text-purple-600 bg-purple-600 bg-opacity-10 rounded-full hover:bg-opacity-20 transition-colors"
          >
            <Plus size={18} />
          </button>

          <button
            ref={bellButtonRef}
            onClick={toggleNotifications}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount?.unread_count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] leading-none">
                {unreadCount.unread_count}
              </span>
            )}
          </button>

          <Link
            to='/layoutDashboard/setting'
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings size={18} />
          </Link>

          <button
            onClick={toggleProfile}
            className="w-7 h-7 xs:w-7 xs:h-7 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center overflow-hidden"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
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
            {profile?.user?.photo && (
              <CgProfile className="w-5 h-5 text-gray-400" style={{ display: 'none' }} />
            )}
          </button>
        </div>
      </header>

      {/* AddNewMenu — dropdown فقط */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-14 right-3 z-20">
          <AddNewMenu
            onOpenForm={handleOpenForm}
            onUpgradeRequired={handleUpgradeRequired}
          />
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

      {/* Profile Panel */}
      <ProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* ✅ كل الـ Modals هنا — دايماً mounted */}
      <AddAppointment
        isOpen={openForm === 'appointment'}
        onClose={handleCloseForm}
      />
      <UnavailabilityForm
        isOpen={openForm === 'unavailability'}
        onClose={handleCloseForm}
      />
      <SpecialWorking
        isOpen={openForm === 'special_working'}
        onClose={handleCloseForm}
      />
      <WorkspaceModal
        isOpen={openForm === 'workspace_modal'}
        onClose={handleCloseForm}
        editWorkspace={null}
      />
      <InviteRecModal
        isOpen={openForm === 'Invite_rec_modal'}
        onClose={handleCloseForm}
      />
      <AddCustomerModal
        isOpen={openForm === 'add_cust_modal'}
        onClose={handleCloseForm}
      />
      <AddStaff
        isOpen={openForm === 'add_staff_modal'}
        onClose={handleCloseForm}
      />
      <AddResourceModal
        isOpen={openForm === 'add_resourse_model'}
        onClose={handleCloseForm}
      />
      <RoleModal
        isOpen={openForm === 'add_roles_model'}
        onClose={handleCloseForm}
      />

      <UpgradeRequiredModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={upgradePlanKey}
      />
    </div>
  );
}