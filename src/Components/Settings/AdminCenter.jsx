import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Settings, Grid, Layers, Package, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { navigateToPath } from '../../redux/slices/navigationSlice';
import NavDashbord from '../Dashboard/NavDashbord';
import { usePermission } from "../hooks/usePermission";

const AdminCenter = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check permissions once at component level to avoid hook issues
  const hasViewStaff = usePermission("view staff");
  const hasViewClients = usePermission("view clients");
  const hasViewRoles = usePermission("view roles");

  const handleLinkClick = (path, sectionTitle) => {
    const sectionMapping = {
      'basic-info': 'Organization',
      'business-hours': 'Organization',
      'custom-domain': 'Organization',
      'workspaces': 'Modules',
      'person-location': 'Modules',
      'customers': 'Modules',
      'reports': 'Modules',
      'integrations-page#calendar': 'Integrations',
      'integrations-page#sms': 'Integrations',
      'integrations-page#video': 'Integrations',
      'integrations-page#crm': 'Integrations',
      'integrations-page#whatsapp': 'Integrations',
      'notification-settings': 'Product Customizations',
      'custom-labels': 'Product Customizations',
      'roles-permissions': 'Product Customizations',
      'privacy-and-security': 'Data Administration',
      'export': 'Data Administration'
    };
    
    const mappedSection = sectionMapping[path] || sectionTitle;
    dispatch(navigateToPath({ path, section: mappedSection }));
    setSearchQuery(''); // Clear search after navigation
  };

  const sections = [
    {
      title: 'Organization',
      icon: <Settings className="w-5 h-5 text-indigo-600" />,
      items: [
        {title:'Basic Information',path:"basic-info"}, 
        // {title:'Business Hours',path:'business-hours'}, 
        // {title:'Custom Domain',path:"custom-domain"}, 
        ...(hasViewStaff ? [{title:'Recruiters',path:"recruiters"}] : [])
      ]
    },
    {
      title: 'Modules',
      icon: <Grid className="w-5 h-5 text-indigo-600" />,
      items: [
        {title:'Workspaces', path:"workspaces"},  
        // {title:'In-person Locations', path:"person-location"}, 
        ...(hasViewClients ? [{title:'Customers',path:"customers"}] : []),
        {title: 'Reports',path:"reports"}
      ]
    },
    {
      title: 'Integrations',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      items: [
        // { title: 'Calendar', path: "integrations-page#calendar" },
        // { title: 'Video Conferencing', path: "integrations-page#video" },
        { title: 'Mail', icon: Settings, path: "integrations-page#email" },
        { title: 'SMS', path: "integrations-page#sms" },
        { title: 'WhatsApp', path: "integrations-page#whatsapp" }
      ]
    },    
    {
      title: 'Product Customizations',
      icon: <Package className="w-5 h-5 text-indigo-600" />,
      items: [
        // {title:'In-product Notifications',path:"notification-settings"}, 
        // {title:'Custom Labels',path:"custom-labels"}, 
        ...(hasViewRoles ? [{title:'Roles and Permissions',path:"roles-permissions"}] : [])
      ]
    },
    {
      title: 'Data Administration',
      icon: <Lock className="w-5 h-5 text-indigo-600" />,
      items: [
        // {title:'Privacy and Security',path:"privacy-and-security"}, 
        {title:'Export', path:"export-data"}
      ]
    }
  ];

  // Get all items for search without affecting display
  const allItems = useMemo(() => {
    const items = [];
    sections.forEach(section => {
      section.items.forEach(item => {
        items.push({
          ...item,
          section: section.title,
          sectionIcon: section.icon
        });
      });
    });
    return items;
  }, [sections]);

  // Filter items for search dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results
  }, [searchQuery, allItems]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-3 flex justify-between items-center mt-2 pt-4 px-4">
        <div className="flex items-center gap-3">
          <Link to='/layoutDashboard' className="hover:bg-gray-100 p-1 rounded-full flex gap-1 items-center">
            <ArrowLeft className="w-5 h-5" />
            <h1 className="font-semibold">Admin Center</h1>
          </Link>
        </div>
        
        {/* Search with Dropdown */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-10 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              ×
            </button>
          )}
          
          {/* Search Dropdown Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
              {searchResults.map((item, index) => (
                <div key={index} className="border-b border-gray-100 last:border-b-0">
                  <Link
                    to={item.path}
                    onClick={() => handleLinkClick(item.path, item.section)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {item.sectionIcon}
                      <span>{item.section}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-gray-900">
                        {searchQuery ? (
                          <span dangerouslySetInnerHTML={{
                            __html: item.title.replace(
                              new RegExp(`(${searchQuery})`, 'gi'),
                              '<mark class="bg-yellow-200">$1</mark>'
                            )
                          }} />
                        ) : (
                          item.title
                        )}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {/* No Results */}
          {searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found for "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Original Grid Layout - Always Visible */}
      <div className="max-w-7xl p-4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-xs">
              {section.icon}
              <h2 className="font-semibold text-lg">{section.title}</h2>
            </div>
            
            <ul className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>      
                  <Link
                    to={item.path} 
                    onClick={() => handleLinkClick(item.path, section.title)}
                    className="text-gray-700 hover:text-indigo-600 transition-colors w-full text-left block"
                  >
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