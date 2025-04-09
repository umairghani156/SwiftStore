import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorAnalyticsThunk } from "../../store/thunks/visitor.thunk";
import { FaCalendar, FaChartLine, FaChartPie, FaChartBar, FaDownload, FaSync } from "react-icons/fa";
import moment from "moment";

const Analytics = () => {
  const dispatch = useDispatch();
  const { visitorsAnalytics, loading } = useSelector((state) => state.visitors);
  const [timeRange, setTimeRange] = useState("week"); // day, week, month, year
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dailyData = {
    _id: "2025-02-22",
    count: 3,
  };

  const weeklyData = {
    year: 2025,
    week: 8,
    totalVisits: 5,
  };

  const monthlyData = {
    year: 2025,
    month: 2,
    totalVisits: 5,
  };

  const statusData = [
    { _id: "Rejected", count: 1 },
    { _id: "Pending", count: 3 },
    { _id: "Approved", count: 1 },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1a202c",
        bodyColor: "#4a5568",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 13,
        },
        titleFont: {
          size: 14,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const dailyChartData = {
    labels: [dailyData._id],
    datasets: [
      {
        label: "Daily Visits",
        data: [dailyData.count],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true,
      },
    ],
  };

  const weeklyChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Visits",
        data: [5, 10, 8, 12],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const monthlyChartData = {
    labels: ["January", "February", "March"],
    datasets: [
      {
        label: "Monthly Visits",
        data: [25, 5, 0],
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const statusChartData = {
    labels: statusData.map((item) => item._id),
    datasets: [
      {
        data: statusData.map((item) => item.count),
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(16, 185, 129, 0.7)",
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(245, 158, 11)",
          "rgb(16, 185, 129)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getVisitorAnalyticsThunk());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    // Implementation for exporting analytics data
    console.log("Exporting analytics data...");
  };

  useEffect(() => {
    dispatch(getVisitorAnalyticsThunk());
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Real-time visitor analytics and insights
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSync className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaDownload className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Visits"
            value={visitorsAnalytics?.totalVisits || "0"}
            icon={FaChartLine}
            color="bg-blue-500"
          />
          <StatCard
            title="Today's Visits"
            value={dailyData.count}
            icon={FaCalendar}
            color="bg-green-500"
          />
          <StatCard
            title="Weekly Visits"
            value={weeklyData.totalVisits}
            icon={FaChartBar}
            color="bg-purple-500"
          />
          <StatCard
            title="Monthly Visits"
            value={monthlyData.totalVisits}
            icon={FaChartPie}
            color="bg-indigo-500"
          />
        </div>

        {/* Time Range Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {["day", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  timeRange === range
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Visitor Trends
            </h2>
            <div className="h-80">
              <Line data={dailyChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Weekly Overview
            </h2>
            <div className="h-80">
              <Bar data={weeklyChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Statistics
            </h2>
            <div className="h-80">
              <Bar data={monthlyChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Visitor Status Distribution
            </h2>
            <div className="h-80">
              <Pie data={statusChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
