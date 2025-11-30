// src/firebase/firebaseNotifications.js
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { requestForToken, onMessageListener } from "../firebase"; 

export const useFirebaseNotifications = () => {
  useEffect(() => {
    requestForToken();

    onMessageListener()
      .then((payload) => {
        console.log(payload.notification?.title || "New Notification!");
      })
      .catch((err) => console.error("FCM Error:", err));

  }, []);
};