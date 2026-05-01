import React from 'react';
import { Link } from 'react-router-dom';
import shareLinkpro from '../../assets/image/New folder/pro 2.mp4';

const HeroSection = () => {
  return (
    <div className="relative min-h-[600px] overflow-hidden">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="z-10">
            <h1 className="text-[3.2rem] md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Schedule Smarter.<br/>Work Better.
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              Appointroll transforms the way you manage bookings —
              no calls, no emails, no chaos.
              Just a seamless scheduling experience
              for you and your clients.

            </p>
            <Link to="/signup" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors">
              Start Your Free Trial now
            </Link>
          </div>

       
         
              {/* Center Person */}
            
              {/* Decorative Elements */}
              <div className=" w-full">
                <video
                  src={shareLinkpro}
                  autoPlay
                  loop
                  muted
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
    
  );
};

export default HeroSection;