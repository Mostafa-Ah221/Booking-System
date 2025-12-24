import axios from "axios";
import toast from "react-hot-toast";
import { staffApisActions } from "../../slices/StaffApisSlice/StaffApisSlice";


export function satff_FetchAppointments(queryParams = {}, force = false) {
  return async (dispatch, getState) => {
    const { staff_appointments, loading } = getState().staffApis;

    if (staff_appointments && staff_appointments.length > 0 && !force && loading) {
      return;
    }

    dispatch(staffApisActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");

      let url = "https://backend-booking.appointroll.com/api/staff/appointments";

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
  dispatch(staffApisActions.setStaff_appointments(response.data.data.appointments || []));
        dispatch(staffApisActions.setError(null));
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      dispatch(
        staffApisActions.setError("فشل في تحميل المواعيد")
      );
    } finally {
      dispatch(staffApisActions.setLoading(false));
    }
  };
}

export function staff_GetAppointmentById(id) {
    return async (dispatch) => {
      dispatch(staffApisActions.setLoading(true));
      try {
        const token = localStorage.getItem("access_token");
  
        const response = await axios.get(
          `https://backend-booking.appointroll.com/api/staff/appointments/${id}`,
          {
            headers: {
                "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        
        if (response.data) {
          dispatch(staffApisActions.setStaff_appointment(response.data.data));
          dispatch(staffApisActions.setError(null));
          
        }
      } catch (err) {
        // console.log(id);
        console.error("Failed to fetch appointment:", err);
      } finally {
        dispatch(staffApisActions.setLoading(false));
      }
    };
  }
export function getDetailsStaff() {
    return async (dispatch) => {
        try {
            dispatch(staffApisActions.setLoading(true));
            const Token = localStorage.getItem("access_token");
            
            const response = await axios.get(
                `https://backend-booking.appointroll.com/api/staff/edit`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            
            console.log("getStaffById response:", response.data);
            
            dispatch(staffApisActions.setStaff(response?.data?.data));
            dispatch(staffApisActions.setLoading(false));
            
            return {
                success: true,
                data: response?.data?.data
            };
        } catch (error) {
            console.error("Error fetching staff by ID:", error);
            dispatch(staffApisActions.setLoading(false));
            
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch staff details";
            dispatch(staffApisActions.setError(errorMessage));
            
            return {
                success: false,
                message: errorMessage 
            };
        }
    };
}

 export function staff_UpdateAppointmentStatus(id, statusData) {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/staff/appointments/${id}/status`,
        statusData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.status) {
        dispatch(staffApisActions.updateAppointmentInList({
          id: id,
          status: statusData.status,
          ...response.data.appointment
        }));
        
        dispatch(staff_GetAppointmentById(id)); 
        
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

    export function staff_ApproveAppointment(id, data) {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem("access_token");
      
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/staff/appointments/${id}/approve`,
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
           if (response.data.data) {
                    dispatch(staffApisActions.updateAppointmentInList({
                      id: id,
                      approve_status: data.approved, 
                      ...response.data.data 
                    }));
                  }
          dispatch(staff_GetAppointmentById(id));
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
          
          
        } else {
          errorMessage = error.message;
        }
        
        return { success: false, message: errorMessage };
      }
    };
  }

    export function staff_RescheduleAppointment(id, data) {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem("access_token");
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/staff/appointments/${id}/reschedule`,
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

   export function staff_DeleteAppointment(id) {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem("access_token");
  
        const response = await axios.delete(
          `https://backend-booking.appointroll.com/api/staff/appointments/${id}`,
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
          dispatch(staffApisActions.removeAppointment(id));
          return { success: true, message: response.data.message };
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
        return { success: false, message: error.message };
      }
    };
  }

export function staff_FetchInterviews(queryParams = {}) {
  return async (dispatch, getState) => {
    const { loading } = getState().staffApis;
    const { force = false } = queryParams;

    const hasWorkspaceFilter = queryParams.work_space_id !== undefined && 
                               queryParams.work_space_id !== null;

    if (loading && !force) {
      return { success: false, message: 'Loading in progress' };
    }

    try {
      dispatch(staffApisActions.setLoading(true));
      dispatch(staffApisActions.setError(null));

      const Token = localStorage.getItem("access_token");
      let url = "https://backend-booking.appointroll.com/api/staff/interview/index";

      const params = new URLSearchParams();
      
      if (hasWorkspaceFilter && queryParams.work_space_id !== 0) {
        params.append('work_space_id', queryParams.work_space_id);
      }
      
      if (queryParams.status) {
        params.append('status', queryParams.status);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('📡 Fetching interviews from:', url);

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
      });

      if (response.data.status) {
        const interviews = response?.data?.data?.interviews || [];
        
        dispatch(staffApisActions.setStaff_interviews(interviews));
        dispatch(staffApisActions.setError(null));
        
        return { success: true, data: interviews };
      } else {
        dispatch(staffApisActions.setStaff_interviews([]));
        dispatch(staffApisActions.setError(response.data.message));
        
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      console.error("❌ Failed to fetch interviews:", err);
      dispatch(staffApisActions.setStaff_interviews([]));
      dispatch(staffApisActions.setError(err.message));
      
      return { success: false, message: err.message };
    } finally {
      dispatch(staffApisActions.setLoading(false));
    }
  };
}

export function editInterviewStaffById(id) {
  return async (dispatch) => {
    try {
      dispatch(staffApisActions.setLoading(true)); // ✅ Set loading state
      
      const Token = localStorage.getItem("access_token");
      
      // ✅ استخدم axios العادي زي باقي الـ functions
      const response = await axios.get(
        `https://backend-booking.appointroll.com/api/staff/interview/edit/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
      );
      
      console.log("✅ Interview fetched:", response.data);
      
      if (response.data.status) {
        dispatch(staffApisActions.setStaff_interview(response?.data?.data?.interview)); 
        dispatch(staffApisActions.setError(null));
        return { success: true, data: response?.data?.data?.interview };
      } else {
        throw new Error(response.data.message || "Failed to fetch interview");
      }
    } catch (err) {
      console.error("❌ Failed to fetch interview:", err);
      
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch interview";
      dispatch(staffApisActions.setError(errorMessage));
      
      return { success: false, message: errorMessage };
    } finally {
      dispatch(staffApisActions.setLoading(false)); // ✅ Always stop loading
    }
  };
}

export function staff_GetWorkspaces({ force = false } = {}) {
  return async (dispatch, getState) => {
    const { staff_workspaces, loading } = getState().staffApis;

    if (loading) {
      return { success: false, message: 'Loading in progress' };
    }

    // Check existing data
    if (!force && Array.isArray(staff_workspaces) && staff_workspaces.length > 0) {
      return { success: true, data: staff_workspaces };
    }

    try {
      dispatch(staffApisActions.setLoading(true));

      const Token = localStorage.getItem("access_token");
      const url = "https://backend-booking.appointroll.com/api/staff/workspace/index";

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
      });

      console.log('📡 API Response:', response.data);

      if (response.data && response.data.data && response.data.data.workspaces) {
        const workspaces = response.data.data.workspaces;
        
        dispatch(staffApisActions.setStaff_workspaces(workspaces));
        dispatch(staffApisActions.setError(null));
        
        // Return success with data
        return { success: true, data: workspaces };
      } else {
        dispatch(staffApisActions.setStaff_workspaces([]));
        dispatch(staffApisActions.setError('No workspaces found'));
        
        return { success: false, message: 'No workspaces found' };
      }
    } catch (error) {
      console.error("❌ Error fetching workspaces:", error);
      
      const errorMessage = error.response?.data?.message || "فشل في تحميل المساحات";
      
      dispatch(staffApisActions.setStaff_workspaces([]));
      dispatch(staffApisActions.setError(errorMessage));
      
      return { success: false, message: errorMessage };
    } finally {
      dispatch(staffApisActions.setLoading(false));
    }
  };
}

export function updateAvailabil_DashboardStaff(formData) {
  return async (dispatch) => {
    dispatch(staffApisActions.setLoading(true));
    
    try {
      const Token = localStorage.getItem("access_token");
      
      console.log('updateAvailabil_DashboardStaff - formData:', formData);
      
      if (!formData || (!formData.available_times && !formData.available_dates)) {
        throw new Error("Invalid availability data format");
      }

      const requestBody = {
        available_times: formData.available_times || [],
        available_dates: formData.available_dates || []
      };

      // ✅ إضافة time_zone إذا كان موجود
      if (formData.time_zone) {
        requestBody.time_zone = formData.time_zone;
      }

      console.log('updateAvailabil_DashboardStaff - requestBody:', requestBody);

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/staff/availability/update`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
      );
      
      if (response.data.status) {
        dispatch(staffApisActions.setError(null));
        
        return {
          status: true,
          message: response.data.message || "Availability updated successfully",
          data: response.data.data || null
        };
      } else {
        throw new Error(response.data.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      
      let errorMessage = "Failed to update availability";
      let errorDetails = null;
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        errorDetails = error.response.data.errors || null;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(staffApisActions.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(staffApisActions.setLoading(false));
    }
  };
}

export function updateUnAvailabil_DashboardStaff(formData) {
  return async (dispatch) => {
    dispatch(staffApisActions.setLoading(true));
    
    try {
      const Token = localStorage.getItem("access_token");
      
      console.log('updateUnAvailabil_DashboardStaff - formData:', formData);
      
      if (!formData) {
        throw new Error("Invalid availability data format");
      }

      const requestBody = {};
      
      if (formData.un_available_times) {
        requestBody.un_available_times = formData.un_available_times;
      }
      
      if (formData.un_available_dates) {
        requestBody.un_available_dates = formData.un_available_dates;
      }

      if (formData.time_zone) {
        requestBody.time_zone = formData.time_zone;
      }

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/staff/unavailability/update`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
      );
      
      if (response.data.status) {
        dispatch(staffApisActions.setError(null));
        
        return {
          status: true,
          message: response.data.message || "Unavailability updated successfully",
          data: response.data.data || null
        };
      } else {
        throw new Error(response.data.message || "Failed to update unavailability");
      }
    } catch (error) {
      console.error("Error updating unavailability:", error);
      
      let errorMessage = "Failed to update unavailability";
      let errorDetails = null;
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        errorDetails = error.response.data.errors || null;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(staffApisActions.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(staffApisActions.setLoading(false));
    }
  };
}

export const updateShareLink_DashboardStaff = (newShareLink) => {
  return async (dispatch, getState) => {
    dispatch(staffApisActions.setLoading(true)); 
    try {
      const token = localStorage.getItem("access_token");
      const url = `https://backend-booking.appointroll.com/api/staff/regenerate-staff-share-link`;

    
      const requestBody = newShareLink ? { share_link: newShareLink } : {};

      const response = await axios.post(
        url,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data && response.data.data) {
        
        dispatch(staffApisActions.updateStaffShareLink({
          share_link: response.data.data
        }));
        
        toast.success("Share link updated successfully");
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update share link";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(staffApisActions.setLoading(false));
    }
  };
};

