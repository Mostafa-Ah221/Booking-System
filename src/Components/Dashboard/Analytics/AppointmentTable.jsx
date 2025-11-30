import { useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const AppointmentTable = ({ data }) => {
  const appointmentData = data?.data?.recent_appointments || [];
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 11;

  const statusIcons = {
    upcoming: <Clock className="w-4 h-4 text-yellow-500" />,
    cancelled: <XCircle className="w-4 h-4 text-red-500" />,
    completed: <CheckCircle2 className="w-4 h-4 text-green-500" />
  };

  const statusColors = {
    upcoming: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800'
  };

  // Pagination Logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointmentData.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(appointmentData.length / appointmentsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (appointmentData.length <= appointmentsPerPage) return null;

    const pageNumbers = [];
    const maxVisiblePages = 3; // عدد الصفحات المرئية على الموبايل
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-4 px-3 sm:px-6 py-3 bg-white border-t">
        <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, appointmentData.length)} of {appointmentData.length} appointments
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => paginate(1)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-white text-gray-600 hover:bg-gray-100"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
              <button
                onClick={() => paginate(totalPages)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-white text-gray-600 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 sm:mt-5">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workspace</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No appointments to display
                    </td>
                  </tr>
                ) : (
                  currentAppointments.map((appointment, index) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {indexOfFirstAppointment + index + 1}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                          <span className="text-gray-400">{appointment.time}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9 lg:h-10 lg:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {appointment.customer.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3 lg:ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-[120px] lg:max-w-[150px] truncate" title={appointment.customer.name}>
                              {appointment.customer.name}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-500 max-w-[120px] lg:max-w-[150px] truncate" title={appointment.customer.email}>
                              {appointment.customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium max-w-[120px] lg:max-w-[150px] truncate" title={appointment.interview.name}>
                            {appointment.interview.name}
                          </span>
                          <span className="text-xs text-gray-400">ID: {appointment.interview.id}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 max-w-[120px] lg:max-w-[150px] truncate whitespace-nowrap text-sm text-gray-500" title={appointment.workspace.name}>
                        {appointment.workspace.name}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appointment.status]}`}>
                          <div className="flex items-center gap-1">
                            {statusIcons[appointment.status]}
                            <span className="capitalize">{appointment.status}</span>
                          </div>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {renderPagination()}
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {currentAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            No appointments to display
          </div>
        ) : (
          currentAppointments.map((appointment, index) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {appointment.customer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {appointment.customer.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {appointment.customer.email}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full flex-shrink-0 ${statusColors[appointment.status]}`}>
                  <div className="flex items-center gap-1">
                    {statusIcons[appointment.status]}
                    <span className="capitalize">{appointment.status}</span>
                  </div>
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-medium text-gray-900">#{indexOfFirstAppointment + index + 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium text-gray-900">{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium text-gray-900">{appointment.time}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Interview:</span>
                  <span className="font-medium text-gray-900 text-right truncate max-w-[60%]" title={appointment.interview.name}>
                    {appointment.interview.name}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Workspace:</span>
                  <span className="font-medium text-gray-900 text-right truncate max-w-[60%]" title={appointment.workspace.name}>
                    {appointment.workspace.name}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Mobile Pagination */}
        {appointmentData.length > appointmentsPerPage && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentTable;