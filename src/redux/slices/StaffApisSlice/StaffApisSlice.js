import { createSlice } from "@reduxjs/toolkit";

const staffApisSlice = createSlice({
  name: "staffApis",
  initialState: {
    staffData: null,  
    staff_appointments: [],
    staff_appointment: null,
    staff_interviews: [],
    staff_workspaces: [],
    share_link: null,
    loading: false,
    error: null,
  },
  reducers: {
    setStaff(state, action) { 
      state.staffData = action.payload;
    },
    setStaff_appointments(state, action) {
      const incomingData = action.payload;
      
      if (!incomingData) {
        state.staff_appointments = [];
        return;
      }

      if (Array.isArray(incomingData)) {
        state.staff_appointments = incomingData;
      } else if (incomingData.appointments && Array.isArray(incomingData.appointments)) {
        state.staff_appointments = incomingData.appointments;
      } else if (incomingData.data && Array.isArray(incomingData.data)) {
        state.staff_appointments = incomingData.data;
      } else {
        console.warn('Unexpected appointments data structure:', incomingData);
        state.staff_appointments = [];
      }
    },
    setStaff_appointment(state, action) {
      state.staff_appointment = action.payload;
    },
    setStaff_interviews(state, action) {
      console.log('🔵 Reducer received:', action.payload);
      
      if (Array.isArray(action.payload)) {
        state.staff_interviews = action.payload;
      } else if (action.payload?.interviews) {
        state.staff_interviews = action.payload.interviews;
      } else {
        state.staff_interviews = [];
      }
      
      console.log('🟢 Reducer set interviews to:', state.staff_interviews);
    },
    setStaff_workspaces(state, action) {
      console.log('🔵 Workspaces Reducer received:', action.payload);
      
      if (Array.isArray(action.payload)) {
        state.staff_workspaces = action.payload;
      } else if (action.payload?.workspaces && Array.isArray(action.payload.workspaces)) {
        state.staff_workspaces = action.payload.workspaces;
      } else if (action.payload?.data?.workspaces && Array.isArray(action.payload.data.workspaces)) {
        state.staff_workspaces = action.payload.data.workspaces;
      } else {
        console.warn('⚠️ Unexpected workspaces data structure:', action.payload);
        state.staff_workspaces = [];
      }
      
      console.log('🟢 Workspaces set to:', state.staff_workspaces.length, 'items');
    },
    updateStaffShareLink(state, action) {
      state.share_link = action.payload;
    },
    updateAppointmentInList(state, action) {
      const updatedAppointment = action.payload;
      const index = state.staff_appointments.findIndex(
        app => app.id === updatedAppointment.id
      );
      
      if (index !== -1) {
        state.staff_appointments[index] = {
          ...state.staff_appointments[index],
          ...updatedAppointment
        };
      }
    },
    removeAppointment(state, action) {
      if (Array.isArray(state.staff_appointments)) {
        state.staff_appointments = state.staff_appointments.filter((a) => a.id !== action.payload);
      } else {
        console.error('state.appointments is not an array:', state.staff_appointments);
        state.staff_appointments = [];
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const staffApisActions = staffApisSlice.actions;
export const staffApisReducer = staffApisSlice.reducer;