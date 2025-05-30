import React, { useEffect, useState } from 'react';
import { FaSearch, FaFilter, FaDownload, FaPrint, FaCalendarAlt, FaUserClock, FaMapMarkerAlt, FaIdCard, FaUserTie, FaPhoneAlt, FaBuilding, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { utils, writeFile } from 'xlsx-js-style';
import { getAllVisitorsThunk, getHourlyVisitorFlowThunk, getVisitorAnalyticsThunk, getVisitorCountThunk } from '../../store/thunks/visitor.thunk';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';


const VisitorLogs = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const { visitors, loading, visitorsStatistics, hourlyVisitors  } = useSelector(state => state.visitors);
  
  
   const [page, setPage] = useState({
      currentPage: 1,
      totalPage: 1,
      limit: 8,
      skip: 1,
    });
  const itemsPerPage = 8;

  const stats = {
    totalVisitors: 156,
    activeVisitors: 12,
    completedVisits: 144,
    averageVisitDuration: "2.5 hrs"
  };

  // Filter handlers
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);  // Reset to first page
  };

  const handleStatusFilter = (event) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(1);  // Reset to first page
  };

  const handleDateFilter = (event) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1);  // Reset to first page
  };

  // Safely get the visitor array
  const visitorArray = visitors?.visitors || [];

  // Implement filtering
  const filteredLogs = visitorArray.filter(log => {
    const nameMatch = log.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const cnicMatch = log.cnicNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const contactMatch = log.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSearch = searchTerm === '' || nameMatch || cnicMatch || contactMatch;

    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;

    let matchesDate = true;
    if (selectedDate) {
      try {
        const logDate = log.check_in ? format(new Date(log.check_in), 'yyyy-MM-dd') : '';
        matchesDate = logDate === selectedDate;
      } catch (error) {
        console.error("Error formatting date:", error);
        matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const pageCount = Math.ceil((filteredLogs?.length || 0) / itemsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredLogs.map(log => ({
      'Visitor Name': log.name,
      'CNIC': log.cnicNumber,
      'Purpose': log.purpose,
      'Office': log.office?.officeName,
      'Duration': log.duration ? `${log.duration} min` : 'N/A',
      'Check In': log.check_in ? format(new Date(log.check_in), 'yyyy-MM-dd HH:mm') : 'Not checked in',
      'Check Out': log.check_out ? format(new Date(log.check_out), 'yyyy-MM-dd HH:mm') : 'Not checked out',
      'Status': log.status
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = { Sheets: { 'Visitor Logs': ws }, SheetNames: ['Visitor Logs'] };
    writeFile(wb, 'visitor_logs.xlsx');
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'Rejected':
          return 'bg-red-300 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'Approved':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        default:
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status}
      </span>
    );
  };

  const nextPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage + 1 });
};

const prevPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage - 1 });
};

  useEffect(() => {
    dispatch(getAllVisitorsThunk(page));
  }, [page, dispatch]);

  useEffect(() => {
    function getVisitorsData() {
      dispatch(getVisitorAnalyticsThunk());
      dispatch(getVisitorCountThunk());
      dispatch(getHourlyVisitorFlowThunk());
    }
    getVisitorsData();
  }, [])

  useEffect(() => {
    if (visitors?.visitors?.length > 0) {
      console.log("Sample visitor data:", visitors.visitors[0]);
      const statusValues = [...new Set(visitors.visitors.map(v => v.status))];
      console.log("Available status values:", statusValues);
    }
  }, [visitors]);

  const formatDate = (dateString, formatString) => {
    if (!dateString) return 'Not available';
    try {
      return format(new Date(dateString), formatString);
    } catch (error) {
      console.error(`Error formatting date ${dateString}:`, error);
      return 'Invalid date';
    }
  };

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

  return (
    <>
   {
    loading ? (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    ):
     (<div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Visitor Logs
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track and manage visitor entries and exits
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Today Visitors"
            value={visitorsStatistics?.todayVisitors || 0}
            icon={FaUserClock}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Visitors"
            value={visitorsStatistics?.totalVisitors}
            icon={FaUserTie}
            color="bg-green-500"
          />
          <StatCard
            title="Checked Visits"
            value={visitorsStatistics?.checkInVisitors}
            icon={FaIdCard}
            color="bg-purple-500"
          />
          <StatCard
            title="Avg. Visit Duration"
            value={visitorsStatistics?.totalVisitDuration && visitorsStatistics?.totalVisitors > 0 
              ? (visitorsStatistics.totalVisitDuration / visitorsStatistics.totalVisitors).toFixed(2) 
              : '0.00'}
            icon={FaCalendarAlt}
            color="bg-orange-500"
          />
        </div>

        {/* Controls Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                placeholder="Search by name, CNIC or contact number..."
                value={searchTerm}
                onChange={handleSearch}
                className={`pl-10 w-full px-4 py-2 rounded-lg ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700'
                } border border-gray-300 dark:border-gray-700`}
            >
              <FaFilter />
              Filters
            </button>
            <button
              onClick={exportToExcel}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700'
                } border border-gray-300 dark:border-gray-700`}
            >
              <FaDownload />
              Export
            </button>
            <button
              onClick={() => window.print()}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700'
                } border border-gray-300 dark:border-gray-700`}
            >
              <FaPrint />
              Print
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserClock className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <select
                  value={selectedStatus}
                  onChange={handleStatusFilter}
                  className={`pl-10 w-full px-4 py-2 rounded-lg ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="all">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateFilter}
                  className={`pl-10 w-full px-4 py-2 rounded-lg ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Visitor Logs Table/Cards */}
        <div className={`rounded-lg shadow-md py-4 overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="lg:block">
            <table className="w-full">
              <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Name</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Contact</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Purpose</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Check-in</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Check-out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentLogs.map((log, index) => (
                  <tr key={index} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <td className={`p-4 text-sm font-mediumtext-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{log.name}</td>
                    <td className={`p-4 text-sm font-mediumtext-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{log.contact}</td>
                    <td className={`p-4 text-sm font-mediumtext-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{log.purpose}</td>
                    <td className="p-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className={`p-4 text-sm font-mediumtext-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(log.check_in, 'yyyy-MM-dd HH:mm')}</td>
                    <td className={`p-4 text-sm font-mediumtext-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(log.check_out, 'yyyy-MM-dd HH:mm')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            {/* Mobile Pagination */}
                      <div className="mt-4 sm:hidden px-2">
                          <nav className="flex items-center justify-between w-full">
                              <button
                                  onClick={prevPageHandle}
                                  disabled={page.currentPage === 1}
                                  className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed border ${isDarkMode
                                      ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700'
                                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                                      }`}
                              >
                                  <FaChevronLeft className="h-3.5 w-3.5 mr-1" />
                                  Prev
                              </button>
                              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {page.currentPage} / {visitors?.pagination?.totalPages || 1}
                              </span>
                              <button
                                  onClick={nextPageHandle}
                                  disabled={page.currentPage === (visitors?.pagination?.totalPages || 1)}
                                  className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed border ${isDarkMode
                                      ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700'
                                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                                      }`}
                              >
                                  Next
                                  <FaChevronRight className="h-3.5 w-3.5 ml-1" />
                              </button>
                          </nav>
                      </div>
          
                      {/* Desktop Pagination */}
                      <div className="hidden sm:flex sm:items-center sm:justify-between mt-4 px-3">
                          <div className="flex-1 flex items-center justify-between">
                              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Page <span className="font-medium">{page.currentPage}</span> of{' '}
                                  <span className="font-medium">{visitors?.pagination?.totalPages || 1}</span>
                              </div>
                              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                  <button
                                      onClick={prevPageHandle}
                                      disabled={page.currentPage === 1}
                                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${isDarkMode
                                          ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                          }`}
                                  >
                                      <span className="sr-only">Previous</span>
                                      <FaChevronLeft className="h-5 w-5" />
                                  </button>
                                  {[...Array(visitors?.pagination?.totalPages || 1)].map((_, index) => (
                                      <button
                                          key={index}
                                          onClick={() => setPage({ ...page, currentPage: index + 1 })}
                                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page.currentPage === index + 1
                                              ? isDarkMode
                                                  ? 'z-10 bg-blue-900/50 border-blue-500 text-blue-300'
                                                  : 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                              : isDarkMode
                                                  ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                              }`}
                                      >
                                          {index + 1}
                                      </button>
                                  ))}
                                  <button
                                      onClick={nextPageHandle}
                                      disabled={page.currentPage === (visitors?.pagination?.totalPages || 1)}
                                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${isDarkMode
                                          ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                          }`}
                                  >
                                      <span className="sr-only">Next</span>
                                      <FaChevronRight className="h-5 w-5" />
                                  </button>
                              </nav>
                          </div>
                      </div>
        </div>
      </div>
    </div>)}
    </>
  );
};

export default VisitorLogs;
