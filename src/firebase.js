// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import store from "./redux/store";
import { getUnreadCount } from "./redux/apiCalls/NotificationsCallApi";

const firebaseConfig = {
  apiKey: "AIzaSyCo1ILMwsc5hJweJGm2W0wM1XOnR-r9sb8",
  authDomain: "appointroll.firebaseapp.com",
  projectId: "appointroll",
  storageBucket: "appointroll.firebasestorage.app",
  messagingSenderId: "591708322297",
  appId: "1:591708322297:web:3d84b7e97412ad306da528",
  measurementId: "G-XWJM22TN5P"
};

const app = initializeApp(firebaseConfig);

// ✅ فحص دعم Firebase Messaging قبل الاستخدام
let messaging = null;
try {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log('Firebase Messaging not supported:', error);
}

export { messaging };

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const swPath = `${window.location.origin}/firebase-messaging-sw.js`;
    
    let registration = await navigator.serviceWorker.getRegistration('/');
    
    if (!registration) {
      registration = await navigator.serviceWorker.register(swPath, { 
        scope: '/',
        updateViaCache: 'none' 
      });
      
      if (registration.installing) {
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') {
              resolve();
            }
          });
        });
      }
    }
    
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

export const requestForToken = async (retries = 3) => {
  // ✅ فحص شامل قبل أي شيء
  if (!messaging || !('Notification' in window)) {
    console.log('Browser does not support notifications');
    return null;
  }

  if (Notification.permission === 'denied') {
    console.log('Notification permission denied');
    return null;
  }

  if (Notification.permission === 'granted') {
    try {
      const registration = await registerServiceWorker();
      if (!registration) return null;

      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentToken = await getToken(messaging, {
        vapidKey: "BN3AKTzgmrOD997nUEHNyHbAmxDxC-KTkdInc9IGe_P8oDdpF4G_KA9T4rYd3QKcFZYcDIgD9nx1X2r4LF-aWAI",
        serviceWorkerRegistration: registration
      });

      return currentToken || null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  return null;
};

export const requestNotificationPermissionAndToken = async (retries = 3) => {
  if (!messaging || !('Notification' in window) || Notification.permission === 'denied') {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      return null;
    }

    for (let i = 0; i < retries; i++) {
      try {
        const registration = await registerServiceWorker();
        if (!registration) {
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          return null;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        const currentToken = await getToken(messaging, {
          vapidKey: "BN3AKTzgmrOD997nUEHNyHbAmxDxC-KTkdInc9IGe_P8oDdpF4G_KA9T4rYd3QKcFZYcDIgD9nx1X2r4LF-aWAI",
          serviceWorkerRegistration: registration
        });

        if (currentToken) {
          return currentToken;
        }
        
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        console.error('Error in retry attempt:', err);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
  
  return null;
};

// src/firebase.js
export const setupNotificationListener = () => {
  if (!messaging) {
    console.log('Firebase Messaging not supported on this browser');
    return;
  }

  if (!('Notification' in window)) {
    console.log('Notification API not supported');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('[Foreground] Message received:', payload);
    store.dispatch(getUnreadCount());
    
    if (typeof Notification !== 'undefined' && Notification.permission === "granted") {
      try {
        const { title, body, icon } = payload.notification || {};
        
        new Notification(title || "New notification", {
          body: body || "You have a new notification",
          icon: icon || "/logo.png",
          badge: "/badge-icon.png",
          tag: payload.data?.notification_id || 'foreground-notification', // ✅ مهم
          renotify: false, // ✅ منع التكرار
          requireInteraction: false,
        });
      } catch (error) {
        console.log('Could not show notification:', error);
      }
    }
  });
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (!messaging) {
      reject(new Error('Firebase Messaging not supported'));
      return;
    }

    onMessage(messaging, (payload) => {
      resolve(payload);
    }, (error) => {
      reject(error);
    });
  });