import axios from "axios";
import { staffAction } from "../slices/staffSlice";
import toast from "react-hot-toast";

export function getStaff() {
  return async (dispatch) => {
        try {
            dispatch(staffAction.setStaffsLoading(true));
            const Token = localStorage.getItem("access_token");
            
            const response = await axios.get(
                `https://backend-booking.appointroll.com/api/staff/index`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            
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
            const Token = localStorage.getItem("access_token");
            
            const params = new URLSearchParams();
            
            if (filters.work_space_id) {
                params.append('work_space_id', filters.work_space_id);
            }
            
            if (filters.interview_id) {
                params.append('interview_id', filters.interview_id);
            }
            
            const queryString = params.toString();
            const url = queryString 
                ? `https://backend-booking.appointroll.com/api/staff/index?${queryString}`
                : `https://backend-booking.appointroll.com/api/staff/index`;
            
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: Token,
                },
            });
            
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
            dispatch(staffAction.clearError()); // مسح الأخطاء السابقة
            
            const Token = localStorage.getItem("access_token");

            console.log("Sending FormData to API:");
            for (let [key, value] of staffData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await axios.post(
                `https://backend-booking.appointroll.com/api/staff/store`,
                staffData, 
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // للملفات
                        authorization: Token,
                    },
                }
            );
            
            if (response?.data?.status) {
                const newStaff = response.data.data;
                
                // إضافة الموظف الجديد للقائمة
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
export function getStaffById(staffId) {
    return async (dispatch) => {
        try {
            dispatch(staffAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            
            const response = await axios.get(
                `https://backend-booking.appointroll.com/api/staff/edit/${staffId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            
            console.log("getStaffById response:", response.data); // للتتبع
            
            // هنا الحل - استخدم setStaff بدلاً من setStaffs
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
            const Token = localStorage.getItem("access_token");
            
           
            
            const response = await axios.post(
                `https://backend-booking.appointroll.com/api/staff/update/${staffId}`,
                staffData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        authorization: Token,
                    },
                }
            );
            
            if (response.data.status) {
                const updatedData = response.data.data || {
                    id: staffId,
                    ...staffData
                };
                
                // ✅ تحديث الموظف في القائمة
                dispatch(staffAction.updateStaffInList(updatedData));
                
                // ✅ تحديث staff الحالي إذا كان نفس الموظف
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
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;

                const formattedErrors = Object.keys(errors).reduce((acc, field) => {
                    acc[field] = Array.isArray(errors[field]) 
                        ? errors[field].join(", ") 
                        : errors[field];
                    return acc;
                }, {});

                dispatch(staffAction.setError(formattedErrors));
                
                dispatch(staffAction.setLoading(false));
                return {
                    success: false,
                    message: error.response?.data?.message || 'Validation failed',
                    errors: formattedErrors
                };
            } else {
                console.error("Error updating staff:", error);
                const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
                dispatch(staffAction.setError({ general: errorMessage }));
                
                dispatch(staffAction.setLoading(false));
                return {
                    success: false,
                    message: errorMessage
                };
            }
        }
    };
}

export function updateAvailabilStaff(id, formData) {
  return async (dispatch) => {
    dispatch(staffAction.setLoading(true));
    
    try {
      const Token = localStorage.getItem("access_token");
      
      if (!formData || (!formData.available_times && !formData.available_dates)) {
        throw new Error("Invalid availability data format");
      }

      const requestBody = {
        available_times: formData.available_times || [],
        available_dates: formData.available_dates || []
      };

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/staff/availability/update/${id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
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
      const Token = localStorage.getItem("access_token");
      
      // Validate formData structure
      if (!formData) {
        throw new Error("Invalid availability data format");
      }

      // بناء الـ requestBody بناءً على الداتا الموجودة
      const requestBody = {};
      if (formData.un_available_times) {
        requestBody.un_available_times = formData.un_available_times;
      }
      if (formData.un_available_dates) {
        requestBody.un_available_dates = formData.un_available_dates;
      }

      console.log('Request body sent to API:', requestBody); 

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/staff/unavailability/update/${id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
      );
      
      if (response.data.status) {
        await dispatch(getStaffById(id));
        dispatch(staffAction.setError(null));
        
        return {
          status: true,
          message: response.data.message || "Un Availability updated successfully",
          data: response.data.data || null
        };
      } else {
        throw new Error(response.data.message || "Failed to update Un availability");
      }
    } catch (error) {
      console.error("Error updating Un availability:", error);
      
      let errorMessage = "Failed to update Un availability";
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
      const token = localStorage.getItem("access_token");
      const url = `https://backend-booking.appointroll.com/api/staff/regenerate-share-link/${id}`;

      // لو newShareLink هو null أو undefined، متبعتش share_link في الـ body
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
//  export function assignWorkSpToStaff(id, formData) {
//     return async (dispatch) => {
//       try {
//         const token = localStorage.getItem("access_token");
  
//         const response = await axios.post(
//           `https://backend-booking.appointroll.com/api/staff/assign-workspace/${id}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token,
//             },
//           }
//         );
  
//         if (response.data.status) {
//           dispatch(getStaffById(id)); 
//           toast.success(response?.data?.message, {
//             position: 'top-center',         
//             duration: 5000,
//             icon: '✅',
//             style: {
//             borderRadius: '8px',
//             background: '#333',
//             color: '#fff',
//             padding: '12px 16px',
//             fontWeight: '500',
//             },
//           });
//           return { success: true, message: response.data.message };
//         } else {
//           throw new Error(response.data.message );
//         }
//       } catch (error) {
//         console.error("Error updating staff:", error);
//         return { success: false, message: error.message };
//       }
//     };
//   }
//  export function assignInterViewToStaff(id, formData) {
//     return async (dispatch) => {
//       try {
//         const token = localStorage.getItem("access_token");
  
//         const response = await axios.post(
//           `https://backend-booking.appointroll.com/api/staff/assign-interview/${id}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token,
//             },
//           }
//         );
  
//         if (response.data.status) {
//           dispatch(getStaffById(id)); 
//           toast.success(response?.data?.message, {
//             position: 'top-center',         
//             duration: 5000,
//             icon: '✅',
//             style: {
//             borderRadius: '8px',
//             background: '#333',
//             color: '#fff',
//             padding: '12px 16px',
//             fontWeight: '500',
//             },
//           });
//           return { success: true, message: response.data.message };
//         } else {
//           throw new Error(response.data.message );
//         }
//       } catch (error) {
//         console.error("Error updating staff:", error);
//         return { success: false, message: error.message };
//       }
//     };
//   }
//

export function deleteStaff(staffId) {
    return async (dispatch) => {
        try {
            // dispatch(staffAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            
            const response = await axios.delete(
                `https://backend-booking.appointroll.com/api/staff/delete/${staffId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            
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