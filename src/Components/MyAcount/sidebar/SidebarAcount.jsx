import React, { useState } from 'react';
import { User,Shield,Settings,Users,Lock } from 'lucide-react';
import { Link } from 'react-router-dom';


const SidebarAcount = () => {
  const [activeItem, setActiveItem] = useState('Profile');
  const [expandedItems, setExpandedItems] = useState({
    Profile: true,
    Security: false,
    'Multi-Factor Authentication': false,
    Settings: false,
    Sessions: false,
    Groups: false,
    Privacy: false,
    Compliance: false
  });

  const handleItemClick = (item) => {
    setActiveItem(item);
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const sidebarItems = [
    {
      name: 'Profile',
      path:'acount-profile',
      icon: <User/>,
      subItems: ['Personal Information', 'Email Address', 'Mobile Numbers']
    },
    {
      name: 'Security',
      path:'security-setting',
      icon: <Shield/>,
      subItems: ['Password', 'Geo-fencing', 'Allowed IP Address', 'App Passwords', 'Device Sign-ins']
    },
   
    {
      name: 'Settings',
      icon: <Settings/>,
      subItems: ['Preferences', 'Authorized Websites', 'Linked Accounts', 'Close Account']
    },
    {
      name: 'Sessions',
      icon: '📋',
      subItems: []
    },
    {
      name: 'Groups',
      path:'newGroups',
      icon: <Users/>,
      subItems: []
    },
    {
      name: 'Privacy',
      icon: <Lock/>,
      subItems: ['Data Processing Addendum', 'Manage Your Contact']
    },
    // 
  ];

  return (
    <div className="w-64 bg-gray-900 text-gray-300 h-screen p-2 ">
      {sidebarItems.map((item) => (
        <Link to={item.path} key={item.name} className="mb-1">
          <div
            className={`flex items-center py-2 px-4 rounded cursor-pointer ${
              activeItem === item.name ? 'text-green-500' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleItemClick(item.name)}
          >
            <span className="mr-2">{item.icon}</span>
            <span className='truncate  max-w-[150px]'>{item.name}</span>
          </div>
          
          {expandedItems[item.name] && item.subItems.length > 0 && (
            <div className="ml-6 mt-1">
              {item.subItems.map((subItem, index) => (
                <div 
                  key={index}
                  className={`py-1 px-4 text-sm ${
                    index === 0 ? 'text-green-500' : 'text-gray-400'
                  } hover:text-gray-200 cursor-pointer`}
                >
                  {subItem}
                </div>
              ))}
            </div>
          )}
        </Link>
      ))}
      <div className="px-4 py-2 mt-2 cursor-pointer text-gray-400">
        <span className="mr-2">...</span>
        <span>View more</span>
      </div>
    </div>
  );
};

export default SidebarAcount;