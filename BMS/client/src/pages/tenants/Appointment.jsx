import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { FaCalendarAlt, FaClock, FaUser, FaIdCard, FaBuilding, FaHourglassHalf, FaCheck, FaTimes, FaPhone, FaFingerprint, FaChevronLeft, FaChevronRight, FaTrash, FaRegSadCry } from "react-icons/fa";
import { getOfficeThunk } from "../../store/thunks/office.thunk";
import { addVisitorAppoinmentThunk, addVisitorThunk, getAllAppoinmentsThunk } from "../../store/thunks/visitor.thunk";
import { format } from "date-fns";
import toast, { Toaster } from 'react-hot-toast';
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const Appointment = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const { office } = useSelector((state) => state.office);
  const [page, setPage] = useState({ currentPage: 1, limit: 3 });
  const { appointments } = useSelector((state) => state.appointment);


  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    cnicNumber: "",
    office: "",
    duration: "",
    purpose: "",
  });

  const [showForm, setShowForm] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    const data = await dispatch(addVisitorAppoinmentThunk(formData))

    setFormData({
      fullName: "",
      contact: "",
      cnicNumber: "",
      office: "",
      duration: "",
      purpose: "",

    });
    setShowForm(false);
    //toast.success("Appointment request submitted successfully!");
  };



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

  const formVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleModalClose = () => {
    setShowForm(false);
    setFormData({
      fullName: "",
      contact: "",
      cnicNumber: "",
      office: "",
      duration: "",
      date: "",
      time: "",
    });
  };


  // Get All offices Data

  useEffect(() => {
    const getAllOffices = () => {
      dispatch(getOfficeThunk());
      dispatch(getAllAppoinmentsThunk(page));

    };
    getAllOffices();
  }, [dispatch, page])


  // Pagination
  const nextPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage + 1 });
  }

  const prevPageHandle = () => {
    setPage({ ...page, currentPage: page.currentPage - 1 });
  }
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* <ToastContainer theme={isDarkMode ? "dark" : "light"} /> */}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Appointment Management
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Schedule and manage your visitor appointments
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
          >
            <FaCalendarAlt />
            <span>New Appointment</span>
          </motion.button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Appointments", value: appointments?.visitors.length, icon: <FaCalendarAlt /> },
            { label: "Pending Approval", value: appointments?.visitors.filter(a => a.status === "Pending").length, icon: <FaClock /> },
            { label: "Approved", value: appointments?.visitors.filter(a => a.status === "Approved").length, icon: <FaCheck /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center space-x-4">
                <span className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
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

        {/* Modal */}
        {showForm && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleModalClose}
          >
            <motion.div
              variants={formVariants}
              className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-xl shadow-xl p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Schedule New Appointment</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                        } focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Contact Information
                  </label>
                  <div className="relative">
                    <FaPhone className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                        } focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your contact info"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    CNIC Number
                  </label>
                  <div className="relative">
                    <FaIdCard className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    <input
                      type="text"
                      name="cnicNumber"
                      value={formData.cnicNumber}
                      onChange={(e) => setFormData({ ...formData, cnicNumber: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                        } focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your CNIC number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Office Location
                  </label>
                  <div className="relative">
                    <FaBuilding className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    <select onChange={(e) => setFormData({ ...formData, office: e.target.value })} name="office" id="office" className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                      <option value="h6725" aria-readonly={true} className="text-gray-400">Select Office Location</option>
                      {
                        office && office.map((item) => (
                          <option value={item._id}>{item.officeName}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>



                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Purpose
                  </label>
                  <div className="relative">
                    <FaFingerprint className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    <select onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} name="purpose" id="purpose" className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500">
                      <option value="" aria-readonly={true} className="text-gray-400">Select purpose</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Visit">Visit</option>
                      <option value="Call">Delivery</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Duration (minutes to hours)
                  </label>
                  <div className="relative">
                    <FaHourglassHalf className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      min="1"
                      max="8"
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                        } focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter duration by mentioning min or hr"
                      required
                    />
                  </div>
                </div>

                <div className="col-span-2 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({
                        name: "",
                        contact: "",
                        cnicNumber: "",
                        duration: "",
                        office: "",
                        purpose: ""
                      })
                    }}
                    className={`px-6 py-2 rounded-lg ${isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Appointments List */}
       { appointments && appointments?.visitors?.length > 0 ? ( 
        <>
        <motion.div
          variants={containerVariants}
          className={`rounded-md shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
        >
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="inline-block min-w-full align-middle">
            <div className="overflow-auto h-[300px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider min-w-[200px]`} key="visitor">Visitor</th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider min-w-[120px]`} key={"office"}>Office</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider min-w-[150px]`} key={"date"}>Date</th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider min-w-[150px]`} key={"purpose"}>Purpose</th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider min-w-[100px]`} key={"duration"}>Duration</th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider min-w-[100px]`} key={"status"}>Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                  {appointments && appointments?.visitors?.map((appointment, index) => (
                    <motion.tr
                      key={appointment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors duration-150`}
                    >
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        <div className="flex flex-col space-y-1">
                          <div className="text-sm font-medium line-clamp-1">{appointment.name}</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            } line-clamp-1`}>{appointment.contact}</div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        <div className="line-clamp-1">{appointment.office.officeName}</div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        <div className="space-y-1">
                          <div className="hidden sm:block">{format(appointment.createdAt, 'yyyy-MM-dd')}</div>
                          <div className="sm:hidden">{format(appointment.createdAt, 'yyyy-MM-dd')}</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>{format(appointment.createdAt, 'hh:mm a')}</div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        <span className="whitespace-nowrap">{appointment.purpose}</span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        <span className="whitespace-nowrap">{appointment.duration}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                          {appointment.status}
                        </span>
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
              <span className="font-medium">{appointments?.pagination?.totalPages || 1}</span>
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
              {[...Array(appointments?.pagination?.totalPages || 1)].map((_, index) => (
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
                disabled={page.currentPage === (appointments?.pagination?.totalPages || 1)}
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
        </>
        )
        : (
          <div className={`flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}  px-4 py-10 sm:px-6 lg:px-8`}>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}  rounded-lg p-8 flex flex-col items-center justify-center space-y-6 max-w-md w-full`}>
            <div className={`flex items-center justify-center h-20 w-20 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200' }`}>
              <FaCalendarAlt className="text-blue-500 h-10 w-10" />
            </div>
            <div className="text-center">
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900' }`}>No Appointments</h3>
              <p className={`mt-2 text-[16px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600' }`}>
                This tenant has not scheduled any appointments yet.
              </p>
            </div>
            <button
            onClick={()=> setShowForm(true)} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
              Create Appointment
            </button>
          </div>
        </div>


        )}
      </div>
      <Toaster />
    </motion.div>
  );
};

export default Appointment;
