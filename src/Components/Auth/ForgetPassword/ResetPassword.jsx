import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Shield, Key, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: email,
    code: "",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    if (!formData.code) {
      newErrors.code = "Verification code is required";
    } else if (!/^\d{4}$/.test(formData.code)) {
      newErrors.code = "Code must be exactly 4 digits";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation is required";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords must match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        email: formData.email,
        code: parseInt(formData.code),
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      const response = await fetch("https://backend-booking.appointroll.com/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Reset Password Response:", data);
        setSuccessMessage("Password has been reset successfully!");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);

      let errorMessage = "Password reset failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side - Image Section */}
        <div className="hidden lg:flex bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-5 rounded-full translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-300 opacity-20 rounded-full"></div>
          
          <div className="text-center text-white z-10">
            {/* Logo/Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <Key className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Create New<br />
              <span className="text-yellow-300">Password</span>
            </h1>
            
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              You're almost done! Create a strong password to secure your account and continue managing your bookings.
            </p>
            
            {/* Security tips */}
            <div className="space-y-4 text-left max-w-sm mx-auto">
              {[
                "Use at least 8 characters",
                "Mix uppercase & lowercase", 
                "Include numbers & symbols",
                "Avoid common passwords"
              ].map((tip, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-emerald-100">{tip}</span>
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
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">BookingHub</h2>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
              <p className="text-gray-600 mb-2">Create a new password for your account</p>
              {email && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-700">Email: <strong>{email}</strong></span>
                </div>
              )}
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
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-6">
              
              {/* Verification Code Input */}
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-semibold text-gray-700">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter 4-digit code"
                    maxLength="4"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${
                      errors.code 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.code}
                  </p>
                )}
              </div>

              {/* New Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-emerald-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${
                      errors.password_confirmation 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-emerald-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
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
                  onClick={handleBackToLogin}
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

export default ResetPassword;