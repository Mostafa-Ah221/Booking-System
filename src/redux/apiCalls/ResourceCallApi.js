import axiosInstance from "../../Components/pages/axiosInstance";
import { resourceAction } from "../slices/resourcesSlice";
import toast from "react-hot-toast";

export function getResources() {
    return async (dispatch) => {
        try {
            dispatch(resourceAction.setLoading(true));
            const response = await axiosInstance.get('/resource/index');
            
            dispatch(resourceAction.setResources(response?.data?.data));
            dispatch(resourceAction.setDataFetched(true));
            dispatch(resourceAction.setLoading(false));
        } catch (error) {
            dispatch(resourceAction.setLoading(false));
            dispatch(resourceAction.setError(error.response?.data?.message));
            return {
                success: false,
                message: error.response?.data?.message 
            };
        }
    }
}

export function addResource(resourceData) {
    return async (dispatch) => {
        try {
            dispatch(resourceAction.setLoading(true));

            const response = await axiosInstance.post(
                '/resource/store',
                resourceData
            );

            console.log("Full API Response:", response.data);
            console.log("Response Status:", response?.data?.status);
         
            if (response?.data?.status) {
                // استخدم message بدل data
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

                // لو الـ resource موجود في الـ response، ضيفه للـ list
                // لو مش موجود، يبقى Backend مش بيرجعه
                const newResource = response.data.data?.resource;
                if (newResource) {
                    console.log("New resource to add:", newResource);
                    dispatch(resourceAction.addResourceToList(newResource));
                }

                dispatch(resourceAction.setLoading(false));
                return { success: true, data: response.data };
            } else {
                console.log("Response status is false");
                dispatch(resourceAction.setLoading(false));
                return { success: false, message: "Response status is false" };
            }
        } catch (error) {
            console.log("Error in addResource:", error);
            console.log("Error response:", error?.response?.data);
            
            console.error("Error creating resource:", error);
            dispatch(resourceAction.setLoading(false));
            dispatch(resourceAction.setError(error.response?.data?.message));

            const errorMessage = error?.response?.data?.message || "Failed to add resource";

            toast.error(errorMessage, {
                position: "top-center",
                duration: 5000,
                style: { 
                    borderRadius: "8px", 
                    background: "#c00", 
                    color: "#fff" 
                },
            });

            return { success: false, error };
        }
    };
}

export function getResourceById(resourceId) {
    return async (dispatch) => {
        try {
            dispatch(resourceAction.setLoading(true));
            const response = await axiosInstance.get(`/resource/edit/${resourceId}`);
            
            dispatch(resourceAction.setResource(response?.data?.data));
            dispatch(resourceAction.setLoading(false));
        } catch (error) {
            console.error("Error fetching resource:", error);
            dispatch(resourceAction.setLoading(false));
            dispatch(resourceAction.setError(error.message));
        }
    };
}

export function updateResource(resourceId, resourceData) {
    return async (dispatch) => {
        try {
            dispatch(resourceAction.setLoading(true));
            
            const response = await axiosInstance.put(
                `/resource/update/${resourceId}`,
                resourceData
            );
            
            if (response.data.status) {
                const updatedResourceData = response.data.data?.resource || response.data.resource || {
                    id: resourceId,
                    ...resourceData
                };

                dispatch(resourceAction.updateResourceInList(updatedResourceData));
                
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
                
                dispatch(resourceAction.setLoading(false));
                return {
                    success: true,
                    message: response?.data.message
                };
            }
       } catch (error) {

    if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        Object.keys(errors).forEach((field) => {
            const messages = errors[field]; 

            messages.forEach((msg) => {
                toast.error(msg, {
                    position: 'top-center',
                    duration: 5000,
                    icon: '❌',
                    style: {
                        borderRadius: '8px',
                        background: '#333',
                        color: '#fff',
                        padding: '12px 16px',
                        fontWeight: '500',
                    },
                });
            });
        });

        // حفظ الأخطاء في الريدوكس
        const formattedErrors = Object.fromEntries(
            Object.entries(errors).map(([key, arr]) => [key, arr.join(", ")])
        );

        dispatch(resourceAction.setError(formattedErrors));

    } else {
        toast.error("Something went wrong", {
            position: 'top-center'
        });
        dispatch(resourceAction.setError({ general: "Something went wrong" }));
    }

    dispatch(resourceAction.setLoading(false));

    return {
        success: false,
        message: error.response?.data?.message
    };
}

    };
}

export function deleteResource(resourceId) {
    return async (dispatch) => {
        try {
            dispatch(resourceAction.setDeleteLoading(true));
            const response = await axiosInstance.delete(`/resource/delete/${resourceId}`);
            
            if (response.data.status) {
                dispatch(resourceAction.removeResourceFromList(resourceId));
                
                toast.success(response?.data?.data, {
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
                
                dispatch(resourceAction.setDeleteLoading(false)); 
                return {
                    success: true,
                    message: response?.data.message
                };
            }
        } catch (error) {
            console.error("Error delete resource:", error);
            dispatch(resourceAction.setDeleteLoading(false));
            dispatch(resourceAction.setError(error.response?.data?.message));
            
            return {
                success: false,
                message: error.response?.data?.message
            };
        }
    }
}

export function assignInterViewToResource(id, formData) {
  return async (dispatch) => {
    try {
      dispatch(resourceAction.setLoading(true));
      
      const response = await axiosInstance.post(
        `/resource/assign/${id}`,
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

        await dispatch(getResourceById(id));

        dispatch(resourceAction.setLoading(false));
        return { success: true, message: response.data.message };
      } else {
        dispatch(resourceAction.setLoading(false));
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error assigning interview to resource:", error);
      
      dispatch(resourceAction.setLoading(false));
      
      const errorMessage = error?.response?.data?.message || 
                          error.message || 
                          "Error assigning interview";
      
      toast.error(errorMessage, {
        position: 'top-center',
        duration: 5000,
        className: "!text-[14px] !font-normal",
        icon: '❌',
        style: {
          borderRadius: '8px',
          background: '#c00',
          color: '#fff',
          padding: '12px 16px',
          fontWeight: '500',
        },
      });
      
      return { success: false, message: errorMessage };
    }
  };
}