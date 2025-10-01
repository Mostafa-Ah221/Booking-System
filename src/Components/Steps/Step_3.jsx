import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Step_3 = () => {
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  
  const weekDays = [
    { short: 'Sun', long: 'Sunday' },
    { short: 'Mon', long: 'Monday' },
    { short: 'Tue', long: 'Tuesday' },
    { short: 'Wed', long: 'Wednesday' },
    { short: 'Thu', long: 'Thursday' },
    { short: 'Fri', long: 'Friday' },
    { short: 'Sat', long: 'Saturday' }
  ];

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
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
          <h2 className="text-2xl font-bold mb-6">
            Your available times <span className="text-red-500">*</span>
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Time zone <span className="text-gray-400 ml-1">ⓘ</span>
              </label>
              <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500">
                <option>Africa/Cairo - EET (+02:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Your available times</label>
              <div className="flex gap-4">
                <select className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500">
                  <option>09:00 am</option>
                </select>
                <select className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500">
                  <option>06:00 pm</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Your available days</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                  <button
                    key={day.short}
                    onClick={() => toggleDay(day.short)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedDays.includes(day.short)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button className="px-8 py-2 border border-gray-200 rounded text-gray-700 hover:bg-gray-50">
              Back
            </button>
            <Link to="/setup_4" className="inline-block px-8 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Next
            </Link>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Step 3</h3>
            <h2 className="text-2xl font-bold mb-4">Set up your availability</h2>
             <div className='flex gap-2'>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-gray-200 rounded-md inline-block'></span>
            </div>
            <p className="text-gray-600 mb-8">Share your availability and start getting booked.</p>
            
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>09:00 am</span>
                  <span>06:00 pm</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="text-gray-500 font-medium py-2">{day}</div>
                  ))}
                  {[...Array(35)].map((_, i) => (
                    <div
                      key={i}
                      className={`py-2 ${
                        i % 7 !== 6 && i < 28
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Step_3;