import { createSlice } from '@reduxjs/toolkit';

const verificationSlice = createSlice({
  name: 'verification',
  initialState: {
    verifiedAppointments: {}, 
    currentAppointmentId: null,
  },
  reducers: {
    setVerificationStatus: (state, action) => {
      const { appointmentId, isVerified } = action.payload;
      state.verifiedAppointments[appointmentId] = isVerified;
      if (isVerified) {
        state.currentAppointmentId = appointmentId;
      }
    },
    clearVerification: (state, action) => {
      const { appointmentId } = action.payload;
      delete state.verifiedAppointments[appointmentId];
      if (state.currentAppointmentId === appointmentId) {
        state.currentAppointmentId = null;
      }
    },
    clearAllVerifications: (state) => {
      state.verifiedAppointments = {};
      state.currentAppointmentId = null;
    }
  }
});

export const { 
  setVerificationStatus, 
  clearVerification, 
  clearAllVerifications 
} = verificationSlice.actions;

export default verificationSlice.reducer;

// Selectors
export const selectIsAppointmentVerified = (state, appointmentId) => 
  state.verification.verifiedAppointments[appointmentId] || false;

export const selectCurrentVerifiedAppointment = (state) => 
  state.verification.currentAppointmentId;