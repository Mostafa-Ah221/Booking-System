import { whatsAppActions } from '../slices/whatsAppSlice';
import { whatsappActions } from '../slices/whatsAiwntaSlice';
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../../Components/pages/axiosInstance";
import { createOrUpdateWhatsAppSettings } from "./whatsAppCallApi";

const IWNTA_BASE_URL = "https://iwnta.com/api/v1";

// ============================================================
// ============================================================
const fetchPhoneAndTemplates = async (accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}`, Accept: "application/json" };
  const phoneRes = await axios.get(`${IWNTA_BASE_URL}/phone-numbers`, { headers });
  return {
    phone_numbers: phoneRes.data?.data || [],
    templates: [],
  };
};

// ============================================================
// helper — جيب الـ notification settings المحفوظة وحوّلها لـ object
// ============================================================
const fetchSavedSettings = async (whatsappId) => {
  try {
    const res = await axiosInstance.get(`/whatsapp/notification-settings/${whatsappId}`);
    if (!res.data?.status) return null;

    const arr = res.data?.data?.settings || [];
    const savedSettings = arr.reduce((acc, s) => {
      acc[s.trigger] = String(s.template_id);
      return acc;
    }, {});
    savedSettings._phone_number_id = arr[0]?.phone_number_id
      ? String(arr[0].phone_number_id) : '';

    return savedSettings;
  } catch (_) {
    return null;
  }
};

// ============================================================
// ============================================================
export const getIwentaFullConfig = (integrationId) => {
  return async (dispatch, getState) => {
    try {
      const settingsRes = await axiosInstance.get(
        `/whatsapp/settings?integration_id=${integrationId}`
      );
      const whatsappRec = settingsRes.data?.data;
      const accessToken = whatsappRec?.data?.access_token;

      if (!accessToken) return { status: false };

      const [{ phone_numbers, templates }, savedSettings] = await Promise.all([
        fetchPhoneAndTemplates(accessToken),
        whatsappRec?.id ? fetchSavedSettings(whatsappRec.id) : Promise.resolve(null),
      ]);

      dispatch(whatsappActions.setPhoneNumbers(phone_numbers));
      dispatch(whatsappActions.setTemplates(templates));
      if (savedSettings) dispatch(whatsappActions.setNotificationSettings(savedSettings));

      return {
        status: true,
        data: { phone_numbers, templates, access_token: accessToken, savedSettings },
      };

    } catch (error) {
      console.error("[getIwentaFullConfig]", error);
      return { status: false, message: error.message };
    }
  };
};

// ============================================================
// ✅ Step 1 — حفظ credentials + جيب phone_numbers + templates
// ============================================================
export const getIwentaToken = (payload) => {
  return async (dispatch) => {
    dispatch(whatsAppActions.setLoading(true));
    try {
      const saveResult  = await dispatch(createOrUpdateWhatsAppSettings(payload));
      const accessToken = saveResult.data?.whatsapp?.data?.access_token;

      if (!accessToken) {
        toast.error("No access token received from server");
        return { status: false, message: "No access token" };
      }

      const { phone_numbers, templates } = await fetchPhoneAndTemplates(accessToken);

      dispatch(whatsappActions.setPhoneNumbers(phone_numbers));
      dispatch(whatsappActions.setTemplates(templates));

      toast.success("Connected successfully");

      return {
        status: true,
        data: { phone_numbers, templates, access_token: accessToken },
      };

    } catch (error) {
      const message = error.response?.data?.message || "Connection failed";
      dispatch(whatsAppActions.setError(message));
      toast.error(message);
      return { status: false, message };
    } finally {
      dispatch(whatsAppActions.setLoading(false));
    }
  };
};

// ============================================================
// ✅ Step 2 — حفظ phone_number_id + status_templates
// ============================================================
export const saveIwentaSelection = (payload) => {
  return async (dispatch, getState) => {
    try {
      dispatch(whatsAppActions.setLoading(true));

      const whatsappId =
        getState().whatsApp?.settings?.id           ||
        getState().whatsApp?.settings?.whatsapp?.id ||
        getState().whatsApp?.integrationsWhatsApp?.find?.(
          (i) => String(i.integration_id) === String(payload.integration_id)
        )?.id || null;

      if (!whatsappId) {
        // fallback — جيبه من الـ backend
        const res = await axiosInstance.get(
          `/whatsapp/settings?integration_id=${payload.integration_id}`
        );
        const fetchedId = res.data?.data?.id || res.data?.data?.whatsapp?.id || null;
        if (!fetchedId) {
          toast.error("WhatsApp is not connected");
          return { status: false, message: "No whatsapp_id found" };
        }
        return await _doSaveSelection(fetchedId, payload, dispatch);
      }

      return await _doSaveSelection(whatsappId, payload, dispatch);

    } catch (error) {
      const message = error.response?.data?.message || "Failed to save configuration";
      dispatch(whatsAppActions.setError(message));
      toast.error(message);
      return { status: false, message };
    } finally {
      dispatch(whatsAppActions.setLoading(false));
    }
  };
};

// ============================================================
// helper — الـ actual save call
// ============================================================
const _doSaveSelection = async (whatsappId, payload, dispatch) => {
  const { phone_number_id, status_templates, templates } = payload.data;

  const settings = Object.entries(status_templates).map(([trigger, templateId]) => {
    const template = templates?.find(t => String(t.id) === String(templateId));
    return {
      trigger:         trigger,
      template_id:     Number(templateId),
      template_name:   template?.name            || '',
      phone_number_id: String(phone_number_id),
      variables_count: template?.variables_count ?? 0,
    };
  });

  const response = await axiosInstance.post('/whatsapp/notification-settings/store', {
    whatsapp_id: whatsappId,
    settings,
  });

  if (response.data?.status) {
    dispatch(whatsappActions.setSelectedConfig({ phone_number_id, status_templates }));
    toast.success("WhatsApp configured successfully");
    return { status: true, data: response.data.data };
  } else {
    toast.error(response.data?.message || "Failed to save");
    return { status: false, message: response.data?.message };
  }
};

// ============================================================
// ✅ Send Messages
// ============================================================
export const sendIwentaMessages = (appointmentStatus, recipients) => {
  return async (dispatch, getState) => {
    dispatch(whatsAppActions.setLoading(true));
    try {
      const selectedConfig = getState().whatsappIwenta?.selectedConfig;
      const accessToken    =
        getState().whatsApp?.settings?.data?.access_token ||
        getState().whatsappIwenta?.settings?.data?.access_token || null;

      if (!accessToken) {
        toast.error("WhatsApp is not connected");
        return { status: false, message: "No access token found" };
      }
      if (!selectedConfig?.phone_number_id) {
        toast.error("WhatsApp is not configured");
        return { status: false, message: "No configuration found" };
      }

      const templateId = selectedConfig.status_templates?.[appointmentStatus];
      if (!templateId) {
        toast.error(`No template configured for status: ${appointmentStatus}`);
        return { status: false, message: "No template for this status" };
      }

      const response = await axios.post(
        `${IWNTA_BASE_URL}/messages/send-many`,
        {
          template_id:     Number(templateId),
          phone_number_id: Number(selectedConfig.phone_number_id),
          recipients,
          scheduled_at:    null,
        },
        {
          headers: {
            Authorization:  `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept:         "application/json",
          },
        }
      );

      if (response.data?.status === "success") toast.success("Messages sent successfully");
      return response.data;

    } catch (error) {
      const message = error.response?.data?.message || "Failed to send messages";
      dispatch(whatsAppActions.setError(message));
      toast.error(message);
      return { status: false, message };
    } finally {
      dispatch(whatsAppActions.setLoading(false));
    }
  };
};