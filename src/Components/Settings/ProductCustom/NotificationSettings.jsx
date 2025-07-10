import React, { useState } from 'react';
import { Calendar, Users, MessageCircle, User, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

const NotificationSettings = () => {
  // Track which sections are expanded (for mobile view)
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const sections = [
    {
      icon: Calendar,
      title: 'Appointment',
      options: [
        { label: 'Scheduled', checked: true },
        { label: 'Canceled', checked: true },
        { label: 'Rescheduled', checked: false }
      ]
    },
    {
      icon: Users,
      title: 'Recruiter',
      options: [
        { label: 'Created', checked: true },
        { label: 'Edited', checked: false },
        { label: 'Deleted', checked: true },
        { label: 'On Leave', checked: true }
      ]
    },
    {
      icon: MessageCircle,
      title: 'Interview',
      options: [
        { label: 'Created', checked: false },
        { label: 'Edited', checked: true },
        { label: 'Deleted', checked: false }
      ]
    },
    {
      icon: User,
      title: 'Customer',
      options: [
        { label: 'Created', checked: true },
        { label: 'Edited', checked: false },
        { label: 'Deleted', checked: true }
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment',
      options: [
        { label: 'Success', checked: true },
        { label: 'Failure', checked: true }
      ]
    }
  ];

  // Get color based on index
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

  return (
    <div className="w-full p-4 md:p-6">
      <h1 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 border-b pb-2">In-product Notifications</h1>
      
      <div className="space-y-3 md:space-y-4">
        {sections.map((section, index) => {
          const colors = getColors(index);
          const isExpanded = expandedSections[index];
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
              <div className="flex items-center gap-3 md:gap-6" onClick={() => toggleSection(index)}>
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <section.icon className={`w-5 h-5 md:w-6 md:h-6 ${colors.text}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{section.title}</span>
                    <span className="text-xs md:text-sm text-gray-500">Notify When</span>
                  </div>
                </div>
                
                {/* Mobile toggle button */}
                <button className="md:hidden">
                  {isExpanded ? 
                    <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                
                {/* Desktop view - always show options */}
                <div className="hidden md:flex gap-4 md:gap-6 flex-wrap">
                  {section.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Mobile view - conditionally show options */}
              {(isExpanded || window.innerWidth >= 768) && (
                <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    {section.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
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