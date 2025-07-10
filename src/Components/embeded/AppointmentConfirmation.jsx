import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Download, Plus, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { Link, useParams } from 'react-router-dom';
import RescheduleSidebar from './RescheduleSidebar';
import imgCheckCircle from '../../assets/image/ueyd.png'

export default function AppointmentConfirmation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRescheduleSidebarOpen, setIsRescheduleSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
const {id} = useParams();
const location = useLocation();
const responseData = location.state?.data.appointment;

console.log(responseData.id);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
   

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8 pt-12">
        {/* Success Message */}
        <div className="text-center mb-8">
         
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Appointment confirmed with {responseData?.name}!
          </h1>
          <p className="text-gray-600">Your appointment has been successfully scheduled</p>
        </div>

        {/* Appointment Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex items-start justify-between">
            {/* Left Side - Calendar Icon and Details */}
            <div className="flex items-start space-x-4">
              <div className=" rounded-lg p-1 flex-shrink-0">
                <div className="w-20 h-20 bg-white rounded flex items-center justify-center">
                  <img className="w-full h-full" src={imgCheckCircle} alt="" />
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-600">{responseData?.date} | {responseData?.time}</span>
                </div>
                <p className="text-gray-600 mb-1">demo</p>
                <p className="text-sm text-gray-500">{responseData?.time_zone}</p>
                
                {/* Action Links */}
                <div className="flex items-center space-x-4 mt-4">
                 
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download as ICS</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Actions Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <Link to={`/share/${id}/appointmentConfirmation/summary`} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Booking Summary
                  </Link>
                  <button
                   onClick={() => setIsRescheduleSidebarOpen(true)}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                    Reschedule
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Cancel
                  </button>
                </div>
              )}
               <RescheduleSidebar
        isOpen={isRescheduleSidebarOpen}
        onClose={() => setIsRescheduleSidebarOpen(false)}
        appointmentData={responseData}
      />
            </div>
          </div>
        </div>

        {/* Book Another Appointment Button */}
        <div className="text-center mb-12">
          <Link to={`/share/${id}`} className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
            <span>Book another appointment</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 border-2 border-white rounded-lg rotate-45"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xl font-bold">Zoho</span>
                </div>
                <span className="text-xl font-bold">Bookings</span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-purple-100 mb-2">Powered by</p>
              </div>

              <h2 className="text-2xl font-bold mb-4">
                Simplify appointment scheduling for your business
              </h2>
              
              <p className="text-purple-100 leading-relaxed mb-6">
                With Zoho Bookings, you can book more appointments without phone calls, back-and-forth emails, and 
                repetitive tasks. Let customers self-schedule while you grow your business.
              </p>
            </div>

            {/* Right Side - CTA */}
            <div className="text-center md:text-right">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl">
                Try for free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}