import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {  getAppointmentByIdPublic } from "../../redux/apiCalls/AppointmentCallApi"
import RescheduleSidebar from "../embeded/RescheduleSidebar";
import CancelConfirmationModal from "../embeded/CancelConfirmationModal";
import { 
  Hash, 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Printer, 
  ChevronRight 
} from 'lucide-react';
import { PiBaseballCap } from "react-icons/pi";
export default function AppointmentHandler() {
  const location = useLocation();
  const dispatch = useDispatch();
   const bookingDetailsRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [isRescheduleSidebarOpen, setIsRescheduleSidebarOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get("app_id");

console.log(appointmentId);
  
  const fetchAppointmentData = async (id) => {
    try {
      setLoading(true);
      const result = await dispatch(getAppointmentByIdPublic(id));
      setAppointmentData(result);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch appointment data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentData(appointmentId);
    }
  }, [appointmentId]);

  // Handle reschedule button click
  const handleRescheduleClick = () => {
    setIsRescheduleSidebarOpen(true);
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };
  const formatPhoneNumber = (phone, codePhone) => {
    if (!phone) return 'N/A';
    return `${codePhone || ''}${phone}`;
  };
    const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
   const handlePrint = () => {
    window.print();
  };
  // Handle successful cancellation
  const handleCancelSuccess = () => {
    setIsCancelModalOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading appointment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!appointmentData?.data?.appointment) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-600">No appointment data found</p>
        </div>
      </div>
    );
  }

  const appointment = appointmentData?.data?.appointment;

  
console.log(appointment);

  return (
    <>
     <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-sm px-12">
        <div className="flex items-center justify-end !mt-3 space-x-4 text-sm">
          <button
            onClick={handleRescheduleClick}
            className="!mt-3 text-blue-600 hover:text-blue-700 transition-colors hover:underline text-[12px]"
          >
            Reschedule
          </button>
          <span className="text-gray-400 !mt-3">|</span>
          <button 
            onClick={handleCancelClick}
            className="text-[12px] !mt-3 text-red-600 hover:text-red-700 transition-colors hover:underline"
          >
            Cancel
          </button>
          <span className="text-gray-400 !mt-3">|</span>
          <button
            onClick={handlePrint}
            className="!mt-3 text-gray-600 hover:underline hover:text-gray-800 transition-colors"
          >
            <Printer className='w-4 h-4'/>
          </button>
        </div>
        
        <div className="py-4 border-b border-gray-200 flex flex-col justify-center items-center no-print">
          <h2 className="text-3xl font-medium text-gray-900 w-1/2 text-center mb-5">Your Booking Summary</h2>
          <span className='w-full h-1 bg-black text-center mb-3'></span>
        </div>

        <div className="px-6 py-3 bg-blue-50 border-l-4 border-blue-400 no-print">
          <div className="flex items-start">
            <div className="w-5 h-5 text-blue-400 mt-0.5 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-400 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <p className="ml-2 text-sm text-blue-700">
              Consider bookmarking this page for future reference.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 no-print">
          <div className="flex justify-end">
            <span className="text-sm">
              Status: <span className="text-green-600 font-medium">Confirmed</span>
            </span>
          </div>
        </div>

        <div className="pb-6 space-y-6 booking-details" ref={bookingDetailsRef}>
          {/* Booking Id */}
          <div className="flex items-center w-full">
            <div className="flex items-center gap-1 w-1/3">
              <Hash className="w-5 h-5 text-gray-400" />
              <div className="text-sm text-gray-600">Booking Id</div>
            </div>
            <div className="w-1/3 text-left font-medium">
              {appointment?.id || 'N/A'}
            </div>
            <div className="w-1/3"></div>
          </div>

          {/* Interview */}
          <div className="flex items-center w-full">
            <div className="flex items-center gap-1 w-1/3">
              <PiBaseballCap className="w-5 h-5 text-gray-400" />
              <div className="text-sm text-gray-600">Interview</div>
            </div>
            <div className="w-1/3 text-left font-medium">
              {appointment?.interview_name || 'N/A'}
            </div>
            <div className="w-1/3"></div>
          </div>

          {/* Customer */}
          <div className="flex items-center w-full">
            <div className="flex items-center gap-1 w-1/3">
              <User className="w-5 h-5 text-gray-400" />
              <div className="text-sm text-gray-600">Organisation</div>
            </div>
            <div className="w-1/3 text-left font-medium truncate  max-w-[150px]">
              {appointment?.customer_name || 'N/A'}
            </div>
            <div className="w-1/3"></div>
          </div>
          
            {/* Staff */}
            {appointment?.staff_name && appointment?.staff !== null && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:w-1/3">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-gray-600">Staff</div>
                </div>
                <div className="sm:w-2/3 font-medium text-sm sm:text-base pl-6 sm:pl-0 truncate block max-w-[150px]">
                  {appointment?.staff_name || 'N/A'}
                </div>
              </div>
            )}

          {/* Date & Time */}
          <div className="flex items-start w-full">
            <div className="flex items-center gap-1 w-1/3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="text-sm text-gray-600">Date & Time</div>
            </div>
            <div className="w-1/3 text-left">
              <div className="font-medium">{appointment?.date}</div>
              <div className="text-sm text-gray-500">{appointment?.time} ({appointment?.time_zone})</div>
              <div className="text-sm text-gray-500 flex items-center justify-start">
                <MapPin className="w-3 h-3 mr-1" />
                {appointment?.time_zone}
              </div>
            </div>
            <div className="w-1/3"></div>
          </div>

          {/* Contact Details */}
          <div className="flex items-start w-full">
            <div className="flex items-center gap-1 w-1/3">
              <User className="w-5 h-5 text-gray-400" />
              <div className="text-sm text-gray-600">Contact Details</div>
            </div>
            <div className="w-1/3 text-left">
              <div className="font-medium truncate  max-w-[150px]">{appointment?.name || 'N/A'}</div>
              <div className="text-sm text-blue-600 flex items-center justify-start">
                <Phone className="w-3 h-3 mr-1" />
                {formatPhoneNumber(appointment?.phone, appointment?.code_phone)}
              </div>
              <div className="text-sm text-blue-600 flex items-center justify-start">
                <Mail className="w-3 h-3 mr-1" />
                {appointment?.email || 'N/A'}
              </div>
            </div>
            <div className="w-1/3"></div>
          </div>

          {/* Booked On */}
          <div className="flex items-center w-full">
            <div className="flex items-center gap-1 w-1/3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div className="text-sm text-gray-600">Booked On</div>
            </div>
            <div className="w-1/3 text-left font-medium">
              {getCurrentDate()}
            </div>
            <div className="w-1/3"></div>
          </div>
        </div>

        <div className="border-t border-gray-200 mx-6 no-print"></div>

        <div className="px-6 py-6 flex justify-end flex-wrap gap-3 no-print">
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download as ICS
          </button> */}
          {/* <div className="flex-1"></div>
          <Link to={`/share${appointment?.share_link}`} className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
            <span>Book another appointment</span>
            <ChevronRight className="w-4 h-4" />
          </Link> */}
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-500 no-print">
        Powered by Appoint Roll
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
      

      {/* Reschedule Sidebar */}
      <RescheduleSidebar
        isOpen={isRescheduleSidebarOpen}
        onClose={() => setIsRescheduleSidebarOpen(false)}
        appointmentData={appointment}
        outShareId={appointment?.share_link}
      />

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        appointmentData={appointment}
        onCancelSuccess={handleCancelSuccess}
      />
    </>
  );
}