import React, { useState, useEffect } from "react";
import { FaChartBar, FaDownload, FaFilter, FaPrint, FaSearch, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaUserShield } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { utils, writeFile } from 'xlsx-js-style';

function SecurityReports() {
  const { isDarkMode } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showStats, setShowStats] = useState(true);
  const itemsPerPage = 5;

  // Mock statistics data
  const statistics = {
    totalIncidents: 125,
    resolvedIncidents: 98,
    pendingIncidents: 27,
    averageResponseTime: "15 mins"
  };

  const reportData = {
    daily: [
      {
        id: 1,
        date: "2025-02-25",
        totalVisitors: 50,
        incidentsReported: 3,
        unauthorizedEntries: 1,
        securityChecks: 25,
        category: "Security Breach",
        status: "Resolved",
        priority: "High",
        location: "Main Entrance",
        assignedTo: "John Smith"
      },
      {
        id: 2,
        date: "2025-02-24",
        totalVisitors: 40,
        incidentsReported: 2,
        unauthorizedEntries: 0,
        securityChecks: 20,
        category: "Access Control",
        status: "Pending",
        priority: "Medium",
        location: "Parking Area",
        assignedTo: "Sarah Johnson"
      },
      // Add more mock data here
    ],
    weekly: [
      // Weekly data
    ],
    monthly: [
      // Monthly data
    ],
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = reportData[selectedPeriod].filter(item => {
    const matchesSearch = Object.values(item).some(
      value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    const exportData = reportData[selectedPeriod].map(report => ({
      'Date': report.date,
      'Category': report.category,
      'Location': report.location,
      'Status': report.status,
      'Priority': report.priority,
      'Assigned To': report.assignedTo,
      'Total Visitors': report.totalVisitors,
      'Incidents Reported': report.incidentsReported
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = { Sheets: { 'Security Reports': ws }, SheetNames: ['Security Reports'] };
    writeFile(wb, 'security_reports.xlsx');
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Security Activity Reports
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Comprehensive overview of security incidents and activities
          </p>
        </div>

        {/* Statistics Cards */}
        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Incidents"
              value={statistics.totalIncidents}
              icon={FaExclamationTriangle}
              color="bg-red-500"
            />
            <StatCard
              title="Resolved Incidents"
              value={statistics.resolvedIncidents}
              icon={FaCheckCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Pending Incidents"
              value={statistics.pendingIncidents}
              icon={FaUserShield}
              color="bg-yellow-500"
            />
            <StatCard
              title="Avg. Response Time"
              value={statistics.averageResponseTime}
              icon={FaCalendarAlt}
              color="bg-blue-500"
            />
          </div>
        )}

        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={handleSearch}
              className={`pl-10 w-full px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <select
              value={selectedCategory}
              onChange={handleCategoryFilter}
              className={`pl-10 w-full px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">All Categories</option>
              <option value="Security Breach">Security Breach</option>
              <option value="Access Control">Access Control</option>
              <option value="Surveillance">Surveillance</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
              <select
                value={selectedPeriod}
                onChange={handlePeriodChange}
              className={`pl-10 w-full px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              } border border-gray-300 dark:border-gray-700`}
            >
              <FaDownload />
              Export
            </button>
            <button
              onClick={() => window.print()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              } border border-gray-300 dark:border-gray-700`}
            >
              <FaPrint />
              Print
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Category</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Location</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Priority</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Assigned To</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                {currentData.map((report) => (
                  <tr key={report.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'Resolved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.priority === 'High'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : report.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4">
            {currentData.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} space-y-3`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date</p>
                    <p className="font-medium">{report.date}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.status === 'Resolved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Category</p>
                  <p className="font-medium">{report.category}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Location</p>
                  <p className="font-medium">{report.location}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Assigned To</p>
                  <p className="font-medium">{report.assignedTo}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Priority</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.priority === 'High'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : report.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {report.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
              } border border-gray-300 dark:border-gray-600`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className={`px-4 py-2 rounded-lg ${
                currentPage === pageCount
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
              } border border-gray-300 dark:border-gray-600`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityReports;
