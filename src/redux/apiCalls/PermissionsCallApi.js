import axiosInstance from "../../Components/pages/axiosInstance";
import { permissionsAction } from "../slices/permissionsSlice";

export function getPermissions(force = false) {
    return async (dispatch, getState) => {
        const { permissions, loading } = getState().permissions; 

        if (permissions && permissions.length > 0 && !force && !loading) {
            return;
        }

        try {
            dispatch(permissionsAction.setLoading(true));
            
            const response = await axiosInstance.get('/user-permissions');

            dispatch(permissionsAction.setPermissions(response?.data?.data?.user_permissions || []));
            dispatch(permissionsAction.setError(null));
        } catch (error) {
            dispatch(permissionsAction.setError(error.response?.data?.message || "فشل في تحميل الصلاحيات"));
        } finally {
            dispatch(permissionsAction.setLoading(false));
        }
    }
}