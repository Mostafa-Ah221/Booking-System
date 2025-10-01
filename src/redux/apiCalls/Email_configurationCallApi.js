import axios from "axios";
import { emailActions } from "../slices/EmailConfigSlice";
import toast from "react-hot-toast";

const BASE_URL = "https://backend-booking.appointroll.com/api/email-config";

export function fetchEmailSettings() {
  return async (dispatch) => {
    dispatch(emailActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${BASE_URL}/settings`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status) {
        dispatch(emailActions.setSettings(response.data.data));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to fetch email settings");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      dispatch(emailActions.setError(errorMessage));
      return { status: false, message: errorMessage };
    } finally {
      dispatch(emailActions.setLoading(false));
    }
  };
}

export function createOrUpdateEmailSettings(payload) {
  return async (dispatch) => {
    dispatch(emailActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.post(`${BASE_URL}/store`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data.status) {
        dispatch(emailActions.setSuccess(response.data.message));
        dispatch(emailActions.setSettings(response.data.data));
        toast.success(response.data.message );
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to save email settings");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      dispatch(emailActions.setError(errorMessage));
      return { status: false, message: errorMessage };
    } finally {
      dispatch(emailActions.setLoading(false));
    }
  };
}

export function deleteEmailSettings(id) {
  return async (dispatch) => {
    dispatch(emailActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
         
      });

      if (response.data.status) {
        dispatch(emailActions.setSuccess("Email settings deleted successfully"));
        dispatch(emailActions.clearSettings());
        
        toast.success("Email settings deleted successfully");
        return { status: true };
      } else {
        throw new Error("Failed to delete email settings");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      dispatch(emailActions.setError(errorMessage));
      return { status: false, message: errorMessage };
    } finally {
      dispatch(emailActions.setLoading(false));
    }
  };
}

