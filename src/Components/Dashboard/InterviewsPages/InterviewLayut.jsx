import React, { useState } from 'react';
import SliderInterviewPages from './SliderInterviewPages';
import { Outlet, useParams } from 'react-router-dom';
import NavInterview from './NavInterview';
import { Menu, X } from 'lucide-react';

export default function InterviewLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
const {id}=useParams()

  return (
    <main className="mx-auto bg-white relative">
      <NavInterview />
      
      {/* Hamburger Menu Button (visible on mobile and tablet) */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 lg:hidden z-30 bg-blue-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="grid grid-cols-12">
        {/* Overlay for mobile and tablet when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <div 
          className={`
            fixed lg:static inset-y-0 left-0 transform z-20
            lg:col-span-3 
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0
            bg-white 
            w-3/4 lg:w-auto
            overflow-y-auto
            h-full
          `}
        >
          <SliderInterviewPages toggleSidebar={toggleSidebar} id={id} />
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9 p-4 ">
          <Outlet  context={{ id }}/>
        </div>
      </div>
    </main>
  );
}