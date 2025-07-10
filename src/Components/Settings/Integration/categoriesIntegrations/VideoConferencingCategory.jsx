// VideoConferencingCategory.js
import React from 'react';
import IntegrationCategory from './integrationCategory';

const VideoConferencingCategory = ({ searchQuery, onConnectClick }) => {
  const videoConferencingData = {
    title: 'Video Conferencing',
    items: [
      { 
        name: 'Google Meet', 
        icon: <img src="https://img.icons8.com/?size=48&id=pE97I4t7Il9M&format=png" alt="Google Meet" className="w-6 h-6" />, 
        description: 'Automatically create a Google Meet meeting for every appointment scheduled.'
      },
      { 
        name: 'Microsoft Teams', 
        icon: <img src="https://img.icons8.com/?size=48&id=68803&format=png" alt="Microsoft Teams" className="w-6 h-6" />, 
        description: 'Automatically create a Microsoft Teams meeting for every appointment scheduled.'
      },
      { 
        name: 'Zoom', 
        icon: <img src="https://img.icons8.com/?size=48&id=7csVZvHoQrLW&format=png" alt="Zoom" className="w-6 h-6" />, 
        description: 'Automatically create a Zoom Meeting for every appointment scheduled.'
      }
    ]
  };

  const filteredItems = videoConferencingData.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategory = { ...videoConferencingData, items: filteredItems };

  if (filteredItems.length === 0) return null;

  return <IntegrationCategory category={filteredCategory} onConnectClick={onConnectClick} />;
};

export default VideoConferencingCategory;