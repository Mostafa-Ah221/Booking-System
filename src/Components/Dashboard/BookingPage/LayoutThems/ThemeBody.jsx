import React, { useState, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown, User, Clock, Facebook, Instagram, Twitter, Linkedin, Phone, Mail } from 'lucide-react';
import { FaUserTie } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { transform } from 'framer-motion';

const ThemeBody = ({ layout = 'default', themeColor, header, pageProperties, footer }) => {
  const [selectedDate, setSelectedDate] = useState('25');
  const [selectedTime, setSelectedTime] = useState('09:00 am');
  
  const timeSlots = [
    '09:00 am', '09:30 am', '10:00 am', '10:30 am',
    '11:00 am', '11:30 am', '12:00 pm'
  ];

  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 28; i++) {
      days.push(i.toString());
    }
    return days;
  };
console.log(themeColor);

  // Parse theme colors
  let primaryColor ;
  let secondaryColor ;
  let textColor ;

  if (themeColor) {
    if (typeof themeColor === 'object') {
      primaryColor = themeColor.color1 || '#4F46E5';
      secondaryColor = themeColor.color2 || '#F5F5F5';
      textColor = themeColor.textColor || '#4F46E5';
    } else if (typeof themeColor === 'string') {
      const isGradient = themeColor.includes('-');
      const [firstColor, secondaryColorStr] = isGradient 
        ? themeColor.split('-') 
        : [themeColor, '#F5F5F5'];
      
      primaryColor = firstColor;
      secondaryColor = secondaryColorStr;
      textColor = firstColor;
    }
  }
function invertColor(hex) {
  hex = hex.replace('#','');

  let r = (255 - parseInt(hex.substring(0, 2), 16)).toString(16).padStart(2, '0');
  let g = (255 - parseInt(hex.substring(2, 4), 16)).toString(16).padStart(2, '0');
  let b = (255 - parseInt(hex.substring(4, 6), 16)).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

  // Footer Component
  const FooterSection = () => (
    <div className="mt-8 pt-6 border-t">
      <div className="flex flex-wrap gap-1 justify-center items-center">
        {footer?.visibleFacebook && footer?.facebook && (
          <>
            <a href={footer.facebook} target="_blank" rel="noopener noreferrer" 
               className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <span>|</span>
          </>
        )}
        
        {footer?.visibleInstagram && footer?.instagram && (
          <> 
            <a href={footer.instagram} target="_blank" rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <span>|</span>
          </>
        )}
        
        {footer?.visibleX && footer?.x && (
          <>
            <a href={footer.x} target="_blank" rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <span>|</span>
          </>
        )}
        
        {footer?.visibleLinkedin && footer?.linkedin && (
          <>
            <a href={footer.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <span>|</span>
          </>
        )}
        
        {footer?.visiblePhone && footer?.phone && (
          <>
            <a href={`tel:${footer.phone}`}
              className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Phone className="w-4 h-4"/>
              <span className="text-sm">{footer.phone}</span>
            </a>
            <span>|</span>
          </>
        )}
        
        {footer?.visibleEmail && footer?.email && (
          <a href={`mailto:${footer.email}`}
             className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
            <Mail className="w-4 h-4" />
          </a>
        )}
      </div>
      <p className='text-xs text-center' style={{ color: "black" }}>Powered by Appoint Roll</p>
    </div>
  );

  if (layout === 'sleek') {
    return (
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Sidebar - Full width on mobile, 1/4 on desktop */}
        <div 
          className="w-full md:w-1/4 text-white p-4 md:p-8"
          style={{ backgroundColor: secondaryColor, borderRight: `1px solid #100f0f14` }}
        >
          <div className='flex gap-3 align-center mb-20'>
           {header?.visibleLogo && header.logo && (
                    <div className="w-10 h-10 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={
                          typeof header.logo === 'string' 
                            ? header.logo 
                            : URL.createObjectURL(header.logo)
                        } 
                        alt="Logo" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
            {header?.visibleTitle && (
              <h1 className="text-xl md:text-xl font-semibold mb-4 md:mb-8">{header.title}</h1>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-full mb-4 flex items-center justify-center">      
              <FaUserTie className="w-10 h-10 md:w-16 md:h-16 text-gray-400" />
            </div>
            <h2 className="text-lg md:text-xl">Kris Marrier</h2>
          </div>
        </div>

        {/* Main Content */}
        <div 
          className="flex-1 p-4 md:p-8"
       style={{ backgroundColor: `${secondaryColor}E6` }}

        >
          <div className="max-w-xl mx-auto">
            {pageProperties?.visibleTitle && (
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{pageProperties.title}</h1>
            )}
            {pageProperties?.visibleDescription && (
              <div 
                className=" mb-6 md:mb-8" 
              style={{color:textColor}}  
              >{ pageProperties.description }</div>
            )}

            <h2 className="text-lg md:text-xl font-semibold mb-4" style={{color:textColor}}>Pick a Interview</h2>
            <div className=" rounded-lg shadow-sm p-3 md:p-4 mb-6 md:mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CiUser className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                  <div className="ml-3 md:ml-4">
                    <p className="text-xs md:text-sm " style={{color:textColor}}>Consultation</p>
                    <p className="font-medium text-sm md:text-base" style={{color:textColor}}>30mins</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Section */}
            <div className=" rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex items-center mb-4">
                <CalendarDays 
                  className="w-5 h-5 mr-2"
                  style={{ color: textColor }}
                />
                <h3 className="font-medium" style={{color:textColor}}>Select Date & Time</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <button className="p-1  rounded" >
                      <ChevronLeft className="w-5 h-5"  style={{color:textColor}}/>
                    </button>
                    <span className="font-medium" style={{color:textColor}}>February 2025</span>
                    <button className="p-1  rounded">
                      <ChevronRight className="w-5 h-5"  style={{color:textColor}}/>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                      <div key={day} className="text-center text-xs py-1 md:py-2 " style={{color:textColor}}>
                        {day}
                      </div>
                    ))}
                    
                    {getDaysInMonth().map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className="py-1 md:py-2 rounded-full text-xs md:text-sm hover:bg-gray-100"
                        style={selectedDate === day ? { 
                          backgroundColor: primaryColor,
                          color: textColor
                        } : {color:textColor}}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <div className="mb-4">
                    <select className="w-full p-2 border rounded-lg text-sm outline-none" style={{ background:"transparent",color:textColor}}>
                      <option>Africa/Cairo</option>
                    </select>
                  </div>

                  <p className="text-xs md:text-sm font-medium mb-2 md:mb-3" style={{color:textColor}}>Morning</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className="py-1 md:py-2 px-2 md:px-4 rounded-lg text-xs md:text-sm border hover:border-indigo-600"
                        style={selectedTime === time ? {
                          backgroundColor: primaryColor,
                          color: textColor,
                          borderColor: primaryColor
                        } : {color:textColor, borderColor:textColor}}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <FooterSection />
          </div>
        </div>
      </div>
    );
  }

  // Default layout
  return (
    <div 
      className="mx-auto p-4 md:p-8 rounded-lg"
      style={{ backgroundColor: secondaryColor }}
    >
      <div className="border-b mb-2 flex gap-3">
        {header?.visibleLogo && header.logo && (
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-md">
            <img 
              src={
                typeof header.logo === 'string' 
                  ? header.logo 
                  : URL.createObjectURL(header.logo)
              } 
              alt="Logo" 
              className="w-full h-full object-cover rounded-md" 
            />
          </div>
        )}
        {header?.visibleTitle && (
          <h1 className="text-lg md:text-xl font-semibold mb-4 md:mb-8">{header.title}</h1>
        )}
      </div>
      
      <div className="mb-6 md:mb-8 text-center">
        {pageProperties?.visibleTitle && (
          <h1 className="text-xl md:text-2xl font-semibold mb-2">{pageProperties.title}</h1>
        )}
        {pageProperties?.visibleDescription && (
          <div 
            className="text-sm md:text-base text-gray-600"
            dangerouslySetInnerHTML={{ __html: pageProperties.description }}
          />
        )}
      </div>

      <div className="flex items-center mb-6 md:mb-8 border-b pb-4 md:pb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <CiUser className="w-5 h-5 md:w-6 md:h-6 text-gray-400" /> 
        </div>
        <div className="ml-3 md:ml-4">
          <h2 className="text-sm md:text-base font-medium">Kris Marrier</h2>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="ml-2 md:ml-3">
              <p className="text-xs md:text-sm text-gray-500">Interview</p>
              <p className="text-sm md:text-base font-medium">Consultation | 30mins</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </div>
      </div>

      <div className="shadow-md p-3 md:p-4">
        <div className="mb-5 md:mb-6">
          <div className="flex items-center mb-3 md:mb-4">
            <CalendarDays 
              className="w-4 h-4 md:w-5 md:h-5 mr-2"
              style={{ color: textColor }}
            />
            <h3 className="text-sm md:text-base font-medium">Date, Time & Recruiter</h3>
          </div>
          <p 
            className="text-sm md:text-base font-medium mb-3 md:mb-4"
            style={{ color: textColor }}
          >
            25 Feb 2025 | 09:00 am
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <span className="text-sm md:text-base font-medium">February 2025</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="text-center text-xs py-1 md:py-2 text-gray-500">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth().map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className="py-1 md:py-2 rounded-full text-xs md:text-sm hover:bg-gray-100"
                  style={selectedDate === day ? {
                    backgroundColor: primaryColor,
                    color: 'white'
                  } : {}}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 md:mb-4">
              <select className="w-full p-2 border rounded-lg text-sm">
                <option>Africa/Cairo</option>
              </select>
            </div>

            <p className="text-xs md:text-sm font-medium mb-2 md:mb-3">Morning</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className="py-1 md:py-2 px-2 md:px-4 rounded-lg text-xs md:text-sm border hover:border-indigo-600"
                  style={selectedTime === time ? {
                    backgroundColor: primaryColor,
                    color: 'white',
                    borderColor: primaryColor
                  } : {}}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 border rounded-md p-3 md:p-4">
        <div className="flex items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          </div>
          <h3 className="ml-2 text-sm md:text-base font-medium">Your Info</h3>
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default ThemeBody;