import React from 'react';
import { Outlet } from 'react-router-dom';
import TenantNavbar from '../components/tenants/TenantNavbar';
import Footer from '../components/tenants/Footer';
import { useTheme } from '../context/ThemeContext';

const TenantLayout = () => {
  const { isDarkMode } = useTheme();
  

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <TenantNavbar />
      <main className={`flex-grow pt-16 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default TenantLayout;
