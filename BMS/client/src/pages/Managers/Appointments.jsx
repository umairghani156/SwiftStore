import React, { useState } from "react";
import { FaCheck, FaTimes, FaCalendarAlt, FaSearch, FaFilter, FaDownload, FaEllipsisV, FaUser, FaEnvelope, FaPhone, FaBuilding, FaClock } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const Appointments = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const rowsPerPage = 5;

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      img: "/assets/images/bmsIcon.png",
      name: "John Doe",
      email: "johndoe@example.com",
      contact: "1234567890",
      office: "Office 101",
      date: "2024-03-15",
      time: "10:00 AM",
      status: "pending",
      purpose: "Business Meeting",
    },
    {
      id: 2,
      img: "/assets/images/bmsIcon.png",
      name: "Jane Smith",
      email: "janesmith@example.com",
      contact: "9876543210",
      office: "Office 102",
      date: "2024-03-16",
      time: "2:30 PM",
      status: "pending",
      purpose: "Interview",
    },
    {
      id: 3,
      img: "/assets/images/bmsIcon.png",
      name: "Alice Green",
      email: "alicegreen@example.com",
      contact: "1122334455",
      office: "Office 103",
      date: "2024-03-15",
      time: "11:00 AM",
      status: "accepted",
      purpose: "Client Meeting",
    },
    {
      id: 4,
      img: "/assets/images/bmsIcon.png",
      name: "Mark Spencer",
      email: "markspencer@example.com",
      contact: "5566778899",
      office: "Office 104",
      date: "2024-03-17",
      time: "3:00 PM",
      status: "rejected",
      purpose: "Vendor Meeting",
    },
    {
      id: 5,
      img: "/assets/images/bmsIcon.png",
      name: "Tom Hanks",
      email: "tomhanks@example.com",
      contact: "6677889900",
      office: "Office 105",
      date: "2024-03-16",
      time: "1:00 PM",
      status: "pending",
      purpose: "Site Visit",
    },
  ]);

  const filteredAppointments = appointments
    .filter((appointment) => {
      if (filter === "all") return true;
      return appointment.status === filter;
    })
    .filter((appointment) => {
      if (dateFilter === "all") return true;
      if (dateFilter === "custom") return appointment.date === selectedDate;
      const today = new Date().toISOString().split("T")[0];
      return appointment.date === today;
    })
    .filter(
      (appointment) =>
        appointment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAccept = (appointmentId) => {
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === appointmentId) {
        return { ...appointment, status: "accepted" };
      }
      return appointment;
    });
    setAppointments(updatedAppointments);
  };

  const handleReject = (appointmentId) => {
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === appointmentId) {
        return { ...appointment, status: "rejected" };
      }
      return appointment;
    });
    setAppointments(updatedAppointments);
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Contact,Office,Date,Time,Status,Purpose\n" +
      filteredAppointments.map(app => 
        `${app.name},${app.email},${app.contact},${app.office},${app.date},${app.time},${app.status},${app.purpose}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`max-w-7xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4 sm:p-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center">
            <FaCalendarAlt className="mr-2" />
            Appointments
          </h1>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full p-2 pl-8 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-gray-50 text-gray-800'
                } border border-gray-300 focus:ring-2 focus:ring-blue-500`}
              />
              <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-md ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
            >
              <FaFilter className="mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Filters</span>
            </button>
            
            <button
              onClick={exportToCSV}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaDownload className="mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Export</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div>
                  <label className="block text-sm font-medium mb-1">Status Filter</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={`w-full p-2 rounded-md ${
                      isDarkMode 
                        ? 'bg-gray-600 text-gray-100' 
                        : 'bg-white text-gray-800'
                    } border border-gray-300`}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date Filter</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className={`w-full p-2 rounded-md ${
                      isDarkMode 
                        ? 'bg-gray-600 text-gray-100' 
                        : 'bg-white text-gray-800'
                    } border border-gray-300`}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="custom">Custom Date</option>
                  </select>
                </div>

                {dateFilter === "custom" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`w-full p-2 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-600 text-gray-100' 
                          : 'bg-white text-gray-800'
                      } border border-gray-300`}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Table - Hidden on small screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className={`min-w-full divide-y divide-gray-200 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Visitor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Contact Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Appointment Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {currentAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className={`${
                    isDarkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={appointment.img}
                        alt={appointment.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="font-medium">{appointment.name}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {appointment.purpose}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{appointment.email}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {appointment.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{appointment.office}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {appointment.date} at {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getStatusBadgeClass(appointment.status)
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {appointment.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAccept(appointment.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-green-600 transition-colors"
                        >
                          <FaCheck size={12} />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleReject(appointment.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-red-600 transition-colors"
                        >
                          <FaTimes size={12} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Visible only on small screens */}
        <div className="md:hidden space-y-4">
          {currentAppointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg shadow-md overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <img
                      src={appointment.img}
                      alt={appointment.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-3">
                      <div className="font-medium">{appointment.name}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {appointment.purpose}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    getStatusBadgeClass(appointment.status)
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                
                <button 
                  onClick={() => toggleRowExpand(appointment.id)}
                  className={`mt-3 w-full flex justify-between items-center p-2 rounded-md ${
                    isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <span className="text-sm font-medium">
                    {expandedRow === appointment.id ? 'Hide Details' : 'View Details'}
                  </span>
                  <FaEllipsisV className="text-gray-500" />
                </button>
                
                <AnimatePresence>
                  {expandedRow === appointment.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 space-y-2 overflow-hidden"
                    >
                      <div className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center">
                            <FaEnvelope className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className="text-sm">{appointment.email}</span>
                          </div>
                          <div className="flex items-center">
                            <FaPhone className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className="text-sm">{appointment.contact}</span>
                          </div>
                          <div className="flex items-center">
                            <FaBuilding className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className="text-sm">{appointment.office}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className="text-sm">{appointment.date} at {appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      {appointment.status === "pending" && (
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => handleAccept(appointment.id)}
                            className="flex-1 bg-green-500 text-white py-2 rounded-md flex items-center justify-center space-x-1 hover:bg-green-600 transition-colors"
                          >
                            <FaCheck size={12} />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleReject(appointment.id)}
                            className="flex-1 bg-red-500 text-white py-2 rounded-md flex items-center justify-center space-x-1 hover:bg-red-600 transition-colors"
                          >
                            <FaTimes size={12} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Responsive Pagination */}
        <div className="mt-6 flex flex-col xs:flex-row justify-between items-center gap-4">
          <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center xs:text-left`}>
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredAppointments.length)} of {filteredAppointments.length} appointments
          </div>
          
          <div className="flex justify-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-2 sm:px-4 py-2 rounded-md text-sm ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              Prev
            </button>
            <span className={`px-2 sm:px-4 py-2 rounded-md text-sm ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-4 py-2 rounded-md text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
