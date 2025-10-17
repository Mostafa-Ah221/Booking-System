import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft, Shield, Lock } from 'lucide-react';
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
        "https://backend-booking.appointroll.com/api/forgot-password",
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
          email: response?.data?.data?.user?.email,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side - Image Section */}
        <div className="hidden lg:flex bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-12 items-center justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-5 rounded-full translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-300 opacity-20 rounded-full"></div>
          
          <div className="text-center text-white z-10">
            {/* Logo/Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Forgot Your<br />
              <span className="text-yellow-300">Password?</span>
            </h1>
            
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              No worries! We'll help you reset your password and get back to managing your bookings in no time.
            </p>
            
            {/* Steps list */}
            <div className="space-y-4 text-left max-w-sm mx-auto">
              {[
                "Enter your email address",
                "Check your email inbox", 
                "Click the reset link",
                "Create a new password"
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                  <span className="text-orange-100">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">BookingHub</h2>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
              <p className="text-gray-600">Enter your email and we'll send you instructions to reset your password</p>
            </div>

            {/* API error display */}
            {apiError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success message display */}
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your email address"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      formik.touched.email && formik.errors.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-3">
                  Remember your password?
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Login</span>
                </button>
              </div>

            </form>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm leading-relaxed">
                <span className="font-medium text-gray-800">© 2025 Appointroll</span>
                <span className="mx-2">•</span>
                All Rights Reserved
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Powered by 
                <a 
                  href="http://egydesigner.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline"
                >
                  EGYdesigner
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;