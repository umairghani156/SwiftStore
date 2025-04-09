import React, { useState, useEffect } from "react";
import { FaRegBell, FaExclamationTriangle, FaFireAlt, FaShieldAlt, FaEllipsisH } from "react-icons/fa"; 
import { AiOutlineReload } from "react-icons/ai"; 
import { Line } from "react-chartjs-2"; 
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const EmergencyAlerts = () => {
  const { isDarkMode } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAlertIcon = (type) => {
    switch (type) {
      case "panic":
        return <FaExclamationTriangle className="text-red-500" />;
      case "fire":
        return <FaFireAlt className="text-orange-500" />;
      case "security":
        return <FaShieldAlt className="text-blue-500" />;
      default:
        return <FaExclamationTriangle className="text-yellow-500" />;
    }
  };

  const [emergencyData, setEmergencyData] = useState({
    labels: ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"], 
    datasets: [
      {
        label: "Active Emergencies",
        data: [5, 3, 7, 4, 2, 5], 
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Teams Deployed",
        data: [1, 2, 3, 2, 4, 3], 
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

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

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulating API call
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
          type: "panic",
          title: "Panic Button Activated",
          location: "2nd Floor, Room 201",
          timestamp: "2024-01-20T10:30:00",
          status: "Active",
          description: "Emergency panic button activated in the conference room.",
          assignedTo: "Security Team A"
        },
        { 
          id: 2, 
          type: "fire",
          title: "Fire Alarm Triggered",
          location: "5th Floor, Kitchen Area",
          timestamp: "2024-01-20T10:25:00",
          status: "Active",
          description: "Smoke detected in the kitchen area. Fire alarm activated.",
          assignedTo: "Fire Response Team"
        },
        { 
          id: 3, 
          type: "security",
          title: "Security Breach Alert",
          location: "Parking Area B",
          timestamp: "2024-01-20T10:15:00",
          status: "Active",
          description: "Unauthorized access detected in the parking area.",
          assignedTo: "Security Team B"
        },
      ]);
    };

    fetchAlerts();
  }, []);

  const handleAlertClick = (alert) => {
    setSelectedAlert(selectedAlert?.id === alert.id ? null : alert);
  };

  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`rounded-xl shadow-lg space-y-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-4 sm:p-6`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className={`text-2xl font-semibold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
          Emergency Alerts
        </h1>

          <div className="flex items-center justify-between sm:justify-end gap-4">
          <button
            onClick={refreshData}
              disabled={isLoading}
              className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <AiOutlineReload className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>

            <div className="flex items-center gap-2">
              <FaRegBell className={`text-2xl ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`} />
              <span className={`text-lg font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {alerts.length} Active
              </span>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            Current Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{getAlertIcon(alert.type)}</div>
                      <div>
                        <h3 className={`font-medium ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {alert.title}
                        </h3>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {alert.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {getTimeDifference(alert.timestamp)}
                      </span>
                      <FaEllipsisH className={`${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </div>
                  </div>

                  {selectedAlert?.id === alert.id && (
                    <div className={`mt-4 pt-4 border-t ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}>
                      <div className="space-y-2">
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {alert.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Assigned to: {alert.assignedTo}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            alert.status === 'Active'
                              ? isDarkMode
                                ? 'bg-red-900 text-red-100'
                                : 'bg-red-100 text-red-800'
                              : isDarkMode
                                ? 'bg-green-900 text-green-100'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-4">
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            Emergency Response Stats
          </h2>
          <div className={`rounded-lg shadow-sm p-4 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="h-[300px]">
              <Line data={emergencyData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlerts;
