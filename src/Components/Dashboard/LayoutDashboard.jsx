import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBarDashbord from "./SideBarDashbord";
import NavDashbord from "./NavDashbord";
import NotificationPrompt from "../../firebase/NotificationPrompt";

export default function LayoutDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  const isSettingsPage = location.pathname.includes("/layoutDashboard/setting");

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-100 overflow-auto">
      {/* Overlay - Must be BEFORE sidebar for proper stacking */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed with high z-index on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${isSettingsPage ? "lg:hidden" : "lg:translate-x-0 lg:static lg:z-0"}
      `}>
        <SideBarDashbord />
      </div>

      {/* Main Content Area */}
      <div className={`
        flex flex-col flex-1 min-w-0 w-full
        ${isSettingsPage ? "" : "lg:ml-0"}
      `}>
        {/* Navbar - Sticky with z-index below sidebar overlay but above content */}
        <div className="flex-shrink-0 sticky top-0 z-30 bg-white border-b border-gray-200">
          <NavDashbord 
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

 <NotificationPrompt />
        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-y-auto ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}