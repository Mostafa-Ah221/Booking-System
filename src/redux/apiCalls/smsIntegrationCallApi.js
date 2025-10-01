import axios from "axios";
import { smsActions } from '../slices/smsSlice'; 
const BASE_URL = "https://backend-booking.appointroll.com/api/sms/settings";
const GET_INTEGRATIONS_URL = "https://backend-booking.appointroll.com/api/sms/integrations";


export function fetchSmsIntegrations() {
  return async (dispatch) => {
    dispatch(smsActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(GET_INTEGRATIONS_URL, {
        headers: {
          Authorization: token,
        },
      });

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
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${BASE_URL}?integration_id=${integration_id}`, {
        headers: {
          Authorization: token,
        },
      });

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
      const token = localStorage.getItem("access_token");

      const response = await axios.post(`https://backend-booking.appointroll.com/api/sms/settings/store`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

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
      const token = localStorage.getItem("access_token");

      const response = await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: token,
        },
      });

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
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${BASE_URL}`, {
        headers: {
          Authorization: token,
        },
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
