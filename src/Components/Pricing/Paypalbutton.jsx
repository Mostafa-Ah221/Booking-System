// PayPalButton.jsx
import React, { useEffect, useRef, useState } from 'react';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const PAYPAL_SDK_URL   = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;

let sdkPromise = null;

function loadPayPalSDK() {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    if (window.paypal) { resolve(window.paypal); return; }

    const script    = document.createElement('script');
    script.src      = PAYPAL_SDK_URL;
    script.async    = true;
    script.onload   = () => resolve(window.paypal);
    script.onerror  = () => reject(new Error('Failed to load PayPal SDK'));
    document.head.appendChild(script);
  });

  return sdkPromise;
}

const PayPalButton = ({ planId, amount, onSuccess, onError }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const paypal = await loadPayPalSDK();
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = '';

        await paypal.Buttons({

          style: {
            layout: 'vertical',
            color : 'blue',
            shape : 'rect',
            label : 'pay',
            height: 48,
          },

          createOrder: async () => {
            const res = await fetch(
              'https://api.appointroll.com/api/subscription/paypal/create-order',
              {
                method : 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization : `${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ plan: planId }),
              }
            );

            if (!res.ok) throw new Error('Failed to create PayPal order');

            const json = await res.json();
            window.__paypal_subscription_id__ = json.data.subscription_id;
console.log('Create Order Response:', json); 
            return json.data.order_id;
          },

          onApprove: async (data) => {
             console.log('PayPal data:', data);
  console.log('Subscription ID:', window.__paypal_subscription_id__);
            const res = await fetch(
              'https://api.appointroll.com/api/subscription/paypal/capture-order',
              {
                method : 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization : `${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                  order_id       : data.orderID,
                  subscription_id: window.__paypal_subscription_id__,
                }),
              }
            );

            if (!res.ok) throw new Error('Failed to capture PayPal order');

            const result = await res.json();
            onSuccess?.(result);
          },

          onCancel: () => {
            console.info('PayPal payment cancelled by user');
          },

          onError: (err) => {
            console.error('PayPal error:', err);
            setErrMsg('Payment failed. Please try again.');
            onError?.(err);
          },

        }).render(containerRef.current);

        if (!cancelled) setStatus('ready');

      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setErrMsg('Unable to load PayPal. Please check your connection and try again.');
          onError?.(err);
        }
      }
    };

    init();
    return () => { cancelled = true; };
  }, [planId]);

  return (
    <div className="w-full">

      {status === 'loading' && (
        <div className="h-12 rounded-lg bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-xs text-gray-400">Loading PayPal...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center px-4">
          <span className="text-xs text-red-500">{errMsg}</span>
        </div>
      )}

      {errMsg && status === 'ready' && (
        <p className="text-xs text-red-500 text-center mt-2">{errMsg}</p>
      )}

      <div
        ref={containerRef}
        className={status === 'loading' ? 'hidden' : 'w-full'}
      />

    </div>
  );
};

export default PayPalButton;