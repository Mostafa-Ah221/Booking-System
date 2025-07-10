import axios from "axios";
import { whatsAppActions } from '../slices/whatsAppSlice'; 

const BASE_URL = "https://booking-system-demo.efc-eg.com/api/whatsapp/settings";
const GET_INTEGRATIONS_URL = "https://booking-system-demo.efc-eg.com/api/whatsapp/integrations";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const RATE_LIMIT_DELAY = 1000;

let integrationsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; 

const apiClient = axios.create({
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      await delay(2000);
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);

export function fetchWhatsAppIntegrations() {
  return async (dispatch) => {
    if (integrationsCache && cacheTimestamp && 
        Date.now() - cacheTimestamp < CACHE_DURATION) {
      dispatch(whatsAppActions.setIntegrationsWhatsApp(integrationsCache));
      return { status: true, data: integrationsCache };
    }

    dispatch(whatsAppActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      const response = await apiClient.get(GET_INTEGRATIONS_URL, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status) {
        // حفظ في الـ cache
        integrationsCache = response.data.data;
        cacheTimestamp = Date.now();
        
        dispatch(whatsAppActions.setIntegrationsWhatsApp(response.data.data));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to fetch integrations");
      }
    } catch (error) {
      console.error("Error fetching integrations:", error);
      dispatch(whatsAppActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(whatsAppActions.setLoading(false));
    }
  };
}

export function getWhatsAppSettingsByIntegrationId(integration_id) {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("access_token");

      // إضافة تأخير قبل الطلب
      await delay(RATE_LIMIT_DELAY);

      const response = await apiClient.get(`${BASE_URL}?integration_id=${integration_id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status) {
        dispatch(whatsAppActions.setSettings(response.data.data));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to fetch WhatsApp settings");
      }
    } catch (error) {
      console.error(`Error fetching settings for integration ${integration_id}:`, error);
      dispatch(whatsAppActions.setError(error.message));
      return { status: false, message: error.message };
    }
  };
}

export function createOrUpdateWhatsAppSettings(payload) {
  return async (dispatch) => {
    dispatch(whatsAppActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      const response = await apiClient.post(`https://booking-system-demo.efc-eg.com/api/whatsapp/settings/store`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data.status) {
        // إلغاء الـ cache عند التحديث
        integrationsCache = null;
        cacheTimestamp = null;
        
        dispatch(whatsAppActions.setSuccess(response.data.message));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to save WhatsApp settings");
      }
    } catch (error) {
      console.error("Error saving WhatsApp settings:", error);
      dispatch(whatsAppActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(whatsAppActions.setLoading(false));
    }
  };
}

export function deleteWhatsAppSettings(id) {
  return async (dispatch) => {
    dispatch(whatsAppActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      const response = await apiClient.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status) {
        // إلغاء الـ cache عند الحذف
        integrationsCache = null;
        cacheTimestamp = null;
        
        dispatch(whatsAppActions.setSuccess("WhatsApp setting deleted"));
        return { status: true };
      } else {
        throw new Error("Failed to delete WhatsApp setting");
      }
    } catch (error) {
      console.error("Error deleting WhatsApp setting:", error);
      dispatch(whatsAppActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(whatsAppActions.setLoading(false));
    }
  };
}