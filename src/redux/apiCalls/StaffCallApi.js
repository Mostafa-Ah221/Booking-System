import axiosInstance from "../../Components/pages/axiosInstance";
import { staffAction } from "../slices/staffSlice";
import toast from "react-hot-toast";

export function getStaff() {
  return async (dispatch) => {
        try {
            dispatch(staffAction.setStaffsLoading(true));
            
            const response = await axiosInstance.get('/staff/index');
            
            dispatch(staffAction.setStaffs(response?.data?.data || []));
            dispatch(staffAction.setStaffsLoading(false));
            
            return {
                success: true,
                data: response?.data?.data
            };
        } catch (error) {
            console.error("Error fetching all staff:", error);
            dispatch(staffAction.setStaffsLoading(false));
            
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch staff";
            dispatch(staffAction.setError(errorMessage));
            
            return {
                success: false,
                message: errorMessage 
            };
        }
    }
}

export function getStaffByFilter(filters = {}) {
    return async (dispatch) => {
        try {
            dispatch(staffAction.setFilteredStaffsLoading(true));
            
            const params = new URLSearchParams();
            
            if (filters.work_space_id) {
                params.append('work_space_id', filters.work_space_id);
            }
            
            if (filters.interview_id) {
                params.append('interview_id', filters.interview_id);
            }
            
            const queryString = params.toString();
            const url = queryString ? `/staff/index?${queryString}` : '/staff/index';
            
            const response = await axiosInstance.get(url);
            
            dispatch(staffAction.setFilteredStaffs(response?.data?.data || []));
            dispatch(staffAction.setFilteredStaffsLoading(false));
            
            return {
                success: true,
                data: response?.data?.data
            };
        } catch (error) {
            console.error("Error fetching filtered staff:", error);
            dispatch(staffAction.setFilteredStaffsLoading(false));
            
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch staff";
            dispatch(staffAction.setError(errorMessage));
            
            return {
                success: false,
                message: errorMessage 
            };
        }
    }
}

export function addStaff(staffData) {
    return async (dispatch) => {
        try {
            dispatch(staffAction.setLoading(true));
            dispatch(staffAction.clearError());

            console.log("Sending FormData to API:");
            for (let [key, value] of staffData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await axiosInstance.post(
                '/staff/store',
                staffData, 
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            if (response?.data?.status) {
                const newStaff = response.data.data;
                
                dispatch(staffAction.addStaffToList(newStaff));
                
                toast.success(response.data.message, {
                    position: "top-center",
                    duration: 5000,
                    icon: "✅",
                    style: {
                        borderRadius: "8px",
                        background: "#333",
                        color: "#fff",
                        padding: "12px 16px",
                        fontWeight: "500",
                    },
                });

                dispatch(staffAction.setLoading(false));
                return { success: true, data: response.data };
            } else {
                dispatch(staffAction.setLoading(false));
                return { success: false, error: { response: { data: { errors: { general: "Unexpected response format" } } } } };
            }
        } catch (error) {
            const serverErrors = error?.response?.data?.errors || {};
            console.error("Error creating Staff:", error);
            console.error("Server errors:", serverErrors);
            
            dispatch(staffAction.setLoading(false));
            dispatch(staffAction.setError(serverErrors));
            
            return { success: false, error };
        }
    };
}

export function inviteStaff(inviteData) {
    return async (dispatch) => {
        try {
            dispatch(staffAction.setLoading(true));
            dispatch(staffAction.clearError());

            console.log("Sending Invite Data to API:", inviteData);

            const response = await axiosInstance.post(
                '/staff/send-invite',
                inviteData
            );
            
            if (response?.data?.status) {
                toast.success(response.data.message || "Invitation sent successfully!", {
                    position: "top-center",
                    duration: 5000,
                    icon: "📧",
                    style: {
                        borderRadius: "8px",
                        background: "#333",
                        color: "#fff",
                        padding: "12px 16px",
                        fontWeight: "500",
                    },
                });

                dispatch(staffAction.setLoading(false));
                return { success: true, data: response.data };
            } else {
                dispatch(staffAction.setLoading(false));
                return { 
                    success: false, 
                    error: { 
                        response: { 
                            data: { 
                                errors: { general: "Unexpected response format" } 
                            } 
                        } 
                    } 
                };
            }
        } catch (error) {
            const serverErrors = error?.response?.data?.errors || {};
            
            dispatch(staffAction.setLoading(false));
            dispatch(staffAction.setError(serverErrors));
            
            const errorMessage = error?.response?.data?.errors.email;
            
            return { success: false, error };
        }
    };
}

export function getStaffById(staffId) {
    return async (dispatch) => {
        try {
            dispatch(staffAction.setLoading(true));
            
            const response = await axiosInstance.get(`/staff/edit/${staffId}`);
            
            console.log("getStaffById response:", response.data);
            
            dispatch(staffAction.setStaff(response?.data?.data));
            dispatch(staffAction.setLoading(false));
            
            return {
                success: true,
                data: response?.data?.data
            };
        } catch (error) {
            console.error("Error fetching staff by ID:", error);
            dispatch(staffAction.setLoading(false));
            
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch staff details";
            dispatch(staffAction.setError(errorMessage));
            
            return {
                success: false,
                message: errorMessage 
            };
        }
    };
}

export function updateStaff(staffId, staffData) {
    return async (dispatch) => {
        try {
            dispatch(staffAction.setLoading(true));
            
            const response = await axiosInstance.post(
                `/staff/update/${staffId}`,
                staffData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            if (response.data.status) {
                const updatedData = response.data.data || {
                    id: staffId,
                    ...staffData
                };
                
                dispatch(staffAction.updateStaffInList(updatedData));
                dispatch(staffAction.setStaff(updatedData));
                
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
                
                dispatch(staffAction.setLoading(false));
                return {
                    success: true,
                    message: response?.data.message,
                    data: updatedData
                };
            } else {
                dispatch(staffAction.setLoading(false));
                return {
                    success: false,
                    message: response?.data?.message || 'Unknown error'
                };
            }
       } catch (error) {
    console.error("Full error object:", error);
    console.error("Error response:", error.response);

    const apiMessage = error.response?.data?.message || "Something went wrong";

    // ✅ Errors from backend (validation)
    if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        const formattedErrors = Object.keys(errors).reduce((acc, field) => {
            acc[field] = Array.isArray(errors[field])
                ? errors[field].join(", ")
                : errors[field];
            return acc;
        }, {});

        dispatch(staffAction.setError(formattedErrors));

        // ✅ Show every validation error in toast
        Object.keys(formattedErrors).forEach(field => {
            toast.error(`${formattedErrors[field]}`, {
                position: "top-center",
                duration: 4000,
            });
        });
    } else {
        // ✅ Show general backend message like "Password does not match"
        toast.error(apiMessage, {
            position: "top-center",
            duration: 4000,
        });

        dispatch(staffAction.setError({ general: apiMessage }));
    }

    dispatch(staffAction.setLoading(false));

    return {
        success: false,
        message: apiMessage
    };
}

    };
}

export function updateAvailabilStaff(id, formData) {
  return async (dispatch) => {
    dispatch(staffAction.setLoading(true));
    
    try {
      console.log('updateAvailabilStaff - formData:', formData);
      
      if (!formData || (!formData.available_times && !formData.available_dates)) {
        throw new Error("Invalid availability data format");
      }

      const requestBody = {
        available_times: formData.available_times || [],
        available_dates: formData.available_dates || []
      };


      if (formData.time_zone) {
        requestBody.time_zone = formData.time_zone;
      }

      console.log('updateAvailabilStaff - requestBody:', requestBody);

      const response = await axiosInstance.post(
        `/staff/availability/update/${id}`,
        requestBody
      );
      
      if (response.data.status) {
        await dispatch(getStaffById(id));
        dispatch(staffAction.setError(null));
        
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
      
      dispatch(staffAction.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(staffAction.setLoading(false));
    }
  };
}

export function updateUnAvailabilStaff(id, formData) {
  return async (dispatch) => {
    dispatch(staffAction.setLoading(true));
    
    try {
      console.log('updateUnAvailabilStaff - formData:', formData);
      
      if (!formData) {
        throw new Error("Invalid availability data format");
      }

      const requestBody = {};
      
      // إضافة un_available_times إذا كان موجود
      if (formData.un_available_times) {
        requestBody.un_available_times = formData.un_available_times;
      }
      
      // إضافة un_available_dates إذا كان موجود
      if (formData.un_available_dates) {
        requestBody.un_available_dates = formData.un_available_dates;
      }

      // إضافة time_zone إذا كان موجود
      if (formData.time_zone) {
        requestBody.time_zone = formData.time_zone;
      }

      console.log('updateUnAvailabilStaff - requestBody:', requestBody);

      const response = await axiosInstance.post(
        `/staff/unavailability/update/${id}`,
        requestBody
      );
      
      if (response.data.status) {
        await dispatch(getStaffById(id));
        dispatch(staffAction.setError(null));
        
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
      
      dispatch(staffAction.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(staffAction.setLoading(false));
    }
  };
}

export const updateShareLinkStaff = (newShareLink, id) => {
  return async (dispatch, getState) => {
    dispatch(staffAction.setLoading(true)); 
    try {
      const requestBody = newShareLink ? { share_link: newShareLink } : {};

      const response = await axiosInstance.post(
        `/staff/regenerate-share-link/${id}`,
        requestBody
      );

      if (response.data && response.data.data) {
        dispatch(staffAction.updateStaffShareLink({
          id: id,
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
      dispatch(staffAction.setLoading(false));
    }
  };
};

export function deleteStaff(staffId) {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.delete(`/staff/delete/${staffId}`);
            
            if (response.data.status) {
                dispatch(staffAction.removeStaffFromList(staffId));
                
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
                
                dispatch(staffAction.setLoading(false));
                return {
                    success: true,
                    message: response?.data.message
                };
            }
        } catch (error) {
            console.error("Error delete staff:", error);
            dispatch(staffAction.setLoading(false));
            
            const errorMessage = error.response?.data?.message || "Failed to delete staff";
            dispatch(staffAction.setError(errorMessage));
            
            return {
                success: false,
                message: errorMessage
            };
        }
    }
}

export function assignInterviewsToStaff(id, formData) {
  return async (dispatch) => {
    try {
      console.log(formData);
      
      const response = await axiosInstance.post(
        `/staff/assign-interviews/${id}`,
        formData
      );

      if (response.data.status) {
        console.log(response);
        
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
      console.error("Error updating staff:", error);
      return { success: false, message: error.message };
    }
  };
}