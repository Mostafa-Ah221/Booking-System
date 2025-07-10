import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleForgetPassword = async (values) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("email", values.email);

      const response = await axios.post(
        "https://booking-system-demo.efc-eg.com/api/forgot-password",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Forget Password Response:", response.data);
      navigate("/reset-password", {
        state: {
          email:response?.data?.data?.user?.email,
          // successMessage: data?.data.message,
        },
      });
      setSuccessMessage("Password reset instructions have been sent to your email.");
     
    } catch (error) {
      console.error("Forget Password Error:", error);

      let errorMessage = "Password reset request failed. Please try again.";

      if (error.response) {
        if (error.response.data.errors) {
          const firstError = Object.values(error.response.data.errors)[0]?.[0];
          errorMessage = firstError || errorMessage;
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: handleForgetPassword
  });

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 pt-0 bg-white rounded-lg shadow-md my-11">
      <h2 className="text-xl font-bold text-center w-full mb-6">Forget Password</h2>
      
      {/* API error display */}
      {apiError && (
        <div className="w-full bg-red-100 text-red-700 p-3 rounded mb-4">
          {apiError}
        </div>
      )}
      
      {/* Success message display */}
      {successMessage && (
        <div className="w-full bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
        {/* Email Input */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email address"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Reset Password'}
        </button>
        
        {/* Back to login */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;