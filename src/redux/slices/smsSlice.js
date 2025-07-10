import { createSlice } from "@reduxjs/toolkit";

const smsSlice = createSlice({
  name: "sms",
  initialState: {
    integrations: [],           // قائمة موفري الخدمة (مثل Twilio, MessageBird)
    settings: null,             // إعدادات العميل (integration_id + config data)
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    setIntegrations(state, action) {
      state.integrations = action.payload;
    },
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

export const smsActions = smsSlice.actions;
export const smsReducer = smsSlice.reducer;
