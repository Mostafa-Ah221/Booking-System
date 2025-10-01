import axios from "axios";
import { permissionsAction } from "../slices/permissionsSlice";

export function getPermissions(force = false) {
    return async (dispatch, getState) => {
        const { permissions, loading } = getState().permissions; 

        // لو عندك بيانات permissions ومش عامل force update → متعملش request جديد
        if (permissions && permissions.length > 0 && !force && !loading) {
            return;
        }

        try {
            dispatch(permissionsAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.get(
                `https://backend-booking.appointroll.com/api/user-permissions`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: Token, // خليه A capital
                    },
                }
            );

            dispatch(permissionsAction.setPermissions(response?.data?.data?.["user permissions"] || []));
            dispatch(permissionsAction.setError(null));
        } catch (error) {
            dispatch(permissionsAction.setError(error.response?.data?.message || "فشل في تحميل الصلاحيات"));
        } finally {
            dispatch(permissionsAction.setLoading(false));
        }
    }
}
