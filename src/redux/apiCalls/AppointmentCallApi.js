import axios from "axios";
import { appointmentActions } from "../slices/appointmentsSlice";
import toast from "react-hot-toast";

export function fetchAppointments(queryParams = {}, force = false) {
  return async (dispatch, getState) => {
    const { appointments, loading } = getState().appointments;

    if (appointments && appointments.length > 0 && !force && loading) {
      return;
    }

    dispatch(appointmentActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      let url = "https://backend-booking.appointroll.com/api/customer/appointments";

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

      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data) {
        dispatch(appointmentActions.setAppointments(response.data.data));
        dispatch(appointmentActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      dispatch(
        appointmentActions.setError("فشل في تحميل المواعيد")
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
        const token = localStorage.getItem("access_token");
  
        const response = await axios.get(
          `https://backend-booking.appointroll.com/api/customer/appointments/${id}`,
          {
            headers: {
                "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        
        if (response.data) {
          dispatch(appointmentActions.setAppointment(response.data.data));
          dispatch(appointmentActions.setError(null));
          
        }
      } catch (err) {
        // console.log(id);
        console.error("Failed to fetch appointment:", err);
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
        dispatch(appointmentActions.setAppointment(response.data.data));
        dispatch(appointmentActions.setError(null));
        
        // إرجاع البيانات للكومبوننت
        return response.data.data; // 👈 المطلوب إضافته
      }
    } catch (err) {
      console.error("Failed to fetch appointment:", err);
      throw err; // 👈 ورمي الخطأ للكومبوننت
    } finally {
      dispatch(appointmentActions.setLoading(false));
    }
  };
}
  

  export function updateAppointmentStatus(id, statusData) {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem("access_token");
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/appointments/${id}/status`,
          statusData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
  
        if (response.data.status) {
          dispatch(getAppointmentById(id)); 
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
          throw new Error(response.data.message );
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
        const token = localStorage.getItem("access_token");
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/customer/appointments/${id}/reschedule`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
  
        // console.log("🔄 Reschedule API Response:", response.data);
  
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
            data: response.data.data // Include any returned data
          };
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("❌ Error rescheduling appointment:", error);
        
        // Better error handling
        let errorMessage = "حدث خطأ أثناء إعادة الجدولة";
        
        if (error.response) {
          errorMessage = error.response.data?.message || `خطأ من الخادم: ${error.response.status}`;
         } else {
          // Other error
          errorMessage = error.message;
        }
        
        return { success: false, message: errorMessage };
      }
    };
  }
  export function reschedulePublic(id, data) {
    return async (dispatch) => {
      try {
        // const token = localStorage.getItem("access_token");
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/appointments/${id}/reschedule`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: token,
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
            data: response.data.data // Include any returned data
          };
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("❌ Error rescheduling appointment:", error);
        
        // Better error handling
        let errorMessage = "حدث خطأ أثناء إعادة الجدولة";
        
        if (error.response) {
          errorMessage = error.response.data?.message || `خطأ من الخادم: ${error.response.status}`;
         } else {
          // Other error
          errorMessage = error.message;
        }
        
        return { success: false, message: errorMessage };
      }
    };
  }
  export function createAppointment(id, data) {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/client/assign-appointment/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.status) {
        // Dispatch addAppointment to update the state with the new appointment
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
          data: response.data.data, // Include the new appointment data
        };
      } else {
        throw new Error(response.data.message || "فشل في إنشاء الموعد");
      }
    } catch (error) {
      console.error("❌ Error creating appointment:", error);

      let errorMessage = "حدث خطأ أثناء إنشاء الموعد";

      if (error.response) {
        errorMessage = error.response.data?.message || `خطأ من الخادم: ${error.response.status}`;
      } else {
        errorMessage = error.message;
      }

      return { success: false, message: errorMessage };
    }
  };
}
  
  export function statusAppointment(id, data) {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem("access_token");
      
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/appointments/${id}/status`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        
        // console.log("🔄 Status Update API Response:", response.data);
        
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
          throw new Error(response.data.message );
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
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/customer/appointments/${id}/approve`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
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

        // ✅ تحديث الـ appointment مباشرة في Redux
        if (response.data.data) {
          dispatch(appointmentActions.updateAppointment({
            id: id,
            approve_status: data.approved, // أو response.data.data.approve_status
            ...response.data.data // إذا كان الـ API بيرجع بيانات كاملة
          }));
        }

        // ✅ اختياري: جلب البيانات المحدثة من الـ API
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
        const token = localStorage.getItem("access_token");
  
        const response = await axios.delete(
          `https://backend-booking.appointroll.com/api/customer/appointments/${id}`,
          {
            headers: {
                "Content-Type": "application/json",
              Authorization: token,
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
  