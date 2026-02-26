const NewLayout = ({ themeData }) => {
  const { 
    color, 
    pageProperties = {}, 
    textColor
  } = themeData;

  const isGradient = themeData.color?.includes('-') || false;  
  const [primaryColor, secondaryColor] = isGradient 
    ? themeData.color.split('-') 
    : [themeData.color || '#FFFFFF', themeData.color || '#FFFFFF'];

  return (
    <div className="flex flex-col" style={{ background: primaryColor }}>
      {/* Main Content */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="md:w-1/3 space-y-4">
            {/* Service */}
            <div className="rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={textColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium" style={{color: textColor}}>Recruitment Strategy Meeting</div>
                  <div style={{color: textColor}} className="text-sm">30 mins</div>
                </div>
              </div>
              <svg style={{color: textColor}} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Date & Time - Selected */}
            <div 
              className="rounded-lg p-4 flex items-center justify-between"
              style={{background: secondaryColor}}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={textColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="font-medium" style={{color: textColor}}>Date, Time & Recruiter</div>
              </div>
              <svg style={{color: textColor}} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Your Info */}
            <div className="rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={textColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="font-medium" style={{color: textColor}}>Your Info</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:w-2/3">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6 gap-4">
              <div className="flex-1 flex">
                <div className="flex items-center">
                  <span style={{ color: textColor }} className="font-medium">February, 2026</span>
                  <svg style={{ color: textColor }} className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Timezone */}
              <div className="flex-1">
                <div className="relative">
                  <select 
                    className="w-full p-2 border rounded-lg appearance-none pr-8" 
                    style={{ 
                      background: primaryColor, 
                      color: textColor,
                      borderColor: textColor + '40'
                    }}
                  >
                    <option>Africa/Cairo</option>
                  </select>
                  <div className="absolute top-0 right-0 h-full flex items-center pr-2 pointer-events-none">
                    <svg style={{ color: textColor }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Days */}
            <div className="flex justify-between mb-6 gap-2">
              {[23, 24, 25, 26, 27, 28, 1].map((d, i) => (
                <button
                  key={i}
                  className="w-12 h-16 rounded-lg border flex flex-col items-center justify-center text-xs transition-all"
                  style={{
                    background: d === 26 ? secondaryColor : 'transparent',
                    color: textColor,
                    borderColor: d === 26 ? secondaryColor : textColor + '40',
                    borderWidth: d === 26 ? '2px' : '1px'
                  }}
                >
                  <span className="font-semibold">{d}</span>
                  <span className="text-xs opacity-80">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i]}
                  </span>
                </button>
              ))}
            </div>

            {/* Time Slots */}
            <div>
              <p style={{color: textColor}} className="text-sm mb-3 font-medium">Morning</p>
              <div className="grid grid-cols-3 gap-2">
                {['09:00 am', '09:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm'].map((time, idx) => (
                  <button
                    key={time}
                    className="p-2 text-sm rounded-lg transition-all"
                    style={{
                      background: idx === 0 ? secondaryColor : 'transparent',
                      color: textColor,
                      borderColor: idx === 0 ? secondaryColor : textColor + '40',
                      borderWidth: idx === 0 ? '2px' : '1px',
                      borderStyle: 'solid'
                    }}
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

export default NewLayout;