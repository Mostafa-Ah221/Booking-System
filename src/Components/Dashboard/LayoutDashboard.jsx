import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBarDashbord from "./SideBarDashbord";
import NavDashbord from "./NavDashbord";

export default function LayoutDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  const isSettingsPage = location.pathname.includes("/layoutDashboard/setting");

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar - Hidden on desktop when in settings */}
      <div className={`fixed inset-y-0 left-0 z-10 w-64 bg-white transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          ${isSettingsPage ? "lg:hidden" : "lg:translate-x-0"}`}
      >
        <SideBarDashbord />
      </div>

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300
          ${isSettingsPage ? "" : "lg:ml-64"}`}
      >
        {/* Navbar - Fixed height */}
        <div className="flex-shrink-0">
          <NavDashbord 
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        {/* Page Content - This is the ONLY place with scroll */}
        <div className="flex-1 overflow-y-auto">
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