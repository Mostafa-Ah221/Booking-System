import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import AppointmentTable from "./AppointmentTable";
import CalendarAnalytics from "./CalendarAnalytics";
import ChartsSection, { Chart2 } from "./ChartsSection";
import StatisticsCards from "./StatisticsCards";
import Loader from '../../Loader';
import InterviewsContent from './InterviewsContent';
import RecruitersContent from './RecruitersContent';
import ClientsContent from './ClientsContent';
import { usePermission } from '../../hooks/usePermission';
import { Calendar, ChevronDown, FileText, User, Users, Filter, X } from 'lucide-react';

export default function Analytics() {
    const canViewAppointment = usePermission("view appointment");
    const canViewInterview = usePermission("view interview");
    const canViewStaff = usePermission("view staff");
    const canViewClients = usePermission("view clients");

    const [activeTab, setActiveTab] = useState('appointments'); // قيمة افتراضية مؤقتة

    // useEffect لتحديث activeTab عند تحميل الصلاحيات
    useEffect(() => {
        // التأكد من أن الصلاحيات تحملت قبل التحديث
        if (canViewAppointment !== undefined || canViewInterview !== undefined || 
            canViewStaff !== undefined || canViewClients !== undefined) {
            
            // اختيار أول تبويب متاح
            if (canViewAppointment) {
                setActiveTab('appointments');
            } else if (canViewInterview) {
                setActiveTab('interviews');
            } else if (canViewStaff) {
                setActiveTab('recruiters');
            } else if (canViewClients) {
                setActiveTab('customers');
            }
        }
    }, [canViewAppointment, canViewInterview, canViewStaff, canViewClients]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showAppointmentFilters, setShowAppointmentFilters] = useState(false);
    const dropdownRef = useRef(null);

    // State للـ filters لكل تبويب
    const [filters, setFilters] = useState({
        appointments: {
            start_date: '',
            end_date: ''
        },
        interviews: {
            start_price_interval: '',
            end_price_interval: ''
        },
        recruiters: {
            start_date: '',
            end_date: ''
        },
        customers: {
            start_date: '',
            end_date: ''
        }
    });

    // Local filters for appointments
    const [localAppointmentFilters, setLocalAppointmentFilters] = useState(filters.appointments);

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

    // Helper function لبناء query string
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

    const fetchAppointmentAnalytics = async () => {
        const token = localStorage.getItem("access_token");
        const queryString = buildQueryString(filters.appointments);
      
        const response = await fetch(`https://backend-booking.appointroll.com/api/analytics/dashboard/appointments${queryString}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        return data;
    };

    const fetchInterviewAnalytics = async () => {
        const token = localStorage.getItem("access_token");
        const queryString = buildQueryString(filters.interviews);
      
        const response = await fetch(`https://backend-booking.appointroll.com/api/analytics/dashboard/interviews${queryString}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        return data;
    };

    const fetchRecruiterAnalytics = async () => {
        const token = localStorage.getItem("access_token");
        const queryString = buildQueryString(filters.recruiters);
      
        const response = await fetch(`https://backend-booking.appointroll.com/api/analytics/dashboard/recruiters${queryString}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        return data;
    };

    const fetchClientsAnalytics = async () => {
        const token = localStorage.getItem("access_token");
        const queryString = buildQueryString(filters.customers);
      
        const response = await fetch(`https://backend-booking.appointroll.com/api/analytics/dashboard/clients${queryString}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data = await response.json();
        return data;
    };

    // استخدام multiple useQuery hooks مع dependency على الـ filters والصلاحيات
    const {
        data: appointmentsData,
        isLoading: appointmentsLoading,
        isError: appointmentsError,
        error: appointmentsErrorDetails,
        refetch: refetchAppointments
    } = useQuery({
        queryKey: ['analytics-appointments', filters.appointments],
        queryFn: fetchAppointmentAnalytics,
        enabled: Boolean(canViewAppointment), // تحويل إلى boolean صريح
        refetchInterval: canViewAppointment ? 5 * 60 * 1000 : false,
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
        queryKey: ['analytics-interviews', filters.interviews],
        queryFn: fetchInterviewAnalytics,
        enabled: Boolean(canViewInterview), // تحويل إلى boolean صريح
        refetchInterval: canViewInterview ? 5 * 60 * 1000 : false,
        staleTime: 2 * 60 * 1000,
        retry: 3,
    });

    const {
        data: recruitersData,
        isLoading: recruitersLoading,
        isError: recruitersError,
        error: recruitersErrorDetails,
        refetch: refetchRecruiters
    } = useQuery({
        queryKey: ['analytics-recruiters', filters.recruiters],
        queryFn: fetchRecruiterAnalytics,
        enabled: Boolean(canViewStaff), // تحويل إلى boolean صريح
        refetchInterval: canViewStaff ? 5 * 60 * 1000 : false,
        staleTime: 2 * 60 * 1000,
        retry: 3,
    });

    const {
        data: clientsData,
        isLoading: clientsLoading,
        isError: clientsError,
        error: clientsErrorDetails,
        refetch: refetchClients
    } = useQuery({
        queryKey: ['analytics-clients', filters.customers],
        queryFn: fetchClientsAnalytics,
        enabled: Boolean(canViewClients), 
        refetchInterval: canViewClients ? 5 * 60 * 1000 : false,
        staleTime: 2 * 60 * 1000,
        retry: 3,
    });

    const analyticsData = {
        appointments: appointmentsData,
        interviews: interviewsData,
        recruiters: recruitersData,
        customers: clientsData
    };

    // وظيفة للحصول على البيانات النشطة
    const getActiveData = () => {
        switch(activeTab) {
            case 'appointments':
                return analyticsData.appointments;
            case 'interviews':
                return analyticsData.interviews;
            case 'recruiters':
                return analyticsData.recruiters;
            case 'customers':
                return analyticsData.customers;
            default:
                return analyticsData.appointments;
        }
    };

    // وظيفة لتحديث الفلاتر
    const updateFilters = (tabId, newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [tabId]: {
                ...prevFilters[tabId],
                ...newFilters
            }
        }));
    };

    // وظيفة للحصول على الفلاتر النشطة
    const getActiveFilters = () => {
        return filters[activeTab] || {};
    };

    // Handle appointment filter changes
    const handleAppointmentFilterChange = (key, value) => {
        setLocalAppointmentFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Apply appointment filters
    const applyAppointmentFilters = () => {
        updateFilters('appointments', localAppointmentFilters);
        setShowAppointmentFilters(false);
    };

    // Clear appointment filters
    const clearAppointmentFilters = () => {
        const clearedFilters = {
            start_date: '',
            end_date: ''
        };
        setLocalAppointmentFilters(clearedFilters);
        updateFilters('appointments', clearedFilters);
    };

    // Check if appointment filters are active
    const hasActiveAppointmentFilters = filters.appointments.start_date || filters.appointments.end_date;

    // بيانات التبويبات
    const tabs = [
        canViewAppointment && { id: 'appointments', label: 'Appointments', icon: <Calendar size={18} /> },
        canViewInterview && { id: 'interviews', label: 'Interviews', icon: <FileText size={18} />},
        canViewStaff && { id: 'recruiters', label: 'Recruiters', icon: <Users size={18} /> },
        canViewClients && { id: 'customers', label: 'customers', icon: <User size={18} /> }
    ].filter(Boolean);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setIsDropdownOpen(false);
    };

    const currentTab = tabs.find(tab => tab.id === activeTab);

    // التحقق من loading state - فقط للتبويبات المفعلة
    const isLoading = (
        (canViewAppointment && appointmentsLoading) ||
        (canViewInterview && interviewsLoading) ||
        (canViewStaff && recruitersLoading) ||
        (canViewClients && clientsLoading)
    );
    
    // التحقق من error state - فقط للتبويبات المفعلة
    const isError = (
        (canViewAppointment && appointmentsError) ||
        (canViewInterview && interviewsError) ||
        (canViewStaff && recruitersError) ||
        (canViewClients && clientsError)
    );
    
    // جمع كل الأخطاء - فقط للتبويبات المفعلة
    const errors = [
        canViewAppointment && appointmentsError && appointmentsErrorDetails,
        canViewInterview && interviewsError && interviewsErrorDetails,
        canViewStaff && recruitersError && recruitersErrorDetails,
        canViewClients && clientsError && clientsErrorDetails
    ].filter(Boolean);

    // refetch function لكل البيانات المفعلة فقط
    const refetchAll = () => {
        if (canViewAppointment) refetchAppointments();
        if (canViewInterview) refetchInterviews();
        if (canViewStaff) refetchRecruiters();
        if (canViewClients) refetchClients();
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-lg"> 
                    <Loader/>
                </div>
            </div>
        );
    }


    const renderActiveContent = () => {
        const activeData = getActiveData();
        const activeFilters = getActiveFilters();

        switch(activeTab) {
            case 'appointments':
                if (!canViewAppointment) return null;
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
                            <StatisticsCards data={activeData} />
                            <ChartsSection data={activeData} />
                            <Chart2 data={activeData} />
                            <CalendarAnalytics data={activeData} />
                        </div>
                        <AppointmentTable 
                            data={activeData} 
                            filters={activeFilters}
                            onFiltersChange={(newFilters) => updateFilters('appointments', newFilters)}
                        />
                    </>
                );
            case 'interviews':
                if (!canViewInterview) return null;
                return (
                    <InterviewsContent 
                        data={activeData} 
                        filters={activeFilters}
                        onFiltersChange={(newFilters) => updateFilters('interviews', newFilters)}
                    />
                );
            case 'recruiters':
                if (!canViewStaff) return null;
                return (
                    <RecruitersContent 
                        data={activeData} 
                        filters={activeFilters}
                        onFiltersChange={(newFilters) => updateFilters('recruiters', newFilters)}
                    />
                );
            case 'customers':
                if (!canViewClients) return null;
                return (
                    <ClientsContent 
                        data={activeData} 
                        filters={activeFilters}
                        onFiltersChange={(newFilters) => updateFilters('customers', newFilters)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                
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