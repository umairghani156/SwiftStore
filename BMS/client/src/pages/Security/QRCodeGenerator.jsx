import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  FaQrcode,
  FaUserAlt,
  FaIdCard,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaBuilding,
  FaDownload,
  FaPrint,
  FaEnvelope,
  FaSearch,
  FaArrowRight,
  FaArrowLeft
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import { getAllVisitorsThunk } from "../../store/thunks/visitor.thunk";
import VisitorCard from "../../components/Security/VisitorCard";
import Pagination from "../../components/Security/Pagination";
import VisitorManagement from "../Admin/VisitorManagement";
import VisitorsTable from "../../chunksComponents/VisitorsTable";

const QRCodeGenerator = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const { visitors } = useSelector((state) => state.visitors);
  const [page, setPage] = useState({
    currentPage: 1,
    totalPage: 1,
    limit: 10,
    skip: 1,
  });
  // const {visitors} = useSelector((state)=> state.visitors);
  const [visitorData, setVisitorData] = useState({
    name: "",
    cnic: "",
    phone: "",
    email: "",
    visitDate: "",
    visitTime: "",
    destination: "",
    purpose: "",
    host: "",
    department: "",
  });
  const [generatedQR, setGeneratedQR] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("form"); // "form" or "list"
  const qrRef = useRef(null);

  // Mock visitors data (in a real app, this would come from an API)
  // const [visitors, setVisitors] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     cnic: "12345-6789012-3",
  //     phone: "+92 300 1234567",
  //     email: "johndoe@example.com",
  //     visitDate: "2024-03-20",
  //     visitTime: "14:00",
  //     destination: "Office 101",
  //     purpose: "Meeting",
  //     host: "Michael Scott",
  //     department: "Sales",
  //     qrCodeData: "12345-6789012-3"
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     cnic: "23456-7890123-4",
  //     phone: "+92 301 2345678",
  //     email: "janesmith@example.com",
  //     visitDate: "2024-03-21",
  //     visitTime: "10:30",
  //     destination: "Office 102",
  //     purpose: "Interview",
  //     host: "Jim Halpert",
  //     department: "HR",
  //     qrCodeData: "23456-7890123-4"
  //   },
  //   {
  //     id: 3,
  //     name: "Ahmed Khan",
  //     cnic: "34567-8901234-5",
  //     phone: "+92 302 3456789",
  //     email: "ahmed@example.com",
  //     visitDate: "2024-03-22",
  //     visitTime: "09:15",
  //     destination: "Conference Room A",
  //     purpose: "Presentation",
  //     host: "Pam Beesly",
  //     department: "Marketing",
  //     qrCodeData: "34567-8901234-5"
  //   }
  // ]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitorData({
      ...visitorData,
      [name]: value
    });
  };

  const handleGenerateQR = (e) => {
    e.preventDefault();

    // Validate form
    if (!visitorData.name || !visitorData.cnic || !visitorData.phone || !visitorData.visitDate) {
      toast.error("Please fill all required fields");
      return;
    }

    // Create a new visitor with the form data
    const newVisitor = {
      id: visitors.length + 1,
      ...visitorData,
      qrCodeData: visitorData.cnic // This is the key field for verification
    };

    // Add to visitors list
    setVisitors([...visitors, newVisitor]);
    setGeneratedQR(true);
    toast.success("Visitor registered and QR Code generated successfully!");

    // Switch to visitor list view on mobile after successful registration
    setActiveTab("list");
  };

  const handleReset = () => {
    setVisitorData({
      name: "",
      cnic: "",
      phone: "",
      email: "",
      visitDate: "",
      visitTime: "",
      destination: "",
      purpose: "",
      host: "",
      department: "",
    });
    setGeneratedQR(false);
  };



  // Filter visitors based on search term
  console.log("Data", visitors)
  const filteredVisitors = visitors && visitors.visitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.cnicNumber.includes(searchTerm) ||
    visitor.contact.includes(searchTerm)
  );

  // Generate QR code value in the format expected by the verification system


  // Function to render the visitor card for mobile view


  useEffect(() => {
    function getAllVisitors() {
      dispatch(getAllVisitorsThunk(page));
    }
    getAllVisitors();
  }, [page]);

  const handlePageChange = useCallback((pageNumber) => {
    setPage(pageNumber);
  }, []);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-4 mt-16 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
    >
      <ToastContainer theme={isDarkMode ? "dark" : "light"} position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
            }`}>
            Visitor QR Code Generator
          </h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
            Generate QR codes for visitor access management
          </p>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden mb-4">
          <div className={`flex rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow`}>
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${activeTab === "form"
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                  : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
            >
              Register Visitor
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${activeTab === "list"
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                  : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
            >
              Registered Visitors
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
         
          {/* Visitors List Section */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
              } p-4 md:p-6 ${activeTab === "list" ? "block" : "hidden md:block"
              } md:flex-1`}
          >
            

          
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 w-full p-2 text-sm rounded-lg border ${isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Search by name, CNIC, or phone number"
                />
              </div>
            </div>

            {/* Empty State */}
            {filteredVisitors && filteredVisitors.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                <FaQrcode className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-lg font-medium">No visitors found</p>
                <p className="text-sm">
                  {searchTerm
                    ? "Try changing your search term"
                    : "Register a visitor to generate QR codes"}
                </p>
              </div>
            )}

            {/* Visitors Table */}
            <div className={`rounded-lg shadow-sm overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
              <VisitorsTable visitors={visitors} page={page} setPage={setPage} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default QRCodeGenerator;