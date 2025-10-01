import { useState, useEffect } from "react";
import { ChevronLeft, Calendar, Trash2, Edit2, User, Briefcase, Clock, Phone } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerById, updateCustomer } from "../../../redux/apiCalls/CustomerCallApi";
import { customerAction } from "../../../redux/slices/customersSlice";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {fetchAppointments} from '../../../redux/apiCalls/AppointmentCallApi';
import RescheduleSidebar from "../../Dashboard/Appointments/RescheduleSidebar";
import { usePermission } from "../../hooks/usePermission";

const EditCustomer = ({ customerId, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    code_phone: "+20",
    phone: 0,
  });
  
  const [phoneValue, setPhoneValue] = useState("");
  
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [clientData, setClientData] = useState(null);

  const dispatch = useDispatch();
  const { customer, loading, error } = useSelector(state => state.customers);
  const { appointments } = useSelector((state) => state.appointments);

  useEffect(() => {
    if (customerId) {
      dispatch(fetchAppointments({ client_id: customerId }));
    }
  }, [customerId, dispatch]);
  useEffect(() => {
    if (customerId) {
      dispatch(getCustomerById(customerId));
    }
  }, [customerId, dispatch]);


  useEffect(() => {
    console.log('Customer data from Redux:', customer);
    if (customer) {
      const customerData = {
        name: customer?.client.name || "",
        email: customer?.client.email || "",
        phone: customer?.client.phone || "",
        code_phone: customer?.client.code_phone || "+20"
      };
      setEditData(customerData);
      
      const fullPhone = customerData.code_phone && customerData.phone 
        ? `${customerData.code_phone}${customerData.phone}`
        : "";
      setPhoneValue(fullPhone);
    }
  }, [customer]);

  const handleSave = () => {
    
    dispatch(updateCustomer(customerId, editData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (customer) {
      const customerData = {
        name: customer?.client.name || "",
        email: customer.client.email || "",
        phone: customer.client.phone || "",
        code_phone: customer?.client.code_phone || "+20"
      };
      setEditData(customerData);
      
      const fullPhone = customerData.code_phone && customerData.phone 
        ? `${customerData.code_phone}${customerData.phone}`
        : "";
      setPhoneValue(fullPhone);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));

    // مسح أخطاء الحقل المحدد
    if (error?.[field]) {
      dispatch(customerAction.setError({ ...error, [field]: undefined }));
    }
  };

  // دالة معالجة تغيير رقم الهاتف مطابقة لـ AddCustomerModal
  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);

    setEditData(prev => ({
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

  // Handle schedule appointment click - إضافة الدالة المطلوبة
  const handleScheduleClick = (customerData) => {
    console.log('Schedule clicked for:', customerData);
    
    // تحضير بيانات العميل للسايدبار
    const clientInfo = {
      id: customerData?.client?.id || customerData?.id,
      name: customerData?.client?.name || customerData?.name || editData.name,
      email: customerData?.client?.email || customerData?.email || editData.email,
      phone: customerData?.client?.phone || customerData?.phone || editData.phone
    };
    
    setClientData(clientInfo);
    setIsScheduleOpen(true);
  };

  // Handle schedule success - إضافة الدالة المطلوبة
  const handleScheduleSuccess = () => {
    console.log('Appointment scheduled successfully');
    // alert('Appointment scheduled successfully!');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleDelete = () => {
    // Here you would dispatch a delete action
    // dispatch(deleteCustomer(customerId));
    // Then go back to customers list
    if (onBack) {
      onBack();
    }
  };
const canEditClient = usePermission("edit clients");
const canDeleteClient = usePermission("destroy clients");
const canCreateClient = usePermission("create clients");
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error && typeof error === 'object' && error.message) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error.message || 'Failed to load customer'}
          <button 
            onClick={handleBack}
            className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  // If no customer data
  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Customer not found</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {editData.name || 'Customer Details'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {canCreateClient && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click when scheduling
                handleScheduleClick(customer);
              }}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
            )}
            {canDeleteClient && (
            <button 
              onClick={handleDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("customer")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "customer"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Customer information
            </button>
            <button
              onClick={() => setActiveTab("appointment")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "appointment"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Appointment History
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === "customer" ? (
          /* Profile Section */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {customer.avatar ? (
                      <img 
                        src={customer.avatar} 
                        alt={editData.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editData.name}
                    </h2>
                    <p className="text-gray-500">{editData.email}</p>
                  </div>
                </div>
                {!isEditing && canEditClient && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
                {isEditing && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                /* View Mode */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <p className="text-gray-900 text-base">{editData.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900 text-base">{editData.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <p className="text-gray-900 text-base">
                      {editData.code_phone && editData.phone ? `${editData.code_phone} ${editData.phone}` : 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Enter name"
                      />
                      {error?.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Enter email address"
                      />
                      {error?.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      {error?.phone && <p className="text-red-500 text-sm mt-1">{error.phone}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Appointment History Tab */
           <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400 text-sm mt-1">Appointments will appear here when added</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        #
                      </div>
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Name
                      </div>
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </div>
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Interview Type
                      </div>
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-700 text-sm">
                      Status
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time
                      </div>
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-700 text-sm">
                      Work Space
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((appt, index) => (
                    <tr 
                      key={appt.id} 
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{appt.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-600 font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                          {appt.phone}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium inline-block">
                          {appt.interview_name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          
                          {appt.status}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-700 font-medium">{appt.date}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-700 font-medium">{appt.time}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                          {appt.work_space_name}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>
      
      {/* Schedule Sidebar */}
      <RescheduleSidebar 
        mode="schedule"
        clientData={clientData}
        isOpen={isScheduleOpen}
        onClose={() => {
          setIsScheduleOpen(false);
          setClientData(null);
        }}
        onScheduleSuccess={handleScheduleSuccess}
      />
    </div>
  );
};

export default EditCustomer;