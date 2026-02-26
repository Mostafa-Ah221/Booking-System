import { object } from "yup";
import axiosInstance from "../../Components/pages/axiosInstance";
import { themeActions } from "../slices/themeSlice";
import { toast } from "react-hot-toast";

// =======================
//  Get Theme By ID
// =======================
export function getCustomerTheme() {
  return async (dispatch) => {
    dispatch(themeActions.setLoading(true)); 
    
    try {
      const response = await axiosInstance.get(`/theme/show`);

      if (response.data.status) {
        dispatch(themeActions.setTheme(response.data.data));
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes('No query results')) {
        dispatch(themeActions.setTheme(null));
        return { success: true, data: null, isNew: true };
      }
      
      dispatch(themeActions.setError(errorMessage)); 

      toast.error(errorMessage, {
        position: "top-center",
        duration: 4000,
      });

      return { success: false, message: errorMessage };
    } finally {
      dispatch(themeActions.setLoading(false)); 
    }
  };
}

export function getTheme(id) {
  return async (dispatch) => {
    dispatch(themeActions.setLoading(true));
    
    try {
      const response = await axiosInstance.get(`/theme/show/${id}`);

      if (response.data.status) {
        dispatch(themeActions.setTheme(response.data.data));
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      
      dispatch(themeActions.setError(errorMessage));

      toast.error(errorMessage, {
        position: "top-center",
        duration: 4000,
      });

      return { success: false, message: errorMessage };
    } finally {
      dispatch(themeActions.setLoading(false)); 
    }
  };
}


export function getStaffTheme() {
  return async (dispatch) => {
    dispatch(themeActions.setLoading(true)); 
    
    try {
      const response = await axiosInstance.get(`/staff/theme/show`);

      if (response.data.status) {
        dispatch(themeActions.setTheme(response.data.data));
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes('No query results')) {
        dispatch(themeActions.setTheme(null));
        return { success: true, data: null, isNew: true };
      }
      
      dispatch(themeActions.setError(errorMessage)); 

      toast.error(errorMessage, {
        position: "top-center",
        duration: 4000,
      });

      return { success: false, message: errorMessage };
    } finally {
      dispatch(themeActions.setLoading(false)); 
    }
  };
}
// =======================
// 📌 Update Theme
// =======================
export function updateTheme(data) {
  return async (dispatch) => {
    
    try {
      console.log(data);
      
      const response = await axiosInstance.post(`/theme/update`, data);

      if (response.data.status) {
        dispatch(themeActions.updateTheme(response.data.data));
        
        toast.success(response.data.message || "Theme updated successfully", {
          position: "top-center",
          duration: 4000,
        });

        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      console.error("❌ Error updating theme:", error);

      const errorMessage = error.response?.data?.message || error.message;
      const backendErrors = error.response?.data?.errors || null;
      
      dispatch(themeActions.setError(errorMessage)); 
     if (backendErrors) {
        Object.keys(backendErrors).forEach((field) => {
          const msg = Array.isArray(backendErrors[field])
          ? backendErrors[field].join(", ")
        : backendErrors[field];

        toast.error(msg, {
          position: "top-center",
          duration: 4000,
        });
        }) 
      } else{
        toast.error(errorMessage, {
          position: "top-center",
          duration: 4000,
        });
      }

      return { success: false, message: errorMessage, errors: backendErrors };
    }
  };
}
export function updateThemeStaff(data) {
  return async (dispatch) => {
    
    try {
      console.log(data);
      
      const response = await axiosInstance.post(`/staff/theme/update`, data);

      if (response.data.status) {
        dispatch(themeActions.updateTheme(response.data.data));
        
        toast.success(response.data.message || "Theme updated successfully", {
          position: "top-center",
          duration: 4000,
        });

        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      console.error("❌ Error updating theme:", error);

      const errorMessage = error.response?.data?.message || error.message;
      const backendErrors = error.response?.data?.errors || null;
      
      dispatch(themeActions.setError(errorMessage)); 
       if (backendErrors) {
        Object.keys(backendErrors).forEach((field) => {
          const msg = Array.isArray(backendErrors[field])
          ? backendErrors[field].join(", ")
        : backendErrors[field];

        toast.error(msg, {
          position: "top-center",
          duration: 4000,
        });
        })
          
      }else{
        toast.error(errorMessage, {
          position: "top-center",
          duration: 4000,
        });
      }

      return { success: false, message: errorMessage, errors: backendErrors };
    }
  };
}