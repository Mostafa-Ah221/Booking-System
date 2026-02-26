
const ClassicLayout = ({ themeData }) => {
  const { color, pageProperties} = themeData;

 

  const accentColor = color.includes('-') ? color.split('-')[0] : color;
   const isGradient = themeData.color?.includes('-') || false;  
const [firstColor, secondColor] = isGradient 
  ? themeData.color.split('-') 
  : [themeData.color || '#FFFFFF', themeData.color || '#FFFFFF'];

  return (
    <div className=" flex flex-col rounded-lg ">
     

      {/* Main Content */}
      <div className="flex-1 p-6 py-2 max-w-4xl mx-auto w-full">
       

        {/* Service Selection */}
        <div className="border  mb-4 overflow-hidden">
          <div className="p-4 flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-4 text-white"
            
            >
              <svg style={{ color: firstColor }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <div style={{ color: accentColor }} className="text-sm font-medium">Interview</div>
              <div className="text-sm" style={{ color: themeData.textColor }}>Recruitment Strategy Meeting | 30 mins</div>
            </div>
            <div>
              <svg
                className="w-5 h-5"
                style={{ color: accentColor }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="border  mb-4 overflow-hidden">
          <div className="p-4 flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-4 text-white"
          
            >
               <div className="h-full w-14  p-2 flex items-center justify-center " >
              <svg style={{ color: firstColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            </div>
            <div className="flex-1">
              <div style={{ color: accentColor }} className="text-sm font-medium">Date, Time & Recruiter</div>
              <div className="text-sm" style={{ color: themeData.textColor }}>26 Feb 2026 | 09:00 am</div>
            </div>
          </div>
        </div>

        {/* Calendar + Time Slots */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Calendar */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <button >
                <svg style={{ color: accentColor }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div style={{ color: themeData.textColor }}>February 2026</div>
              <button >
                <svg style={{ color: accentColor }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <table className="w-full text-center" style={{color :themeData.textColor}}>
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
              <tbody className="text-xs">
                <tr>
                  <td></td><td></td><td></td><td></td><td></td><td></td>
                  <td className="py-2">1</td>
                </tr>
                <tr >
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
                  <td className="py-2 rounded-lg" style={{background:firstColor, color:"white"}}>17</td>
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

          {/* Time Slots */}
          <div className="flex-1">
            <div className="mb-4">
              <div className=" font-medium mb-2" style={{ color: themeData.textColor }}>Slot Availability</div>
              <div className="relative">
                <select style={{ color: themeData.textColor }} className="w-full p-2 border rounded-lg appearance-none pr-8 bg-transparent outline-none" >
                  <option >Africa/Cairo</option>
                </select>
                <div className="absolute top-0 right-0 h-full flex items-center pr-2 pointer-events-none">
                  <svg style={{ color: themeData.textColor }} className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2" style={{ color: themeData.textColor }}>Morning</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 ">
                {['09:00 am', '09:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm'].map((time,index) => (
                  <button
                    key={index}
                    className="p-2 text-xs rounded-md"
                    style={{
                      background: index ===0 ? firstColor : 'transparent',
                       border: `1px solid ${firstColor}`,
                        color: index ===0 ? "white" : themeData.textColor,
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

export default ClassicLayout;