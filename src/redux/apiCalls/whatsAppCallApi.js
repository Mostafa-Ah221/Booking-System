import axiosInstance from "../../Components/pages/axiosInstance";
import { whatsAppActions } from '../slices/whatsAppSlice';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Cache ────────────────────────────────────────────────────────────────────
let integrationsCache = null;
let cacheTimestamp    = null;
const CACHE_DURATION          = 5 * 60 * 1000;  // 5 دقايق
const SETTINGS_CACHE_DURATION = 3 * 60 * 1000;  // 3 دقايق

let settingsCache    = new Map();
let ongoingRequests  = new Map();

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
class RateLimiter {
    constructor(maxRequests = 5, perMs = 1000) {
        this.maxRequests = maxRequests;
        this.perMs       = perMs;
        this.requests    = [];
    }

    async wait() {
        const now = Date.now();
        this.requests = this.requests.filter(t => now - t < this.perMs);

        if (this.requests.length >= this.maxRequests) {
            const waitTime = this.perMs - (now - this.requests[0]) + 10;
            await delay(waitTime);
            return this.wait();
        }

        this.requests.push(now);
    }
}

// خفضنا من 10 إلى 5 requests/second عشان نبعد عن الـ rate limit
const rateLimiter = new RateLimiter(5, 1000);

// ─── Retry interceptor (مرة واحدة بس + delay أطول) ───────────────────────────
const MAX_RETRIES      = 1;     // بدل 2
const BASE_RETRY_DELAY = 3000;  // بدل 1000


// ─── Dedup helper ─────────────────────────────────────────────────────────────
function createDedupedRequest(key, requestFn) {
    if (ongoingRequests.has(key)) return ongoingRequests.get(key);

    const promise = requestFn().finally(() => {
        setTimeout(() => ongoingRequests.delete(key), 500);
    });

    ongoingRequests.set(key, promise);
    return promise;
}

// ─── Actions ──────────────────────────────────────────────────────────────────
export function fetchWhatsAppIntegrations() {
    return async (dispatch) => {
        // إرجع من الـ cache لو موجود وصالح
        if (integrationsCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
            dispatch(whatsAppActions.setIntegrationsWhatsApp(integrationsCache));
            return { status: true, data: integrationsCache };
        }

        return createDedupedRequest('whatsapp_integrations', async () => {
            dispatch(whatsAppActions.setLoading(true));
            try {
                await rateLimiter.wait();
                const response = await axiosInstance.get('/whatsapp/integrations');

                if (response.data.status) {
                    integrationsCache = response.data.data;
                    cacheTimestamp    = Date.now();
                    dispatch(whatsAppActions.setIntegrationsWhatsApp(response.data.data));
                    return { status: true, data: response.data.data };
                }
                throw new Error("Failed to fetch integrations");
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

export function getWhatsAppSettingsByIntegrationId(integration_id) {
    return async (dispatch) => {
        const cached = settingsCache.get(integration_id);
        if (cached && Date.now() - cached.timestamp < SETTINGS_CACHE_DURATION) {
            return { status: true, data: cached.data };
        }

        return createDedupedRequest(`whatsapp_settings_${integration_id}`, async () => {
            try {
                await rateLimiter.wait();
                const response = await axiosInstance.get(
                    `/whatsapp/settings?integration_id=${integration_id}`
                );

                if (response.data.status) {
                    settingsCache.set(integration_id, { data: response.data.data, timestamp: Date.now() });
                    dispatch(whatsAppActions.setSettings(response.data.data));
                    return { status: true, data: response.data.data };
                }
                throw new Error("Failed to fetch WhatsApp settings");
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
                // امسح الـ cache بعد أي تعديل
                integrationsCache = null;
                cacheTimestamp    = null;
                settingsCache.clear();

                dispatch(whatsAppActions.setSuccess(response.data.message));
                return { status: true, data: response.data.data };
            }
            throw new Error("Failed to save WhatsApp settings");
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
                cacheTimestamp    = null;
                settingsCache.clear();

                dispatch(whatsAppActions.setSuccess("WhatsApp setting deleted"));
                return { status: true };
            }
            throw new Error("Failed to delete WhatsApp setting");
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
                settingsCache.set(integrationId, { data: response.data.data, timestamp: Date.now() });
                dispatch(whatsAppActions.setSettings(response.data.data));
                return { status: true, data: response.data.data };
            }
            throw new Error("Failed to fetch whatsApp settings");
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
    cacheTimestamp    = null;
    settingsCache.clear();
    ongoingRequests.clear();
}