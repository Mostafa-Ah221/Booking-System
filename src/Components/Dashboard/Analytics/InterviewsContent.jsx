import { useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Users, DollarSign, ClipboardClock, Clock, Filter, X } from 'lucide-react';

function InterviewsContent({ data, filters, onFiltersChange }) {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters || {});

    const interviewsData = data?.data?.interviews_by_status || {};
    
    const stats = [
        {
            title: 'Total Interviews',
            value: interviewsData.total || 0,
            icon: Users,
            color: 'blue'
        }
    ];

    const handleFilterChange = (key, value) => {
        const newFilters = {
            ...localFilters,
            [key]: value
        };
        setLocalFilters(newFilters);
    };

    const applyFilters = () => {
        onFiltersChange(localFilters);
        setShowFilters(false);
    };

    const clearFilters = () => {
        const clearedFilters = {
            start_price_interval: '',
            end_price_interval: ''
        };
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    const hasActiveFilters = localFilters.start_price_interval || localFilters.end_price_interval;

    // Prepare data for pie charts
    const preparePieData = (data, labelKey, valueKey, colors) => {
        if (!data || !Array.isArray(data)) return [];
        
        return data.map((item, index) => ({
            id: item[labelKey] || `item-${index}`,
            label: item[labelKey] || `Item ${index + 1}`,
            value: item[valueKey] || 0,
            color: colors[index % colors.length]
        })).filter(item => item.value > 0);
    };

    const typeColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const currencyColors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const durationColors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'];
    const priceColors = ['#ef4444', '#f59e0b', '#10b981', '#4f46e5', '#8b5cf6'];

    const typeData = preparePieData(interviewsData.count_by_type, 'type', 'total', typeColors);
    const currencyData = preparePieData(interviewsData.count_by_currency, 'currency', 'total', currencyColors);
    const durationData = preparePieData(interviewsData.count_by_duration_period, 'duration_period', 'total', durationColors);
    const priceData = preparePieData(interviewsData.count_by_price_interval, 'price', 'total', priceColors);

    const PieChartComponent = ({ data, title }) => (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            {data.length > 0 ? (
                <div className="h-[300px]">
                    <ResponsivePie
                        data={data}
                        margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                        innerRadius={0.4}
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
                                justify: false,
                                translateX: 0,
                                translateY: 56,
                                itemsSpacing: 0,
                                itemWidth: 100,
                                itemHeight: 18,
                                itemTextColor: '#999',
                                itemDirection: 'left-to-right',
                                itemOpacity: 1,
                                symbolSize: 12,
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
                                    {datum.value} interviews
                                </div>
                            </div>
                        )}
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                    <div className="text-center">
                        <p className="text-lg mb-2">No data available</p>
                        <p className="text-sm">No interviews found for this category</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Interview Filters</h3>
                    <div className="flex items-center space-x-2">
                        {hasActiveFilters && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Price Interval
                                </label>
                                <input
                                    type="number"
                                    value={localFilters.start_price_interval || ''}
                                    onChange={(e) => handleFilterChange('start_price_interval', e.target.value)}
                                    placeholder="Min price..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Price Interval
                                </label>
                                <input
                                    type="number"
                                    value={localFilters.end_price_interval || ''}
                                    onChange={(e) => handleFilterChange('end_price_interval', e.target.value)}
                                    placeholder="Max price..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear
                            </button>
                            <button
                                onClick={applyFilters}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* إحصائيات المقابلات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600`}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                    );
                })}
            </div>

            {/* تفاصيل المقابلات مع الـ Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* المربعات في العمود الأيسر */}
                <div className="space-y-6">
                    {/* أنواع المقابلات والعملات */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* أنواع المقابلات */}
                        {interviewsData.count_by_type && (
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Interview Types</h3>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                                        <ClipboardClock className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {interviewsData.count_by_type.map((type, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">{type.type}</span>
                                            <span className="text-sm font-bold text-gray-900">{type.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* العملات */}
                        {interviewsData.count_by_currency && (
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Currency Distribution</h3>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {interviewsData.count_by_currency.map((currency, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700 uppercase">{currency.currency}</span>
                                            <span className="text-sm font-bold text-gray-900">{currency.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* فترات المدة */}
                        {interviewsData.count_by_duration_period && (
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Duration Periods</h3>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {interviewsData.count_by_duration_period.map((duration, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">{duration.duration_period}</span>
                                            <span className="text-sm font-bold text-gray-900">{duration.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* فترات الأسعار */}
                        {interviewsData.count_by_price_interval && interviewsData.count_by_price_interval.length > 0 && (
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Price Intervals</h3>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {interviewsData.count_by_price_interval.map((price, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">${price.price}</span>
                                            <span className="text-sm font-bold text-gray-900">{price.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart في العمود الأيمن */}
                {(typeData.length > 0 || currencyData.length > 0 || durationData.length > 0 || priceData.length > 0) && (
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Distribution</h3>
                        <div className="h-[350px]">
                            <ResponsivePie
                                data={[
                                    {
                                        id: 'types',
                                        label: 'Interview Types',
                                        value: typeData.reduce((sum, item) => sum + item.value, 0),
                                        color: '#4f46e5'
                                    },
                                    {
                                        id: 'currencies',
                                        label: 'Currencies',
                                        value: currencyData.reduce((sum, item) => sum + item.value, 0),
                                        color: '#10b981'
                                    },
                                    {
                                        id: 'durations',
                                        label: 'Duration Periods',
                                        value: durationData.reduce((sum, item) => sum + item.value, 0),
                                        color: '#f59e0b'
                                    },
                                    {
                                        id: 'prices',
                                        label: 'Price Intervals',
                                        value: priceData.reduce((sum, item) => sum + item.value, 0),
                                        color: '#ef4444'
                                    }
                                ].filter(item => item.value > 0)}
                                margin={{ top: 40, right: 40, bottom: 120, left: 40 }}
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
                                        direction: 'column',
                                        justify: false,
                                        translateX: 0,
                                        translateY: 100,
                                        itemsSpacing: 4,
                                        itemWidth: 120,
                                        itemHeight: 18,
                                        itemTextColor: '#999',
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 1,
                                        symbolSize: 12,
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
                                            Total: {datum.value} interviews
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InterviewsContent;