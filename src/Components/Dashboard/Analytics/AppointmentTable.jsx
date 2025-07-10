import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const AppointmentTable = ({ data }) => {
    const  appointmentData= data?.data?.recent_appointments || {};
    console.log(appointmentData);
    
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

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mt-5">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interview
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Workspace
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointmentData.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{appointment.id}
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
                    <div className="text-sm font-medium text-gray-900">{appointment.customer.name}</div>
                    <div className="text-sm text-gray-500">{appointment.customer.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col">
                  <span className="font-medium">{appointment.interview.name}</span>
                  <span>ID: {appointment.interview.id}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AppointmentTable