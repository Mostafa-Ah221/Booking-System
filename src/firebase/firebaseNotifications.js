
import { useEffect } from "react";
import { onMessageListener, setupNotificationListener } from "../firebase"; 

export const useFirebaseNotifications = () => {
  useEffect(() => {
    setupNotificationListener();

    onMessageListener()
      .then((payload) => {
      })
      .catch((err) => console.error("FCM Error:", err));

  }, []);
};