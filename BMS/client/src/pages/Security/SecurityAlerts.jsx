import React, { useEffect, useState } from "react";
import {format} from "date-fns"
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaFireAlt,
  FaBell,
  FaMapMarkerAlt,
  FaClock,
  FaUserShield,
  FaPhoneAlt,
  FaBuilding,
  FaSearch,
  FaFilter,
  FaVideo,
  FaDoorOpen,
  FaTimes,
} from "react-icons/fa";
import { IoIosTime, IoMdAlert } from "react-icons/io";
import { MdPriorityHigh, MdNotificationsActive, MdSecurity, MdCameraAlt } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from "react-redux";
import { getAlertStatsThunk, getTypeWiseAlertsThunk } from "../../store/thunks/alert.thunk";
import ErrorInterface from "../../chunksComponents/ErrorInterface";

function SecurityAlerts() {
  const dispatch = useDispatch();
 const {alerts,error,loading, alertStats} = useSelector((state) => state.alert);
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCameraFeed, setShowCameraFeed] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');

  // Mock security statistics
  const stats = {
    activeAlerts: 5,
    resolvedToday: 18,
    securityBreaches: 3,
    surveillanceAlerts: 7
  };


  // Handle mark as resolved
  const handleResolve = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'Resolved',
              updates: [
                ...alert.updates,
                {
                  time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                  message: 'Alert marked as resolved'
                }
              ]
            }
          : alert
      )
    );
  };

  // Handle camera feed view
  const handleViewCameraFeed = (alert) => {
    setSelectedCamera(alert.cameraId);
    setShowCameraFeed(true);
  };

  // Handle add update
  const handleAddUpdate = (alertId) => {
    if (!updateMessage.trim()) return;

    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              updates: [
                ...alert.updates,
                {
                  time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                  message: updateMessage
                }
              ]
            }
          : alert
      )
    );

    setUpdateMessage('');
    setShowUpdateModal(false);
    setSelectedAlert(null);
  };

  // Filter alerts
  const alertArray = alerts ? Object.values(alerts) : [];
  const filteredAlerts = alertArray.filter(alert => {
    const matchesSearch = Object.values(alert).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesPriority = selectedPriority === 'all' || alert.priority === selectedPriority;
    const matchesZone = selectedZone === 'all' || alert.zone === selectedZone;
    const matchesStatus = activeTab === 'all' || 
      (activeTab === 'active' && alert.status === 'Active') ||
      (activeTab === 'resolved' && alert.status === 'Resolved');
    return matchesSearch && matchesPriority && matchesZone && matchesStatus;
  });

  // Priority Badge component
  const PriorityBadge = ({ priority }) => {
    const getColor = () => {
      switch (priority) {
        case 'Critical':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'High':
          return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'Medium':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        default:
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}>
        <MdPriorityHigh className="mr-1" />
        {priority}
      </span>
    );
  };

  // Alert Type Icon component
  const AlertTypeIcon = ({ type }) => {
    const getIcon = () => {
      switch (type) {
        case 'Unauthorized Access':
          return <FaDoorOpen className="text-red-500" />;
        case 'Surveillance Alert':
          return <FaVideo className="text-blue-500" />;
        case 'Door Security':
          return <MdSecurity className="text-green-500" />;
        default:
          return <IoMdAlert className="text-yellow-500" />;
      }
  };

  return (
      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {getIcon()}
      </div>
    );
  };

  // Stat Card component
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between">
          <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  // Camera Feed Modal
  const CameraFeedModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${showCameraFeed ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowCameraFeed(false)}></div>
      <div className={`relative w-full max-w-4xl p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={() => setShowCameraFeed(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="text-xl" />
        </button>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Live Camera Feed - {selectedCamera}
        </h3>
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <MdCameraAlt className="text-4xl mb-2 mx-auto" />
            <p>Camera feed would be displayed here</p>
            <p className="text-sm text-gray-400">Camera ID: {selectedCamera}</p>
          </div>
        </div>
      </div>
              </div>
  );

  // Update Modal
  const UpdateModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${showUpdateModal ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowUpdateModal(false)}></div>
      <div className={`relative w-full max-w-lg p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={() => setShowUpdateModal(false)}
          className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 ${isDarkMode ? 'hover:text-gray-300' : ''}`}
        >
          <FaTimes className="text-xl" />
        </button>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Add Update
        </h3>
        <input
          type="text"
          value={updateMessage}
          onChange={(e) => setUpdateMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddUpdate(selectedAlert);
            }
          }}
          placeholder="Enter update message..."
          autoFocus
          dir="ltr"
          className={`w-full p-3 rounded-lg border ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4`}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowUpdateModal(false)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => handleAddUpdate(selectedAlert)}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Update
          </button>
        </div>
      </div>
                    </div>
  );

  useEffect(()=>{
    const fetchSecurityAlerts = () => {
        dispatch(getTypeWiseAlertsThunk("Security"));
        dispatch(getAlertStatsThunk());
    }
    fetchSecurityAlerts();
  },[])

  return (
    <>
    {
      loading && (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      )
    }
    {
      error && (
       <ErrorInterface error={error} onRetry={() => dispatch(getTypeWiseAlertsThunk("Security"))} />
      )
    }
    {!loading && !error &&
      (<div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Security Alerts
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor and respond to security incidents in real-time
                      </p>
                    </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Alerts"
            value={alertStats?.totalAlert}
            icon={MdNotificationsActive}
            color="bg-red-500"
          />
          <StatCard
            title="Resolved"
            value={alertStats?.resolvedAlert}
            icon={FaCheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Security Breaches"
            value={alertStats?.UnresolvedAlert}
            icon={FaUserShield}
            color="bg-orange-500"
          />
          <StatCard
            title="Security Alerts"
            value={alertStats?.securityAlert}
            icon={MdCameraAlt}
            color="bg-blue-500"
          />
        </div>

        {/* Controls Section - Enhanced Responsiveness */}
        <div className="mb-6">
          {/* <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 w-full px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              } border border-gray-300 dark:border-gray-700`}
            >
              <FaFilter />
              Filters
            </button>
          </div> */}

          {/* Filters */}
          {/* {showFilters && (
            // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            //   <select
            //     value={selectedPriority}
            //     onChange={(e) => setSelectedPriority(e.target.value)}
            //     className={`w-full px-4 py-2 rounded-lg ${
            //       isDarkMode
            //         ? 'bg-gray-800 border-gray-700 text-white'
            //         : 'bg-white border-gray-300 text-gray-900'
            //     } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            //   >
            //     <option value="all">All Priorities</option>
            //     <option value="Critical">Critical</option>
            //     <option value="High">High</option>
            //     <option value="Medium">Medium</option>
            //   </select>
            //   <select
            //     value={selectedZone}
            //     onChange={(e) => setSelectedZone(e.target.value)}
            //     className={`w-full px-4 py-2 rounded-lg ${
            //       isDarkMode
            //         ? 'bg-gray-800 border-gray-700 text-white'
            //         : 'bg-white border-gray-300 text-gray-900'
            //     } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            //   >
            //     <option value="all">All Zones</option>
            //     <option value="Main Gate">Main Gate</option>
            //     <option value="Parking Area">Parking Area</option>
            //     <option value="Office Area">Office Area</option>
            //   </select>
            // </div>
          )} */}

          {/* Responsive Tabs */}
          {/* <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg font-medium flex-1 sm:flex-none ${
                activeTab === 'active'
                  ? 'bg-red-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Active Alerts
            </button>
                          <button
              onClick={() => setActiveTab('resolved')}
              className={`px-4 py-2 rounded-lg font-medium flex-1 sm:flex-none ${
                activeTab === 'resolved'
                  ? 'bg-green-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Resolved
                          </button>
                          <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium flex-1 sm:flex-none ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Alerts
                          </button>
          </div> */}
        </div>

        {/* Responsive Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          { alerts && alerts.slice(0, 5).map((alert) => {
            return (
                <div
                  key={alert._id}
              className={`p-4 sm:p-6 rounded-lg shadow-md ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } ${
                alert.status === 'Active'
                  ? 'border-l-4 border-red-500'
                  : 'border-l-4 border-green-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <AlertTypeIcon type={alert.type} />
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {alert.type}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {alert.description}
                    </p>
                  </div>
                </div>
                <PriorityBadge priority={alert.severity} />
              </div>

              {/* Responsive Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {alert.location} - {alert.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaClock className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Time
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {format(alert.createdAt, 'hh:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaUserShield className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Assigned To
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {alert.assignedTo.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MdCameraAlt className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Camera ID
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {alert?.cameraId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Actions */}
              

              {/* Responsive Action Buttons */}
              {alert.status === 'Active' && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <FaCheckCircle className="text-xs" />
                    <span>Resolve</span>
                  </button>
                  <button
                    onClick={() => handleViewCameraFeed(alert)}
                    className="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <FaVideo className="text-xs" />
                    <span>View Feed</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAlert(alert.id);
                      setShowUpdateModal(true);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <FaBell className="text-xs" />
                    <span>Update</span>
                  </button>
                </div>
              )}
                </div>
)})}
          </div>
      </div>

      {/* Modals */}
      <CameraFeedModal />
      <UpdateModal />
    </div>)}
    </>
  );
}

export default SecurityAlerts;
