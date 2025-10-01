import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Phone, Mail, Lock, User, Camera, ArrowRight, UserPlus } from 'lucide-react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import ImageUploadCrop from '../../Dashboard/InterviewsPages/InterViewPage/ImageUploadCrop';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone_code: Yup.string()
      .nullable(),
    phone: Yup.string()
      .nullable(),
    password: Yup.string()
      .required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required("Password confirmation is required"),
    photo: Yup.mixed()
      .nullable()
      .test("fileType", "File must be an image", (value) => {
        if (!value) return true; // Allow null
        return value instanceof File && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      })
  });

  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);

    formik.setFieldValue('phone', value.replace(`+${country.dialCode}`, ""));
    formik.setFieldValue('phone_code', `+${country.dialCode}`);

    // Validate phone number
    if (!value || value.length <= country.dialCode.length + 1) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(value, country.countryCode?.toUpperCase());
    
    if (!phoneNumber || !phoneNumber.isValid()) {
      setPhoneError("The phone number is invalid for this country");
    } else {
      setPhoneError("");
    }
  };

  const handleRegister = async (values) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.password_confirmation);
      
      // Add phone fields if provided
      if (values.phone_code) {
        formData.append("phone_code", values.phone_code);
      }
      
      if (values.phone) {
        formData.append("phone", values.phone);
      }

      // استخدام tempImage إذا كانت موجودة
      const photoToSend = tempImage || values.photo;
      if (photoToSend) {
        formData.append("photo", photoToSend);
      }

      const response = await axios.post(
        "https://backend-booking.appointroll.com/api/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Full API Response:", response.data);

      // Extract data from response
      const userData = response?.data?.data;
      
      // Check for access token in different possible paths
      const accessToken = userData?.user?.original?.access_token || userData?.access_token;
      const otpVerify = userData?.otp_verify;
      
      if (accessToken) {
        navigate("/verify", {
          state: {
            access_token: accessToken,
            otp_verify: otpVerify,
            email: values.email
          },
        });
      } else {
        console.error("No access token found in expected path:", response.data);
        setApiError("Unable to retrieve access token. Please try again.");
      }

    } catch (error) {
      console.error("Registration Error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        // More detailed error handling
        if (error.response.data.errors) {
          // Handle validation errors
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

  // استقبال الصورة من ImageUploadCrop
  const handleImageUpdate = (imageFile) => {
    setTempImage(imageFile);
    formik.setFieldValue('photo', imageFile);
    setIsImageUploadOpen(false);
    console.log("تم تحديث الصورة من ImageUploadCrop:", imageFile);
  };

  // فتح popup الصورة
  const handleCameraClick = () => {
    setIsImageUploadOpen(true);
  };

  // عرض الصورة المختارة
  const getDisplayImage = () => {
    if (tempImage) {
      return URL.createObjectURL(tempImage);
    }
    return null;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone_code: "",
      phone: "",
      password: "",
      password_confirmation: "",
      photo: null
    },
    validationSchema,
    onSubmit: handleRegister
  });

  const displayImage = getDisplayImage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Side - Fixed Image Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 p-12 items-center justify-center overflow-hidden fixed h-full">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-5 rounded-full translate-x-20 translate-y-20"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-300 opacity-20 rounded-full"></div>
        <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-blue-300 opacity-15 rounded-full"></div>
        
        <div className="text-center text-white z-10">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Join the Future of<br />
            <span className="text-yellow-300">Booking Management</span>
          </h1>
          
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Create your account and start managing bookings like a pro. 
            Join thousands of satisfied users today.
          </p>
          
          {/* Features list */}
          <div className="space-y-4 text-left max-w-sm mx-auto">
            {[
              "Free Account Setup",
              "Instant Access to Dashboard", 
              "Professional Tools",
              "Secure Data Protection"
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-purple-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Scrollable Form Section */}
      <div className="w-full lg:w-1/2 ml-auto">
        <div className="p-8 lg:p-12 flex flex-col justify-center min-h-screen">
          <div className="max-w-md mx-auto w-full">
            
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Appoint Roll</h2>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600">Join us and start managing your bookings efficiently</p>
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
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                      formik.touched.name && formik.errors.name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    dir="auto"
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.name}
                  </p>
                )}
              </div>

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
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                      formik.touched.email && formik.errors.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    dir="ltr"
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

              {/* Phone Input - Updated with react-phone-input-2 */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Phone Number (Optional)
                </label>
                <PhoneInput
                  country="eg"
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  enableSearch={true}
                  searchPlaceholder="Search country"
                  inputProps={{
                    name: "phone",
                    className: "!pl-16 w-full py-3 px-4 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300",
                    placeholder: "Enter your mobile number"
                  }}
                  containerClass="w-full"
                  buttonClass="!border-r !bg-white !px-3 !py-3 !rounded-l-xl !border-gray-200 hover:!border-gray-300"
                  dropdownClass="!bg-white !border !shadow-lg !rounded-lg !mt-1"
                  searchClass="!p-3 !border-b !border-gray-200"
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {phoneError}
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
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                      formik.touched.password && formik.errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-purple-600 transition-colors"
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

              {/* Password Confirmation Input */}
              <div className="space-y-2">
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPasswordConfirmation ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                      formik.touched.password_confirmation && formik.errors.password_confirmation 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-purple-600 transition-colors"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  >
                    {showPasswordConfirmation ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Profile Photo Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <div 
                    className="cursor-pointer relative w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-bold shadow-sm overflow-hidden hover:bg-purple-200 transition-colors"
                    onClick={handleCameraClick}
                  >
                    {displayImage ? (
                      <>
                        <img className='w-full h-full rounded-xl object-cover' src={displayImage} alt="Profile" />
                        <span className='w-full h-full absolute top-0 left-0 flex justify-center items-center group'>
                          <span className='group-hover:opacity-30 duration-300 w-full h-full absolute top-0 opacity-0 left-0 bg-slate-800'></span>
                          <Camera className='absolute text-white text-xl opacity-0 group-hover:opacity-100'/>
                        </span>
                      </>
                    ) : (
                      <Camera className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      {displayImage ? "Profile photo selected" : "Click the camera icon to add a profile photo"}
                    </p>
                    {displayImage && (
                      <button 
                        type="button"
                        onClick={handleCameraClick}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Change Photo
                      </button>
                    )}
                  </div>
                </div>
                {formik.touched.photo && formik.errors.photo && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formik.errors.photo}
                  </p>
                )}
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-3">
                  Already have an account?
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In Instead</span>
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© 2024 BookingHub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ImageUploadCrop Component */}
      <ImageUploadCrop 
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onImageUpdate={handleImageUpdate}
        currentImage={null}
      />
    </div>
  );
};

export default Signup;