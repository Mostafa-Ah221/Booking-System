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
          error.response?.data?.message 
        )
      );
      toast.error(error.response?.data?.message);
    } finally {
      dispatch(profileActions.setLoading(false));
    }
  };
};

export const StaffFetchProfileData = () => {
  return async (dispatch, getState) => {
    const { profile, loading } = getState().profileData;

    if (profile && !loading) {
      return;
    }

    dispatch(profileActions.setLoading(true));
    try {
      const token = localStorage.getItem("access_token");
      const url = `https://backend-booking.appointroll.com/api/staff/show-profile`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.data) {
        const userData = response.data.data;

        if (userData?.user?.status === 0) {
          dispatch(authActions.logout());
          toast.error("Your account is inactive, please contact support.");
          return;
        }

        dispatch(profileActions.setStaffProfile(userData));
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
export const StaffUpdateProfileData = (profileData) => {
    return async (dispatch) => {
        dispatch(profileActions.setLoading(true));
        try {
            const token = localStorage.getItem("access_token");
            let url = `https://backend-booking.appointroll.com/api/staff/update-profile`;
            
            const isFormData = profileData instanceof FormData;
            const headers = {
                Authorization: token,
            };
            
            if (!isFormData) {
                headers["Content-Type"] = "application/json";
            }
            
            const response = await axios.post(url, profileData, { headers });
            
            if (response.data) {
                dispatch(profileActions.setStaffProfile(response.data.data));
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

export const updateShareLink = (shareLink) => {
  return async (dispatch, getState) => {
    dispatch(profileActions.setLoading(true)); 
    try {
      const token = localStorage.getItem("access_token");
      const url = `https://backend-booking.appointroll.com/api/regenerate-share-link`;

      const requestBody = shareLink ? { share_link: shareLink } : {};

      const response = await axios.post(url, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      console.log(response);
      
      if (response.data && response.data.data) {
        const currentProfile = getState().profileData.profile;
        
        const updatedProfile = {
          ...currentProfile,
          user: {
            ...currentProfile.user,
            share_link: response.data.data 
          }
        };
        
        dispatch(profileActions.setProfile(updatedProfile));
        toast.success("Share link updated successfully");
        return updatedProfile; 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update share link";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(profileActions.setLoading(false));
    }
  };
};