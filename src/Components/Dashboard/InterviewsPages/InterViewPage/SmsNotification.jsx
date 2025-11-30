import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Clock, X, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { notificationReminder } from '../../../../redux/apiCalls/interviewCallApi';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { fetchSmsSettings, fetchSmsIntegrations } from '../../../../redux/apiCalls/smsIntegrationCallApi';

const SMSNotificationsSection = () => {
  const dispatch = useDispatch();
  const { id } = useOutletContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('customer');
  const [reminders, setReminders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [smsIntegrated, setSmsIntegrated] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isCheckingIntegrations, setIsCheckingIntegrations] = useState(false);
  const [hasValidIntegration, setHasValidIntegration] = useState(false);
  const [activeIntegrationName, setActiveIntegrationName] = useState('');
  
  const { integrations, settings, loading } = useSelector((state) => state.sms);
  
  // Ref for debounce timeout
  const saveTimeoutRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const pendingChangesRef = useRef(null);

  const isSmsIntegrated = !loading && !isCheckingIntegrations && hasValidIntegration;
  
  const smsNotificationTypes = [
    { id: 'booked', icon: <MessageSquare className="w-6 h-6 text-gray-400" />, label: 'Booked' },
    { id: 'rescheduled', icon: <Clock className="w-6 h-6 text-gray-400" />, label: 'Rescheduled' },
    { id: 'cancelled', icon: <X className="w-6 h-6 text-gray-400" />, label: 'Cancelled' },
    { id: 'completed', icon: <CheckCircle className="w-6 h-6 text-gray-400" />, label: 'Completed' },
    { id: 'noshow', icon: <AlertCircle className="w-6 h-6 text-gray-400" />, label: 'No Show' },
  ];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const saveRemindersToAPI = async (updatedReminders) => {
    if (!isSmsIntegrated) {
      return;
    }

    try {
      const formData = {
        methods: [
          {
            name: "sms",
            reminders: updatedReminders.map(reminder => ({
              before: String(reminder.before),
              type: reminder.type
            }))
          }
        ]
      };

      console.log('Saving SMS reminders to API:', formData);
      const result = await dispatch(notificationReminder(id, formData));
      
      if (result.status) {
        console.log('✅ SMS reminders saved successfully!');
      } else {
        console.error('❌ Failed to save SMS reminders:', result.message);
        alert(result.message || 'An error occurred while saving SMS reminders');
      }
    } catch (error) {
      console.error('❌ Error while saving SMS reminders:', error);
      alert('An error occurred while saving SMS reminders');
    } finally {
      setIsSaving(false);
    }
  };

  // Save pending changes on blur
  const handleInputBlur = () => {
    if (pendingChangesRef.current) {
      const { reminders, reminderId, field } = pendingChangesRef.current;
      
      // Validate if it's a 'before' field
      if (field === 'before') {
        const validatedReminders = reminders.map(reminder => {
          if (reminder.id === reminderId) {
            const currentValue = reminder.before;
            let numValue;
            
            if (currentValue === '' || currentValue === null || currentValue === undefined) {
              numValue = 1;
            } else {
              numValue = parseInt(currentValue, 10);
              if (isNaN(numValue) || numValue < 1) {
                numValue = 1;
              }
            }
            
            return { ...reminder, before: numValue };
          }
          return reminder;
        });
        
        setReminders(validatedReminders);
        saveRemindersToAPI(validatedReminders);
      } else {
        saveRemindersToAPI(reminders);
      }
      
      pendingChangesRef.current = null;
    }
  };

  // Function to check all integrations for valid SMS settings
  const checkAllSmsIntegrations = async () => {
    if (!integrations || !Array.isArray(integrations) || integrations.length === 0) {
      console.log('No integrations available to check');
      setHasValidIntegration(false);
      setActiveIntegrationName('');
      return;
    }

    setIsCheckingIntegrations(true);
    
    try {
      console.log('Checking SMS integrations:', integrations);
      
      for (const integration of integrations) {
        console.log(`Checking integration ID: ${integration.id}`);
        
        const result = await dispatch(fetchSmsSettings(integration.id));
        
        if (result.status && result.data !== null) {
          console.log(`✅ Found valid SMS integration with ID: ${integration.id}`);
          setHasValidIntegration(true);
          setActiveIntegrationName(integration.name || integration.provider || 'Unknown Integration');
          return;
        } else {
          console.log(`❌ Integration ID ${integration.id} returned null or failed`);
        }
      }
      
      console.log('No valid SMS integrations found');
      setHasValidIntegration(false);
      setActiveIntegrationName('');
    } catch (error) {
      console.error('Error checking SMS integrations:', error);
      setHasValidIntegration(false);
      setActiveIntegrationName('');
    } finally {
      setIsCheckingIntegrations(false);
    }
  };

  // إضافة تذكير جديد
  const addReminder = async () => {
    const templateReminder = reminders.length > 0 ? reminders[reminders.length - 1] : null;
    
    const newReminder = {
      id: Date.now(),
      before: templateReminder ? templateReminder.before : 30,
      type: templateReminder ? templateReminder.type : 'minute'
    };
    
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    
    await saveRemindersToAPI(updatedReminders);
    console.log('تم إضافة تذكير SMS جديد:', newReminder);
  };

  // تحديث تذكير
  const updateReminder = (id, field, value) => {
    // Update state immediately for smooth typing
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id
        ? { ...reminder, [field]: value }
        : reminder
    );

    setReminders(updatedReminders);
    
    // Store pending changes
    pendingChangesRef.current = {
      reminders: updatedReminders,
      reminderId: id,
      field: field
    };
    
    // Clear any existing timeout (don't save while typing)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Show saving indicator
    setIsSaving(true);
  };

  // حذف تذكير
  const removeReminder = async (id) => {
    if (reminders.length > 1) {
      // Clear any pending saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      const filteredReminders = reminders.filter(reminder => reminder.id !== id);
      setReminders(filteredReminders);
      
      // Save immediately when deleting
      setIsSaving(true);
      await saveRemindersToAPI(filteredReminders);
    }
  };

  // Fetch SMS integrations when component mounts
  useEffect(() => {
    dispatch(fetchSmsIntegrations());
  }, [dispatch]);

  // Check all integrations when integrations data is available
  useEffect(() => {
    if (integrations && Array.isArray(integrations) && integrations.length > 0 && !isCheckingIntegrations) {
      console.log('Integrations loaded, checking all SMS integrations...');
      checkAllSmsIntegrations();
    }
  }, [integrations]);

  // Mark data as ready when loading is complete and checking is done
  useEffect(() => {
    if (!loading && !isCheckingIntegrations && !isDataReady) {
      console.log('SMS data is ready, hasValidIntegration:', hasValidIntegration);
      setIsDataReady(true);
    }
  }, [loading, isCheckingIntegrations, hasValidIntegration, isDataReady]);

  const handleNavigateToIntegrations = (type) => {
    navigate('/layoutDashboard/setting/integrations-page', {
      state: { scrollTo: type },
      replace: false
    });
  };

  // Initialize reminders only when data is ready and not yet initialized
  useEffect(() => {
    if (isDataReady && reminders.length === 0 && !hasInitializedRef.current) {
      console.log('Initializing default reminder with SMS status:', hasValidIntegration);
      
      const defaultReminder = { id: 1, before: 30, type: 'minute' };
      const initialReminders = [defaultReminder];
      setReminders(initialReminders);
      
      // Only save if SMS is integrated
      if (hasValidIntegration) {
        console.log('SMS integrated, saving initial reminders...');
        saveRemindersToAPI(initialReminders);
      } else {
        console.log('SMS not integrated, not saving initial reminders');
      }
      
      hasInitializedRef.current = true;
    }
  }, [isDataReady, hasValidIntegration, reminders.length]);

  return (
    <div className="mx-auto p-6 bg-white">
      {/* Header */}
      <h2 className="text-xl font-medium mb-6 text-gray-900">SMS Notifications and Reminders</h2>
      
      {/* Loading indicator */}
      {(loading || isCheckingIntegrations) && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            {isCheckingIntegrations ? 'Checking SMS integrations...' : 'Loading SMS settings...'}
          </span>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-0 py-3 mr-8 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'customer'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('customer')}
        >
          To Customer
        </button>
        <button
          className={`px-0 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'recruiter'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('recruiter')}
        >
          To Tutor
        </button>
      </div>

      {/* Notifications Section */}
      <div className={`mb-10 ${!isSmsIntegrated || loading || isCheckingIntegrations ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-base font-medium mb-2 text-gray-900">Notifications</h3>
        <p className="text-sm text-gray-500 mb-6">
          Send customized SMS updates to {activeTab === 'customer' ? 'users' : 'tutors'} at every stage of an appointment.
        </p>
        
        <div className="grid grid-cols-5 gap-4">
          {smsNotificationTypes.map((type) => (
            <div
              key={type.id}
              className={`flex flex-col items-center p-6 bg-gray-50 rounded-lg transition-colors cursor-pointer ${
                isSmsIntegrated && !loading && !isCheckingIntegrations ? 'hover:bg-gray-100' : 'cursor-not-allowed'
              }`}
            >
              <div className="mb-3">{type.icon}</div>
              <span className="text-sm text-gray-600 text-center">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reminders Section */}
      <div className={`mb-10 ${!isSmsIntegrated || loading || isCheckingIntegrations ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium text-gray-900">Reminders</h3>
          {isSaving && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span>Saving...</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Remind users of their upcoming appointment via SMS.
        </p>
        
        {/* قائمة التذكيرات */}
        <div className="space-y-4 mb-4">
          {reminders.map((reminder, index) => (
            <div key={reminder.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 min-w-[50px]">Before</span>
              <input
                type="text"
                value={reminder.before}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string or numbers only
                  if (value === '' || /^\d+$/.test(value)) {
                    updateReminder(reminder.id, 'before', value);
                  }
                }}
                onBlur={handleInputBlur}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving || !isSmsIntegrated || loading || isCheckingIntegrations}
              />
              <select 
                value={reminder.type}
                onChange={(e) => updateReminder(reminder.id, 'type', e.target.value)}
                onBlur={handleInputBlur}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving || !isSmsIntegrated || loading || isCheckingIntegrations}
              >
                <option value="minute">Minutes</option>
                <option value="hour">Hours</option>
                <option value="day">Days</option>
              </select>
              {reminders.length > 1 && (
                <button
                  onClick={() => removeReminder(reminder.id)}
                  disabled={isSaving || !isSmsIntegrated || loading || isCheckingIntegrations}
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
          disabled={isSaving || !isSmsIntegrated || loading || isCheckingIntegrations}
          className="flex items-center space-x-2 text-blue-600 text-sm hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Reminders</span>
        </button>
      </div>

      {/* SMS Configurations */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">!</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                SMS Configurations {hasValidIntegration && activeIntegrationName && (
                  <span className="text-green-600">(Integrated with {activeIntegrationName})</span>
                )}
                {(loading || isCheckingIntegrations) && <span className="text-gray-500">(Loading...)</span>}
              </h3>
              <p className="text-sm text-gray-600">
                To send SMS alerts, first integrate an SMS gateway and enable it.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNavigateToIntegrations('sms')}
            disabled={loading || isCheckingIntegrations}
            className="px-4 py-2 bg-white border border-orange-300 text-orange-700 text-sm font-medium rounded-md hover:bg-orange-50 transition-colors disabled:opacity-50"
          >
            {(loading || isCheckingIntegrations) ? 'Loading...' : 'Integrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSNotificationsSection;