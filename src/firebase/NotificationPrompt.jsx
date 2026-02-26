// NotificationPrompt.js
import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { requestNotificationPermissionAndToken } from '../firebase';
import axios from 'axios';

const NotificationPrompt = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ الحل: فحص وجود Notification API أولاً
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        setShow(true);
      }
    } else {
      // المتصفح لا يدعم الإشعارات (مثل iOS Safari القديم)
      console.log('Notification API not supported on this device');
      setShow(false);
    }
  }, []);

  const handleEnableNotifications = async () => {
    // ✅ فحص إضافي قبل محاولة طلب الإذن
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      setShow(false);
      return;
    }

    setLoading(true);
    try {
      const fcmToken = await requestNotificationPermissionAndToken();
      
      if (fcmToken) {
        // أرسل الـ token للـ backend
        const accessToken = localStorage.getItem('access_token');
        await axios.post(
          'https://backend-booking.appointroll.com/api/update-fcm-token',
          {
            fcm_token: fcmToken,
            device_type: 'web'
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setShow(false);
      } else {
        // لو ما جبناش token، نخفي الـ prompt
        setShow(false);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      setShow(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ لو الجهاز مش بيدعم الإشعارات، ما نعرضش حاجة
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-slide-up">
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Enable Notifications
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Get instant updates about your bookings and appointments
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleEnableNotifications}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Enabling...' : 'Enable'}
            </button>
            <button
              onClick={() => setShow(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;