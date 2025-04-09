import React, { useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { motion } from "framer-motion";
import { FaUsers, FaChartLine, FaExclamationCircle, FaClock, FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const statsData = {
  visitors: {
    totalVisitors: 1025,
    visitorFlow: {
      '6h': [120, 150, 100, 80, 60, 130],
      '24h': [45, 60, 75, 80, 90, 120, 150, 100, 80, 60, 130, 145, 
              160, 140, 120, 90, 70, 85, 95, 110, 130, 140, 120, 100],
      '7d': [750, 820, 930, 880, 960, 850, 900]
    },
    approvalRate: 85,
    visitorTypes: {
      clients: 600,
      contractors: 200,
      employees: 225,
    },
  },
  issues: {
    totalReports: 30,
    issueCategories: {
      electrical: 10,
      plumbing: 5,
      maintenance: 8,
      security: 7,
    },
    issueStatuses: {
      pending: 8,
      inProgress: 12,
      resolved: 10,
    },
    averageResponseTime: 3,
  },
  occupancy: {
    totalOccupiedSpace: 70,
    heatmap: [
      [0, 1, 0, 2],
      [1, 2, 3, 0],
      [0, 1, 0, 1],
    ],
  },
};

const StatisticsPage = () => {
  const { isDarkMode } = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState("6h");

  const getTimeLabels = (range) => {
    switch (range) {
      case '24h':
        return Array.from({ length: 24 }, (_, i) => `${i}:00`);
      case '7d':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date().getDay();
        return Array.from({ length: 7 }, (_, i) => {
          const dayIndex = (today - 6 + i + 7) % 7;
          return days[dayIndex];
        });
      default: // 6h
        const currentHour = new Date().getHours();
        return Array.from({ length: 6 }, (_, i) => {
          const hour = (currentHour - 5 + i + 24) % 24;
          return `${hour}:00`;
        });
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#fff' : '#333',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
          callback: (value) => `${value} visitors`,
        },
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 750,
    },
  };

  const visitorFlowData = {
    labels: getTimeLabels(selectedTimeRange),
    datasets: [
      {
        label: "Visitor Flow",
        data: statsData.visitors.visitorFlow[selectedTimeRange],
        borderColor: "#4F46E5",
        backgroundColor: isDarkMode ? "rgba(79, 70, 229, 0.2)" : "rgba(79, 70, 229, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#4F46E5",
        pointHoverBackgroundColor: "#4F46E5",
        pointBorderColor: isDarkMode ? "#1F2937" : "#fff",
        pointHoverBorderColor: isDarkMode ? "#1F2937" : "#fff",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const visitorTypesData = {
    labels: ["Clients", "Contractors", "Employees"],
    datasets: [
      {
        data: [
          statsData.visitors.visitorTypes.clients,
          statsData.visitors.visitorTypes.contractors,
          statsData.visitors.visitorTypes.employees,
        ],
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B"],
        borderColor: isDarkMode ? "#1F2937" : "#fff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const issueCategoriesData = {
    labels: Object.keys(statsData.issues.issueCategories).map(
      (cat) => cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        label: "Issues by Category",
        data: Object.values(statsData.issues.issueCategories),
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
        borderColor: isDarkMode ? "#1F2937" : "#fff",
        borderWidth: 2,
      },
    ],
  };

  const StatCard = ({ title, value, icon, trend, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <h3 className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Visitors"
            value={statsData.visitors.totalVisitors}
            icon={<FaUsers className="w-6 h-6 text-indigo-500" />}
            trend={12}
            color="bg-indigo-100 dark:bg-indigo-900"
          />
          <StatCard
            title="Approval Rate"
            value={`${statsData.visitors.approvalRate}%`}
            icon={<FaCheckCircle className="w-6 h-6 text-green-500" />}
            trend={5}
            color="bg-green-100 dark:bg-green-900"
          />
          <StatCard
            title="Total Reports"
            value={statsData.issues.totalReports}
            icon={<FaExclamationCircle className="w-6 h-6 text-yellow-500" />}
            trend={-8}
            color="bg-yellow-100 dark:bg-yellow-900"
          />
          <StatCard
            title="Avg Response Time"
            value={`${statsData.issues.averageResponseTime}h`}
            icon={<FaClock className="w-6 h-6 text-red-500" />}
            trend={-15}
            color="bg-red-100 dark:bg-red-900"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            key={selectedTimeRange}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-xl shadow-lg`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Visitor Flow</h2>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className={`px-3 py-2 rounded-md border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                } transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>
            <div className="h-[300px]">
              <Line data={visitorFlowData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-xl shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-6">Visitor Types</h2>
            <div className="h-[300px]">
              <Pie data={visitorTypesData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Issues Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } p-6 rounded-xl shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-6">Issue Categories</h2>
          <div className="h-[300px]">
            <Bar data={issueCategoriesData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatisticsPage;
