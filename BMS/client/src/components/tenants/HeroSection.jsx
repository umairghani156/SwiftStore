import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaCalendarCheck, FaClipboardList, FaBell, FaArrowRight, FaRegChartBar } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import QuickActionModal from './QuickActionModal';
import { RiTempHotLine } from 'react-icons/ri';
import { MdOutlineSecurity } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";



const HeroSection = () => {
  const { isDarkMode } = useTheme();
  const userName = localStorage.getItem("userName") || "Tenant";
  const [selectedAction, setSelectedAction] = useState(null);

  const features = [
    {
      icon: <FaBuilding className="text-4xl" />,
      title: "Quick Actions",
      description: "Access frequently used services and requests",
      count: "5 services",
      action: "View All"
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      title: "Recent Activity",
      description: "View your latest service requests and updates",
      count: "3 new",
      action: "See Details"
    },
    {
      icon: <FaClipboardList className="text-4xl" />,
      title: "Service History",
      description: "Track all your past maintenance requests",
      count: "28 total",
      action: "View History"
    },
    {
      icon: <FaBell className="text-4xl" />,
      title: "Notifications",
      description: "Stay updated with important alerts",
      count: "2 unread",
      action: "View All"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const handleActionClick = (action) => {
    setSelectedAction(action);
  };

  return (
    <div className={`relative min-h-[60vh] pt-12 overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? '#fff' : '#000'} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}/>
      </motion.div>

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Welcome Message */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Welcome Back, 
            <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}> {userName}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg sm:text-xl mb-12 leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Manage your building services and track requests in one place
          </motion.p>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {/* HVAC System Card */}
      <div className={` ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg rounded-lg p-6 flex flex-col items-center
           border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
        <div className={`flex items-center justify-center h-16 w-16 rounded-full mb-4
          ${
                isDarkMode ? 'bg-gray-700' : 'bg-red-50'
              }`}>
          <RiTempHotLine className={`h-8 w-8 text-red-500`} />
        </div>
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'} mb-2`}>HVAC System</h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
          Monitor and control heating, ventilation, and air conditioning systems.
        </p>
       
      </div>

      {/* Security System Card */}
      <div className={` ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg rounded-lg p-6 flex flex-col items-center
           border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
        <div 
         className={`flex items-center justify-center h-16 w-16 rounded-full mb-4
          ${
                isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
              }`}>
          <MdOutlineSecurity className={`h-8 w-8 text-blue-500`} />
        </div>
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'} mb-2`}>Security System</h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
          Manage access control, surveillance cameras, and alarm systems.
        </p>
    
      </div>

      {/* Lighting System Card */}
      <div className={` ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg rounded-lg p-6 flex flex-col items-center
           border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
        <div className={`flex items-center justify-center h-16 w-16 rounded-full mb-4
          ${
                isDarkMode ? 'bg-yellow-900' : 'bg-yellow-50'
              }`}>
          <BsLightningCharge className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'} mb-2`}>Lighting System</h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
          Control and schedule lighting throughout the building for efficiency.
        </p>
       
      </div>

      {/* Energy Monitoring Card */}
      <div 
      className={` ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg rounded-lg p-6 flex flex-col items-center
       border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className={`flex items-center justify-center h-16 w-16 rounded-full mb-4
          ${
                isDarkMode ? 'bg-gray-700' : 'bg-green-50'
              }`}>
          <FaRegChartBar className="h-8 w-8 text-green-500" />
        </div>
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'} mb-2`}>Energy Monitoring</h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
          Track energy usage and optimize consumption across all systems.
        </p>
       
      </div>
    </div>
     
                    </motion.div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={selectedAction !== null}
        onClose={() => setSelectedAction(null)}
        action={selectedAction}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default HeroSection;
