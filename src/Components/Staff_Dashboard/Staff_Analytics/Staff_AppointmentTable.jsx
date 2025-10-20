import { useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const Staff_AppointmentTable = ({ data }) => {
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
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-between items-center mt-4 px-6 py-3 bg-white border-t">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, appointmentData.length)} of {appointmentData.length} appointments
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-md ${
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
    <div className="mt-5 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workspace</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No appointments to display
                  </td>
                </tr>
              ) : (
                currentAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexOfFirstAppointment + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        <span className="text-gray-400">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {appointment.customer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate tooltip whitespace-nowrap" title={appointment.customer.name}>{appointment.customer.name}</div>
                          <div className="text-sm text-gray-500 max-w-[150px] truncate tooltip whitespace-nowrap" title={appointment.customer.email}>{appointment.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="font-medium max-w-[150px] truncate tooltip whitespace-nowrap" title={appointment.interview.name}>{appointment.interview.name}</span>
                        <span>ID: {appointment.interview.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[150px] truncate tooltip whitespace-nowrap text-sm text-gray-500" title={appointment.workspace.name}>
                      {appointment.workspace.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appointment.status]}`}>
                        <div className="flex items-center">
                          {statusIcons[appointment.status]}
                          <span className="ml-1 capitalize">{appointment.status}</span>
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
  );
};

export default Staff_AppointmentTable;