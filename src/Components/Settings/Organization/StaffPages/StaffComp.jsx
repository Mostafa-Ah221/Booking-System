import { useEffect, useState } from 'react';
import { Search, Plus, Share, ChevronDown, User, Ellipsis, AlertTriangle, X, Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStaff, deleteStaff, updateShareLinkStaff } from '../../../../redux/apiCalls/StaffCallApi';
import { useDispatch, useSelector } from 'react-redux';
import ShareBookingModal from '../../../Dashboard/Profile_Page/ShareModalPrpfile';
import { usePermission } from '../../../hooks/usePermission';
import AddStaff from '../../../Dashboard/AddMenus/ModelsForAdd/add_Staff/AddStaff';
import UpgradeRequiredModal from '../../../Pricing/Upgraderequiredmodal';

/* ─────────────────────────────────────────
   Plan limit config
───────────────────────────────────────── */
const PLAN_LIMIT = { free: 1, basic: 3, premium: Infinity };

function getPlanKey(plan) {
  if (!plan || !Array.isArray(plan) || plan.length === 0) return "free";
  return (plan[0]?.name || "free").toLowerCase();
}

function isPlanExpired(plan) {
  if (!plan || !Array.isArray(plan) || plan.length === 0) return true;
  const expireDate = plan[0]?.expire_date;
  if (!expireDate) return false;
  return new Date(expireDate) < new Date();
}

/* ─────────────────────────────────────────
   Delete confirm modal
───────────────────────────────────────── */
function DeleteConfirmModal({ isOpen, onClose, onConfirm, staffName, isDeleting }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Delete Recruiter</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isDeleting}>
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            Are you sure you want to delete <span className="font-semibold">"{staffName}"</span>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-red-800">
              <span className="font-semibold">Warning:</span> All data associated with this recruiter member will be permanently deleted and cannot be restored.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Locked overlay card
───────────────────────────────────────── */
function LockedCard({ tutor, onDelete, canDeleteStaff }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteStaff(tutor.id));
      setShowDeleteConfirm(false);
      if (onDelete) onDelete();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
        {/* blur overlay */}
        <div
          className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center gap-2"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#2563eb18,#7c3aed18)" }}
            >
              <Lock className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Plan Expired</p>
            <p className="text-[10px] text-gray-400 text-center px-4">Upgrade to unlock this recruiter</p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <a
              href="/layoutDashboard/subscription"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
            >
              <Crown className="w-3 h-3" />
              Upgrade
            </a>
            {canDeleteStaff && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all"
              >
                <X className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* blurred card content (behind overlay) */}
        <div className="space-y-3 sm:space-y-4 select-none pointer-events-none">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              {tutor?.photo && typeof tutor.photo === 'string' && tutor.photo.trim() !== '' ? (
                <img src={tutor.photo} alt={tutor.name || 'Recruiter'} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover grayscale" />
              ) : (
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 truncate text-gray-400">{tutor.name || 'Unnamed'}</h3>
              <p className="text-xs sm:text-sm text-gray-400 truncate">{tutor.email || 'No email'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
            <span className="text-xs sm:text-sm text-gray-400">Locked</span>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        staffName={tutor?.name || ''}
        isDeleting={isDeleting}
      />
    </>
  );
}

/* ─────────────────────────────────────────
   Main StaffComp
───────────────────────────────────────── */
export default function StaffComp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUpdatingShareLink, setIsUpdatingShareLink] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { staffs, loading } = useSelector(state => state.staff);
  const plan = useSelector(state => state.subscription?.plan);   // array from API
  const dispatch = useDispatch();


  const canCreateStaff = usePermission("create staff");
  const canEditStaff = usePermission("edit staff");
  const canDeleteStaff = usePermission("destroy staff");

  useEffect(() => { dispatch(getStaff()); }, [dispatch]);

  /* ── plan helpers ── */
  const planKey = getPlanKey(plan);              
  const planLimit = PLAN_LIMIT[planKey] ?? 1;
  const expired = isPlanExpired(plan);

  const staffsArray = Array.isArray(staffs) ? staffs :
    (staffs?.data && Array.isArray(staffs.data)) ? staffs.data : [];

  /* 
    Decide which cards are locked:
    - If expired AND planKey was "basic" → free limit = 1 → first 1 active, rest locked
    - If expired AND planKey was "premium" → basic limit = 3 → first 3 active, rest locked
    - Basically: if expired, use the LOWER plan's limit
  */
  const effectiveLimit = expired
    ? (planKey === "premium" ? PLAN_LIMIT.basic : PLAN_LIMIT.free)
    : planLimit;

  /* split active vs locked (only when expired) */
  const activeStaffs = expired ? staffsArray.slice(0, effectiveLimit) : staffsArray;
  const lockedStaffs = expired ? staffsArray.slice(effectiveLimit) : [];

  /* filter search on active cards only */
  const filteredActive = activeStaffs.filter(t =>
    t?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredLocked = lockedStaffs.filter(t =>
    t?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTutors = [...filteredActive, ...filteredLocked];

  /* ── handle New Recruiter click ── */
  const handleNewRecruiterClick = () => {
    const totalActive = staffsArray.length - lockedStaffs.length;
    if (totalActive >= effectiveLimit || staffsArray.length >= planLimit) {
      setIsUpgradeModalOpen(true);
    } else {
      setIsAddStaffOpen(true);
    }
  };

  const handleShareClick = (e, staffMember) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedStaff(staffMember);
    setIsShareModalOpen(true);
  };

  const handleUpdateShareLink = async (newShareLink, id) => {
    try {
      setIsUpdatingShareLink(true);
      await dispatch(updateShareLinkStaff(newShareLink, id));
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error updating share link:', error);
    } finally {
      setIsUpdatingShareLink(false);
    }
  };

  const handleDeleteClick = (e, staffMember) => {
    e.preventDefault(); e.stopPropagation();
    setDeleteConfirm(staffMember);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      const result = await dispatch(deleteStaff(deleteConfirm.id));
      if (result.success) { setDeleteConfirm(null); setHoveredCard(null); }
    } catch (error) {
      console.error('Error deleting recruiter:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6" dir="ltr">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">All Recruiter</h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="bg-blue-600 text-white text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full min-w-[18px] sm:min-w-[20px] text-center">
                {filteredTutors.length}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <div className="text-xs sm:text-sm text-gray-600 px-2 sm:px-3 py-1.5 sm:py-2">
                    Total recruiter: {filteredTutors.length}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* plan badge */}
          <span
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
            style={{
              background: expired ? "#fef2f2" : planKey === "premium" ? "#f5f3ff" : planKey === "basic" ? "#eff6ff" : "#f9fafb",
              color: expired ? "#dc2626" : planKey === "premium" ? "#7c3aed" : planKey === "basic" ? "#2563eb" : "#6b7280",
              border: `1px solid ${expired ? "#fecaca" : planKey === "premium" ? "#ddd6fe" : planKey === "basic" ? "#bfdbfe" : "#e5e7eb"}`,
            }}
          >
            {expired ? <Lock className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
            {expired ? "Plan Expired" : planKey.charAt(0).toUpperCase() + planKey.slice(1)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 w-full sm:w-48 md:w-64 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {canCreateStaff && (
            <button
              onClick={handleNewRecruiterClick}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className='flex flex-col items-start'>
                <span className="text-xs sm:text-sm">New Recruiter</span>
                <span className="text-[8px] sm:text-[9px] leading-tight">(Staff, Doctors, or Team Members)</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => {
            /* check if this card is in the locked set */
            const isLockedByExpiry = lockedStaffs.some(l => l.id === tutor.id);
            const isLocked = tutor.is_locked === true || isLockedByExpiry;

            if (isLockedByExpiry) {
              return (
                <LockedCard
                  key={tutor.id}
                  tutor={tutor}
                  canDeleteStaff={canDeleteStaff}
                  onDelete={() => dispatch(getStaff())}
                />
              );
            }

            if (isLocked) {
              /* original is_locked from API (not expired-based) */
              return (
                <div
                  key={tutor.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm relative opacity-60 cursor-not-allowed select-none"
                >
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-500 z-10">
                    <Lock size={11} />
                    <span>Locked</span>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        {tutor?.photo && typeof tutor.photo === 'string' && tutor.photo.trim() !== '' ? (
                          <img src={tutor.photo} alt={tutor.name || 'Recruiter'} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover grayscale" />
                        ) : (
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 truncate text-gray-400">{tutor.name || 'Unnamed'}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">{tutor.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${tutor.status == 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs sm:text-sm text-gray-400">{tutor.status == 1 ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              );
            }

            /* ── Normal active card ── */
            return (
              <Link
                to={`/layoutDashboard/setting/recruiterPage/${tutor.id}`}
                key={tutor.id}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                onMouseEnter={() => setHoveredCard(tutor.id)}
                onMouseLeave={() => { setHoveredCard(null); setOpenMenuId(null); }}
              >
                <div className="space-y-3 sm:space-y-4 relative">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {tutor?.photo && typeof tutor.photo === 'string' && tutor.photo.trim() !== '' ? (
                        <img src={tutor.photo} alt={tutor.name || 'Recruiter'} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 truncate">{tutor.name || 'Unnamed'}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{tutor.email || 'No email'}</p>
                    </div>
                    {hoveredCard === tutor.id && (
                      <div className="absolute -top-2 -right-2 sm:-top-2 sm:-right-3 z-10">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(openMenuId === tutor.id ? null : tutor.id); }}
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full duration-200"
                        >
                          <Ellipsis className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        {openMenuId === tutor.id && (
                          <div className="absolute top-full right-0 mt-1 w-28 sm:w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {canEditStaff && (
                              <Link
                                to={`/layoutDashboard/setting/recruiterPage/${tutor.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                              >
                                Edit
                              </Link>
                            )}
                            {canDeleteStaff && (
                              <button
                                onClick={(e) => handleDeleteClick(e, tutor)}
                                className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${tutor.status == 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs sm:text-sm text-gray-700">{tutor.status == 1 ? 'Active' : 'Inactive'}</span>
                    </div>
                    <button
                      className="flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium px-2 sm:px-3 py-1.5 sm:py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-xs sm:text-sm"
                      onClick={(e) => handleShareClick(e, tutor)}
                    >
                      <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center">
            <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-sm sm:text-base text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No recruiter members found'}
            </p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        staffName={deleteConfirm?.name || ''}
        isDeleting={isDeleting}
      />

      <ShareBookingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={`s/${selectedStaff?.share_link}`}
        profile={selectedStaff}
        onUpdateLink={handleUpdateShareLink}
        canShowEdit={canEditStaff}
      />

      <AddStaff
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
      />

      <UpgradeRequiredModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={planKey}
      />
    </div>
  );
}