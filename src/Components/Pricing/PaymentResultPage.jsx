import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchPaymentResult } from '../../redux/apiCalls/subscriptionCallApi';

export default function PaymentResultPage() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const [params]    = useSearchParams();
  const { paymentResult, loading } = useSelector((s) => s.subscription);

  const subscriptionId = params.get('subscription_id');

  useEffect(() => {
    if (subscriptionId) {
      dispatch(fetchPaymentResult(subscriptionId));
    }
  }, [subscriptionId, dispatch]);

  // ── Helpers ──────────────────────────────────────
  const isSuccess = paymentResult?.ok && paymentResult?.status === 'success';

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  const formatAmount = (amount, currency) =>
    `${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    })} ${currency}`;

  // ── Loading ──────────────────────────────────────
  if (loading || !paymentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(160deg,#0f0f2a 0%,#0a0a1e 100%)' }}>
        <div>
          <div className="flex gap-2 justify-center mb-3">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-indigo-400"
                   style={{ animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
            ))}
          </div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Verifying your payment...</p>
        </div>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      </div>
    );
  }

  const plan       = paymentResult.plan;
  const activePlan = paymentResult.active_plan;

  // ── UI ───────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(160deg,#0f0f2a 0%,#0a0a1e 100%)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden relative"
           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>

        {/* Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-60 h-32 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse,rgba(99,102,241,0.4) 0%,transparent 70%)', filter: 'blur(28px)' }} />

        {/* ── Header ── */}
        <div className="relative z-10 px-8 pt-8 pb-6 text-center"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
               style={{
                 background: isSuccess ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                 border: `1.5px solid ${isSuccess ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
               }}>
            {isSuccess ? (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14l6 6 10-10" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M7 7l14 14M21 7L7 21" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <h1 className="text-white text-xl font-semibold mb-1">
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13 }}>
            {isSuccess
              ? paymentResult.message || 'Your subscription is now active'
              : 'Something went wrong. Please try again.'}
          </p>
        </div>

        {isSuccess && (
          <div className="relative z-10 px-6 py-5">

            {/* Plan Summary */}
            <div className="rounded-2xl p-4 mb-3"
                 style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: '#818cf8', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                  Active Plan
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                  {plan.name}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white font-bold text-lg m-0">{plan.name}</p>
                  <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>
                    {plan.billing_cycle === 'yearly' ? 'Yearly billing' : 'Monthly billing'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl m-0">
                    {parseFloat(paymentResult.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>{paymentResult.currency}</p>
                </div>
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'Expires', value: formatDate(activePlan.expire_date), color: '#e5e7eb' },
                { label: 'Auto renew', value: activePlan.auto_renew === '1' ? 'Enabled' : 'Disabled',
                  color: activePlan.auto_renew === '1' ? '#34d399' : '#6b7280' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl p-3"
                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ color: '#4b5563', fontSize: 11, margin: '0 0 4px' }}>{label}</p>
                  <p style={{ color, fontSize: 13, fontWeight: 600, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="rounded-xl p-4 mb-5"
                 style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { label: 'Gateway',         value: paymentResult.gateway.charAt(0).toUpperCase() + paymentResult.gateway.slice(1) },
                { label: 'Subscription ID', value: `#${paymentResult.subscription_id}` },
                { label: 'Status',          value: 'Approved ✓', color: '#34d399' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between text-xs py-1.5"
                     style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#4b5563' }}>{label}</span>
                  <span style={{ color: color || '#e5e7eb', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/layoutDashboard')}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', cursor: 'pointer' }}
            >
              Go to Dashboard
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* Failed CTA */}
        {!isSuccess && (
          <div className="relative z-10 px-6 py-5">
            <button
              onClick={() => navigate('/upgrade')}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: 'rgba(239,68,68,0.8)', border: 'none', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}