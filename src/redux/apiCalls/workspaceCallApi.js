import { workspaceAction } from "../slices/workspaceSlice";
import toast from 'react-hot-toast';
import axiosInstance from "../../Components/pages/axiosInstance";

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

      const url = staff_id ? `/workspace/index?staff_id=${staff_id}` : '/workspace/index';

      const response = await axiosInstance.get(url);

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

      const response = await axiosInstance.get('/workspace/index');

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
      const response = await axiosInstance.post(
        '/workspace/store',
        { name: namespace }
      );
      
      if (response?.data?.status) {
        const newWorkspace = response.data.data?.workspace || response.data.data;
        
        if (newWorkspace && newWorkspace.id) {
          dispatch(workspaceAction.addWorkspaceToList(newWorkspace));
        } else {
          await dispatch(getWorkspace({ force: true }));
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
       
        return { success: true };
      } 
   } catch (error) {
  console.error("Error creating workspace:", error);

  const apiErrors = error.response?.data?.errors;

  if (apiErrors) {
    Object.values(apiErrors).forEach((errArray) => {
      errArray.forEach((errMsg) => {
        toast.error(errMsg);
      });
    });
  } else {
    toast.error(error.response?.data?.message || "Something went wrong");
  }

  return { success: false };
}

  };
}

// Fetch the updated ًWork-space data
export function updataWorkspace(id, name) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        `/workspace/update/${id}`,
        { name: name }
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
          dispatch(workspaceAction.updateWorkspaceInList(response.data.data));
        } else {
          dispatch(getWorkspace({ force: true }));
        }
        
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
      const response = await axiosInstance.get(`/workspace/edit/${id}`);
      
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
      console.log('updateAvailabilWorkspace - formData:', formData);
      
      if (!formData || (!formData.available_times && !formData.available_dates)) {
        throw new Error("Invalid availability data format");
      }

      const requestBody = {
        available_times: formData.available_times || [],
        available_dates: formData.available_dates || []
      };

      // إضافة time_zone إذا كان موجود
      if (formData.time_zone) {
        requestBody.time_zone = formData.time_zone;
      }

      console.log('updateAvailabilWorkspace - requestBody:', requestBody);

      const response = await axiosInstance.post(
        `/workspace/availability/update/${id}`,
        requestBody
      );
      
      if (response.data.status) {
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
      console.log('updateUnAvailabilWorkspace - formData:', formData);
      
      if (!formData || (!formData.un_available_times && !formData.un_available_dates)) {
        throw new Error("Invalid availability data format");
      }

      const requestBody = {
        un_available_times: formData.un_available_times || [],
        un_available_dates: formData.un_available_dates || []
      };

      // إضافة time_zone إذا كان موجود
      if (formData.time_zone) {
        requestBody.time_zone = formData.time_zone;
      }

      console.log('updateUnAvailabilWorkspace - requestBody:', requestBody);

      const response = await axiosInstance.post(
        `/workspace/unavailability/update/${id}`,
        requestBody
      );
      
      if (response.data.status) {
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
      const response = await axiosInstance.post(
        `/workspace/assign-workspace/${id}`,
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

export function deleteWorkspace(id) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.delete(`/workspace/delete/${id}`);
      
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
        
        dispatch(workspaceAction.removeWorkspaceFromList(id));
        
        return {
          success: true,
          message: response?.data.message
        };
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
      
      return {
        success: false,
        message: error.response?.data?.message
      };
    }
  };
}

export const updateShareLinkWorkspace = (newShareLink, id) => {
  return async (dispatch, getState) => {
    dispatch(workspaceAction.setLoading(true)); 
    try {
      const requestBody = newShareLink ? { share_link: newShareLink } : {};

      const response = await axiosInstance.post(
        `/workspace/regenerate-share-link/${id}`,
        requestBody
      );

      if (response.data) {
        dispatch(workspaceAction.setWorkspace(response.data.data));
        dispatch(workspaceAction.updateWorkspaceInList(response.data.data));

        toast.success("Share link updated successfully");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update share link";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(workspaceAction.setLoading(false));
    }
  };
};

export function getAvailableStaffForWorkspace(id) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(`/workspace/available_staff/${id}`);

      if (response.data.status) {
        dispatch(workspaceAction.setAvailableStForWorkS(response?.data.data.available_staff)); 
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  };
}
export function getAvailableRecourseForWorkspace(id) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(`/workspace/available_resources/${id}`);

      if (response.data.status) {
        dispatch(workspaceAction.setAvailableResourcesForWorkS(response?.data.data.resources)); 
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  };
}
export function getAvailableInterviewsForWorkspace(workspaceIds) {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        `/workspace/interviews`,
        {
          params: {
            workspace_ids: workspaceIds, // 👈 array
          },
        }
      );

      if (response.data.status) {
        dispatch(
          workspaceAction.setAvailableInterviewsForWorkS(
            response.data.data.interviews
          )
        );
      }
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  };
}
