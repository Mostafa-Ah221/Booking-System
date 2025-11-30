import { X, Calendar, Clock } from 'lucide-react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useState } from 'react';

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
  onScheduleAppointment,
  isBooking,
   shareId ,
   selectedType,
   totalPrice,
   numberOfSlots,
}) => {
  const [phoneValue, setPhoneValue] = useState(
    formData.code_phone && formData.phone 
      ? `${formData.code_phone}${formData.phone}` 
      : ""
  );
  const [phoneError, setPhoneError] = useState("");

  if (!show) return null;
console.log(bookingData);

  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);

    // Update form data with separated phone code and phone number
    onFormChange('phone', value.replace(`+${country.dialCode}`, ""));
    onFormChange('code_phone', `+${country.dialCode}`);

    // Validate phone number
    if (!value || value.length <= country.dialCode.length + 1) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(value, country.countryCode?.toUpperCase());
    
    if (!phoneNumber || !phoneNumber.isValid()) {
      setPhoneError("The phone number is invalid for this country");
    } else {
      setPhoneError("");
    }
  };


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
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
              {bookingData?.photo ? (
                <img
                  src={bookingData.photo}
                  alt="Booking"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {bookingData?.name?.charAt(0) || "?"}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                {bookingData?.service_name || selectedService}
              </h3>
              <p className="text-sm text-gray-500">
                ( {bookingData?.duration} )
              </p>
            </div>
          </div>

          <div className="mb-6 space-y-3 flex gap-7 items-center">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500 mr-3" />
              <span className="text-sm text-gray-700">{selectedDate} {selectedTime}</span>
            </div>
            
            <div className="flex items-center !m-0">
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
        className="w-full p-3 border border-gray-300 rounded-sm focus focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
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
        className="w-full p-3 border border-gray-300 rounded-sm focus focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Contact Number 
      </label>
      <div>
        <PhoneInput
          country="eg"
          value={phoneValue}
          onChange={handlePhoneChange}
          enableSearch={true}
          searchPlaceholder="Search country"
          inputProps={{
            name: "phone",
            className: "!pl-16 w-full py-3 px-4 border border-gray-300 rounded-sm outline-none focus focus:ring-pink-500 focus:border-pink-500 transition-all duration-200",
            placeholder: "Enter your mobile number"
          }}
          containerClass="w-full"
          buttonClass="!border-r !bg-gray-50 !px-3 !py-3 !rounded-l-sm !border-gray-300"
          dropdownClass="!bg-white !border !shadow-lg !rounded-sm !mt-1 !z-[9999] relative bottom-7"
          searchClass="!p-3 !border-b !border-gray-200"
        />
        {phoneError && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {phoneError}
          </p>
        )}
      </div>
    </div>

    {/* إضافة حقل العنوان */}
    {(bookingData?.inperson_mode === 'athome' || selectedType === 'athome') && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Address <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      placeholder="Enter your address"
      value={formData.address}
      onChange={(e) => onFormChange('address', e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-sm focus focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
    />
  </div>
)}
   
    {bookingData?.price && bookingData?.price > 0 && (
  <div>
    <div className="block text-sm font-medium text-gray-700 mb-2 border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Payment Amount</span>
        <span className="font-bold  text-pink-600">
          {bookingData?.require_end_time && totalPrice > 0 
            ? `${totalPrice} ${bookingData.currency}` 
            : `${bookingData.price} ${bookingData.currency}`
          }
        </span>
      </div>
      
      {bookingData?.require_end_time && totalPrice > 0 && (
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          {numberOfSlots} slot{numberOfSlots > 1 ? 's' : ''} × {bookingData.price} {bookingData.currency} per slot
        </div>
      )}
    </div>
  </div>
)}
      
      
    
   
  </div>


  <button
    onClick={onScheduleAppointment}
    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-sm font-semibold mt-6 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
disabled={
  !formData.name || 
  !formData.email || 
 
  phoneError || 
    ((bookingData?.inperson_mode === 'athome' || selectedType === 'athome') && !formData.address) || 
    isBooking
  }
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