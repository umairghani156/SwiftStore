import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import {
  FaUsers,
  FaChartBar,
  FaExclamationTriangle,
  FaUserCheck,
  FaDownload,
  FaCalendarAlt,
  FaChartPie,
  FaChartLine,
  FaBuilding,
  FaFilter,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getOfficeOccupancyThunk } from "../../store/thunks/office.thunk";
import { getHourlyVisitorFlowThunk, getVisitorCountThunk } from "../../store/thunks/visitor.thunk";
import { getIssueStatusCountThunk } from "../../store/thunks/issue.thunk";
import ErrorInterface from "../../chunksComponents/ErrorInterface";
import DashboardHeatmap from "../../components/Admin/DashboardHeatmap";

const OfficeReportsPage = () => {
  const dispatch = useDispatch();
  const { visitorsStatistics, hourlyVisitors, error, loading } = useSelector((state) => state.visitors);
  const { officeOccupancy } = useSelector((state) => state.office);
  const { issueStatusCount } = useSelector((state) => state.issue);
  const { isDarkMode } = useTheme();
  const [visitorData, setVisitorData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [issueData, setIssueData] = useState({});
  const [employeeData, setEmployeeData] = useState([]);
  const [dateRange, setDateRange] = useState("month");
  const [showFilters, setShowFilters] = useState(false);

  // Simulated data fetch function
  useEffect(() => {
    fetchVisitorData();
    fetchOccupancyData();
    fetchIssueData();
    fetchEmployeeData();
  }, [dateRange]);

  // Example data fetching functions
  const fetchVisitorData = () => {
    const data = hourlyVisitors?.hourlyVisitors?.map((data) => {
      console.log("Data", data)
    })
    const allVisitorData = [
      { time: "9 AM to 10 AM", flow: 50, date: "2025-03-01" },
      { time: "10 AM to 11 AM", flow: 120, date: "2025-03-01" },
      { time: "11 AM to 12 PM", flow: 100, date: "2025-03-01" },
      { time: "12 PM to 1 PM", flow: 80, date: "2025-03-01" },
      { time: "1 PM to 2 PM", flow: 140, date: "2025-03-01" },
      { time: "2 PM to 3 PM", flow: 60, date: "2025-03-01" },
    ];

    const filteredData = filterDataByDateRange(allVisitorData);
    setVisitorData(filteredData);
  };

  const fetchOccupancyData = () => {
    const allOccupancyData = [
      { zone: "A1", occupancy: 75, date: "2025-03-01" },
      { zone: "A2", occupancy: 60, date: "2025-03-01" },
      { zone: "B1", occupancy: 50, date: "2025-03-01" },
      { zone: "B2", occupancy: 80, date: "2025-03-01" },
    ];

    const filteredData = filterDataByDateRange(hourlyVisitors?.visitorsByOffice);
    setOccupancyData(filteredData);
  };

  const fetchIssueData = () => {
    const allIssueData = {
      categories: {
        maintenance: 5,
        plumbing: 3,
        electrical: 2,
        security: 1,
      },
      statuses: {
        open: 4,
        inProgress: 3,
        resolved: 5,
      },
      date: "2025-03-01",
    };

    const filteredData = filterDataByDateRange([allIssueData]);

  };

  const fetchEmployeeData = () => {
    const allEmployeeData = [
      {
        name: "Employee 1",
        attendance: 80,
        productivity: 5,
        date: "2025-03-01",
      },
      {
        name: "Employee 2",
        attendance: 90,
        productivity: 8,
        date: "2025-03-01",
      },
      {
        name: "Employee 3",
        attendance: 70,
        productivity: 4,
        date: "2025-03-01",
      },
      {
        name: "Employee 4",
        attendance: 95,
        productivity: 7,
        date: "2025-03-01",
      },
    ];

    const filteredData = filterDataByDateRange(allEmployeeData);
    setEmployeeData(filteredData);
  };

  const filterDataByDateRange = (data) => {
    const currentDate = new Date();
    let startDate;

    switch (dateRange) {
      case "day":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
        break;
      case "week":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        break;
      case "month":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      case "custom":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      default:
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    }

    // return data.filter((item) => new Date(item.date) >= startDate);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  // Prepare data for download (convert to CSV)
  const generateReportData = () => {
    const reportData = [




      ["Issue Data"],
      ["Category", "Count"],
      ...Object.entries(issueData.categories || {}).map(([category, count]) => [
        category,
        count,
      ]),

      ["Issue Statuses"],
      ["Status", "Count"],
      ...Object.entries(issueData.statuses || {}).map(([status, count]) => [
        status,
        count,
      ]),


    ];

    return reportData;
  };

  // Helper function to get trend icon and color
  const getTrendIndicator = (value, threshold = 70) => {
    if (value >= threshold) {
      return {
        icon: <FaArrowUp className="ml-1" />,
        color: "text-green-500"
      };
    } else {
      return {
        icon: <FaArrowDown className="ml-1" />,
        color: "text-red-500"
      };
    }
  };

  // Stat card component
  const StatCard = ({ icon, title, value, color, trend }) => {
    const trendIndicator = trend ? getTrendIndicator(trend) : null;

    return (
      <didiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
      >
        <div className={`h-2 ${color}`}></div>
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
              {icon}
            </div>
            {trend && (
              <span className={`flex items-center text-sm font-medium ${trendIndicator.color}`}>
                {trend}% {trendIndicator.icon}
              </span>
            )}
          </div>
          <h3 className={`mt-4 text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {value}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
        </div>
      </didiv>
    );
  };

  // Table component
  const DataTable = ({ title, headers, data, renderRow }) => {
    return (
      <div className="mt-6">
        <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
          {title}
        </h4>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
            <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>

            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Section component
  const ReportSection = ({ title, icon, children }) => {
    return (
      <div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'
          } p-6`}
      >
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
            } mr-3`}>
            {icon}
          </div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
            {title}
          </h3>
        </div>
        {children}
      </div>
    );
  };


  // Fetch Data 
  useEffect(() => {
    const getOfficeReports = () => {
      dispatch(getOfficeOccupancyThunk());
      dispatch(getVisitorCountThunk());
      dispatch(getIssueStatusCountThunk());
      dispatch(getHourlyVisitorFlowThunk());

    }
    getOfficeReports();
  }, [])

  // useEffect(()=>{
  //   dispatch(getHourlyVisitorFlowThunk());
  // },[])

  return (
    <>
      {
        loading && (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900"></div>
          </div>
        )
      }
      {
        error && (
          <ErrorInterface error={error} onRetry={() => dispatch(getVisitorCountThunk())} />
        )
      }
      {
        (<div className={`p-4 sm:p-6 min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
          }`}>
          <div className="max-w-7xl mx-auto">
            {/* Header with filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                <FaChartLine className="mr-2 text-blue-500" />
                Office Reports
              </h1>

              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-white hover:bg-gray-100'
                    } transition-colors shadow-md`}
                >
                  <FaFilter className="mr-2" />
                  <span>Filters</span>
                </button>


              </div>
            </div>

            {/* Filters */}
            <div>
              {showFilters && (
                <div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6"
                >
                  <div className={`p-4 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <div className="flex items-center mb-3">
                      <FaCalendarAlt className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'
                        }`} />
                      <h3 className="font-medium">Date Range Filter</h3>
                    </div>

                    <select
                      value={dateRange}
                      onChange={handleDateRangeChange}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-gray-100'
                          : 'bg-white border-gray-300 text-gray-800'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="day">Last 24 Hours</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={<FaUsers className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
                title="Total Visitors"
                value={visitorsStatistics?.totalVisitors}
                color={isDarkMode ? 'bg-blue-800' : 'bg-blue-500'}
                trend={12}
              />
              <StatCard
                icon={<FaChartBar className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />}
                title="Occupancy Rate"
                value={officeOccupancy?.occcupancyRate + "%"}
                color={isDarkMode ? 'bg-purple-800' : 'bg-purple-500'}
                trend={5}
              />
              <StatCard
                icon={<FaExclamationTriangle className={`h-5 w-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />}
                title="Total Issues"
                value="30"
                color={isDarkMode ? 'bg-amber-800' : 'bg-amber-500'}
                trend={-8}
              />
              <StatCard
                icon={<FaUserCheck className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />}
                title="Employee Attendance"
                value="90%"
                color={isDarkMode ? 'bg-green-800' : 'bg-green-500'}
                trend={3}
              />
            </div>

            {/* Visitor Reports Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

              <ReportSection title="Occupancy Reports" icon={<FaBuilding className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />}>
                <div className="space-y-4">

                  {hourlyVisitors?.visitorByOfficeDataArray.map((data, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        } ${isDarkMode ? 'text-gray-300' : 'text-gray-800'
                        } shadow-sm transition-colors`}
                    >
                      {/* Zone */}
                      <div className="flex-1">
                        <span className="font-semibold">{data.officeName}</span>
                      </div>

                      {/* Occupancy */}
                      <div className="flex items-center space-x-2">
                        <span>{data.count}%</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className={`${data.count > 70
                                ? 'bg-green-600'
                                : data.count > 50
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              } h-2.5 rounded-full`}
                            style={{ width: `${data.count}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </ReportSection>
            </div>

            {/* Issue Reports Section */}

            {/* Employee Reports Section */}
            <div className="mt-6">

            </div>
          </div>
        </div>)
      }
    </>
  );
};

export default OfficeReportsPage;
