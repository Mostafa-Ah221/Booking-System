import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, X, Check, Plus, Trash2, MessageSquare, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { notificationReminder } from '../../../../redux/apiCalls/interviewCallApi';
import { fetchSmsSettings, fetchSmsIntegrations } from '../../../../redux/apiCalls/smsIntegrationCallApi';
import { fetchWhatsAppSettings, fetchWhatsAppIntegrations } from '../../../../redux/apiCalls/whatsAppCallApi';
import { useOutletContext } from 'react-router-dom';
import toast from "react-hot-toast";

const UnifiedNotifications = () => {
  const dispatch = useDispatch();
  const { id } = useOutletContext();

  const [activeTab, setActiveTab] = useState('customer');
  const [currentType, setCurrentType] = useState('email');
  const [isSaving, setIsSaving] = useState(false);
  const [savingReminderId, setSavingReminderId] = useState(null);

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

  // Refs
  const hasInitializedRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const hasCheckedRef = useRef(false); // ✅ منع تكرار checkAllIntegrations

  const debouncedSave = (updatedReminders) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(() => {
      saveAllRemindersToAPI(updatedReminders);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

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
      if (newType !== currentType) setCurrentType(newType);
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('navigation-change', handleNavigation);

    const intervalId = setInterval(() => {
      const newType = getTypeFromPath();
      if (newType !== currentType) setCurrentType(newType);
    }, 100);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('navigation-change', handleNavigation);
      clearInterval(intervalId);
    };
  }, [currentType]);

  useEffect(() => {
    if (isDataReady && interview?.reminders && !hasInitializedRef.current) {
      if (interview.reminders.length > 0) {
        const loadedReminders = interview.reminders.map(reminder => ({
          id: reminder.id,
          before: parseInt(reminder.before, 10),
          type: reminder.type,
          method: reminder.method.toLowerCase() === 'whatsapp' ? 'whatsApp' : reminder.method
        }));
        setAllReminders(loadedReminders);
      } else {
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
      const emailReminders = updatedReminders.filter(r => r.method === 'email');
      const smsReminders = updatedReminders.filter(r => r.method === 'sms');
      const whatsAppReminders = updatedReminders.filter(r => r.method === 'whatsApp');

      const methods = [];

      if (emailReminders.length > 0) {
        methods.push({
          name: 'email',
          reminders: emailReminders.map(r => ({ before: String(r.before), type: r.type }))
        });
      }

      if (smsReminders.length > 0 && isSmsIntegrated) {
        methods.push({
          name: 'sms',
          reminders: smsReminders.map(r => ({ before: String(r.before), type: r.type }))
        });
      }

      if (whatsAppReminders.length > 0 && isWhatsAppIntegrated) {
        methods.push({
          name: 'whatsapp',
          reminders: whatsAppReminders.map(r => ({ before: String(r.before), type: r.type }))
        });
      }

      const result = await dispatch(notificationReminder(id, { methods }));

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
      setSavingReminderId(null);
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

  const updateReminder = (id, field, value) => {
    const updatedReminders = allReminders.map(reminder =>
      reminder.id === id
        ? { ...reminder, [field]: field === 'before' ? value : value }
        : reminder
    );
    setAllReminders(updatedReminders);
    if (field !== 'before') debouncedSave(updatedReminders);
  };

  const handleBlurReminder = (id) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSavingReminderId(id);
    setIsSaving(true);

    const validatedReminders = allReminders.map(reminder => {
      if (reminder.id === id) {
        let numValue = parseInt(reminder.before, 10);
        if (isNaN(numValue) || numValue < 1) numValue = 1;
        return { ...reminder, before: numValue };
      }
      return reminder;
    });

    setAllReminders(validatedReminders);
    saveAllRemindersToAPI(validatedReminders);
  };

  const removeReminder = async (id) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    const filteredReminders = allReminders.filter(reminder => reminder.id !== id);
    setAllReminders(filteredReminders);
    await saveAllRemindersToAPI(filteredReminders);
  };

  // ✅ checkSmsIntegrations مع reset قبل البدء
  const checkSmsIntegrations = async () => {
    setHasValidSmsIntegration(false);
    setActiveSmsIntegrationName('');

    if (!smsIntegrations || !Array.isArray(smsIntegrations) || smsIntegrations.length === 0) {
      return;
    }

    try {
      for (const integration of smsIntegrations) {
        const result = await dispatch(fetchSmsSettings(integration.id));
        console.log('SMS integration object:', integration); 
        console.log(`SMS Settings for integration ${integration.id}:`, result);
        if (result.status && result.data !== null) {
          setHasValidSmsIntegration(true);
          setActiveSmsIntegrationName(integration.name || integration.provider || 'Unknown SMS Integration');
          break;
        }
      }
    } catch (error) {
      console.error('Error checking SMS integrations:', error);
    }
  };

  // ✅ checkWhatsAppIntegrations مع reset قبل البدء
  const checkWhatsAppIntegrations = async () => {
    setHasValidWhatsAppIntegration(false);
    setActiveWhatsAppIntegrationName('');

    if (!integrationsWhatsApp || !Array.isArray(integrationsWhatsApp) || integrationsWhatsApp.length === 0) {
      return;
    }

    try {
      for (const integration of integrationsWhatsApp) {
        const result = await dispatch(fetchWhatsAppSettings(integration.id));
        console.log('SMS integration object:', integration); 
        console.log(`WhatsApp Settings for integration ${integration.id}:`, result);
        if (result.status && result.data !== null) {
          setHasValidWhatsAppIntegration(true);
          setActiveWhatsAppIntegrationName(integration.name || integration.provider || 'Unknown WhatsApp Integration');
          break;
        }
      }
    } catch (error) {
      console.error('Error checking WhatsApp integrations:', error);
    }
  };

  // ✅ checkAllIntegrations مع hasCheckedRef لمنع التكرار
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

  useEffect(() => {
    dispatch(fetchSmsIntegrations());
    dispatch(fetchWhatsAppIntegrations());
  }, [dispatch]);

  useEffect(() => {
  const smsReady = smsIntegrations !== null && Array.isArray(smsIntegrations) && smsIntegrations.length > 0;
  const whatsAppReady = integrationsWhatsApp !== null && Array.isArray(integrationsWhatsApp);

  if ((smsReady || whatsAppReady) && !isCheckingIntegrations && !hasValidSmsIntegration && !hasValidWhatsAppIntegration) {
    checkAllIntegrations();
  }
}, [smsIntegrations, integrationsWhatsApp]);

  useEffect(() => {
    if (!loading && !isCheckingIntegrations && !isDataReady) {
      setIsDataReady(true);
    }
  }, [loading, isCheckingIntegrations, isDataReady]);

  const handleNavigateToIntegrations = (type) => {
    window.location.href = '/layoutDashboard/setting/integrations-page#' + type;
    setTimeout(() => {
      const element = document.getElementById(type);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const getTitle = () => {
    switch (currentType) {
      case 'sms': return 'SMS Notifications and Reminders';
      case 'whatsApp': return 'WhatsApp Notifications and Reminders';
      default: return 'Email Notifications and Reminders';
    }
  };

  const isContentDisabled = () => {
    if (currentType === 'sms') return !isSmsIntegrated || loading || isCheckingIntegrations;
    if (currentType === 'whatsApp') return !isWhatsAppIntegrated || loading || isCheckingIntegrations;
    return false;
  };

  const getMethodStyle = (method) => {
    if (method === 'email') return {
      icon: <Mail className="w-4 h-4" />,
      bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-200'
    };
    if (method === 'whatsApp') return {
      icon: <MessageSquare className="w-4 h-4" />,
      bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-200'
    };
    return {
      icon: <MessageSquare className="w-4 h-4" />,
      bgColor: 'bg-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-200'
    };
  };

  const renderSmsConfiguration = () => (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        {!isSmsIntegrated && <span className="text-red-500">!</span>}
        SMS Configurations
        {hasValidSmsIntegration && activeSmsIntegrationName && (
          <span className="text-xs text-green-600 font-normal">(Integrated with {activeSmsIntegrationName})</span>
        )}
        {(loading || isCheckingIntegrations) && (
          <span className="text-xs text-gray-500 font-normal">(Loading...)</span>
        )}
      </h3>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 justify-between">
        <p className="text-sm text-yellow-800">To send SMS alerts, first integrate an SMS gateway and enable it.</p>
        <button
          onClick={() => handleNavigateToIntegrations('sms')}

          disabled={loading || isCheckingIntegrations}
          className="mt-3 px-4 py-2 bg-white border border-orange-300 text-orange-700 text-sm font-medium rounded-md hover:bg-orange-50 transition-colors disabled:opacity-50"
        >
          {(loading || isCheckingIntegrations) ? 'Loading...' : 'Integrate'}
        </button>
      </div>
    </div>
  );

  const renderWhatsAppConfiguration = () => (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        {!isWhatsAppIntegrated && <span className="text-red-500">!</span>}
        WhatsApp Configurations
        {hasValidWhatsAppIntegration && activeWhatsAppIntegrationName && (
          <span className="text-xs text-green-600 font-normal">(Integrated with {activeWhatsAppIntegrationName})</span>
        )}
        {(loading || isCheckingIntegrations) && (
          <span className="text-xs text-gray-500 font-normal">(Loading...)</span>
        )}
      </h3>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 justify-between">
        <p className="text-sm text-yellow-800">To send WhatsApp messages, first integrate WhatsApp Business API and enable it.</p>
        <button
          onClick={() => handleNavigateToIntegrations('whatsapp')}
          disabled={loading || isCheckingIntegrations}
          className="mt-3 px-4 py-2 bg-white border border-orange-300 text-orange-700 text-sm font-medium rounded-md hover:bg-orange-50 transition-colors disabled:opacity-50"
        >
          {(loading || isCheckingIntegrations) ? 'Loading...' : 'Integrate'}
        </button>
      </div>
    </div>
  );

  const getAddButtonStyle = () => {
    switch (currentType) {
      case 'whatsApp': return 'text-green-600 hover:bg-green-50';
      case 'sms': return 'text-purple-600 hover:bg-purple-50';
      default: return 'text-blue-600 hover:bg-blue-50';
    }
  };

  const getAddButtonIcon = () => {
    if (currentType === 'whatsApp' || currentType === 'sms') return <MessageSquare className="w-4 h-4" />;
    return <Mail className="w-4 h-4" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-6">{getTitle()}</h2>

        {(currentType === 'sms' || currentType === 'whatsApp') && (loading || isCheckingIntegrations) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              {isCheckingIntegrations
                ? `Checking ${currentType === 'whatsApp' ? 'WhatsApp' : 'SMS'} integrations...`
                : `Loading ${currentType === 'whatsApp' ? 'WhatsApp' : 'SMS'} settings...`}
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{currentType.toUpperCase()} Reminders</h3>
              {isSaving && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Saving...</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Remind {activeTab === 'customer' ? 'customers' : 'users'} of their upcoming appointments via {currentType === 'whatsApp' ? 'WhatsApp' : currentType}.
            </p>

            {getCurrentReminders().length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                <p>No {currentType === 'whatsApp' ? 'WhatsApp' : currentType.toUpperCase()} reminders configured.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getCurrentReminders().map((reminder) => {
                  const methodStyle = getMethodStyle(reminder.method);
                  return (
                    <div key={reminder.id} className={`flex items-center space-x-4 p-4 border ${methodStyle.borderColor} ${methodStyle.bgColor} rounded-lg`}>
                      <div className={`flex items-center space-x-2 ${methodStyle.textColor} font-medium`}>
                        {methodStyle.icon}
                        <span className="text-sm capitalize">
                          {reminder.method === 'whatsApp' ? 'WhatsApp' : reminder.method}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Before</span>
                        <div className="relative">
                          <input
                            type="number"
                            value={reminder.before}
                            onChange={(e) => updateReminder(reminder.id, 'before', e.target.value)}
                            onBlur={() => handleBlurReminder(reminder.id)}
                            className="w-20 px-3 py-2 border rounded-md"
                            min="1"
                            disabled={isSaving && savingReminderId === reminder.id}
                          />
                          {savingReminderId === reminder.id && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                            </div>
                          )}
                        </div>
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
                      </div>

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
                })}
              </div>
            )}

            <button
              onClick={() => addReminder()}
              disabled={isSaving || isContentDisabled()}
              className={`mt-4 flex items-center space-x-2 text-sm hover:underline px-3 py-2 rounded transition-colors disabled:opacity-50 ${getAddButtonStyle()}`}
            >
              {getAddButtonIcon()}
              <Plus className="w-4 h-4" />
              <span>Add {currentType === 'whatsApp' ? 'WhatsApp' : currentType.toUpperCase()} Reminder</span>
            </button>
          </div>

          {currentType === 'sms' && renderSmsConfiguration()}
          {currentType === 'whatsApp' && renderWhatsAppConfiguration()}
        </div>
      </div>
    </div>
  );
};

export default UnifiedNotifications;