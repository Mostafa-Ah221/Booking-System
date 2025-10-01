import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Setup_2 = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('HR');
  const [selectedNeeds, setSelectedNeeds] = useState(['Recruitment Strategy Meeting']);

  const industries = [
    'HR', 'Sales', 'Marketing', 'Finance', 'Education', 'Manufacturing',
    'Information Technology', 'Consulting Firms', 'Automotive', 'Customer support',
    'Hospitality', 'Real Estate', 'Travel', 'Fitness', 'Others'
  ];

  const needs = [
    'Recruitment Strategy Meeting',
    'Onboarding',
    'Performance Management',
    'Training Session'
  ];

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
  };

  const handleNeedSelect = (need) => {
    setSelectedNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need)
        : [...prev, need]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="text-blue-600 w-8 h-8">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <span className="text-xl font-medium">Appoint Roll</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Which industry best describes your business?
              <span className="text-red-500">*</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleIndustrySelect(industry)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedIndustry === industry
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              ...and what specific needs are you trying to address?
            </h2>
            <div className="flex flex-wrap gap-3">
              {needs.map((need) => (
                <button
                  key={need}
                  onClick={() => handleNeedSelect(need)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedNeeds.includes(need)
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-8 py-2 border border-gray-200 rounded text-gray-700 hover:bg-gray-50">
              Back
            </button>
            <Link to="/setup_3" className=" inline-block px-8 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Next
            </Link>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Step 2</h3>
            <h2 className="text-2xl font-bold mb-4">Industry details</h2>
            <div className='flex gap-2'>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-gray-200 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-gray-200 rounded-md inline-block'></span>
            </div>
            <p className="text-gray-600 mb-8">
              Based on your industry, our AI will set up your dashboard to align with your business.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-600 text-white rounded">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"/>
                  </svg>
                  <span>HR</span>
                </div>
              </div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup_2;