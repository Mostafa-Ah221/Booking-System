import { createSlice } from "@reduxjs/toolkit";

const whatsappSlice = createSlice({
  name: 'whatsapp',
  initialState: {
    settings:             null,
    phoneNumbers:         [],
    templates:            [],
    loading:              false,
    error:                null,
    notificationSettings: null, // ✅ { appointment_created: { template_id, phone_number_id, ... }, ... }
    selectedConfig: {
      phone_number_id: null,
      status_templates: {
        appointment_created:     null,
        appointment_cancelled:   null,
        appointment_rescheduled: null,
        appointment_reminder:    null,
      },
    },
  },
  reducers: {
    setSettings(state, action) {
      state.settings = action.payload;
    },
    setPhoneNumbers(state, action) {
      state.phoneNumbers = action.payload;
    },
    setTemplates(state, action) {
      state.templates = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    // ✅ بيحفظ phone_number_id + status_templates
    setSelectedConfig(state, action) {
      state.selectedConfig = action.payload;
    },
    setNotificationSettings(state, action) {
      state.notificationSettings = action.payload;
    },
  },
});

export const whatsappActions = whatsappSlice.actions;
export const whatsappReducer = whatsappSlice.reducer;