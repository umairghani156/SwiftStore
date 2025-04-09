import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaBell,
  FaCog,
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaCalendarAlt,
  FaTools,
  FaFileAlt,
  FaUserTie,
  FaMoneyBillWave,
  FaComments,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/sidebar.css";

const ManagerSidebar = ({ onCollapse, isCollapsed, isMobileOpen }) => {
  const [openDropdown, setOpenDropdown] = useState("");
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const sidebarRef = useRef(null);

  const closeMobileSidebar = () => {
    if (window.innerWidth < 768) {
      onCollapse?.(true);
    }
  };

  const toggleSidebar = () => {
    onCollapse?.(!isCollapsed);
    if (isCollapsed) {
      return;
    }
    setOpenDropdown("");
  };

  const toggleDropdown = (dropdownId) => {
    if (isCollapsed) {
      onCollapse?.(false);
      setOpenDropdown(dropdownId);
      return;
    }
    setOpenDropdown(openDropdown === dropdownId ? "" : dropdownId);
  };

  const isSubItemActive = (path) => location.pathname === path;
  const isDropdownActive = (subItems) =>
    subItems?.some((item) => location.pathname === item.path);

  const mainMenuItems = [
    {
      path: "/manager-panel/dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
    },
    {
      path: "/manager-panel/issue-management",
      icon: <FaClipboardList />,
      label: "Issue Management",
    },
    {
      path: "/manager-panel/appointments",
      icon: <FaCalendarAlt />,
      label: "Appointments",
    },
    {
      path: "/manager-panel/office-reports",
      icon: <FaClipboardList />,
      label: "Office Reports",
    },
    {
      path: "/manager-panel/notifications",
      icon: <FaBell />,
      label: "Notifications",
    },
    {
      path: "/manager-panel/settings",
      icon: <FaCog />,
      label: "Settings",
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
          style={{ cursor: 'pointer' }}
        />
      )}

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{
          width: window.innerWidth >= 768 ? (isCollapsed ? "5rem" : "16rem") : "16rem"
        }}
        className={`fixed top-0 left-0 h-screen transition-all duration-200 z-50 ${
          isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        } shadow-lg ${
          isMobileOpen
            ? "translate-x-0 md:translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute -right-3 top-9 p-1.5 rounded-full shadow-lg transition-colors duration-200 z-[60] hidden md:block ${
            isDarkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={closeMobileSidebar}
          className={`absolute top-4 right-4 p-2 rounded-full md:hidden ${
            isDarkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaTimes size={16} />
        </button>

        {/* Logo Section */}
        <div className={`p-4 flex items-center justify-center ${
          isCollapsed && window.innerWidth >= 768 ? "h-16" : "h-20"
        }`}>
          {isDarkMode ? (
            <div className="flex items-center justify-center">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`font-bold text-white ${
                  isCollapsed && window.innerWidth >= 768 ? "text-2xl" : "text-3xl"
                }`}
              >
                BMS
              </motion.h1>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src="/assets/images/bms-logo.png" className="w-20" alt="BMS Logo" />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col gap-2 px-2">
          {mainMenuItems.map((item) => {
            const isActive = item.path
              ? location.pathname === item.path
              : isDropdownActive(item.subItems);

            if (item.subItems) {
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? isDarkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-600"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-xl">{item.icon}</div>
                      {(!isCollapsed || window.innerWidth < 768) && (
                        <span className="ml-3">{item.label}</span>
                      )}
                    </div>
                    {(!isCollapsed || window.innerWidth < 768) && (
                      <div className="text-sm">
                        {openDropdown === item.id ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {openDropdown === item.id && (!isCollapsed || window.innerWidth < 768) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2"
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={closeMobileSidebar}
                            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                              isSubItemActive(subItem.path)
                                ? isDarkMode
                                  ? "bg-blue-500/50 text-white"
                                  : "bg-blue-50/50 text-blue-600"
                                : isDarkMode
                                ? "text-gray-400 hover:bg-gray-700/50"
                                : "text-gray-500 hover:bg-gray-100/50"
                            }`}
                          >
                            <div className="text-lg">{subItem.icon}</div>
                            <span className="ml-3 text-sm">{subItem.label}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-600"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="text-xl">{item.icon}</div>
                {(!isCollapsed || window.innerWidth < 768) && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
};

export default ManagerSidebar;