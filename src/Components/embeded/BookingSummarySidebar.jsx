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

  const DEFAULT_COLORS = {
  primary: "#ffffff-rgb(241 82 179)",
  text_color: "#111827",
};

let apiColors = {};

try {
  apiColors = themeColor?.colors ? JSON.parse(themeColor.colors) : {};
} catch {
  apiColors = {};
}


const colors =
  themeColor?.theme === "theme2"
    ? { ...DEFAULT_COLORS, ...apiColors }
    : DEFAULT_COLORS;

const primary = colors.primary ?? DEFAULT_COLORS.primary;

const [firstColor, secondColor] =
  primary?.includes("-")
    ? primary.split("-")
    : [primary, primary];


const textColor = colors.text_color;

  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);

    const dialCode = `+${country.dialCode}`;
    const phoneWithoutCode = value.replace(country.dialCode, '').trim();

    onFormChange('phone', phoneWithoutCode);  
    onFormChange('code_phone', dialCode);

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

  const renderPaymentDetails = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

  if (!show) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full max-w-md shadow-2xl z-50 overflow-y-auto" style={{ background: firstColor }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `1px solid ${textColor}20` }}>
            <h2 className="text-xl font-semibold" style={{ color: textColor }}>
              Booking Summary
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-black/10"
            >
              <X className="w-5 h-5" style={{ color: textColor }} />
            </button>
          </div>

          {/* Service Info */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 overflow-hidden" style={{ background: firstColor }}>
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
              <h3 className="font-semibold truncate max-w-[150px]" style={{ color: textColor }}>
                {bookingData?.service_name || selectedService}
              </h3>
              <p className="text-sm" style={{ color: `${textColor}60` }}>
                ( {bookingData?.duration} )
              </p>
            </div>
          </div>

          {/* Date & Time Info */}
          <div className="mb-6 space-y-3 flex gap-7 items-center">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-3" style={{ color: `${textColor}60` }} />
              <span className="text-sm" style={{ color: textColor }}>{selectedDate} {selectedTime}</span>
            </div>
            
            <div className="flex items-center !m-0">
              <Clock className="w-4 h-4 mr-3" style={{ color: `${textColor}60` }} />
              <span className="text-sm" style={{ color: textColor }}>{selectedTimezone}</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="pt-6" style={{ borderTop: `1px solid ${textColor}20` }}>
            <h3 className="font-semibold mb-4" style={{ color: textColor }}>
              Please enter your details
            </h3>
            
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => onFormChange('name', e.target.value)}
                  className="w-full p-3 rounded-lg outline-none transition-all"
                  style={{ 
                    border: `1px solid ${textColor}20`,
                    background: `${textColor}05`,
                    color: textColor
                  }}
                />
              </div>
              
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => onFormChange('email', e.target.value)}
                  className="w-full p-3 rounded-lg outline-none transition-all"
                  style={{ 
                    border: `1px solid ${textColor}20`,
                    background: `${textColor}05`,
                    color: textColor
                  }}
                />
              </div>
              
              {/* Phone Input */}
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
                      className: "!pl-16 w-full py-3 px-4 rounded-lg outline-none transition-all",
                      placeholder: "Enter your mobile number",
                      style: {
                        border: `1px solid ${textColor}20`,
                        background: `${textColor}05`,
                        color: textColor
                      }
                    }}
                    containerClass="w-full"
                    buttonClass="!border-r !px-3 !py-3 !rounded-l-lg"
                    buttonStyle={{
                      background: `${textColor}10`,
                      borderColor: `${textColor}20`
                    }}
                    dropdownClass="!bg-white !border !shadow-lg !rounded-lg !mt-1 !z-[9999] relative bottom-7"
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

              {/* Address Input (conditional) */}
              {(bookingData?.inperson_mode === 'athome' || selectedType === 'athome') && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => onFormChange('address', e.target.value)}
                    className="w-full p-3 rounded-lg outline-none transition-all"
                    style={{ 
                      border: `1px solid ${textColor}20`,
                      background: `${textColor}05`,
                      color: textColor
                    }}
                  />
                </div>
              )}
              
              {/* Payment Amount */}
              {bookingData?.price && bookingData?.price > 0 && (
                <div>
                  <div className="block text-sm font-medium mb-2 p-4 rounded-lg" style={{ 
                    border: `1px solid ${textColor}20`,
                    background: `${textColor}05`
                  }}>
                    <div className="flex justify-between items-center">
                      <span style={{ color: textColor }}>Payment Amount</span>
                      <span className="font-bold" style={{ color: textColor }}>
                        {bookingData?.require_end_time && totalPrice > 0 
                          ? `${totalPrice} ${bookingData.currency}` 
                          : `${bookingData.price} ${bookingData.currency}`
                        }
                      </span>
                    </div>
                    
                    {bookingData?.require_end_time && totalPrice > 0 && (
                      <div className="text-xs mt-2 pt-2" style={{ 
                        color: `${textColor}60`,
                        borderTop: `1px solid ${textColor}20`
                      }}>
                        {numberOfSlots} slot{numberOfSlots > 1 ? 's' : ''} × {bookingData.price} {bookingData.currency} per slot
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Payment Details */}
              {bookingData?.payment_details && (
                <div className="block text-sm font-medium mb-2 rounded-lg p-4" style={{ 
                  border: `1px solid ${textColor}20`,
                  background: `${textColor}05`
                }}>
                  <div className="flex flex-col justify-between items-start gap-1">
                    <span style={{ color: textColor }}>Payment Details</span>
                    <span className="font-bold" style={{ color: textColor }}>
                    {renderPaymentDetails(bookingData?.payment_details)}
                  </span>

                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={onScheduleAppointment}
              disabled={
                !formData.name || 
                !formData.email || 
                phoneError || 
                ((bookingData?.inperson_mode === 'athome' || selectedType === 'athome') && !formData.address) || 
                isBooking
              }
              className="w-full py-3 rounded-lg font-semibold mt-6 transition-all shadow-md disabled:cursor-not-allowed text-white"
              style={{ 
                background: secondColor,
                opacity: (!formData.name || !formData.email || phoneError || 
                  ((bookingData?.inperson_mode === 'athome' || selectedType === 'athome') && !formData.address) || 
                  isBooking) ? 0.5 : 1
              }}
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