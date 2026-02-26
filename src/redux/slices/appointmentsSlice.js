import { createSlice } from "@reduxjs/toolkit";

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    appointment: null,
     pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAppointments(state, action) {
      const incomingData = action.payload;
      if (incomingData && typeof incomingData === 'object') {
        if (Array.isArray(incomingData)) {
          // Direct array
          state.appointments = incomingData;
        } else if (incomingData.appointments && Array.isArray(incomingData.appointments)) {
          // Object with appointments property
          state.appointments = incomingData.appointments;
        } else if (incomingData.data && Array.isArray(incomingData.data)) {
          // Object with data property
          state.appointments = incomingData.data;
        } else {
          // Fallback: treat as empty array
          console.warn('Unexpected appointments data structure:', incomingData);
          state.appointments = [];
        }
      } else {
        // If null, undefined, or not an object
        state.appointments = [];
      }
      
      // console.log('✅ Final appointments array:', state.appointments);
    },
     setPagination: (state, action) => {
      state.pagination = action.payload; 
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
      if (Array.isArray(state.appointments)) {
        state.appointments = state.appointments.filter((a) => a.id !== action.payload);
      } else {
        console.error('state.appointments is not an array:', state.appointments);
        state.appointments = [];
      }
    },
    addAppointment(state, action) {
      // Ensure appointments is always an array
      if (!Array.isArray(state.appointments)) {
        state.appointments = [];
      }
      state.appointments.push(action.payload);
    },
    updateAppointment(state, action) {
      // Ensure appointments is always an array
      if (!Array.isArray(state.appointments)) {
        state.appointments = [];
        return;
      }
      
      const index = state.appointments.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = { ...state.appointments[index], ...action.payload };
      }
    },
    // Clear all appointments
    clearAppointments(state) {
      state.appointments = [];
      state.appointment = null;
      state.error = null;
    }
  },
});

export const appointmentActions = appointmentsSlice.actions;
export const appointmentReducer = appointmentsSlice.reducer;