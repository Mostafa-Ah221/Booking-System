import React, { useEffect, useState } from 'react';
import { Calendar, Users, MessageCircle, User, CreditCard, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { getPreferences, getPreferencesEmail, UpdatePreferences, UpdateEmailSettings } from '../../../redux/apiCalls/NotificationsCallApi';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsActions } from '../../../redux/slices/notificationsSlice';
import toast from 'react-hot-toast';


const NotificationSettings = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [emailLanguage, setEmailLanguage] = useState('en');
  const dispatch = useDispatch();

  const { preferences, preferencesEmail, loading, success, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getPreferences());
    dispatch(getPreferencesEmail());
  }, [dispatch]);

  useEffect(() => {
    if (preferencesEmail?.email_language) {
      setEmailLanguage(preferencesEmail.email_language);
    }
  }, [preferencesEmail]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(notificationsActions.resetSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(notificationsActions.resetError());
    }
  }, [error, dispatch]);

  const getCheckboxState = (notificationType, isEmail = false) => {
    if (isEmail) {
      // استخدام preferencesEmail للإيميل
      if (!preferencesEmail) return false;
      const value = preferencesEmail[notificationType];
      return value === "1" || value === 1 || value === true;
    }
    
    // استخدام preferences للإشعارات داخل التطبيق
    const pref = preferences?.preferences?.find(p => p.notification_type === notificationType);
    if (!pref) return false;
    return pref.push_enabled === "1" || pref.push_enabled === true;
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCheckboxChange = async (notificationType, currentValue) => {
    if (isUpdating) return;

    setIsUpdating(true);

    const updatedPreference = {
      notification_type: notificationType,
      push_enabled: !currentValue ? 1 : 0  
    };

    try {
      const result = await dispatch(UpdatePreferences(updatedPreference));
      
      if (result?.success) {
      } else {
        toast.error(result?.message || "Failed to update preferences", {
          duration: 2000,
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (err) {
      toast.error("An error occurred while updating preferences", {
        duration: 2000,
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } finally {
      setIsUpdating(false);
    }
  };

const handleEmailCheckboxChange = async (notificationType, currentValue) => {
    if (isUpdating) return;

    setIsUpdating(true);

    const payload = {
      [notificationType]: !currentValue,
      email_language: emailLanguage
    };

    try {
      const result = await dispatch(UpdateEmailSettings(payload));
      
      if (result?.success) {
        // success
      } else {
        toast.error(result?.message || "Failed to update email preferences", {
          duration: 2000,
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (err) {
      toast.error("An error occurred while updating email preferences", {
        duration: 2000,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLanguageChange = async (language) => {
    if (isUpdating || emailLanguage === language) return;

    setIsUpdating(true);
    setEmailLanguage(language);

    const appointmentTypes = ['appointment_scheduled', 'appointment_rescheduled', 'appointment_cancelled'];
    const payload = {
      email_language: language
    };

    // استخدم getCheckboxState عشان تجيب القيم الحالية من الـ state
    appointmentTypes.forEach(type => {
      const isEnabled = getCheckboxState(type, true);
      payload[type] = isEnabled;
    });

    try {
      const result = await dispatch(UpdateEmailSettings(payload));
      
      if (result?.success) {
        // success
      } else {
        toast.error(result?.message || "Failed to update email language", {
          duration: 2000,
        });
        setEmailLanguage(preferencesEmail?.email_language || 'en');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (err) {
      toast.error("An error occurred while updating email language", {
        duration: 2000,
      });
      setEmailLanguage(preferencesEmail?.email_language || 'en');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } finally {
      setIsUpdating(false);
    }
  };
  const sections = [
    {
      icon: Calendar,
      title: 'Appointment',
      options: [
        { label: 'Scheduled', type: 'appointment_scheduled' },
        { label: 'Canceled', type: 'appointment_cancelled' },
        { label: 'Rescheduled', type: 'appointment_rescheduled' }
      ]
    },
    {
      icon: Users,
      title: 'Recruiter',
      options: [
        { label: 'Created', type: 'staff_created' },
        { label: 'Edited', type: 'staff_edited' },
        { label: 'Deleted', type: 'staff_deleted' }
      ]
    },
    {
      icon: MessageCircle,
      title: 'Interview',
      options: [
        { label: 'Created', type: 'interview_created' },
        { label: 'Edited', type: 'interview_edited' },
        { label: 'Deleted', type: 'interview_deleted' }
      ]
    },
    {
      icon: User,
      title: 'Client',
      options: [
        { label: 'Created', type: 'client_created' },
        { label: 'Edited', type: 'client_edited' },
        { label: 'Deleted', type: 'client_deleted' }
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment',
      options: [
        { label: 'Success', type: 'payment_successed' },
        { label: 'Failure', type: 'payment_failed' }
      ]
    }
  ];

  const getColors = (index) => {
    const colors = {
      0: { bg: 'bg-orange-50', text: 'text-orange-500' },
      1: { bg: 'bg-green-50', text: 'text-green-500' },
      2: { bg: 'bg-purple-50', text: 'text-purple-500' },
      3: { bg: 'bg-red-50', text: 'text-red-500' },
      4: { bg: 'bg-blue-50', text: 'text-blue-500' }
    };
    return colors[index] || colors[0];
  };

  if (loading && preferences?.preferences?.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen space-y-8">
      {/* In-product Notifications */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-gray-800">
          In-product Notifications
        </h1>
        
        <div className="space-y-3">
          {sections.map((section, index) => {
            const colors = getColors(index);
            const isExpanded = expandedSections[index];
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className={`p-3 rounded-xl ${colors.bg} cursor-pointer md:cursor-default flex-shrink-0`}
                    onClick={() => toggleSection(index)}
                  >
                    <section.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0" onClick={() => toggleSection(index)}>
                    <div className="flex flex-col cursor-pointer md:cursor-default">
                      <span className="font-semibold text-gray-900 text-base">{section.title}</span>
                      <span className="text-xs text-gray-500 mt-0.5">Notify When</span>
                    </div>
                  </div>
                  
                  <button 
                    className="md:hidden p-1 flex-shrink-0"
                    onClick={() => toggleSection(index)}
                  >
                    {isExpanded ? 
                      <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    }
                  </button>
                  
                  <div className="hidden md:flex gap-8 flex-wrap items-center">
                    {section.options.map((option, optionIndex) => {
                      const isChecked = getCheckboxState(option.type);
                      
                      return (
                        <label 
                          key={optionIndex} 
                          className={`flex items-center gap-2.5 group ${
                            isUpdating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(option.type, isChecked)}
                            disabled={isUpdating}
                            className="w-3 h-3 rounded border-gray-300 text-blue-800 cursor-pointer accent-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <span className={`text-[13px] text-gray-700 select-none transition-colors ${
                            isUpdating ? '' : 'group-hover:text-gray-900'
                          }`}>
                            {option.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                      {section.options.map((option, optionIndex) => {
                        const isChecked = getCheckboxState(option.type);
                        
                        return (
                          <label 
                            key={optionIndex} 
                            className={`flex items-center gap-2.5 group ${
                              isUpdating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(option.type, isChecked)}
                              disabled={isUpdating}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <span className={`text-sm text-gray-700 select-none ${
                              isUpdating ? '' : 'group-hover:text-gray-900'
                            }`}>
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Notifications */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-gray-800">
          Email Notifications
        </h1>
        
        <div className="space-y-3">
          {/* Appointment Email Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-xl bg-orange-50 cursor-pointer md:cursor-default flex-shrink-0"
                onClick={() => toggleSection('email-appointment')}
              >
                <Mail className="w-5 h-5 text-orange-500" />
              </div>
              
              <div className="flex-1 min-w-0" onClick={() => toggleSection('email-appointment')}>
                <div className="flex flex-col cursor-pointer md:cursor-default">
                  <span className="font-semibold text-gray-900 text-base">Appointment</span>
                  <span className="text-xs text-gray-500 mt-0.5">Email When</span>
                </div>
              </div>
              
              <button 
                className="md:hidden p-1 flex-shrink-0"
                onClick={() => toggleSection('email-appointment')}
              >
                {expandedSections['email-appointment'] ? 
                  <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                }
              </button>
              
              <div className="hidden md:flex gap-8 flex-wrap items-center">
                {[
                  { label: 'Scheduled', type: 'appointment_scheduled' },
                  { label: 'Canceled', type: 'appointment_cancelled' },
                  { label: 'Rescheduled', type: 'appointment_rescheduled' }
                ].map((option, optionIndex) => {
                  const isChecked = getCheckboxState(option.type, true);
                  
                  return (
                    <label 
                      key={optionIndex} 
                      className={`flex items-center gap-2.5 group ${
                        isUpdating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleEmailCheckboxChange(option.type, isChecked)}
                        disabled={isUpdating}
                        className="w-3 h-3 rounded border-gray-300 text-blue-800 cursor-pointer accent-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <span className={`text-[13px] text-gray-700 select-none transition-colors ${
                        isUpdating ? '' : 'group-hover:text-gray-900'
                      }`}>
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            {expandedSections['email-appointment'] && (
              <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Scheduled', type: 'appointment_scheduled' },
                    { label: 'Canceled', type: 'appointment_cancelled' },
                    { label: 'Rescheduled', type: 'appointment_rescheduled' }
                  ].map((option, optionIndex) => {
                    const isChecked = getCheckboxState(option.type, true);
                    
                    return (
                      <label 
                        key={optionIndex} 
                        className={`flex items-center gap-2.5 group ${
                          isUpdating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleEmailCheckboxChange(option.type, isChecked)}
                          disabled={isUpdating}
                          className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer accent-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <span className={`text-sm text-gray-700 select-none ${
                          isUpdating ? '' : 'group-hover:text-gray-900'
                        }`}>
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Email Language Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 flex-shrink-0">
                <Mail className="w-5 h-5 text-indigo-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-base">Email Language</span>
                  <span className="text-xs text-gray-500 mt-0.5">Choose your preferred email language</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <label 
                  className={`flex items-center gap-2.5 group ${
                    isUpdating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="email_language"
                    value="en"
                    checked={emailLanguage === 'en'}
                    onChange={() => handleLanguageChange('en')}
                    disabled={isUpdating}
                    className="w-4 h-4 text-indigo-600 cursor-pointer accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className={`text-sm text-gray-700 select-none transition-colors ${
                    isUpdating ? '' : 'group-hover:text-gray-900'
                  }`}>
                    en
                  </span>
                </label>

                <label 
                  className={`flex items-center gap-2.5 group ${
                    isUpdating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="email_language"
                    value="ar"
                    checked={emailLanguage === 'ar'}
                    onChange={() => handleLanguageChange('ar')}
                    disabled={isUpdating}
                    className="w-4 h-4 text-indigo-600 cursor-pointer accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className={`text-sm text-gray-700 select-none transition-colors ${
                    isUpdating ? '' : 'group-hover:text-gray-900'
                  }`}>
                    ar
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;