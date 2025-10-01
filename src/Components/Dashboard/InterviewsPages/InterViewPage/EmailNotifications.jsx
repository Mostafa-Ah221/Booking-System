import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, Calendar, X, Check, Eye, Plus, Trash2, MessageSquare, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { notificationReminder } from '../../../../redux/apiCalls/interviewCallApi';
import { fetchSmsSettings, fetchSmsIntegrations } from '../../../../redux/apiCalls/smsIntegrationCallApi';
import { fetchWhatsAppSettings, fetchWhatsAppIntegrations } from '../../../../redux/apiCalls/whatsAppCallApi';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";

const UnifiedNotifications = () => {
  const dispatch = useDispatch();
  const { id } = useOutletContext();
  
  const [activeTab, setActiveTab] = useState('customer');
  const [currentType, setCurrentType] = useState('email');
  const [isSaving, setIsSaving] = useState(false);
  const { interview } = useSelector(state => state.interview);
  
  const [allReminders, setAllReminders] = useState([]);
  
  const [isDataReady, setIsDataReady] = useState(false);
  const [isCheckingIntegrations, setIsCheckingIntegrations] = useState(false);
  const [hasValidSmsIntegration, setHasValidSmsIntegration] = useState(false);
  const [hasValidWhatsAppIntegration, setHasValidWhatsAppIntegration] = useState(false);
  const [activeSmsIntegrationName, setActiveSmsIntegrationName] = useState('');
  const [activeWhatsAppIntegrationName, setActiveWhatsAppIntegrationName] = useState('');
  
  const { integrations: smsIntegrations, settings: smsSettings, loading: smsLoading } = useSelector((state) => state.sms);
  const { integrationsWhatsApp, settings: whatsAppSettings, loading: whatsAppLoading } = useSelector((state) => state.whatsApp);
  
  const loading = smsLoading || whatsAppLoading;
  const isSmsIntegrated = !loading && !isCheckingIntegrations && hasValidSmsIntegration;
  const isWhatsAppIntegrated = !loading && !isCheckingIntegrations && hasValidWhatsAppIntegration;

  // Ref to track if initial reminders have been set
  const hasInitializedRef = useRef(false);

  console.log('SMS Integrations:', smsIntegrations);
  console.log('WhatsApp Integrations:', integrationsWhatsApp);

  const getTypeFromPath = () => {
    const path = window.location.pathname;
    if (path.includes('/sms')) return 'sms';
    if (path.includes('/whatsApp')) return 'whatsApp';
    return 'email';
  };

  const getCurrentReminders = () => {
    return allReminders.filter(reminder => 
      reminder.method.toLowerCase() === currentType.toLowerCase()
    );
  };

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

  // Initialize reminders from interview.reminders or set defaults
  useEffect(() => {
    if (isDataReady && interview?.reminders && !hasInitializedRef.current) {
      if (interview.reminders.length > 0) {
        // Load existing reminders, normalizing method to camelCase
        const loadedReminders = interview.reminders.map(reminder => ({
          id: reminder.id,
          before: parseInt(reminder.before, 10),
          type: reminder.type,
          method: reminder.method.toLowerCase() === 'whatsapp' ? 'whatsApp' : reminder.method
        }));
        setAllReminders(loadedReminders);
      } else {
        // Set default reminders for email, SMS, and WhatsApp
        const defaultReminders = [
          { id: Date.now(), before: 30, type: 'minute', method: 'email' },
          { id: Date.now() + 1, before: 30, type: 'minute', method: 'sms' },
          { id: Date.now() + 2, before: 60, type: 'minute', method: 'whatsApp' }
        ];
        
        setAllReminders(defaultReminders);
        saveAllRemindersToAPI(defaultReminders);
      }
      hasInitializedRef.current = true;
    }
  }, [isDataReady, interview?.reminders]);

  const saveAllRemindersToAPI = async (updatedReminders) => {
    try {
      setIsSaving(true);
      
      const emailReminders = updatedReminders.filter(r => r.method === 'email');
      const smsReminders = updatedReminders.filter(r => r.method === 'sms');
      const whatsAppReminders = updatedReminders.filter(r => r.method === 'whatsApp');
      
      const methods = [];
      
      if (emailReminders.length > 0) {
        methods.push({
          name: 'email',
          reminders: emailReminders.map(reminder => ({
            before: String(reminder.before),
            type: reminder.type
          }))
        });
      }
      
      if (smsReminders.length > 0 && isSmsIntegrated) {
        methods.push({
          name: 'sms',
          reminders: smsReminders.map(reminder => ({
            before: String(reminder.before),
            type: reminder.type
          }))
        });
      }
      
      if (whatsAppReminders.length > 0 && isWhatsAppIntegrated) {
        methods.push({
          name: 'whatsapp', // Send as 'whatsapp' to match API
          reminders: whatsAppReminders.map(reminder => ({
            before: String(reminder.before),
            type: reminder.type
          }))
        });
      }

      const formData = { methods };

      const result = await dispatch(notificationReminder(id, formData));
      
      if (result.status) {
        toast.success('Reminders saved successfully!');
      } else {
        toast.error(result.message || 'An error occurred while saving reminders');
      }
    } catch (error) {
      toast.error('An error occurred while saving reminders');
      console.error('Save reminders error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addReminder = async (methodType = currentType) => {
    if (methodType === 'sms' && !isSmsIntegrated) {
      toast.error('SMS integration is required to add SMS reminders');
      return;
    }
    
    if (methodType === 'whatsApp' && !isWhatsAppIntegrated) {
      toast.error('WhatsApp integration is required to add WhatsApp reminders');
      return;
    }
    
    const templateReminder = allReminders.length > 0 ? allReminders[allReminders.length - 1] : null;
    
    const newReminder = {
      id: Date.now(),
      before: templateReminder ? templateReminder.before : (methodType === 'whatsApp' ? 60 : 30),
      type: templateReminder ? templateReminder.type : 'minute',
      method: methodType
    };
    
    const updatedReminders = [...allReminders, newReminder];
    setAllReminders(updatedReminders);
    
    await saveAllRemindersToAPI(updatedReminders);
  };

  const updateReminder = async (id, field, value) => {
    const updatedReminders = allReminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, [field]: field === 'before' ? parseInt(value, 10) : value }
        : reminder
    );
    
    setAllReminders(updatedReminders);
    await saveAllRemindersToAPI(updatedReminders);
  };

  const removeReminder = async (id) => {
    const filteredReminders = allReminders.filter(reminder => reminder.id !== id);
    setAllReminders(filteredReminders);
    await saveAllRemindersToAPI(filteredReminders);
  };

  const checkSmsIntegrations = async () => {
    if (!smsIntegrations || !Array.isArray(smsIntegrations) || smsIntegrations.length === 0) {
      setHasValidSmsIntegration(false);
      setActiveSmsIntegrationName('');
      return;
    }

    try {
      for (const integration of smsIntegrations) {
        const result = await dispatch(fetchSmsSettings(integration.id));
        
        if (result.status && result.data !== null) {
          const integrationName = integration.name || integration.provider || 'Unknown SMS Integration';
          setHasValidSmsIntegration(true);
          setActiveSmsIntegrationName(integrationName);
          break;
        }
      }
    } catch (error) {
      console.error('Error checking SMS integrations:', error);
      setHasValidSmsIntegration(false);
      setActiveSmsIntegrationName('');
    }
  };

  const checkWhatsAppIntegrations = async () => {
    if (!integrationsWhatsApp || !Array.isArray(integrationsWhatsApp) || integrationsWhatsApp.length === 0) {
      setHasValidWhatsAppIntegration(false);
      setActiveWhatsAppIntegrationName('');
      return;
    }

    try {
      for (const integration of integrationsWhatsApp) {
        const result = await dispatch(fetchWhatsAppSettings(integration.id));
        console.log(integration);
        
        if (result.status && result.data !== null) {
          const integrationName = integration.name || integration.provider || 'Unknown WhatsApp Integration';
          setHasValidWhatsAppIntegration(true);
          setActiveWhatsAppIntegrationName(integrationName);
          break;
        }
      }
    } catch (error) {
      console.error('Error checking WhatsApp integrations:', error);
      setHasValidWhatsAppIntegration(false);
      setActiveWhatsAppIntegrationName('');
    }
  };

  const checkAllIntegrations = async () => {
    setIsCheckingIntegrations(true);
    
    try {
      await Promise.all([
        checkSmsIntegrations(),
        checkWhatsAppIntegrations()
      ]);
    } catch (error) {
      console.error('Error checking integrations:', error);
    } finally {
      setIsCheckingIntegrations(false);
    }
  };

  // Fetch integrations on component mount
  useEffect(() => {
    dispatch(fetchSmsIntegrations());
    dispatch(fetchWhatsAppIntegrations());
  }, [dispatch]);

  // Check integrations when they are loaded
  useEffect(() => {
    const shouldCheckIntegrations = 
      ((smsIntegrations && Array.isArray(smsIntegrations)) || 
       (integrationsWhatsApp && Array.isArray(integrationsWhatsApp))) && 
      !isCheckingIntegrations;

    if (shouldCheckIntegrations) {
      checkAllIntegrations();
    }
  }, [smsIntegrations, integrationsWhatsApp]);

  useEffect(() => {
    if (!loading && !isCheckingIntegrations && !isDataReady) {
      setIsDataReady(true);
    }
  }, [loading, isCheckingIntegrations, isDataReady]);

  const getNotificationTypes = () => {
    if (currentType === 'sms' || currentType === 'whatsApp') {
      return [
        { id: 'booked', icon: <MessageSquare className="w-6 h-6 text-gray-400" />, label: 'Booked' },
        { id: 'rescheduled', icon: <Clock className="w-6 h-6 text-gray-400" />, label: 'Rescheduled' },
        { id: 'cancelled', icon: <X className="w-6 h-6 text-gray-400" />, label: 'Cancelled' },
        { id: 'completed', icon: <CheckCircle className="w-6 h-6 text-gray-400" />, label: 'Completed' },
        { id: 'noshow', icon: <AlertCircle className="w-6 h-6 text-gray-400" />, label: 'No Show' },
      ];
    } else {
      return [
        { id: 'booked', icon: <Calendar className="w-5 h-5" />, label: 'Booked' },
        { id: 'rescheduled', icon: <Clock className="w-5 h-5" />, label: 'Rescheduled' },
        { id: 'cancelled', icon: <X className="w-5 h-5" />, label: 'Cancelled' },
        { id: 'completed', icon: <Check className="w-5 h-5" />, label: 'Completed' },
        { id: 'noshow', icon: <Eye className="w-5 h-5" />, label: 'No Show' },
      ];
    }
  };

  const getTitle = () => {
    switch(currentType) {
      case 'sms': return 'SMS Notifications and Reminders';
      case 'whatsApp': return 'WhatsApp Notifications and Reminders';
      default: return 'Email Notifications and Reminders';
    }
  };

  const isContentDisabled = () => {
    if (currentType === 'sms') {
      return !isSmsIntegrated || loading || isCheckingIntegrations;
    }
    if (currentType === 'whatsApp') {
      return !isWhatsAppIntegrated || loading || isCheckingIntegrations;
    }
    return false;
  };

  const getMethodStyle = (method) => {
    if (method === 'email') {
      return {
        icon: <Mail className="w-4 h-4" />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
      };
    } else if (method === 'whatsApp') {
      return {
        icon: <MessageSquare className="w-4 h-4" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        icon: <MessageSquare className="w-4 h-4" />,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200'
      };
    }
  };

  const renderEmailContent = () => (
    <>
      <div className="mt-8">
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

  const renderSmsConfiguration = () => (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">!</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              SMS Configurations {hasValidSmsIntegration && activeSmsIntegrationName && (
                <span className="text-green-600">(Integrated with {activeSmsIntegrationName})</span>
              )}
              {(loading || isCheckingIntegrations) && <span className="text-gray-500">(Loading...)</span>}
            </h3>
            <p className="text-sm text-gray-600">
              To send SMS alerts, first integrate an SMS gateway and enable it.
            </p>
          </div>
        </div>
        <Link
          to={`/setting/integrations-page#sms`}
          className="px-4 py-2 bg-white border border-orange-300 text-orange-700 text-sm font-medium rounded-md hover:bg-orange-50 transition-colors disabled:opacity-50"
        >
          {(loading || isCheckingIntegrations) ? 'Loading...' : 'Integrate'}
        </Link>
      </div>
    </div>
  );

  const renderWhatsAppConfiguration = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              WhatsApp Configurations {hasValidWhatsAppIntegration && activeWhatsAppIntegrationName && (
                <span className="text-green-600">(Integrated with {activeWhatsAppIntegrationName})</span>
              )}
              {(loading || isCheckingIntegrations) && <span className="text-gray-500">(Loading...)</span>}
            </h3>
            <p className="text-sm text-gray-600">
              To send WhatsApp messages, first integrate WhatsApp Business API and enable it.
            </p>
          </div>
        </div>
        <Link
          to={`/setting/integrations-page#whatsapp`}
          className="px-4 py-2 bg-white border border-green-300 text-green-700 text-sm font-medium rounded-md hover:bg-green-50 transition-colors disabled:opacity-50"
        >
          {(loading || isCheckingIntegrations) ? 'Loading...' : 'Integrate'}
        </Link>
      </div>
    </div>
  );

  const getAddButtonStyle = () => {
    switch(currentType) {
      case 'whatsApp':
        return 'text-green-600 hover:bg-green-50';
      case 'sms':
        return 'text-purple-600 hover:bg-purple-50';
      default:
        return 'text-blue-600 hover:bg-blue-50';
    }
  };

  const getAddButtonIcon = () => {
    if (currentType === 'whatsApp' || currentType === 'sms') {
      return <MessageSquare className="w-4 h-4" />;
    }
    return <Mail className="w-4 h-4" />;
  };

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        <p className="text-sm text-gray-500 mt-1">Current type: {currentType}</p>
      </div>

      {(currentType === 'sms' || currentType === 'whatsApp') && (loading || isCheckingIntegrations) && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            {isCheckingIntegrations 
              ? `Checking ${currentType === 'whatsApp' ? 'WhatsApp' : 'SMS'} integrations...` 
              : `Loading ${currentType === 'whatsApp' ? 'WhatsApp' : 'SMS'} settings...`
            }
          </span>
        </div>
      )}

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
          To {currentType === 'sms' || currentType === 'whatsApp' ? 'Tutor' : 'Recruiter'}
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Notifications</h3>
        <p className="text-gray-600 mb-4">
          Send customized updates to {activeTab === 'customer' ? 'customers' : 'users'} at every stage of an appointment.
        </p>
        <div className={`grid ${(currentType === 'sms' || currentType === 'whatsApp') ? 'grid-cols-5' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'} gap-4`}>
          {getNotificationTypes().map((type) => (
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

      <div className={`mb-8 ${isContentDisabled() ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{currentType.toUpperCase()} Reminders</h3>
          {isSaving && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span>Saving...</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-4">
          Remind {activeTab === 'customer' ? 'customers' : 'users'} of their upcoming appointments via {currentType === 'whatsApp' ? 'WhatsApp' : currentType}.
        </p>
        
        <div className="space-y-4 mb-4">
          {getCurrentReminders().length === 0 ? (
            <p className="text-gray-500 text-sm">
              No {currentType === 'whatsApp' ? 'WhatsApp' : currentType.toUpperCase()} reminders configured.
            </p>
          ) : (
            getCurrentReminders().map((reminder) => {
              const methodStyle = getMethodStyle(reminder.method);
              return (
                <div key={reminder.id} className={`flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border ${methodStyle.borderColor}`}>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${methodStyle.bgColor} ${methodStyle.textColor}`}>
                    {methodStyle.icon}
                    <span className="text-xs font-medium uppercase">{reminder.method === 'whatsApp' ? 'WhatsApp' : reminder.method}</span>
                  </div>
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
                  <button
                    onClick={() => removeReminder(reminder.id)}
                    disabled={isSaving}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={() => addReminder()}
          disabled={isSaving || isContentDisabled()}
          className={`flex items-center space-x-2 text-sm hover:underline px-3 py-2 rounded transition-colors disabled:opacity-50 ${getAddButtonStyle()}`}
        >
          {getAddButtonIcon()}
          <Plus className="w-4 h-4" />
          <span>Add {currentType === 'whatsApp' ? 'WhatsApp' : currentType.toUpperCase()} Reminder</span>
        </button>
      </div>

      {currentType === 'email' && renderEmailContent()}
      {currentType === 'sms' && renderSmsConfiguration()}
      {currentType === 'whatsApp' && renderWhatsAppConfiguration()}

      {isSaving && (
        <div className="fixed bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg z-50">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span className="text-sm">Saving reminders...</span>
        </div>
      )}
    </div>
  );
};

export default UnifiedNotifications;