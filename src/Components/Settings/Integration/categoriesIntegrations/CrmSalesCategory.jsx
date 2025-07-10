// CrmSalesCategory.js
import React from 'react';
import IntegrationCategory from './integrationCategory';

const CrmSalesCategory = ({ searchQuery, onConnectClick }) => {
  const crmSalesData = {
    title: 'CRM & Sales',
    items: [
      { 
        name: 'Salesforce', 
        icon: <img src="https://img.icons8.com/?size=48&id=38804&format=png" alt="Salesforce" className="w-6 h-6" />, 
        description: 'Push customer and meetings details to Sales Force when an appointment is booked.',
        zapier: true
      },
      { 
        name: 'Hubspot', 
        icon: <img src="https://img.icons8.com/?size=80&id=Xq3RA1kWzz3X&format=png" alt="Hubspot" className="w-6 h-6" />, 
        description: 'Push customer and meetings details to Hubspot when an appointment is booked.',
        zapier: true
      },
    ]
  };

  const filteredItems = crmSalesData.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategory = { ...crmSalesData, items: filteredItems };

  if (filteredItems.length === 0) return null;

  return <IntegrationCategory category={filteredCategory} onConnectClick={onConnectClick} />;
};

export default CrmSalesCategory;