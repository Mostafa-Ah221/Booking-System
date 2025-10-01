import axios from "axios";
import { recruiterAction } from "../slices/recruitersSlice";
import toast from "react-hot-toast";

export function getRecruiters() {
    return async (dispatch) => {
        try {
            dispatch(recruiterAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.get(
                `https://backend-booking.appointroll.com/api/recruiter/index`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
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
            const Token = localStorage.getItem("access_token");

            const response = await axios.post(
                `https://backend-booking.appointroll.com/api/recruiter/store`,
                {
                    name: recruiterData.name,
                    email: recruiterData.email,
                    password: recruiterData.password,
                    password_confirmation: recruiterData.password_confirmation,
                    phone_code: recruiterData.phone_code,
                    phone: recruiterData.phone,
                    role_id:recruiterData.role_id,
                    permissions: recruiterData.permissions || [] ,
                    status: recruiterData.status,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
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
            const Token = localStorage.getItem("access_token");
            const response = await axios.get(
                `https://backend-booking.appointroll.com/api/recruiter/edit/${recruiterId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
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
            const Token = localStorage.getItem("access_token");
            
            const dataToSend = {
                name: recruiterData.name,
                email: recruiterData.email,
                phone_code: recruiterData.phone_code || '', 
                phone: recruiterData.phone || '', 
                status: Number(recruiterData.status),
                role_id: recruiterData.role_id || [], 
                permissions: recruiterData.permissions || [] 
            };

            if (recruiterData.password && recruiterData.new_password) {
                dataToSend.password = recruiterData.password;
                dataToSend.new_password = recruiterData.new_password;
                dataToSend.new_password_confirmation = recruiterData.new_password_confirmation;
            }
            
            const response = await axios.put(
                `https://backend-booking.appointroll.com/api/recruiter/update/${recruiterId}`,
                dataToSend,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            
            console.log('API Response:', response.data);
            
            if (response.data.status) {
                // استخدم البيانات المرجعة من الـ API بدلاً من البيانات المرسلة
                const updatedData = response.data.data || {
                    id: recruiterId,
                    ...recruiterData
                };
                
                dispatch(recruiterAction.updateRecruiterInList(updatedData));
                
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
            } else {
                dispatch(recruiterAction.setLoading(false));
                return {
                    success: false,
                    message: response?.data?.message || 'Unknown error'
                };
            }
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error response:", error.response);
            
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;

                const formattedErrors = Object.keys(errors).reduce((acc, field) => {
                    acc[field] = Array.isArray(errors[field]) 
                        ? errors[field].join(", ") 
                        : errors[field];
                    return acc;
                }, {});

                dispatch(recruiterAction.setError(formattedErrors));

                Object.keys(formattedErrors).forEach(field => {
                    console.error(`❌ خطأ في الحقل: ${field} => ${formattedErrors[field]}`);
                });
                
                dispatch(recruiterAction.setLoading(false));
                return {
                    success: false,
                    message: error.response?.data?.message || 'Validation failed',
                    errors: formattedErrors
                };
            } else {
                console.error("Error updating recruiter:", error);
                const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
                dispatch(recruiterAction.setError({ general: errorMessage }));
                
                dispatch(recruiterAction.setLoading(false));
                return {
                    success: false,
                    message: errorMessage
                };
            }
        }
    };
}

export function deleteRecruiter(recruiterId) {
    return async (dispatch) => {
        try {
            dispatch(recruiterAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.delete(
                `https://backend-booking.appointroll.com/api/recruiter/delete/${recruiterId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            
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
        }
    }
}