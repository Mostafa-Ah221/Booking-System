// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import store from "./redux/store";
import { sendFCMToken } from "./redux/apiCalls/NotificationsCallApi";
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
export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: "BN3AKTzgmrOD997nUEHNyHbAmxDxC-KTkdInc9IGe_P8oDdpF4G_KA9T4rYd3QKcFZYcDIgD9nx1X2r4LF-aWAI",
      });

      if (currentToken) {
        console.log("✅ FCM Token:", currentToken);
        
        store.dispatch(sendFCMToken(currentToken)).catch(() => {
        });
        
        return currentToken;
      } else {
        console.log(" No token available.");
      }
    } else {
      console.log(" Notification permission denied.");
    }
  } catch (err) {
    console.error(" Error retrieving token:", err);
  }
};

export const setupNotificationListener = () => {
  onMessage(messaging, (payload) => {
    console.log("🔔 إشعار جديد وصل:", payload);
    
    // ✅ تحديث العداد فوراً
    store.dispatch(getUnreadCount());
    
    // ✅ عرض إشعار في المتصفح
    if (Notification.permission === "granted") {
      const { title, body, icon } = payload.notification || {};
      
      new Notification(title || "إشعار جديد", {
        body: body || "لديك إشعار جديد",
        icon: icon || "/logo.png",
        badge: "/badge-icon.png",
        tag: payload.data?.notification_id || Date.now().toString(),
        requireInteraction: false, // الإشعار يختفي تلقائياً
      });
    }
  });
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    }, (error) => {
      reject(error);
    });
  });