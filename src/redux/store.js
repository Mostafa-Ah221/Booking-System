import { configureStore } from '@reduxjs/toolkit';
import { interviewReducer } from './slices/interviewsSlice';
import { workspaceReducer } from './slices/workspaceSlice';
import { smsReducer } from './slices/smsSlice';
import { whatsAppReducer } from './slices/whatsAppSlice';
import { appointmentReducer } from './slices/appointmentsSlice'; 
import navigationReducer from './slices/navigationSlice';
import { profileReducer } from './slices/profileSlice'; 
import { customerReducer } from './slices/customersSlice'; 
import { recruiterReducer } from './slices/recruitersSlice'; 
import { rolesReducer } from './slices/rolesSlice'; 
import { permissionsReducer } from './slices/permissionsSlice'; 
import { authReducer } from "./slices/authSlice";
import analyticsReducer from "./slices/analyticsSlice";
import { emailReducer } from './slices/EmailConfigSlice';
import { staffReducer } from './slices/staffSlice';


const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    auth: authReducer,
    interview: interviewReducer,
    workspace: workspaceReducer,
    sms: smsReducer,
    appointments: appointmentReducer, 
    whatsApp: whatsAppReducer,
    navigation: navigationReducer,
    profileData: profileReducer,
    customers: customerReducer, 
    recruiters: recruiterReducer, 
    roles: rolesReducer,
    permissions: permissionsReducer,
    emailConfig: emailReducer,
    staff: staffReducer
  },
});

export default store;
