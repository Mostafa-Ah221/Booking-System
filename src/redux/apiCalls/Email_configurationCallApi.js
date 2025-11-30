import axiosInstance from "../../Components/pages/axiosInstance";
import { emailActions } from "../slices/EmailConfigSlice";
import toast from "react-hot-toast";

export function fetchEmailSettings() {
  return async (dispatch) => {
    dispatch(emailActions.setLoading(true));
    try {
      const response = await axiosInstance.get('/email-config/settings');

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
      const response = await axiosInstance.post('/email-config/store', payload);

      if (response.data.status) {
        dispatch(emailActions.setSuccess(response.data.message));
        dispatch(emailActions.setSettings(response.data.data));
        toast.success(response.data.message);
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
      const response = await axiosInstance.delete(`/email-config/delete/${id}`);

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