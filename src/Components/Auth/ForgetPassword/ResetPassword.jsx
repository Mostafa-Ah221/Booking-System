import { useState } from 'react';
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();
  const { email } = location.state || {};
  const [formData, setFormData] = useState({
    email: email,
    code: "",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState({});
  
console.log(email);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    if (!formData.code) {
      newErrors.code = "Verification code is required";
    } else if (!/^\d+$/.test(formData.code)) {
      newErrors.code = "Code must contain only numbers";
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
    
    // Clear error for this field when user starts typing
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

      const response = await fetch("https://booking-system-demo.efc-eg.com/api/reset-password", {
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
        
        // Redirect to login after successful reset
        setTimeout(() => {
          window.location.href = "/login";
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
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 pt-0 bg-white rounded-lg shadow-md my-11">
      <h2 className="text-xl font-bold text-center w-full ">Reset Password</h2>
      <p className='mb-6 mt-1 text-zinc-600 text-[13px]'>Email:{email}</p>
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
      <div onSubmit={handleResetPassword} className="w-full space-y-4">
       
        {/* Verification Code Input */}
        <div className="space-y-1">
          <label htmlFor="code" className="block text-sm font-medium">Verification Code *</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter verification code"
          />
          {errors.code && (
            <div className="text-red-500 text-sm mt-1">{errors.code}</div>
          )}
        </div>

        {/* New Password Input */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">New Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter new password"
          />
          {errors.password && (
            <div className="text-red-500 text-sm mt-1">{errors.password}</div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1">
          <label htmlFor="password_confirmation" className="block text-sm font-medium">Confirm Password *</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Confirm new password"
          />
          {errors.password_confirmation && (
            <div className="text-red-500 text-sm mt-1">{errors.password_confirmation}</div>
          )}
        </div>
        
        {/* Submit button */}
        <button
          type="button"
          onClick={handleResetPassword}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
        
        {/* Back to login */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;