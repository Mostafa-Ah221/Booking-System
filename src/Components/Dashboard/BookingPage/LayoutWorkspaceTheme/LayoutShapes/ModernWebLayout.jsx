import React from 'react';

const ModernWebLayout = ({ themeColor }) => {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: themeColor.includes('-')
          ? `linear-gradient(45deg, ${themeColor.split('-')[0]}, ${themeColor.split('-')[1]})`
          : themeColor
      }}
    >
      {/* Header with name */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center">
          <div className="flex space-x-1 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h1 className="text-xl font-medium text-gray-800">Ahmed</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-white">Welcome!</h2>
          <p className="text-sm text-white">
            Book your appointment in a few simple steps: Choose a service, pick your date and time, and fill in your details. See you soon!
          </p>
        </div>

        {/* Booking details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Service */}
          <div className="bg-white rounded-lg flex border overflow-hidden">
            <div className="p-4 flex items-center justify-center bg-white border-r">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">Recruitment Strategy Meeting</div>
                <div className="text-sm text-gray-500">(30 mins)</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Recruiter */}
          <div className="bg-white rounded-lg flex border overflow-hidden">
            <div className="p-4 flex items-center justify-center bg-white border-r">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium">Kris Marrier</div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Date */}
          <div className="bg-white rounded-lg flex border overflow-hidden">
            <div className="p-4 flex items-center justify-center bg-white border-r">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium">26 Feb 2025</div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Timezone */}
          <div className="bg-white rounded-lg flex border overflow-hidden">
            <div className="p-4 flex items-center justify-center bg-white border-r">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium">Africa/Cairo</div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Time */}
          <div className="bg-white rounded-lg flex border overflow-hidden">
            <div className="p-4 flex items-center justify-center bg-white border-r">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium">09:00 am</div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Book button */}
          <div 
            className="rounded-lg flex overflow-hidden"
            style={{
              background: themeColor.includes('-')
                ? `linear-gradient(45deg, ${themeColor.split('-')[0]}, ${themeColor.split('-')[1]})`
                : themeColor
            }}
          >
            <div className="flex-1 p-4 flex justify-center items-center text-white font-medium">
              Book Appointment
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Footer */}
        <div className="text-center text-xs text-white mt-8">
          Powered by Zoho Bookings
        </div>
      </div>
    </div>
  );
};

export default ModernWebLayout;