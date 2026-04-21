import React from 'react';
import { Calendar, CreditCard, Video, Globe, CheckCircle } from 'lucide-react';
import feature2 from '../../assets/image/featuer-8.svg';

const IntegrationComponent = () => {
  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden min-h-96">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl text-left font-bold leading-tight">
            Integrate with the Tools You Love
          </h2>
          
          <p className="text-purple-100 leading-relaxed text-sm text-left">
            Sync calendars, connect meeting platforms,
            and automate payments — all within Appoint Roll.<br />
            Focus on your business,
            while everything else runs in the background.

          </p>
        </div>
        
        {/* Right Visual */}
        <div className="relative flex justify-center items-center">
          {/* Central circle with checkmark */}
          <img src={feature2} alt="" />
        </div>
      </div>
    </div>
  );
};

export default IntegrationComponent;