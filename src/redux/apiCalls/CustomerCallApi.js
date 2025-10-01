import axios from "axios";
import { customerAction } from "../slices/customersSlice";
import toast from "react-hot-toast";

export function getCustomers() {
    return async (dispatch) => {
        try {
            dispatch(customerAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.get(
                `https://backend-booking.appointroll.com/api/client/index`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            dispatch(customerAction.setCustomers(response?.data?.data));
            dispatch(customerAction.setLoading(false));
        } catch (error) {
            dispatch(customerAction.setLoading(false));
            dispatch(customerAction.setError(error.response?.data?.message));
            return {
                success: false,
                message: error.response?.data?.message 
            };
        }
    }
}

export function addCustomer(customerData) {
    return async (dispatch) => {
        try {
            dispatch(customerAction.setLoading(true));
            const Token = localStorage.getItem("access_token");

            const response = await axios.post(
                `https://backend-booking.appointroll.com/api/client/store`,
                {
                    name: customerData.name,
                    email: customerData.email,
                    code_phone: customerData.code_phone,
                    phone: customerData.phone,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );

            console.log("Full API Response:", response.data);
            console.log("Response Status:", response?.data?.status);
            console.log("Client data:", response?.data?.data?.client);
         
            if (response?.data?.status) {
                // تأكد من إرسال العميل الجديد بالـ structure الصحيح
                const newCustomer = response.data.data.client;
                
                console.log("New customer to add:", newCustomer);
                
                // إضافة العميل للقائمة
                dispatch(customerAction.addCustomerToList(newCustomer));
                
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

                dispatch(customerAction.setLoading(false));
                return { success: true, data: response.data };
            } else {
                console.log("Response status is false");
                dispatch(customerAction.setLoading(false));
                return { success: false, message: "Response status is false" };
            }
        } catch (error) {
            console.log("Error in addCustomer:", error);
            console.log("Error response:", error?.response?.data);
            
            console.error("Error creating customer:", error);
            dispatch(customerAction.setLoading(false));
            dispatch(customerAction.setError(error.response?.data?.message));

            // التأكد من وجود الخطأ قبل إظهاره
            const errorMessage = error?.response?.data?.errors?.email?.[0] || 
                               error?.response?.data?.message || 
                               "حدث خطأ أثناء إضافة العميل";

            toast.error(errorMessage, {
                position: "top-center",
                duration: 5000,
                style: { borderRadius: "8px", background: "#c00", color: "#fff" },
            });

            return { success: false, error };
        }
    };
}

export function getCustomerById(customerId) {
    return async (dispatch) => {
        try {
            dispatch(customerAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.get(
                `https://backend-booking.appointroll.com/api/client/edit/${customerId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            dispatch(customerAction.setCustomer(response?.data?.data));
            dispatch(customerAction.setLoading(false));
        } catch (error) {
            console.error("Error fetching customer:", error);
            dispatch(customerAction.setLoading(false));
            dispatch(customerAction.setError(error.message));
        }
    };
}

export function updateCustomer(customerId, customerData) {
    return async (dispatch) => {
        try {
            dispatch(customerAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            
            const response = await axios.patch(
                `https://backend-booking.appointroll.com/api/client/update/${customerId}`,
                { 
                    name: customerData.name,
                    email: customerData.email,
                    code_phone: customerData.code_phone,
                    phone: customerData.phone,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            console.log(response.data);
            
            if (response.data.status) {
                dispatch(customerAction.updateCustomerInList({
                    id: customerId,
                    ...customerData
                }));
                
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
                
                dispatch(customerAction.setLoading(false));
                return {
                    success: true,
                    message: response?.data.message
                };
            }
} catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;

        // لو السيرفر بيرجع array من الرسائل، نخليها نص واحد
        const formattedErrors = Object.keys(errors).reduce((acc, field) => {
            acc[field] = errors[field].join(", ");
            return acc;
        }, {});

        // نخزن الأخطاء في الـ Redux
        dispatch(customerAction.setError(formattedErrors));

        // نطبع في الكونسول عشان نعرف تفاصيل الغلط
        Object.keys(formattedErrors).forEach(field => {
            console.error(`❌ خطأ في الحقل: ${field} => ${formattedErrors[field]}`);
        });
    } else {
        console.error("Error updating client:", error);
        dispatch(customerAction.setError({ general: "Something went wrong" }));
    }

    dispatch(customerAction.setLoading(false));

    return {
        success: false,
        message: error.response?.data?.message 
    };
}


    };
}

export function deleteCustomer(customerId) {
    return async (dispatch) => {
        try {
            dispatch(customerAction.setLoading(true));
            const Token = localStorage.getItem("access_token");
            const response = await axios.delete(
                `https://backend-booking.appointroll.com/api/client/delete/${customerId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: Token,
                    },
                }
            );
            
            if (response.data.status) {
                // حذف العميل من القائمة مباشرة
                dispatch(customerAction.removeCustomerFromList(customerId));
                
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
                
                dispatch(customerAction.setLoading(false));
                return {
                    success: true,
                    message: response?.data.message
                };
            }
        } catch (error) {
            
            console.error("Error delete client:", error);
            dispatch(customerAction.setLoading(false));
            dispatch(customerAction.setError(error.response?.data?.message));
        }
    }
}