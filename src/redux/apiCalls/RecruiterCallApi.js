import axiosInstance from "../../Components/pages/axiosInstance";
import { recruiterAction } from "../slices/recruitersSlice";
import toast from "react-hot-toast";

export function getRecruiters() {
    return async (dispatch) => {
        try {
            dispatch(recruiterAction.setLoading(true));
            const response = await axiosInstance.get('/recruiter/index');
            
            dispatch(recruiterAction.setRecruiters(response?.data?.data));
            dispatch(recruiterAction.setLoading(false));
        } catch (error) {
            dispatch(recruiterAction.setLoading(false));
            dispatch(recruiterAction.setError(error.response?.data?.message));
            return {
                success: false,
                message: error.response?.data?.message 
            };
        }
    }
}

export function addrecruiter(recruiterData) {
    return async (dispatch) => {
        try {
            dispatch(recruiterAction.setLoading(true));

            const response = await axiosInstance.post(
                '/recruiter/store',
                {
                    name: recruiterData.name,
                    email: recruiterData.email,
                    password: recruiterData.password,
                    password_confirmation: recruiterData.password_confirmation,
                    code_phone: recruiterData.code_phone,
                    phone: recruiterData.phone,
                    role_id: recruiterData.role_id,
                    permissions: recruiterData.permissions || [],
                    status: recruiterData.status,
                }
            );

            if (response?.data?.status) {
                const newRecruiter = response.data.data;
                
                dispatch(recruiterAction.addRecruiterToList(newRecruiter));
                
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

                dispatch(recruiterAction.setLoading(false));
                return { success: true, data: response.data };
            }
        } catch (error) {
            const serverErrors = error?.response?.data?.errors || {};
            console.error("Error creating recruiter:", error);
            dispatch(recruiterAction.setLoading(false));
            dispatch(recruiterAction.setError(serverErrors));
            console.log(error.response?.data);
            
            return { success: false, error };
        }
    };
}

export function getRecruiterById(recruiterId) {
    return async (dispatch) => {
        try {
            dispatch(recruiterAction.setLoading(true));
            const response = await axiosInstance.get(`/recruiter/edit/${recruiterId}`);
            
            dispatch(recruiterAction.setRecruiter(response?.data?.data));
            dispatch(recruiterAction.setLoading(false));
        } catch (error) {
            console.error("Error fetching recruiter:", error);
            dispatch(recruiterAction.setLoading(false));
            dispatch(recruiterAction.setError(error.message));
        }
    };
}

export function updateRecruiter(recruiterId, recruiterData) {
    return async (dispatch) => {
        try {
            dispatch(recruiterAction.setLoading(true));

            const dataToSend = {
                name: recruiterData.name,
                email: recruiterData.email,
                code_phone: recruiterData.code_phone || '',
                phone: recruiterData.phone || '',
                status: Number(recruiterData.status),
                role_id: recruiterData.role_id || [],
                permissions: recruiterData.permissions || []
            };

            // ✅ لو دخل كلمة المرور الحالية فقط
            if (recruiterData.password && !recruiterData.new_password) {
                dataToSend.password = recruiterData.password;
            }

            // ✅ لو دخل كلمة المرور الحالية + الجديدة
            if (recruiterData.password && recruiterData.new_password) {
                dataToSend.password = recruiterData.password;
                dataToSend.new_password = recruiterData.new_password;
                dataToSend.new_password_confirmation = recruiterData.new_password_confirmation;
            }

            // ✅ لو دخل new_password أو new_password_confirmation بدون password الحالية
            // نبعتهم فاضيين عشان الـ backend يرجع validation error
            if (!recruiterData.password && (recruiterData.new_password || recruiterData.new_password_confirmation)) {
                dataToSend.password = "";
                dataToSend.new_password = recruiterData.new_password || "";
                dataToSend.new_password_confirmation = recruiterData.new_password_confirmation || "";
            }

            console.log('Final payload:', dataToSend);

            const response = await axiosInstance.put(
                `/recruiter/update/${recruiterId}`,
                dataToSend
            );

            console.log("API Response:", response.data);

            if (response.data.status) {
                const updatedData = response.data.data || {
                    id: recruiterId,
                    ...recruiterData
                };

                dispatch(recruiterAction.updateRecruiterInList(updatedData));

                toast.success(response?.data?.message, {
                    position: 'top-center',
                    duration: 5000,
                    icon: '✅',
                });

                dispatch(recruiterAction.setLoading(false));
                return {
                    success: true,
                    message: response?.data.message
                };
            } else {
                toast.error(response?.data?.message || "Unknown error", {
                    position: "top-center",
                    duration: 4000,
                });

                dispatch(recruiterAction.setLoading(false));
                return {
                    success: false,
                    message: response?.data?.message || "Unknown error"
                };
            }

        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error response:", error.response);

            const apiMessage = error.response?.data?.message || "Something went wrong";

            // ✅ في حالة الـ validation errors من backend
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;

                Object.keys(errors).forEach(field => {
                    const message = Array.isArray(errors[field])
                        ? errors[field].join(", ")
                        : errors[field];

                    toast.error(message, {
                        position: "top-center",
                        duration: 4000,
                    });
                });

                dispatch(recruiterAction.setError(errors));
                dispatch(recruiterAction.setLoading(false));
                
                return {
                    success: false,
                    message: apiMessage,
                    errors,
                };
            }

            // ✅ في حالة وجود message فقط من backend بدون errors
            toast.error(apiMessage, {
                position: "top-center",
                duration: 4000,
            });

            dispatch(recruiterAction.setError({ general: apiMessage }));
            dispatch(recruiterAction.setLoading(false));

            return {
                success: false,
                message: apiMessage
            };
        }
    };
}


export function deleteRecruiter(recruiterId) {
    return async (dispatch) => {
        try {
            dispatch(recruiterAction.setLoading(true));
            const response = await axiosInstance.delete(`/recruiter/delete/${recruiterId}`);
            
            if (response.data.status) {
                dispatch(recruiterAction.removeRecruiterFromList(recruiterId));
                
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
                
                dispatch(recruiterAction.setLoading(false));
                return {
                    success: true,
                    message: response?.data.message
                };
            }
        } catch (error) {
            console.error("Error delete recruiter:", error);
            dispatch(recruiterAction.setLoading(false));
            dispatch(recruiterAction.setError(error.response?.data?.message));
            
            return {
                success: false,
                message: error.response?.data?.message
            };
        }
    }
}