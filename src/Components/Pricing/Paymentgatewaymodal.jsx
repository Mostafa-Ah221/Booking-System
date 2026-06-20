// PaymentGatewayModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ✅ PayPal  → SDK popup جوّه الـ Modal
//             create-order: POST /api/subscription/paypal/create-order { plan }
//             capture-order: POST /api/subscription/paypal/capture-order { order_id, subscription_id }
// 🚫 Paymob  → commented out مؤقتاً
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PayPalButton from './PayPalButton';

// ─── Icons ────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M7 1L2 3v4c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V3L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M5 7l1.5 1.5L9 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#f0fdf4" />
    <circle cx="24" cy="24" r="18" fill="#dcfce7" />
    <path d="M16 24l6 6 10-12" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function PaymentGatewayModal({ isOpen, onClose, plan }) {
  const loading = useSelector((state) => state.subscription?.loading ?? false);

  const [error,       setError]       = useState(null);
  const [paypalState, setPaypalState] = useState('idle'); // 'idle' | 'success'
  const [shaking,     setShaking]     = useState(false);

  const handleClose = () => {
    if (loading) return;
    setError(null);
    setPaypalState('idle');
    onClose();
  };

  // ── Backdrop → shake بدل close ───────────────────────────────────────────
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && !loading) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  // ── capture ─────────────────────────────────────────────────
  const handlePayPalSuccess = () => {
    setPaypalState('success');
    setTimeout(() => {
      window.location.href = '/layoutDashboard';
    }, 2000);
  };

  const handlePayPalError = () => {
    setError('Payment failed via PayPal. Please try another method or try again.');
  };

  if (!isOpen || !plan) return null;

  return (
    <>
      <style>{`
        @keyframes shakeModal {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-8px) rotate(-0.5deg); }
          30%  { transform: translateX(8px)  rotate(0.5deg); }
          45%  { transform: translateX(-6px) rotate(-0.3deg); }
          60%  { transform: translateX(6px)  rotate(0.3deg); }
          75%  { transform: translateX(-3px); }
          90%  { transform: translateX(3px); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(17,24,39,0.45)', backdropFilter: 'blur(6px)' }}
        onClick={handleBackdrop}
      >
        <div
          className="relative w-full max-w-md rounded-3xl"
          style={{
            background: '#ffffff',
            border    : '1px solid #e5e7eb',
            boxShadow : '0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(74,59,182,0.06)',
            maxHeight : 'calc(100vh - 32px)',
            overflowY : 'auto',
            animation : shaking ? 'shakeModal 0.5s ease' : 'none',
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-1 w-full sticky top-0 z-10"
            style={{ background: 'linear-gradient(90deg, #4a3bb6, #818cf8)' }}
          />

          {/* ── Header ── */}
          <div
            className="flex items-start justify-between px-6 pt-5 pb-4"
            style={{ borderBottom: '1px solid #f3f4f6' }}
          >
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#111827' }}>
                {paypalState === 'success' ? 'Payment Successful!' : 'Complete Payment'}
              </h2>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                {paypalState === 'success'
                  ? 'Redirecting you to your dashboard…'
                  : <>Pay for the{' '}
                      <span style={{ color: '#4a3bb6', fontWeight: 600 }}>{plan.name}</span> plan via PayPal
                    </>
                }
              </p>
            </div>

            <button
              onClick={handleClose}
              disabled={loading || paypalState === 'success'}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all mt-0.5"
              style={{
                color     : '#9ca3af',
                background: '#f9fafb',
                border    : '1px solid #e5e7eb',
                cursor    : (loading || paypalState === 'success') ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#f3f4f6'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* ══ حالة النجاح ════════════════════════════════════════════════════ */}
          {paypalState === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
              <CheckCircleIcon />
              <p className="text-base font-bold text-gray-900 text-center">
                Payment completed successfully!
              </p>
              <p className="text-sm text-gray-400 text-center">
                Your <strong className="text-[#4a3bb6]">{plan.name}</strong> plan is now active.
              </p>
            </div>
          )}

          {/* ══ الحالة الطبيعية ════════════════════════════════════════════════ */}
          {paypalState !== 'success' && (
            <>
              {/* Selected plan summary */}
              <div className="mx-6 mt-5">
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#7c3aed' }}>
                      Selected Plan
                    </p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: '#111827' }}>{plan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold" style={{ color: '#111827' }}>${plan.price}</p>
                    <p className="text-[11px]" style={{ color: '#9ca3af' }}>per staff / mo</p>
                  </div>
                </div>
              </div>

              {/* ══ PayPal SDK مباشرةً ══════════════════════════════════════════ */}
              <div className="px-6 mt-5 pb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#d1d5db' }}>
                  Complete with PayPal
                </p>

                <PayPalButton
                  planId={plan.id}
                  amount={String(plan.price)}
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                />

                {/* Error */}
                {error && (
                  <div
                    className="mt-4 px-4 py-3 rounded-xl text-xs font-medium"
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
                  >
                    ⚠ {error}
                  </div>
                )}

                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <span style={{ color: '#9ca3af' }}><ShieldIcon /></span>
                  <p className="text-[11px]" style={{ color: '#9ca3af' }}>
                    256-bit SSL encryption · Your data is safe
                  </p>
                </div>
              </div>

              {/* ══ Paymob - commented out مؤقتاً ════════════════════════════
              <GatewayOption
                id="paymob"
                label="Paymob"
                description="Pay with card, Fawry, Vodafone Cash & more"
                logo={<PaymobLogo />}
                selected={gateway}
                onSelect={setGateway}
              />
              ════════════════════════════════════════════════════════════════ */}
            </>
          )}
        </div>
      </div>
    </>
  );
}