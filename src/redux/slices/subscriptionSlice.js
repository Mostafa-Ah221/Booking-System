import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plan: null,
  upgradeResult: null,
  paymentResult: null,
  invoices: null, 
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setPlan(state, action) {
      state.plan = action.payload;
    },
    setUpgradeResult(state, action) {
      state.upgradeResult = action.payload;
    },
    setPaymentResult(state, action) {
      state.paymentResult = action.payload;
    },
    setInvoices(state, action) {
  state.invoices = action.payload;
},
  },
});

export const subscriptionActions = subscriptionSlice.actions;
export default subscriptionSlice.reducer;