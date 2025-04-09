import React, { useEffect, useState } from "react";
import HeroSection from "../../components/tenants/HeroSection";
import ServiceModal from "../../components/tenants/ServiceModal";
import { Navigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { 
  FaWrench, FaBolt, FaToilet, FaShieldAlt, FaTools,
  FaClock, FaCheckCircle, FaClipboardCheck, FaBell,
  FaArrowRight, FaExclamationTriangle, FaHistory,
  FaTemperatureLow,
  FaLightbulb,
  FaChartLine
} from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { getUserIssuesThunk } from "../../store/thunks/issue.thunk";
import { getAllServices } from "../../store/thunks/service.thunk";
import { getAllAlertsThunk } from "../../store/thunks/alert.thunk";
// import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
const iconMapping = {
  FaTemperatureLow: FaTemperatureLow,
  FaShieldAlt: FaShieldAlt,
  FaLightbulb: FaLightbulb,
  FaChartLine: FaChartLine,
};
const HomePage = () => {
  const user = localStorage.getItem("user");
  const { issues, userIssues, loading, error } = useSelector((state) => state.issue);
  const { service } = useSelector((state) => state.service);

  const { isDarkMode } = useTheme();
  const [selectedService, setSelectedService] = useState(null);
  const dispatch = useDispatch();
  
  if(user !== "Tenant") return <Navigate to="/login" />

  const bmsCharacteristics = [
    { 
      label: "HVAC Management", 
      value: "Automated", 
      trend: "Multi-zone control", 
      icon: <FaTemperatureLow />,
      details: "Temperature, humidity & ventilation"
    },
    { 
      label: "Security Integration", 
      value: "Comprehensive", 
      trend: "24/7 monitoring", 
      icon: <FaShieldAlt />,
      details: "Access control & surveillance"
    },
    { 
      label: "Smart Lighting", 
      value: "Intelligent", 
      trend: "Occupancy sensing", 
      icon: <FaLightbulb />,
      details: "Schedule & ambient light adjustment"
    },
    { 
      label: "Energy Management", 
      value: "Optimized", 
      trend: "Resource tracking", 
      icon: <FaChartLine />,
      details: "Usage analysis & reporting"
    },
  ];




  // TODO
  const handleServiceClick = (service) => {
    console.log("hello", service);

    setSelectedService(service);
  };

  useEffect(()=>{
    const fetchReportedIssues = async () => {
         dispatch(getAllServices());
        }
        fetchReportedIssues();
  },[])

 

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
    >
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Service Dashboard
            </h2>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Monitor your active requests and service status
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {bmsCharacteristics.map((feature, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <span className={`p-2 rounded-lg mr-3 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <span className={
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }>
                  {feature.icon}
                </span>
              </span>
              <h3 className={`text-[13px] font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {feature.label}
              </h3>
            </div>
            <span className={`flex items-center text-[10px] font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {feature.trend}
            </span>
          </div>
          <p className={`text-2xl font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-900'
          }`}>
            {feature.value} 
          </p>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {feature.details}
          </p>
        </div>
      ))}
    </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Building Services
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Submit and track your service requests across all building facilities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service && service.map((service, index) =>{
               const ServiceIcon = iconMapping[service.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                onClick={() => handleServiceClick(service)}
                className={`p-8 rounded-xl cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-900 hover:bg-gray-700'
                    : 'bg-gray-50 hover:bg-white'
                } transition-all duration-300 border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    } shadow-lg`}
                  >
                    {<ServiceIcon  className="w-6 h-6"/>}
                  </motion.div>
                  <span className={`text-sm font-medium px-4 py-2 rounded-full ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {service.status}
                  </span>
                </div>

                <h3 className={`text-2xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {service.name}
                </h3>

                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                } leading-relaxed mb-6`}>
                  {service.description}
                </p>

                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Available Services:
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <FaCheckCircle className={`mr-2 text-xs ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Response Time:
                    </span>
                    <span className={`ml-2 text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {service.responseTime}
                    </span>
                  </div>
                 
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    {service.urgencyLevels.map((level, idx) => (
                      <span key={idx} className={`px-3 py-1 text-xs rounded-full ${
                        idx === 2 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                        idx === 1 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {level}
                      </span>
                    ))}
                  </div>
                  <motion.button
                  
                    whileHover={{ x: 5 }}
                    className={`flex items-center text-sm font-medium ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                    }`}
                  >
                    Request Service
                    <FaArrowRight className="ml-2 text-xs" />
                  </motion.button>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* Service Modal */}
      <ServiceModal
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        isDarkMode={isDarkMode}
      />

      
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      /> */}
    </motion.div>
  );
};

export default HomePage;
