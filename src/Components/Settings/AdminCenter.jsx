import React from 'react';
import { ArrowLeft, Search, Settings, Grid, Layers, Package, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavDashbord from '../Dashboard/NavDashbord';

const AdminCenter = () => {
  const sections = [
    {
      title: 'Organization',
      icon: <Settings className="w-5 h-5 text-indigo-600" />,
      items: [{title:'Basic Information',path:"basic-info"}, {title:'Business Hours',path:'business-hours'}, {title:'Custom Domain',path:"custom-domain"}]
    },
    {
      title: 'Modules',
      icon: <Grid className="w-5 h-5 text-indigo-600" />,
      items: [{title:'Workspaces', path:"workspaces"}, {title:'Resources', path:"resources-section"}, {title:'In-person Locations', path:"person-location"}, {title:'Customers',path:"customers"}, {title: 'Reports',path:"reports"}]
    },
    {
      title: 'Integrations',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      items: [
        { title: 'Calendar', path: "integrations-page#calendar" },
        { title: 'SMS', path: "integrations-page#sms" },
        { title: 'Video Conferencing', path: "integrations-page#video" },
        { title: 'CRM & Sales', path: "integrations-page#crm" },
        { title: 'WhatsApp', path: "integrations-page#whatsapp" }
      ]
    }
,    
    {
      title: 'Product Customizations',
      icon: <Package className="w-5 h-5 text-indigo-600" />,
      items: [{title:'In-product Notifications',path:"notification-settings"}, {title:'Custom Labels',path:"custom-labels"}, {title:'Roles and Permissions',path:"roles-permissions"}]
    },
    {
      title: 'Data Administration',
      icon: <Lock className="w-5 h-5 text-indigo-600" />,
      items: [{title:'Privacy and Security',path:"privacy-and-security"}, 'Export']
    }
  ];

  return (
    <div className=" bg-gray-50">
      {/* <NavDashbord /> */}
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center mt-2">
        <div className="flex items-center gap-3">
          <Link to='/layoutDashboard' className="hover:bg-gray-100 p-1 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">Admin Center</h1>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              {section.icon}
              <h2 className="font-semibold text-lg">{section.title}</h2>
            </div>
            
            <ul className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link to={item.path} className="text-gray-700 hover:text-indigo-600 transition-colors w-full text-left">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCenter;