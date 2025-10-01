import {rolesAction} from "../slices/rolesSlice";
import axios from "axios";
import toast from "react-hot-toast";

export function getRoles() {
    return async (dispatch)=> {
        try {
            dispatch(rolesAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response =await axios.get(`https://backend-booking.appointroll.com/api/role/index`,{
                 headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
            })
            
            if (response.status === 200) {
                dispatch(rolesAction.setRoles(response.data.data));
            }
            dispatch(rolesAction.setLoading(false));
        } catch (error) {
            dispatch(rolesAction.setLoading(false));
            dispatch(rolesAction.setError(error.message));
        }
    }
}
export function getPermissions () {
    return async (dispatch)=> {
        try {
            dispatch(rolesAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response =await axios.get(`https://backend-booking.appointroll.com/api/role/create`,{
                 headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
            })
            
            if (response.status === 200) {
                dispatch(rolesAction.setPermissions(response.data.data));
            }
            dispatch(rolesAction.setLoading(false));
        } catch (error) {
            dispatch(rolesAction.setLoading(false));
            dispatch(rolesAction.setError(error.message));
            // toast.error("حدث خطأ أثناء تحميل الأدوار");
        }
    }
}

export function createRole(roleData) {
  return async (dispatch) => {
    roleData = {
      name: roleData.name,
      permissions: roleData.permissions.map((permission) => permission.id),
    };

    try {
      dispatch(rolesAction.setLoading(true));
      const Token = localStorage.getItem("access_token");

      const response = await axios.post(
        `https://backend-booking.appointroll.com/api/role/store`,
        roleData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: Token,
          },
        }
      );

      if (response?.data?.message === 200) {
        // ✅ نجح
        dispatch(rolesAction.addRoleToList(response.data.data));

        toast.success(response.data.data.message || "Role created successfully", {
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

        dispatch(rolesAction.setLoading(false));
        return { success: true, data: response.data };
      } else {
        // ❌ فشل مع وجود response
        dispatch(rolesAction.setLoading(false));

        let errorMessage =
          response.data?.data?.errors?.message || // الشكل الأول
          response.data?.message ||               // رسالة عامة
          "Failed to create role";

        // 👇 هنا نتأكد من الشكل التاني
        if (response.data?.errors) {
          const fieldErrors = Object.values(response.data.errors)
            .flat()
            .join(" , "); // يطلع "The name must be at least 2 characters."
          errorMessage = fieldErrors || errorMessage;
        }

        dispatch(rolesAction.setError(errorMessage));

        toast.error(errorMessage, {
          position: "top-center",
          duration: 5000,
          icon: "❌",
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            padding: "12px 16px",
            fontWeight: "500",
             fontSize: "14px", 
          },
        });

        return { success: false, error: errorMessage };
      }
    } catch (error) {
      dispatch(rolesAction.setLoading(false));

      let errorMessage =
        error.response?.data?.data?.errors?.message ||
        error.response?.data?.message ||
        error.message ||
        "Network error occurred";

      // 👇 التعامل مع الشكل التاني برضه في الـ catch
      if (error.response?.data?.errors) {
        const fieldErrors = Object.values(error.response.data.errors)
          .flat()
          .join(" , ");
        errorMessage = fieldErrors || errorMessage;
      }

      dispatch(rolesAction.setError(errorMessage));

      toast.error(errorMessage, {
        position: "top-center",
        duration: 5000,
        icon: "❌",
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
          padding: "12px 16px",
          fontWeight: "500",
           fontSize: "14px", 
        },
      });

      return { success: false, error: errorMessage };
    }
  };
}


export function getRoleById(roleId) {
    return async (dispatch) => {
        try {
            dispatch(rolesAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.get(`https://backend-booking.appointroll.com/api/role/edit/${roleId}`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: Token,
                },
            });
            
            if (response.status === 200) {
                dispatch(rolesAction.setRole(response.data.data));
            }
            dispatch(rolesAction.setLoading(false));
            return { success: true, data: response.data };
        } catch (error) {
            dispatch(rolesAction.setLoading(false));
            dispatch(rolesAction.setError(error.response?.data?.message || error.message));
            toast.error("حدث خطأ أثناء جلب بيانات الدور", {
                position: "top-center",
                duration: 5000,
                icon: "❌",
                style: {
                    borderRadius: "8px",
                    background: "#333",
                    color: "#fff",
                    padding: "12px 16px",
                    fontWeight: "500",
                },
            });
            return { success: false, error };
        }
    };
}

// تحديث دور
export function updateRole(roleId, roleData) {
    return async (dispatch) => {
        const formattedData = {
            name: roleData.name,
            permissions: roleData.permissions.map(permission => 
                typeof permission === 'object' ? permission.id : permission
            )
        };
        
        try {
            console.log(formattedData);
            
            dispatch(rolesAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.put(`https://backend-booking.appointroll.com/api/role/update/${roleId}`, formattedData, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: Token,
                }
            });
            
            if (response?.data?.status) {
                console.log(response);
                dispatch(rolesAction.updateRoleInList({ 
    id: roleId, 
    ...roleData 
}));

                
                toast.success(response.data.data.message || "تم تحديث الدور بنجاح", {
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

                dispatch(rolesAction.setLoading(false));
                return { success: true, data: response.data };
            }
        } catch (error) {
            dispatch(rolesAction.setLoading(false));
            dispatch(rolesAction.setError(error.response?.data?.message || error.message));
            
            toast.error(error.response?.data?.message || "حدث خطأ أثناء تحديث الدور", {
                position: "top-center",
                duration: 5000,
                icon: "❌",
                style: {
                    borderRadius: "8px",
                    background: "#333",
                    color: "#fff",
                    padding: "12px 16px",
                    fontWeight: "500",
                },
            });

            return { success: false, error };
        }
    };
}

export function deleteRoleById(roleId) {
    return async (dispatch) => {
        try {
            dispatch(rolesAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.delete(`https://backend-booking.appointroll.com/api/role/delete/${roleId}`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: Token,
                }
            });
            
            if (response?.data?.status) {
                console.log(response);
                dispatch(rolesAction.removeRoleFromList(roleId));
                
                toast.success(response?.data?.data.message || "Role has been deleted successfully", {
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

                dispatch(rolesAction.setLoading(false));
                return { success: true, data: response.data };
            }
        } catch (error) {
            dispatch(rolesAction.setLoading(false));
            dispatch(rolesAction.setError(error.response?.data?.message || error.message));
            
            toast.error(error.response?.data?.message || "حدث خطأ أثناء حذف الدور", {
                position: "top-center",
                duration: 5000,
                icon: "❌",
                style: {
                    borderRadius: "8px",
                    background: "#333",
                    color: "#fff",
                    padding: "12px 16px",
                    fontWeight: "500",
                },
            });

            return { success: false, error };
        }
    };
}



