import React, { useState, useEffect } from 'react';
import { 
  FaCog, FaBell, FaLock, FaPalette, FaUserShield, FaDatabase, 
  FaCheck, FaSpinner, FaMoon, FaSun, FaGlobe, FaUser,
  FaEnvelope, FaKey, FaShieldAlt, FaDesktop
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // Settings State
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      emergencyAlerts: true,
      dailyReports: false,
      weeklyReports: true,
    },
    appearance: {
      theme: isDarkMode ? 'dark' : 'light',
      fontSize: 'medium',
      compactMode: false,
      animationsEnabled: true,
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: '30',
      ipWhitelisting: false,
    },
    system: {
      language: 'English',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      autoBackup: true,
    }
  });

  const [loading, setLoading] = useState({
    notifications: false,
    appearance: false,
    security: false,
    system: false,
  });

  // Handle toggle changes
  const handleToggle = (section, setting) => {
    if (section === 'appearance' && setting === 'theme') {
      toggleDarkMode();
    }
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: !prev[section][setting]
      }
    }));
  };

  // Handle select changes
  const handleSelectChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  // Save section changes
  const handleSave = async (section) => {
    setLoading(prev => ({ ...prev, [section]: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`, {
        style: {
          background: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#333',
        },
      });
    } catch (error) {
      toast.error(`Failed to save ${section} settings. Please try again.`);
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  // Section Card Component
  const SectionCard = ({ title, icon, children, section }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          {icon}
          <h2 className={`text-lg sm:text-xl font-semibold ml-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {title}
          </h2>
        </div>
        <button
          onClick={() => handleSave(section)}
          disabled={loading[section]}
          className={`flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-lg transition-all duration-200 shadow-md
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            } ${loading[section] ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading[section] ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FaCheck className="mr-2" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {children}
      </div>
    </motion.div>
  );

  // Toggle Switch Component
  const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <span className={`text-sm font-medium ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </span>
      <button
        type="button"
        className={`${
          checked 
            ? isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
            : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
      >
        <span
          aria-hidden="true"
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full ${
            isDarkMode ? 'bg-gray-300' : 'bg-white'
          } shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen py-4 sm:py-6 px-3 sm:px-6 lg:px-8 transition-colors duration-200
      ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}"
    >
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } rounded-xl shadow-lg p-4 sm:p-6`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <FaCog className={`text-2xl sm:text-3xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your application preferences and configurations
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleDarkMode()}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Notifications Settings */}
          <SectionCard 
            title="Notifications" 
            icon={<FaBell className={`text-xl sm:text-2xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />}
            section="notifications"
          >
            <ToggleSwitch
              label="Email Alerts"
              checked={settings.notifications.emailAlerts}
              onChange={() => handleToggle('notifications', 'emailAlerts')}
            />
            <ToggleSwitch
              label="Push Notifications"
              checked={settings.notifications.pushNotifications}
              onChange={() => handleToggle('notifications', 'pushNotifications')}
            />
            <ToggleSwitch
              label="Emergency Alerts"
              checked={settings.notifications.emergencyAlerts}
              onChange={() => handleToggle('notifications', 'emergencyAlerts')}
            />
            <ToggleSwitch
              label="Daily Reports"
              checked={settings.notifications.dailyReports}
              onChange={() => handleToggle('notifications', 'dailyReports')}
            />
            <ToggleSwitch
              label="Weekly Reports"
              checked={settings.notifications.weeklyReports}
              onChange={() => handleToggle('notifications', 'weeklyReports')}
            />
          </SectionCard>

          {/* Security Settings */}
          <SectionCard 
            title="Security" 
            icon={<FaUserShield className={`text-xl sm:text-2xl ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />}
            section="security"
          >
            <ToggleSwitch
              label="Two-Factor Authentication"
              checked={settings.security.twoFactorAuth}
              onChange={() => handleToggle('security', 'twoFactorAuth')}
            />
            <ToggleSwitch
              label="Login Notifications"
              checked={settings.security.loginNotifications}
              onChange={() => handleToggle('security', 'loginNotifications')}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Session Timeout (minutes)
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSelectChange('security', 'sessionTimeout', e.target.value)}
                className={`rounded-lg px-3 py-2 text-sm border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <ToggleSwitch
              label="IP Whitelisting"
              checked={settings.security.ipWhitelisting}
              onChange={() => handleToggle('security', 'ipWhitelisting')}
            />
          </SectionCard>

          {/* Appearance Settings */}
          <SectionCard 
            title="Appearance" 
            icon={<FaPalette className={`text-xl sm:text-2xl ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />}
            section="appearance"
          >
            <ToggleSwitch
              label="Dark Mode"
              checked={isDarkMode}
              onChange={() => handleToggle('appearance', 'theme')}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Font Size
              </label>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => handleSelectChange('appearance', 'fontSize', e.target.value)}
                className={`rounded-lg px-3 py-2 text-sm border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <ToggleSwitch
              label="Compact Mode"
              checked={settings.appearance.compactMode}
              onChange={() => handleToggle('appearance', 'compactMode')}
            />
            <ToggleSwitch
              label="Enable Animations"
              checked={settings.appearance.animationsEnabled}
              onChange={() => handleToggle('appearance', 'animationsEnabled')}
            />
          </SectionCard>

          {/* System Settings */}
          <SectionCard 
            title="System" 
            icon={<FaDatabase className={`text-xl sm:text-2xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />}
            section="system"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Language
              </label>
              <select
                value={settings.system.language}
                onChange={(e) => handleSelectChange('system', 'language', e.target.value)}
                className={`rounded-lg px-3 py-2 text-sm border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Zone
              </label>
              <select
                value={settings.system.timezone}
                onChange={(e) => handleSelectChange('system', 'timezone', e.target.value)}
                className={`rounded-lg px-3 py-2 text-sm border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
                <option value="GMT">GMT</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Date Format
              </label>
              <select
                value={settings.system.dateFormat}
                onChange={(e) => handleSelectChange('system', 'dateFormat', e.target.value)}
                className={`rounded-lg px-3 py-2 text-sm border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <ToggleSwitch
              label="Auto Backup"
              checked={settings.system.autoBackup}
              onChange={() => handleToggle('system', 'autoBackup')}
            />
          </SectionCard>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Settings;