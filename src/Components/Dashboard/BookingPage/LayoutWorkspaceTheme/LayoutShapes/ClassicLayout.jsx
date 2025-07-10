import React from 'react';

const ClassicLayout = ({ themeColor }) => {
  // Function to handle gradient and solid colors
  const getBackgroundStyle = (color) => {
    if (color.includes('-')) {
      const [color1, color2] = color.split('-');
      return { background: `linear-gradient(45deg, ${color1}, ${color2})` };
    }
    return { backgroundColor: color };
  };

  // Default to indigo if no themeColor is provided
  const accentColor = themeColor || '#4f46e5';
  
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
            Book your appointment in a few simple steps. Choose a service, pick your date and time, and fill in your details. See you soon!
          </p>
        </div>

        {/* Service selection */}
        <div className="border rounded-lg mb-4 overflow-hidden">
          <div className="p-4 flex items-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-4 text-white"
              style={getBackgroundStyle(accentColor)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <div style={{ color: accentColor.includes('-') ? accentColor.split('-')[0] : accentColor }} className="text-sm font-medium">Interview</div>
              <div className="text-sm">Recruitment Strategy Meeting | 30 mins</div>
            </div>
            <div>
              <svg 
                className="w-5 h-5" 
                style={{ color: accentColor.includes('-') ? accentColor.split('-')[0] : accentColor }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Date selection */}
        <div className="border rounded-lg mb-4 overflow-hidden">
          <div className="p-4 flex items-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mr-4 text-white"
              style={getBackgroundStyle(accentColor)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <div style={{ color: accentColor.includes('-') ? accentColor.split('-')[0] : accentColor }} className="text-sm font-medium">Date, Time & Recruiter</div>
              <div className="text-sm">26 Feb 2025 | 09:00 am</div>
            </div>
          </div>
        </div>

        {/* Calendar and time slots */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Calendar */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <button className="text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div>February 2025</div>
              <button className="text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="py-2 text-xs">SUN</th>
                  <th className="py-2 text-xs">MON</th>
                  <th className="py-2 text-xs">TUE</th>
                  <th className="py-2 text-xs">WED</th>
                  <th className="py-2 text-xs">THU</th>
                  <th className="py-2 text-xs">FRI</th>
                  <th className="py-2 text-xs">SAT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="py-2">1</td>
                </tr>
                <tr>
                  <td className="py-2">2</td>
                  <td className="py-2">3</td>
                  <td className="py-2">4</td>
                  <td className="py-2">5</td>
                  <td className="py-2">6</td>
                  <td className="py-2">7</td>
                  <td className="py-2">8</td>
                </tr>
                <tr>
                  <td className="py-2">9</td>
                  <td className="py-2">10</td>
                  <td className="py-2">11</td>
                  <td className="py-2">12</td>
                  <td className="py-2">13</td>
                  <td className="py-2">14</td>
                  <td className="py-2">15</td>
                </tr>
                <tr>
                  <td className="py-2">16</td>
                  <td className="py-2">17</td>
                  <td className="py-2">18</td>
                  <td className="py-2">19</td>
                  <td className="py-2">20</td>
                  <td className="py-2">21</td>
                  <td className="py-2">22</td>
                </tr>
                <tr>
                  <td className="py-2">23</td>
                  <td className="py-2">24</td>
                  <td className="py-2">25</td>
                  <td className="py-2 px-1">
                    <div 
                      className="w-6 h-6 rounded-full text-white flex items-center justify-center mx-auto"
                      style={getBackgroundStyle(accentColor)}
                    >
                      26
                    </div>
                  </td>
                  <td className="py-2">27</td>
                  <td className="py-2">28</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Time slots */}
          <div className="flex-1">
            <div className="mb-4">
              <div className="text-lg font-medium mb-2">Slot Availability</div>
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

            <div>
              <p className="text-sm text-gray-500 mb-2">Morning</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {['09:00 am', '09:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm'].map((time, index) => (
                  <button 
                    key={index}
                    className="p-2 text-white text-sm rounded-lg"
                    style={getBackgroundStyle(accentColor)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicLayout;