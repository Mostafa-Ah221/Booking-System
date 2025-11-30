import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Calendar, FileText, ChevronDown, Filter, X } from 'lucide-react';
import Loader from '../../Loader';
import Staff_StatisticsCards from "./Staff_StatisticsCards";
import Staff_AppointmentTable from "./Staff_AppointmentTable";
import ChartsSection, { Chart2 } from '../../Dashboard/Analytics/ChartsSection';
import CalendarAnalytics from '../../Dashboard/Analytics/CalendarAnalytics';
import InterviewsContent from '../../Dashboard/Analytics/InterviewsContent';
import axiosInstance from '../../pages/axiosInstance';

export default function Staff_Analytics() {
    const [activeTab, setActiveTab] = useState('appointments');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showAppointmentFilters, setShowAppointmentFilters] = useState(false);
    const [showInterviewFilters, setShowInterviewFilters] = useState(false);
    const dropdownRef = useRef(null);

    // ✅ إضافة state للـ date error
    const [dateError, setDateError] = useState('');

    const [filters, setFilters] = useState({
        appointments: {
            start_date: '',
            end_date: ''
        },
        interviews: {
            start_price_interval: '',
            end_price_interval: ''
        }
    });

    const [localAppointmentFilters, setLocalAppointmentFilters] = useState(filters.appointments);
    const [localInterviewFilters, setLocalInterviewFilters] = useState(filters.interviews);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const buildQueryString = (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value && value.toString().trim() !== '') {
                searchParams.append(key, value);
            }
        });
        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
    };

    const fetchStaffAppointmentAnalytics = async () => {
        const queryString = buildQueryString(filters.appointments);
        const response = await axiosInstance.get(`/staff/analytics/dashboard/appointments${queryString}`);
        return response.data;
    };

    const fetchStaffInterviewAnalytics = async () => {
        const queryString = buildQueryString(filters.interviews);
        const response = await axiosInstance.get(`/staff/analytics/dashboard/interviews${queryString}`);
        return response.data;
    };

    const {
        data: appointmentsData,
        isLoading: appointmentsLoading,
        isError: appointmentsError,
        error: appointmentsErrorDetails,
        refetch: refetchAppointments
    } = useQuery({
        queryKey: ['staff-analytics-appointments', filters.appointments],
        queryFn: fetchStaffAppointmentAnalytics,
        staleTime: 2 * 60 * 1000,
        retry: 3,
    });

    const {
        data: interviewsData,
        isLoading: interviewsLoading,
        isError: interviewsError,
        error: interviewsErrorDetails,
        refetch: refetchInterviews
    } = useQuery({
        queryKey: ['staff-analytics-interviews', filters.interviews],
        queryFn: fetchStaffInterviewAnalytics,
        staleTime: 2 * 60 * 1000,
        retry: 3,
    });

    const analyticsData = {
        appointments: appointmentsData,
        interviews: interviewsData,
    };

    const getActiveData = () => {
        return analyticsData[activeTab];
    };

    const updateFilters = (tabId, newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [tabId]: {
                ...prevFilters[tabId],
                ...newFilters
            }
        }));
    };

    const getActiveFilters = () => {
        return filters[activeTab] || {};
    };

    // ✅ إضافة مسح الخطأ عند التعديل
    const handleAppointmentFilterChange = (key, value) => {
        setDateError(''); // مسح الخطأ عند التعديل
        setLocalAppointmentFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // ✅ إضافة الـ validation زي Analytics component
    const applyAppointmentFilters = () => {
        setDateError('');
        
        if (localAppointmentFilters.start_date && localAppointmentFilters.end_date) {
            const startDate = new Date(localAppointmentFilters.start_date);
            const endDate = new Date(localAppointmentFilters.end_date);
            
            if (endDate < startDate) {
                setDateError('Start date cannot be after end date');
                return; 
            }
        }
        
        updateFilters('appointments', localAppointmentFilters);
        setShowAppointmentFilters(false);
    };

    // ✅ إضافة مسح الخطأ عند Clear
    const clearAppointmentFilters = () => {
        setDateError(''); 
        const clearedFilters = {
            start_date: '',
            end_date: ''
        };
        setLocalAppointmentFilters(clearedFilters);
        updateFilters('appointments', clearedFilters);
    };

    const hasActiveAppointmentFilters = filters.appointments.start_date || filters.appointments.end_date;

    const handleInterviewFilterChange = (key, value) => {
        setLocalInterviewFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applyInterviewFilters = () => {
        updateFilters('interviews', localInterviewFilters);
        setShowInterviewFilters(false);
    };

    const clearInterviewFilters = () => {
        const clearedFilters = {
            start_price_interval: '',
            end_price_interval: ''
        };
        setLocalInterviewFilters(clearedFilters);
        updateFilters('interviews', clearedFilters);
    };

    const hasActiveInterviewFilters = filters.interviews.start_price_interval || filters.interviews.end_price_interval;

    const tabs = [
        { id: 'appointments', label: 'Appointments', icon: <Calendar size={18} /> },
        { id: 'interviews', label: 'Interviews', icon: <FileText size={18} />}
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setIsDropdownOpen(false);
    };

    const currentTab = tabs.find(tab => tab.id === activeTab);

    const isLoading = (activeTab === 'appointments' && appointmentsLoading) || 
                      (activeTab === 'interviews' && interviewsLoading);

    const isError = (activeTab === 'appointments' && appointmentsError) || 
                    (activeTab === 'interviews' && interviewsError);

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    const renderActiveContent = () => {
        const activeData = getActiveData();
        const activeFilters = getActiveFilters();

        if (activeTab === 'appointments') {
            return (
                <>
                    {/* Appointment Filters */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6 text-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Appointment Filters</h3>
                            <div className="flex items-center space-x-2">
                                {hasActiveAppointmentFilters && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Filtered
                                    </span>
                                )}
                                <button
                                    onClick={() => setShowAppointmentFilters(!showAppointmentFilters)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                </button>
                            </div>
                        </div>

                        {showAppointmentFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                {/* ✅ عرض رسالة الخطأ */}
                                {dateError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm text-red-700 font-medium">{dateError}</span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={localAppointmentFilters.start_date || ''}
                                            onChange={(e) => handleAppointmentFilterChange('start_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={localAppointmentFilters.end_date || ''}
                                            onChange={(e) => handleAppointmentFilterChange('end_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                        onClick={clearAppointmentFilters}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Clear
                                    </button>
                                    <button
                                        onClick={applyAppointmentFilters}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Staff_StatisticsCards data={activeData} />
                        <ChartsSection data={activeData} />
                        <Chart2 data={activeData} />
                        <CalendarAnalytics data={activeData} />
                    </div>
                    <Staff_AppointmentTable 
                        data={activeData} 
                        filters={activeFilters}
                        onFiltersChange={(newFilters) => updateFilters('appointments', newFilters)}
                    />
                </>
            );
        } else if (activeTab === 'interviews') {
            return (
                <InterviewsContent
                    data={activeData} 
                    filters={activeFilters}
                    onFiltersChange={(newFilters) => updateFilters('interviews', newFilters)}
                />
            );
        }

        return null;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-xl font-bold text-gray-900">Staff Analytics</h1>
                
                {/* Desktop Tabs - Hidden on mobile */}
                <div className="hidden sm:flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden md:block">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Mobile Dropdown - Hidden on desktop */}
                <div className="sm:hidden relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                        <div className="flex items-center space-x-2">
                            {currentTab?.icon}
                            <span className="font-medium">{currentTab?.label}</span>
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                                        activeTab === tab.id 
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {tab.icon}
                                    <span className="font-medium">{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {renderActiveContent()}
        </div>
    );
}