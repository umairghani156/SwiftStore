import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { FaPersonBooth, FaSearch } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoEnterOutline, IoExitOutline } from "react-icons/io5";
import { MdPeople } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { getAllVisitorsThunk, getHourlyVisitorFlowThunk, getVisitorCountThunk } from "../../store/thunks/visitor.thunk";
import VisitorsTable from "../../chunksComponents/VisitorsTable";
import { useTheme } from "../../context/ThemeContext";
import ErrorInterface from "../../chunksComponents/ErrorInterface";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const VisitorManagement = () => {
  const [page, setPage] = useState({
    currentPage: 1,
    totalPage: 1,
    limit: 3,
    skip: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { visitors, visitorsStatistics, hourlyVisitors, loading , error} = useSelector(state => state.visitors);

  useEffect(() => {
    dispatch(getAllVisitorsThunk(page));
    dispatch(getVisitorCountThunk());
    dispatch(getHourlyVisitorFlowThunk());
  }, [page]);

  const visitorsCards = [
    {
      id: 1,
      name: "Check-in Visitors",
      count: visitorsStatistics?.checkInVisitors || 0,
      icon: <IoEnterOutline className="text-2xl" />,
      bgColor: isDarkMode ? "bg-blue-900/50" : "bg-blue-50",
      iconBg: isDarkMode ? "bg-blue-600" : "bg-blue-500",
      textColor: isDarkMode ? "text-blue-300" : "text-blue-600",
    },
    {
      id: 2,
      name: "Check-out Visitors",
      count: visitorsStatistics?.checkOutVisitors || 0,
      icon: <IoExitOutline className="text-2xl" />,
      bgColor: isDarkMode ? "bg-green-900/50" : "bg-green-50",
      iconBg: isDarkMode ? "bg-green-600" : "bg-green-500",
      textColor: isDarkMode ? "text-green-300" : "text-green-600",
    },
    {
      id: 3,
      name: "Total Visitors",
      count: visitorsStatistics?.totalVisitors || 0,
      icon: <MdPeople className="text-2xl" />,
      bgColor: isDarkMode ? "bg-purple-900/50" : "bg-purple-50",
      iconBg: isDarkMode ? "bg-purple-600" : "bg-purple-500",
      textColor: isDarkMode ? "text-purple-300" : "text-purple-600",
    }
  ];

  const chartData = {
    labels: [
      "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM","9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", 
      "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12AM"
    ],
    datasets: [
      {
        label: "Visitors Flow",
        data: hourlyVisitors?.hourlyVisitors,
        fill: true,
        borderColor: isDarkMode ? "#60a5fa" : "#1A415A",
        backgroundColor: isDarkMode ? "rgba(96, 165, 250, 0.1)" : "rgba(26, 65, 90, 0.1)",
        pointBackgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        pointBorderColor: isDarkMode ? "#60a5fa" : "#1A415A",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12
          },
          color: isDarkMode ? '#e5e7eb' : '#1f2937'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        padding: 10,
        backgroundColor: isDarkMode ? '#1f2937' : '#fff',
        titleColor: isDarkMode ? '#e5e7eb' : '#1A415A',
        bodyColor: isDarkMode ? '#e5e7eb' : '#1A415A',
        borderColor: isDarkMode ? '#374151' : '#E2E8F0',
        borderWidth: 1,
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 12,
          weight: 'bold'
        },
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          color: isDarkMode ? '#9ca3af' : '#64748B',
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          color: isDarkMode ? '#9ca3af' : '#64748B',
          padding: 8
        },
        beginAtZero: true
      }
    }
  };

  return (
    <>
    {
      loading && (
        <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
      ) 
    }
    {
      error && (
        <ErrorInterface error={error} onRetry={() => dispatch(getVisitorAnalyticsThunk())} />
      )
    }
   { !loading && !error &&
   ( <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isDarkMode ? 'border-blue-500' : 'border-[#1A415A]'
          }`}></div>
        </div>
      ) : (
        <div className="w-full">
          <section className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
            {/* Header and Search Section */}
            <div className={`rounded-lg shadow-sm p-3 sm:p-4 mb-4 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <h1 className={`text-lg sm:text-2xl font-bold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Visitor Management
                </h1>
                <div className="w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search visitors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full sm:w-64 pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                    />
                    <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {visitorsCards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 sm:p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${card.bgColor} ${
                    isDarkMode ? 'border border-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${card.iconBg} text-white mr-4`}>
                      {card.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {card.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <BsGraphUpArrow className={card.textColor} />
                        <span className={`text-2xl font-bold ${card.textColor}`}>
                          {card.count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Section */}
            <div className={`rounded-lg shadow-sm p-4 mb-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
              <div className="h-[300px] sm:h-[400px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Visitors Table */}
            <div className={`rounded-lg shadow-sm overflow-hidden ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
              <VisitorsTable visitors={visitors} page={page} setPage={setPage} />
            </div>
          </section>

         
        </div>)}
    </div>)}
    </>
  );
};

export default VisitorManagement;