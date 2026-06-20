import axios from "axios";
import { subscriptionActions } from "../slices/subscriptionSlice";

const BASE_URL = "https://api.appointroll.com/api";

export function fetchMyPlan() {
  return async (dispatch) => {
    dispatch(subscriptionActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${BASE_URL}/my-plan`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      console.log("my-plan response:", response.data); 

      if (response.data) {
        dispatch(subscriptionActions.setPlan(response.data.data));
        dispatch(subscriptionActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch plan:", err);
      dispatch(subscriptionActions.setError("Failed to load plan"));
    } finally {
      dispatch(subscriptionActions.setLoading(false));
    }
  };
}

export function upgradeSubscription(payload) {
  return async (dispatch) => {
    dispatch(subscriptionActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(`${BASE_URL}/subscription/upgrade`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data && response.data.status) {
        dispatch(subscriptionActions.setUpgradeResult(response.data.data));
        dispatch(subscriptionActions.setError(null));
        if (response.data.data?.payment_url) {
          window.location.href = response.data.data.payment_url;
        }
      }
    } catch (err) {
      console.error("Failed to upgrade subscription:", err);
      dispatch(subscriptionActions.setError("Failed to upgrade subscription"));
    } finally {
      dispatch(subscriptionActions.setLoading(false));
    }
  };
}

export function fetchPaymentResult(subscriptionId) {
  return async (dispatch) => {
    dispatch(subscriptionActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${BASE_URL}/subscription/payment-result?subscription_id=${subscriptionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data) {
        dispatch(subscriptionActions.setPaymentResult(response.data.data));
        dispatch(subscriptionActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch payment result:", err);
      dispatch(subscriptionActions.setError("Failed to fetch payment result"));
    } finally {
      dispatch(subscriptionActions.setLoading(false));
    }
  };
}

export function fetchSubscriptionInvoices() {
  return async (dispatch) => {
    dispatch(subscriptionActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${BASE_URL}/subscription/invoices`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data) {
        dispatch(subscriptionActions.setInvoices(response.data.data));
        dispatch(subscriptionActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      dispatch(subscriptionActions.setError("Failed to fetch invoices"));
    } finally {
      dispatch(subscriptionActions.setLoading(false));
    }
  };
}

export function cancelSubscription() {
  return async (dispatch) => {
    dispatch(subscriptionActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${BASE_URL}/subscription/cancel`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data) {
        dispatch(subscriptionActions.setPlan(null));
        dispatch(subscriptionActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      dispatch(subscriptionActions.setError("Failed to cancel subscription"));
    } finally {
      dispatch(subscriptionActions.setLoading(false));
    }
  };
}