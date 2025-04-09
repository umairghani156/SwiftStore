import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useServiceRequest } from '../../context/ServiceRequestContext';
import { useDispatch } from 'react-redux';
import { addIssueThunk } from '../../store/thunks/issue.thunk';
import { addSpecialIssueAPI } from '../../api/issuesAPI';
import toast from "react-hot-toast";

const ServiceModal = ({ isOpen, onClose, service, isDarkMode }) => {
  const [urgencyLevel, setUrgencyLevel] = useState('Low');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const urgencyLevels = ['Low', 'Medium', 'High', 'Urgent'];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      // toast.error('Please provide a description of the issue.');
      return;
    }

    try {
      const formData = {
        title:service.name,
        description: description.trim(),
        urgency: urgencyLevel,
        assignedTo: service._id 
      };
      

      const result = await addSpecialIssueAPI(formData);
      console.log("Response", result)
     
    
      toast.success("Service Requested Successfully.")
      setDescription('');
      setUrgencyLevel('Low');
      onClose();
      
      
      
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit service request. Please try again.');
      setDescription('');
      setUrgencyLevel('Low');
      onClose();
    }
  };

  if (!isOpen) return null;

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
          {/* Header */}
          <div className={`p-4 sm:p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className={`p-2 sm:p-3 rounded-xl mr-3 sm:mr-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                } ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {service.name}
                </span>
                <h2 className={`text-xl sm:text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {service.title}
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
            <p className={`text-sm sm:text-base ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {service.description}
            </p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Available Services
                </h3>
                <ul className="space-y-2">
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
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Service Information
                </h3>
                <div className="space-y-3">
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">Response Time:</span>
                    <span className="ml-2">{service.responseTime}</span>
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">Current Status:</span>
                    <span className="ml-2">{service.status}</span>
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">Active Requests:</span>
                    <span className="ml-2">{service.count}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Request Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Urgency Level
                </label>
                <select
                  value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-gray-300' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 transition-colors`}
                >
                  {urgencyLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-gray-300' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 transition-colors`}
                  placeholder="Please describe your request in detail..."
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-yellow-600 dark:text-yellow-500">
                  <FaExclamationTriangle className="mr-2" />
                  <span className="text-sm">Emergency? Call: (555) 123-4567</span>
                </div>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg font-semibold ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition-colors`}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceModal; 