// SliderInterviewPages.jsx
import React, { useState } from "react";
import { FileText, Users, Clock, Calendar, Bell, ChevronDown, ChevronRight, Mail, MessageSquare, CalendarDays } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SliderInterviewPages({ toggleSidebar, id }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [expandedItems, setExpandedItems] = useState({});

  const navItems = [
    { 
      id: 1,
      icon: <FileText className="w-5 h-5" />,
      title: "Interview Details",
      description: "Set the duration, payment type, and meeting mode.",
      path: `/interview-layout/${id}`
    },
    {
      id: 2,
      icon: <Users className="w-5 h-5" />,
      title: "Assigned Recruiters",
      description: "View Recruiters who offer this event type.",
      path: "recruiters-managment"
    },
    {
      id: 3,
      icon: <Clock className="w-5 h-5" />,
      title: "Availability",
      description: "Set the date and time for this Interview.",
      path: "interview-availability"
    },
    {
      id: 4,
      icon: <Calendar className="w-5 h-5" />,
      title: "Scheduling Rules",
      description: "Set buffers, notices, and intervals.",
      path: "scheduling-rules" 
    },
    {
      id: 5,
      icon: <Bell className="w-5 h-5" />,
      title: "Notification Preferences",
      description: "Configure email, SMS, and calendar notifications.",
      path: "notification-preferences",
      hasSubmenu: true,
      submenu: [
        {
          id: "5-1",
          icon: <Mail className="w-4 h-4" />,
          title: "Email",
          path: "email-notifications/email"
        },
        {
          id: "5-2", 
          icon: <MessageSquare className="w-4 h-4" />,
          title: "SMS",
          path: "email-notifications/sms"
        },
        {
          id: "5-3",
          icon: <CalendarDays className="w-4 h-4" />,
          title: "Calendar Invites",
          path: "email-notifications/calendar"
        }
      ]
    }
  ];

  const handleItemClick = (path, hasSubmenu = false, itemId = null) => {
    if (hasSubmenu) {
      // Toggle submenu expansion and navigate to default email page
      const wasExpanded = expandedItems[itemId];
      setExpandedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
      
      // If expanding for the first time, navigate to email-notifications
      if (!wasExpanded) {
        setActiveItem("email-notifications/email");
        navigate("email-notifications/email");
      }
    } else {
      setActiveItem(path);
      // Close sidebar on mobile when item is clicked
      if (toggleSidebar && window.innerWidth < 768) {
        toggleSidebar();
      }
    }
  };

  const renderNavItem = (item) => {
    const isExpanded = expandedItems[item.id];
    const isActive = activeItem === item.path || 
      (item.submenu && item.submenu.some(subItem => activeItem === subItem.path));

    if (item.hasSubmenu) {
      return (
        <div key={item.id}>
          {/* Parent Item - No Link, just toggle */}
          <div
            onClick={() => handleItemClick(item.path, true, item.id)}
            className={`block p-4 border-b hover:bg-gray-200 transition duration-200 ease-in-out cursor-pointer select-none
              ${isActive ? "border-l-4 border-blue-500 bg-blue-50" : "border-l-4 border-transparent"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">{item.icon}</div>
                <div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <div className="text-gray-400 transition-transform duration-200">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Submenu Items - These have actual Links */}
          {isExpanded && (
            <div className="bg-gray-50 border-l-4 border-blue-100">
              {item.submenu.map((subItem) => (
                <Link
                  to={subItem.path}
                  key={subItem.id}
                  onClick={() => handleItemClick(subItem.path)}
                  className={`block p-4 pl-12 border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out
                    ${activeItem === subItem.path ? "border-l-4 border-blue-500 bg-blue-100" : "border-l-4 border-transparent"}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-500">{subItem.icon}</div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">{subItem.title}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Regular nav item with Link
    return (
      <Link
        to={item.path}
        key={item.id}
        onClick={() => handleItemClick(item.path)}
        className={`block p-4 border-b hover:bg-gray-200 transition duration-200 ease-in-out 
          ${activeItem === item.path ? "border-l-4 border-blue-500 bg-blue-50" : "border-l-4 border-transparent"}`}
        aria-label={item.title}
      >
        <div className="flex items-center space-x-4">
          <div className="text-gray-600">{item.icon}</div>
          <div>
            <h3 className="text-sm font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white border rounded-lg shadow-md overflow-hidden">
        <nav className="space-y-0">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
      </div>
    </div>
  );
}