import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaTrash, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Emergency Maintenance Required',
      message: 'Urgent maintenance needed in Building A, Floor 3',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'success',
      title: 'Task Completed',
      message: 'Monthly maintenance check completed successfully',
      timestamp: '3 hours ago',
      read: true,
    },
    {
      id: 3,
      type: 'info',
      title: 'New Appointment Request',
      message: 'New visitor appointment request from John Doe',
      timestamp: '5 hours ago',
      read: false,
    },
    {
      id: 4,
      type: 'alert',
      title: 'Security Alert',
      message: 'Unauthorized access attempt detected at main entrance',
      timestamp: '1 day ago',
      read: false,
    },
  ]);

  const [filter, setFilter] = useState('all');

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'alert':
        return <FaExclamationCircle className="text-red-500" size={20} />;
      case 'success':
        return <FaCheckCircle className="text-green-500" size={20} />;
      case 'info':
        return <FaEnvelope className="text-blue-500" size={20} />;
      default:
        return <FaBell className="text-yellow-500" size={20} />;
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Notifications</h1>
          <div className="flex flex-wrap gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-3 py-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-100' 
                  : 'bg-gray-100 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Mark All as Read
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <FaBell className="mx-auto text-4xl mb-4 text-gray-400" />
              <p className="text-gray-500">No notifications to display</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg ${
                    isDarkMode
                      ? notification.read ? 'bg-gray-700' : 'bg-gray-700 border-l-4 border-blue-500'
                      : notification.read ? 'bg-gray-50' : 'bg-white border-l-4 border-blue-500'
                  } transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(notification.type)}
                      <div>
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                          title="Mark as read"
                        >
                          <FaCheckCircle className="text-blue-500" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;