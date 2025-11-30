import axiosInstance from "../../Components/pages/axiosInstance";
import { whatsAppActions } from '../slices/whatsAppSlice';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let integrationsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ✅ Request deduplication
let ongoingRequests = new Map();

// ✅ Rate limiter - أفضل من delay ثابت
class RateLimiter {
  constructor(maxRequests = 10, perMs = 1000) {
    this.maxRequests = maxRequests;
    this.perMs = perMs;
    this.requests = [];
  }

  async wait() {
    const now = Date.now();
    
    // امسح الطلبات القديمة
    this.requests = this.requests.filter(time => now - time < this.perMs);
    
    // لو وصلنا للحد، استنى
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.perMs - (now - oldestRequest) + 10;
      await delay(waitTime);
      return this.wait(); // تحقق تاني
    }
    
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(10, 1000); // 10 requests per second

// ✅ Retry logic محسّن
const MAX_RETRIES = 2;
const BASE_RETRY_DELAY = 1000; // 1 second (أسرع من 2s)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    if (!config.__retryCount) {
      config.__retryCount = 0;
    }
    
    if (error.response?.status === 429 && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      
      // ✅ Exponential backoff: 1s, 2s بدل 2s, 2s
      const retryDelay = BASE_RETRY_DELAY * config.__retryCount;
      
      console.log(`⚠️ Rate limited. Retry ${config.__retryCount}/${MAX_RETRIES} after ${retryDelay}ms`);
      
      await delay(retryDelay);
      return axiosInstance.request(config);
    }
    
    return Promise.reject(error);
  }
);

// ✅ Helper function محسّن
function createDedupedRequest(key, requestFn) {
  if (ongoingRequests.has(key)) {
    return ongoingRequests.get(key);
  }
  
  const promise = requestFn().finally(() => {
    setTimeout(() => ongoingRequests.delete(key), 300); // أسرع من 500ms
  });
  
  ongoingRequests.set(key, promise);
  return promise;
}

export function fetchWhatsAppIntegrations() {
  return async (dispatch) => {
    // ✅ استخدم الـ cache فوراً
    if (integrationsCache && cacheTimestamp && 
        Date.now() - cacheTimestamp < CACHE_DURATION) {
      dispatch(whatsAppActions.setIntegrationsWhatsApp(integrationsCache));
      return { status: true, data: integrationsCache };
    }

    const cacheKey = 'whatsapp_integrations';
    
    return createDedupedRequest(cacheKey, async () => {
      dispatch(whatsAppActions.setLoading(true));
      try {
        await rateLimiter.wait(); // ✅ Rate limiting ذكي
        
        const response = await axiosInstance.get('/whatsapp/integrations');

        if (response.data.status) {
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
    });
  };
}

// ✅ Settings cache محسّن
let settingsCache = new Map();
const SETTINGS_CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

export function getWhatsAppSettingsByIntegrationId(integration_id) {
  return async (dispatch) => {
    // ✅ تحقق من الـ cache أولاً (instant!)
    const cached = settingsCache.get(integration_id);
    if (cached && Date.now() - cached.timestamp < SETTINGS_CACHE_DURATION) {
      return { status: true, data: cached.data };
    }

    const cacheKey = `whatsapp_settings_${integration_id}`;
    
    return createDedupedRequest(cacheKey, async () => {
      try {
        // ✅ استخدم rate limiter بدل delay ثابت
        await rateLimiter.wait();

        const response = await axiosInstance.get(
          `/whatsapp/settings?integration_id=${integration_id}`
        );

        if (response.data.status) {
          settingsCache.set(integration_id, {
            data: response.data.data,
            timestamp: Date.now()
          });
          
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
    });
  };
}

export function createOrUpdateWhatsAppSettings(payload) {
  return async (dispatch) => {
    dispatch(whatsAppActions.setLoading(true));
    try {
      await rateLimiter.wait();
      
      const response = await axiosInstance.post('/whatsapp/settings/store', payload);

      if (response.data.status) {
        integrationsCache = null;
        cacheTimestamp = null;
        settingsCache.clear();
        
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
      await rateLimiter.wait();
      
      const response = await axiosInstance.delete(`/whatsapp/settings/${id}`);

      if (response.data.status) {
        integrationsCache = null;
        cacheTimestamp = null;
        settingsCache.clear();
        
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

export function fetchWhatsAppSettings(integrationId) {
  return async (dispatch) => {
    // ✅ Cache check أولاً
    const cached = settingsCache.get(integrationId);
    if (cached && Date.now() - cached.timestamp < SETTINGS_CACHE_DURATION) {
      dispatch(whatsAppActions.setSettings(cached.data));
      return { status: true, data: cached.data };
    }

    dispatch(whatsAppActions.setLoading(true));
    try {
      await rateLimiter.wait();
      
      const response = await axiosInstance.get('/whatsapp/settings', {
        params: { integration_id: integrationId },
      });

      if (response.data.status) {
        settingsCache.set(integrationId, {
          data: response.data.data,
          timestamp: Date.now()
        });

        dispatch(whatsAppActions.setSettings(response.data.data));
        return { status: true, data: response.data.data };
      } else {
        throw new Error("Failed to fetch whatsApp settings");
      }
    } catch (error) {
      dispatch(whatsAppActions.setError(error.message));
      return { status: false, message: error.message };
    } finally {
      dispatch(whatsAppActions.setLoading(false));
    }
  };
}

export function clearWhatsAppCache() {
  integrationsCache = null;
  cacheTimestamp = null;
  settingsCache.clear();
  ongoingRequests.clear();
}