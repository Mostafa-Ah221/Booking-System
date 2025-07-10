import React from 'react';
import { Info } from 'lucide-react';

const SchedulingRules = () => {
  const SelectBox = ({ value,title }) => (
    <div className="relative">
      <select className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400">
        {Array.from({length:value},(_,i)=> {
          return <option key={i}>{i} {title}</option>;
        })}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  const NumberInput = () => (
    <input 
      type="number" 
      defaultValue="0"
      min="0"
      className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
    />
  );

  return (
    <div className=" mx-auto p-4 bg-white rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-6">Scheduling Rules</h2>

      {/* Buffer Time Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Buffer Time</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pre-buffer */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Pre-buffer</label>
            <p className="text-xs text-gray-500 mb-2">Extra time added before an appointment</p>
            <div className="flex space-x-2">
              <SelectBox value="24" title="Hours"/>
              <SelectBox value="60" title="Minutes"/>
            </div>
          </div>

          {/* Post-buffer */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Post-buffer</label>
            <p className="text-xs text-gray-500 mb-2">Extra time added after an appointment</p>
            <div className="flex space-x-2">
              <SelectBox value="24" title="Hours"/>
              <SelectBox value="60"  title="Minutes" />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Notice Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Booking Notice</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Minimum Booking Notice */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum Booking Notice</label>
            <p className="text-xs text-gray-500 mb-2">Shortest notice required to book last minute bookings</p>
            <div className="flex space-x-2 items-center">
              <NumberInput />
              <span className="text-sm text-gray-600">Days</span>
             <SelectBox value="24" title="Hours"/>
              <SelectBox value="60"  title="Minutes" />
            </div>
          </div>

          {/* Maximum Booking Notice */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Maximum Booking Notice</label>
            <p className="text-xs text-gray-500 mb-2">How far in advance an appointment can be booked</p>
            <div className="flex space-x-2 items-center">
              <NumberInput />
              <span className="text-sm text-gray-600">Days</span>
              <SelectBox value="24" title="Hours"/>
              <SelectBox value="60"  title="Minutes" />
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling Interval Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-medium">Scheduling Interval</h3>
          <Info className="w-4 h-4 text-gray-400 ml-2" />
        </div>
        <p className="text-xs text-gray-500 mb-4">The interval between each appointment's start time.</p>
        
        <div className="flex space-x-2 mb-4">
          <SelectBox value="Adjusted Slots" />
         <SelectBox value="24" title="Hours"/>
          <SelectBox value="60"  title="Minutes" />
        </div>
        
        <p className="text-xs text-gray-500 italic">
          Time slots adjust to accommodate other appointments and extends events (e.g., for 30 minute intervals, if there's an event scheduled from 10:00 to 11:15, the slots will be 9:00, 9:30, 10:45, ...).
        </p>
      </div>

      {/* Cancellation and Rescheduling Window */}
      <div>
        <h3 className="text-lg font-medium mb-4">Cancellation and Rescheduling Window</h3>
        <p className="text-xs text-gray-500 mb-4">How much time before an appointment it can be rescheduled or cancelled</p>
        
        <div className="flex space-x-2 items-center">
          <NumberInput />
          <span className="text-sm text-gray-600">Days</span>
          <SelectBox value="24" title="Hours"/>
            <SelectBox value="60"  title="Minutes" />
        </div>
      </div>
    </div>
  );
};

export default SchedulingRules;