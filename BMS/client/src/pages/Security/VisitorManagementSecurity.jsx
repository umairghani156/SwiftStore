import React, { useState, useRef } from "react";
import { FaSearch, FaPrint, FaUserPlus, FaQrcode, FaHistory, FaChartBar, FaUserCheck, FaExclamationTriangle } from "react-icons/fa";
import QRCode from "react-qr-code";
import { createRoot } from "react-dom/client";
import { useTheme } from "../../context/ThemeContext";

const VisitorPage = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const rowsPerPage = 5;
  const qrCodeRef = useRef();

  // Mock statistics data
  const stats = {
    totalVisitors: 156,
    activeVisitors: 23,
    pendingApprovals: 8,
    deniedAccess: 3,
  };

  const users = [
    {
      id: 1,
      img: "/assets/images/bmsIcon.png",
      name: "John Doe",
      email: "johndoe@example.com",
      role: "Visitor",
      contact: "1234567890",
      office: "Office 101",
      cnic: "12345-6789012-3",
      status: "active",
      validUntil: "2024-03-20 17:00",
      purpose: "Meeting",
      host: "Michael Scott"
    },
    {
      id: 2,
      img: "/assets/images/bmsIcon.png",
      name: "Jane Smith",
      email: "janesmith@example.com",
      role: "Visitor",
      contact: "9876543210",
      office: "Office 102",
      cnic: "23456-7890123-4",
      status: "active",
      validUntil: "2024-03-20 17:00",
      purpose: "Meeting",
      host: "Michael Scott"
    },
    {
      id: 3,
      img: "/assets/images/bmsIcon.png",
      name: "Alice Green",
      email: "alicegreen@example.com",
      role: "Visitor",
      contact: "1122334455",
      office: "Office 103",
      cnic: "34567-8901234-5",
      status: "active",
      validUntil: "2024-03-20 17:00",
      purpose: "Meeting",
      host: "Michael Scott"
    },
    {
      id: 4,
      img: "/assets/images/bmsIcon.png",
      name: "Mark Spencer",
      email: "markspencer@example.com",
      role: "Visitor",
      contact: "5566778899",
      office: "Office 104",
      cnic: "45678-9012345-6",
      status: "active",
      validUntil: "2024-03-20 17:00",
      purpose: "Meeting",
      host: "Michael Scott"
    },
    {
      id: 5,
      img: "/assets/images/bmsIcon.png",
      name: "Tom Hanks",
      email: "tomhanks@example.com",
      role: "Visitor",
      contact: "6677889900",
      office: "Office 105",
      cnic: "56789-0123456-7",
      status: "active",
      validUntil: "2024-03-20 17:00",
      purpose: "Meeting",
      host: "Michael Scott"
    },
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionButton = ({ icon: Icon, label, onClick, color, disabled }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors duration-200 ${color} text-white font-medium ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </button>
  );

  // Filter handlers
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.cnic.includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && user.status === selectedFilter;
  });

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const nextPage = () => {
    if (currentPage * rowsPerPage < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const generateQRValue = (user) => {
    const qrData = {
      qrCodeData: user.cnic,
      name: user.name,
      cnic: user.cnic,
      role: user.role,
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(qrData);
  };

  const handlePrint = (user) => {
    const printWindow = window.open("", "", "height=400,width=800");
    printWindow.document.write("<html><head><title>Print Token</title><style>");
    printWindow.document.write(
      "body { font-family: Arial, sans-serif; padding: 20px; }"
    );
    printWindow.document.write(
      ".card { width: 300px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); text-align: center; }"
    );
    printWindow.document.write(
      ".card h1 { font-size: 18px; font-weight: bold; margin-bottom: 20px; }"
    );
    printWindow.document.write(
      ".card p { margin: 5px 0; font-size: 14px; color: #555; }"
    );
    printWindow.document.write(
      ".card img { margin-top: 20px; width: 100px; height: 100px; border-radius: 50%; }"
    );
    printWindow.document.write(".qr-code { margin-top: 20px; }");
    printWindow.document.write("</style></head><body>");

    printWindow.document.write("<div class='card'>");
    printWindow.document.write("<h1>Visitor Access Token</h1>");
    printWindow.document.write(`<p><strong>Name:</strong> ${user.name}</p>`);
    printWindow.document.write(`<p><strong>Email:</strong> ${user.email}</p>`);
    printWindow.document.write(`<p><strong>Role:</strong> ${user.role}</p>`);
    printWindow.document.write(`<p><strong>Contact:</strong> ${user.contact}</p>`);
    printWindow.document.write(`<p><strong>Office:</strong> ${user.office}</p>`);
    printWindow.document.write(`<p><strong>CNIC:</strong> ${user.cnic}</p>`);

    // Create QR code in the hidden div
    const qrValue = generateQRValue(user);
    const qrDiv = qrCodeRef.current;
    qrDiv.innerHTML = ''; // Clear previous QR code
    
    // Create a new div for React to render into
    const container = document.createElement('div');
    qrDiv.appendChild(container);
    
    // Create root and render QR code
    const root = createRoot(container);
    root.render(<QRCode value={qrValue} size={128} />);

    // Wait for QR code to render then add to print window
    setTimeout(() => {
      const qrCodeSVG = qrDiv.querySelector("svg");
      if (qrCodeSVG) {
        printWindow.document.write("<div class='qr-code'>");
        printWindow.document.write(qrCodeSVG.outerHTML);
        printWindow.document.write("</div>");
      }
      printWindow.document.write("</div>");
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
      
      // Cleanup
      root.unmount();
      qrDiv.innerHTML = '';
    }, 500);
  };

  // Bulk actions handlers
  const handleSelectAll = () => {
    if (selectedVisitors.length === currentUsers.length) {
      setSelectedVisitors([]);
    } else {
      setSelectedVisitors(currentUsers.map(user => user.id));
    }
  };

  const handleSelectVisitor = (userId) => {
    if (selectedVisitors.includes(userId)) {
      setSelectedVisitors(selectedVisitors.filter(id => id !== userId));
    } else {
      setSelectedVisitors([...selectedVisitors, userId]);
    }
  };

  const handleBulkPrint = () => {
    const selectedUsers = users.filter(user => selectedVisitors.includes(user.id));
    selectedUsers.forEach(user => handlePrint(user));
    setSelectedVisitors([]);
  };

  const handleBulkExport = () => {
    const selectedData = users
      .filter(user => selectedVisitors.includes(user.id))
      .map(({ name, email, cnic, role, contact, office, status, validUntil }) => ({
        name, email, cnic, role, contact, office, status, validUntil
      }));

    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(selectedData[0]).join(",") + "\n" +
      selectedData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "visitors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSelectedVisitors([]);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'active':
          return isDarkMode 
            ? 'bg-green-900 text-green-300' 
            : 'bg-green-100 text-green-800';
        case 'pending':
          return isDarkMode 
            ? 'bg-yellow-900 text-yellow-300' 
            : 'bg-yellow-100 text-yellow-800';
        default:
          return isDarkMode 
            ? 'bg-gray-900 text-gray-300' 
            : 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="relative flex-1 transition-all duration-200">
      <div className={`p-4 lg:p-6 min-h-screen w-full overflow-x-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Visitor Management
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Generate QR codes and manage visitor access
          </p>
        </div>

        {/* Statistics Grid - More responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          <StatCard
            title="Total Visitors"
            value={stats.totalVisitors}
            icon={FaUserPlus}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Visitors"
            value={stats.activeVisitors}
            icon={FaUserCheck}
            color="bg-green-500"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={FaHistory}
            color="bg-yellow-500"
          />
          <StatCard
            title="Denied Access"
            value={stats.deniedAccess}
            icon={FaExclamationTriangle}
            color="bg-red-500"
          />
        </div>

        {/* Actions and Search - Better mobile layout */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <QuickActionButton
              icon={FaQrcode}
              label="Bulk Generate QR"
              onClick={handleBulkPrint}
              color="bg-purple-500 hover:bg-purple-600"
              disabled={selectedVisitors.length === 0}
            />
            <QuickActionButton
              icon={FaChartBar}
              label="Export Selected"
              onClick={handleBulkExport}
              color="bg-indigo-500 hover:bg-indigo-600"
              disabled={selectedVisitors.length === 0}
            />
          </div>
          
          <div className="w-full sm:w-auto max-w-sm">
        <input
          type="text"
              className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Search by name, email, or CNIC"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
          </div>
        </div>

        {/* Filters - Better spacing on mobile */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-2 text-sm sm:px-4 sm:py-2 rounded-lg transition-colors duration-200 ${
              selectedFilter === "all"
                ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("active")}
            className={`px-3 py-2 text-sm sm:px-4 sm:py-2 rounded-lg transition-colors duration-200 ${
              selectedFilter === "active"
                ? isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
            }`}
          >
            Active
          </button>
        <button
            onClick={() => handleFilterChange("pending")}
            className={`px-3 py-2 text-sm sm:px-4 sm:py-2 rounded-lg transition-colors duration-200 ${
              selectedFilter === "pending"
                ? isDarkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white'
                : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
            }`}
          >
            Pending
        </button>
      </div>

        {/* Responsive Grid Container for all devices */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
          {/* Header */}
          <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                className="w-4 h-4 rounded"
                checked={selectedVisitors.length === currentUsers.length}
                onChange={handleSelectAll}
              />
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 text-xs font-medium uppercase">
                <div>Visitor Info</div>
                <div className="hidden lg:block">Contact</div>
                <div className="hidden sm:block">Office</div>
                <div className="hidden xl:block">CNIC</div>
                <div className="hidden lg:block">Status</div>
                <div className="text-right">Action</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 transition-colors duration-150 ${
                  isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      checked={selectedVisitors.includes(user.id)}
                      onChange={() => handleSelectVisitor(user.id)}
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-center">
                    {/* Visitor Info */}
                    <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={user.img}
                    alt={user.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                        <div className="lg:hidden mt-1">
                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    </div>

                    {/* Contact Info - Hidden on mobile */}
                    <div className="hidden lg:block min-w-0">
                      <div className="text-sm truncate">{user.contact}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.role}</div>
                    </div>

                    {/* Office - Hidden on mobile */}
                    <div className="hidden sm:block min-w-0">
                      <div className="text-sm truncate">{user.office}</div>
                    </div>

                    {/* CNIC - Hidden on smaller screens */}
                    <div className="hidden xl:block min-w-0">
                      <div className="text-sm font-mono truncate">{user.cnic}</div>
                    </div>

                    {/* Status - Hidden on mobile */}
                    <div className="hidden lg:flex items-center">
                      <StatusBadge status={user.status} />
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                  <button
                    onClick={() => handlePrint(user)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                  >
                        <FaPrint className="w-4 h-4" />
                        <span className="hidden sm:inline">Print QR</span>
                  </button>
                    </div>

                    {/* Mobile-only info */}
                    <div className="col-span-2 sm:col-span-3 lg:hidden grid grid-cols-2 gap-2 text-sm mt-2">
                      <div className="sm:hidden">
                        <span className="text-gray-500 dark:text-gray-400">Role:</span>
                        <span className="ml-2">{user.role}</span>
                      </div>
                      <div className="sm:hidden">
                        <span className="text-gray-500 dark:text-gray-400">Contact:</span>
                        <span className="ml-2">{user.contact}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">CNIC:</span>
                        <span className="ml-2 font-mono">{user.cnic}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

        {/* Pagination - Better mobile layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} order-2 sm:order-1`}>
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredUsers.length)} to {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
          </p>
          
          <div className="flex gap-2 sm:gap-4 order-1 sm:order-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
              className={`px-3 py-2 sm:px-4 sm:py-2 text-sm rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-white disabled:bg-gray-700 disabled:text-gray-500'
                  : 'bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400'
              }`}
        >
              Previous
        </button>
            <span className={`px-3 py-2 sm:px-4 sm:py-2 text-sm rounded-lg ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
            }`}>
          Page {currentPage}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage * rowsPerPage >= filteredUsers.length}
              className={`px-3 py-2 sm:px-4 sm:py-2 text-sm rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-white disabled:bg-gray-700 disabled:text-gray-500'
                  : 'bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400'
              }`}
        >
          Next
        </button>
          </div>
      </div>

        <div ref={qrCodeRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default VisitorPage;
