import React from 'react';

const NewLayout = ({ themeColor }) => {
  // Process the theme color - handle both solid colors and gradients
  const isGradient = themeColor && themeColor.includes('-');
  
  // Create styles based on the theme color
  const buttonStyle = isGradient 
    ? { background: `linear-gradient(45deg, ${themeColor.split('-')[0]}, ${themeColor.split('-')[1]})` }
    : { backgroundColor: themeColor };
  
  // Text color based on the theme (solid only)
  const themeTextColor = isGradient ? themeColor.split('-')[0] : themeColor;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header with name */}
      <div className="border-b p-4">
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
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
          <p className="text-sm text-gray-600">
            Book your appointment in a few simple steps: Choose a service, pick your date and time, and fill in your details. See you soon!
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="md:w-1/3">
            {/* Service selection - Apply theme color to the icon */}
            <div className="bg-white rounded-lg border p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={themeTextColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Recruitment Strategy Meeting</div>
                  <div className="text-sm text-gray-500">30 mins</div>
                </div>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Date and Time - Apply theme color to the icon */}
            <div className="bg-gray-100 rounded-lg border p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={themeTextColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Date, Time & Recruiter</div>
                </div>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Your Info - Apply theme color to the icon */}
            <div className="bg-white rounded-lg border p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={themeTextColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Your Info</div>
                </div>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right content area */}
          <div className="md:w-2/3">
            {/* Month selector */}
            <div className="flex justify-between items-center mb-4">
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center">
                <span>February, 2025</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Date picker - Apply theme to selected date */}
            <div className="flex justify-between mb-6">
              <button className="w-12 h-16 rounded-lg border flex flex-col items-center justify-center text-gray-500 text-xs">
                <span>23</span>
                <span>SUN</span>
              </button>
              <button className="w-12 h-16 rounded-lg border flex flex-col items-center justify-center text-gray-500 text-xs">
                <span>24</span>
                <span>MON</span>
              </button>
              <button className="w-12 h-16 rounded-lg border flex flex-col items-center justify-center text-gray-500 text-xs">
                <span>25</span>
                <span>TUE</span>
              </button>
              {/* Selected date using theme color */}
              <button 
                className="w-12 h-16 rounded-lg text-white flex flex-col items-center justify-center text-xs"
                style={buttonStyle}
              >
                <span>26</span>
                <span>WED</span>
              </button>
              <button className="w-12 h-16 rounded-lg border flex flex-col items-center justify-center text-gray-500 text-xs">
                <span>27</span>
                <span>THU</span>
              </button>
              <button className="w-12 h-16 rounded-lg border flex flex-col items-center justify-center text-gray-500 text-xs">
                <span>28</span>
                <span>FRI</span>
              </button>
              <button className="w-12 h-16 rounded-lg border flex flex-col items-center justify-center text-gray-500 text-xs">
                <span>1</span>
                <span>SAT</span>
              </button>
            </div>
            
            {/* Timezone selector */}
            <div className="mb-4">
              <div className="relative">
                <select className="w-full p-2 border rounded-lg appearance-none pr-8">
                  <option>Africa/Cairo</option>
                </select>
                <div className="absolute top-0 right-0 h-full flex items-center pr-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Time slots - Apply theme to selected time */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Morning</p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {/* Selected time slot with theme color */}
                <button 
                  className="p-2 text-white text-sm rounded-lg"
                  style={buttonStyle}
                >
                  09:00 am
                </button>
                <button className="p-2 border text-gray-700 text-sm rounded-lg">09:30 am</button>
                <button className="p-2 border text-gray-700 text-sm rounded-lg">10:00 am</button>
                <button className="p-2 border text-gray-700 text-sm rounded-lg">10:30 am</button>
                <button className="p-2 border text-gray-700 text-sm rounded-lg">11:00 am</button>
                <button className="p-2 border text-gray-700 text-sm rounded-lg">11:30 am</button>
                <button className="p-2 border text-gray-700 text-sm rounded-lg">12:00 pm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with theme color */}
      <div className="p-2 text-center text-xs border-t" style={{ color: themeTextColor }}>
        Powered by Zefo Appoint Roll
      </div>
    </div>
  );
};

export default NewLayout;