import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarDashbord from "./SideBarDashbord";
import NavDashbord from "./NavDashbord";

export default function LayoutDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar - ثابت دائمًا في اليسار */}
      <div className={`fixed inset-y-0 left-0 z-10 w-64 bg-white transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        <SideBarDashbord />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow w-full lg:ml-64 overflow-y-auto h-screen">
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

      {/* Overlay عند فتح الـ Sidebar في الموبايل */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden "
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}