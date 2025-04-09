import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaHome, FaClipboardList, FaCalendarAlt, FaChartBar, FaBell, FaUser, FaBars, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { getAllAlertsThunk, markAllAlertsAsReadThunk } from '../../store/thunks/alert.thunk';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
const TenantNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {allAlerts} = useSelector((state) => state.alert);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New maintenance request approved", time: "2 min ago" },
    { id: 2, message: "Visitor appointment scheduled", time: "1 hour ago" },
    { id: 3, message: "Building maintenance notice", time: "2 hours ago" },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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

   useEffect(() => {
      const fetchAllAlerts = () =>{
        dispatch(getAllAlertsThunk());
      }
      fetchAllAlerts();
    },[])

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationsDropdownOpen(false);
  };

  const toggleNotificationsDropdown = () => {
    setNotificationsDropdownOpen(!notificationsDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const markAllAsRead = () => {
    dispatch(markAllAlertsAsReadThunk());
    setNotifications([]);
   
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
   // toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    { to: '/', icon: <FaHome />, text: 'Home' },
    { to: '/appointment', icon: <FaCalendarAlt />, text: 'Appointments' },
    { to: '/reports', icon: <FaChartBar />, text: 'Reports' },
    { to: '/monitoring', icon: <FaClipboardList />, text: 'Monitoring' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isDarkMode ? 'bg-gray-900 border-b-[1px] border-blue-950 shadow-lg shadow-blue-950' : 'bg-white'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>

             <img className='w-20 h-20' src='/assets/images/bms-logo.png' alt="BMS Logo"/>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`flex items-center space-x-2 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.text}</span>
              </Link>
            ))}
          </div>

          {/* Notification and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleNotificationsDropdown}
                className={`p-2 rounded-md ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaBell className="h-5 w-5" />
                {allAlerts && allAlerts?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {allAlerts?.length}
                  </span>
                )}
              </button>

              {notificationsDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-72 rounded-md shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                      </h3>
                      { allAlerts && allAlerts?.length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className={`text-xs font-medium ${
                            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                          }`}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      { allAlerts && allAlerts?.length > 0 ? (
                        allAlerts?.slice(0, 5).map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-2 mb-2 rounded-md ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {notification.description}
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDistanceToNow(new Date(notification?.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No new notifications
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleProfileDropdown}
                className={`p-2 rounded-md ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaUser className="h-5 w-5" />
              </button>

              {profileDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className="py-1">
                    <button
                      onClick={logoutHandler}
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>{link.icon}</span>
              <span>{link.text}</span>
            </Link>
          ))}
          {/* Theme Toggle for Mobile */}
          <button
            onClick={toggleTheme}
            className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span>{isDarkMode ? <FaSun /> : <FaMoon />}</span>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={logoutHandler}
            className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span><FaSignOutAlt /></span>
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TenantNavbar; 