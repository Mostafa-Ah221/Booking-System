import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

function Staff_StatisticsCards({ data }) {
   const stats = data?.data?.stats  || {};
  const appointmentsStats = data?.data?.appointments_by_status || {};
  const datePeriods = data?.data?.date_periods || {};
  
 const cards = [
    {
      title: 'Total Appointments',
      value: stats?.total_appointments || 0,
      icon: Calendar,
      color: 'blue',
      changeType: 'positive'
    },
    {
      title: 'Upcoming Appointments',
      value: appointmentsStats.upcoming?.count || 0,
      icon: Clock,
      color: 'yellow',
      change: `${appointmentsStats.upcoming?.percentage || 0}%`,
      changeType: 'positive'
    },
    {
      title: 'Passed Appointments',
      value: appointmentsStats.passed?.count || 0,
      icon: CheckCircle,
      color: 'green',
      change: `${appointmentsStats.passed?.percentage || 0}%`,
      changeType: 'positive'
    },
    {
      title: 'Completed Appointments',
      value: appointmentsStats.completed?.count || 0,
      icon: CheckCircle,
      color: 'green',
      change: `${appointmentsStats.completed?.percentage || 0}%`,
      changeType: 'positive'
    },
    {
      title: 'Cancelled Appointments',
      value: appointmentsStats.cancelled?.count || 0,
      icon: XCircle,
      color: 'red',
      change: `${appointmentsStats.cancelled?.percentage || 0}%`,
      changeType: 'negative'
    },
    {
      title: 'Custom Range Appointments',
      value: datePeriods.appointments_by_custom_range?.count || 0,
      icon: Calendar,
      color: 'green',
      change: `${datePeriods.appointments_by_custom_range?.percentage || 0}%`,
      changeType: 'positive'
    }
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg p-6 pb-4 shadow-sm border border-gray-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(card.color)}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900">{card.value}</span>
              </div>
              <span className={`text-sm font-medium ${card.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {card.change}
              </span>
              {/* <span className="text-sm text-gray-500 ml-1">from last week</span> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Staff_StatisticsCards;