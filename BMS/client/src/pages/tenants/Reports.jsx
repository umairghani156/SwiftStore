import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllIssues, getUserIssuesThunk, addIssueThunk, addSpecialUserIssueThunk } from "../../store/thunks/issue.thunk";
import { getAllServices } from "../../store/thunks/service.thunk";
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaCheckCircle, FaClock, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import toast, { Toaster } from "react-hot-toast";
import { RiErrorWarningLine } from 'react-icons/ri';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// Modal for reporting issues
const ReportIssueModal = ({ showModal, setShowModal, handleReportIssue }) => {
  const dispatch = useDispatch();
  const { service } = useSelector(state => state.service);
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    title: "Electrical",
    description: "",
    urgency: "Medium",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // TODO: Add form validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log("Hello");
    dispatch(addSpecialUserIssueThunk(formData));
    try {
      setFormData({
        title: "Electrical",
        description: "",
        urgency: "Medium",
      });
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchServiceCategories = async () => {
      await dispatch(getAllServices());
    };

    fetchServiceCategories();
  }, []);

  if (!showModal) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto"
      onClick={() => setShowModal(false)}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg mx-auto my-8 rounded-xl shadow-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}
      >
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-[#1A415A]'
            }`}>
            Report an Issue
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
            Please provide details about the issue you'd like to report
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Service Category
              </label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full p-3 rounded-lg border ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-300'
                    : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 transition-colors`}
                required
              >
                {service && service.map((service) => (
                  <option key={service._id} value={service.name}>{service.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Urgency Level
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className={`w-full p-3 rounded-lg border ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-300'
                    : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 transition-colors`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full h-32 p-3 rounded-lg border ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-300'
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder="Please provide detailed information about the issue..."
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`px-4 py-2 rounded-lg font-medium ${isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Submit Report
            </button>
          </div>
        </form>
      </motion.div>
      <Toaster />
    </motion.div>
  );
};

const Reports = () => {
  const dispatch = useDispatch();
  const { issues, userIssues, loading, error } = useSelector((state) => state.issue);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { isDarkMode } = useTheme();
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

  useEffect(() => {
    const fetchReportedIssues = async () => {
      dispatch(getUserIssuesThunk(page));
    }
    fetchReportedIssues();
  }, [page]);

  const handleReportIssue = async (formData) => {
    try {
      await dispatch(addIssueThunk(formData)).unwrap();
      dispatch(getUserIssuesThunk());
      // toast.success('Issue reported successfully!');
      return Promise.resolve();
    } catch (error) {
      //  toast.error('Failed to report issue. Please try again.');
      throw error;
    }
  };
  const userIssuesArray = userIssues?.issues || [];
  const filteredIssues = userIssuesArray?.filter(issue => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const nextPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage + 1 });
  }

  const prevPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage - 1 });
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'Resolved':
        return 'text-green-500';
      case 'Pending':
        return 'text-yellow-500';
      case 'In progress':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'in progress':
        return <FaExclamationTriangle className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 mt-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
    >


      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#1A415A]'
              }`}>
              Service Reports
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Track and manage your service requests
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
          >
            <span>+ New Report</span>
          </motion.button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Reports",
              value: userIssuesArray?.length || 0,
              icon: <FaExclamationTriangle />,
              color: "blue"
            },
            {
              label: "Pending",
              value: userIssuesArray?.filter(i => i.status.toLowerCase() === "pending").length || 0,
              icon: <FaClock />,
              color: "yellow"
            },
            {
              label: "Completed",
              value: userIssuesArray?.filter(i => i.status.toLowerCase() === "completed").length || 0,
              icon: <FaCheckCircle />,
              color: "green"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center space-x-4">
                <span className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : `bg-${stat.color}-100`
                  } ${isDarkMode ? `text-${stat.color}-400` : `text-${stat.color}-600`}`}>
                  {stat.icon}
                </span>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <>
       { filteredIssues.length > 0 ?
       ( <>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
                } border focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`rounded-lg px-4 py-2 ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
                } border focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          className={`rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : error ? (
            <div className={`p-8 text-center ${isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
              {error}
            </div>
          ) : filteredIssues?.length > 0 ? (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="inline-block min-w-full align-middle">
              <div className="overflow-auto h-[300px]">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } uppercase tracking-wider min-w-[180px]`}>Title</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } uppercase tracking-wider min-w-[200px]`}>Description</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } uppercase tracking-wider min-w-[150px]`}>Category</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } uppercase tracking-wider min-w-[120px]`}>Status</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } uppercase tracking-wider min-w-[100px]`}>Urgency</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                    }`}>
                    {filteredIssues.map((issue, index) => (
                      <motion.tr
                        key={issue._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors duration-150`}
                      >
                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>
                          <div className="font-medium line-clamp-2">{issue.title}</div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>
                          <div className="max-w-xs line-clamp-2">
                            {issue.description}
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>
                          <div className="flex items-center space-x-2">
                            <span className="hidden sm:inline">{issue.assignedTo ? issue.assignedTo.name : "Not Assigned"}</span>
                            <span className="sm:hidden">N/A</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={getStatusColor(issue.status)}>
                              {getStatusIcon(issue.status)}
                            </span>
                            <span className={`text-sm ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${issue.urgency === "High"
                              ? "bg-red-100 text-red-800"
                              : issue.urgency === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                            {issue.urgency || "N/A"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          ) : (
            <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              No issues reported yet.
            </div>
          )}
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
        </>)
        :(
          <div className={`flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} px-4 py-10 sm:px-6 lg:px-8`}>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-8 flex flex-col items-center justify-center space-y-6 max-w-md w-full`}>
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-red-50">
              <RiErrorWarningLine className="h-10 w-10 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>No Issues Found</h3>
              <p className={`mt-2 text-[16px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You haven't created any issues yet. Submit a new issue to track problems or requests.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
            >
              Create New Issue
            </button>
          </div>
        </div>
        )}
        </>
      </div>

      <ReportIssueModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleReportIssue={handleReportIssue}
      />
      <Toaster />
    </motion.div>
  );
};

export default Reports;
