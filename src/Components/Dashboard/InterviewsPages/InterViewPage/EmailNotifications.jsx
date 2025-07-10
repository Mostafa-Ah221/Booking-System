import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Clock, Calendar, X, Check, Eye, Plus, Trash2 } from 'lucide-react';
import { notificationReminder } from '../../../../redux/apiCalls/interviewCallApi';
import { useOutletContext } from 'react-router-dom';
import SMSNotificationsSection from './SmsNotification';

const EmailNotifications = () => {
  const dispatch = useDispatch();
  const { id } = useOutletContext();
  
  const [activeTab, setActiveTab] = useState('customer');
  const [includeBufferTime, setIncludeBufferTime] = useState(true);
  const [eventTitle, setEventTitle] = useState('%servicename% with %customername%');
  const [currentType, setCurrentType] = useState('email');
  const [isSaving, setIsSaving] = useState(false);
  
  const [reminders, setReminders] = useState([]);

  // Function to get type from current URL
  const getTypeFromPath = () => {
    const path = window.location.pathname;
    if (path.includes('/sms')) return 'sms';
    if (path.includes('/calendar')) return 'calendar';
    return 'email';
  };

  // Update type when component mounts or when pathname changes
  useEffect(() => {
    const type = getTypeFromPath();
    setCurrentType(type);

    const handleNavigation = () => {
      const newType = getTypeFromPath();
      if (newType !== currentType) {
        setCurrentType(newType);
      }
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('navigation-change', handleNavigation);

    const intervalId = setInterval(() => {
      const newType = getTypeFromPath();
      if (newType !== currentType) {
        setCurrentType(newType);
      }
    }, 100);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('navigation-change', handleNavigation);
      clearInterval(intervalId);
    };
  }, [currentType]);

  // وظيفة حفظ التذكيرات في الـ API
  const saveRemindersToAPI = async (updatedReminders) => {
    try {
      setIsSaving(true);
      
      const formData = {
        method: currentType, // email, sms, calendar
        reminders: updatedReminders.map(reminder => ({
          before: String(reminder.before),
          type: reminder.type
        }))
      };

      console.log('🚀 حفظ التذكيرات تلقائياً...');
      console.log('البيانات المرسلة:', formData);

      const result = await dispatch(notificationReminder(id, formData));
      
      if (result.status) {
        console.log('✅ تم حفظ الإشعارات بنجاح!');
      } else {
        console.error('❌ فشل في حفظ الإشعارات:', result.message);
        alert(result.message || 'حدث خطأ في حفظ التذكيرات');
      }
    } catch (error) {
      console.error('❌ خطأ في حفظ التذكيرات:', error);
      alert('حدث خطأ في حفظ التذكيرات');
    } finally {
      setIsSaving(false);
    }
  };

  // إضافة تذكير جديد وحفظه فوراً
  const addReminder = async () => {
    // نسخ قيم آخر تذكير في القائمة
    const templateReminder = reminders.length > 0 ? reminders[reminders.length - 1] : null;
    
    const newReminder = {
      id: Date.now(),
      before: templateReminder ? templateReminder.before : 30,
      type: templateReminder ? templateReminder.type : 'minute'
    };
    
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    
    // حفظ فوري في الـ API
    await saveRemindersToAPI(updatedReminders);
    
    console.log('تم إضافة تذكير جديد بناءً على آخر reminder:', newReminder);
  };

  // تحديث تذكير وحفظه فوراً
  const updateReminder = async (id, field, value) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, [field]: value }
        : reminder
    );
    
    setReminders(updatedReminders);
    
    // حفظ فوري في الـ API
    await saveRemindersToAPI(updatedReminders);
    
    console.log(`تم تحديث التذكير ${id} وحفظه:`, { field, value });
  };

  // حذف تذكير وحفظ التغيير فوراً
  const removeReminder = async (id) => {
    if (reminders.length > 1) {
      const filteredReminders = reminders.filter(reminder => reminder.id !== id);
      setReminders(filteredReminders);
      
      // حفظ فوري في الـ API
      await saveRemindersToAPI(filteredReminders);
      
      console.log(`تم حذف التذكير ${id} وحفظ التغيير`);
    }
  };

  // حفظ أول تذكير عند تحميل الكومبوننت
  useEffect(() => {
    if (reminders.length === 0) {
      const defaultReminder = { id: 1, before: 30, type: 'minute' };
      const initialReminders = [defaultReminder];
      setReminders(initialReminders);
      
      // حفظ التذكير الافتراضي في الـ API
      saveRemindersToAPI(initialReminders);
    }
  }, [currentType]); // يعيد تعيين التذكير عند تغيير النوع

  const notificationTypes = [
    { id: 'booked', icon: <Calendar className="w-5 h-5" />, label: 'Booked' },
    { id: 'rescheduled', icon: <Clock className="w-5 h-5" />, label: 'Rescheduled' },
    { id: 'cancelled', icon: <X className="w-5 h-5" />, label: 'Cancelled' },
    { id: 'completed', icon: <Check className="w-5 h-5" />, label: 'Completed' },
    { id: 'noshow', icon: <Eye className="w-5 h-5" />, label: 'No Show' },
  ];

  const getTitle = () => {
    switch(currentType) {
      case 'sms': return 'SMS Notifications and Reminders';
      case 'calendar': return 'Calendar Invites';
      default: return 'Email Notifications and Reminders';
    }
  };

  const renderEmailContent = () => (
    <>
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 mr-4 ${
            activeTab === 'customer'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('customer')}
        >
          To Customer
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'recruiter'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('recruiter')}
        >
          To Recruiter
        </button>
      </div>

      {/* Notifications Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Notifications</h3>
        <p className="text-gray-600 mb-4">
          Send customized email updates to {activeTab === 'customer' ? 'customers' : 'users'} at every stage of an appointment.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {notificationTypes.map((type) => (
            <div
              key={type.id}
              className="p-4 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="text-gray-600 mb-2">{type.icon}</div>
              <span className="text-sm">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reminders Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Reminders</h3>
          {isSaving && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span>Saving...</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-4">
          Remind {activeTab === 'customer' ? 'customers' : 'users'} of their upcoming appointments via email.
        </p>
        
        {/* قائمة التذكيرات */}
        <div className="space-y-4 mb-4">
          {reminders.map((reminder, index) => (
            <div key={reminder.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Before</span>
              <input
                type="number"
                value={reminder.before}
                onChange={(e) => updateReminder(reminder.id, 'before', e.target.value)}
                className="w-20 px-3 py-2 border rounded-md"
                min="1"
                disabled={isSaving}
              />
              <select 
                value={reminder.type}
                onChange={(e) => updateReminder(reminder.id, 'type', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
                disabled={isSaving}
              >
                <option value="minute">Minutes</option>
                <option value="hour">Hours</option>
                <option value="day">Days</option>
              </select>
              {reminders.length > 1 && (
                <button
                  onClick={() => removeReminder(reminder.id)}
                  disabled={isSaving}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  title="حذف التذكير"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* زر إضافة تذكير جديد */}
        <button 
          onClick={addReminder}
          disabled={isSaving}
          className="flex items-center space-x-1 text-blue-600 text-sm hover:underline hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminders</span>
        </button>
      </div>

      {/* Email Configurations */}
      <div>
        <h3 className="text-lg font-medium mb-4">Email Configurations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Send from</label>
            <select className="w-full p-2 border rounded-md text-sm">
              <option>
                {activeTab === 'customer'
                  ? 'Default Bookings email address'
                  : "Super admin's email address"}
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Reply to</label>
            <select className="w-full p-2 border rounded-md text-sm">
              <option>
                {activeTab === 'customer'
                  ? "Allocated staff member's email address"
                  : "Customer's Email address"}
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Copy(Cc)</label>
            <select className="w-full p-2 border rounded-md text-sm">
              <option>Select Copy (Cc)</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );



  const renderCalendarContent = () => (
    <>
      {/* Include Buffer Time */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Include Buffer Time</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeBufferTime}
              onChange={(e) => setIncludeBufferTime(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p className="text-sm text-gray-600">
          Adds pre-buffer and post-buffer times to the appointment duration in calendar invites.
        </p>
      </div>

      {/* Event Title */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Event Title</h3>
        <p className="text-sm text-gray-600 mb-3">
          Set a title that appears in calendar events, online meetings, assist sessions, and ICS files (Max 255 characters).
        </p>
        <div className="mb-2">
          <label className="block text-sm text-gray-600 mb-1">Subject</label>
          <div className="flex">
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-l-md text-sm"
              placeholder="Enter event title..."
            />
            <button className="px-4 py-2 border border-l-0 rounded-r-md bg-gray-50 text-sm hover:bg-gray-100">
              Insert Variable ▼
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Calendar Integration Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Default Calendar</label>
            <select className="w-full p-2 border rounded-md text-sm">
              <option>Google Calendar</option>
              <option>Outlook Calendar</option>
              <option>Apple Calendar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Time Zone</label>
            <select className="w-full p-2 border rounded-md text-sm">
              <option>Auto-detect</option>
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meeting Details */}
      <div>
        <h3 className="text-lg font-medium mb-4">Meeting Details</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Include meeting location in calendar invite</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Include appointment notes in description</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Send calendar invites automatically</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch(currentType) {
      case 'sms': return (
        <SMSNotificationsSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reminders={reminders}
          updateReminder={updateReminder}
          addReminder={addReminder}
          removeReminder={removeReminder}
          isSaving={isSaving}
        />
      );
      case 'calendar': return renderCalendarContent();
      default: return renderEmailContent();
    }
  };

  return (
    <div className="w-full  mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        <p className="text-sm text-gray-500 mt-1">Current type: {currentType}</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default EmailNotifications;