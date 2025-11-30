import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Download, Plus, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Link, useParams } from 'react-router-dom';
import RescheduleSidebar from './RescheduleSidebar';
import CancelConfirmationModal from './CancelConfirmationModal';
import imgCheckCircle from '../../assets/image/ueyd.png';
import imgCheckCancel from '../../assets/image/cancel.png';
import { getAppointmentByIdPublic } from '../../redux/apiCalls/AppointmentCallApi';
import { useDispatch } from 'react-redux';

export default function AppointmentConfirmation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRescheduleSidebarOpen, setIsRescheduleSidebarOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [appointmentData, setAppointmentData] = useState();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  console.log(appointmentData);
  
  
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const responseData = location.state?.data.data.appointment;
  const double_book = localStorage.getItem("double_book");
  const { id, idAdmin, idCustomer, idSpace } = useParams();

console.log(responseData);
  const getBasePath = () => {
    const pathname = location.pathname;
    const pathParts = pathname.split("/").filter(Boolean);
    const orgBase = pathParts[0];

    if (pathname.includes("/w/")) {
      const workspaceSlug = pathParts[2];
      return `/${orgBase}/w/${workspaceSlug}`;
    } 
    else if (pathname.includes("/s/")) {
      const staffSlug = pathParts[2];
      return `/${orgBase}/s/${staffSlug}`;
    } 
    else if (pathname.includes("/service/")) {
      const serviceSlug = pathParts[2];
      return `/${orgBase}/service/${serviceSlug}`;
    } 
    else {
      return `/${orgBase}`;
    }
  };

  const basePath = getBasePath();
  
  const fetchAppointmentData = async () => {
    try {
      const result = await dispatch(getAppointmentByIdPublic(responseData?.id));
      console.log(result);
      
      setAppointmentData(result.data.appointment);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (responseData?.id) {
      fetchAppointmentData();
    }
  }, [responseData?.id, dispatch]);

  const handleRescheduleSuccess = async () => {
  await fetchAppointmentData();
  setIsRescheduleSidebarOpen(false);
};

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleCancelSuccess = async() => {
    await fetchAppointmentData();
    setShowDropdown(false);
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Appointment");
    const details = encodeURIComponent(`Appointment with ${responseData?.customer || 'Customer'}`);
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
    const duration = Number(appointmentData?.duration_cycle) || 30;
    const endDate = new Date(new Date(`${appointmentData?.date}T${appointmentData?.time}`).getTime() + duration * 60000).toISOString().replace(/-|:|\.\d+/g, "");
    
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Appointment
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:Appointment with ${responseData?.customer || 'Customer'}
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

  return (
    <div className="min-h-screen bg-purple-100">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
        />
      )}
   
      <div className="max-w-4xl mx-auto px-4 pb-8 pt-12 ">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Appointment confirmed with {responseData?.customer}!
          </h1>
          <p className="text-gray-600">Your appointment has been successfully scheduled</p>
        </div>

        <div className="bg-purple-50 rounded-xl shadow-lg border border-gray-200 p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="rounded-lg p-1 flex-shrink-0">
                <div className="w-20 h-20 bg-white rounded flex items-center justify-center">
                  <img className="w-full h-full" src={appointmentData?.status === "cancelled" ? imgCheckCancel : imgCheckCircle} alt="" />
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-600">{appointmentData?.date} | {appointmentData?.time} GMT</span>
                </div>
                <p className="text-gray-600 mb-1 truncate block max-w-[150px]">{appointmentData?.interview_name}</p>
                <p className="text-sm text-gray-500">{appointmentData?.time_zone}</p>
               
                <div className="flex items-center space-x-4 mt-4">
                  {appointmentData?.status !== "cancelled" && (
                    <>
                      <button 
                        onClick={handleAddToCalendar}
                        className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors border-b border-blue-500 hover:border-blue-600"
                      >
                        <span className="text-sm font-medium">+ Add to Calendar</span>
                      </button>
                      
                      <button 
                        onClick={handleDownloadICS}
                        className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors border-b border-blue-500 hover:border-blue-600"
                      >
                        <span className="text-sm font-medium">Download as ICS</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <Link 
                    to={`${basePath}/appointmentConfirmation/summary?appid=${responseData?.id}`}
                    // state={{ appointmentData: responseData }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Booking Summary
                  </Link>
                  {appointmentData?.status !== "cancelled" && (
                    <>
                      <button
                        onClick={() => setIsRescheduleSidebarOpen(true)}
                        className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        Reschedule
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button 
                        onClick={() => setIsCancelModalOpen(true)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {double_book && double_book == 1 ? (
          <div className="text-center mb-12">
            <Link 
              to={`${basePath}`} 
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              <span>Book another appointment</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a href='https://appointroll.com' className='inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg ml-2'>To Site</a>
          </div>
        ) : ""}
      </div>

      <RescheduleSidebar
        isOpen={isRescheduleSidebarOpen}
        onClose={() => setIsRescheduleSidebarOpen(false)}
        appointmentData={responseData}
        onRescheduleSuccess={handleRescheduleSuccess}
      />

      <CancelConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        appointmentData={appointmentData}
        onCancelSuccess={handleCancelSuccess}
      />

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 border-2 border-white rounded-lg rotate-45"></div>
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xl font-bold">Appoint </span>
                </div>
                <span className="text-xl font-bold">Roll</span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-purple-100 mb-2">Powered by</p>
              </div>

              <h2 className="text-2xl font-bold mb-4">
                Simplify appointment scheduling for your business
              </h2>
              
              <p className="text-purple-100 leading-relaxed mb-6">
                With Appoint Roll, you can book more appointments without phone calls, back-and-forth emails, and 
                repetitive tasks. Let customers self-schedule while you grow your business.
              </p>
            </div>

            <div className="text-center md:text-right">
              <Link to="/" target="_blank" rel="noopener noreferrer" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl">
                Try for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}