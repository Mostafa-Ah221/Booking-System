import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    settings: null,            
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    setSettings(state, action) {
      state.settings = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSuccess(state, action) {
      state.success = action.payload;
    },
    clearMessages(state) {
      state.success = null;
      state.error = null;
    },
    clearSettings(state) {
      state.settings = null;
    },
  },
});

export const emailActions = emailSlice.actions;
export const emailReducer = emailSlice.reducer;