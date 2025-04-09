import React, { useState } from "react";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const IssueManagementPage = () => {
  const { isDarkMode } = useTheme();
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "Plumbing Issue in Building 2",
      status: "Pending",
      assignedTo: "Maintenance",
      reportedBy: "John Doe",
      priority: "High",
    },
    {
      id: 2,
      title: "Electrical Wiring in Hallway",
      status: "In Progress",
      assignedTo: "Electrical Team",
      reportedBy: "Jane Smith",
      priority: "Medium",
    },
    {
      id: 3,
      title: "AC not working in Room 103",
      status: "Resolved",
      assignedTo: "Maintenance",
      reportedBy: "Tom Hardy",
      priority: "Low",
    },
    {
      id: 4,
      title: "Security Issue in Parking",
      status: "Pending",
      assignedTo: "Security",
      reportedBy: "Alice Green",
      priority: "High",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 5;

  const handleAssign = (issueId, team) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId ? { ...issue, assignedTo: team } : issue
      )
    );
  };

  const handleChangeStatus = (issueId, status) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId ? { ...issue, status } : issue
      )
    );
  };

  const handleEdit = (issueId) => {
    setSelectedIssue(issueId);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedIssue(null);
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastIssue = currentPage * itemsPerPage;
  const indexOfFirstIssue = indexOfLastIssue - itemsPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status, isDark = false) => {
    switch (status) {
      case "Pending":
        return isDark ? "text-red-400" : "text-red-600";
      case "In Progress":
        return isDark ? "text-yellow-400" : "text-yellow-600";
      case "Resolved":
        return isDark ? "text-green-400" : "text-green-600";
      default:
        return isDark ? "text-gray-400" : "text-gray-600";
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-150`}>
      <div className="container mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Issue Management System
        </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track and manage maintenance issues across the building
          </p>
        </div>

        {/* Filters */}
        <div className={`mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`pl-10 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className={`relative overflow-hidden rounded-lg shadow-md ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className={`text-xs uppercase ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
              }`}>
                <tr>
                  <th scope="col" className="px-6 py-4">Issue Title</th>
                  <th scope="col" className="px-6 py-4">Assigned To</th>
                  <th scope="col" className="px-6 py-4">Reported By</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentIssues.map((issue) => (
                  <tr key={issue.id} className={`${
                    isDarkMode 
                      ? 'hover:bg-gray-700/50' 
                      : 'hover:bg-gray-50'
                  } transition-colors duration-150`}>
                    <td className={`px-6 py-4 font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                    {issue.title}
                    </td>
                    <td className={`px-6 py-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {issue.assignedTo}
                    </td>
                    <td className={`px-6 py-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {issue.reportedBy}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 ${getStatusColor(issue.status, isDarkMode)}`}>
                      {issue.status === "Pending" && <FaExclamationTriangle />}
                        {issue.status === "In Progress" && <FaSpinner className="animate-spin" />}
                      {issue.status === "Resolved" && <FaCheckCircle />}
                      {issue.status}
                    </span>
                  </td>
                    <td className="px-6 py-4">
                    {isEditing && selectedIssue === issue.id ? (
                        <div className="space-y-3">
                        <select
                          value={issue.assignedTo}
                            onChange={(e) => handleAssign(issue.id, e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                                : 'border-gray-300 text-gray-900'
                            }`}
                        >
                          <option value="Maintenance">Maintenance</option>
                            <option value="Electrical Team">Electrical Team</option>
                          <option value="Security">Security</option>
                        </select>
                          <div className="flex gap-2">
                          <button
                            onClick={handleCancelEdit}
                              className={`px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleCancelEdit()}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(issue.id)}
                            className={`px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                              isDarkMode
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            Edit
                        </button>
                          {issue.status !== "Resolved" && (
                        <button
                              onClick={() => handleChangeStatus(issue.id, "Resolved")}
                              className={`px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                                isDarkMode
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              Mark Resolved
                        </button>
                          )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <div className={`flex flex-col sm:flex-row items-center justify-between rounded-lg shadow-sm p-4 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="mb-4 sm:mb-0">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Showing{" "}
                <span className={`font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>
                  {indexOfFirstIssue + 1}
                </span>
                {" - "}
                <span className={`font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>
                  {Math.min(indexOfLastIssue, filteredIssues.length)}
                </span>
                {" of "}
                <span className={`font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>
                  {filteredIssues.length}
                </span> issues
              </p>
            </div>
            <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
          >
            Previous
          </button>
              <div className="hidden sm:flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors duration-150 ${
                      currentPage === index + 1
                        ? isDarkMode
                          ? "z-10 bg-blue-900 border-blue-500 text-blue-100"
                          : "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : isDarkMode
                          ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
          >
            Next
          </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueManagementPage;
