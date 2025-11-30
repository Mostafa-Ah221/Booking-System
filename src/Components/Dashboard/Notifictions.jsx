import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Settings, Bell, Loader2, Calendar, User, Users, CreditCard, MessageCircle, Check, ChevronDown, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, getUnreadCount, markNotificationAsRead, markAllNotificationAsRead } from '../../redux/apiCalls/NotificationsCallApi';
import { useNavigate } from 'react-router-dom';
import notification_icon from '../../assets/image/notification.svg';

const Notifications = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState([]);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const scrollContainerRef = useRef(null);
  const loadingRef = useRef(false);
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimer = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications, unreadCount, loading, error, dataFetched } = useSelector((state) => state.notifications);

  const filterTabs = [
    { key: 'all', label: 'All', icon: Bell },
    { key: 'appointments', label: 'Appointments', icon: Calendar },
    { key: 'clients', label: 'Clients', icon: User },
    { key: 'interviews', label: 'Interviews', icon: MessageCircle },
    { key: 'staff', label: 'Recruiter', icon: Users },
  ];

  // === إغلاق الـ Dropdown عند النقر خارجًا ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // === تحويل الفلتر إلى باراميترات API ===
  const getFiltersForAPI = useCallback((filter) => {
    if (filter === 'all') {
      return { appointments: undefined, clients: undefined, interviews: undefined, staff: undefined };
    }
    return {
      appointments: filter === 'appointments' ? true : undefined,
      clients: filter === 'clients' ? true : undefined,
      interviews: filter === 'interviews' ? true : undefined,
      staff: filter === 'staff' ? true : undefined
    };
  }, []);

  // === تحميل الإشعارات مع AbortController + منع التكرار ===
  const loadNotifications = useCallback((page = 1, filter = activeFilter) => {
    if (loadingRef.current) return;

    // إلغاء الطلب السابق
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const filters = getFiltersForAPI(filter);
    dispatch(getNotifications(page, filters, controller.signal));
  }, [dispatch, activeFilter, getFiltersForAPI]);

  // === تحميل البيانات عند فتح اللوحة ===
  useEffect(() => {
    if (!isOpen) return;

    setCurrentPage(1);
    setAllNotifications([]);
    setIsInitialLoad(true);
    setHasMorePages(false);
    loadingRef.current = false;

    // لا تطلب إلا لو ما جبتش البيانات قبل كده
    if (!dataFetched) {
      loadNotifications(1);
    }
  }, [isOpen, dataFetched, loadNotifications]);

  // === تحديث القائمة عند وصول البيانات ===
  useEffect(() => {
    if (!loading && notifications) {
      const newNotifications = notifications?.notifications?.notifications || [];
      const pagination = notifications?.notifications?.pagination || null;

      setAllNotifications(prev => {
        if (pagination?.current_page === 1) {
          return newNotifications;
        }

        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));
        return uniqueNew.length > 0 ? [...prev, ...uniqueNew] : prev;
      });

      if (pagination) {
        setHasMorePages(pagination.current_page < pagination.last_page);
        setCurrentPage(pagination.current_page);
      }

      setLoadingMore(false);
      setIsInitialLoad(false);
      loadingRef.current = false;
    }
  }, [notifications, loading]);

  // === تغيير الفلتر مع Debounce + AbortController ===
  const handleFilterChange = (filterKey) => {
    if (filterKey === activeFilter) {
      setIsDropdownOpen(false);
      return;
    }

    setActiveFilter(filterKey);
    setIsDropdownOpen(false);
    setCurrentPage(1);
    setAllNotifications([]);
    setIsInitialLoad(true);
    setHasMorePages(false);
    loadingRef.current = false;

    // إلغاء أي طلب سابق
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const filters = getFiltersForAPI(filterKey);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      dispatch(getNotifications(1, filters, controller.signal));
    }, 300);
  };

  // === تحميل المزيد (Infinite Scroll) ===
  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || loadingMore || !hasMorePages || loading) return;

    loadingRef.current = true;
    setLoadingMore(true);

    const filters = getFiltersForAPI(activeFilter);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch(getNotifications(currentPage + 1, filters, controller.signal))
      .finally(() => {
        loadingRef.current = false;
        setLoadingMore(false);
      });
  }, [currentPage, loadingMore, hasMorePages, loading, dispatch, activeFilter, getFiltersForAPI]);

  // === Infinite Scroll عند التمرير ===
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loadingRef.current || loadingMore || !hasMorePages || loading) return;

    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight;

    if (scrollPosition >= scrollHeight * 0.85) {
      handleLoadMore();
    }
  }, [handleLoadMore, loadingMore, hasMorePages, loading]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isOpen) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, isOpen]);

  // === تحديث يدوي ===
  const handleRefresh = () => {
    setCurrentPage(1);
    setAllNotifications([]);
    setIsInitialLoad(true);
    setHasMorePages(false);
    loadingRef.current = false;
    setLoadingMore(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    loadNotifications(1, activeFilter);
  };

  // === النقر على إشعار ===
  const handleNotificationClick = async (notification) => {
    if (markingAsRead === notification.id) return;

    if (!notification.is_read) {
      setMarkingAsRead(notification.id);
      await dispatch(markNotificationAsRead(notification.id));
      setMarkingAsRead(null);

      setAllNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
    }

    const lowerType = notification.type?.toLowerCase() || '';

    // أنواع تتنقل للـ URL
    const urlTypes = ['client_edited','client_created','client_deleted', 'interview_created','interview_edited', 'interview_deleted', 'staff_created','staff_edited','staff_deleted'];
    if (urlTypes.includes(notification.type)) {
      const url = notification?.data?.url;
      if (url) {
        onClose();
        navigate(url);
        return;
      }
    }

    // الحجوزات
    if (lowerType.includes('appointment')) {
      const appointmentId = notification?.data?.appointment_id;
      if (appointmentId) {
        onClose();
        navigate(`/layoutDashboard/userDashboard?appointmentId=${appointmentId}`);
      }
    }
  };

  // === تحديد الكل كمقروء ===
  const handleMarkAllAsRead = async () => {
    if (!allNotifications.some(n => !n.is_read) || markingAllAsRead) return;

    setMarkingAllAsRead(true);
    const success = await dispatch(markAllNotificationAsRead());
    
    if (success) {
      setAllNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
    setMarkingAllAsRead(false);
  };

  // === أيقونة حسب النوع ===
  const getNotificationIcon = (type) => {
    const lowerType = type?.toLowerCase() || '';
    
    if (lowerType.includes('appointment')) return { icon: Calendar, bgColor: 'bg-orange-100', iconColor: 'text-orange-500', bgColorRead: 'bg-orange-50', iconColorRead: 'text-orange-400' };
    if (lowerType.includes('staff')) return { icon: Users, bgColor: 'bg-green-100', iconColor: 'text-green-500', bgColorRead: 'bg-green-50', iconColorRead: 'text-green-400' };
    if (lowerType.includes('client')) return { icon: User, bgColor: 'bg-red-100', iconColor: 'text-red-500', bgColorRead: 'bg-red-50', iconColorRead: 'text-red-400' };
    if (lowerType.includes('payment')) return { icon: CreditCard, bgColor: 'bg-blue-100', iconColor: 'text-blue-500', bgColorRead: 'bg-blue-50', iconColorRead: 'text-blue-400' };
    if (lowerType.includes('interview')) return { icon: MessageCircle, bgColor: 'bg-purple-100', iconColor: 'text-purple-500', bgColorRead: 'bg-purple-50', iconColorRead: 'text-purple-400' };
    
    return { icon: Bell, bgColor: 'bg-blue-100', iconColor: 'text-blue-500', bgColorRead: 'bg-gray-100', iconColorRead: 'text-gray-500' };
  };

  const hasNotifications = allNotifications.length > 0;
  const hasUnreadNotifications = allNotifications.some(n => !n.is_read);
  const currentFilterLabel = filterTabs.find(tab => tab.key === activeFilter)?.label || 'All';

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      
      <div className={`
        fixed right-0 top-0 h-full w-full md:w-3/5 lg:w-[30%] bg-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="border-b bg-white">
          <div className="flex items-center justify-between relative p-4 pt-11">
            <div className="absolute right-4 top-1" onClick={onClose}>
              <button className="p-2 rounded-full hover:bg-gray-200/50 transition-all duration-200">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors w-36 focus:border-blue-500"
                >
                  <span>{currentFilterLabel}</span>
                  <ChevronDown className={`w-4 h-4 ml-1 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                    {filterTabs.map((tab) => {
                      const IconComponent = tab.icon;
                      const isActive = activeFilter === tab.key;

                      return (
                        <button
                          key={tab.key}
                          onClick={() => handleFilterChange(tab.key)}
                          className={`flex items-center w-full px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          <span>{tab.label}</span>
                          {isActive && <Check className="w-4 h-4 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {hasUnreadNotifications && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markingAllAsRead}
                  className="flex items-center space-x-1 px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                >
                  {markingAllAsRead ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Mark all</span>
                </button>
              )}

              <button
                onClick={() => { onClose(); navigate("/layoutDashboard/setting/notification-settings"); }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div ref={scrollContainerRef} className="overflow-y-auto h-[calc(100%-10rem)]">
          {loading && isInitialLoad && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading notifications</h3>
              <p className="text-sm text-gray-500 text-center">{error}</p>
              <button onClick={handleRefresh} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Retry
              </button>
            </div>
          )}

          {!isInitialLoad && !error && hasNotifications && (
            <div className="divide-y">
              {allNotifications.map((notification) => {
                const iconConfig = getNotificationIcon(notification.type);
                const IconComponent = iconConfig.icon;
                const isRead = notification.is_read;
                const isMarking = markingAsRead === notification.id;

                return (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isMarking ? 'opacity-60' : ''}`}
                    onClick={() => !isMarking && handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isRead ? iconConfig.bgColorRead : iconConfig.bgColor}`}>
                        {isMarking ? (
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        ) : (
                          <IconComponent className={`w-5 h-5 ${isRead ? iconConfig.iconColorRead : iconConfig.iconColor}`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className={`text-sm ${isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                            {notification.title || notification.message}
                          </p>
                          {!isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></span>}
                        </div>
                        
                        {notification.message && notification.message !== notification.title && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-1 flex gap-1 items-center">
                          <Calendar className='w-4 h-4'/>
                          {notification.created_at ? new Date(notification.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : 'Just now'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {loadingMore && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Loading more...</span>
                </div>
              )}

              {hasMorePages && !loadingMore && !loading && (
                <div className="flex items-center justify-center py-4">
                  <button onClick={handleLoadMore} className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                    Load more
                  </button>
                </div>
              )}

              {!hasMorePages && allNotifications.length > 5 && (
                <div className="flex items-center justify-center py-4">
                  <span className="text-xs text-gray-400">You've reached the end</span>
                </div>
              )}
            </div>
          )}

          {!loading && !error && !hasNotifications && !isInitialLoad && (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <img src={notification_icon} alt="No notifications" className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg text-black font-semibold">No notifications</h3>
              {activeFilter !== 'all' && (
                <button onClick={() => handleFilterChange('all')} className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Progress */}
        {notifications?.pagination && hasNotifications && !isInitialLoad && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-50 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Showing {allNotifications.length} of {notifications.pagination.total}</span>
              {hasMorePages && (
                <span className="text-blue-600">
                  Page {notifications.pagination.current_page} of {notifications.pagination.last_page}
                </span>
              )}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(allNotifications.length / notifications.pagination.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;