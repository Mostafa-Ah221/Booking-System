import axios from "axios";
import { analyticsActions } from "../slices/analyticsSlice";

const BASE_URL = "https://backend-booking.appointroll.com/api/analytics/dashboard";

export function fetchAppointments() {
  return async (dispatch) => {
    dispatch(analyticsActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${BASE_URL}/appointments`, {
        headers: {
          "Content-Type": "application/json",
           Authorization: token,
        },
      });

        console.log("Appointments raw response:", response.data);

      if (response.data && response.data.data) {
        dispatch(analyticsActions.setAppointments(response.data.data));
        dispatch(analyticsActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      dispatch(analyticsActions.setError("فشل في تحميل المواعيد"));
    } finally {
      dispatch(analyticsActions.setLoading(false));
    }
  };
}

// 2️⃣ جلب الـ interviews
export function fetchInterviews() {
  return async (dispatch) => {
    dispatch(analyticsActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${BASE_URL}/interviews`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data) {
        dispatch(analyticsActions.setInterviews(response.data.data));
        dispatch(analyticsActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
      dispatch(analyticsActions.setError("فشل في تحميل المقابلات"));
    } finally {
      dispatch(analyticsActions.setLoading(false));
    }
  };
}

// 3️⃣ جلب الـ recruiters
export function fetchRecruiters() {
  return async (dispatch) => {
    dispatch(analyticsActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${BASE_URL}/recruiters`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data) {
        dispatch(analyticsActions.setRecruiters(response.data.data));
        dispatch(analyticsActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch recruiters:", err);
      dispatch(analyticsActions.setError("فشل في تحميل مسؤولي التوظيف"));
    } finally {
      dispatch(analyticsActions.setLoading(false));
    }
  };
}

// 4️⃣ جلب الـ clients
export function fetchClients() {
  return async (dispatch) => {
    dispatch(analyticsActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${BASE_URL}/clients`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data) {
        dispatch(analyticsActions.setClients(response.data.data));
        dispatch(analyticsActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      dispatch(analyticsActions.setError("فشل في تحميل العملاء"));
    } finally {
      dispatch(analyticsActions.setLoading(false));
    }
  };
}
