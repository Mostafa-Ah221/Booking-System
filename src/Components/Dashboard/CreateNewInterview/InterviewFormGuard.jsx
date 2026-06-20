import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInterviews } from "../../../redux/apiCalls/interviewCallApi";
import UpgradeRequiredModal from "../../Pricing/Upgraderequiredmodal";
import InterviewFormOne from "./InterviewFormOne";

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

const InterviewFormGuard = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const { allInterviews } = useSelector((s) => s.interview);
  const plan = useSelector((s) => s.subscription?.plan);

  useEffect(() => {
    dispatch(fetchAllInterviews());
  }, [dispatch]);

  useEffect(() => {
    const planKey      = getPlanKey(plan);
    const expired      = isPlanExpired(plan);
    const planLimit    = PLAN_LIMIT[planKey] ?? 1;
    const effectiveLimit = expired
      ? planKey === "premium" ? PLAN_LIMIT.basic : PLAN_LIMIT.free
      : planLimit;

    const total        = Array.isArray(allInterviews) ? allInterviews.length : 0;
    const openSlots    = Math.max(0, effectiveLimit - total);

    if (openSlots === 0) setShowModal(true);
  }, [allInterviews, plan]);

  const planKey = getPlanKey(plan);

  return (
    <>
      {showModal ? (
        <UpgradeRequiredModal
          isOpen={true}
          onClose={() => navigate(-1)}
          currentPlan={planKey}
        />
      ) : (
        <InterviewFormOne />
      )}
    </>
  );
};

export default InterviewFormGuard;