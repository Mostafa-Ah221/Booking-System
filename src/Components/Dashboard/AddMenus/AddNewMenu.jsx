import React, { useEffect } from 'react';
import { FiChevronUp } from "react-icons/fi";
import { Link } from 'react-router-dom';
import {
  Calendar,
  Building2,
  UserRound,
  Users,
  User,
  FileText,
  ShieldUser,
  Lock,
} from 'lucide-react';
import { usePermission } from "../../hooks/usePermission";
import { useSelector, useDispatch } from 'react-redux';
import { getRoles } from '../../../redux/apiCalls/RolesCallApli';
import { getStaff } from '../../../redux/apiCalls/StaffCallApi';
import { fetchAllInterviews } from '../../../redux/apiCalls/interviewCallApi';

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

const AddNewMenu = ({ onOpenForm, onUpgradeRequired }) => {
  const dispatch      = useDispatch();
  const plan          = useSelector((state) => state.subscription?.plan);
  const allInterviews = useSelector((state) => state.interview?.allInterviews);
  const staffs        = useSelector((state) => state.staff?.staffs);
  const workspaces    = useSelector((state) => state.workspace?.workspaces);
  const roles         = useSelector((state) => state.roles?.roles); 


  useEffect(() => {
    dispatch(getRoles());
    dispatch(getStaff())
    dispatch(fetchAllInterviews());
  }, [dispatch]);

  const planKey = getPlanKey(plan);
  const expired = isPlanExpired(plan);

  const effectiveLimit = expired
    ? planKey === "premium" ? PLAN_LIMIT.basic : PLAN_LIMIT.free
    : PLAN_LIMIT[planKey] ?? 1;

  // ── counts ────────────────────────────────────────────────────────────────
  const interviewsArray = Array.isArray(allInterviews) ? allInterviews : [];
  const staffsArray     = Array.isArray(staffs)
    ? staffs
    : staffs?.data && Array.isArray(staffs.data) ? staffs.data : [];
  const workspacesArray = Array.isArray(workspaces) ? workspaces : [];

  const rolesArray = Array.isArray(roles) ? roles : (roles?.data ? roles.data : []);

  // ── lock flags ────────────────────────────────────────────────────────────
  const isInterviewLocked =
    planKey !== "premium" && (expired || interviewsArray.length >= effectiveLimit);

  const isRecruiterLocked =
    planKey !== "premium" && (expired || staffsArray.length >= effectiveLimit);

  const isWorkspaceLocked =
    planKey !== "premium" && workspacesArray.length >= effectiveLimit;

  const isRoleLocked = false;

  const isResourceLocked = planKey !== "premium" || expired;
const isUserLocked = planKey !== "premium" || expired;

  // ── permissions ───────────────────────────────────────────────────────────
  const permissions = {
    "add appointment":  usePermission("add appointment"),
    "create interview": usePermission("create interview"),
    "create staff":     usePermission("create staff"),
    "create clients":   usePermission("create clients"),
    "create roles":     usePermission("create roles"),
  };

  const handleItemClick = (item) => {
    if (!item.form) return;
    onOpenForm?.(item.form);
  };

  const handleLockedClick = () => {
    onUpgradeRequired?.(planKey);
  };

  // ── menu items ────────────────────────────────────────────────────────────
  const menuItems = [
    {
      icon: Calendar,
      text: 'Appointment',
      color: 'bg-orange-50 text-orange-500',
      form: 'appointment',
      requiredPermission: "add appointment",
      dividerAfter: false,
    },
    {
      icon: Building2,
      text: 'Workspace',
      color: 'bg-green-50 text-green-500',
      form: "workspace_modal",
      locked: isWorkspaceLocked,
      limitBadge: planKey !== "premium"
        ? `${workspacesArray.length}/${effectiveLimit === Infinity ? "∞" : effectiveLimit}`
        : null,
      dividerAfter: false,
    },
    {
      icon: UserRound,
      text: 'Interview',
      color: 'bg-pink-50 text-pink-500',
      link: "/create_interview",
      requiredPermission: "create interview",
      locked: isInterviewLocked,
      dividerAfter: true, 
    },
    {
      icon: Users,
      text: 'User',
      color: 'bg-teal-50 text-teal-500',
      form: "Invite_rec_modal",
      requiredPermission: "create staff",
      locked: isUserLocked,
      dividerAfter: false,
    },
    {
      icon: User,
      text: 'Client',
      color: 'bg-red-50 text-red-500',
      form: "add_cust_modal",
      requiredPermission: "create clients",
         
      dividerAfter: false,
    },
    {
      icon: Users,
      text: 'Recruiter',
      disc: '(Staff, Doctors, or Team Members)',
      color: 'bg-red-50 text-red-500',
      form: "add_staff_modal",
      requiredPermission: "create staff",
      locked: isRecruiterLocked,
      dividerAfter: false,
    },
    {
      icon: FileText,
      text: 'Resource',
      color: 'bg-indigo-50 text-indigo-500',
      form: "add_resourse_model",
        locked: isResourceLocked, 
      dividerAfter: false,
    },
    {
      icon: ShieldUser,
      text: 'Roles',
      color: 'bg-indigo-50 text-indigo-500',
      form: "add_roles_model",
      requiredPermission: "create roles",
      locked: isRoleLocked,
      dividerAfter: false,
    },
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow-2xl p-4 relative shadow-gray-400 border">
      <span className="absolute -top-[1.3rem] right-[9.4rem] text-white">
        <FiChevronUp className="fill-white text-4xl" />
      </span>

      <h2 className="font-semibold mb-4 pb-1">Add New</h2>
      <hr />

      <div className="space-y-2 mt-4 text-sm">
        {menuItems.map((item, index) => {
          const hasPermission = item.requiredPermission
            ? permissions[item.requiredPermission]
            : true;

          if (!hasPermission) return null;

          // ── LOCKED ──────────────────────────────────────────────────────
          if (item.locked) {
            return (
              <React.Fragment key={index}>
                <div
                  className="flex items-center p-1 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-red-50 opacity-70"
                  onClick={handleLockedClick}
                  title="Upgrade your plan to use this feature"
                >
                  <div className={`p-2 rounded-lg ${item.color} grayscale`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="ml-3 text-gray-400">{item.text}</span>
                      <span
                        className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1"
                        style={{
                          background: "#fef2f2",
                          color:      "#dc2626",
                          border:     "1px solid #fecaca",
                        }}
                      >
                        <Lock size={8} className="inline" />
                        {item.limitBadge ? item.limitBadge : expired ? "Expired" : "Upgrade"}
                      </span>
                    </div>
                    {item.disc && (
                      <span className="text-gray-400 text-xs ml-3">{item.disc}</span>
                    )}
                  </div>
                </div>
                {/* ✅ dividerAfter بدل index === 2 */}
                {item.dividerAfter && <hr />}
              </React.Fragment>
            );
          }

          // ── NORMAL ──────────────────────────────────────────────────────
          return (
            <React.Fragment key={index}>
              {item.link ? (
                <Link
                  to={item.link}
                  className="flex items-center p-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="ml-3 text-gray-700">{item.text}</span>
                    {item.disc && (
                      <span className="text-gray-500 text-xs ml-1">{item.disc}</span>
                    )}
                  </div>
                </Link>
              ) : (
                <div
                  className="flex items-center justify-between p-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="ml-3 text-gray-700">{item.text}</span>
                      {item.disc && (
                        <span className="text-gray-500 text-xs ml-3">{item.disc}</span>
                      )}
                    </div>
                  </div>

                  {item.limitBadge && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "#f0fdf4",
                        color:      "#15803d",
                        border:     "1px solid #bbf7d0",
                      }}
                    >
                      {item.limitBadge}
                    </span>
                  )}
                </div>
              )}
              {/* ✅ dividerAfter بدل index === 2 */}
              {item.dividerAfter && <hr />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AddNewMenu;