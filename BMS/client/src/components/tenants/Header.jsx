import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { CiMenuBurger } from "react-icons/ci";
import { FaRegBell, FaUserCircle, FaSun, FaMoon, FaChartBar, FaClipboardList, FaHome, FaCalendarAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New maintenance request approved", time: "2 min ago", type: "success" },
    { id: 2, message: "Visitor appointment scheduled", time: "1 hour ago", type: "info" },
    { id: 3, message: "Building maintenance notice", time: "2 hours ago", type: "warning" },
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setProfileDropdownOpen(false);
        setNotificationsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setProfileDropdownOpen(false);
    setNotificationsDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
      setNotificationsDropdownOpen(false);
  };

  const toggleNotificationsDropdown = () => {
    setNotificationsDropdownOpen(!notificationsDropdownOpen);
      setProfileDropdownOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications([]);
    toast.success('All notifications marked as read');
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    { path: "/", name: "Home", icon: <FaHome /> },
    { path: "/appointment", name: "Appointments", icon: <FaCalendarAlt /> },
    { path: "/reports", name: "Reports", icon: <FaChartBar /> },
    { path: "/monitoring", name: "Monitoring", icon: <FaClipboardList /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    } border-b transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/assets/images/bms-logo.png"
              alt="Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
              <NavLink
                  to={link.path}
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                    ${isDarkMode
                      ? isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                      : isActive
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {link.icon}
                  <span>{link.name}</span>
              </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors duration-200`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </motion.button>

            {/* Notifications */}
            <div className="relative dropdown-container">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleNotificationsDropdown}
                className={`relative p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' 
                    : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                }`}
                aria-label="Notifications"
              >
                <FaRegBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } ring-1 ring-black ring-opacity-5 z-50`}
                  >
                    <div className="p-4">
                      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={`p-3 rounded-lg ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                              }`}
                            >
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {notification.time}
                              </p>
                            </motion.div>
                          ))
                        ) : (
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No new notifications
                          </p>
                        )}
                      </div>
                      {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                          className={`mt-3 w-full py-2 text-sm font-medium rounded-lg ${
                            isDarkMode 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          } transition-colors duration-200`}
                        >
                          Mark all as read
                    </button>
                      )}
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative dropdown-container">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                  onClick={toggleProfileDropdown}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-purple-400 hover:bg-gray-700' 
                    : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
                }`}
                aria-label="User menu"
              >
                <FaUserCircle className="text-xl" />
              </motion.button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } ring-1 ring-black ring-opacity-5 z-50`}
                  >
                    <div className="py-1">
                    <button
                      onClick={logoutHandler}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          isDarkMode 
                            ? 'text-white hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Sign out
                    </button>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleMenuToggle}
              className={`md:hidden p-2 rounded-lg ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Main menu"
            >
              {isMenuOpen ? <RxCross1 className="text-xl" /> : <CiMenuBurger className="text-xl" />}
            </motion.button>
              </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.path}
                    whileHover={{ x: 4 }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium w-full
                        ${isDarkMode
                          ? isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                          : isActive
                            ? 'bg-gray-100 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </nav>
  );
};

export default Header;
