import { Calendar, Clock, MapPin, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import CalendarModal from './calender';
import TimeSelectionModal from './teime';
import BookingSummarySidebar from './BookingSummarySidebar';
import Loader from '../Loader';
import { useNavigate, useParams } from 'react-router-dom';
import TimezoneSelect from 'react-timezone-select';

import useBookingLogic from './useBookingLogic';

const AppointmentBookingCustomer = () => {
  const { idCustomer } = useParams();
  const navigate = useNavigate();

  // State for interviews
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [showInterviewDropdown, setShowInterviewDropdown] = useState(false);

  console.log('idCustomer:', idCustomer);

  const {
    bookingData,
    loading,
    error,
    selectedDate,
    selectedTime,
    selectedTimezone,
    formData,
    showBookingSummary,
    showTimeModal,
    showCalendarModal,
    isBooking,
    setSelectedDate,
    setSelectedTime,
    setSelectedTimezone,
    setFormData,
    setShowBookingSummary,
    setShowTimeModal,
    setShowCalendarModal,
    handleBookAppointment,
    handleScheduleAppointment,
    isTimeDisabled
  } = useBookingLogic(idCustomer, navigate);

  // Fetch interviews
  useEffect(() => {
    if (idCustomer) {
      fetchInterviews();
    }
  }, [idCustomer]);

  const fetchInterviews = async () => {
    setInterviewsLoading(true);
    try {
      const response = await fetch(`https://backend-booking.appointroll.com/api/public/company/interviews/${idCustomer}`);
      const data = await response.json();
      if (data.data && data.data.interviews) {
        setInterviews(data.data.interviews);
        if (data.data.interviews.length > 0) {
          setSelectedInterview(data.data.interviews[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setInterviewsLoading(false);
    }
  };

  const handlePhoneCodeChange = (code) => {
    setFormData({ ...formData, code_phone: code });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setShowInterviewDropdown(false);
  };

  if (loading || interviewsLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg"><Loader /></div>
      </div>
    );
  }

  

  const isBookButtonDisabled = !selectedDate || !selectedTime || isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) || !selectedInterview;

  return (
    <div className="min-h-screen bg-gray-100 !text-sm">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              xmlSpace="preserve"
              width={37}
            >
              <path
                fill="#226DB4"
                d="M995.8,249.6c-16.5-39.1-40.2-74.3-70.4-104.5S860,91.3,820.9,74.7c-13-5.5-26.3-10.1-39.8-13.9V32.9  c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9v17.2c-9.4-0.8-18.9-1.2-28.4-1.2h-301c-16.5,0-29.9,13.4-29.9,29.9  c0,16.5,13.4,29.9,29.9,29.9H693c9.6,0,19,0.5,28.4,1.5v15.3c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9v-2  c37.9,13.1,72.7,34.8,102,64c50.8,50.8,78.8,118.3,78.8,190.1v315.4c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8  h-73c-16.5,0-29.9,13.4-29.9,29.9s13.4,29.9,29.9,29.9h73c44.4,0,87.4-8.7,127.9-25.8c39.1-16.5,74.3-40.2,104.5-70.4  s53.9-65.3,70.4-104.5c17.2-40.5,25.8-83.6,25.8-127.9V377.5C1021.6,333.2,1012.9,290.1,995.8,249.6z"
              />
              <path
                fill="#226DB4"
                d="M659.6,692.6c0-44.4-8.7-87.4-25.8-127.9c-11.1-26.2-25.4-50.7-42.7-73l-43.9,40.9c34.2,46,52.7,101.6,52.7,160  c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8s-139.3-28-190.1-78.8c-50.8-50.8-78.8-118.3-78.8-190.1  s28-139.3,78.8-190.1c50.8-50.8,118.3-78.8,190.1-78.8c65.1,0,126.7,23,175.4,65.1l43.9-40.9c-27.1-24.4-57.8-43.9-91.4-58.1  c-40.5-17.2-83.6-25.8-127.9-25.8s-87.4,8.7-127.9,25.8c-39.1,16.5-74.3,40.2-104.5,70.4c-13.5,13.5-25.7,28-36.5,43.3v-126  c0-62.6,22-123.5,61.8-171.6c31.4-37.9,72.7-66.4,118.6-82.4v1.2c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9V84.9  c0-0.1,0-0.3,0-0.4V32.3c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9V61c-64,17.9-121.8,55.2-164.6,106.8  c-23.9,28.9-42.6,61.3-55.5,96.3C9.1,300.4,2.4,338.5,2.4,377.5v315.4c0,44.4,8.7,87.4,25.8,127.9c16.5,39.1,40.2,74.3,70.4,104.5  c30.2,30.2,65.3,53.9,104.5,70.4c40.5,17.2,83.6,25.8,127.9,25.8c1.6,0,3.2-0.1,4.8-0.4c42.6-0.6,84-9.2,123.1-25.8  c39.1-16.5,74.3-40.2,104.5-70.4s53.9-65.3,70.4-104.5C651,780,659.6,736.9,659.6,692.6z"
              />
              <path
                fill="#089949"
                d="M332.4,650.7l-76.3-81.4c-11.3-12-30.2-12.7-42.2-1.4c-12,11.3-12.6,30.2-1.4,42.2l96.6,103.1  c5.9,6.3,13.8,9.5,21.8,9.5c7.3,0,14.6-2.7,20.3-8l195.8-182.3l43.9-40.9l56.8-52.9c12.1-11.2,12.8-30.2,1.5-42.2  c-11.2-12.1-30.1-12.8-42.2-1.5l-56.8,52.9l-43.9,40.9L332.4,650.7z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">
              Book Your Appointment
            </h1>
          </div>
          <p className="text-gray-600 text-[16px]">
            Book your appointment in a few simple steps: Choose an interview, pick your date and time, and fill in your details. See you soon!
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Booking: {bookingData?.name || 'Loading...'}
          </div>
        </div>

        {/* Interview, Provider, and Date Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Interview Selection Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-600 mr-3" />
                <h3 className="font-semibold text-gray-800">
                  {selectedInterview ? selectedInterview.name : 'Select Interview...'}
                </h3>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transform transition-transform ${
                  showInterviewDropdown ? 'rotate-180' : ''
                }`}
                onClick={() => setShowInterviewDropdown(!showInterviewDropdown)}
              />
            </div>
            {showInterviewDropdown && (
              <div className="relative">
                <div className="absolute top-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                  {interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleInterviewSelect(interview)}
                    >
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-600 mr-3" />
                        <span className="text-gray-800">{interview.name}</span>
                      </div>
                    </div>
                  ))}
                  {interviews.length === 0 && (
                    <div className="p-3 text-gray-500 text-center">
                      No interviews available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Provider Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center h-full">
              <div className="w-full flex justify-between items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {bookingData?.photo ? (
                    <img
                      src={bookingData.photo}
                      alt="Provider"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {bookingData?.provider_name || 'Provider'}
                </h3>
                <span></span>
              </div>
            </div>
          </div>

          {/* Date Card */}
          <div
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowCalendarModal(true)}
          >
            <div className="flex items-center justify-between h-full">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">{selectedDate || 'Select Date'}</h3>
              <span></span>
            </div>
          </div>
        </div>

        {/* Booking Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-start mb-2 w-full">
              <MapPin className="h-5 text-gray-600 mr-14 w-[20%] text-left" />
              <TimezoneSelect
                value={selectedTimezone}
                onChange={(timezone) => setSelectedTimezone(timezone.value)}
                className="react-timezone-select w-full"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: 'none',
                    boxShadow: 'none',
                    width: '100%',
                    '&:hover': {
                      border: 'none',
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    width: '100%',
                  }),
                }}
              />
            </div>
          </div>

          <div
            className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center ${
              selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                ? 'border-2 border-red-300 bg-red-50'
                : ''
            }`}
            onClick={() => setShowTimeModal(true)}
          >
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Time</h3>
            </div>
            <div
              className={`text-lg font-semibold ${
                selectedTime && isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                  ? 'text-red-600 line-through'
                  : 'text-gray-800'
              }`}
            >
              {selectedTime || 'Select Time'}
              {selectedTime &&
                isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times) && (
                  <span className="text-xs text-red-500 ml-2 font-normal">(Booked)</span>
                )}
            </div>
            <span></span>
          </div>

          <div className="bg-white rounded-lg shadow-sm p flex items-center justify-center">
            <button
              onClick={handleBookAppointment}
              disabled={isBookButtonDisabled}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg w-full h-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {!selectedDate || !selectedTime
                ? 'Select Date & Time'
                : isTimeDisabled(selectedDate, selectedTime, bookingData?.disabled_times)
                  ? 'Time Not Available'
                  : !selectedInterview
                    ? 'Select Interview'
                    : 'Book Appointment'}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CalendarModal
        show={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        availableDates={bookingData?.available_dates || []}
        unavailableDates={bookingData?.unavailable_dates || []}
        disabledTimes={bookingData?.disabled_times || []}
        availableTimes={bookingData?.available_times || []}
        availableTimesFromAPI={bookingData?.raw_available_times || []}
        unavailableTimes={bookingData?.unavailable_times || []}
      />

      <TimeSelectionModal
        show={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        availableTimes={bookingData?.available_times || []}
        unavailableTimes={bookingData?.unavailable_times || []}
        selectedDate={selectedDate}
        disabledTimes={bookingData?.disabled_times || []}
        unavailableDates={bookingData?.unavailable_dates || []}
      />

      <BookingSummarySidebar
        show={showBookingSummary}
        onClose={() => setShowBookingSummary(false)}
        bookingData={{ ...bookingData, selectedInterview }}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedTimezone={selectedTimezone}
        formData={formData}
        onFormChange={handleFormChange}
        onPhoneCodeChange={handlePhoneCodeChange}
        onScheduleAppointment={handleScheduleAppointment}
        isBooking={isBooking}
      />
    </div>
  );
};

export default AppointmentBookingCustomer;