import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Step_4 = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="text-blue-600 w-8 h-8">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <span className="text-xl font-medium">Bookings</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Custom Labels 
              <span className="text-yellow-400">✨</span>
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block mb-2">
                How would you like to label your Event Types?
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Interviews"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                E.g.: Consultations, Classes, Sessions
              </p>
            </div>

            <div>
              <label className="block mb-2">
                How would you like to label your Team Members?
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Recruiters"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                E.g.: Consultants, Technicians, Physicians
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button className="px-8 py-2 border border-gray-200 rounded text-gray-700 hover:bg-gray-50">
              Back
            </button>
            <Link to='/layoutDashboard' className="inline-block  px-8 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Create
            </Link>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Step 4</h3>
            <h2 className="text-2xl font-bold mb-4">Update your custom labels</h2>
            <div className='flex gap-2'>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
            </div>
            <p className="text-gray-600 mb-8">
              Rename certain modules in the product to match with your business terminologies. Our AI has curated a few suggestions based on your industry; you can also edit them if required.
            </p>
            
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-lg">
                <Calendar className="text-purple-600" size={20} />
                <span className="text-gray-800">Interviews</span>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-lg">
                <Users className="text-purple-600" size={20} />
                <span className="text-gray-800">Recruiters</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Step_4;