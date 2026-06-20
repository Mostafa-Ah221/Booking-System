import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPlan } from "./subscriptionCallapi";

/**
 * usePlan
 *
 * Hook واحد للاستخدام في أي مكون.
 * - يعمل fetch للـ plan لو مش موجود في الـ store
 * - يرجع { planKey, planLimit, expired, loading, error }
 *
 * الاستخدام:
 *   const { planKey, planLimit, expired } = usePlan();
 */

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

export function usePlan() {
  const dispatch = useDispatch();
  const { plan, loading, error } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (!plan && !loading) {
      dispatch(fetchMyPlan());
    }
  }, []); 

  const planKey = getPlanKey(plan);
  const planLimit = PLAN_LIMIT[planKey] ?? 1;
  const expired = isPlanExpired(plan);

  // لو expired، الـ effective limit بيرجع للـ lower plan
  const effectiveLimit = expired
    ? planKey === "premium"
      ? PLAN_LIMIT.basic
      : PLAN_LIMIT.free
    : planLimit;

  const isFree = planKey === "free";
  const isBasic = planKey === "basic";
  const isPremium = planKey === "premium";

  return {
    plan,
    planKey,
    planLimit,
    effectiveLimit,
    expired,
    isFree,
    isBasic,
    isPremium,
    loading,
    error,
  };
}