import axiosInstance from "../../Components/pages/axiosInstance";
import { appointmentActions } from "../slices/appointmentsSlice";
import toast from "react-hot-toast";
import axios from "axios";

export function fetchAppointments(queryParams = {}, force = false) {
  return async (dispatch, getState) => {
    const { appointments, loading } = getState().appointments;

    if (appointments && appointments.length > 0 && !force && loading) {
      return;
    }

    dispatch(appointmentActions.setLoading(true));
    try {
      const searchParams = new URLSearchParams();
      Object.keys(queryParams).forEach((key) => {
        if (
          queryParams[key] !== null &&
          queryParams[key] !== undefined &&
          queryParams[key] !== ""
        ) {
          searchParams.append(key, queryParams[key]);
        }
      });

      const queryString = searchParams.toString();
      const url = queryString ? `/customer/appointments?${queryString}` : '/customer/appointments';

      const response = await axiosInstance.get(url);

      if (response.data) {
        dispatch(appointmentActions.setAppointments(response.data.data));
        dispatch(appointmentActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      dispatch(
        appointmentActions.setError("Failed to fetch appointments")
      );
    } finally {
      dispatch(appointmentActions.setLoading(false));
    }
  };
}

export function getAppointmentById(id) {
  return async (dispatch) => {
    dispatch(appointmentActions.setLoading(true));
    try {
      const response = await axiosInstance.get(`/customer/appointments/${id}`);
      
      if (response.data) {
        dispatch(appointmentActions.setAppointment(response.data.data));
        dispatch(appointmentActions.setError(null));
        
        return {
          success: true,
          data: response.data
        };
      }
      
    } catch (err) {
      console.error("Failed to fetch appointment:", err);
      dispatch(appointmentActions.setError(err.message));
      
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
      
    } finally {
      dispatch(appointmentActions.setLoading(false));
    }
  };
}


export function getAppointmentByIdPublic(id) {
  return async (dispatch) => {
    dispatch(appointmentActions.setLoading(true));
    try {
      const response = await axios.get(
        `https://backend-booking.appointroll.com/api/appointments/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data) {
        console.log(response.data);
        
        dispatch(appointmentActions.setAppointment(response.data.data));
        dispatch(appointmentActions.setError(null));
        
        return {
          success: true,
          data: response.data.data
        };
      }
    } catch (err) {
      console.error("Failed to fetch appointment:", err);
      dispatch(appointmentActions.setError(err.message));
      
     
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
      
    } finally {
      dispatch(appointmentActions.setLoading(false));
    }
  };
}
export function getAppointmentByTokenPublic(token) {
  return async (dispatch) => {
    dispatch(appointmentActions.setLoading(true));
    try {
      const response = await axios.get(
        `https://backend-booking.appointroll.com/api/appointments/token/${token}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data) {
        console.log(response.data);
        
        dispatch(appointmentActions.setAppointment(response.data.data));
        dispatch(appointmentActions.setError(null));
        
        return {
          success: true,
          data: response.data.data
        };
      }
    } catch (err) {
      console.error("Failed to fetch appointment:", err);
      dispatch(appointmentActions.setError(err.message));
      
      // ✅ إضافة return للفشل
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
      
    } finally {
      dispatch(appointmentActions.setLoading(false));
    }
  };
}
  
export function updateAppointmentStatus(id, statusData) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/appointments/${id}/status`,
        statusData
      );

      if (response.data.status) {
        dispatch(getAppointmentById(id)); 
        if (response.data.data) {
          dispatch(appointmentActions.setAppointment(response.data.data));
        } else {
          dispatch(getAppointmentByIdPublic(id));
        }
        toast.success(response?.data?.message, {
          position: 'top-center',         
          duration: 5000,
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '500',
          },
        });
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      return { success: false, message: error.message };
    }
  };
}

export function rescheduleAppointment(id, data) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/customer/appointments/${id}/reschedule`,
        data
      );

      if (response.data.status) {
        toast.success(response?.data?.message, {
          position: 'top-center',         
          duration: 5000,
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '500',
          },
        });
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error rescheduling appointment:", error);
      
      let errorMessage = "حدث خطأ أثناء إعادة الجدولة";
      
      if (error.response) {
        errorMessage = error.response.data?.message || `خطأ من الخادم: ${error.response.status}`;
      } else {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };
}

export function reschedulePublic(id, data) {
  return async (dispatch) => {
    try {
      console.log(data);
       const response = await axiosInstance.post(
        `/appointments/${id}/reschedule`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success(response?.data?.message, {
          position: 'top-center',         
          duration: 5000,
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '500',
          },
        });
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data
        };
      } else {
        console.log(response.data);
        
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error rescheduling appointment:", error);
      
      // let errorMessage = "حدث خطأ أثناء إعادة الجدولة";
      
      if (error.response) {
        errorMessage = error.response.data?.message || `  : ${error.response.status}`;
      } else {
        errorMessage = error.message;
      }
      logger.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };
}

export function createAppointment(id, data) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/client/assign-appointment/${id}`,
        data
      );

      if (response.data.status) {
        dispatch(appointmentActions.addAppointment(response.data.data));

        toast.success(response?.data?.message, {
          position: 'top-center',
          duration: 5000,
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '500',
          },
        });

        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        throw new Error(response.data.message );
      }
   } catch (error) {
  console.error("❌ Error creating appointment:", error);

  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;

    Object.keys(errors).forEach((field) => {
      const msg = Array.isArray(errors[field])
        ? errors[field].join(", ")
        : errors[field];

      toast.error(msg, {
        position: "top-center",
        duration: 4000,
      });
    });

    return { success: false, message: "Validation failed", errors };
  }

  const errorMessage =
    error.response?.data?.message ||
    error.message;

  toast.error(errorMessage, {
    position: "top-center",
    duration: 4000,
  });

  return { success: false, message: errorMessage };
}

  };
}
  
export function statusAppointment(id, data) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/appointments/${id}/status`,
        data
      );
      
      if (response.data.status) {
        dispatch(appointmentActions.updateAppointment(response.data.data));
        await dispatch(getAppointmentByIdPublic(id));
        toast.success(response?.data?.message, {
          position: 'top-center',         
          duration: 5000,
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '500',
          },
        });
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data 
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error updating appointment status:", error);
      
      let errorMessage = "حدث خطأ غير متوقع";
      
      if (error.response) {
        errorMessage = error.response.data?.message || `خطأ من الخادم: ${error.response.status}`;
        
        if (error.response.status === 401) {
          errorMessage = "انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى.";
        } 
      } else {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };
}

export function approveAppointment(id, data) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/customer/appointments/${id}/approve`,
        data
      );
      
      if (response.data.status) {
        toast.success(response?.data?.message, {
          position: 'top-center',         
          duration: 5000,
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '500',
          },
        });

        if (response.data.data) {
          dispatch(appointmentActions.updateAppointment({
            id: id,
            approve_status: data.approved,
            ...response.data.data
          }));
        }

        dispatch(getAppointmentById(id));
        
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error updating appointment status:", error);
      
      let errorMessage = "حدث خطأ غير متوقع";
      
      if (error.response) {
        errorMessage = error.response.data?.message || `خطأ من الخادم: ${error.response.status}`;
      } else {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };
}
  
export function deleteAppointment(id) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.delete(
        `/customer/appointments/${id}`
      );

      if (response.data.status) {
        toast.success(response?.data?.message, {
          position: 'top-center',         
          duration: 5000,
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '500',
          },
        });
        dispatch(appointmentActions.removeAppointment(id));
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || "فشل في حذف الموعد");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return { success: false, message: error.message };
    }
  };
}