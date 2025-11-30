import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import {  createAppointment } from '../../../redux/apiCalls/AppointmentCallApi';
import DateTimeSelector from './DataTimeSections/DateTimeSelector';
import Select from 'react-select';
import moment from 'moment-timezone';
import toast from "react-hot-toast";

const RescheduleSidebar = ({ 
  isOpen, 
  onClose, 
  appointment = null,
  clientData = null,
  currentFilters = {}, 
  onRescheduleSuccess,
  onScheduleSuccess,
  fetchInterviews,
  rescheduleAppointment,
  fetchAppointments,
  interviews = [],
  mode = 'reschedule'
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [endTime, setEndTime] = useState(null); 
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState(null);
  const [showInterviewDropdown, setShowInterviewDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isInterviewsLoading, setIsInterviewsLoading] = useState(false);

  const dispatch = useDispatch();

  const timeZoneOptions = moment.tz.names().map((tz) => ({
    value: tz,
    label: tz,
  }));
  

  const isRescheduleMode = mode === 'reschedule' && appointment;
  const isScheduleMode = mode === 'schedule' && clientData;

  const getTitle = () => {
    return isRescheduleMode ? 'Reschedule Appointment' : 'Schedule New Appointment';
  };

  const getButtonText = () => {
    if (isProcessing) {
      return isRescheduleMode ? 'Rescheduling...' : 'Scheduling...';
    }
    return isRescheduleMode ? 'Reschedule Appointment' : 'Schedule Appointment';
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedTimeZone(null); 
      setError(null);
      setShowInterviewDropdown(false);
      setSelectedInterview(null);

      if (interviews?.length === 0 && !isInterviewsLoading) {
        setIsInterviewsLoading(true);
        dispatch(fetchInterviews(0)).finally(() => setIsInterviewsLoading(false));
      }

      if (isRescheduleMode && appointment?.interview_id) {
        const currentInterview = interviews.find((interview) => {
          return interview.id.toString() === appointment.interview_id.toString();
        });
        if (currentInterview) {
          setSelectedInterview(currentInterview);
        } else if (interviews?.length > 0) {
          setError('The related interview was not found for this appointment');
        } else {
          setError('Loading interviews...');
        }
      } else if (isRescheduleMode) {
        setError('Incomplete appointment data');
      }
    }
  }, [isOpen, appointment, interviews, mode, clientData, isRescheduleMode, isInterviewsLoading, dispatch]);

  const handleInterviewSelect = (interview) => {
    
    setSelectedInterview(interview);
   
    
    
    setSelectedDate(null);
    setSelectedTime(null);
    setShowInterviewDropdown(false);
    setError(null);
  };

  const handleTimeZoneSelect = (selectedOption) => {
    setSelectedTimeZone(selectedOption ? selectedOption.value : null);
  };
console.log(appointment);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedInterview || !selectedTimeZone) {
      setError('Please select date, time, interview, and time zone');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formattedDate = selectedDate.toLocaleDateString('en-CA');
    const formattedTime = selectedTime;

    try {
      let result;
      
      if (isRescheduleMode) {
        const rescheduleData = {
          date: formattedDate,
          time: formattedTime,
          end_time: selectedInterview?.type === "resource" ? endTime : null,
          time_zone: selectedTimeZone,
        };
        console.log(rescheduleData);
        
        result = await dispatch(rescheduleAppointment(appointment.id, rescheduleData));
      } else if (isScheduleMode) {
        const scheduleData = {
          date: formattedDate,
          time: formattedTime,
          end_time: selectedInterview?.type === "resource" ? endTime : null,
          interview_id: selectedInterview.id,
          time_zone: selectedTimeZone,
        };
        result = await dispatch(createAppointment(clientData.id, scheduleData));
      }

      if (result && result.success) {
        const successMessage = isRescheduleMode 
          ? 'The appointment has been successfully rescheduled'
          : 'The appointment has been successfully scheduled';
        
        onClose();
        
        if (isRescheduleMode && onRescheduleSuccess) {
          onRescheduleSuccess();
        } else if (isScheduleMode && onScheduleSuccess) {
          onScheduleSuccess();
        } else {
          setTimeout(async () => {
            const broadFilters = {
              ...currentFilters,
              from_date: null,
              to_date: null,
              status: null,
            };
            await dispatch(fetchAppointments(broadFilters));
          }, 1000);
        }
      } else {
        const errorMessage = `Failed to ${isRescheduleMode ? 'reschedule' : 'schedule'}: ${result.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = `An unexpected error occurred while trying to ${isRescheduleMode ? 'reschedule' : 'schedule'} the appointment`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const currentClient = isRescheduleMode ? appointment : clientData;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 p-6 overflow-y-auto">
            {isInterviewsLoading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600">Loading interviews...</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="text-xs text-red-500 hover:text-red-700 mt-1"
                >
                  Hide
                </button>
              </div>
            )}

            {/* Select Interview */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Interview</h3>
              <div className="relative">
                <button
                  onClick={() => isScheduleMode && setShowInterviewDropdown(!showInterviewDropdown)}
                  className={`w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between transition-colors ${
                    isRescheduleMode ? 'cursor-not-allowed bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  disabled={isRescheduleMode}
                >
                  <div className="flex items-center gap-3">
                    {selectedInterview ? (
                      <>
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {selectedInterview.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium truncate block max-w-[150px]">{selectedInterview.name}</div>
                          <div className="text-sm text-gray-500">
                            {selectedInterview.duration ? `${selectedInterview.duration} mins` : ''}
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500">Select an interview</span>
                    )}
                  </div>
                </button>

                {showInterviewDropdown && isScheduleMode && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {interviews?.map((interview) => (
                      <button
                        key={interview.id}
                        onClick={() => handleInterviewSelect(interview)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {interview.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium truncate  max-w-[150px]">{interview.name}</div>
                          <div className="text-sm text-gray-500">
                            {interview.duration ? `${interview.duration} mins` : ''}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Time Zone */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Time Zone</h3>
              <Select
                options={timeZoneOptions}
                value={timeZoneOptions.find((option) => option.value === selectedTimeZone)}
                onChange={handleTimeZoneSelect}
                placeholder="Select a time zone"
                className="w-full"
                classNamePrefix="select"
                isClearable
              />
            </div>

            {selectedInterview && (
              <DateTimeSelector
                selectedInterview={selectedInterview}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedEndTime={endTime} 
                onDateSelect={setSelectedDate}
                onTimeSelect={setSelectedTime}
                onEndTimeSelect={setEndTime} 
                appointment={appointment}
                mode={mode}
              />
            )}

            {currentClient && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Client</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {currentClient.name?.substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium truncate  max-w-[150px]">{currentClient.name}</div>
                    <div className="text-sm text-gray-500">{currentClient.email}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  defaultChecked
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Send updates to client</span>
              </label>
            </div>
          </div>

          <div className="p-6 border-t bg-white sticky bottom-0">
            <button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || !selectedInterview || !selectedTimeZone || isProcessing}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedDate && selectedTime && selectedInterview && selectedTimeZone && !isProcessing
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RescheduleSidebar;
