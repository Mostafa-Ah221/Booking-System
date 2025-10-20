import { useState, useEffect } from "react";
import { ChevronLeft, Calendar, Trash2, Edit2, User, Briefcase, Clock, Phone } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerById, updateCustomer, deleteCustomer } from "../../../redux/apiCalls/CustomerCallApi";
import { customerAction } from "../../../redux/slices/customersSlice";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {fetchAppointments} from '../../../redux/apiCalls/AppointmentCallApi';
import RescheduleSidebar from "../../Dashboard/Appointments/RescheduleSidebar";
import { usePermission } from "../../hooks/usePermission";
import { fetchAllInterviews } from '../../../redux/apiCalls/interviewCallApi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, customerName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Delete Client
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Sure you want to delete {customerName}?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useDispatch();
  const { customer, loading, error } = useSelector(state => state.customers);
  const { appointments } = useSelector((state) => state.appointments);
  const { allInterviews } = useSelector(state => state.interview);

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

    if (error?.[field]) {
      dispatch(customerAction.setError({ ...error, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value, country) => {
    setPhoneValue(value);

    setEditData(prev => ({
      ...prev,
      phone: value.replace(`+${country.dialCode}`, ""),
      code_phone: `+${country.dialCode}`,
    }));

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

  const handleScheduleClick = (customerData) => {
    console.log('Schedule clicked for:', customerData);
    
    const clientInfo = {
      id: customerData?.client?.id || customerData?.id,
      name: customerData?.client?.name || customerData?.name || editData.name,
      email: customerData?.client?.email || customerData?.email || editData.email,
      phone: customerData?.client?.phone || customerData?.phone || editData.phone
    };
    
    setClientData(clientInfo);
    setIsScheduleOpen(true);
  };

  const handleScheduleSuccess = () => {
    console.log('Appointment scheduled successfully');
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCustomer(customerId));
    setShowDeleteModal(false);
    if (onBack) {
      onBack();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const canEditClient = usePermission("edit clients");
  const canDeleteClient = usePermission("destroy clients");
  const canCreateClient = usePermission("create clients");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && typeof error === 'object' && error.message) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error.message || 'Failed to load Client'}
          <button 
            onClick={handleBack}
            className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Customer not found</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
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
                e.stopPropagation();
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
              onClick={handleDeleteClick}
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
              Client information
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
                        value={phoneValue}
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
          <div className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No appointments found</p>
                <p className="text-gray-400 text-sm mt-1">Appointments will appear here when added</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="px-6 py-4 font-semibold text-sm text-left w-12 text-gray-700">
                        <div className="flex items-center gap-2">#</div>
                      </th>
                      <th className="px-6 py-4 font-semibold text-sm text-left flex-1 min-w-[150px] text-gray-700">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Name
                        </div>
                      </th>
                      <th className="px-6 py-4 font-semibold text-sm text-left flex-1 min-w-[130px] text-gray-700">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </div>
                      </th>
                      <th className="px-6 py-4 font-semibold text-sm text-left flex-1 min-w-[140px] text-gray-700">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Interview
                        </div>
                      </th>
                      <th className="px-6 py-4 font-semibold text-sm text-left flex-1 min-w-[110px] text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 font-semibold text-sm text-left flex-1 min-w-[120px] text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                      </th>
                      <th className="px-6 py-4 font-semibold text-sm text-left flex-1 min-w-[100px] text-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Time
                        </div>
                      </th>
                      <th className="px-6 py-4 font-semibold text-sm text-left flex-1 min-w-[140px] text-gray-700">
                        Work Space
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map((appt, index) => (
                      <tr 
                        key={appt.id} 
                        className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200"
                      >
                        <td className="px-6 py-4 text-sm">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {appt.name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                            {appt.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium inline-block">
                            {appt.interview_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="inline-block">
                            <span className="px-3 py-1.5 rounded-lg font-medium text-sm bg-green-100 text-green-700">
                              {appt.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          {appt.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          {appt.time}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium inline-block">
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
        fetchInterviews={fetchAllInterviews}
        onScheduleSuccess={handleScheduleSuccess}
        interviews={allInterviews}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        customerName={editData.name || 'this customer'}
      />
    </div>
  );
};

export default EditCustomer;