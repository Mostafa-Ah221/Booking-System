import { createSlice } from "@reduxjs/toolkit";

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [], // هذا هو المصفوفة الأساسية
    appointment: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAppointments(state, action) {
      // التأكد من أن البيانات الواردة هي مصفوفة
      const incomingData = action.payload;
      
      // إذا كانت البيانات object يحتوي على appointments
      if (incomingData && typeof incomingData === 'object' && incomingData.appointments) {
        state.appointments = Array.isArray(incomingData.appointments) ? incomingData.appointments : [];
      } 
      // إذا كانت البيانات مصفوفة مباشرة
      else if (Array.isArray(incomingData)) {
        state.appointments = incomingData;
      } 
      // حالة احتياطية
      else {
        console.warn('Unexpected appointments data structure:', incomingData);
        state.appointments = [];
      }
    },
    setAppointment(state, action) {
      state.appointment = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    removeAppointment(state, action) {
      // إضافة فحص أمان قبل استخدام filter
      if (Array.isArray(state.appointments)) {
        state.appointments = state.appointments.filter((a) => a.id !== action.payload);
      } else {
        console.error('state.appointments is not an array:', state.appointments);
        // إعادة تعيين كمصفوفة فارغة إذا لم تكن مصفوفة
        state.appointments = [];
      }
    },
    // إضافة reducer جديد لإضافة موعد
    addAppointment(state, action) {
      if (Array.isArray(state.appointments)) {
        state.appointments.push(action.payload);
      } else {
        state.appointments = [action.payload];
      }
    },
    // إضافة reducer لتحديث موعد
    updateAppointment(state, action) {
      if (Array.isArray(state.appointments)) {
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      }
    }
  },
});

export const appointmentActions = appointmentsSlice.actions;
export const appointmentReducer = appointmentsSlice.reducer;