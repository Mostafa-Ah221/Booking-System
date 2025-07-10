// PaymentsCategory.js
import React from 'react';
import IntegrationCategory from './integrationCategory';

const PaymentsCategory = ({ searchQuery, onConnectClick }) => {
  const paymentsData = {
    title: 'Payments',
    items: [
      { 
        name: 'Stripe', 
        icon: <img src="https://img.icons8.com/?size=48&id=18980&format=png" alt="Stripe" className="w-6 h-6" />, 
        description: 'Collect online payments while booking.',
        // disabled: true,
        // connected: true
      },
      { 
        name: 'Authorize.Net', 
        icon: <div><span className='text-blue-900 font-semibold'>authorize</span><span className='text-teal-600 font-bold'>.net</span></div>, 
        description: 'Collect online payments while booking.'
      },
      { 
        name: 'Forte', 
        icon: <div className='text-blue-950'>Forte</div>, 
        description: 'Collect online payments while booking.'
      },
      { 
        name: 'PayPal', 
        icon: <img src="https://img.icons8.com/?size=48&id=13611&format=png" alt="PayPal" className="w-6 h-6" />, 
        description: 'Collect online payments while booking.'
      },
      { 
        name: 'Razorpay', 
        icon: <div className='font-bold text-teal-400'>Razorpay</div>, 
        description: 'Collect online payments while booking.'
      },
      { 
        name: 'MercadoPago', 
        icon: <div className='font-bold text-teal-400'>MercadoPago</div>, 
        description: 'Collect online payments while booking.'
      },
      { 
        name: '2Checkout', 
        icon: <img src="https://img.icons8.com/?size=80&id=GcBkYw4IVJxF&format=png" alt="2Checkout" className="w-6 h-6" />, 
        description: 'Collect online payments while booking.'
      }
    ]
  };

  const filteredItems = paymentsData.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategory = { ...paymentsData, items: filteredItems };

  if (filteredItems.length === 0) return null;

  return <IntegrationCategory category={filteredCategory} onConnectClick={onConnectClick} />;
};

export default PaymentsCategory;