import { workspaceAction } from "../slices/workspaceSlice";
import toast from 'react-hot-toast';
import axios from "axios";

export function getWorkspace({ staff_id = null, force = false } = {}) {
  return async (dispatch, getState) => {
    const { workspaces, loading, currentStaffId } = getState().workspace;
    if (
      workspaces &&
      workspaces.length > 0 &&
      !force &&
      !loading &&
      currentStaffId === staff_id
    ) {
      return;
    }

    try {
      dispatch(workspaceAction.setLoading(true));

      const Token = localStorage.getItem("access_token");

      let url = "https://backend-booking.appointroll.com/api/workspace/index";

      if (staff_id) {
        url += `?staff_id=${staff_id}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
      });

      dispatch(
        workspaceAction.setWorkspaces({
          workspaces: response?.data?.data?.workspaces || [],
          staffId: staff_id,
        })
      );

      dispatch(workspaceAction.setError(null));
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      dispatch(workspaceAction.setError(error.response?.data?.message));
    } finally {
      dispatch(workspaceAction.setLoading(false));
    }
  };
}

export function getAllWorkspaces({ force = false } = {}) {
  return async (dispatch, getState) => {
    const { allWorkspaces, loading } = getState().workspace;

    if (loading) {
      return;
    }

    if (!force && allWorkspaces !== null) {
      return;
    }

    try {
      dispatch(workspaceAction.setLoading(true));

      const Token = localStorage.getItem("access_token");
      const url = "https://backend-booking.appointroll.com/api/workspace/index";

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
      });

      dispatch(
        workspaceAction.setAllWorkspaces(response?.data?.data?.workspaces || [])
      );

      dispatch(workspaceAction.setError(null));
    } catch (error) {
      console.error("Error fetching all workspaces:", error);
      dispatch(workspaceAction.setAllWorkspaces([]));
      dispatch(workspaceAction.setError(error.response?.data?.message || "فشل في تحميل المساحات"));
    } finally {
      dispatch(workspaceAction.setLoading(false));
    }
  };
}

// create a new workspace
 export function createWorkSpace(namespace) {
  return async (dispatch) => {
    try {
       const Token = localStorage.getItem("access_token");
      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/workspace/store`,
        { name: namespace },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );
      
      if (response?.data?.message) {
         await dispatch(getWorkspace(true));
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
       
        return { success: true };
      } 
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };
}

  // Fetch the updated ًWork-space data
export function updataWorkspace(id, name) {
  return async (dispatch) => {
    try {
      const Token = localStorage.getItem("access_token");
      
      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/workspace/update/${id}`,
        { name: name },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
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
        dispatch(getWorkspace(true));
        return {
          success: true,
          message: response?.data.message
          
        };
        
      }
      
    } catch (error) {
      console.error("Error updating work space:", error);
      return {
        success: false,
        message: error.response?.data?.message 
      };
    }
  };
}

export function editWorkspaceById(id) {
  return async (dispatch) => {
    try {
      const Token = localStorage.getItem("access_token");

      const response = await axios.get(
        `https://backend-booking.appointroll.com/api/workspace/edit/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );
    //   console.log(response?.data.data.interview);
      
      if (response.data.status) {
        dispatch(workspaceAction.setWorkspace(response?.data.data.workspace)); 
        
      }
    } catch (err) {
      console.error("Failed to fetch Workspaces:", err);
    }
  };
}

export function updateAvailabilWorkspace(id, formData) {
  return async (dispatch) => {
    dispatch(workspaceAction.setLoading(true));
    
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
        `https://backend-booking.appointroll.com/api/workspace/availability/update/${id}`,
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
        await dispatch(editWorkspaceById(id));
        dispatch(workspaceAction.setError(null));
        
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
      
      dispatch(workspaceAction.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(workspaceAction.setLoading(false));
    }
  };
}
export function updateUnAvailabilWorkspace(id, formData) {
  return async (dispatch) => {
    dispatch(workspaceAction.setLoading(true));
    
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
        `https://backend-booking.appointroll.com/api/workspace/unavailability/update/${id}`,
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
        await dispatch(editWorkspaceById(id));
        dispatch(workspaceAction.setError(null));
        
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
      
      dispatch(workspaceAction.setError(errorMessage));
      
      return {
        status: false,
        message: errorMessage,
        errors: errorDetails,
        code: error.response?.status || 500
      };
    } finally {
      dispatch(workspaceAction.setLoading(false));
    }
  };
}

 export function assignWorkSpToStaff(id, formData) {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem("access_token");
  
        const response = await axios.post(
          `https://backend-booking.appointroll.com/api/workspace/assign-workspace/${id}`,
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

  export function deleteWorkspace (id){
    return async (dispatch) => {
      try {
          const Token = localStorage.getItem("access_token");
          const response= await axios.delete(`https://backend-booking.appointroll.com/api/workspace/delete/${id}`,
            {
            headers: {
              "Content-Type": "application/json",
              authorization: Token,
            },
          }
          )
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
            dispatch(getWorkspace(true));
            return {
              success: true,
              message: response?.data.message
            };
          }
      } catch (error) {
          console.error("Error updating work space :", error);
      }
    }
  }
