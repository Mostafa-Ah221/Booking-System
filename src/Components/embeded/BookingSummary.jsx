import { useState, useRef, useEffect } from 'react';
import { Calendar, User, Phone, Mail, Clock, MapPin, Hash, ChevronRight, Printer } from 'lucide-react';
import { useLocation, Link, useParams } from 'react-router-dom';
import RescheduleSidebar from './RescheduleSidebar';
import CancelConfirmationModal from './CancelConfirmationModal';
import { getAppointmentByIdPublic } from '../../redux/apiCalls/AppointmentCallApi';
import { useDispatch } from 'react-redux';
import toast from "react-hot-toast";
import { PiBaseballCap } from "react-icons/pi";

export default function BookingSummary() {
  const [isRescheduleSidebarOpen, setIsRescheduleSidebarOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const location = useLocation();
  const responseData = location.state;
  const bookingDetailsRef = useRef(null);
  const dispatch = useDispatch();
  const double_book = localStorage.getItem("double_book");
const { id, idAdmin, idCustomer, idSpace } = useParams();

const share_link =  id || idAdmin|| idCustomer|| idSpace
console.log(responseData);

const getBasePath = () => {
    const pathname = location.pathname;
    
    if (pathname.includes('/Admin/')) {
      return `/Admin/${idAdmin}`;
    } else if (pathname.includes('/Staff/')) {
      return `/Staff/${idCustomer}`;
    } else if (pathname.includes('/Space/')) {
      return `/Space/${idSpace}`;
    } else {
      return `/${id}`;
    }
  };

  const basePath = getBasePath();

  const fetchAppointmentData = async () => {
    try {
      const result = await dispatch(getAppointmentByIdPublic(responseData?.data.id));
      setAppointmentData(result?.appointment);
      console.log();
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (responseData?.data.id) {
      fetchAppointmentData();
    }
  }, [responseData?.data.id, dispatch]);

  const handleRescheduleSuccess = () => {
    fetchAppointmentData(); 
    setIsRescheduleSidebarOpen(false);
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

  const handleCancelAppointment = async () => {
    setIsCancelling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsCancelModalOpen(false);
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel appointment. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Appointment");
    const details = encodeURIComponent(`Appointment with ${responseData?.data.name || 'Customer'}`);
    const location = encodeURIComponent("Online / Office");
    const startDate = new Date(`${appointmentData?.date}T${appointmentData?.time}`).toISOString().replace(/-|:|\.\d+/g, "");
    const endDate = new Date(new Date(`${appointmentData?.date}T${appointmentData?.time}`).getTime() + 30 * 60000)
      .toISOString().replace(/-|:|\.\d+/g, "");

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
    window.open(url, "_blank");
  };

  const handleDownloadICS = () => {
    const startDate = new Date(`${appointmentData?.date}T${appointmentData?.time}`).toISOString().replace(/-|:|\.\d+/g, "");
    const endDate = new Date(new Date(`${appointmentData?.date}T${appointmentData?.time}`).getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d+/g, "");
    
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Appointment
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:Appointment with ${responseData?.data.name || 'Customer'}
LOCATION:Online / Office
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "appointment.ics";
    link.click();
  };

  if (!responseData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg">No booking data found</div>
          <Link
            to={`${basePath}`}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* header */}
      <div className="bg-white shadow-sm no-print">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {responseData?.data.workspace || 'Booking System'}
          </h1>
          {double_book && double_book == 1 ? (
            <Link
              to={`${basePath}`}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
            >
              <span>Book another appointment</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : ""}
        </div>
      </div>

      {/* main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm px-12">
          {/* action buttons */}
          <div className="flex items-center justify-end !mt-3 space-x-4 text-sm">
            <button
              onClick={() => setIsRescheduleSidebarOpen(true)}
              className="!mt-3 text-blue-600 hover:text-blue-700 transition-colors hover:underline text-[12px]"
            >
              Reschedule
            </button>
            <span className="text-gray-400 !mt-3">|</span>
            <button 
              onClick={() => setIsCancelModalOpen(true)}
              className="text-[12px] !mt-3 text-red-600 hover:text-red-700 transition-colors hover:underline"
            >
              Cancel
            </button>
            <span className="text-gray-400 !mt-3 ">|</span>
            <button
              onClick={handlePrint}
              className="!mt-3 text-gray-600 hover:underline hover:text-gray-800 transition-colors"
            >
              <Printer className='w-4 h-4'/>
            </button>
          </div>

          {/* title */}
          <div className=" py-4 border-b border-gray-200 flex flex-col justify-center items-center no-print">
            <h2 className="text-3xl font-medium text-gray-900 w-1/2 text-center mb-5 ">Your Booking Summary</h2>
            <span className='w-full h-1 bg-black text-center mb-3'></span>
          </div>

          {/* status */}
          <div className="px-6 py-4 no-print">
            <div className="flex justify-end">
              <span className="text-sm">
                Status: <span className="text-green-600 font-medium">Confirmed</span>
              </span>
            </div>
          </div>

          {/* booking details */}
          <div className=" pb-6 space-y-6 booking-details" ref={bookingDetailsRef}>
            {/* Booking Id */}
            <div className="flex items-center w-full">
              <div className="flex items-center gap-1 w-1/3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">Booking Id</div>
              </div>
              <div className="w-1/3 text-left font-medium">
                {responseData?.data.id || 'N/A'}
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
                {responseData?.data.interview || 'N/A'}
              </div>
              <div className="w-1/3"></div>
            </div>
            {/* Customer */}
            <div className="flex items-center w-full">
              <div className="flex items-center gap-1 w-1/3">
                <User className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">Organisation</div>
              </div>
              <div className="w-1/3 text-left font-medium">
                {responseData?.data.customer || responseData?.data.name || 'N/A'}
              </div>
              <div className="w-1/3"></div>
            </div>
            {/* Staff */}
            {responseData?.data.staff_name && responseData?.data.staff !== null &&  <div className="flex items-center w-full">
              <div className="flex items-center gap-1 w-1/3">
                <User className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">Staff</div>
              </div>
              <div className="w-1/3 text-left font-medium">
                {responseData?.data.staff_name ||'N/A'}
              </div>
              <div className="w-1/3"></div>
            </div>}
           
            {/* Date & Time */}
            <div className="flex items-start w-full">
              <div className="flex items-center gap-1 w-1/3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">Date & Time</div>
              </div>
              <div className="w-1/3 text-left">
                <div className="font-medium">{appointmentData?.date}</div>
                <div className="text-sm text-gray-500">{appointmentData?.time}</div>
                <div className="text-sm text-gray-500 flex items-center justify-start">
                  <MapPin className="w-3 h-3 mr-1" />
                  {appointmentData?.time_zone}
                </div>
              </div>
              <div className="w-1/3"></div>
            </div>
            {/* Contact */}
            <div className="flex items-start w-full">
              <div className="flex items-center gap-1 w-1/3">
                <User className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">Contact Details</div>
              </div>
              <div className="w-1/3 text-left">
                <div className="font-medium">{responseData?.data.name || 'N/A'}</div>
                  {responseData?.data.phone && responseData?.data.phone !== null 
                  && <div className="text-sm text-blue-600 flex items-center justify-start">
                  <Phone className="w-3 h-3 mr-1" />
                  {formatPhoneNumber(responseData?.data.phone, responseData?.data.code_phone)}
                </div>}
                
                <div className="text-sm text-blue-600 flex items-center justify-start">
                  <Mail className="w-3 h-3 mr-1" />
                  {responseData?.data.email || 'N/A'}
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
            {/* Meeting */}
            {responseData?.data.meeting_link && responseData?.data.meeting_link !== null 
            &&  <div className="flex items-center w-full">
              <div className="flex items-center gap-1 w-1/3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="text-sm text-gray-600">Meeting </div>
              </div>
              <div className="w-1/3 text-left font-medium">
                {responseData?.data.meeting_link || 'N/A'}
              </div>
              <div className="w-1/3"></div>
            </div>}
           
          </div>

          {/* footer buttons */}
          <div className="border-t border-gray-200 mx-6 no-print"></div>
          <div className="px-6 py-6 flex flex-wrap gap-3 no-print">
            <button
              onClick={handleAddToCalendar}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </button>
            <button
              onClick={handleDownloadICS}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
            >
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
            </button>
            <div className="flex-1"></div>
            {double_book && double_book == 1 ? (
              <Link
                to={`${basePath}`}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                <span>Book another appointment</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : ""}
          </div>
        </div>
        <div className="text-center mt-8 text-sm text-gray-500 no-print">
          <p className="text-xs text-gray-500 mt-1">
            Powered by 
            <a 
              href="http://egydesigner.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline"
            >
              EGYdesigner
            </a>
          </p>
        </div>
      </div>

      {/* sidebars */}
      <RescheduleSidebar
        isOpen={isRescheduleSidebarOpen}
        onClose={() => setIsRescheduleSidebarOpen(false)}
        onRescheduleSuccess={handleRescheduleSuccess}
        appointmentData={responseData?.data}
        outShareId={share_link}
      />
      <CancelConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelAppointment}
        isLoading={isCancelling}
        appointmentData={responseData?.data}
      />

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          div.booking-details,
          div.booking-details * {
            visibility: visible !important;
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
          div.booking-details {
            position: static;
            width: 100%;
            padding: 20px;
            background: white;
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
}