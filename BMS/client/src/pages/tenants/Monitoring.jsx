import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FaFilter, FaTools, FaBolt, FaWater, FaTemperatureHigh, FaExclamationCircle, FaCheckCircle, FaClock, FaShieldAlt, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { getUserIssuesThunk } from "../../store/thunks/issue.thunk";
import { useDispatch, useSelector } from "react-redux";
import { RiErrorWarningLine } from "react-icons/ri";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// Dummy initial data
const initialIssues = [
  {
    id: 1,
    title: "Leaking Pipe in Restroom",
    description: "Water leaking from the ceiling near the restroom.",
    category: "Plumbing",
    status: "Pending",
    priority: "High",
    reportedAt: "2024-02-20 09:30",
  },
  {
    id: 2,
    title: "Electrical Short Circuit in Room 101",
    description: "Frequent electrical short-circuits reported in room 101.",
    category: "Electrical",
    status: "In Progress",
    priority: "Urgent",
    reportedAt: "2024-02-19 14:15",
  },
  {
    id: 3,
    title: "HVAC System Not Working",
    description: "The HVAC system is not cooling properly.",
    category: "HVAC",
    status: "Resolved",
    priority: "Medium",
    reportedAt: "2024-02-18 11:45",
  },
  {
    id: 4,
    title: "Water Pressure Low in Floor 3",
    description: "Low water pressure reported in all bathrooms on Floor 3.",
    category: "Plumbing",
    status: "Pending",
    priority: "Medium",
    reportedAt: "2024-02-20 10:00",
  },
  {
    id: 5,
    title: "Light Fixtures Flickering",
    description: "Multiple light fixtures flickering in conference room B.",
    category: "Electrical",
    status: "In Progress",
    priority: "Low",
    reportedAt: "2024-02-19 16:30",
  }
];

const MonitoringPage = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const {userIssues} = useSelector((state)=> state.issue);
  const [issues, setIssues] = useState(initialIssues);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
   const [page, setPage] = useState({
      currentPage: 1,
      totalPage: 1,
      limit: 4,
      skip: 1,
    })

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };
  const userIssuesArray = userIssues?.issues || [];
  const filteredIssues = userIssuesArray.filter((issue) => {
    const categoryMatches = selectedCategory
      ? issue.title === selectedCategory
      : true;
    const statusMatches = selectedStatus
      ? issue.status === selectedStatus
      : true;
    const searchMatches = searchTerm
      ? issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return categoryMatches && statusMatches && searchMatches;
  });

  const nextPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage + 1 });
  }

  const prevPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage - 1 });
  }


  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <FaCheckCircle className="text-green-500" />;
      case "In Progress":
        return <FaClock className="text-blue-500" />;
      case "Pending":
        return <FaExclamationCircle className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Plumbing":
        return <FaWater className="text-blue-500" />;
      case "Electrical":
        return <FaBolt className="text-yellow-500" />;
      case "Security":
        return <FaShieldAlt className="text-gray-500" />;
      default:
        return <FaTools className="text-gray-500" />;
    }
  };


  useEffect(()=>{
    function getUserIssuesData(){
      dispatch(getUserIssuesThunk(page))
    };

    getUserIssuesData();
  },[page])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 mt-16 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* <ToastContainer theme={isDarkMode ? "dark" : "light"} /> */}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Active Issues Monitoring
            </h1>
            <p className={`${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Track and monitor maintenance issues in real-time
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Issues",
              value: userIssues?.pagination?.totalIssues || 0,
              icon: <FaTools />,
              color: "blue"
            },
            {
              label: "Pending",
              value: userIssues?.issues.filter(i => i.status === "Pending").length,
              icon: <FaExclamationCircle />,
              color: "yellow"
            },
            {
              label: "In Progress",
              value: userIssues?.issues.filter(i => i.status === "In Progress").length,
              icon: <FaClock />,
              color: "blue"
            },
            {
              label: "Resolved",
              value: userIssues?.issues.filter(i => i.status === "Resolved").length,
              icon: <FaCheckCircle />,
              color: "green"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center space-x-4">
                <span className={`p-3 rounded-full ${
                  isDarkMode ? "bg-gray-700" : `bg-${stat.color}-100`
                } ${isDarkMode ? `text-${stat.color}-400` : `text-${stat.color}-600`}`}>
                  {stat.icon}
                </span>
                <div>
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters Section */}
       { 
        userIssues?.issues?.length > 0 ?
       ( <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-3 pl-10 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500`}
            />
            <FaFilter className={`absolute left-3 top-3.5 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`} />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-3 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Security">Security</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`p-3 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Issues Table */}
        <motion.div
          variants={containerVariants}
          className={`rounded-md shadow-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-auto h-[300px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={isDarkMode ? "bg-gray-900" : "bg-gray-50"}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider min-w-[200px]`}>Issue</th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider min-w-[120px]`}>Category</th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider min-w-[120px]`}>Status</th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider min-w-[100px]`}>Priority</th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider min-w-[150px]`}>Reported At</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-200"
                }`}>
                  {filteredIssues.map((issue, index) => (
                    <motion.tr
                      key={issue._id}
                      variants={itemVariants}
                      custom={index}
                      className={`${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"} transition-colors duration-150`}
                    >
                      <td className={`px-6 py-4 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}>
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium line-clamp-2">{issue.title}</span>
                          <span className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } line-clamp-2`}>{issue.description}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}>
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(issue.title)}
                          <span className="hidden sm:inline">{issue.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(issue.status)}
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            issue.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : issue.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          issue.urgency === "High"
                            ? "bg-red-100 text-red-800"
                            : issue.urgency === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {issue.urgency ? issue.urgency : "N/A"}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}>
                        <span className="hidden sm:inline">{issue.createdAt}</span>
                        <span className="sm:hidden">{issue?.createdAt?.split(' ')[0]}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </motion.div>
         <div className="hidden sm:flex sm:items-center sm:justify-between mt-4 px-0">
                  <div className="flex-1 flex items-center justify-between">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Page <span className="font-medium">{page.currentPage}</span> of{' '}
                      <span className="font-medium">{userIssues?.pagination?.totalPage || 1}</span>
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
                      {[...Array(userIssues?.pagination?.totalPage || 1)].map((_, index) => (
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
                        disabled={page.currentPage === (userIssues?.pagination?.totalPage || 1)}
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
                </>):(
                   <div className={`flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} px-4 py-10 sm:px-6 lg:px-8`}>
                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-8 flex flex-col items-center justify-center space-y-6 max-w-md w-full`}>
                              <div className={`flex items-center justify-center h-20 w-20 rounded-full bg-red-50`}>
                                <RiErrorWarningLine className={`h-10 w-10 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                              </div>
                              <div className="text-center">
                                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>No Issues Found</h3>
                                <p className={`mt-2 text-[16px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  You haven't created any issues yet. Submit a new issue to track problems or requests.
                                </p>
                              </div>
                            
                            </div>
                          </div>
                )
                }
      </div>
    </motion.div>
  );
};

export default MonitoringPage;
