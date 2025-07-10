import { createSlice } from "@reduxjs/toolkit";

const whatsAppSlice = createSlice({
  name: "whatsApp",
  initialState: {
    integrationsWhatsApp: [],          
    settings: null,             
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    setIntegrationsWhatsApp(state, action) {
      state.integrationsWhatsApp = action.payload;
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

export const whatsAppActions = whatsAppSlice.actions;
export const whatsAppReducer = whatsAppSlice.reducer;
