import React, { useState } from 'react';
import { Copy, ExternalLink, Info } from 'lucide-react';

const CustomDomain = () => {
  const defaultDomain = "https://ahmed.zohobookings.com";
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(defaultDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Custom Domain</h2>
      
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Card Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium">Share Booking Page</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Here's your business booking page. You can customize the default URL or launch your own domain.{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 block sm:inline mt-1 sm:mt-0">
              For more information, take a look at our step-by-step guide.
            </a>
          </p>
        </div>
        
        {/* Card Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Default Domain Section */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Default booking domain
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="w-full sm:flex-1 bg-gray-50 p-2 sm:p-3 rounded-md text-gray-600 text-sm break-all">
                {defaultDomain}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                  Customize
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Custom Domain Section */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Custom Domain
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input 
                type="text" 
                placeholder="For example, book.zyker.com"
                className="w-full sm:flex-1 px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              />
              <button className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm">
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                Launch
              </button>
            </div>
          </div>
          
          {/* Help text - visible only on mobile */}
          <div className="block sm:hidden p-3 bg-blue-50 rounded-md border border-blue-100">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-700">
                To set up your custom domain, you'll need to update your DNS settings. Tap "Launch" to see detailed instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDomain;