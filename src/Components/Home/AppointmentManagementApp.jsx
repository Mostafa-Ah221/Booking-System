import React from "react";
import { Link } from "react-router-dom";

const AppointmentManagementApp = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 mt-8 sm:mt-12 lg:mt-20 relative overflow-hidden">
      <div className="w-full lg:w-1/2 bg-[#1a1a2e] text-white flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 order-2 lg:order-1">
        <div className="max-w-md text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Manage<br/> appointments <br/>on the go
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg opacity-80 mb-6 sm:mb-8 max-w-xs sm:max-w-sm mx-auto lg:mx-0">
            Gain complete control of your schedule, all just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 items-center lg:items-start">
             <Link to="/signup" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors">
                         SIGN UP FOR FREE
                       </Link>
          </div>
        </div>
      </div>

      {/* القسم الأيمن (صور التطبيق) */}
      <div className="w-full lg:w-1/2 bg-[#ebdffa] flex justify-center items-center p-4 sm:p-6 lg:p-8 relative min-h-64 sm:min-h-80 lg:min-h-screen order-1 lg:order-2">
        {/* Container for mobile stacked layout */}
        <div className="block sm:hidden w-full max-w-xs">
          <div className="space-y-4">
            <img
              src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-manage-appointments-drk-thm.webp"
              alt="App Screenshot 1"
              className="w-full rounded-2xl shadow-lg"
            />
            <img
              src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-manage-appointments-light-thm.webp"
              alt="App Screenshot 2"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Container for tablet side-by-side layout */}
        <div className="hidden sm:block lg:hidden w-full max-w-md">
          <div className="flex gap-4 justify-center">
            <img
              src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-manage-appointments-drk-thm.webp"
              alt="App Screenshot 1"
              className="w-1/2 rounded-2xl shadow-lg"
            />
            <img
              src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-manage-appointments-light-thm.webp"
              alt="App Screenshot 2"
              className="w-1/2 rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Container for desktop overlapping layout */}
        <div className="hidden lg:block relative w-full h-full">
          <img
            src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-manage-appointments-drk-thm.webp"
            alt="App Screenshot 1"
            className="absolute left-8 xl:left-16 top-1/2 transform -translate-y-1/2 w-48 xl:w-56 rounded-2xl shadow-2xl z-10"
          />
          <img
            src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-manage-appointments-light-thm.webp"
            alt="App Screenshot 2"
            className="absolute right-8 xl:right-16 top-1/2 transform -translate-y-1/2  w-48 xl:w-56 rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagementApp;