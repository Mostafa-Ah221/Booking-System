import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getPermissions } from '../../../redux/apiCalls/RolesCallApli';
import { authActions } from '../../../redux/slices/authSlice';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('customer');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const access_token = location.state?.access_token || '';

  const validationSchema = Yup.object().shape({
    identify: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required"),
  });

  const handleLogin = async (values) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append("identify", values.identify);
      formData.append("password", values.password);
      if(access_token) {
        formData.append("token", access_token);
      }

      const apiEndpoint = userType === 'customer' 
        ? "https://backend-booking.appointroll.com/api/login"
        : "https://backend-booking.appointroll.com/api/staff/login";

      const response = await axios.post(
        apiEndpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


     const accessToken = response?.data?.data?.user?.original?.access_token;
      if(accessToken){
        localStorage.setItem("userType", userType);
        localStorage.setItem("access_token", accessToken);
        dispatch(authActions.setToken(accessToken));
        
        // Only get permissions for customer
        if(userType === 'customer') {
          await dispatch(getPermissions());
        }
      }

      

      if(userType === 'customer') {
        navigate("/layoutDashboard");
      } else {
        navigate("/staff_dashboard_layout");
      }
    } catch (error) {
      console.error("Login Error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;
        
        // Check if account is not verified
        if (message === "not verified" && status === 401) {
          navigate("/verify", {
            state: {
              email: values.identify
            }
          });
          return; 
        }
  
  // Handle other errors
  if (error.response.data.errors) {
    const firstError = Object.values(error.response.data.errors)[0]?.[0];
    errorMessage = firstError || errorMessage;
  } else {
    errorMessage = message || errorMessage;
  }
}

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      identify: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side - Image Section */}
        <div className="hidden lg:flex bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-12 items-center justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-5 rounded-full translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-300 opacity-20 rounded-full"></div>
          
          <div className="text-center text-white z-10">
            {/* Logo/Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Welcome Back to<br />
              <span className="text-yellow-300">Appoint Roll</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Manage your bookings with ease and efficiency. 
              Join thousands of businesses streamlining their operations.
            </p>
            
            {/* Features list */}
            <div className="space-y-4 text-left max-w-sm mx-auto">
              {[
                "Smart Scheduling System",
                "Real-time Notifications", 
                "Advanced Analytics",
                "24/7 Customer Support"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-blue-100">{feature}</span>
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
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Appoint Roll</h2>
            </div>

            {/* User Type Toggle */}
            <div className="mb-8">
              <div className="relative inline-flex items-center justify-center w-full bg-gray-100 rounded-2xl p-1.5">
                <div 
                  className={`absolute h-[calc(100%-12px)] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl transition-all duration-300 ease-in-out shadow-lg ${
                    userType === 'customer' ? 'left-1.5 w-[calc(50%-6px)]' : 'left-[calc(50%+1.5px)] w-[calc(50%-6px)]'
                  }`}
                ></div>
                
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`relative z-10 flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    userType === 'customer' 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Customer</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('staff')}
                  className={`relative z-10 flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    userType === 'staff' 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Staff</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Sign In as {userType === 'customer' ? 'Customer' : 'Staff'}
              </h2>
              <p className="text-gray-600">Access your dashboard and manage your bookings</p>
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

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="identify" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="identify"
                    name="identify"
                    value={formik.values.identify}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      formik.touched.identify && formik.errors.identify 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
                {formik.touched.identify && formik.errors.identify && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.identify}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      formik.touched.password && formik.errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-indigo-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Forgot Password */}
               <div className="text-center">
                <button
                  type="button"
                  onClick={() => 
                        navigate("/forget-password", {
                          state: {
                            from: {userType},
                          },
                        })
                      }

                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
              
              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-3">
                  Don't have an account yet?
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="w-full bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Create New Account</span>
                </button>
              </div>

            </form>

            {/* Footer */}
             <div className="text-center  mt-8">
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

export default Login;