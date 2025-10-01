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
            Integrate with your
            <br />
            favorite apps
          </h2>
          
          <p className="text-purple-100 leading-relaxed text-sm text-left">
            Integrate Appoint Roll with your favorite apps to 
            automate the entire scheduling process, from 
            syncing calendars and connecting video 
            conferencing apps to collecting payments and 
            completing other routine tasks. This enables you to 
            focus on the things that matter the most for your 
            business.
          </p>
          
          <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg flex items-center gap-2 group text-sm">
            LEARN MORE
           
          </button>
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