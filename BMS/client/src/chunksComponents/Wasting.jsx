import React, { useState, useRef } from "react";
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

const QRCodeGenerator = () => {
  const { isDarkMode } = useTheme();
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
  const [visitors, setVisitors] = useState([
    {
      id: 1,
      name: "John Doe",
      cnic: "12345-6789012-3",
      phone: "+92 300 1234567",
      email: "johndoe@example.com",
      visitDate: "2024-03-20",
      visitTime: "14:00",
      destination: "Office 101",
      purpose: "Meeting",
      host: "Michael Scott",
      department: "Sales",
      qrCodeData: "12345-6789012-3"
    },
    {
      id: 2,
      name: "Jane Smith",
      cnic: "23456-7890123-4",
      phone: "+92 301 2345678",
      email: "janesmith@example.com",
      visitDate: "2024-03-21",
      visitTime: "10:30",
      destination: "Office 102",
      purpose: "Interview",
      host: "Jim Halpert",
      department: "HR",
      qrCodeData: "23456-7890123-4"
    },
    {
      id: 3,
      name: "Ahmed Khan",
      cnic: "34567-8901234-5",
      phone: "+92 302 3456789",
      email: "ahmed@example.com",
      visitDate: "2024-03-22",
      visitTime: "09:15",
      destination: "Conference Room A",
      purpose: "Presentation",
      host: "Pam Beesly",
      department: "Marketing",
      qrCodeData: "34567-8901234-5"
    }
  ]);

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

  const downloadQRCode = (visitor) => {
    const qrCodeElement = document.getElementById(`qr-code-${visitor.id}`);
    if (!qrCodeElement) return;
    
    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = `visitor-qr-${visitor.name.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.info("QR Code downloaded");
    });
  };

  const printQRCode = (visitor) => {
    const qrCodeElement = document.getElementById(`qr-code-${visitor.id}`);
    if (!qrCodeElement) return;
    
    html2canvas(qrCodeElement).then((canvas) => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Visitor QR Code</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              .visitor-info {
                margin-top: 20px;
                text-align: center;
              }
              .visitor-info p {
                margin: 5px 0;
              }
              .visitor-card {
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 20px;
                max-width: 350px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
              }
              .header h2 {
                margin: 0;
                color: #333;
              }
              .header p {
                margin: 5px 0;
                color: #666;
                font-size: 14px;
              }
              .qr-container {
                display: flex;
                justify-content: center;
                margin: 15px 0;
              }
              .details {
                margin-top: 15px;
                font-size: 14px;
              }
              .details p {
                margin: 5px 0;
                display: flex;
                justify-content: space-between;
              }
              .details strong {
                color: #555;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="visitor-card">
              <div class="header">
                <h2>Visitor Pass</h2>
                <p>Building Management System</p>
              </div>
              <div class="qr-container">
                <img src="${canvas.toDataURL('image/png')}" width="200" />
              </div>
              <div class="visitor-info">
                <h3>${visitor.name}</h3>
                <p><strong>CNIC:</strong> ${visitor.cnic}</p>
                <p><strong>Visit Date:</strong> ${visitor.visitDate}</p>
                <p><strong>Visit Time:</strong> ${visitor.visitTime || 'Not specified'}</p>
                <p><strong>Destination:</strong> ${visitor.destination || 'Not specified'}</p>
                <p><strong>Host:</strong> ${visitor.host || 'Not specified'}</p>
                <p><strong>Department:</strong> ${visitor.department || 'Not specified'}</p>
                <p><strong>Purpose:</strong> ${visitor.purpose || 'Not specified'}</p>
              </div>
              <div class="footer">
                <p>Please present this QR code at the security desk upon arrival.</p>
                <p>Valid only for the date and time specified.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      toast.info("Printing Visitor Pass");
    });
  };

  // Filter visitors based on search term
  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.cnic.includes(searchTerm) ||
    visitor.phone.includes(searchTerm)
  );

  // Generate QR code value in the format expected by the verification system
  const generateQRValue = (visitor) => {
    // The verification system is looking for either qrCodeData or cnic
    return JSON.stringify({
      qrCodeData: visitor.cnic,
      cnic: visitor.cnic,
      name: visitor.name
    });
  };

  // Function to render the visitor card for mobile view
  const renderVisitorCard = (visitor) => (
    <div 
      key={visitor.id}
      className={`rounded-lg p-4 mb-4 ${
        isDarkMode ? "bg-gray-700" : "bg-gray-50"
      } shadow`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* QR Code */}
        <div className="flex justify-center">
          <div id={`qr-code-${visitor.id}`} className="bg-white p-2 rounded-lg">
            <QRCode
              value={generateQRValue(visitor)}
              size={120}
              level="H"
            />
            <div className="text-center mt-1 text-xs text-gray-900">
              {visitor.name}
            </div>
          </div>
        </div>
        
        {/* Visitor Details */}
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            {visitor.name}
          </h3>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-1 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            <div className="flex items-center gap-1">
              <FaIdCard className="flex-shrink-0" size={14} />
              <span>{visitor.cnic}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaPhone className="flex-shrink-0" size={14} />
              <span>{visitor.phone}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="flex-shrink-0" size={14} />
              <span>{visitor.visitDate}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaClock className="flex-shrink-0" size={14} />
              <span>{visitor.visitTime || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaBuilding className="flex-shrink-0" size={14} />
              <span>{visitor.destination || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaUserAlt className="flex-shrink-0" size={14} />
              <span>Host: {visitor.host || 'Not specified'}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => downloadQRCode(visitor)}
              className="flex items-center justify-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm flex-1"
            >
              <FaDownload size={12} />
              <span>Download</span>
            </button>
            <button
              onClick={() => printQRCode(visitor)}
              className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm flex-1"
            >
              <FaPrint size={12} />
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-4 mt-16 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <ToastContainer theme={isDarkMode ? "dark" : "light"} position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl md:text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Visitor QR Code Generator
          </h1>
          <p className={`${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Generate QR codes for visitor access management
          </p>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden mb-4">
          <div className={`flex rounded-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow`}>
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                activeTab === "form"
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
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                activeTab === "list"
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
          {/* Form Section */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-4 md:p-6 ${
              activeTab === "form" ? "block" : "hidden md:block"
            } md:w-1/3 flex-shrink-0`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Register New Visitor
            </h2>
            
            <form onSubmit={handleGenerateQR} className="space-y-3">
              <div className="space-y-3">
                {/* Basic Info Section */}
                <div className={`p-3 rounded-lg mb-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}>
                  <h3 className={`text-sm font-medium mb-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Basic Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserAlt className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={visitorData.name}
                          onChange={handleInputChange}
                          className={`pl-9 w-full p-2 text-sm rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-blue-500`}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        CNIC Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                        </div>
                        <input
                          type="text"
                          name="cnic"
                          value={visitorData.cnic}
                          onChange={handleInputChange}
                          className={`pl-9 w-full p-2 text-sm rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-blue-500`}
                          placeholder="12345-6789012-3"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={visitorData.phone}
                          onChange={handleInputChange}
                          className={`pl-9 w-full p-2 text-sm rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-blue-500`}
                          placeholder="+92 300 1234567"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={visitorData.email}
                          onChange={handleInputChange}
                          className={`pl-9 w-full p-2 text-sm rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-blue-500`}
                          placeholder="johndoe@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visit Details Section */}
                <div className={`p-3 rounded-lg mb-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}>
                  <h3 className={`text-sm font-medium mb-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Visit Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          Visit Date *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                          </div>
                          <input
                            type="date"
                            name="visitDate"
                            value={visitorData.visitDate}
                            onChange={handleInputChange}
                            className={`pl-9 w-full p-2 text-sm rounded-lg border ${
                              isDarkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:ring-2 focus:ring-blue-500`}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          Visit Time
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaClock className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                          </div>
                          <input
                            type="time"
                            name="visitTime"
                            value={visitorData.visitTime}
                            onChange={handleInputChange}
                            className={`pl-9 w-full p-2 text-sm rounded-lg border ${
                              isDarkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Destination
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBuilding className={isDarkMode ? "text-gray-500" : "text-gray-400"} size={14} />
                        </div>
                        <input
                          type="text"
                          name="destination"
                          value={visitorData.destination}
                          onChange={handleInputChange}
                          className={`pl-9 w-full p-2 text-sm rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-blue-500`}
                          placeholder="Room 404"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          Host Name
                        </label>
                        <input
                          type="text"
                          name="host"
                          value={visitorData.host}
                          onChange={handleInputChange}
                          className={`w-full p-2 text-sm rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-blue-500`}
                          placeholder="Host Name"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={visitorData.department}
                          onChange={handleInputChange}
                          className={`w-full p-2 text-sm rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:ring-2 focus:ring-blue-500`}
                          placeholder="Department"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Purpose of Visit
                      </label>
                      <textarea
                        name="purpose"
                        value={visitorData.purpose}
                        onChange={handleInputChange}
                        rows="2"
                        className={`w-full p-2 text-sm rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500`}
                        placeholder="Brief description of visit purpose"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition duration-200`}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Register Visitor
                </button>
              </div>
            </form>
          </motion.div>
          
          {/* Visitors List Section */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-4 md:p-6 ${
              activeTab === "list" ? "block" : "hidden md:block"
            } md:flex-1`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Registered Visitors
              </h2>
              
              {/* Back Button (Mobile Only) */}
              <button
                onClick={() => setActiveTab("form")}
                className={`md:hidden flex items-center gap-1 text-sm font-medium ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                <FaArrowLeft size={12} />
                <span>Back to Form</span>
              </button>
            </div>
            
            {/* Search Bar */}
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
                  className={`pl-10 w-full p-2 text-sm rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Search by name, CNIC, or phone number"
                />
              </div>
            </div>
            
            {/* Empty State */}
            {filteredVisitors.length === 0 && (
              <div className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
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
            
            {/* Visitors List */}
            <div className="space-y-4">
              {filteredVisitors.map(visitor => renderVisitorCard(visitor))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default QRCodeGenerator;