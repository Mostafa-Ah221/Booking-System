import React from 'react'
import SidebarAcount from './sidebar/SidebarAcount'
import { Outlet } from 'react-router-dom';
import Navbar from './nav/Navbar';

export default function LayoutAcount() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <Navbar />
      </div>
      
      {/* Main content container */}
      <div className="flex w-full min-h-screen pt-16">
        {/* Sidebar - fixed position */}
        <div className="fixed top-14 left-0 bottom-0 w-64 bg-gray-900 shadow-md z-10 ">
          <SidebarAcount />
        </div>
        
        {/* Main content area with proper margin */}
        <div className="ml-64 flex-grow p-6 overflow-y-auto">
          <Outlet /> 
        </div>
      </div>
    </div>
  )
}