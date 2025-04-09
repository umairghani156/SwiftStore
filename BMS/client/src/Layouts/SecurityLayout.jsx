import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SecuritySidebar from '../components/Security/SecuritySidebar';
import Navbar from '../components/Admin/Navbar';
import { useTheme } from '../context/ThemeContext';

const SecurityLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleSidebarCollapse = (collapsed) => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!collapsed);
    } else {
      setIsSidebarCollapsed(collapsed);
    }
  };


  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <SecuritySidebar 
        isCollapsed={isSidebarCollapsed}
        onCollapse={handleSidebarCollapse}
        isMobileOpen={isMobileOpen}
      />
      
      <div className={`transition-all duration-200 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <Navbar 
          onMenuClick={toggleMobileSidebar}
          title="Security Panel"
        />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SecurityLayout;