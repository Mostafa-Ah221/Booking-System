import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Bell,
  Tag,
  Users,
  Settings,
  Clock,
  Globe,
  Layout,
  MapPin,
  User,
  BarChart,
  Lock,
  FileText,
  Calendar,
  Video,
  CreditCard,
  MessageSquare,
  Globe2,
  Plug,
  AppWindow
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingSidebar = ({ iconOnly = false }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [currentPath, setCurrentPath] = useState('basic-info');
  const [isHovering, setIsHovering] = useState(null);

  // Simulating useLocation hook since we don't have react-router-dom
  const location = {
    pathname: '/' + currentPath
  };

  const menuItems = [
    {
      title: 'Organization',
      icon: Settings,
      items: [
        { title: 'Basic Information', icon: Layout, path: "basic-info" },
        { title: 'Business Hours', icon: Clock, path: "business-hours" },
        { title: 'Custom Domain', icon: Globe, path: "custom-domain" }
      ]
    },
    {
      title: 'Modules',
      icon: Layout,
      items: [
        { title: 'Workspaces', icon: Layout, path: "workspaces" },
        { title: 'Resources', icon: FileText, path: "resources-section" },
        { title: 'Customers', icon: User, path: "customers" },
        { title: 'Reports', icon: BarChart, path: "reports" }
      ]
    },
    {
      title: 'Integrations',
      icon: Plug,
      items: [
        { title: 'Calendar', icon: Settings, path: "integrations-page?type=calendar" },
        { title: 'Video Conferencing', icon: Settings, path: "integrations-page?type=video" },
        { title: 'CRM & Sales', icon: Settings, path: "integrations-page?type=crm" },
        { title: 'SMS', icon: Settings, path: "integrations-page?type=sms" },
        { title: 'WhatsApp', icon: Settings, path: "integrations-page?type=whatsapp" },
      ]
    }
,    
    {
      title: 'Product Customizations',
      icon: Settings,
      items: [
        { title: 'In-product Notifications', icon: Bell, path: "notification-settings" },
        { title: 'Custom Labels', icon: Tag, path: "custom-labels" },
        { title: 'Roles and Permissions', icon: Users, path: "roles-permissions" }
      ]
    },
    {
      title: 'Data Administration',
      icon: Lock,
      items: [
        { title: 'Privacy and Security', icon: Lock, path: "privacy-and-security" },
        { title: 'Export', icon: FileText, path: "export-data" }
      ]
    }
  ];

  useEffect(() => {
    const activePath = location.pathname.slice(1);
    const activeSection = menuItems.find(section =>
      section.items.some(item => activePath.includes(item.path))
    );
    
    if (activeSection) {
      setExpandedSection(activeSection.title);
    }
  }, [location.pathname]);

  const handleSectionClick = (title) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const isLinkActive = (path) => {
    return location.pathname.slice(1).includes(path);
  };

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  return (
    <div className={`${iconOnly ? 'w-16' : 'w-72'} min-h-screen bg-white border-r transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b">
        {!iconOnly && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <button className="hover:bg-gray-100 p-1 rounded-full">
                <ArrowLeft size={20} />
              </button>
              <button 
                onClick={() => handleNavigate('layoutDashboard')}
                className="font-semibold">
                Admin Center
              </button>
             </div>

             <div className="relative w-40">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                className="w-40 md:w-full pl-10 pr-4 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </>
        )}
        
        {iconOnly && (
          <div className="flex justify-center">
            <button className="p-2 rounded-full bg-gray-100">
              <Search size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="p-2">
        {menuItems.map((section) => {
          const isSectionActive = section.items.some(item => isLinkActive(item.path));
          
          return (
            <div key={section.title}>
              <button
                onClick={() => handleSectionClick(section.title)}
                onMouseEnter={() => iconOnly && setIsHovering(section.title)}
                onMouseLeave={() => iconOnly && setIsHovering(null)}
                className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 ${
                  isSectionActive ? 'text-blue-600' : 'text-gray-700'
                } ${iconOnly ? 'justify-center' : ''}`}
              >
                <div className={`flex items-center ${iconOnly ? 'justify-center' : 'gap-2'}`}>
                  <section.icon size={iconOnly ? 20 : 18} className={isSectionActive ? 'text-blue-600' : ''} />
                  {!iconOnly && <span className={isSectionActive ? 'font-semibold' : ''}>{section.title}</span>}
                </div>
                
                {!iconOnly && (
                  expandedSection === section.title ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )
                )}
                
                {/* Tooltip for icon-only mode */}
                {iconOnly && isHovering === section.title && (
                  <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm z-50 whitespace-nowrap">
                    {section.title}
                  </div>
                )}
              </button>

              {expandedSection === section.title && !iconOnly && (
                <div className="ml-2 mt-1 space-y-1">
                  {section.items.map((item) => {
                    const isActive = isLinkActive(item.path);
                    return (
                      <Link to={item.path}
                        key={item.title}
                        onClick={() => handleNavigate(item.path)}
                        className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 pl-6 transition-colors ${
                          isActive ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600'
                        }`}
                      >
                        <item.icon 
                          size={16} 
                          className={isActive ? 'text-blue-600' : 'text-gray-600'} 
                        />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingSidebar;