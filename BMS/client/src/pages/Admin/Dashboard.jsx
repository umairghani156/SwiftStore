import React, { useEffect } from "react";
import { FaPersonBooth, FaBuilding } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdOutlineErrorOutline, MdEmergencyShare } from "react-icons/md";
import { Line, Bar, Pie } from "react-chartjs-2";
import DashboardHeatmap from "../../components/Admin/DashboardHeatmap";
import { useTheme } from "../../context/ThemeContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getHourlyVisitorFlowThunk, getVisitorAnalyticsThunk, getVisitorCountThunk } from "../../store/thunks/visitor.thunk";
import { getAllIssues, getIssueStatusCountThunk } from "../../store/thunks/issue.thunk";
import { getOfficeOccupancyThunk } from "../../store/thunks/office.thunk";
import { getAlertStatsThunk } from "../../store/thunks/alert.thunk";
import ErrorInterface from "../../chunksComponents/ErrorInterface";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { issueStatusCount } = useSelector(state => state.issue);
  const { officeOccupancy } = useSelector(state => state.office);
  const { issues } = useSelector((state) => state.issue);
  const { visitorsStatistics, hourlyVisitors,loading, error } = useSelector((state) => state.visitors);
  const visitorTrendsData = [120, 200, 150, 300, 250, 400, 342];
  const [page, setPage] = React.useState({
    currentPage: 1,
    totalPage: 1,
    limit: 4,
    skip: 1,
  });

  // const issues = [
  //   { id: 1, description: "Elevator out of service", status: "Ongoing" },
  //   { id: 2, description: "Wi-Fi connectivity issue", status: "Pending" },
  //   { id: 3, description: "Broken window in lobby", status: "Resolved" },
  // ];

  const visitorTrendsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }
      },
      title: {
        display: true,
        text: "Visitor Trends (Last 7 Days)",
        font: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: '600'
        },
        color: isDarkMode ? '#e5e7eb' : '#374151'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151'
        }
      }
    }
  };

  const visitorTrendsChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Visitors",
        data: hourlyVisitors?.weeklyVisitors,
        borderColor: "#66c0f8",
        backgroundColor: "rgba(102, 192, 248, 0.2)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const buildingOccupancyData = {
    labels: ["Occupied", "Available"],
    datasets: [
      {
        data: [officeOccupancy?.occupied, officeOccupancy?.available],
        backgroundColor: ["#66c0f8", "#e0e0e0"],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  useEffect(() => {
    function fetchData() {
    dispatch(getVisitorAnalyticsThunk());
    dispatch(getVisitorCountThunk());
      dispatch(getAllIssues(page));

    };

    fetchData();

  }, [page]);

  useEffect(() => {
    function fetchData2() {
    dispatch(getIssueStatusCountThunk())
      dispatch(getOfficeOccupancyThunk());
      dispatch(getHourlyVisitorFlowThunk());
     
    }

    fetchData2();
  }, []);

  return (
    <>
    {
      loading ? (
        <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
      ) : error ? (
       <ErrorInterface error={error} onRetry={() => dispatch(getVisitorAnalyticsThunk())} />
      ) : null
    }
    {(<div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Visitors Today */}
          <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${isDarkMode
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-white border-gray-100 text-gray-900'
            }`}>
            <h2 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Total Visitors Today
            </h2>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                } mr-4`}>
                <FaPersonBooth className={`text-2xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <BsGraphUpArrow className="text-green-500" />
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                    {visitorsStatistics?.todaysVisitors || 0}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>+12% from yesterday</p>
              </div>
            </div>
          </div>

          {/* Pending Issues */}
          <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${isDarkMode
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-white border-gray-100 text-gray-900'
            }`}>
            <h2 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Pending Issues
            </h2>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-orange-900' : 'bg-orange-100'
                } mr-4`}>
                <MdOutlineErrorOutline className={`text-2xl ${isDarkMode ? 'text-orange-400' : 'text-orange-600'
                  }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <BsGraphUpArrow className="text-green-500" />
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                    {issueStatusCount?.pending || 0}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>4 new since last hour</p>
              </div>
            </div>
          </div>

          {/* Visitors in Building */}
          <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${isDarkMode
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-white border-gray-100 text-gray-900'
            }`}>
            <h2 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Visitors in Building
            </h2>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'
                } mr-4`}>
                <FaBuilding className={`text-2xl ${isDarkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <BsGraphUpArrow className="text-green-500" />
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>
                {visitorsStatistics?.checkInVisitors || 0}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Current occupancy</p>
              </div>
            </div>
          </div>

          {/* Emergency Alerts */}
          <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${isDarkMode
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-white border-gray-100 text-gray-900'
            }`}>
            <h2 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Emergency Alerts
            </h2>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-900' : 'bg-red-100'
                } mr-4`}>
                <MdEmergencyShare className={`text-2xl ${isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <BsGraphUpArrow className="text-green-500" />
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
                    }`}>0</span>
                </div>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>No active alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visitor Trends Chart */}
          <div className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
            }`}>
            <h3 className={`text-base font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
              }`}>
              Visitor Trends
            </h3>
            <div className="h-[300px]">
              <Line
                data={visitorTrendsChartData}
                options={visitorTrendsOptions}
              />
            </div>
          </div>

          {/* Building Occupancy Chart */}
          <div className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
            }`}>
            <h3 className={`text-base font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
              }`}>
              Building Occupancy
            </h3>
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-[80%] max-w-[300px]">
              <Pie data={buildingOccupancyData} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Heatmap */}
          <div className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
            }`}>
            <h3 className={`text-base font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
              }`}>
              Visitor Heatmap
            </h3>
            <div className={`h-[400px] rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <DashboardHeatmap />
            </div>
          </div>

          {/* Live Issues Feed */}
          <div className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${isDarkMode
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
              : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}>
            <h3 className={`text-base font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'
              }`}>
              Live Issues Feed
            </h3>
            <div className="space-y-4">
              {issues && issues?.issues?.slice(0, 5).map((issue) => (
                <div
                  key={issue._id}
                  className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors duration-200 ${isDarkMode
                      ? 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${issue.status === "In Progress"
                        ? isDarkMode ? "bg-yellow-500" : "bg-yellow-400"
                        : issue.status === "Pending"
                          ? isDarkMode ? "bg-red-500" : "bg-red-400"
                          : isDarkMode ? "bg-green-500" : "bg-green-400"
                      }`} />
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>{issue.title}</p>
                  </div>

                  <span className="text-gray-700 text-sm truncate">{issue.description}</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${issue.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : issue.status === "Pending"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                      } ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>)}
    </>
  );
};

export default Dashboard;
