import { interviewAction } from "../slices/interviewsSlice";
import axios from "axios";


// *fetch function to get all interviews
export function fetchInterviews(id) {
  return async (dispatch) => {
    try {
      const Token = localStorage.getItem("access_token");

      const baseUrl = "https://booking-system-demo.efc-eg.com/api/interview/index";
      const url = id === 0 ? baseUrl : `${baseUrl}?work_space_id=${id}`;
      const response = await axios.get(
        url,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );
      
      if (response.data.status) {
        dispatch(interviewAction.setInterviews(response?.data.data.interviews)); 
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  };
}

//* fetch function edite interview by Id
export function editInterviewById(id) {
  return async (dispatch) => {
    try {
      const Token = localStorage.getItem("access_token");

      const response = await axios.get(
        `https://booking-system-demo.efc-eg.com/api/interview/edit/${id}`,
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


        // Fetch the updated interview data

        export function updateInterview(id, formData) {
          return async (dispatch) => {
            dispatch(interviewAction.setLoading(true));
        
            try {
              const Token = localStorage.getItem("access_token");
        
              // 1️⃣ نقرر على حسب نوع الصورة
              const isFile = formData.photo instanceof File;
        
              let response;
        
              if (isFile) {
                // ✅ استخدام FormData
                const data = new FormData();
                for (const key in formData) {
                  if (formData.hasOwnProperty(key)) {
                    data.append(key, formData[key]);
                  }
                }
        
                response = await axios.post(
                  `https://booking-system-demo.efc-eg.com/api/interview/details/update/${id}`,
                  data,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      authorization: Token,
                    },
                  }
                );
              } else {
                // ✅ استخدام JSON عادي
                response = await axios.post(
                  `https://booking-system-demo.efc-eg.com/api/interview/details/update/${id}`,
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
        `https://booking-system-demo.efc-eg.com/api/interview/store`,
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
        alert(response?.data.message);
        navigate('/layoutDashboard/interviews');

        return {
          success: true,
          message: response?.data.message || "Interview created successfully"
        };
      }
    } catch (error) {
      console.error("Error creating interview:", error.response?.data || error);

      let errorMessage = "فشل في إنشاء المقابلة";

      if (error.response) {
        errorMessage = error.response.data.message || 'حدث خطأ غير متوقع';
      }

      dispatch(interviewAction.setError(errorMessage));
      alert(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
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
        `https://booking-system-demo.efc-eg.com/api/interview/availability/update/${id}`,
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
        `https://booking-system-demo.efc-eg.com/api/interview/unavailability/update/${id}`,
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
      // if (!formData || !formData.method || !formData.reminders) {
      //   throw new Error("Invalid notification data format");
      // }

      // // Validate reminders array
      // if (!Array.isArray(formData.reminders) || formData.reminders.length === 0) {
      //   throw new Error("Reminders array is required and cannot be empty");
      // }

      // Validate each reminder object
      // for (const reminder of formData.reminders) {
      //   if (!reminder.before || !reminder.type) {
      //     throw new Error("Each reminder must have 'before' and 'type' fields");
      //   }
      //   if (!['minute', 'hour', 'day'].includes(reminder.type)) {
      //     throw new Error("Reminder type must be 'minute', 'hour', or 'day'");
      //   }
      // }

      // Prepare the request body according to API template
      const requestBody = {
        method: formData.method,
        reminders: formData.reminders.map(reminder => ({
          before: reminder.before,
          type: reminder.type
        }))
      };

      const response = await axios.post(
        `https://booking-system-demo.efc-eg.com/api/interview/notifications/update/${id}`,
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
export function deleteInterview(id) {
  return async (dispatch) => {
    try {
      const Token = localStorage.getItem("access_token");

      const response = await axios.delete(
        `https://booking-system-demo.efc-eg.com/api/interview/delete/${id}`,
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

