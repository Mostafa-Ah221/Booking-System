import axiosInstance from "../../Components/pages/axiosInstance";
import { customerAction } from "../slices/customersSlice";
import toast from "react-hot-toast";

export function getCustomers() {
    return async (dispatch) => {
        try {
            dispatch(customerAction.setLoading(true));
            const response = await axiosInstance.get('/client/index');
            
            dispatch(customerAction.setCustomers(response?.data?.data));
            dispatch(customerAction.setDataFetched(true));
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

            const response = await axiosInstance.post(
                '/client/store',
                {
                    name: customerData.name,
                    email: customerData.email,
                    code_phone: customerData.code_phone,
                    phone: customerData.phone,
                }
            );

            console.log("Full API Response:", response.data);
            console.log("Response Status:", response?.data?.status);
            console.log("Client data:", response?.data?.data?.client);
         
            if (response?.data?.status) {
                const newCustomer = response.data.data.client;
                
                console.log("New customer to add:", newCustomer);
                
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
            const response = await axiosInstance.get(`/client/edit/${customerId}`);
            
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
            
            const response = await axiosInstance.patch(
                `/client/update/${customerId}`,
                { 
                    name: customerData.name,
                    email: customerData.email,
                    code_phone: customerData.code_phone,
                    phone: customerData.phone,
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

                const formattedErrors = Object.keys(errors).reduce((acc, field) => {
                    acc[field] = errors[field].join(", ");
                    return acc;
                }, {});

                dispatch(customerAction.setError(formattedErrors));

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
            dispatch(customerAction.setDeleteLoading(true));
            const response = await axiosInstance.delete(`/client/delete/${customerId}`);
            
            if (response.data.status) {
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
                
                dispatch(customerAction.setDeleteLoading(false)); 
                return {
                    success: true,
                    message: response?.data.message
                };
            }
        } catch (error) {
            console.error("Error delete client:", error);
            dispatch(customerAction.setDeleteLoading(false));
            dispatch(customerAction.setError(error.response?.data?.message));
            
            return {
                success: false,
                message: error.response?.data?.message
            };
        }
    }
}