import React, { useState, useEffect } from 'react';
import feature from '../../assets/image/featuer-2.PNG';
import feature2 from '../../assets/image/featuer-3.PNG';

const ZohoBookingsClone = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // إضافة الـ CSS animation للحركة المستمرة
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes floating {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }
    `;
    document.head.appendChild(style);

    // تفعيل الأنيميشن بعد تحميل الكومبوننت
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
          
          {/* Left Panel - Text Content */}
          <div className="">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Beyond
                appointment<br />
                scheduling
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-md">
                Take the hassle out of scheduling with Appoint Roll. Automate your meetings, emails, payments, team collaboration, and integrations for a seamless appointment scheduling experience.
              </p>
              
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-md text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                ACCESS Appoint Roll
              </button>
            </div>
          </div>

          {/* Right Panel - Image Placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full h-96 lg:h-[500px] flex items-center justify-center">
              <div className="text-center text-gray-400 relative">
                <img 
                  className={`rounded-2xl shadow-2xl transition-all duration-1000 ease-out ${
                    isLoaded 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-20 opacity-0'
                  }`} 
                  src={feature} 
                  alt="feature" 
                />
                <img 
                  className={`rounded-2xl shadow-2xl absolute top-20 -left-20 transition-all duration-1000 ease-out ${
                    isLoaded 
                      ? 'translate-y-0 opacity-100 animate-bounce-slow' 
                      : 'translate-y-20 opacity-0'
                  }`} 
                  src={feature2} 
                  alt="feature" 
                  style={{
                    animation: isLoaded ? 'floating 3s ease-in-out infinite' : 'none'
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ZohoBookingsClone;