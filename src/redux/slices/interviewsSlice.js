import { createSlice } from "@reduxjs/toolkit";

const interviewsSlice = createSlice({
  name: "interviews",
  initialState: {
    interviews: [],
    interview: null,
    availability: null,
    unavailability: null,
    notifications: null, // إضافة state للـ notifications
    loading: false,
    error: null,
  },
  reducers: {
    setInterviews(state, action) {
      state.interviews = action.payload;
    },
    setInterview(state, action) {
      state.interview = action.payload;
    },
    setAvailability(state, action) {
      state.availability = action.payload;
    },
    setUnAvailability(state, action) {
      state.unavailability = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload; // إضافة reducer للـ notifications
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    removeInterview(state, action) {
      state.interviews = state.interviews.filter(
        (interview) => interview.id !== action.payload
      );
    },
    // إضافة reducer لتحديث notifications في interview محدد
    updateInterviewNotifications(state, action) {
      const { interviewId, notifications } = action.payload;
      if (state.interview && state.interview.id === interviewId) {
        state.interview.notifications = notifications;
      }
      // تحديث في قائمة الـ interviews كمان
      const interviewIndex = state.interviews.findIndex(
        (interview) => interview.id === interviewId
      );
      if (interviewIndex !== -1) {
        state.interviews[interviewIndex].notifications = notifications;
      }
    },
  }
});

const interviewAction = interviewsSlice.actions;
const interviewReducer = interviewsSlice.reducer;

export { interviewAction, interviewReducer };