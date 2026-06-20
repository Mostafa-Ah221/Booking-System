import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function TrialBanner() {
  const plans = useSelector((state) => state.subscription.plan);

  if (!plans || !Array.isArray(plans) || plans.length === 0) return null;

  const plan = plans[0];
  const daysLeft = plan.days_left ?? 0;
const isTrial = plan.trial_ends_at !== null && daysLeft <= 15;

if (!isTrial) return null;

  return (
    <div className={`w-full px-4 py-2 flex items-center justify-between text-sm
      ${daysLeft <= 3 ? "bg-red-50 border-b border-red-200" : "bg-amber-50 border-b border-amber-200"}
    `}>
      <div className="flex items-center gap-2">
        <span className="text-lg">⏳</span>
        <span className={`font-medium ${daysLeft <= 3 ? "text-red-700" : "text-amber-700"}`}>
          {daysLeft === 0
            ? "Your free trial has ended."
            : `Your free trial ends in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.`}
        </span>
        <span className={`${daysLeft <= 3 ? "text-red-500" : "text-amber-500"}`}>
          Upgrade to keep full access.
        </span>
      </div>
      <Link to="/upgrade" className="px-3 py-1.5 bg-[#9333ea] text-white rounded-lg text-xs font-medium hover:bg-[#7e22ce] transition-colors shrink-0">
        Upgrade Now
      </Link>
    </div>
  );
}