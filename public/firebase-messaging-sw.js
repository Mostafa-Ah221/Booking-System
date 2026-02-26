// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCo1ILMwsc5hJweJGm2W0wM1XOnR-r9sb8",
  authDomain: "appointroll.firebaseapp.com",
  projectId: "appointroll",
  storageBucket: "appointroll.firebasestorage.app",
  messagingSenderId: "591708322297",
  appId: "1:591708322297:web:3d84b7e97412ad306da528",
  measurementId: "G-XWJM22TN5P"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/firebase-logo.png",
    badge: "/badge-icon.png",
    tag: payload.data?.notification_id || 'default-notification', 
    renotify: false, 
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});