import { notificationsActions } from "../slices/notificationsSlice";
import axiosInstance from "../../Components/pages/axiosInstance";


export const getNotifications = (page = 1, filters = {}) => async (dispatch) => {
  dispatch(notificationsActions.setLoading(true));

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
    });

    if (filters.appointments !== undefined && filters.appointments !== '--') {
      queryParams.append('appointments', filters.appointments);
    }
    if (filters.clients !== undefined && filters.clients !== '--') {
      queryParams.append('clients', filters.clients);
    }
    if (filters.interviews !== undefined && filters.interviews !== '--') {
      queryParams.append('interviews', filters.interviews);
    }
    if (filters.staff !== undefined && filters.staff !== '--') {
      queryParams.append('staff', filters.staff);
    }

    const response = await axiosInstance.get(
      `/notifications/index?${queryParams.toString()}`
    );

    if (response.status === 200) {
      dispatch(
        notificationsActions.setNotifications({
          notifications: response.data.data,
          pagination: response.data.pagination,
        })
      );
    }
  } catch (error) {
    dispatch(notificationsActions.setError(error.message));
  } finally {
    dispatch(notificationsActions.setLoading(false));
  }
};


export const getPreferences = () => async (dispatch) => {
    dispatch(notificationsActions.setLoading(true));
    try {
        const response = await axiosInstance.get('/notifications/preferences/index');
        
        if (response.status === 200) {
            dispatch(notificationsActions.setPreferences(response.data.data));
        }
        dispatch(notificationsActions.setLoading(false));
    } catch (error) {
        dispatch(notificationsActions.setLoading(false));
        dispatch(notificationsActions.setError(error.message));
    }
}
export const getPreferencesEmail = () => async (dispatch) => {
    dispatch(notificationsActions.setLoading(true));
    try {
        const response = await axiosInstance.get('/notifications/email-settings');
        
        if (response.status === 200) {
            dispatch(notificationsActions.setPreferencesEmail(response.data.data));
        }
        dispatch(notificationsActions.setLoading(false));
    } catch (error) {
        dispatch(notificationsActions.setLoading(false));
        dispatch(notificationsActions.setError(error.message));
    }
}

export const getUnreadCount = () => async (dispatch) => {
    dispatch(notificationsActions.setLoading(true));
    try {
        const response = await axiosInstance.get('/notifications/unread-count');
        
        if (response.status) {
            dispatch(notificationsActions.setUnreadCount(response.data.data));
        }
        dispatch(notificationsActions.setLoading(false));
    } catch (error) {
        dispatch(notificationsActions.setLoading(false));
        dispatch(notificationsActions.setError(error.message));
    }
}

export const markNotificationAsRead = (id) => async (dispatch) => {
    dispatch(notificationsActions.setLoading(true));
    try {
        const response = await axiosInstance.post(
            `/notifications/${id}/read`, 
            {}
        );
        
        if (response.status === 200) {
            dispatch(notificationsActions.setUnreadCount(response.data.data));
            
        }
        dispatch(notificationsActions.setLoading(false));
    } catch (error) {
        dispatch(notificationsActions.setLoading(false));
        dispatch(notificationsActions.setError(error.message));
    }
}

export const markAllNotificationAsRead = () => async (dispatch) => {
    dispatch(notificationsActions.setLoading(true));
    try {
        const response = await axiosInstance.post(
            '/notifications/mark-all-read', 
            {}
        );
        
        if (response.status === 200) {
            const updatedNotifications = response.data?.data?.notifications;
            
            if (updatedNotifications) {
                dispatch(notificationsActions.setNotifications({
                    notifications: updatedNotifications.notifications,
                    pagination: updatedNotifications.pagination
                }));
            } else {
                dispatch(notificationsActions.markAllNotificationsRead());
            }
            dispatch(getUnreadCount()); 
            return true;
        }
        
        dispatch(notificationsActions.setLoading(false));
        return false;
        
    } catch (error) {
        console.error("Error marking all as read:", error);
        dispatch(notificationsActions.setLoading(false));
        dispatch(notificationsActions.setError(error.message));
        return false;
    }
}


export const UpdatePreferences = (payload) => async (dispatch) => {
    dispatch(notificationsActions.setLoading(true));
    try {
        console.log("📤 Sending to API:", JSON.stringify(payload, null, 2));
        
        const response = await axiosInstance.post(
            '/notifications/preferences/update', 
            payload
        );
        
        if (response.status === 200) {
            dispatch(notificationsActions.updatePreferencesLocally({
                preferences: [payload]
            }));
            dispatch(notificationsActions.setSuccess(response.data.message));
        }
        
        dispatch(notificationsActions.setLoading(false));
        return { 
            success: true, 
            message: response.data.message 
        };
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        dispatch(notificationsActions.setLoading(false));
        
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(notificationsActions.setError(errorMessage));
    }
}
export const UpdateEmailSettings = (payload) => async (dispatch) => {
    dispatch(notificationsActions.setLoading(true));
    try {
        
        const response = await axiosInstance.patch(
            '/notifications/email-settings', 
            payload
        );
        
        if (response.status === 200) {
            dispatch(notificationsActions.updateEmailSettingsLocally(payload));
            dispatch(notificationsActions.setSuccess(response.data.message));
        }
        
        dispatch(notificationsActions.setLoading(false));
        return { 
            success: true, 
            message: response.data.message 
        };
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        dispatch(notificationsActions.setLoading(false));
        
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(notificationsActions.setError(errorMessage));
        return { success: false, error: errorMessage };
    }
}
export const sendFCMToken = (token) => async (dispatch) => {
    try {
        const payload = {
            token: token,
            device_type: "web"
        };

        const response = await axiosInstance.post(
            '/notifications/fcm-token', 
            payload
        );

        if (response.status === 200) {
            console.log("✅ FCM Token sent successfully");
            return { success: true, data: response.data };
        }
    } catch (error) {
        console.warn("⚠️ Failed to send FCM token:", error.message);
        return { success: false, error: error.message };
    }
};

export const deleteFCMToken = (token) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(
            '/notifications/fcm-token', 
            {
                data: {
                    token: token,
                }
            }
        );

        if (response.status === 200) {
            console.log("FCM Token deleted successfully");
            return response.data;
        }
    } catch (error) {
        console.error("Failed to delete FCM token:", error);
        throw error;
    }
};