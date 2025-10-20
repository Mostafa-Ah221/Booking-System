import { Users, DollarSign, Building, TrendingUp, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { ResponsivePie } from '@nivo/pie';

function ClientsContent({ data, filters, onFiltersChange }) {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters || {});

    const clientsData = data?.data?.date_periods || {};

    
    const stats = [
        {
            title: 'Clients Last 7 Days',
            value: clientsData.clients_last_7_days || 0,
            icon: Users,
            color: 'blue',
            period: '7 days'
        },
        {
            title: 'Clients Last Month',
            value: clientsData.clients_last_month || 0,
            icon: Users,
            color: 'green',
            period: '30 days'
        },
        {
            title: 'Clients Last Year',
            value: clientsData.clients_last_year || 0,
            icon: Users,
            color: 'purple',
            period: '365 days'
        },
        {
            title: 'Custom Date Range',
            value: clientsData.clients_custom_date_range || 0,
            icon: Users,
            color: 'orange',
            period: 'custom'
        }
    ];

    // فلترة
    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applyFilters = () => {
        onFiltersChange(localFilters);
        setShowFilters(false);
    };

    const clearFilters = () => {
        const clearedFilters = { start_date: '', end_date: '' };
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    const hasActiveFilters = localFilters.start_date || localFilters.end_date;
    const hasData = stats.some(stat => stat.value > 0);

    // Pie chart data
    const pieData = stats.map(stat => ({
        id: stat.title,
        label: stat.period,
        value: stat.value,
        color: stat.color
    })).filter(item => item.value > 0);

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Clients Filters</h3>
                    <div className="flex items-center space-x-2">
                        {hasActiveFilters && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Filtered
                            </span>
                        )}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={localFilters.start_date || ''}
                                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={localFilters.end_date || ''}
                                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear
                            </button>
                            <button
                                onClick={applyFilters}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-white bg-orange-600 hover:bg-orange-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">({stat.period})</p>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            {hasData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Clients Activity (Bars)</h3>
                        <div className="flex items-end space-x-4 h-56">
                            {stats.map((stat, i) => {
                                const maxValue = Math.max(...stats.map(s => s.value));
                                const height = maxValue > 0 ? (stat.value / maxValue) * 100 : 0;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center">
                                        <div
                                            className={`w-full bg-${stat.color}-200 rounded-t-lg flex items-end justify-center pb-2`}
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                        >
                                            <span className="text-xs font-medium text-gray-700">{stat.value}</span>
                                        </div>
                                        <span className="text-xs text-gray-600 mt-2">{stat.period}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Clients Distribution</h3>
                        <div className="h-[350px]">
                            <ResponsivePie
                                data={pieData}
                                margin={{ top: 40, right: 40, bottom: 80, left: 40 }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                activeOuterRadiusOffset={8}
                                borderWidth={1}
                                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
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
                                        itemTextColor: '#999',
                                        symbolSize: 12,
                                        symbolShape: 'circle'
                                    }
                                ]}
                                tooltip={({ datum }) => (
                                    <div className="bg-white p-3 shadow-lg rounded-lg border">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: datum.color }} />
                                            <span className="font-medium">{datum.label}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">{datum.value} Clients</div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* No Data */}
            {!hasData && !hasActiveFilters && (
                <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No customer Data Available</h3>
                    <p className="text-sm text-gray-500">There are currently no clients registered in the system.</p>
                </div>
            )}

            {!hasData && hasActiveFilters && (
                <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-sm text-gray-500 mb-4">No clients found matching your filter criteria.</p>
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default ClientsContent;
