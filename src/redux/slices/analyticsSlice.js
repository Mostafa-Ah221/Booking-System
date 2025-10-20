import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appointments: [],
  interviews: [],
  recruiters: [],
  clients: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({ 
  name: "analytics",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setAppointments(state, action) {
      state.appointments = action.payload;
    },
    setInterviews(state, action) {
      state.interviews = action.payload;
    },
    setRecruiters(state, action) {
      state.recruiters = action.payload;
    },
    setClients(state, action) {
      state.clients = action.payload;
    },
  },
});

export const analyticsActions = analyticsSlice.actions;
export default analyticsSlice.reducer;
