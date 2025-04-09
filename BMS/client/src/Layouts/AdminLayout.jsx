import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Navbar from '../components/Admin/Navbar';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = location.pathname?.split('/')[2];
  const splitText = pathname?.split('-');
  const capitalizedText = splitText?.map((text) => text.charAt(0).toUpperCase() + text.slice(1)).join(' ');

  // Auto collapse sidebar on desktop/tablet screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleSidebarCollapse = (collapsed) => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!collapsed);
    } else {
      setIsCollapsed(collapsed);
    }
  };

  const handleMobileMenuClick = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <Sidebar 
          onCollapse={handleSidebarCollapse} 
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
        />
        <div className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}>
          <Navbar 
            capitalizedText={capitalizedText} 
            onMenuClick={handleMobileMenuClick}
          />
          <main className={`p-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;