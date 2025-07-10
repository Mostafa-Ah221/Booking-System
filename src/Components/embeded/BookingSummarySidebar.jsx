import { X, Calendar, Clock } from 'lucide-react';

const BookingSummarySidebar = ({
  show,
  onClose,
  bookingData,
  selectedService,
  selectedDate,
  selectedTime,
  selectedTimezone,
  formData,
  onFormChange,
  onPhoneCodeChange,
  onScheduleAppointment,
  isBooking
}) => {
  if (!show) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Booking Summary</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {bookingData?.service_name || selectedService}
              </h3>
              <p className="text-sm text-gray-500">
                ( {bookingData?.duration || '1 hr'} | One on One )
              </p>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500 mr-3" />
              <span className="text-sm text-gray-700">{selectedDate} {selectedTime}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500 mr-3" />
              <span className="text-sm text-gray-700">{selectedTimezone}</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Please enter your details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => onFormChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => onFormChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <select
                    value={formData.code_phone}
                    onChange={(e) => onPhoneCodeChange(e.target.value)}
                    className="px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                  >
                    <option value="+20">🇪🇬 +20</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+31">🇳🇱 +31</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.phone}
                    onChange={(e) => onFormChange('phone', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onScheduleAppointment}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold mt-6 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!formData.name || !formData.email || !formData.phone || isBooking}
            >
              {isBooking ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Booking...
                </div>
              ) : (
                'Schedule Appointment'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSummarySidebar;