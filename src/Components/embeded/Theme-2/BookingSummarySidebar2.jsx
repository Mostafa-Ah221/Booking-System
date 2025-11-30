import { Calendar, Clock } from 'lucide-react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useState } from 'react';

const BookingSummarySidebar2 = ({
  bookingData,
  selectedService,
  selectedDate,
  selectedTime,
  selectedTimezone,
  formData,
  onFormChange,
  onScheduleAppointment,
  isBooking,
  shareId,
  selectedType,
  totalPrice,
  numberOfSlots,
   themeColor
}) => {
  const [phoneValue, setPhoneValue] = useState(
    formData.code_phone && formData.phone 
      ? `${formData.code_phone}${formData.phone}` 
      : ""
  );
  const [phoneError, setPhoneError] = useState("");

const colors = themeColor ? JSON.parse(themeColor) : {};
  const primary = colors?.primary || "";
  const [firstColor, secondColor] = primary.split("-");
  const textColor = colors?.text_color;
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
    <div className=" rounded-lg p-5">
      <h2 className=" font-semibold text-gray-800 mb-6 pb-4 text-center" style={{ color: textColor }}>
        Please enter your details
      </h2>
      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium  mb-2" style={{ color: textColor }}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            className="w-full p-3 bg-transparent border border-gray-300 rounded-sm outline-none transition-colors"
            style={{color:textColor}}
          />
        </div>
        
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium  mb-2" style={{ color: textColor }}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            className="w-full p-3 bg-transparent border border-gray-300 rounded-sm  outline-none transition-colors"
            style={{color:textColor}}
          />
        </div>
        
        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>
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
                className: "!pl-16 w-full bg-transparent py-3 px-4 border border-gray-300 rounded-sm outline-none transition-all duration-200",
                placeholder: "Enter your mobile number"
              }}
              containerClass="w-full bg-transparent"
              buttonClass="!border-r  !bg-transparent !px-3 !py-3 !rounded-l-sm !border-gray-300"
              dropdownClass="!bg-white !border !shadow-lg !rounded-lg !mt-1 !z-[9999]"
              searchClass="!p-3 !border-b !border-gray-200"
              style={{ color: textColor }}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {phoneError}
              </p>
            )}
          </div>
        </div>

        {/* Address Field - Conditional */}
        {(bookingData?.inperson_mode === 'athome' || selectedType === 'athome') && (
          <div>
            <label className="block text-sm font-medium  mb-2" style={{ color: textColor }}>
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) => onFormChange('address', e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-300 rounded-ms  outline-none transition-colors"
              style={{ color: textColor }}
            />
          </div>
        )}
        
        {/* Price Info - Conditional */}
        {bookingData?.price && bookingData?.price > 0 && (
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2 border border-gray-300 rounded-sm p-4 bg-black/15">
              <div className="flex  justify-between items-center">
                <span style={{color:textColor}}>Payment Amount</span>
                <span className="font-bold " style={{color:firstColor}}>
                  {bookingData?.require_end_time && totalPrice > 0 
                    ? `${totalPrice} ${bookingData.currency}` 
                    : `${bookingData.price} ${bookingData.currency}`
                  }
                </span>
              </div>
              
              {bookingData?.require_end_time && totalPrice > 0 && (
                <div className="text-xs  mt-2 pt-2 border-t border-gray-200" style={{color:textColor}}>
                  {numberOfSlots} slot{numberOfSlots > 1 ? 's' : ''} × {bookingData.price} {bookingData.currency} per slot
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
  onClick={onScheduleAppointment}
  className="
    w-full 
    py-3 
    rounded-sm
    font-semibold 
    mt-6 
    transition-all 
    shadow-md
    disabled:cursor-not-allowed
  "
  style={{
    background: isBooking || 
      !formData.name || 
      !formData.email || 
      phoneError || 
      ((bookingData?.inperson_mode === 'athome' || selectedType === 'athome') && !formData.address)
      ? `${firstColor}88`  
      : firstColor,        
    color: secondColor,
    filter: isBooking || 
      !formData.name || 
      !formData.email || 
      phoneError || 
      ((bookingData?.inperson_mode === 'athome' || selectedType === 'athome') && !formData.address)
      ? "blur(0.8px)" : "none",
  }}
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
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-2" 
           style={{ borderColor: secondColor }}>
      </div>
      Booking...
    </div>
  ) : (
    'Schedule Appointment'
  )}
</button>
    </div>
  );
};

export default BookingSummarySidebar2;