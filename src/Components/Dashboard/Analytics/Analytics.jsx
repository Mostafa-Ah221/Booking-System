import { useQuery } from '@tanstack/react-query';
import AppointmentTable from "./AppointmentTable";
import CalendarAnalytics from "./CalendarAnalytics";
import ChartsSection, { Chart2 } from "./ChartsSection";
import StatisticsCards from "./StatisticsCards";
import Loader from '../../Loader';

export default function Analytics() {
    const fetchAnalyticsData = async () => {
        const token = localStorage.getItem("access_token");
      
        const response = await fetch('https://booking-system-demo.efc-eg.com/api/analytics/dashboard', {
          headers: {
            "Content-Type": "application/json",
            Authorization:token,
          },
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        console.log(data);
        return data;
      };
      

  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: fetchAnalyticsData,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
    retry: 3,
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg"> <Loader/></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          خطأ في تحميل البيانات: {error.message}
          <button 
            onClick={() => refetch()} 
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  console.log(analyticsData);
  
  const appointments = [
    {
      id: 58,
      date: "2025-07-06",
      time: "11:20:00",
      status: "cancelled",
      interview: { id: 10, name: "intervew-2" },
      customer: { id: 12, name: "Mostafa Ahmed", email: "Mostafazxk@gmail.com" },
      workspace: { id: 8, name: "rtrejker" }
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatisticsCards data={analyticsData} />
        <ChartsSection data={analyticsData} />
        <Chart2 data={analyticsData} />
        <CalendarAnalytics data={analyticsData} />
      </div>
      <AppointmentTable data={analyticsData} />
    </div>
  );
}