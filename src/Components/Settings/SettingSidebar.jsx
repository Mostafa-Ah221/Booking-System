import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  AppWindow,
   
} from 'lucide-react';
import { IoTvOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setCurrentPath, setExpandedSection } from '../../redux/slices/navigationSlice';
import { usePermission } from "../hooks/usePermission";

const SettingSidebar = ({ iconOnly = false }) => {
  const dispatch = useDispatch();
  const { expandedSection } = useSelector(state => state.navigation);
  const [isHovering, setIsHovering] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Organization',
      icon: Settings,
      items: [
        { title: 'Basic Information', icon: Layout, path: "basic-info" },
        { title: 'Recruiter', icon: Globe, path: "recruiterPage", permission: "view staff" }
      ]
    },
    {
      title: 'Modules',
      icon: Layout,
      items: [
        { title: 'Workspaces', icon: Layout, path: "workspaces" },
        { title: 'Resources', icon: IoTvOutline, path: "resources-section" },
        { title: 'Clients', icon: User, path: "clients", permission: "view clients" },
      ]
    },
    {
      title: 'Integrations',
      icon: Plug,
      items: [
        { title: 'Mail', icon: Settings, path: "integrations-page#email" },
        { title: 'SMS', icon: MessageSquare, path: "integrations-page#sms" },
        { title: 'WhatsApp', icon: Globe2, path: "integrations-page#whatsapp" },
      ]
    },    
    {
      title: 'Product Customizations',
      icon: Settings,
      items: [
        { title: 'In-product Notifications', icon: Bell, path: "notification-settings" },
        { title: 'Roles and Permissions', icon: Users, path: "roles-permissions", permission: "view roles" }
      ]
    },
    {
      title: 'Data Administration',
      icon: Lock,
      items: [
        { title: 'Export', icon: FileText, path: "export-data" }
      ]
    },
    {
  title: 'Billing & Plans',
  icon: CreditCard,
  items: [
    { title: 'Subscription invoices', icon: FileText, path: "subscription-invoices" }
  ]
}
  ];

  const isLinkActive = (path) => {
    const currentPathname = location.pathname;
    
    if (path.includes('#')) {
      const [basePath] = path.split('#');
      return currentPathname.includes(basePath);
    }

    return currentPathname.includes(path);
  };

  useEffect(() => {
    const activeSection = menuItems.find(section =>
      section.items.some(item => isLinkActive(item.path))
    );

    if (activeSection) {
      dispatch(setExpandedSection(activeSection.title));
    }
  }, [location.pathname]);

  const handleSectionClick = (title) => {
    dispatch(setExpandedSection(expandedSection === title ? null : title));
  };

  const handleNavigate = (path) => {
    dispatch(setCurrentPath(path));
    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
        }
      }, 500);
    }
  };

  const MenuItem = ({ item }) => {
    const hasPermission = item.permission ? usePermission(item.permission) : true;
    
    if (item.permission && !hasPermission) {
      return null;
    }

    const isActive = isLinkActive(item.path);
    
    return (
      <Link 
        to={item.path}
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
  };

  return (
    <div className={`${iconOnly ? 'w-16' : 'w-68'} min-h-screen bg-white border-r transition-all duration-300`}>
      <div className="p-4 border-b">
        {!iconOnly && (
          <div className="flex items-center gap-2 -mb-0.5">
            <button 
              onClick={() => navigate(-1)}
              className="text-lg font-semibold flex-1 flex items-center gap-1"
            > 
              <div className="hover:bg-gray-100 p-1 rounded-full">
                <ArrowLeft size={20} />
              </div>
              <span className='text-[16px]'>Admin Center</span>
            </button>
          </div>
        )}
        
        {iconOnly && (
          <div className="flex justify-center">
            <button className="p-2 rounded-full bg-gray-100">
              <Search size={20} />
            </button>
          </div>
        )}
      </div>

      <nav className="p-2">
        {menuItems.map((section) => {
          const isSectionActive = section.items.some(item => isLinkActive(item.path));
          
          return (
            <div key={section.title}>
              <button
                onClick={() => handleSectionClick(section.title)}
                onMouseEnter={() => iconOnly && setIsHovering(section.title)}
                onMouseLeave={() => iconOnly && setIsHovering(null)}
                className={`text-sm w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 ${
                  isSectionActive ? 'text-blue-600' : 'text-gray-700'
                } ${iconOnly ? 'justify-center' : ''}`}
              >
                <div className={`flex items-center ${iconOnly ? 'justify-center' : 'gap-2'}`}>
                  <section.icon size={iconOnly ? 20 : 18} className={isSectionActive ? 'text-blue-600' : ''} />
                  {!iconOnly && <span className={isSectionActive ? 'font-semibold' : ''}>{section.title}</span>}
                </div>
                
                {!iconOnly && (
                  expandedSection === section.title 
                    ? <ChevronDown size={18} />
                    : <ChevronRight size={18} />
                )}
                
                {iconOnly && isHovering === section.title && (
                  <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm z-50 whitespace-nowrap">
                    {section.title}
                  </div>
                )}
              </button>

              {expandedSection === section.title && !iconOnly && (
                <div className="ml-2 mt-1 space-y-1 text-sm">
                  {section.items.map((item) => (
                    <MenuItem key={item.title} item={item} />
                  ))}
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