import React, { useState, useEffect } from "react";
import { 
  FaRegBell, 
  FaExclamationTriangle, 
  FaFireExtinguisher, 
  FaShieldAlt, 
  FaClock, 
  FaMapMarkerAlt,
  FaUserShield,
  FaPhoneAlt,
  FaArrowRight
} from "react-icons/fa"; 
import { AiOutlineReload } from "react-icons/ai"; 
import { Line } from "react-chartjs-2"; 
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from '../../context/ThemeContext';

const EmergencyAlerts = () => {
  const { isDarkMode } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyData, setEmergencyData] = useState({
    labels: ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"], 
    datasets: [
      {
        label: "Active Emergencies",
        data: [5, 3, 7, 4, 2, 5], 
        borderColor: isDarkMode ? "rgba(239, 68, 68, 0.8)" : "rgba(239, 68, 68, 1)",
        backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Teams Deployed",
        data: [1, 2, 3, 2, 4, 3], 
        borderColor: isDarkMode ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 1)",
        backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  const getAlertIcon = (alertType) => {
    if (alertType.toLowerCase().includes('fire')) 
      return <FaFireExtinguisher className={`text-2xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />;
    if (alertType.toLowerCase().includes('security')) 
      return <FaShieldAlt className={`text-2xl ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />;
    return <FaExclamationTriangle className={`text-2xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />;
  };

  const getAlertClass = (alertType, isSelected) => {
    const baseClasses = `p-4 rounded-lg transition-all duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 hover:bg-gray-700' 
        : 'bg-white hover:bg-gray-50'
    } ${isSelected ? 'ring-2 ring-blue-500' : ''}`;

    if (alertType.toLowerCase().includes('fire')) 
      return `${baseClasses} ${isDarkMode ? 'border-l-4 border-red-500' : 'border-l-4 border-red-500'}`;
    if (alertType.toLowerCase().includes('security')) 
      return `${baseClasses} ${isDarkMode ? 'border-l-4 border-blue-500' : 'border-l-4 border-blue-500'}`;
    return `${baseClasses} ${isDarkMode ? 'border-l-4 border-yellow-500' : 'border-l-4 border-yellow-500'}`;
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    setEmergencyData({
      ...emergencyData,
      datasets: [
        {
          ...emergencyData.datasets[0],
          data: [5, 2, 6, 4, 3, 6],
        },
        {
          ...emergencyData.datasets[1],
          data: [2, 3, 4, 3, 5, 2], 
        },
      ],
    });
      toast.success("Emergency data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      setAlerts([
        { 
          id: 1, 
          alert: "Panic Button Activated on 2nd Floor",
          location: "Building A, 2nd Floor",
          time: "5 min ago",
          status: "Active",
          priority: "High",
          details: "Emergency assistance requested near conference room 2B",
          responder: "Security Team Alpha",
          contact: "+1 (555) 123-4567",
          actions: ["Evacuation initiated", "Security team dispatched", "Medical team on standby"]
        },
        { 
          id: 2, 
          alert: "Fire Alarm on 5th Floor",
          location: "Building B, 5th Floor",
          time: "10 min ago",
          status: "Active",
          priority: "Critical",
          details: "Smoke detected in eastern wing, evacuation in progress",
          responder: "Fire Response Unit",
          contact: "+1 (555) 987-6543",
          actions: ["Fire alarm activated", "Sprinklers engaged", "Fire team en route"]
        },
        { 
          id: 3, 
          alert: "Security Alert in the Parking Area",
          location: "Underground Parking Level 2",
          time: "15 min ago",
          status: "Active",
          priority: "Medium",
          details: "Suspicious activity reported near exit gate",
          responder: "Security Team Bravo",
          contact: "+1 (555) 456-7890",
          actions: ["Surveillance activated", "Guards dispatched", "Access restricted"]
        },
      ]);
    };

    fetchAlerts();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#9CA3AF' : '#4B5563',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.5)',
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#4B5563',
        }
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.5)',
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#4B5563',
        }
      }
    }
  };

  return (
    <div className={`min-h-screen w-full p-2 sm:p-4 md:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className={`rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative">
                <FaRegBell className={`text-2xl sm:text-3xl ${
                  isDarkMode ? 'text-red-400' : 'text-red-500'
                } animate-pulse`} />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                  {alerts.length}
                </span>
              </div>
              <div className="ml-3 sm:ml-4">
                <h1 className={`text-xl sm:text-2xl font-bold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>Emergency Alerts</h1>
                <p className={`text-sm sm:text-base ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Real-time emergency monitoring</p>
              </div>
            </div>
          <button
            onClick={refreshData}
              disabled={isLoading}
              className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base`}
            >
              <AiOutlineReload className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Alerts Section */}
          <div className={`rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              <FaExclamationTriangle className={`mr-2 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              Active Alerts
            </h2>
            <div className={`space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] 
              ${isDarkMode 
                ? 'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800' 
                : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
              }
              scrollbar-thumb-rounded-full scrollbar-track-rounded-full
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-thumb]:bg-gray-500
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-700
              dark:[&::-webkit-scrollbar-track]:bg-gray-800/50
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
              dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600
              [&::-webkit-scrollbar-thumb]:transition-colors
              [&::-webkit-scrollbar-thumb]:duration-200
              [&::-webkit-scrollbar]:hidden
              sm:[&::-webkit-scrollbar]:block
            `}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                  className={`${getAlertClass(alert.alert, selectedAlert?.id === alert.id)} cursor-pointer`}
                  onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getAlertIcon(alert.alert)}
                      </div>
                      <div>
                        <h3 className={`font-medium text-sm sm:text-base ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>{alert.alert}</h3>
                        <div className={`flex items-center text-xs sm:text-sm mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{alert.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        alert.priority === 'Critical'
                          ? isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
                          : alert.priority === 'High'
                          ? isDarkMode ? 'bg-orange-900 text-orange-100' : 'bg-orange-100 text-orange-800'
                          : isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.priority}
                      </span>
                      <div className={`flex items-center text-xs sm:text-sm whitespace-nowrap ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <FaClock className="mr-1" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                  
                  {selectedAlert?.id === alert.id && (
                    <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } animate-fadeIn`}>
                      <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {alert.details}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className={`flex items-center ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <FaUserShield className="mr-2" />
                          <span className="text-xs sm:text-sm">{alert.responder}</span>
                        </div>
                        <div className={`flex items-center ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <FaPhoneAlt className="mr-2" />
                          <span className="text-xs sm:text-sm">{alert.contact}</span>
                        </div>
                      </div>
                      <div className={`space-y-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <h4 className="font-medium text-xs sm:text-sm">Actions Taken:</h4>
                        {alert.actions.map((action, index) => (
                          <div key={index} className="flex items-center text-xs sm:text-sm">
                            <FaArrowRight className="mr-2 text-xs flex-shrink-0" />
                            <span className="break-words">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

          {/* Stats Section */}
          <div className={`rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              Response Statistics
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              <Line data={emergencyData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    labels: {
                      ...chartOptions.plugins.legend.labels,
                      boxWidth: window.innerWidth < 640 ? 8 : 12,
                      padding: window.innerWidth < 640 ? 8 : 16,
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12
                      }
                    }
                  }
                },
                scales: {
                  ...chartOptions.scales,
                  x: {
                    ...chartOptions.scales.x,
                    ticks: {
                      ...chartOptions.scales.x.ticks,
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12
                      }
                    }
                  },
                  y: {
                    ...chartOptions.scales.y,
                    ticks: {
                      ...chartOptions.scales.y.ticks,
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#1F2937' : '#FFFFFF',
            color: isDarkMode ? '#F3F4F6' : '#1F2937',
          },
          className: 'text-sm sm:text-base'
        }}
      />
    </div>
  );
};

export default EmergencyAlerts;
