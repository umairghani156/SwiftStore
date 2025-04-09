import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from '../../context/ThemeContext';
import { FaUserCircle, FaCog, FaSignOutAlt, FaBell, FaSun, FaMoon, FaBars } from 'react-icons/fa';

const Navbar = ({ capitalizedText, onMenuClick }) => {
  const pathname = localStorage.getItem("user");
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Logout Handler
  const logOutHandler = () => {
   localStorage.removeItem("user");
   localStorage.removeItem("token");
   toast.success("Logged out successfully");
   navigate("/login");
  };

  return (
    <div className={`flex items-center justify-between px-6 py-4 w-full ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } border-b transition-colors duration-200`}>
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="sm:hidden mr-4 p-2 rounded-lg transition-colors duration-200"
        >
          <FaBars className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
      </button>
        
        <h1 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {capitalizedText || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </button>

        {/* Notifications */}
        <button
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
              : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
          }`}
          aria-label="Notifications"
        >
          <FaBell className="text-xl" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaUserCircle className="text-xl" />
          </button>

          {isDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            } border z-[100]`}>
              <Link
                to={`/${pathname.toLocaleLowerCase()}-panel/profile`}
                className={`flex items-center px-4 py-2 text-sm ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaUserCircle className="mr-2" />
                Profile
              </Link>
              <Link
                to="/admin-panel/settings"
                className={`flex items-center px-4 py-2 text-sm ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaCog className="mr-2" />
                Settings
              </Link>
              <button
                onClick={logOutHandler}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
          </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Navbar;
