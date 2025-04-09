import React, { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaEdit,
  FaClock,
  FaUser,
  FaTools,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllIssues, updateIssueThunk } from "../../store/thunks/issue.thunk";
import { getAllServices } from "../../store/thunks/service.thunk";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import { useTheme } from "../../context/ThemeContext";
import ErrorInterface from "../../chunksComponents/ErrorInterface";

const IssueManagementPage = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const { issues  } = useSelector((state) => state.issue);
  const { service,loading, error } = useSelector((state) => state.service);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [issueStatus, setIssueStatus] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState({
    totalPages: 1,
    currentPage: 1,
    limit:10,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAssign = (serviceId) => {
    setSelectedService(serviceId);
  };



  const handleEdit = (issueId) => {
    setSelectedIssue(issueId);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedIssue(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUpdateIssue = async () => {
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }
    const updateIssueData = {
      status: issueStatus,
      assignedTo: selectedService,
      id: selectedIssue,
    };
    dispatch(updateIssueThunk(updateIssueData));
     setIsEditing(false);
    setSelectedIssue(null);
    setIssueStatus("Pending");
    toast.success("Issue updated successfully!");
    setSelectedService(null);
  };
  const issueArray = issues?.issues || [];
  const filteredIssues = issueArray.filter((issue) => {
    const matchesSearch = issue?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue?.reportedBy?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || issue?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return isDarkMode 
          ? "bg-yellow-900 text-yellow-100" 
          : "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return isDarkMode 
          ? "bg-blue-900 text-blue-100" 
          : "bg-blue-100 text-blue-800";
      case "Resolved":
        return isDarkMode 
          ? "bg-green-900 text-green-100" 
          : "bg-green-100 text-green-800";
      default:
        return isDarkMode 
          ? "bg-gray-700 text-gray-100" 
          : "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    function fetchIssuesData() {
      dispatch(getAllIssues(page));
      
    }
    fetchIssuesData();
  }, [page]);
  useEffect(()=>{
    function getServicesData(){
      dispatch(getAllServices());
    }
    getServicesData()
  },[])

  const nextPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage + 1 });
  }

  const prevPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage - 1 });
  }

  // New helper function for mobile view
  const IssueCard = ({ issue }) => (
    <div className={`rounded-lg shadow-sm p-4 mb-3 ${
      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>{issue?.title}</h3>
          <div className="mt-1 space-y-1">
            <div className={`flex items-center text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <FaUser className="mr-1 h-3 w-3" />
              <span>Reported by: {issue?.reportedBy?.username || "N/A"}</span>
            </div>
            <div className={`flex items-center text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <FaTools className="mr-1 h-3 w-3" />
              <span>Assigned to: {issue?.assignedTo?.name || "N/A"}</span>
            </div>
            <div className={`flex items-center text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <FaClock className="mr-1 h-3 w-3" />
              <span>{moment(issue?.createdAt).format("MMM DD, YYYY")}</span>
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(issue?.status)}`}>
          {issue?.status === "Pending" && <FaExclamationTriangle className="mr-1" />}
          {issue?.status === "In Progress" && <FaSpinner className="mr-1 animate-spin" />}
          {issue?.status === "Resolved" && <FaCheckCircle className="mr-1" />}
          {issue?.status}
        </span>
      </div>
      
      {isEditing && selectedIssue === issue?._id ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <select
              value={selectedService || ""}
              onChange={(e) => handleAssign(e.target.value)}
              className={`w-full text-sm rounded-md px-3 py-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Select Service</option>
              {service?.map((s) => (
                <option key={s?._id} value={s?._id}>
                  {s?.name}
                </option>
              ))}
            </select>
            <select
              value={issueStatus}
              onChange={(e) => setIssueStatus(e.target.value)}
              className={`w-full text-sm rounded-md px-3 py-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelEdit}
              className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateIssue}
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleEdit(issue?._id)}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
              isDarkMode
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-900'
            }`}
          >
            <FaEdit className="mr-1.5 h-4 w-4" />
                          Edit
                        </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`text-xl ${
          isDarkMode ? 'text-red-400' : 'text-red-600'
        }`}>{error}</div>
      </div>
    );
  }

  return (
    <>
    {
      loading && !error &&
      <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
    }
    {
      error && !loading &&
      (
        <ErrorInterface error={error}  onRetry={()=>dispatch(getIssuesThunk())}/>
      )
    }
{ !loading && !error &&
     ( <div className={`min-h-screen py-6 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Issue Management
          </h1>
          <p className={`mt-1 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Track and manage all reported issues
          </p>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-lg shadow-sm p-4 mb-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>
                            </div>
            <div className="w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full sm:w-auto rounded-lg px-4 py-2 text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </div>
                            </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden h-[350px] overflow-auto">
          {filteredIssues?.map((issue) => (
            <IssueCard key={issue?._id} issue={issue} />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className={`rounded-lg shadow-sm overflow-hidden ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="overflow-auto h-[300px] w-full sm:w-[780px] md:w-[700px] lg:w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50 whitespace-nowrap'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>Issue</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>Reported By</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>Assigned To</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>Status</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {filteredIssues?.map((issue) => (
                  <tr key={issue?._id} className={
                    isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {issue?.title}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {issue?.reportedBy?.username || "N/A"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {issue?.assignedTo?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(issue?.status)}`}>
                        {issue?.status === "Pending" && <FaExclamationTriangle className="mr-1" />}
                        {issue?.status === "In Progress" && <FaSpinner className="mr-1 animate-spin" />}
                        {issue?.status === "Resolved" && <FaCheckCircle className="mr-1" />}
                        {issue?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isEditing && selectedIssue === issue?._id ? (
                        <div className="flex items-center space-x-3">
                          <select
                            value={selectedService || ""}
                            onChange={(e) => handleAssign(e.target.value)}
                            className={`text-sm rounded-md px-3 py-1.5 ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                                : 'border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          >
                            <option value="">Select Service</option>
                            {service?.map((s) => (
                              <option key={s?._id} value={s?._id}>
                                {s?.name}
                              </option>
                            ))}
                          </select>
                          <select
                            value={issueStatus}
                            onChange={(e) => setIssueStatus(e.target.value)}
                            className={`text-sm rounded-md px-3 py-1.5 ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                                : 'border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                              <button
                                onClick={handleCancelEdit}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                              isDarkMode
                                ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600'
                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                            }`}
                              >
                                Cancel
                              </button>
                              <button
                            onClick={handleUpdateIssue}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                              >
                                Save
                              </button>
                          </div>
                        ) : (
                        <button
                          onClick={() => handleEdit(issue?._id)}
                          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                            isDarkMode
                              ? 'text-blue-400 hover:text-blue-300'
                              : 'text-blue-600 hover:text-blue-900'
                          }`}
                        >
                          <FaEdit className="mr-1.5 h-4 w-4" />
                          Edit
                        </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            </div>
            <div className="flex items-center justify-between mt-4 px-0">
                      <div className="flex-1 flex items-center justify-between">
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Page <span className="font-medium">{page.currentPage}</span> of{' '}
                          <span className="font-medium">{issues?.pagination?.totalPages || 1}</span>
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
                          {[...Array(issues?.pagination?.totalPages || 1)].map((_, index) => (
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
                            disabled={page.currentPage === (issues?.pagination?.totalPages || 1)}
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
      <Toaster position="top-right" />
    </div>)}
    </>
  );
};

export default IssueManagementPage;
