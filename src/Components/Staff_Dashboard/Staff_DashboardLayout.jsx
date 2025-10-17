import { useState } from "react";
import { Outlet } from "react-router-dom";;
import StaffNavDashbord from "./Staff_NavDashbord";
import StaffSideBarDashbord from "./Staff_SideBarDashbord";

export default function StaffDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [selectWorkspace, setSelectWorkspace] = useState(null);

console.log(selectWorkspace);

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-10 w-64 bg-white transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        <StaffSideBarDashbord 
        selectWorkspace={setSelectWorkspace}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow w-full lg:ml-64 overflow-y-auto h-screen">
        {/* Navbar */}
        <StaffNavDashbord
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Page Content */}
        <div className="overflow-y-auto flex-grow">
          <Outlet context={{ selectWorkspace, setSelectWorkspace }}/>
        </div>
      </div>

      {/* Overlay for mobile and tablet when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden "
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}