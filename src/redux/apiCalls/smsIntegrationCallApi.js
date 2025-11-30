import axiosInstance from "../../Components/pages/axiosInstance";
import { smsActions } from '../slices/smsSlice';

export function fetchSmsIntegrations() {
  return async (dispatch) => {
    dispatch(smsActions.setLoading(true));
    try {
      const response = await axiosInstance.get('/sms/integrations');

      if (response.data.status) {
        dispatch(smsActions.setIntegrations(response.data.data));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to fetch integrations");
      }
    } catch (error) {
      dispatch(smsActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(smsActions.setLoading(false));
    }
  };
}

export function getSmsSettingsByIntegrationId(integration_id) {
  return async (dispatch) => {
    dispatch(smsActions.setLoading(true));
    try {
      const response = await axiosInstance.get(`/sms/settings?integration_id=${integration_id}`);

      if (response.data.status) {
        dispatch(smsActions.setSettings(response.data.data));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to fetch SMS settings");
      }
    } catch (error) {
      dispatch(smsActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(smsActions.setLoading(false));
    }
  };
}

export function createOrUpdateSmsSettings(payload) {
  return async (dispatch) => {
    dispatch(smsActions.setLoading(true));
    try {
      const response = await axiosInstance.post('/sms/settings/store', payload);

      if (response.data.status) {
        dispatch(smsActions.setSuccess(response.data.message));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to save SMS settings");
      }
    } catch (error) {
      dispatch(smsActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(smsActions.setLoading(false));
    }
  };
}

export function deleteSmsSettings(id) {
  return async (dispatch) => {
    dispatch(smsActions.setLoading(true));
    try {
      const response = await axiosInstance.delete(`/sms/settings/${id}`);

      if (response.data.status) {
        dispatch(smsActions.setSuccess("SMS setting deleted"));
        return { status: true };
      } else {
        throw new Error("Failed to delete SMS setting");
      }
    } catch (error) {
      dispatch(smsActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(smsActions.setLoading(false));
    }
  };
}

export function fetchSmsSettings(integrationId) {
  return async (dispatch) => {
    dispatch(smsActions.setLoading(true));
    try {
      const response = await axiosInstance.get('/sms/settings', {
        params: { integration_id: integrationId },
      });

      if (response.data.status) {
        console.log("SMS response:", response.data);

        dispatch(smsActions.setSettings(response.data.data));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to fetch SMS settings");
      }
    } catch (error) {
      dispatch(smsActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(smsActions.setLoading(false));
    }
  };
}