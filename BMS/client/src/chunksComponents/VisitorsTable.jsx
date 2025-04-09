import React, { useEffect, useState } from 'react'
import { memo } from 'react'
import "flowbite"
import { useDispatch, useSelector } from 'react-redux';
import { getOfficeThunk } from '../store/thunks/office.thunk';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateVisitorThunk } from '../store/thunks/visitor.thunk';
import { FaEdit, FaChevronLeft, FaChevronRight, FaTimes, FaPrint } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import moment from 'moment';

const VisitorsTable = ({ visitors, page, setPage }) => {
    const location = useLocation();
    const pathname = location?.pathname?.split("/")[1];
    const pathName2 = location?.pathname?.split("/")[0];
    console.log("location", pathname);
    const [isOpen, setIsOpen] = useState(false);
    const [visitorData, setVisitorData] = useState({
        name: "",
        cnicNumber: "",
        phoneNumber: "",
        office: "",
        status: "",
        purpose: "",
    });
    const dispatch = useDispatch();
    const { office } = useSelector((state) => state.office);
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false)
        if(pathName2 === "admin-panel"){
         navigate("/admin-panel/all-visitors");
         return 
        }
        if(pathname === "manager-panel") {
            navigate("/manager-panel/appointments");
            return 
        }
    };

    useEffect(() => {
        dispatch(getOfficeThunk());
    }, []);

    const editHandler = (visitor) => {
        setVisitorData({
            id: visitor._id,
            name: visitor.name,
            cnicNumber: visitor.cnicNumber,
            phoneNumber: visitor.contact,
            office: visitor.office,
            status: visitor.status,
            purpose: visitor.purpose
        });
        openModal();
        if(pathName2 === "admin-panel") {
         navigate(`/admin-panel/all-visitors?id=${visitor._id}`);
         return
        }

        if(pathname === "manager-panel") {
            navigate(`/manager-panel/appointments?id=${visitor._id}`);
            return 
        }
    };

    const updateVisitor = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateVisitorThunk(visitorData));
            setVisitorData({
                name: "",
                cnicNumber: "",
                phoneNumber: "",
                office: "",
                status: "",
                purpose: "",
            });
            closeModal();
        } catch (error) {
            closeModal();
            toast.error('Failed to update visitor');
        }
    };

    const nextPageHandle = () => {
        setPage({ ...page, currentPage: page.currentPage + 1 });
    };

    const prevPageHandle = () => {
        setPage({ ...page, currentPage: page.currentPage - 1 });
    };

    const getStatusColor = (status) => {
        if (isDarkMode) {
            switch (status) {
                case 'Approved':
                    return 'bg-green-900/30 text-green-300';
                case 'Pending':
                    return 'bg-yellow-900/30 text-yellow-300';
                case 'Rejected':
                    return 'bg-red-900/30 text-red-300';
                default:
                    return 'bg-gray-900/30 text-gray-300';
            }
        } else {
            switch (status) {
                case 'Approved':
                    return 'bg-green-100 text-green-800';
                case 'Pending':
                    return 'bg-yellow-100 text-yellow-800';
                case 'Rejected':
                    return 'bg-red-100 text-red-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        }
    };

    const generateQRValue = (visitor) => {
        // The verification system is looking for either qrCodeData or cnic
        console.log("visitor", visitor);
        return JSON.stringify({
            qrCodeData: visitor.token,
            cnic: visitor.cnicNumber,
            name: visitor.name
        });
    };
    // Printer Button
    const printQRCode = (visitor) => {
        const qrCodeElement = document.getElementById(`qr-code-${visitor._id}`);
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
                    <h3>Mr. ${visitor.name}</h3>
                    <p><strong>CNIC:</strong> ${visitor.cnicNumber}</p>
                    <p><strong>Duration:</strong> ${visitor.duration || 'Not specified'}</p>
                    <p><strong>Destination:</strong> ${visitor.office.officeName || 'Not specified'}</p>
                    <p><strong>Purpose:</strong> ${visitor.purpose || 'Not specified'}</p>
                    <p><strong>Host:</strong> ${visitor.host || 'Not specified'}</p>
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
            // toast.info("Printing Visitor Pass");
        });
    };




    return (
        <div className="w-full overflow-x-hidden relative mb-2">
            {/* Mobile View */}
            <div className="block sm:hidden px-2 w-screen max-w-full -mx-2">
                <div className="w-full space-y-1.5">
                    {visitors?.visitors?.map((visitor) => (
                        <div key={visitor._id} className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow-sm p-2 w-full`}>
                            <div className="flex items-start gap-2 w-full">
                                <img

                                    className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                                    src={visitor.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                    alt={visitor.name}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate max-w-[200px]`}>
                                            {visitor.name}
                                        </p>
                                    </div>
                                    <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1 truncate`}>Token: {visitor.token}</p>
                                    <div className="flex flex-col gap-y-0.5 text-[11px]">
                                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} grid grid-cols-[4.5rem,1fr]`}>
                                            <span className="font-medium">CNIC:</span>
                                            <span className="truncate">{visitor.cnicNumber}</span>
                                        </div>
                                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} grid grid-cols-[4.5rem,1fr]`}>
                                            <span className="font-medium">Contact:</span>
                                            <span className="truncate">{visitor.contact}</span>
                                        </div>
                                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} grid grid-cols-[4.5rem,1fr]`}>
                                            <span className="font-medium">Office:</span>
                                            <span className="truncate">{visitor.office.officeName}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(visitor.status)}`}>
                                                {visitor.status}
                                            </span>
                                            <button
                                                onClick={() => editHandler(visitor)}
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${isDarkMode
                                                    ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                    }`}
                                            >
                                                <FaEdit className="h-2.5 w-2.5 mr-1" />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto ">
                <div className="relative min-w-full">
                    <table className={`w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                            <tr>
                                <th scope="col" className={`w-1/3 px-1.5 py-2.5 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Visitor
                                </th>
                                <th scope="col" className={`w-1/4 px-1.5 py-2.5 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    CNIC Number
                                </th>
                                <th scope="col" className={`hidden md:table-cell w-1/6 px-1.5 py-2.5 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Contact
                                </th>
                                <th scope="col" className={`hidden lg:table-cell w-1/6 px-1.5 py-2.5 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Office
                                </th>
                                <th scope="col" className={`w-1/6 px-1.5 py-2.5 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Status
                                </th>
                                <th scope="col" className={`w-[40px] px-1.5 py-2.5 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${isDarkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                            {visitors?.visitors?.map((visitor) => (
                                <tr key={visitor._id} className={isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                                    <td className="px-1.5 py-2.5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {
                                              pathname === 'security-panel' &&  <div id={`qr-code-${visitor._id}`} className="bg-white p-2 rounded-lg">
                                                <QRCode
                                                    className="bg-white p-2 rounded-lg"
                                                    value={generateQRValue(visitor)}
                                                    size={120}
                                                    level="H"
                                                />
                                            </div>}
                                            <div className="flex-shrink-0 h-7 w-7">
                                                <img className="h-7 w-7 rounded-full object-cover"
                                                    src={visitor.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                    alt={visitor.name}
                                                />
                                            </div>
                                            <div className="ml-2">
                                                <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{visitor.name}</div>
                                                <div className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Token: {visitor.token}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-1.5 py-2.5 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{visitor.cnicNumber}</td>
                                    <td className={`hidden md:table-cell px-1.5 py-2.5 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{visitor.contact}</td>
                                    <td className={`hidden lg:table-cell px-1.5 py-2.5 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{visitor.office.officeName}</td>
                                    <td className="px-1.5 py-2.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(visitor.status)}`}>
                                            {visitor.status}
                                        </span>
                                    </td>
                                    <td className="px-1.5 py-2.5 text-right text-xs font-medium">
                                        {pathname === "security-panel" ?
                                            (<div>
                                                <button
                                                    onClick={() => printQRCode(visitor)}
                                                    className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm flex-1"
                                                >
                                                    <FaPrint size={12} />
                                                    <span>Print Pass</span>
                                                </button>
                                            </div>)
                                            :
                                            (<button
                                                onClick={() => editHandler(visitor)}
                                                className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                                            >
                                                <FaEdit className="h-3.5 w-3.5" />
                                                <span className="sr-only">Edit</span>
                                            </button>)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Pagination */}
            <div className="mt-4 sm:hidden px-2">
                <nav className="flex items-center justify-between w-full">
                    <button
                        onClick={prevPageHandle}
                        disabled={page.currentPage === 1}
                        className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed border ${isDarkMode
                            ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <FaChevronLeft className="h-3.5 w-3.5 mr-1" />
                        Prev
                    </button>
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {page.currentPage} / {visitors?.pagination?.totalPages || 1}
                    </span>
                    <button
                        onClick={nextPageHandle}
                        disabled={page.currentPage === (visitors?.pagination?.totalPages || 1)}
                        className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed border ${isDarkMode
                            ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Next
                        <FaChevronRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                </nav>
            </div>

            {/* Desktop Pagination */}
            <div className="hidden sm:flex sm:items-center sm:justify-between mt-4 px-3">
                <div className="flex-1 flex items-center justify-between">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Page <span className="font-medium">{page.currentPage}</span> of{' '}
                        <span className="font-medium">{visitors?.pagination?.totalPages || 1}</span>
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
                        {[...Array(visitors?.pagination?.totalPages || 1)].map((_, index) => (
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
                            disabled={page.currentPage === (visitors?.pagination?.totalPages || 1)}
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

            {/* Edit Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                            <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} id="modal-title">
                                                Edit Visitor
                                            </h3>
                                            <button
                                                onClick={closeModal}
                                                className={`rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                            >
                                                <FaTimes className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <form onSubmit={updateVisitor} className="space-y-4">
                                            <div className='flex flex-col'>
                                                <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={visitorData.name}
                                                    onChange={(e) => setVisitorData({ ...visitorData, name: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cnic" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    CNIC Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="cnic"
                                                    value={visitorData.cnicNumber}
                                                    onChange={(e) => setVisitorData({ ...visitorData, cnicNumber: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    value={visitorData.phoneNumber}
                                                    onChange={(e) => setVisitorData({ ...visitorData, phoneNumber: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="office" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Office
                                                </label>
                                                <select
                                                    id="office"
                                                    value={visitorData.office}
                                                    onChange={(e) => setVisitorData({ ...visitorData, office: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                >
                                                    <option value="">Select Office</option>
                                                    {office?.map((off) => (
                                                        <option key={off._id} value={off._id}>
                                                            {off.officeName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="status" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Status
                                                </label>
                                                <select
                                                    id="status"
                                                    value={visitorData.status}
                                                    onChange={(e) => setVisitorData({ ...visitorData, status: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="purpose" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Purpose
                                                </label>
                                                <textarea
                                                    id="purpose"
                                                    rows="3"
                                                    value={visitorData.purpose}
                                                    onChange={(e) => setVisitorData({ ...visitorData, purpose: e.target.value })}
                                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                ></textarea>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50'}`}>
                                <button
                                    type="button"
                                    onClick={updateVisitor}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode
                                        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                        }`}
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={`mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode
                                        ? 'border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitorsTable;