import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative min-h-[600px] overflow-hidden">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text Content */}
          <div className="z-10">
            <h1 className="text-[3.2rem] md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Online appointment scheduling made simple
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              Appoint Roll is intuitive appointment scheduling software that empowers everyone to schedule meetings effortlessly. With Bookings, you can avoid phone calls, back-and-forth emails, and repetitive tasks. Let customers self-schedule while you grow your business.
            </p>
            <Link to="/signup" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors">
              SIGN UP FOR FREE
            </Link>
          </div>

       
         
              {/* Center Person */}
            
              {/* Decorative Elements */}
              <div className=" w-full">
                <img 
                  src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-bnr-bg.svg" 
                  alt="Decorative icon"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute bottom-32 right-0 w-1/2">
                <img 
                  src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-banner-imgaes.png" 
                  alt="Decorative icon"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
    
  );
};

export default HeroSection;