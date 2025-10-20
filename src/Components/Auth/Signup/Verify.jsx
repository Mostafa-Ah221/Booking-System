import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from "react-hot-toast";
import { Shield, CheckCircle, RefreshCw } from 'lucide-react';
import { getPermissions } from '../../../redux/apiCalls/PermissionsCallApi';
import { useDispatch } from 'react-redux';
import { authActions } from '../../../redux/slices/authSlice';

const Verify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email;

  // Initialize timer on component mount
  useEffect(() => {
    const storedTime = localStorage.getItem('resendCodeTimer');
    if (storedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(storedTime)) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setTimeLeft(remaining);
    }
  }, []);

  // Auto-enable resend button after timer expires
  useEffect(() => {
    if (timeLeft === 0 && localStorage.getItem('resendCodeTimer')) {
      localStorage.removeItem('resendCodeTimer');
    }
  }, [timeLeft]);

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          localStorage.removeItem('resendCodeTimer');
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const validationSchema = Yup.object().shape({
    verification_code: Yup.string()
      .required("Verification code is required")
      .matches(/^\d{4}$/, "Verification code must be 4 digits")
  });

  const handleVerification = async (values) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await axios.post(
        'https://backend-booking.appointroll.com/api/account/verify', 
        {
          email: email,
          code: values.verification_code
        }
      );
       
      let message = response?.data?.message;
      toast.success(message);
      
      const access_token = response?.data?.data?.user.original.access_token;
      localStorage.setItem("userType", 'customer');
      if(access_token){
        localStorage.setItem("access_token", access_token);
        dispatch(authActions.setToken(access_token));
        const userType = localStorage.getItem("userType");
        // Only get permissions for customer
        if(userType === 'customer') {
          await dispatch(getPermissions());
        }
      }
     
      navigate('/setup_1', { 
        state: { 
          message: `${message}`,
          access_token: `${access_token}`,
        } 
      });
      
      localStorage.setItem("access_token", access_token);
      console.log('Verification successful:', response.data);
    } catch (error) {
      console.error('Verification error:', error);
      let errorMessage = 'Verification failed. Please try again.';
  
      if (error.response) {
        const errors = error.response?.data?.errors;
        
        // Check if errors is an object
        if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
          errorMessage = Object.values(errors).flat().join(', ');
        } else if (typeof errors === 'string') {
          errorMessage = errors;
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
      } 
  
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setApiError(null);
    setResendSuccess(false);

    if (!email) {
      setApiError("Email address not found. Please try signing up again.");
      setResendLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://backend-booking.appointroll.com/api/resend-verify-account',
        {
          email: email
        }
      );

      // Set timer in localStorage
      localStorage.setItem('resendCodeTimer', Date.now().toString());
      setTimeLeft(60);
      
      setResendSuccess(true);
      toast.success("Verification code has been resent successfully!");
      console.log('Code resent successfully:', response.data);
    } catch (error) {
      console.error('Resend code error:', error);
      let errorMessage = error?.response?.data?.message || 'Failed to resend code. Please try again.';

      if (error.response) {
        errorMessage = error.response?.data?.errors || errorMessage;
      }

      setApiError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      verification_code: ""
    },
    validationSchema,
    onSubmit: handleVerification
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
              Verify Your<br />
              <span className="text-yellow-300">Account</span>
            </h1>
            
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              We've sent a 4-digit verification code to your email. Enter it below to secure your account.
            </p>
            
            {/* Steps list */}
            <div className="space-y-4 text-left max-w-sm mx-auto">
              {[
                "Check your email inbox",
                "Find the 4-digit code", 
                "Enter the code below",
                "Complete verification"
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Account</h2>
              <p className="text-gray-600">
                Enter the 4-digit code sent to{' '}
                <span className="font-semibold text-gray-800">{email}</span>
              </p>
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
            {resendSuccess && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Verification code has been resent successfully!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">

              {/* Verification Code Input */}
              <div className="space-y-2">
                <label htmlFor="verification_code" className="block text-sm font-semibold text-gray-700">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="verification_code"
                    name="verification_code"
                    maxLength={4}
                    value={formik.values.verification_code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      formik.setFieldValue('verification_code', value);
                    }}
                    onBlur={formik.handleBlur}
                    placeholder="_ _ _ _"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-center text-2xl tracking-[1em] font-bold ${
                      formik.touched.verification_code && formik.errors.verification_code 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
                {formik.touched.verification_code && formik.errors.verification_code && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.verification_code}
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
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Verify Account</span>
                  </>
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-3">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading || timeLeft > 0}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-md"
                >
                  {resendLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Resending...</span>
                    </>
                  ) : timeLeft > 0 ? (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>Resend Code in {timeLeft}s</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>Resend Code</span>
                    </>
                  )}
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

export default Verify;