import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaHistory, FaCalendarAlt, FaSearch } from 'react-icons/fa';

const QuickActionModal = ({ isOpen, onClose, action, isDarkMode }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  if (!isOpen || !action) return null;

  const getActionContent = () => {
    switch (action.title) {
      case 'Quick Actions':
        return (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Frequent Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {['Submit Request', 'Schedule Maintenance', 'Report Issue', 'View Status'].map((item, idx) => (
                  <button
                    key={idx}
                    className={`p-3 rounded-lg text-sm font-medium ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    } transition-colors`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Recent Activity':
        return (
          <div className="space-y-4">
            <div className={`flex items-center justify-between mb-4 pb-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex space-x-4">
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  All Activities
                </button>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  Requests
                </button>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  Updates
                </button>
              </div>
              <div className={`relative ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  className={`pl-10 pr-4 py-2 rounded-lg text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200'
                      : 'bg-gray-100 border-gray-200 text-gray-700'
                  } focus:ring-2 focus:ring-blue-500 border`}
                />
              </div>
            </div>
            {[
              { title: 'Maintenance Request', status: 'In Progress', time: '2 hours ago' },
              { title: 'Security Access Update', status: 'Completed', time: '5 hours ago' },
              { title: 'Visitor Registration', status: 'Pending', time: 'Yesterday' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h4>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Completed'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : item.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'Service History':
        return (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Service History Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className={
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  } />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Last 30 days
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Requests', value: '28' },
                  { label: 'Completed', value: '24' },
                  { label: 'Pending', value: '4' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`space-y-3 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <h4 className="font-medium">Recent History</h4>
              {[
                { date: '2024-01-15', service: 'Electrical Maintenance', status: 'Completed' },
                { date: '2024-01-10', service: 'Plumbing Repair', status: 'Completed' },
                { date: '2024-01-05', service: 'Security System Update', status: 'Completed' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-4">
                    <FaHistory className={
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    } />
                    <div>
                      <p className="font-medium">{item.service}</p>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Notifications
              </h3>
              <button className={`text-sm font-medium ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Mark all as read
              </button>
            </div>
            {[
              {
                title: 'Maintenance Schedule',
                message: 'Scheduled maintenance for elevators tomorrow at 10 AM',
                time: '1 hour ago',
                isUnread: true
              },
              {
                title: 'Security Update',
                message: 'New security protocols in effect from next week',
                time: '3 hours ago',
                isUnread: true
              },
              {
                title: 'Service Request Update',
                message: 'Your plumbing service request has been completed',
                time: 'Yesterday',
                isUnread: false
              },
            ].map((notification, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  isDarkMode
                    ? notification.isUnread ? 'bg-gray-800' : 'bg-gray-800/50'
                    : notification.isUnread ? 'bg-white' : 'bg-gray-50'
                } ${
                  notification.isUnread ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </h4>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {notification.time}
                  </span>
                </div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          onClick={e => e.stopPropagation()}
          className={`w-full max-w-lg mx-auto my-8 rounded-2xl ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } shadow-xl`}
        >
          <div className={`p-4 sm:p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`p-2 sm:p-3 rounded-xl mr-3 sm:mr-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                } ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {action.icon}
                </span>
                <h2 className={`text-xl sm:text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {action.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {getActionContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickActionModal; 