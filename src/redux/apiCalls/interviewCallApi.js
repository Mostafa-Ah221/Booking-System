import { interviewAction } from "../slices/interviewsSlice";
import axiosInstance from "../../Components/pages/axiosInstance";
import toast from "react-hot-toast";

// *fetch function to get all interviews

export function fetchInterviews({ work_space_id = 0, staff_id = null,type=null, force = false }) {
  return async (dispatch, getState) => {
    const { interviews, loading, currentWorkspaceId, currentStaffId,currentType } = getState().interview;
    if (loading) {
      return;
    }
    const shouldFetch =
      force ||
      !interviews ||
      currentWorkspaceId !== work_space_id ||
      currentStaffId !== staff_id ||
      currentType !== type; 

    if (!shouldFetch) {
      return;
    }

    try {
      dispatch(interviewAction.setLoading(true));

      const params = new URLSearchParams();
      if (work_space_id && work_space_id !== 0) params.append("work_space_id", work_space_id);
      if (staff_id) params.append("staff_id", staff_id);
      if (type) params.append("type", type);

      const queryString = params.toString();
      const url = queryString ? `/interview/index?${queryString}` : '/interview/index';

      const response = await axiosInstance.get(url);

      if (response.data.status) {
        dispatch(
          interviewAction.setInterviews({
            interviews: response?.data?.data?.interviews || [],
            workspaceId: work_space_id,
            staffId: staff_id,
            type:type
          })
        );

        dispatch(interviewAction.setError(null));
      } else {
        dispatch(
          interviewAction.setInterviews({
            interviews: [],
            workspaceId: work_space_id,
            staffId: staff_id,
            type:type
          })
        );
        dispatch(interviewAction.setError(response.data.message));
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);

      dispatch(
        interviewAction.setInterviews({
          interviews: [],
          workspaceId: work_space_id,
          staffId: staff_id,
          type: type
        })
      );
    } finally {
      dispatch(interviewAction.setLoading(false));
    }
  };
}

export function fetchAllInterviews({ force = false } = {}) {
  return async (dispatch, getState) => {
    const { allInterviews, loading } = getState().interview;

    if (loading) {
      return;
    }

    if (!force && allInterviews !== null) {
      return;
    }

    try {
      dispatch(interviewAction.setLoading(true));

      const response = await axiosInstance.get('/interview/index');

      if (response.data.status) {
        dispatch(
          interviewAction.setAllInterviews(response?.data?.data?.interviews || [])
        );
        dispatch(interviewAction.setError(null));
      } else {
        dispatch(interviewAction.setAllInterviews([]));
        dispatch(interviewAction.setError(response.data.message));
      }
    } catch (err) {
      console.error("Failed to fetch all interviews:", err);
      dispatch(interviewAction.setAllInterviews([]));
    } finally {
      dispatch(interviewAction.setLoading(false));
    }
  };
}

//* fetch function edite interview by Id
export function editInterviewById(id) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(`/interview/edit/${id}`);
      
      if (response.data.status) {
        dispatch(interviewAction.setInterview(response?.data.data.interview)); 
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  };
}

export function updateInterview(id, formData) {
  return async (dispatch) => {
    dispatch(interviewAction.setLoading(true));

    try {
      const isFile = formData.photo instanceof File;

      let response;
      let headers = {};

      if (isFile) {
        const data = new FormData();
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            data.append(key, formData[key]);
          }
        }

        headers['Content-Type'] = 'multipart/form-data';

        response = await axiosInstance.post(
          `/interview/details/update/${id}`,
          data,
          { headers }
        );
      } else {
        response = await axiosInstance.post(
          `/interview/details/update/${id}`,
          formData
        );
      }

      if (response.data.status) {
        const updatedData = response?.data?.data?.interview;
        if (updatedData) {
          dispatch(interviewAction.updateInterviewInList(updatedData));
        }
        dispatch(editInterviewById(id));
        dispatch(interviewAction.setError(null));
        return {
          success: true,
          message: response?.data.message || "Interview updated successfully",
        };
      }
    } catch (error) {
      console.error("Error updating interview:", error);
      const errorMessage = error?.response?.data?.message || "Failed to update interview";

      dispatch(interviewAction.setError(errorMessage));
      return {
        success: false,
        message: errorMessage,
        errors: error?.response?.data?.errors || null,
      };
    } finally {
      dispatch(interviewAction.setLoading(false));
    }
  };
}

// create a new interview function
export function createInterview(formData) { 
  return async (dispatch) => { 
    dispatch(interviewAction.setLoading(true)); 
 
    try { 
      const data = new FormData(); 
      
      for (const key in formData) { 
        if (formData[key] !== null && formData[key] !== '') { 
          if (key === 'groups' && Array.isArray(formData[key])) {
            formData[key].forEach((group, groupIndex) => {
              data.append(`groups[${groupIndex}][name]`, group.name);
              if (Array.isArray(group.staff_ids)) {
                group.staff_ids.forEach((staffId, staffIndex) => {
                  data.append(`groups[${groupIndex}][staff_ids][${staffIndex}]`, staffId);
                });
              }
            });
          } else if (formData[key] instanceof File) {
            data.append(key, formData[key]);
          } else if (typeof formData[key] === 'object') {
            data.append(key, JSON.stringify(formData[key]));
          } else {
            data.append(key, formData[key]);
          }
        } 
      } 
 
      const response = await axiosInstance.post('/interview/store', data, { 
        headers: { 'Content-Type': 'multipart/form-data' }, 
      }); 
 
      if (response.data.status) {
        const newInterview = response.data.data?.interview || response.data.data;
        
        if (newInterview?.id) {
          dispatch(interviewAction.addInterviewToList(newInterview));
        } else {
          await dispatch(fetchAllInterviews({ force: true }));
        }
        
        dispatch(interviewAction.setError(null)); 
        
        toast.success(response?.data.message, { 
          position: 'top-center',          
          duration: 5000, 
          icon: '✅', 
        }); 
        
        return { 
          success: true, 
          message: response?.data.message,
          data: newInterview
        }; 
      }
      
      return { success: false, message: "Failed to create interview" };
      
    } catch (error) { 
      if (error.response?.data?.errors) { 
        const backendErrors = error.response.data.errors;
        console.log(backendErrors);
        
        const formattedErrors = {};
        Object.keys(backendErrors).forEach((field) => {
          formattedErrors[field] = backendErrors[field][0]; 
        });
        
        return { 
          success: false, 
          errors: formattedErrors,
          message: "Validation failed" 
        }; 
      }
      
      return { success: false, message: error.message };
 
    } finally { 
      dispatch(interviewAction.setLoading(false)); 
    } 
  }; 
}

// updata availability time and date for the interview action
export function updateAvailability(id, formData) {
  return async (dispatch) => {
    dispatch(interviewAction.setLoading(true));
    
    try {
      if (!formData || (!formData.available_times && !formData.available_dates)) {
        throw new Error("Invalid availability data format");
      }

      const requestBody = {
        available_times: formData.available_times || [],
        available_dates: formData.available_dates || []
      };

      const response = await axiosInstance.post(
        `/interview/availability/update/${id}`,
        requestBody
      );
      
      if (response.data.status) {
        await dispatch(editInterviewById(id));
        dispatch(interviewAction.setError(null));
        
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
      
      dispatch(interviewAction.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(interviewAction.setLoading(false));
    }
  };
}

export function updateUnAvailability(id, formData) {
  return async (dispatch) => {
    dispatch(interviewAction.setLoading(true));
    
    try {
      if (!formData) {
        throw new Error("Invalid availability data format");
      }
      console.log(formData);
      
      const requestBody = {};
      if (formData.un_available_times) {
        requestBody.un_available_times = formData.un_available_times;
      }
      if (formData.un_available_dates) {
        requestBody.un_available_dates = formData.un_available_dates;
      }

      const response = await axiosInstance.post(
        `/interview/unavailability/update/${id}`,
        requestBody
      );
      
      if (response.data.status) {
        await dispatch(editInterviewById(id));
        dispatch(interviewAction.setError(null));
        
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
      
      dispatch(interviewAction.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(interviewAction.setLoading(false));
    }
  };
}

export function notificationReminder(id, formData) {
  return async (dispatch) => {
    dispatch(interviewAction.setLoading(true));
    
    try {
      if (!formData || !formData.methods || !Array.isArray(formData.methods)) {
        throw new Error("Invalid notification data format - methods array is required");
      }

      if (formData.methods.length === 0) {
        throw new Error("Methods array cannot be empty");
      }

      for (const method of formData.methods) {
        if (!method.name || !method.reminders) {
          throw new Error("Each method must have 'name' and 'reminders' fields");
        }
        
        if (!Array.isArray(method.reminders) || method.reminders.length === 0) {
          throw new Error("Reminders array is required and cannot be empty for each method");
        }
        
        for (const reminder of method.reminders) {
          if (!reminder.before || !reminder.type) {
            throw new Error("Each reminder must have 'before' and 'type' fields");
          }
          if (!['minute', 'hour', 'day'].includes(reminder.type)) {
            throw new Error("Reminder type must be 'minute', 'hour', or 'day'");
          }
        }
      }

      const requestBody = {
        methods: formData.methods.map(method => ({
          name: method.name,
          reminders: method.reminders.map(reminder => ({
            before: reminder.before,
            type: reminder.type
          }))
        }))
      };

      const response = await axiosInstance.post(
        `/interview/notifications/update/${id}`,
        requestBody
      );
      
      if (response.data.status) {
        await dispatch(editInterviewById(id));
        dispatch(interviewAction.setError(null));
        
        return {
          status: true,
          message: response.data.message || "Notification reminders updated successfully",
          data: response.data.data || null
        };
      } else {
        throw new Error(response.data.message || "Failed to update notification reminders");
      }
    } catch (error) {
      console.error("Error updating notification reminders:", error);
      
      let errorMessage = "Failed to update notification reminders";
      let errorDetails = null;
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        errorDetails = error.response.data.errors || null;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(interviewAction.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(interviewAction.setLoading(false));
    }
  };
}

export function getAvailableStaffForInterview(id) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(`/interview/available_staff/${id}`);

      if (response.data.status) {
        dispatch(interviewAction.setAvailableStForIntV(response?.data.data.available_staff)); 
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  };
}

export function assignInterViewToStaff(id, formData) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/interview/assign/${id}`,
        formData
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

        // ✅ حدّث الـ interview state
        if (response.data.data) {
          dispatch(interviewAction.setInterview(response.data.data));
        } else {
          // لو الـ API مش راجع الـ data كاملة، اجلبها من جديد
          dispatch(editInterviewById(id));
        }

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

export function unAssignStaffFromInterview(id, formData) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/interview/unassign/${id}`,
        formData
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

        // ✅ حدّث الـ interview state
        if (response.data.data) {
          dispatch(interviewAction.setInterview(response.data.data));
        } else {
          // لو الـ API مش راجع الـ data كاملة، اجلبها من جديد
          dispatch(editInterviewById(id));
        }

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

export function deleteInterview(id) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.delete(`/interview/delete/${id}`);

      if (response.data.status) {
        dispatch(interviewAction.removeInterview(id));
      }
    } catch (err) {
      console.error("Failed to delete interview:", err);
    }
  };
}

export function updateInterviewType(id, type) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/interview/details/update/${id}`,
        { type }
      );

      if (response.data.status) {
        dispatch(editInterviewById(id));
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to update type");
        return { success: false };
      }
    } catch (err) {
      console.error("Failed to update interview type:", err);
      return { success: false };
    }
  };
}

export const updateShareLinkIntreview = (newShareLink, id) => {
  return async (dispatch, getState) => {
    dispatch(interviewAction.setLoading(true)); 
    try {
      const requestBody = newShareLink ? { share_link: newShareLink } : {};

      const response = await axiosInstance.post(
        `/interview/regenerate-share-link/${id}`,
        requestBody
      );

      if (response.data && response.data.data) {
        console.log('Response:', response.data.data);
        dispatch(interviewAction.updateInterviewShareLink({
          id: id,
          share_link: response.data.data
        }));
        
        toast.success("Share link updated successfully");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update share link";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(interviewAction.setLoading(false));
    }
  };
};


export function addNewGroupToInterview(id, formData) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/interview/store/${id}/group`,
        formData
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

        // ✅ حدّث الـ interview state
        if (response.data.data) {
          dispatch(interviewAction.setInterview(response.data.data));
        } else {
          // لو الـ API مش راجع الـ data كاملة، اجلبها من جديد
          dispatch(editInterviewById(id));
        }

        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating group:", error);

      const errors = error.response?.data?.errors;

      if (errors) {
        Object.values(errors).forEach(errArray => {
          errArray.forEach(errMsg => {
            toast.error(errMsg, {
              position: "top-center",
              duration: 5000,
              className: "!text-[14px] !font-normal",
              style: {
                borderRadius: "8px",
                background: "#c00",
                color: "#fff",
                padding: "12px 16px",
                fontWeight: "500",
              },
            });
          });
        });
      }

      return { success: false };
    }
  };
}

// ✅ Fixed updateNewGroupToInterview with state update
export function updateNewGroupToInterview(idGroup, idInterview, formData) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/interview/update/${idInterview}/group/${idGroup}`,
        formData
      );

      if (response.data.status) {
        toast.success(response?.data?.message, {
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

        // ✅ حدّث الـ interview state
        if (response.data.data) {
          dispatch(interviewAction.setInterview(response.data.data));
        } else {
          // لو الـ API مش راجع الـ data كاملة، اجلبها من جديد
          dispatch(editInterviewById(idInterview));
        }

        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      console.error("Error updating group:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        Object.values(errors).forEach((errArr) => {
          errArr.forEach((errMsg) =>
            toast.error(errMsg, {
              position: "top-center",
              duration: 5000,
              className: "!text-[14px]", 
              style: {
                borderRadius: "8px",
                background: "#c00",
                color: "#fff",
                padding: "12px 16px",
              },
            })
          );
        });
      }

      return { success: false, message: error.message };
    }
  };
}

// ✅ Fixed deleteGroup with proper state update
export function deleteGroup(idGroup, idInterview) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.delete(
        `/interview/delete/${idInterview}/group/${idGroup}`
      );

      if (response.data.status) {
        toast.success(response?.data?.message || "Group deleted successfully", {
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

        // ✅ حدّث الـ interview state بالـ data الصحيحة
        if (response.data.data) {
          dispatch(interviewAction.setInterview(response.data.data));
        } else {
          // لو الـ API مش راجع الـ data كاملة، اجلبها من جديد
          dispatch(editInterviewById(idInterview));
        }

        return { success: true };
      }
    } catch (err) {
      console.error("Failed to delete group:", err);
      
      toast.error(err.response?.data?.message || "Failed to delete group", {
        position: "top-center",
        duration: 5000,
        style: {
          borderRadius: "8px",
          background: "#c00",
          color: "#fff",
          padding: "12px 16px",
          fontWeight: "500",
        },
      });

      return { success: false };
    }
  };
}