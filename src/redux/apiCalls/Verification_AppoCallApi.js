import axios from "axios";
import {  } from "../slices/customersSlice";
import toast from "react-hot-toast";




export function verifyCode(appointmentId, Datacode) {
    return async (dispatch) => {
        try {
            dispatch(customerAction.setLoading(true));
            
            const response = await axios.patch(
                `https://backend-booking.appointroll.com/api/appointments/verify-code/${appointmentId}`,
                { 
                    code: Datacode.code,
                
                },
                {
                    headers: {
                        "Content-Type": "application/json",
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