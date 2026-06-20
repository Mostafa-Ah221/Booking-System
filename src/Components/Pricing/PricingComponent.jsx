
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { fetchPublicPlans } from '../../redux/apiCalls/publicCallApi';
import PaymentGatewayModal from './PaymentGatewayModal'; // ← المحدّث
import { useDispatch } from 'react-redux';
import { upgradeSubscription } from '../../redux/apiCalls/subscriptionCallApi';

const PLAN_ORDER = ['Free', 'Basic', 'Premium'];

const CheckIcon = ({ className = '' }) => (
  <svg className={`shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const BoltIcon = ({ className = '' }) => (
  <svg className={`shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const PricingComponent = () => {
  const dispatch = useDispatch();
  const [plans, setPlans]                 = useState([]);
  const [billing, setBilling]             = useState('monthly');
  const [loading, setLoading]             = useState(true);
  const [expandedPlans, setExpandedPlans] = useState({});
  const [modalOpen, setModalOpen]         = useState(false);
  const [selectedPlan, setSelectedPlan]   = useState(null);

  useEffect(() => {
    fetchPublicPlans()
      .then((res) => setPlans(res.data?.data || res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [featuresExpanded, setFeaturesExpanded] = useState(false);
  const toggleExpand = () => setFeaturesExpanded((v) => !v);

  const getSavingPercent = (planName) => {
    const monthly = plans.find((p) => p.name === planName && p.billing_cycle === 'monthly');
    const yearly  = plans.find((p) => p.name === planName && p.billing_cycle === 'yearly');
    if (!monthly || !yearly) return null;
    const s = (((parseFloat(monthly.price) * 12 - parseFloat(yearly.price) * 12) / (parseFloat(monthly.price) * 12)) * 100).toFixed(0);
    return Number(s);
  };

  const savingPercent = (() => {
    const name = plans.find((p) => p.name !== 'Free')?.name;
    if (!name) return null;
    const s = getSavingPercent(name);
    return s > 0 ? s : null;
  })();

  const getPlanFeatureIds = (planName) => {
    const plan = plans.find((p) => p.name === planName);
    return plan ? plan.features.map((f) => f.id) : [];
  };

  const getUniqueFeatures = (plan) => {
    const idx = PLAN_ORDER.indexOf(plan.name);
    if (idx <= 0) return plan.features;
    const prevIds = getPlanFeatureIds(PLAN_ORDER[idx - 1]);
    return plan.features.filter((f) => !prevIds.includes(f.id));
  };

  const getPreviousPlanLabel = (planName) => {
    const idx = PLAN_ORDER.indexOf(planName);
    return idx > 0 ? PLAN_ORDER[idx - 1] : null;
  };

  const filteredPlans = plans.filter((p) => p.billing_cycle === billing && p.name !== 'Free');
  const freePlan      = plans.find((p) => p.name === 'Free');
  const formatPrice   = (price) => `$${price}`;

  const handleUpgradeClick = (plan) => {
    if (!localStorage.getItem('access_token')) { window.location.href = '/login'; return; }
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleFreeClick = async () => {
    if (!localStorage.getItem('access_token')) { window.location.href = '/register'; return; }
    if (!freePlan) return;
    try {
      const result = await dispatch(upgradeSubscription({ plan: freePlan.id, gateway: '' }));
      const url = result?.payload?.payment_url || result?.payload?.data?.payment_url;
      window.location.href = url || '/layoutDashboard';
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4a3bb6]" />
      </div>
    );
  }

  // ─── Paid Plan Card ────────────────────────────────────────────────────────
  const PlanCard = ({ plan, featured = false }) => {
    const uniqueFeatures = getUniqueFeatures(plan);
    const prevLabel      = getPreviousPlanLabel(plan.name);

    return (
      <div className={`relative flex flex-col rounded-2xl transition-all duration-200
        ${featured
          ? 'bg-[#4a3bb6] text-white shadow-2xl ring-2 ring-[#4a3bb6] scale-[1.02]'
          : 'bg-white text-gray-900 shadow-lg border border-gray-100 hover:shadow-xl'
        }`}
      >
        {featured && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase whitespace-nowrap">
              ✦ Most Popular
            </span>
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest ${featured ? 'text-white/60' : 'text-gray-400'}`}>
                {plan.name}
              </h3>
              <div className="h-6 mt-1.5">
                {parseInt(plan.trial_days) > 0 && (
                  <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold
                    ${featured ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>
                    {plan.trial_days}-day free trial
                  </span>
                )}
              </div>
            </div>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${featured ? 'bg-white/15' : 'bg-[#4a3bb6]/10'}`}>
              <BoltIcon className={`h-4 w-4 ${featured ? 'text-white' : 'text-[#4a3bb6]'}`} />
            </div>
          </div>

          <div className="mt-5 flex items-end gap-1">
            <span className={`text-5xl font-extrabold tracking-tight leading-none ${featured ? 'text-white' : 'text-gray-900'}`}>
              {formatPrice(plan.price)}
            </span>
          </div>

          <button
            onClick={() => handleUpgradeClick(plan)}
            className={`mt-6 w-full py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
              ${featured
                ? 'bg-white text-[#4a3bb6] hover:bg-gray-50 shadow-md'
                : 'bg-[#4a3bb6] text-white hover:bg-[#3a2da6] shadow-md hover:shadow-lg'
              }`}
          >
            TRY IT NOW →
          </button>
        </div>

        <div className={`border-t ${featured ? 'border-white/15' : 'border-gray-100'}`}>
          <button
            onClick={toggleExpand}
            className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors
              ${featured ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {featuresExpanded ? 'Hide features' : 'See features'}
            <ChevronIcon open={featuresExpanded} />
          </button>

          {featuresExpanded && (
            <div className="px-6 sm:px-8 pb-7 pt-1">
              {prevLabel && (
                <div className={`flex items-center gap-1.5 text-xs font-bold mb-3 pb-2.5 border-b border-dashed
                  ${featured ? 'text-amber-300 border-white/20' : 'text-[#4a3bb6] border-gray-200'}`}>
                  <BoltIcon className="h-3.5 w-3.5" />
                  Everything in {prevLabel} +
                </div>
              )}
              <ul className="space-y-2.5">
                {uniqueFeatures.map((f) => (
                  <li key={f.id} className="flex items-start gap-2.5">
                    <CheckIcon className={`h-4 w-4 mt-0.5 ${featured ? 'text-green-300' : 'text-green-500'}`} />
                    <span className={`text-sm leading-snug ${featured ? 'text-white/75' : 'text-gray-600'}`}>{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── Free Plan Banner ──────────────────────────────────────────────────────
  const FreePlanBanner = () => {
    if (!freePlan) return null;
    const [freeExpanded, setFreeExpanded] = useState(false);
    const freeFeatures  = getUniqueFeatures(freePlan);
    const visibleCount  = 6;

    return (
      <div className="mt-12 md:max-w-4xl md:mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or start for free</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 bg-gradient-to-br from-[#f5f4ff] to-white p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
              <div>
                <span className="inline-block text-xs font-bold text-[#4a3bb6] uppercase tracking-widest bg-[#4a3bb6]/10 px-2.5 py-1 rounded-full">
                  Free Forever
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-gray-900">Get started<br />at no cost</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  Everything you need to start scheduling appointments. No credit card required.
                </p>
              </div>
              <div>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="mb-1 text-sm text-gray-400">/ forever</span>
                </div>
                <button
                  onClick={handleFreeClick}
                  className="mt-4 w-full py-3 rounded-xl border-2 border-[#4a3bb6] text-[#4a3bb6] font-bold text-sm hover:bg-[#4a3bb6] hover:text-white transition-all duration-200"
                >
                  GET STARTED FREE
                </button>
              </div>
            </div>

            <div className="md:col-span-3 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-bold text-gray-700">What's included</span>
                {freeFeatures.length > visibleCount && (
                  <button
                    onClick={() => setFreeExpanded((v) => !v)}
                    className="flex items-center gap-1 text-xs text-[#4a3bb6] font-semibold hover:underline"
                  >
                    {freeExpanded ? 'Show less' : `Show all ${freeFeatures.length}`}
                    <ChevronIcon open={freeExpanded} />
                  </button>
                )}
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {(freeExpanded ? freeFeatures : freeFeatures.slice(0, visibleCount)).map((f) => (
                  <li key={f.id} className="flex items-start gap-2.5">
                    <CheckIcon className="h-4 w-4 mt-0.5 text-green-500" />
                    <span className="text-sm text-gray-600 leading-snug">{f.name}</span>
                  </li>
                ))}
              </ul>

              {!freeExpanded && freeFeatures.length > visibleCount && (
                <p className="mt-4 text-xs text-gray-400">
                  +{freeFeatures.length - visibleCount} more features included
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-gray-500 text-base sm:text-lg">
            Choose the plan that fits your team. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5 sm:gap-8 mt-6">
          {['No credit card required', 'Cancel anytime', 'Simple and intuitive UI'].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-[#4a3bb6]" />
              <span className="text-sm text-gray-500">{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1">
            {['monthly', 'yearly'].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`relative px-5 py-2 rounded-lg capitalize text-sm font-semibold transition-all duration-200
                  ${billing === b ? 'bg-[#4a3bb6] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {b}
                {b === 'yearly' && savingPercent && (
                  <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full
                    ${billing === 'yearly' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'}`}>
                    -{savingPercent}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 md:max-w-4xl md:mx-auto items-start">
          {filteredPlans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} featured={i === filteredPlans.length - 1} />
          ))}
        </div>

        <FreePlanBanner />
      </div>

      {/* ── Modal: بيتعامل مع Paymob redirect و PayPal popup تلقائيًا ── */}
      <PaymentGatewayModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedPlan(null); }}
        plan={selectedPlan}
      />
    </div>
  );
};

export default PricingComponent;