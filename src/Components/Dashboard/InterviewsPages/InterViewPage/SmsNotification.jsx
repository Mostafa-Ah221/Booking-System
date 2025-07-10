import React from 'react';
import { MessageSquare, Clock, X, Plus, Trash2, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const SMSNotificationsSection = ({ 
  activeTab, 
  setActiveTab, 
  reminders, 
  updateReminder, 
  addReminder, 
  removeReminder, 
  isSaving 
}) => {
  const smsNotificationTypes = [
    { id: 'booked', icon: <MessageSquare className="w-6 h-6 text-gray-400" />, label: 'Booked' },
    { id: 'rescheduled', icon: <Clock className="w-6 h-6 text-gray-400" />, label: 'Rescheduled' },
    { id: 'cancelled', icon: <X className="w-6 h-6 text-gray-400" />, label: 'Cancelled' },
    { id: 'completed', icon: <CheckCircle className="w-6 h-6 text-gray-400" />, label: 'Completed' },
    { id: 'noshow', icon: <AlertCircle className="w-6 h-6 text-gray-400" />, label: 'No Show' },
  ];

  return (
    <div className="mx-auto p-6 bg-white">
      {/* Header */}
      <h2 className="text-xl font-medium mb-6 text-gray-900">SMS Notifications and Reminders</h2>
      
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
      <div className="mb-10">
        <h3 className="text-base font-medium mb-2 text-gray-900">Notifications</h3>
        <p className="text-sm text-gray-500 mb-6">
          Send customized SMS updates to {activeTab === 'customer' ? 'users' : 'tutors'} at every stage of an appointment.
        </p>
        
        <div className="grid grid-cols-5 gap-4">
          {smsNotificationTypes.map((type) => (
            <div
              key={type.id}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="mb-3">{type.icon}</div>
              <span className="text-sm text-gray-600 text-center">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reminders Section */}
      <div className="mb-10">
        <h3 className="text-base font-medium mb-2 text-gray-900">Reminders</h3>
        <p className="text-sm text-gray-500 mb-6">
          Remind users of their upcoming appointment via SMS.
        </p>
        
        {/* Existing Reminders */}
        <div className="space-y-4 mb-4">
          {reminders.map((reminder, index) => (
            <div key={reminder.id} className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 min-w-[50px]">Before</span>
              <input
                type="number"
                value={reminder.before}
                onChange={(e) => updateReminder(reminder.id, 'before', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                disabled={isSaving}
              />
              <select 
                value={reminder.type}
                onChange={(e) => updateReminder(reminder.id, 'type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Reminder Button */}
        <button 
          onClick={addReminder}
          disabled={isSaving}
          className="flex items-center space-x-2 text-blue-600 text-sm hover:text-blue-700 transition-colors disabled:opacity-50"
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
              <h3 className="text-sm font-medium text-gray-900 mb-1">SMS Configurations</h3>
              <p className="text-sm text-gray-600">
                To send SMS alerts, first integrate an SMS gateway and enable it.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-orange-300 text-orange-700 text-sm font-medium rounded-md hover:bg-orange-50 transition-colors">
            Integrate
          </button>
        </div>
      </div>

      {/* Saving Indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span className="text-sm">Saving...</span>
        </div>
      )}
    </div>
  );
};

export default SMSNotificationsSection;