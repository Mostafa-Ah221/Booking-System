// CalendarCategory.js
import React from 'react';
import IntegrationCategory from './integrationCategory';

const CalendarCategory = ({ searchQuery, onConnectClick }) => {
  const calendarData = {
    title: 'Calendars',
    items: [
      { 
        name: 'Google Calendar', 
        icon: <img src="https://img.icons8.com/?size=48&id=DEJypxE54F9v&format=png" alt="Google Calendar" className="w-8 h-8" />, 
        description: 'Manage multiple appointments by syncing your calendar.'
      },
      { 
        name: 'Outlook Calendar', 
        icon: <img src="https://img.icons8.com/?size=48&id=WnHyYA2ecNqL&format=png" alt="Outlook Calendar" className="w-6 h-6" />, 
        description: 'Manage multiple appointments by syncing your calendar.'
      }
    ]
  };

  const filteredItems = calendarData.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategory = { ...calendarData, items: filteredItems };

  if (filteredItems.length === 0) return null;

  return <IntegrationCategory category={filteredCategory} onConnectClick={onConnectClick} />;
};

export default CalendarCategory;