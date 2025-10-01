import { profileActions } from "../slices/profileSlice";
import { authActions } from "../slices/authSlice";
import toast from "react-hot-toast";
import axios from "axios";

export const fetchProfileData = () => {
  return async (dispatch, getState) => {
    const { profile, loading } = getState().profileData;

    if (profile && !loading) {
      return;
    }

    dispatch(profileActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const url = `https://backend-booking.appointroll.com/api/edit-profile`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data) {
        const userData = response.data.data;

        // 👇 الشرط هنا
        if (userData?.user?.status === 0) {
          dispatch(authActions.logout());
          toast.error("Your account is inactive, please contact support.");
          return;
        }

        dispatch(profileActions.setProfile(userData));
        dispatch(profileActions.setError(null));
      }
    } catch (error) {
      dispatch(
        profileActions.setError(
          error.response?.data?.message || "فشل في تحميل البيانات الشخصية"
        )
      );
      toast.error(error.response?.data?.message);
    } finally {
      dispatch(profileActions.setLoading(false));
    }
  };
};

export const updateProfileData = (profileData) => {
    return async (dispatch) => {
        dispatch(profileActions.setLoading(true));
        try {
            const token = localStorage.getItem("access_token");
            let url = `https://backend-booking.appointroll.com/api/update-profile`;
            
            const isFormData = profileData instanceof FormData;
            const headers = {
                Authorization: token,
            };
            
            if (!isFormData) {
                headers["Content-Type"] = "application/json";
            }
            
            const response = await axios.post(url, profileData, { headers });
            
            if (response.data) {
                dispatch(profileActions.setProfile(response.data.data));
                dispatch(profileActions.setError(null));
                dispatch(profileActions.setLoading(false));
                toast.success("The personal data has been updated successfully");
            }
            
        } catch (error) {
            dispatch(profileActions.setError(error.response?.data?.message ));
            dispatch(profileActions.setLoading(false));
            toast.error(error.response?.data?.message );
        }
    };
};

// ✅ الحل الأول: تحديث البيانات في الحالة العامة
export const updateShareLink = (shareLink) => {
  return async (dispatch, getState) => {
    dispatch(profileActions.setLoading(true)); // إضافة loading state
    try {
      const token = localStorage.getItem("access_token");
      const url = `https://backend-booking.appointroll.com/api/regenerate-share-link`;

      const response = await axios.post(
        url,
        { share_link: shareLink },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data) {
        // ✅ تحديث البيانات في الحالة العامة
        dispatch(profileActions.setProfile(response.data.data));
        
        // ✅ أو يمكن تحديث الـ share_link فقط
        // const currentProfile = getState().profileData.profile;
        // if (currentProfile) {
        //   dispatch(profileActions.setProfile({
        //     ...currentProfile,
        //     user: {
        //       ...currentProfile.user,
        //       share_link: response.data.data.user.share_link
        //     }
        //   }));
        // }

        toast.success("Share link updated successfully");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update share link";
      toast.error(errorMessage);
      throw error; // إعادة رفع الخطأ للتعامل معه في المكون
    } finally {
      dispatch(profileActions.setLoading(false)); // إنهاء loading state
    }
  };
};