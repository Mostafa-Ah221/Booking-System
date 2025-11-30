import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import React from 'react';

const ModernWebLayout = ({ themeData }) => {
  const { 
    color, 
    pageProperties = {}, 
    buttonText = 'Book appointment', 
    textColor
  } = themeData;

  const isGradient = color.includes('-');  
const [firstColor, secondColor] = isGradient 
  ? color.split('-') 
  : [color, color];
 


 

  return (
    <div className="flex flex-col min-h-96" >

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-8 ">
        {/* Page Title & Description */}
       
        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Service */}
          <div className=" flex  overflow-hidden" style={{ background: `${textColor}30`}} >
            <div className="p-4 flex items-center justify-center " style={{ background: `${textColor}50`}}>
              <svg style={{ color: firstColor }} className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="flex  overflow-hidden"  style={{ background: `${textColor}30`}}>
            <div className="h-full w-14 p-4 flex items-center justify-center "  style={{ background: `${textColor}50`}}>
              <svg style={{ color: firstColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium" style={{ color: textColor }}>Kris Marrier</div>
               <ChevronsUpDown className={`w-5 h-5 `}   style={{ color: firstColor }}/>
            </div>
          </div>

          {/* Date */}
          <div className=" flex  overflow-hidden"  style={{ background: `${textColor}30`}}>
            <div className="h-full w-14  p-4 flex items-center justify-center " style={{ background: `${textColor}50`}}>
              <svg style={{ color: firstColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium" style={{ color: textColor }}>26 Feb 2025</div>
               <ChevronsUpDown className={`w-5 h-5 `}   style={{ color: firstColor }}/>
            </div>
          </div>
        </div>

        {/* Timezone + Time + Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Timezone */}
          <div className=" flex overflow-hidden" style={{ background: `${textColor}30`}}>
            <div className="h-full w-14 p-4 flex items-center justify-center"  style={{ background: `${textColor}50`}}>
              <svg style={{ color: firstColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 p-4 flex justify-between items-center">
              <div className="font-medium" style={{ color: textColor }}>Africa/Cairo</div>
               <ChevronsUpDown className={`w-5 h-5 `}   style={{ color: firstColor }}/>
            </div>
          </div>

          {/* Time */}
          <div className="flex  overflow-hidden"  style={{ background: `${textColor}30`}}>
            <div className="h-full w-14  p-4 flex items-center justify-center " style={{ background: `${textColor}30`}}>
              <svg style={{ color: firstColor }} className="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className=" flex overflow-hidden text-white font-medium shadow-lg"
            style={{ background: firstColor }}
          >
            <div className="flex-1  p-4 flex justify-center items-center">
              {buttonText}
            </div>
          </div>
        </div>

        

        {/* Footer */}
        {/* <div className="text-center text-xs mt-8 flex flex-col items-center gap-2" style={{ color: textColor }}>
          <div>
            {footer.link ? (
              <a href={footer.link} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                {footer.text}
              </a>
            ) : (
              footer.text
            )}
          </div>

          <div className="flex gap-3 mt-1">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}

            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.258-.149-4.771-1.699-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.205.012-3.584.069-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                </svg>
              </a>
            )}

            {socialLinks.x && (
              <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}

            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ModernWebLayout;