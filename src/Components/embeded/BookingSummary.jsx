import { useState, useRef, useEffect } from 'react';
import { Calendar, User, Phone, Mail, Clock, MapPin, Hash, ChevronRight, Printer, Menu } from 'lucide-react';
import { useLocation, Link, useParams, useSearchParams } from 'react-router-dom';
import RescheduleSidebar from './RescheduleSidebar';
import CancelConfirmationModal from './CancelConfirmationModal';
import { getAppointmentByTokenPublic } from '../../redux/apiCalls/AppointmentCallApi';
import { useDispatch } from 'react-redux';
import toast from "react-hot-toast";
import { PiBaseballCap } from "react-icons/pi";
import Loader from '../Loader';

export default function BookingSummary() {
  const [isRescheduleSidebarOpen, setIsRescheduleSidebarOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const location = useLocation();
  const bookingDetailsRef = useRef(null);
  const dispatch = useDispatch();
  const double_book = localStorage.getItem("double_book");
  const { id, idAdmin, idCustomer, idSpace } = useParams();
  const [searchParams] = useSearchParams();
  const appointmentToken = searchParams.get('apptok');
  const share_link = id || idAdmin || idCustomer || idSpace;

  const getBasePath = () => {
    const pathname = location.pathname;
    const pathParts = pathname.split("/").filter(Boolean);
    const idAdmin_or = pathParts[0];

    if (pathname.includes("/w/")) {
      const idSpace = pathParts[2];
      return `/${idAdmin_or}/w/${idSpace}`;
    } else if (pathname.includes("/s/")) {
      const idCustomer = pathParts[2];
      return `/${idAdmin_or}/s/${idCustomer}`;
    } else if (pathname.includes("/service/")) {
      const id = pathParts[2];
      return `/${idAdmin_or}/service/${id}`;
    } else {
      return `/${idAdmin_or}`;
    }
  };

  const basePath = getBasePath();
console.log(basePath);

  const fetchAppointmentData = async () => {
    try {
      const result = await dispatch(getAppointmentByTokenPublic(appointmentToken));
      setAppointmentData(result.data.appointment);
    } catch (error) {
      console.error('Error:', error);
    }
  };
const handleCancelSuccess = () => {
  fetchAppointmentData();
};
  useEffect(() => {
    if (appointmentToken) {
      fetchAppointmentData();
    }
  }, [appointmentToken, dispatch]);

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
    const details = encodeURIComponent(`Appointment with ${appointmentData?.name || 'Customer'}`);
    const location = encodeURIComponent("Online / Office");

    const start = new Date(`${appointmentData?.date}T${appointmentData?.time}`);
    const duration = Number(appointmentData?.duration_cycle);
    const end = new Date(start.getTime() + duration * 60000);

    const startDate = start.toISOString().replace(/-|:|\.\d+/g, "");
    const endDate = end.toISOString().replace(/-|:|\.\d+/g, "");

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
DESCRIPTION:Appointment with ${appointmentData?.name || 'Customer'}
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

  if (!appointmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-7"><Loader /></div>
          <Link
            to={`${basePath}`}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Appoint Roll
            </h1>
            {double_book && double_book == 1 && (
              <Link
                to={`${basePath}`}
                className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                <span>Book another</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex items-center justify-end px-6 sm:px-12 pt-3 space-x-4 text-sm">
            {appointmentData?.status !== "cancelled" && (
              <>
                <button
                  onClick={() => setIsRescheduleSidebarOpen(true)}
                  className="text-blue-600 hover:text-blue-700 transition-colors hover:underline text-xs sm:text-sm"
                >
                  Reschedule
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="text-red-600 hover:text-red-700 transition-colors hover:underline text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <span className="text-gray-400">|</span>
              </>
            )}
            <button
              onClick={handlePrint}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Printer className='w-4 h-4' />
            </button>
          </div>

          {/* Action Buttons - Mobile */}
          <div className="sm:hidden flex items-center justify-end px-4 pt-3">
            <button
              onClick={() => setShowMobileActions(!showMobileActions)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Actions Dropdown */}
          {showMobileActions && (
            <div className="sm:hidden px-4 pb-3 space-y-2 no-print">
              {appointmentData?.status !== "cancelled" && (
                <>
                  <button
                    onClick={() => {
                      setIsRescheduleSidebarOpen(true);
                      setShowMobileActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => {
                      setIsCancelModalOpen(true);
                      setShowMobileActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  handlePrint();
                  setShowMobileActions(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Printer className='w-4 h-4' />
                <span>Print</span>
              </button>
            </div>
          )}

          {/* Title */}
          <div className="py-6 sm:py-8 px-4 sm:px-6 border-b border-gray-200 flex flex-col justify-center items-center no-print">
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 text-center mb-4 sm:mb-5">
              Your Booking Summary
            </h2>
            <span className='w-full h-1 bg-black'></span>
          </div>

          {/* Status */}
          <div className="px-4 sm:px-6 py-4 no-print">
            <div className="flex justify-end">
              <span className="text-xs sm:text-sm">
                Status: <span className="text-green-600 font-medium">Confirmed</span>
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="px-4 sm:px-6 pb-6 space-y-4 sm:space-y-6 booking-details" ref={bookingDetailsRef}>
            {/* Booking Id */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-gray-600">Booking Id</div>
              </div>
              <div className="sm:w-2/3 font-medium text-sm sm:text-base pl-6 sm:pl-0">
                {appointmentData?.id || 'N/A'}
              </div>
            </div>

            {/* Interview */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <PiBaseballCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-gray-600">Interview</div>
              </div>
              <div className="sm:w-2/3 font-medium text-sm sm:text-base pl-6 sm:pl-0 truncate block max-w-[150px]">
                {appointmentData?.interview_name || 'N/A'}
              </div>
            </div>

            {/* Customer */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-gray-600">Organisation</div>
              </div>
              <div className="sm:w-2/3 font-medium text-sm sm:text-base pl-6 sm:pl-0">
                {appointmentData?.customer_name  || 'N/A'}
              </div>
            </div>

            {/* Staff */}
            {appointmentData?.staff_name && appointmentData?.staff !== null && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:w-1/3">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-gray-600">Staff</div>
                </div>
                <div className="sm:w-2/3 font-medium text-sm sm:text-base pl-6 sm:pl-0 truncate block max-w-[150px]">
                  {appointmentData?.staff_name || 'N/A'}
                </div>
              </div>
            )}
            {appointmentData?.resource_name && appointmentData?.resource_name !== null && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:w-1/3">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-gray-600">Resource</div>
                </div>
                <div className="sm:w-2/3 font-medium text-sm sm:text-base pl-6 sm:pl-0 truncate block max-w-[150px]">
                  {appointmentData?.resource_name || 'N/A'}
                </div>
              </div>
            )}

            {/* Date & Time */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-gray-600">Date & Time</div>
              </div>
              <div className="sm:w-2/3 pl-6 sm:pl-0">
                <div className="font-medium text-sm sm:text-base">{appointmentData?.date}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{appointmentData?.time} ({appointmentData?.time_zone})</div>
                <div className="text-xs sm:text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="break-all">{appointmentData?.time_zone}</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-gray-600">Contact Details</div>
              </div>
              <div className="sm:w-2/3 pl-6 sm:pl-0">
                <div className="font-medium text-sm sm:text-base break-words">{appointmentData?.name || 'N/A'}</div>
                {appointmentData?.phone && appointmentData?.phone !== null && (
                  <div className="text-xs sm:text-sm text-blue-600 flex items-center mt-1">
                    <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="break-all">{formatPhoneNumber(appointmentData?.phone, appointmentData?.code_phone)}</span>
                  </div>
                )}
                <div className="text-xs sm:text-sm text-blue-600 flex items-center mt-1">
                  <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="break-all">{appointmentData?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Booked On */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:w-1/3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-gray-600">Booked On</div>
              </div>
              <div className="sm:w-2/3 font-medium text-sm sm:text-base pl-6 sm:pl-0">
                {getCurrentDate()}
              </div>
            </div>

            {/* Meeting */}
            {appointmentData?.meeting_link && appointmentData?.meeting_link !== null && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:w-1/3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-gray-600">Meeting</div>
                </div>
                <div className="sm:w-2/3 font-medium text-sm sm:text-base pl-6 sm:pl-0 break-all">
                  <a href={appointmentData?.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {appointmentData?.meeting_link}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="border-t border-gray-200 mx-4 sm:mx-6 no-print"></div>
          <div className="px-4 sm:px-6 py-4 sm:py-6 no-print">
            <div className="flex flex-col sm:flex-row gap-3">
              {appointmentData?.status !== "cancelled" && (
                <>
                  <button
                    onClick={handleAddToCalendar}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </button>
                  <button
                    onClick={handleDownloadICS}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download as ICS
                  </button>
                </>
              )}
              {double_book && double_book == true && (
                <Link
                  to={`${basePath}`}
                  className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                >
                  <span>Book another appointment</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 no-print px-4">
          <p>
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

      {/* Sidebars */}
      <RescheduleSidebar
        isOpen={isRescheduleSidebarOpen}
        onClose={() => setIsRescheduleSidebarOpen(false)}
        onRescheduleSuccess={handleRescheduleSuccess}
        appointmentData={appointmentData}
        outShareId={share_link}
      />
      <CancelConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelAppointment}
        isLoading={isCancelling}
        appointmentData={appointmentData}
        onCancelSuccess={handleCancelSuccess}
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