// Complete SliderInterviewPages.jsx Component
import { useState, useEffect } from "react";
import { FileText, Clock, ChevronDown, ChevronRight} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SliderInterviewPages_Staff({ toggleSidebar, id }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [expandedItems, setExpandedItems] = useState({});
  const userType = localStorage.getItem("userType");
  
useEffect(() => {
  const currentPath = location.pathname;
  
  if (currentPath.includes('notifications')) {
    setExpandedItems(prev => ({
      ...prev,
      5: true 
    }));
    
    const pathParts = currentPath.split('/');
    const notificationType = pathParts[pathParts.length - 1]; 
    
    setActiveItem(`notifications/${notificationType}`);
  } else {
    setActiveItem(currentPath);
  }
}, [location.pathname]);

const isNotificationRoute = (path) => {
  return path.includes('notifications');
};
  
  const navItems = [
    { 
      id: 1,
      icon: <FileText className="w-5 h-5" />,
      title: "Interview Details",
      description: "Set the duration, payment type, and meeting mode.",
      path: `${userType === "staff" ? `/interview-layout-staff/${id}` : `/interview-layout/${id}`}`,
    },
    //   ...(interview?.type === "collective-booking"
    // ? [
    //     {
    //       id: 2,
    //       icon: <Users className="w-5 h-5" />,
    //       title: "Assigned Groups",
    //       description: "View groups who offer this event type.",
    //       path: "assign-groups-to-interview" 
    //     }
    //   ]
    // : []),
    //  ...(interview?.type !== "collective-booking" && interview?.type !== "resource"
    // ? [
    // {
    //   id: 4,
    //   icon: <Users className="w-5 h-5" />,
    //   title: "Assign Recruiter",
    //   description: "Assign recruiter to this Interview.",
    //   path: "assign-recruiter-to-interview" 
    // },
    //  ]
    // : []),
    //  ...(interview?.type === "resource"
    // ? [
    // {
    //   id: 4,
    //   icon: <Users className="w-5 h-5" />,
    //   title: "Assign Resource",
    //   description: "Assign Resource to this Interview.",
    //   path: "assign-resource-to-interview" 
    // },
    //  ]
    // : [])
    // ,
    // {
    //   id: 3,
    //   icon: <Clock className="w-5 h-5" />,
    //   title: "Availability",
    //   description: "Set the date and time for this Interview.",
    //   path: "interview-availability-staff"
    // },
    // {
    //   id: 4,
    //   icon: <Calendar className="w-5 h-5" />,
    //   title: "Scheduling Rules",
    //   description: "Set buffers, notices, and intervals.",
    //   path: "scheduling-rules" 
    // },
     
    // ...(ControlInterview ? [{
//       id: 5,
//       icon: <Bell className="w-5 h-5" />,
//       title: "Notification Preferences",
//       description: "Configure email, SMS, and calendar notifications.",
//       path: "notification-preferences",
//       hasSubmenu: true,
//      submenu: [
//   {
//     id: "5-1",
//     icon: <Mail className="w-4 h-4" />,
//     title: "Email Notifications",
//     path: "notifications/email"
//   },
//   {
//     id: "5-2", 
//     icon: <MessageSquare className="w-4 h-4" />,
//     title: "SMS Notifications",
//     path: "notifications/sms"
//   },
//   {
//     id: "5-3",
//     icon: <FaWhatsapp className="w-4 h-4" />,
//     title: "WhatsApp",
//     path: "notifications/whatsApp"
//   }
// ]
  //   }] : []),
  ];

  const handleItemClick = (path, hasSubmenu = false, itemId = null) => {
    if (hasSubmenu) {
      // Toggle submenu expansion
      const wasExpanded = expandedItems[itemId];
      setExpandedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
      
      // If expanding for the first time, navigate to default email notifications
      // If expanding for the first time, navigate to default email notifications
if (!wasExpanded) {
  const emailPath = "notifications/email";
  setActiveItem(emailPath);
  navigate(emailPath);
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
      (item.submenu && item.submenu.some(subItem => 
        activeItem === subItem.path || 
        isNotificationRoute(location.pathname)
      ));

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
                <div className={`${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <div className={`transition-transform duration-200 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {/* Submenu Items - These have actual Links */}
          {isExpanded && (
            <div className="bg-gray-50 border-l-4 border-blue-100">
              {item.submenu.map((subItem) => {
               const isSubItemActive = activeItem === subItem.path || 
  (location.pathname.includes('notifications') && 
   location.pathname.includes(subItem.path.split('/')[1]));
                
                return (
                  <Link
                    to={subItem.path}
                    key={subItem.id}
                    onClick={() => handleItemClick(subItem.path)}
                    className={`block p-4 pl-12 border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out
                      ${isSubItemActive ? "border-l-4 border-blue-500 bg-blue-100" : "border-l-4 border-transparent"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${isSubItemActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {subItem.icon}
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${isSubItemActive ? 'text-blue-900' : 'text-gray-700'}`}>
                          {subItem.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
          <div className={`${activeItem === item.path ? 'text-blue-600' : 'text-gray-600'}`}>
            {item.icon}
          </div>
          <div>
            <h3 className={`text-sm font-medium ${activeItem === item.path ? 'text-blue-900' : 'text-gray-900'}`}>
              {item.title}
            </h3>
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