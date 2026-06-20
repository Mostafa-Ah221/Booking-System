import { useState } from "react";
import { ChevronLeft, X, Lock, Crown } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import oneToOneIcon from "../../../../src/assets/image/oneToOneIcon.svg";
import groupBookingIcon from "../../../../src/assets/image/groupBookingIcon.svg";
import collectiveIcon from "../../../../src/assets/image/collectiveIcon.svg";
import resourceIcon from "../../../../src/assets/image/resourceIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllInterviews } from "../../../redux/apiCalls/interviewCallApi";
import UpgradeRequiredModal from "../../Pricing/Upgraderequiredmodal";

// ─── Plan config ──────────────────────────────────────────────────────────────
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

// ─── Locked Card ──────────────────────────────────────────────────────────────
const LockedInterviewCard = ({ icon, title, description, onLockedClick }) => (
  <div
    onClick={onLockedClick}
    className="bg-white p-1 rounded-lg shadow relative overflow-hidden cursor-pointer"
  >
    <div
      className="absolute inset-0 z-10 rounded-lg"
      style={{
        background: "rgba(248,247,255,0.0)",
       
      }}
    />

    {/* card content (behind overlay) */}
    <div className="space-y-4 select-none pointer-events-none">
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 bg-gradient-to-tr from-blue-100 via-white to-white flex items-center justify-center">
          <img src={icon} alt={title} className="w-12 h-12 opacity-40 grayscale" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-300">{title}</h3>
          <p className="text-gray-300">
            <span>Ideal for {description}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Normal Card ──────────────────────────────────────────────────────────────
const InterviewTypeCard = ({ icon, title, description, path }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (path) navigate(`${path}`, { state: { interviewType: title } });
  };

  return (
    <div
      onClick={handleNavigation}
      className="bg-white p-1 rounded-lg shadow transition-shadow duration-200 cursor-pointer hover:shadow-lg"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-gradient-to-tr from-blue-100 via-white to-white flex items-center justify-center">
            <img src={icon} alt={title} className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-gray-600">
              <span>Ideal for {description}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const CreateInterviewPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const isMainPage = location.pathname === "/create_interview";

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const { allInterviews } = useSelector((state) => state.interview);
  const plan = useSelector((state) => state.subscription?.plan);

  useEffect(() => {
    dispatch(fetchAllInterviews());
  }, [dispatch]);

  // ── plan helpers ──
  const planKey        = getPlanKey(plan);
  const planLimit      = PLAN_LIMIT[planKey] ?? 1;
  const expired        = isPlanExpired(plan);
  const interviewsArray = Array.isArray(allInterviews) ? allInterviews : [];
  const totalInterviews = interviewsArray.length;

  const effectiveLimit = expired
    ? planKey === "premium" ? PLAN_LIMIT.basic : PLAN_LIMIT.free
    : planLimit;

  // عدد الـ slots المفتوحة للـ cards
  const openSlotsCount = Math.max(0, effectiveLimit - totalInterviews);

  const interviewTypes = [
    {
      icon: oneToOneIcon,
      title: "one-to-one",
      description: "support calls, client meetings, and any one-to-one meetings",
      path: "InterFormOne",
    },
    {
      icon: groupBookingIcon,
      title: "group-booking",
      description: "workshops, webinars, and classes",
      path: "InterFormOne",
    },
    {
      icon: collectiveIcon,
      title: "collective-booking",
      description: "panel interviews, board meetings, and any many-to-one meetings",
      path: "InterFormOne",
    },
    {
      icon: resourceIcon,
      title: "resource",
      description: "conference room bookings and equipment rentals",
      path: "InterFormOne",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 absolute left-4 top-5"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-bold text-center">Create New Interview</h1>

          {/* plan badge */}
          <span
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize absolute right-14 top-6"
            style={{
              background: expired ? "#fef2f2" : planKey === "premium" ? "#f5f3ff" : planKey === "basic" ? "#eff6ff" : "#f9fafb",
              color:      expired ? "#dc2626" : planKey === "premium" ? "#7c3aed" : planKey === "basic" ? "#2563eb" : "#6b7280",
              border: `1px solid ${expired ? "#fecaca" : planKey === "premium" ? "#ddd6fe" : planKey === "basic" ? "#bfdbfe" : "#e5e7eb"}`,
            }}
          >
            {expired ? <Lock className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
            {expired ? "Plan Expired" : planKey.charAt(0).toUpperCase() + planKey.slice(1)}
          </span>

          <Link
            to="/layoutDashboard"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 absolute right-4 top-5"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* ── Content ── */}
      {isMainPage ? (
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid gap-6 text-[14px]">
            {interviewTypes.map((type, index) => {
              const PLAN_ALLOWED_TYPES = {
                  free:    ["one-to-one", "group-booking"],
                  basic: ["one-to-one", "group-booking", "collective-booking"],
                  premium: ["one-to-one", "group-booking", "collective-booking", "resource"],
                };

                const allowedTypes = expired
                  ? PLAN_ALLOWED_TYPES["free"]          
                  : (PLAN_ALLOWED_TYPES[planKey] ?? PLAN_ALLOWED_TYPES["free"]);

                const isOpen = allowedTypes.includes(type.title) && openSlotsCount > 0;


              return isOpen ? (
                <InterviewTypeCard
                  key={index}
                  icon={type.icon}
                  title={type.title}
                  description={type.description}
                  path={type.path}
                />
              ) : (
                <LockedInterviewCard
                  key={index}
                  icon={type.icon}
                  title={type.title}
                  description={type.description}
                  onLockedClick={() => setIsUpgradeModalOpen(true)}
                />
              );
            })}
          </div>
        </main>
      ) : (
        <Outlet />
      )}

      {/* ── Upgrade Modal ── */}
      <UpgradeRequiredModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={planKey}
      />
    </div>
  );
};

export default CreateInterviewPage;