import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBarDashbord from "./SideBarDashbord";
import NavDashbord from "./NavDashbord";

export default function LayoutDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Check if current path contains "setting"
  const isSettingsPage = location.pathname.includes("/layoutDashboard/setting");

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar - Hidden on desktop when in settings */}
      <div className={`fixed inset-y-0 left-0 z-10 w-64 bg-white transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          ${isSettingsPage ? "lg:hidden" : "lg:translate-x-0"}`}
      >
        <SideBarDashbord />
      </div>

      {/* Main Content */}
      <div className={`flex flex-col flex-grow w-full overflow-y-auto h-screen transition-all duration-300
          ${isSettingsPage ? "" : "lg:ml-64"}`}
      >
        {/* Navbar */}
        <NavDashbord 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Page Content */}
        <div className="overflow-y-auto flex-grow">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile and tablet when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-5"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}