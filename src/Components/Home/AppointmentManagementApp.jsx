import React from "react";

const AppointmentManagementApp = () => {
  return (
    <div className=" flex flex-col lg:flex-row min-h-screen bg-gray-100 my-20 relative">
      {/* القسم الأيسر (المحتوى النصي) */}
      <div className="w-full lg:w-1/2 bg-[#1a1a2e] text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-bold mb-4 ">Manage<br/> appointments <br/>on the go</h1>
        <p className=" opacity-80 mb-6 w-52">
          Gain complete control of your schedule, all just a click away.
        </p>

        {/* أزرار تحميل التطبيقات */}
        <div className="flex gap-4 mt-4">
          <img
            src="https://www.nuffieldhealth.com/local/ea/89/8e7aba9f4b0c96409c88e65d08ff/apple-page-4col-roundel.png"
            alt="Download on the App Store"
            className="w-20 cursor-pointer object-contain"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
            alt="Get it on Google Play"
            className="w-20 cursor-pointer object-contain"
          />
        </div>
      </div>

      {/* القسم الأيمن (صور التطبيق) */}
      <div className="w-full lg:w-1/2 p-8 bg-[#ebdffa] flex justify-center gap-4 ">
        <img
          src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-manage-appointments-drk-thm.webp"
          alt="App Screenshot 1"
          className="w-2/3  absolute left-[15rem] rounded-3xl h-2/3 object-contain"
        />
        <img
          src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-manage-appointments-light-thm.webp"
          alt="App Screenshot 2"
          className="w-2/3  absolute left-[30rem] top-20 rounded-3xl h-2/3 object-contain"
        />
      </div>
    </div>
  );
};

export default AppointmentManagementApp;
