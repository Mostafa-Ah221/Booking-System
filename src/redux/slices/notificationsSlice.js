import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: null,
        preferences: [],
        preferencesEmail: [],
        unreadCount: 0,
        loading: false,
        error: null,
        success: null, 
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = {
                notifications: action.payload.notifications,
                pagination: action.payload.pagination,
            };
            state.loading = false;
        },

        setPreferences(state, action){
            state.preferences = action.payload
        },
        setPreferencesEmail(state, action){
            state.preferencesEmail = action.payload
        },
        
 updatePreferencesLocally(state, action) {
  const { preferences } = action.payload;
  
  if (!preferences || !Array.isArray(preferences)) return;
  
  preferences.forEach(updatedPref => {
    const index = state.preferences?.preferences?.findIndex(
      p => p.notification_type === updatedPref.notification_type
    );
    
    if (index !== -1 && state.preferences?.preferences) {
      state.preferences.preferences[index] = {
        ...state.preferences.preferences[index],
        push_enabled: updatedPref.push_enabled ? "1" : "0"
      };
    }
  });
},
 updateEmailSettingsLocally(state, action) {
            const emailSettings = action.payload;
            
            console.log('🔄 Updating email settings locally:', emailSettings);
            console.log('📦 Current preferencesEmail:', state.preferencesEmail);
            
            if (!state.preferencesEmail) {
                console.warn('⚠️ No preferencesEmail to update');
                return;
            }
            
            // Update the preferencesEmail object directly
            Object.keys(emailSettings).forEach(key => {
                if (key === 'email_language') {
                    state.preferencesEmail.email_language = emailSettings[key];
                } else if (key.startsWith('appointment_')) {
                    // Update appointment settings: true/false -> "1"/"0"
                    state.preferencesEmail[key] = emailSettings[key] ? "1" : "0";
                }
            });
            
            console.log('✅ Updated preferencesEmail:', state.preferencesEmail);
        },
        
        setUnreadCount(state, action){
            state.unreadCount = action.payload
        },
        markAllNotificationsRead(state) {
            if (state.notifications?.notifications?.notifications) {
                state.notifications.notifications.notifications = 
                    state.notifications.notifications.notifications.map(notification => ({
                        ...notification,
                        is_read: true
                    }));
            }
            state.unreadCount = 0;
        },
        
        markSingleNotificationRead(state, action) {
            const notificationId = action.payload;
            if (state.notifications?.notifications?.notifications) {
                state.notifications.notifications.notifications = 
                    state.notifications.notifications.notifications.map(notification => 
                        notification.id === notificationId 
                            ? { ...notification, is_read: true }
                            : notification
                    );
            }
            if (state.unreadCount > 0) {
                state.unreadCount -= 1;
            }
        },
        
        setLoading(state, action){
            state.loading = action.payload
        },
        
        setError(state, action){
            state.error = action.payload
        },
        
        setSuccess(state, action) {       
            state.success = action.payload;
        },
        
        resetSuccess(state) {
            state.success = null;
        },
        
        resetError(state) {
            state.error = null;
        },
    },
});

export const notificationsActions = notificationsSlice.actions
export const notificationsReducer = notificationsSlice.reducer