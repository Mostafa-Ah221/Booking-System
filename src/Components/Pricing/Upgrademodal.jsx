import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchPublicPlans } from '../../redux/apiCalls/publicCallApi';
import PaymentGatewayModal from './PaymentGatewayModal';
import { usePlan } from '../../redux/apiCalls/Useplan';

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_ORDER = ['Free', 'Basic', 'Premium'];

// ─── Icons ───────────────────────────────────────────────────────────────────

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z" fill="currentColor" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BoltIcon = ({ style }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Loading ──────────────────────────────────────────────────────────────────

const LoadingSpinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8f7ff' }}>
    <div style={{ display: 'flex', gap: 8 }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 8, height: 8, borderRadius: '50%', background: '#4a3bb6',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
    <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
  </div>
);

// ─── Plan Card ────────────────────────────────────────────────────────────────

const PlanCard = ({
  plan,
  isRecommended,
  billing,
  monthlyPrice,
  onUpgrade,
  uniqueFeatures,
  prevLabel,
  allFeatures,
  expanded,
  onToggleExpand,
}) => {
  const [hovered, setHovered] = useState(false);

  const price      = parseFloat(plan.price);
  const monthPrice = monthlyPrice ? parseFloat(monthlyPrice) : null;

  // Features to show: unique ones when collapsed, all when expanded
const visibleFeatures = uniqueFeatures;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20,
        transition: 'all 0.3s',
        background: isRecommended ? '#4a3bb6' : '#ffffff',
        border: isRecommended ? '1.5px solid #4a3bb6' : '1.5px solid #e5e7eb',
        boxShadow: hovered
          ? isRecommended
            ? '0 20px 50px rgba(74,59,182,0.25)'
            : '0 20px 40px rgba(0,0,0,0.10)'
          : isRecommended
          ? '0 8px 24px rgba(74,59,182,0.18)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isRecommended && (
        <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 16px', borderRadius: 999,
            background: '#fff', color: '#4a3bb6',
            border: '1.5px solid #c7d2fe',
            fontSize: 12, fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            <SparkleIcon />
            Most Popular
          </div>
        </div>
      )}

      <div style={{ padding: '28px 28px 0 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Plan name + trial */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: isRecommended ? '#c7d2fe' : '#9ca3af',
          }}>
            {plan.name}
          </span>
          {parseInt(plan.trial_days) > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
              background: isRecommended ? 'rgba(255,255,255,0.18)' : '#ede9fe',
              color: isRecommended ? '#fff' : '#4a3bb6',
            }}>
              {plan.trial_days}d free trial
            </span>
          )}
        </div>

        {/* Price */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: isRecommended ? '#c7d2fe' : '#9ca3af' }}>$</span>
            <span style={{
              fontSize: 56, fontWeight: 700, lineHeight: 1, letterSpacing: '-2px',
              color: isRecommended ? '#ffffff' : '#111827',
            }}>
              {price}
            </span>
          </div>
         
        </div>

        <div style={{ marginBottom: 24, minHeight: 20 }}>
          {billing === 'yearly' && monthPrice ? (
            <p style={{ fontSize: 12, color: isRecommended ? '#a5b4fc' : '#9ca3af' }}>
              Billed annually · ${monthPrice}/mo billed monthly
            </p>
          ) : (
            <p style={{ fontSize: 12, color: isRecommended ? '#a5b4fc' : '#9ca3af' }}>
              Billed monthly · no commitment
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onUpgrade(plan)}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 12,
            fontSize: 14, fontWeight: 600, marginBottom: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: 'none', cursor: 'pointer',
            transition: 'all 0.2s',
            ...(isRecommended
              ? { background: '#ffffff', color: '#4a3bb6', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }
              : { background: '#4a3bb6', color: '#fff', boxShadow: '0 4px 14px rgba(74,59,182,0.3)' }),
          }}
        >
          Upgrade to {plan.name}
          <ArrowIcon />
        </button>
      </div>

      {/* ── Features section ── */}
      <div style={{ borderTop: isRecommended ? '1px solid rgba(255,255,255,0.15)' : '1px solid #f3f4f6' }}>

        {/* Toggle button */}
        <button
          onClick={onToggleExpand}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 0', fontSize: 12, fontWeight: 600,
            color: isRecommended ? 'rgba(255,255,255,0.5)' : '#9ca3af',
            background: 'transparent', border: 'none', cursor: 'pointer',
            transition: 'color 0.2s',
          }}
        >
          {expanded ? 'Hide features' : 'See features'}
          <ChevronIcon open={expanded} />
        </button>

        {/* Feature list */}
        {expanded && (
          <div style={{ padding: '4px 28px 28px' }}>

            {/* "Everything in X +" label */}
            {prevLabel && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700,
                color: isRecommended ? '#fbbf24' : '#4a3bb6',
                marginBottom: 12, paddingBottom: 10,
                borderBottom: isRecommended ? '1px dashed rgba(255,255,255,0.2)' : '1px dashed #e5e7eb',
              }}>
                <BoltIcon style={{ color: 'currentColor' }} />
                Everything in {prevLabel} +
              </div>
            )}

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visibleFeatures.map((f) => (
                <li key={f.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ marginTop: 2, flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7.5" stroke={isRecommended ? 'rgba(255,255,255,0.35)' : '#d1d5db'} />
                      <path d="M5 8.5l2 2 4-4" stroke={isRecommended ? '#fff' : '#4a3bb6'}
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{
                    fontSize: 13, lineHeight: '1.5',
                    color: isRecommended ? '#e0e7ff' : '#374151',
                  }}>
                    {f.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UpgradePage() {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState('monthly');

  const [modalOpen,    setModalOpen]    = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);

  // ── Current user plan from Redux ──────────────────────────────────────────
  const { plan, planKey } = usePlan();

  const currentPlanName = Array.isArray(plan)
    ? plan[0]?.name ?? null
    : plan?.name ?? null;
  
  useEffect(() => {
    fetchPublicPlans()
      .then((res) => setPlans(res.data?.data || res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
console.log("currentPlanName:", currentPlanName);
console.log("plan names:", plans.map(p => p.name));
  // ── Filter helpers ────────────────────────────────────────────────────────

  // All paid plans for the selected billing cycle, excluding current plan
  const paidPlans = plans.filter(
    (p) =>
      p.billing_cycle === billing &&
      p.name !== 'Free' &&
      p.name !== currentPlanName
  );

  const getMonthlyPrice = (planName) =>
    plans.find((p) => p.name === planName && p.billing_cycle === 'monthly')?.price ?? null;

  const hasYearly = plans.some((p) => p.billing_cycle === 'yearly' && p.name !== 'Free');

  // ── Feature diff helpers (same logic as PricingComponent) ─────────────────

  const getPlanFeatureIds = (planName) => {
    // Use monthly variant to get feature list (same features regardless of cycle)
    const plan = plans.find((p) => p.name === planName);
    return plan ? plan.features.map((f) => f.id) : [];
  };

  /**
   * Returns only the features that are NEW in this plan
   * compared to the previous plan in PLAN_ORDER.
   */
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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleUpgrade = (plan) => {
    const token = localStorage.getItem('access_token');
    if (!token) { window.location.href = '/login'; return; }
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
  };

  // ── Saving % for yearly badge ─────────────────────────────────────────────
  const getSavingPercent = () => {
    const name = plans.find((p) => p.name !== 'Free')?.name;
    if (!name) return null;
    const monthly = plans.find((p) => p.name === name && p.billing_cycle === 'monthly');
    const yearly  = plans.find((p) => p.name === name && p.billing_cycle === 'yearly');
    if (!monthly || !yearly) return null;
    const s = (
      ((parseFloat(monthly.price) * 12 - parseFloat(yearly.price) * 12) /
        (parseFloat(monthly.price) * 12)) * 100
    ).toFixed(0);
    return Number(s) > 0 ? Number(s) : null;
  };
  const savingPercent = getSavingPercent();

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7ff' }}>

      {/* ── Top accent bar ── */}
      <div style={{ height: 4, width: '100%', background: 'linear-gradient(90deg, #4a3bb6, #818cf8, #4a3bb6)' }} />

      <div style={{ maxWidth: 896, margin: '0 auto', padding: '56px 16px' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: '#ede9fe', color: '#4a3bb6',
            border: '1px solid #c4b5fd',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <SparkleIcon />
            Upgrade Your Plan
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700,
            marginBottom: 16, lineHeight: 1.2, letterSpacing: '-1px', color: '#111827',
          }}>
            Scale your scheduling
            <br />
            <span style={{ color: '#4a3bb6' }}>without limits</span>
          </h1>

          <p style={{ fontSize: 16, maxWidth: 400, margin: '0 auto', color: '#6b7280' }}>
            Unlock powerful features to streamline bookings, automate workflows, and grow your business.
          </p>

          {/* Current plan indicator */}
          {currentPlanName && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16,
              padding: '6px 14px', borderRadius: 999,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              fontSize: 13, color: '#166534', fontWeight: 600,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#16a34a" />
                <path d="M5 8.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Current plan: {currentPlanName}
            </div>
          )}
        </div>

        {/* ── Billing toggle ── */}
        {hasYearly && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'flex', padding: 4, borderRadius: 12, gap: 4,
              background: '#e5e7eb', border: '1px solid #d1d5db',
            }}>
              {['monthly', 'yearly'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  style={{
                    padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 14, fontWeight: 500, textTransform: 'capitalize',
                    transition: 'all 0.2s',
                    ...(billing === b
                      ? { background: '#4a3bb6', color: '#fff', boxShadow: '0 2px 10px rgba(74,59,182,0.3)' }
                      : { color: '#6b7280', background: 'transparent' }),
                  }}
                >
                  {b}
                  {b === 'yearly' && savingPercent && (
                    <span style={{
                      marginLeft: 8, fontSize: 10, fontWeight: 700,
                      padding: '2px 6px', borderRadius: 4,
                      background: billing === 'yearly' ? 'rgba(255,255,255,0.2)' : '#d1fae5',
                      color: billing === 'yearly' ? '#fff' : '#065f46',
                    }}>
                      -{savingPercent}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Trust badges ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginBottom: 40 }}>
          {[
            { icon: '🛡️', text: 'No credit card for trial' },
            { icon: '↩️', text: 'Cancel anytime' },
            { icon: '🔒', text: 'Secure payments' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* ── Plan Cards ── */}
        {paidPlans.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: '#fff', borderRadius: 20,
            border: '1.5px solid #e5e7eb',
            color: '#6b7280', fontSize: 15,
          }}>
            🎉 You're already on the highest available plan!
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: paidPlans.length === 1 ? '400px' : `repeat(${Math.min(paidPlans.length, 2)}, 1fr)`,
            justifyContent: 'center', 
            gap: 20,
            alignItems: 'start',
            marginBottom: 52,
          }}>
            {paidPlans.map((plan, idx) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isRecommended={idx === paidPlans.length - 1}
                billing={billing}
                monthlyPrice={getMonthlyPrice(plan.name)}
                onUpgrade={handleUpgrade}
                uniqueFeatures={getUniqueFeatures(plan)}
                prevLabel={getPreviousPlanLabel(plan.name)}
                allFeatures={plan.features}
                expanded={featuresExpanded}
                onToggleExpand={() => setFeaturesExpanded(v => !v)}
              />
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#d1d5db', marginBottom: 12 }}>
            Local taxes (VAT, GST, etc.) may apply
          </p>
          <a
            href="/pricing"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 14, fontWeight: 500, color: '#4a3bb6', textDecoration: 'none',
            }}
          >
            Full feature comparison
            <ArrowIcon />
          </a>
        </div>
      </div>

      {/* ── Payment Modal ── */}
      <PaymentGatewayModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        plan={selectedPlan}
      />
    </div>
  );
}