import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

function StatisticsCards({ data }) {
  const stats = data?.data?.stats || {};
  const appointmentsStats = data?.data?.appointments_by_status || {};
  const datePeriods = data?.data?.date_periods || {};

  const cards = [
    { title: 'Total Appointments', value: stats?.total_appointments || 0, icon: Calendar, color: 'blue' },
    { title: 'Upcoming Appointments', value: appointmentsStats.upcoming?.count || 0, icon: Clock, color: 'yellow', change: `${appointmentsStats.upcoming?.percentage || 0}%` },
    { title: 'Passed Appointments', value: appointmentsStats.passed?.count || 0, icon: CheckCircle, color: 'green', change: `${appointmentsStats.passed?.percentage || 0}%` },
    { title: 'Completed Appointments', value: appointmentsStats.completed?.count || 0, icon: CheckCircle, color: 'green', change: `${appointmentsStats.completed?.percentage || 0}%` },
    { title: 'Cancelled Appointments', value: appointmentsStats.cancelled?.count || 0, icon: XCircle, color: 'red', change: `${appointmentsStats.cancelled?.percentage || 0}%` },
    { title: 'Custom Range Appointments', value: datePeriods.appointments_by_custom_range?.count || 0, icon: Calendar, color: 'indigo', change: `${datePeriods.appointments_by_custom_range?.percentage || 0}%` },
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 min-w-0"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 truncate">{card.title}</h3>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(card.color)}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              {card.change && (
                <p className="text-sm font-medium text-green-600">{card.change}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatisticsCards;