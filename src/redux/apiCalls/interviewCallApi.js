import { interviewAction } from "../slices/interviewsSlice";
import axios from "axios";
import toast from "react-hot-toast";

// *fetch function to get all interviews

export function fetchInterviews({ work_space_id = 0, staff_id = null, force = false }) {
  return async (dispatch, getState) => {
    const { interviews, loading, currentWorkspaceId, currentStaffId } = getState().interview;

    if (loading) {
      return;
    }

    const shouldFetch =
      force ||
      !interviews ||
      currentWorkspaceId !== work_space_id ||
      currentStaffId !== staff_id;

    if (!shouldFetch) {
      return;
    }

    try {
      dispatch(interviewAction.setLoading(true));

      const Token = localStorage.getItem("access_token");
      let url = "https://backend-booking.appointroll.com/api/interview/index";

      const params = new URLSearchParams();
      if (work_space_id && work_space_id !== 0) params.append("work_space_id", work_space_id);
      if (staff_id) params.append("staff_id", staff_id);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
      });

      if (response.data.status) {
        dispatch(
          interviewAction.setInterviews({
            interviews: response?.data?.data?.interviews || [],
            workspaceId: work_space_id,
            staffId: staff_id,
          })
        );

        dispatch(interviewAction.setError(null));
      } else {
        dispatch(
          interviewAction.setInterviews({
            interviews: [],
            workspaceId: work_space_id,
            staffId: staff_id,
          })
        );
        dispatch(interviewAction.setError(response.data.message ));
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);

      dispatch(
        interviewAction.setInterviews({
          interviews: [],
          workspaceId: work_space_id,
          staffId: staff_id,
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

      const Token = localStorage.getItem("access_token");
      const url = "https://backend-booking.appointroll.com/api/interview/index";

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
      });

      if (response.data.status) {
        dispatch(
          interviewAction.setAllInterviews(response?.data?.data?.interviews || [])
        );
        dispatch(interviewAction.setError(null));
      } else {
        dispatch(interviewAction.setAllInterviews([]));
        dispatch(interviewAction.setError(response.data.message ));
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
      const Token = localStorage.getItem("access_token");

      const response = await axios.get(
        `https://backend-booking.appointroll.com/api/interview/edit/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );
    //   console.log(response?.data.data.interview);
      
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
              const Token = localStorage.getItem("access_token");
        
              const isFile = formData.photo instanceof File;
        
              let response;
        
              if (isFile) {
                const data = new FormData();
                for (const key in formData) {
                  if (formData.hasOwnProperty(key)) {
                    data.append(key, formData[key]);
                  }
                }
        
                response = await axios.post(
                  `https://backend-booking.appointroll.com/api/interview/details/update/${id}`,
                  data,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      authorization: Token,
                    },
                  }
                );
              } else {
                response = await axios.post(
                  `https://backend-booking.appointroll.com/api/interview/details/update/${id}`,
                  formData,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      authorization: Token,
                    },
                  }
                );
              }
        
              if (response.data.status) {
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
export function createInterview(formData, navigate) {
  return async (dispatch) => {
    dispatch(interviewAction.setLoading(true));

    try {
      const token = localStorage.getItem("access_token");

      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/interview/store`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token,
          },
        }
      );

      console.log("Full API Response:", response.data);

      if (response.data.status) {
        dispatch(interviewAction.setError(null));
         toast.success(response?.data.message, {
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
          await dispatch(fetchInterviews())
          navigate('/layoutDashboard/interviews');
        return {
          success: true,
          message: response?.data.message || "Interview created successfully"
        };
      }
    } catch (error) {
      console.error("Error creating interview:", error.response?.data || error);

      if (error.response && error.response.data) {
  const { errors } = error.response.data;

        if (errors) {
          Object.values(errors).forEach((fieldErrors) => {
            fieldErrors.forEach((msg) => {
              toast.error(msg);
            });
          });
        } else {
          toast.error("Something went wrong, please try again.");
        }

        return {
          success: false,
          message: "Validation failed",
        };
      }

      dispatch(interviewAction.setError(errorMessage));
      
   
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
      const Token = localStorage.getItem("access_token");
      
      // Validate formData structure
      if (!formData || (!formData.available_times && !formData.available_dates)) {
        throw new Error("Invalid availability data format");
      }

      // Prepare the request body according to API template
      const requestBody = {
        available_times: formData.available_times || [],
        available_dates: formData.available_dates || []
      };

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/interview/availability/update/${id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
      );
      
      if (response.data.status) {
        // Fetch the updated interview data
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
      const Token = localStorage.getItem("access_token");
      
      // Validate formData structure
      if (!formData || (!formData.un_available_times && !formData.un_available_dates)) {
        throw new Error("Invalid availability data format");
      }

      // Prepare the request body according to API template
      const requestBody = {
        un_available_times: formData.un_available_times || [],
        un_available_dates: formData.un_available_dates || []
      };

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/interview/unavailability/update/${id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
      );
      
      if (response.data.status) {
        // Fetch the updated interview data
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
      const Token = localStorage.getItem("access_token");
      
      // Validate formData structure
      if (!formData || !formData.methods || !Array.isArray(formData.methods)) {
        throw new Error("Invalid notification data format - methods array is required");
      }

      // Validate methods array
      if (formData.methods.length === 0) {
        throw new Error("Methods array cannot be empty");
      }

      // Validate each method object
      for (const method of formData.methods) {
        if (!method.name || !method.reminders) {
          throw new Error("Each method must have 'name' and 'reminders' fields");
        }
        
        if (!Array.isArray(method.reminders) || method.reminders.length === 0) {
          throw new Error("Reminders array is required and cannot be empty for each method");
        }
        
        // Validate each reminder object
        for (const reminder of method.reminders) {
          if (!reminder.before || !reminder.type) {
            throw new Error("Each reminder must have 'before' and 'type' fields");
          }
          if (!['minute', 'hour', 'day'].includes(reminder.type)) {
            throw new Error("Reminder type must be 'minute', 'hour', or 'day'");
          }
        }
      }

      // Use the formData directly as it matches the required API format
      const requestBody = {
        methods: formData.methods.map(method => ({
          name: method.name,
          reminders: method.reminders.map(reminder => ({
            before: reminder.before,
            type: reminder.type
          }))
        }))
      };

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/interview/notifications/update/${id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
      );
      
      if (response.data.status) {
        // Fetch the updated interview data
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
      const Token = localStorage.getItem("access_token");

      const response = await axios.get(
        `https://backend-booking.appointroll.com/api/interview/available_staff/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );
      // console.log("🔹 API response:", response.data);

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
        const token = localStorage.getItem("access_token");
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/interview/assign-staff/${id}`,
          formData,
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
          return { success: true, message: response.data.message };
        } else {
          throw new Error(response.data.message );
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
        const token = localStorage.getItem("access_token");
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/interview/unassign-staff/${id}`,
          formData,
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
          return { success: true, message: response.data.message };
        } else {
          throw new Error(response.data.message );
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
      const Token = localStorage.getItem("access_token");

      const response = await axios.delete(
        `https://backend-booking.appointroll.com/api/interview/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );

      if (response.data.status) {
        // حذف من القائمة
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
      const Token = localStorage.getItem("access_token");

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/interview/details/update/${id}`,
        { type }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Token,
          },
        }
      );

      if (response.data.status) {
        // جدد الداتا بعد التغيير
        dispatch(editInterviewById(id));
        // toast.success("Interview type updated successfully");
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to update type");
        return { success: false };
      }
    } catch (err) {
      console.error("Failed to update interview type:", err);
      // toast.error("Error updating type");
      return { success: false };
    }
  };
}
