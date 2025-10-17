import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, ChevronDown, Calendar, Clock, User, Mail } from 'lucide-react';
import { getCustomers } from '../../../redux/apiCalls/CustomerCallApi';
import { createAppointment, fetchAppointments } from '../../../redux/apiCalls/AppointmentCallApi';
import DateTimeSelector from './DateTimeSelector';
import toast from 'react-hot-toast';

const AddAppointment = ({ 
  mode = 'schedule', 
  isOpen = true, 
  onClose = () => {},
  onScheduleSuccess = () => {}
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null); // أضف state لـ selectedStaff
  const [showInterviewDropdown, setShowInterviewDropdown] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [sendUpdates, setSendUpdates] = useState(true);
  
  const { interviews = [] } = useSelector(state => state.interview);
  const { customers: { clients = [], loading = false } = {} } = useSelector(state => state.customers);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedStaff(null); // أضف reset لـ selectedStaff عند اختيار interview جديد
    setShowInterviewDropdown(false);
    setError(null);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDropdown(false);
    setError(null);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff); // تحديث selectedStaff
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedInterview || !selectedCustomer) {
      setError('Please select customer, interview, date and time');
      return;
    }

    // لو فيه staff، لازم تتأكد إن selectedStaff مش فاضي
    if (selectedInterview?.staff?.length > 0 && !selectedStaff) {
      setError('Please select a staff member');
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    
    const [hours, minutes] = selectedTime.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);
    
    if (selectedDateTime <= now) {
      setError('Cannot schedule appointments in the past. Please select a future date and time.');
      toast.error('Please select a future date and time', {
        position: 'top-center',
        duration: 4000,
        icon: '⏰',
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
          padding: '12px 16px',
          fontWeight: '500',
        },
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const formattedDate = selectedDate.getFullYear() + 
        '-' + 
        String(selectedDate.getMonth() + 1).padStart(2, '0') + 
        '-' + 
        String(selectedDate.getDate()).padStart(2, '0');
      const appointmentData = {
        interview_id: selectedInterview.id,
        date: formattedDate, 
        time: selectedTime, 
        send_notifications: sendUpdates,
        time_zone: 'Africa/Cairo', 
        staff_id: selectedStaff?.id // أضف staff_id لو موجود
      };
      
      // التأكد من وجود customer ID
      if (!selectedCustomer.id) {
        throw new Error('Customer ID is missing');
      }
      
      // استدعاء createAppointment function
      const result = await dispatch(createAppointment(selectedCustomer.id, appointmentData));
      
      if (result.success) {
        dispatch(fetchAppointments());
        setIsProcessing(false);
        onScheduleSuccess();
        
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedInterview(null);
        setSelectedCustomer(null);
        setSelectedStaff(null); // reset selectedStaff
        
        onClose();
      } else {
        throw new Error(result.message || 'Failed to create appointment');
      }
    } catch (err) {
      setIsProcessing(false);
      
      const errorMessage = err.message || 'Failed to schedule appointment. Please try again.';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        position: 'top-center',
        duration: 5000,
        icon: '❌',
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
          padding: '12px 16px',
          fontWeight: '500',
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-full md:w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white">
          <h2 className="text-lg font-semibold">Schedule New Appointment</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error Display */}
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

          {/* Customer Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <User size={16} />
              Select Customer
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {selectedCustomer ? (
                    <>
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {selectedCustomer.name?.substring(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{selectedCustomer.name}</div>
                        <div className="text-sm text-gray-500">{selectedCustomer.email}</div>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500">Select a customer</span>
                  )}
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showCustomerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading customers...</div>
                  ) : clients && clients.length > 0 ? (
                    clients.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => handleCustomerSelect(customer)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {customer.name?.substring(0, 1).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No customers found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interview Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              Select Interview
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowInterviewDropdown(!showInterviewDropdown)}
                className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {selectedInterview ? (
                    <>
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {selectedInterview.name?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{selectedInterview.name}</div>
                        <div className="text-sm text-gray-500">
                          {selectedInterview.duration ? `${selectedInterview.duration} mins` : ''}
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500">Select an interview</span>
                  )}
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showInterviewDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {interviews && interviews.length > 0 ? (
                    interviews.map((interview) => (
                      <button
                        key={interview.id}
                        onClick={() => handleInterviewSelect(interview)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {interview.name?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{interview.name}</div>
                          <div className="text-sm text-gray-500">
                            {interview.duration ? `${interview.duration} mins` : ''}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No interviews available</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date & Time Selector */}
          {selectedInterview && (
            <DateTimeSelector
              selectedInterview={selectedInterview}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              onStaffSelect={handleStaffSelect} // أضف prop لتمرير selectedStaff
              mode={mode}
            />
          )}

          {/* Selected Details Summary */}
          {(selectedCustomer || selectedInterview || selectedDate || selectedTime || selectedStaff) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Appointment Summary</h3>
              
              {selectedCustomer && (
                <div className="flex items-center gap-3 mb-3">
                  <User size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Customer</div>
                    <div className="text-sm text-gray-600">{selectedCustomer.name} ({selectedCustomer.email})</div>
                  </div>
                </div>
              )}
              
              {selectedInterview && (
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Interview Type</div>
                    <div className="text-sm text-gray-600">{selectedInterview.name} ({selectedInterview.duration} mins)</div>
                  </div>
                </div>
              )}
              
              {selectedStaff && (
                <div className="flex items-center gap-3 mb-3">
                  <User size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Staff</div>
                    <div className="text-sm text-gray-600">{selectedStaff.name}</div>
                  </div>
                </div>
              )}
              
              {(selectedDate || selectedTime) && (
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Time Slot</div>
                    <div className="text-sm text-gray-600">
                      {selectedDate && selectedDate.toLocaleDateString()} 
                      {selectedTime && ` at ${selectedTime}`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notification Checkbox */}
          {/* <div className="mb-6">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={sendUpdates}
                onChange={(e) => setSendUpdates(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Send confirmation and updates to client</span>
            </label>
          </div> */}
        </div>

        {/* Fixed Bottom Section */}
        <div className="border-t bg-white p-6">
          <button
            onClick={handleSubmit}
            disabled={
              !selectedDate ||
              !selectedTime ||
              !selectedInterview ||
              !selectedCustomer ||
              (selectedInterview?.staff?.length > 0 && !selectedStaff) || // أضف الشرط الخاص بـ staff
              isProcessing
            }
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
              selectedDate && selectedTime && selectedInterview && selectedCustomer && (!selectedInterview?.staff?.length || selectedStaff) && !isProcessing
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scheduling...
              </>
            ) : (
              'Schedule Appointment'
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddAppointment;