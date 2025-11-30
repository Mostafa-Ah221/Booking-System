import React, { useEffect, useState } from 'react';
import { Calendar, Users, MessageCircle, User, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { getPreferences, UpdatePreferences } from '../../../redux/apiCalls/NotificationsCallApi';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsActions } from '../../../redux/slices/notificationsSlice';
import toast from 'react-hot-toast';

const NotificationSettings = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const dispatch = useDispatch();

  const { preferences, loading, success, error } = useSelector((state) => state.notifications);


  useEffect(() => {
    dispatch(getPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      console.log(success);
      dispatch(notificationsActions.resetSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
  
      dispatch(notificationsActions.resetError());
    }
  }, [error, dispatch]);

  const getCheckboxState = (notificationType) => {
    const pref = preferences?.preferences?.find(p => p.notification_type === notificationType);
    return pref ? pref.push_enabled === "1" || pref.push_enabled === true : false;
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

const handleCheckboxChange =async (notificationType, currentValue) => {
  const updatedPreference = {
    notification_type: notificationType,
    push_enabled: !currentValue ? 1 : 0  
  };

  const result = await dispatch(UpdatePreferences(updatedPreference));
   if (result?.success) {
    toast.success(result.message || "Preferences updated successfully!");
  } else {
    toast.error(result?.message || "Failed to update preferences");
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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
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
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(option.type, isChecked)}
                          // disabled={loading}
                          className="w-3 h-3 rounded border-gray-300 text-blue-800 cursor-pointer accent-blue-800 disabled:opacity-50"
                        />
                        <span className="text-[13px] text-gray-700 select-none group-hover:text-gray-900 transition-colors">
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
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(option.type, isChecked)}
                            disabled={loading}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer accent-blue-600 disabled:opacity-50"
                          />
                          <span className="text-sm text-gray-700 select-none group-hover:text-gray-900">
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
  );
};

export default NotificationSettings;