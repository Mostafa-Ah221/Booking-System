import React, { useState } from "react";
import { X } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer } from "../../../../redux/apiCalls/CustomerCallApi";
import { customerAction } from "../../../../redux/slices/customersSlice";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const AddCustomerModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.customers.loading);
  const error = useSelector((state) => state.customers.error);

  const [formCustomerData, setFormCustomerData] = useState({
    name: "",
    email: "",
    code_phone: "",
    phone: "",
  });

  const [phoneValue, setPhoneValue] = useState("");

  if (!isOpen) return null;

  const clearForm = () => {
    setFormCustomerData({
      name: "",
      email: "",
      code_phone: "",
      phone: "",
    });
    setPhoneValue("");
    dispatch(customerAction.setError(null));
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormCustomerData((prev) => ({ ...prev, [name]: value }));

    if (error?.[name]) {
      dispatch(customerAction.setError({ ...error, [name]: undefined }));
    }
  };

const handlePhoneChange = (value, country) => {
  setPhoneValue(value);

  setFormCustomerData((prev) => ({
    ...prev,
    phone: value.replace(`+${country.dialCode}`, ""),
    code_phone: `+${country.dialCode}`,
  }));

  // التحقق حتى لو الرقم ناقص
  if (!value || value.length <= country.dialCode.length + 1) {
    dispatch(customerAction.setError({
      ...error,
      phone: "Please enter a valid phone number"
    }));
    return;
  }

  const phoneNumber = parsePhoneNumberFromString(value, country.countryCode?.toUpperCase());
  
  if (!phoneNumber || !phoneNumber.isValid()) {
    dispatch(customerAction.setError({
      ...error,
      phone: "The phone number is invalid for this country"
    }));
  } else {
    if (error?.phone) {
      dispatch(customerAction.setError({ ...error, phone: undefined }));
    }
  }
};


  const validateForm = () => {
    const newErrors = {};
    if (!formCustomerData.name) newErrors.name = "Name is required";
    if (!formCustomerData.email) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length > 0) {
      dispatch(customerAction.setError(newErrors));
      return false;
    }

    dispatch(customerAction.setError(null));
    return true;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    dispatch(customerAction.setLoading(true));

    const result = await dispatch(addCustomer(formCustomerData))

    dispatch(customerAction.setError(null));
    handleClose();

  } catch (error) {
    dispatch(customerAction.setError(error));
    console.error("Failed to add Client:", error);
  } finally {
    dispatch(customerAction.setLoading(false));
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Add Client</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formCustomerData.name}
              onChange={handleInputChange}
              placeholder="Enter Client name"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
            />
            {error?.name && <p className="text-red-500 text-sm">{error.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              name="email"
              value={formCustomerData.email}
              onChange={handleInputChange}
              type="email"
              placeholder="Enter email address"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
            />
            {error?.email && <p className="text-red-500 text-sm">{error.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              country="eg"
              value={phoneValue} // عرض الرقم الكامل فقط
              onChange={handlePhoneChange}
              enableSearch={true}
              searchPlaceholder="Search country"
              inputProps={{
                name: "phone",
                required: true,
                className: "!pl-16 w-full p-2 border rounded-lg outline-none",
                placeholder: "Enter mobile number"
              }}
              containerClass="w-full"
              inputClass="w-full p-2 border rounded-lg"
              buttonClass="!border-r !bg-gray-50 !px-3"
              dropdownClass="!bg-white !border !shadow-lg"
              searchClass="!p-2 !border-b"
            />
            {error?.phone && <p className="text-red-500 text-sm">{error.phone}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
 
    </div>
  );
};

export default AddCustomerModal;
