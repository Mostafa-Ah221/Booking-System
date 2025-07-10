import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Home/Nav';
import Footer from '../Home/Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
        <NavBar/>
      <div className="flex-grow">
        <Outlet /> 
      </div>
        <Footer/>
    </div>
  );
}
