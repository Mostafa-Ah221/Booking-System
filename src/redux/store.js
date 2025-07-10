import { configureStore } from '@reduxjs/toolkit';
import { interviewReducer } from './slices/interviewsSlice';
import { workspaceReducer } from './slices/workspaceSlice';
import { smsReducer } from './slices/smsSlice';
import { whatsAppReducer } from './slices/whatsAppSlice';
import { appointmentReducer } from './slices/appointmentsSlice'; // ✅ استدعاء الـ reducer الجديد

const store = configureStore({
  reducer: {
    interview: interviewReducer,
    workspace: workspaceReducer,
    sms: smsReducer,
    appointments: appointmentReducer, 
    whatsApp:whatsAppReducer
  },
});

export default store;
