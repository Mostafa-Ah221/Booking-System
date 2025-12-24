import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react';
import Chart from 'react-apexcharts';
import { ResponsivePie } from '@nivo/pie';

export function Chart1({ data, timeFilter }) {
    const appointmentData = data?.data || {};

    // Process data for charts based on time filter
    const chartData = useMemo(() => {
        const stats = appointmentData.stats || {};
        const appointments = appointmentData.recent_appointments || [];

        // Filter appointments based on time filter
        const filteredAppointments = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            const now = new Date();
            
            switch(timeFilter) {
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return appointmentDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    return appointmentDate >= monthAgo;
                case '3months':
                    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                    return appointmentDate >= threeMonthsAgo;
                case '6months':
                    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                    return appointmentDate >= sixMonthsAgo;
                case 'year':
                    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    return appointmentDate >= yearAgo;
                default: // 'all'
                    return true;
            }
        });

        // Data for status pie chart with filtered data
        const statusCounts = filteredAppointments.reduce((acc, appointment) => {
            const status = appointment.status === 'rescheduled' ? 'upcoming' : appointment.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const statusData = [
            { name: 'Upcoming', value: statusCounts.upcoming || 0 },
            { name: 'Completed', value: statusCounts.completed || 0 },
            { name: 'Cancelled', value: statusCounts.cancelled || 0 }
        ].filter(item => item.value > 0);

        // Data for appointments by date with filtered data
        const appointmentsByDate = filteredAppointments.reduce((acc, appointment) => {
            const date = appointment.date;
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const dateData = Object.entries(appointmentsByDate)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, count]) => ({ date, count }));

        return { statusData, dateData, filteredCount: filteredAppointments.length };
    }, [appointmentData, timeFilter]);

    const chartOptions = useMemo(() => ({
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false,
                tools: {
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        colors: ['#4f46e5'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 0,
            hover: {
                size: 8,
                sizeOffset: 3
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
            }
        },
        xaxis: {
            type: 'datetime',
            categories: chartData.dateData.map(item => new Date(item.date).getTime()),
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                },
                format: 'dd/MM'
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            },
            title: {
                text: 'Number of Appointments',
                style: {
                    color: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        tooltip: {
            x: {
                format: 'dd/MM/yyyy'
            },
            y: {
                formatter: function (val) {
                    return val + ' appointments'
                }
            },
            style: {
                fontSize: '12px'
            },
            marker: {
                show: true,
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '14px',
            markers: {
                radius: 12
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                    value: 0.15,
                }
            }
        }
    }), [chartData]);

    const chartSeries = useMemo(() => [{
        name: 'Appointments',
        data: chartData.dateData.map(item => item.count)
    }], [chartData]);

    return (
        <div className="mb-8 space-y-6">
          

            {/* Appointments by Date - Area Chart */}
            <div>
                <h4 className=" font-medium text-gray-700 mb-3">
                    Appointments by Date
                    {chartData.dateData.length === 0 && (
                        <span className="text-sm text-gray-500 ml-2">(No data for selected period)</span>
                    )}
                </h4>
                <div className="h-[calc(100vh-300px)]">
                    {chartData.dateData.length > 0 ? (
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="area"
                            height="100%"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <p className="text-lg mb-2">No appointments found</p>
                                <p className="text-sm">Try selecting a different time period</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ChartsSection({ data }) {
    const [timeFilter, setTimeFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // const timeFilterOptions = [
    //     { value: 'all', label: 'All Time' },
    //     { value: 'week', label: 'Last Week' },
    //     { value: 'month', label: 'Last Month' },
    //     { value: '3months', label: 'Last 3 Months' },
    //     { value: '6months', label: 'Last 6 Months' },
    //     { value: 'year', label: 'Last Year' }
    // ];

    // const selectedFilterLabel = timeFilterOptions.find(option => option.value === timeFilter)?.label;

    return (
        <div className="bg-white rounded-lg p-6 pb-0 shadow-sm border border-gray-200">
            <div className="flex items-end justify-between mb-6">
                <h3 className="text-sm font-medium text-gray-600">Appointments Analytics</h3>
                <div className="flex items-center gap-4">
                    {/* Time Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            {/* <span>{selectedFilterLabel}</span> */}
                            {/* <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} /> */}
                        </button>
                        
                        {/* {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                {timeFilterOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setTimeFilter(option.value);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                                            timeFilter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )} */}
                    </div>

                    {/* Search Input */}
                    {/* <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-sm px-3 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24 sm:w-32"
                    /> */}
                </div>
            </div>
            
            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
                <div 
                    className="fixed z-5" 
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
            
            <Chart1 data={data} timeFilter={timeFilter} />
        </div>
    );
}


export function Chart2({ data, timeFilter }) {
    const appointmentData = data?.data || {};

    // Process data for pie chart
    const pieData = useMemo(() => {
        const appointmentsByStatus = appointmentData?.appointments_by_status || {};

        

        const statusData = [
            { 
                id: 'upcoming', 
                label: 'Upcoming', 
                value: appointmentsByStatus.upcoming?.count || appointmentsByStatus.upcoming || 0, 
                color: '#4f46e5'
            },
            { 
                id: 'completed', 
                label: 'Completed', 
                value: appointmentsByStatus.completed?.count || appointmentsByStatus.completed || 0, 
                color: '#10b981'
            },
            { 
                id: 'passed', 
                label: 'Passed', 
                value: appointmentsByStatus.passed?.count || appointmentsByStatus.passed || 0, 
                color: '#f59e0b'
            },
            { 
                id: 'cancelled', 
                label: 'Cancelled', 
                value: appointmentsByStatus.cancelled?.count || appointmentsByStatus.cancelled || 0, 
                color: '#ef4444'
            }
        ].filter(item => item.value > 0);

        const total = statusData.reduce((sum, item) => sum + item.value, 0);
        if (total > 0) {
            statusData.forEach(item => {
                item.percentage = Math.round((item.value / total) * 100);
            });
        }

        console.log('pieData:', statusData); // شوف وش النتيجة

        return statusData;
    }, [appointmentData]);
console.log(pieData);

    return (
        <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-700 mb-3">
                Appointments by Status
                {pieData.length === 0 && (
                    <span className="text-sm text-gray-500 ml-2">(No data available)</span>
                )}
            </h4>
            <div className="h-[300px]">
                {pieData.length > 0 ? (
                    <ResponsivePie
                        data={pieData}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.6}
                        cornerRadius={2}
                        activeOuterRadiusOffset={8}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                translateY: 56,
                                itemWidth: 100,
                                itemHeight: 18,
                                symbolShape: 'circle'
                            }
                        ]}
                        tooltip={({ datum }) => (
                            <div className="bg-white p-3 shadow-lg rounded-lg border">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: datum.color }}
                                    />
                                    <span className="font-medium">{datum.label}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {datum.value} appointments ({datum.data.percentage}%)
                                </div>
                            </div>
                        )}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <p className="text-lg mb-2">No appointments found</p>
                            <p className="text-sm">No data available to display</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}