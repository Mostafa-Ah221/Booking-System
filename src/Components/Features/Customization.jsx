import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import feature9 from '../../assets/image/featur-9.webp';

const Customization = () => {



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-white space-y-8">
            <h1 className="text-2xl lg:text-3xl text-left font-bold leading-tight">
              Customizable booking pages that resonate with your brand
            </h1>
            <p className="text-xl text-purple-200 leading-relaxed text-left">
              Create a tailored booking page that fits your website branding, and 
              add it to your website instead of a contact form to receive 
              appointments directly from your visitors.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-semibold transition-colors duration-200 flex items-center gap-2 text-sm">
              LEARN MORE →
            </button>
          </div>

          {/* Right Side - Booking Interface */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500 rounded-lg rotate-12 opacity-30"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-blue-500 rounded-full opacity-20"></div>
            
            {/* Main booking card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Z</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Zylker</h3>
                    <p className="text-sm text-gray-600">Booking Summary</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Risk Management</p>
                      <p className="text-sm text-gray-600">30 mins via Zoom link</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Fri 26th at 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>30 minutes • 10:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="p-6">
               <img src={feature9} alt="" />
              </div>
            </div>

            
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default Customization;