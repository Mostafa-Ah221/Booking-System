import React from "react";
import { Link } from "react-router-dom";
import img1 from '../../assets/image/New folder/Mobile Mockup 2.png';

const AppointmentManagementApp = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen mt-8 sm:mt-12 lg:mt-20 overflow-hidden">
      
      {/* Left Section - Text */}
      <div className="w-full lg:w-1/2 bg-[#1a1a2e] text-white flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 order-2 lg:order-1">
        <div className="max-w-md w-full text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Control Your Time. Effortlessly.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg opacity-80 mb-6 sm:mb-8">
            Manage bookings with clarity, speed, and precision.
          </p>

          <div className="flex justify-center lg:justify-start">
            <Link
              to="/signup"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors"
            >
              SIGN UP FOR FREE
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-full lg:w-1/2 bg-gray-100 flex justify-center items-center order-1 lg:order-2 min-h-64 sm:min-h-80 lg:min-h-screen">
        <img
          src={img1}
          alt="App Screenshot"
          className="w-full h-full object-cover lg:object-contain lg:p-8 xl:p-12"
        />
      </div>

    </div>
  );
};

export default AppointmentManagementApp;