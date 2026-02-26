import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import React from 'react';

const ModernWebLayout = ({ themeData }) => {
  const { 
    color, 
    pageProperties = {}, 
    buttonText = 'Book appointment', 
    textColor
  } = themeData;

  const isGradient = themeData.color?.includes('-') || false;  
  const [firstColor, secondColor] = isGradient 
  ? themeData.color.split('-') 
  : [themeData.color || '#FFFFFF', themeData.color || "rgb(241 82 179)"];
 


 

  return (
    <div className="flex flex-col min-h-96" >

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-8 "
      style={{ background: `${firstColor}`}}
      >
        {/* Page Title & Description */}
       
        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Service */}
          <div className=" flex  overflow-hidden bg-black/10" >
            <div className="p-4 flex items-center justify-center " style={{ background: `${textColor}50`}}>
              <svg style={{ color: secondColor }} className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div>
                <div className="font-medium text-sm" style={{ color: textColor }}>Recruitment Strategy Meeting</div>
                <div className="text-sm text-gray-500" style={{ color: `${textColor}80` }}>(30 mins)</div>
              </div>
               <ChevronsUpDown className={`w-5 h-5 `}  style={{ color: firstColor }}/>
            </div>
          </div>

          {/* Recruiter */}
          <div className="flex  overflow-hidden bg-black/10"  >
            <div className="h-full w-14 p-4 flex items-center justify-center "  style={{ background: `${textColor}50`}}>
              <svg style={{ color: secondColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium" style={{ color: textColor }}>Kris Marrier</div>
               <ChevronsUpDown className={`w-5 h-5 `}   style={{ color: firstColor }}/>
            </div>
          </div>

          {/* Date */}
          <div className=" flex  overflow-hidden bg-black/10"  >
            <div className="h-full w-14  p-4 flex items-center justify-center " style={{ background: `${textColor}50`}}>
              <svg style={{ color: secondColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium" style={{ color: textColor }}>26 Feb 2026</div>
               <ChevronsUpDown className={`w-5 h-5 `}   style={{ color: firstColor }}/>
            </div>
          </div>
        </div>

        {/* Timezone + Time + Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Timezone */}
          <div className=" flex overflow-hidden bg-black/10" >
            <div className="h-full w-14 p-4 flex items-center justify-center"  style={{ background: `${textColor}50`}}>
              <svg style={{ color: secondColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium" style={{ color: textColor }}>Africa/Cairo</div>
               <ChevronsUpDown className={`w-5 h-5 `}   style={{ color: firstColor }}/>
            </div>
          </div>

          {/* Time */}
          <div className="flex  overflow-hidden bg-black/10">
            <div className="h-full w-14  p-4 flex items-center justify-center " style={{ background: `${textColor}30`}}>
              <svg style={{ color: secondColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium" style={{ color: textColor }}>09:00 am</div>
               <ChevronsUpDown className={`w-5 h-5 `}   style={{ color: firstColor }}/>
            </div>
          </div>

          {/* Book Button */}
          <div
            className=" flex overflow-hidden  font-medium shadow-lg"
            style={{ background: secondColor, color:textColor  }}

          >
            <div className="flex-1  p-4 flex justify-center items-center">
              {buttonText}
            </div>
          </div>
        </div>

        

      
      </div>
    </div>
  );
};

export default ModernWebLayout;