import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Verify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get access token and user data from navigation state
  const access_token = location.state?.access_token ;

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
        'https://booking-system-demo.efc-eg.com/api/account/verify', 
        {
          code: values.verification_code
        },
        {
          headers: {
            'authorization': `${access_token}`,
          }
        }
      );
       console.log(response);
       
      let message = response?.data?.message
      alert(message)
      // Successful verification - navigate to login
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
        errorMessage = error.response?.data?.errors || errorMessage;
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

    try {
      const response = await axios.post(
        'https://booking-system-demo.efc-eg.com/api/resend-verify-account',
        {},
        {
          headers: {
            'authorization': `${access_token}`,
          }
        }
      );

      // Handle successful resend
      setResendSuccess(true);
      console.log('Code resent successfully:', response.data);
    } catch (error) {
      console.error('Resend code error:', error);
      let errorMessage = 'Failed to resend verification code. Please try again.';

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
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 pt-0 bg-white rounded-lg shadow-md my-11">
      <h2 className="text-xl font-bold text-center w-full mb-6">Verify Your Account</h2>
      
      {/* API error display */}
      {apiError && (
        <div className="w-full bg-red-100 text-red-700 p-3 rounded mb-4">
          {apiError}
        </div>
      )}

      {/* Resend Success Message */}
      {resendSuccess && (
        <div className="w-full bg-green-100 text-green-700 p-3 rounded mb-4">
          Verification code has been resent successfully!
        </div>
      )}
      
      {/* Verification Message */}
      <p className="text-sm text-gray-600 mb-4 text-center">
        Please enter the 4-digit verification code
      </p>
      
      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
        {/* Verification Code Input */}
        <div className="space-y-1">
          <label htmlFor="verification_code" className="block text-sm font-medium">Verification Code *</label>
          <input
            type="text"
            id="verification_code"
            name="verification_code"
            maxLength={4}
            value={formik.values.verification_code}
            onChange={(e) => {
              // Only allow numeric input
              const value = e.target.value.replace(/\D/g, '');
              formik.setFieldValue('verification_code', value);
            }}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-center tracking-[0.5em]"
            placeholder="_ _ _ _"
          />
          {formik.touched.verification_code && formik.errors.verification_code && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.verification_code}</div>
          )}
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify Account'}
        </button>

        {/* Resend Code Option */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-blue-600 hover:underline text-sm disabled:text-gray-400"
          >
            {resendLoading 
              ? 'Resending...' 
              : "Didn't receive code? Resend"
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default Verify;